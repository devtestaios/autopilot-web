// AI API Helper Functions for PulseBridge.ai
// Handles all AI-related API calls to the backend

const AI_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api.onrender.com';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIChatRequest {
  message: string;
  context?: Record<string, any>;
  conversation_history?: AIMessage[];
  page?: string;
}

export interface AIChatResponse {
  response: string;
  actions?: Array<{
    type: string;
    parameters?: Record<string, any>;
    description?: string;
  }>;
  suggestions?: string[];
  context_updates?: Record<string, any>;
}

export interface AIActionRequest {
  type: string;
  parameters?: Record<string, any>;
}

export interface AIActionResponse {
  success: boolean;
  result?: any;
  message?: string;
  error?: string;
}

/**
 * Send a chat message to the AI and get a response
 */
export async function chatWithAI(request: AIChatRequest): Promise<AIChatResponse> {
  try {
    const response = await fetch(`${AI_API_BASE}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`AI chat failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback response for development/errors
    return {
      response: "I'm experiencing connection issues right now. Please try again in a moment.",
      actions: [],
      suggestions: ["Check your internet connection", "Refresh the page"]
    };
  }
}

/**
 * Execute an AI-requested action
 */
export async function executeAIAction(request: AIActionRequest): Promise<AIActionResponse> {
  try {
    const response = await fetch(`${AI_API_BASE}/api/v1/ai/execute-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`AI action failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Action Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check AI service health
 */
export async function checkAIHealth(): Promise<{
  healthy: boolean;
  provider?: string;
  configured?: boolean;
}> {
  try {
    const response = await fetch(`${AI_API_BASE}/health`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return { healthy: false };
    }

    const data = await response.json();
    return {
      healthy: data.status === 'healthy',
      provider: data.ai_services?.preferred_provider,
      configured: data.ai_services?.claude_configured || data.ai_services?.openai_configured
    };
  } catch (error) {
    console.error('AI Health Check Error:', error);
    return { healthy: false };
  }
}

/**
 * Get AI service status
 */
export async function getAIStatus(): Promise<{
  provider: string;
  configured: boolean;
  healthy: boolean;
  capabilities?: string[];
}> {
  try {
    const response = await fetch(`${AI_API_BASE}/api/v1/ai/status`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Status Error:', error);
    return {
      provider: 'unknown',
      configured: false,
      healthy: false
    };
  }
}

/**
 * Utility function to simulate AI chat for development
 */
export function createMockAIResponse(message: string, page?: string): AIChatResponse {
  const responses = [
    {
      condition: (msg: string) => msg.toLowerCase().includes('campaign'),
      response: "I'd be happy to help you with campaign management! I can create, optimize, or analyze your campaigns.",
      actions: [
        { type: 'create_campaign', description: 'Create a new campaign' },
        { type: 'optimize_campaigns', description: 'Optimize existing campaigns' }
      ],
      suggestions: ['Create a new Google Ads campaign', 'Show campaign performance', 'Optimize budget allocation']
    },
    {
      condition: (msg: string) => msg.toLowerCase().includes('navigate') || msg.toLowerCase().includes('go to'),
      response: "I can help you navigate to different sections of PulseBridge.ai. Where would you like to go?",
      actions: [
        { type: 'navigate', parameters: { page: 'campaigns' }, description: 'Go to campaigns' },
        { type: 'navigate', parameters: { page: 'analytics' }, description: 'Go to analytics' }
      ],
      suggestions: ['Go to campaigns', 'View analytics', 'Check performance']
    },
    {
      condition: (msg: string) => msg.toLowerCase().includes('hello') || msg.toLowerCase().includes('hi'),
      response: "Hello! I'm your AI assistant for PulseBridge.ai. I can help you manage campaigns, analyze performance, and optimize your marketing operations. What would you like to do?",
      actions: [],
      suggestions: ['Create a new campaign', 'Show me performance insights', 'Navigate to analytics']
    }
  ];

  const matchedResponse = responses.find(r => r.condition(message));
  
  if (matchedResponse) {
    return {
      response: matchedResponse.response,
      actions: matchedResponse.actions,
      suggestions: matchedResponse.suggestions
    };
  }

  return {
    response: "I'm here to help with PulseBridge.ai! I can assist with campaign management, performance analysis, and platform navigation. What would you like me to help you with?",
    actions: [],
    suggestions: ['Create campaign', 'View analytics', 'Get insights']
  };
}