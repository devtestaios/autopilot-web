import { NextRequest, NextResponse } from 'next/server';

// Define the structure for chat messages
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  userId?: string;
}

// Simple AI response simulation
const generateAIResponse = (message: string): string => {
  const responses = [
    "I understand you'd like help with that. Let me analyze your request and provide some insights.",
    "Based on your message, I can offer several suggestions to improve your campaign performance.",
    "That's a great question! Here are some AI-powered recommendations for your marketing strategy.",
    "I've processed your request and identified some opportunities for optimization.",
    "Let me help you with that. Based on current market trends, I recommend the following approach."
  ];
  
  // Simple keyword-based responses
  if (message.toLowerCase().includes('campaign')) {
    return "I can help you create and optimize campaigns. Would you like me to analyze your current performance or suggest new campaign strategies?";
  }
  
  if (message.toLowerCase().includes('analytics') || message.toLowerCase().includes('performance')) {
    return "I'll analyze your performance metrics. Based on the data, I can identify trends and suggest optimization opportunities for better ROI.";
  }
  
  if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('cost')) {
    return "Let me help optimize your budget allocation. I can analyze spend efficiency and recommend budget adjustments for maximum impact.";
  }
  
  // Default response
  return responses[Math.floor(Math.random() * responses.length)];
};

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history = [], userId } = body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate AI response
    const aiResponse = generateAIResponse(message);

    // Create response object
    const response = {
      message: aiResponse,
      timestamp: new Date().toISOString(),
      conversationId: userId || 'anonymous',
      suggestions: [
        'Create new campaign',
        'Analyze performance',
        'Optimize budget',
        'View analytics'
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'active',
    service: 'AI Chat API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}