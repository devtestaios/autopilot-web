'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// UNIFIED AI TYPES - Consolidating interfaces from both contexts
// ============================================================================

interface AICapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'optimization' | 'analytics' | 'automation' | 'insights' | 'control';
  permissions?: string[];
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  actionable: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
  timestamp: Date;
}

interface AIChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  context?: {
    page: string;
    data?: any;
  };
}

interface AIAction {
  id: string;
  type: 'campaign_action' | 'navigation' | 'optimization' | 'analysis' | 'ui_control';
  function: string;
  arguments: any;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  human_approval_required?: boolean;
}

interface AIProvider {
  id: 'claude' | 'openai' | 'mock';
  name: string;
  available: boolean;
  preferred: boolean;
}

// ============================================================================
// UNIFIED AI CONTEXT INTERFACE
// ============================================================================

interface UnifiedAIContextValue {
  // ========== CORE AI STATE ==========
  aiEnabled: boolean;
  autonomousMode: boolean;
  humanApprovalRequired: boolean;
  aiStatus: 'active' | 'idle' | 'processing' | 'error';
  lastAIActivity: Date | null;
  
  // ========== CHAT SYSTEM ==========
  messages: AIChatMessage[];
  isTyping: boolean;
  chatEnabled: boolean;
  sendMessage: (content: string, context?: any) => Promise<void>;
  
  // ========== AI CAPABILITIES ==========
  capabilities: AICapability[];
  enabledCapabilities: string[];
  toggleCapability: (capabilityId: string) => void;
  grantAIPermission: (permission: string) => void;
  revokeAIPermission: (permission: string) => void;
  
  // ========== AI INSIGHTS & RECOMMENDATIONS ==========
  insights: AIInsight[];
  recommendations: string[];
  addInsight: (insight: Omit<AIInsight, 'id' | 'timestamp'>) => void;
  generatePageInsights: (page: string, data?: any) => Promise<AIInsight[]>;
  
  // ========== AI ACTIONS & CONTROL ==========
  executeAIAction: (action: Omit<AIAction, 'id' | 'timestamp' | 'status'>) => Promise<any>;
  pendingActions: AIAction[];
  actionHistory: AIAction[];
  
  // ========== PLATFORM CONTROL ==========
  navigateToPage: (page: string) => void;
  controlDashboard: (action: string, params?: any) => void;
  manageCampaigns: (action: string, campaignId?: string, params?: any) => Promise<any>;
  optimizeCampaign: (campaignId: string) => Promise<void>;
  analyzeBudget: () => Promise<string[]>;
  getCampaignSuggestions: (campaignData: any) => string[];
  
  // ========== AI SETTINGS ==========
  autoOptimization: boolean;
  insightNotifications: boolean;
  smartSuggestions: boolean;
  toggleAutonomousMode: () => void;
  updateSettings: (settings: Partial<{
    autoOptimization: boolean;
    insightNotifications: boolean;
    smartSuggestions: boolean;
    autonomousMode: boolean;
    humanApprovalRequired: boolean;
  }>) => void;
  
  // ========== PROVIDER MANAGEMENT ==========
  providers: AIProvider[];
  currentProvider: AIProvider;
  switchProvider: (providerId: string) => void;
  
  // ========== NOTIFICATIONS ==========
  showNotification: (title: string, description: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

// ============================================================================
// UNIFIED AI CONTEXT
// ============================================================================

const UnifiedAIContext = createContext<UnifiedAIContextValue | undefined>(undefined);

// ============================================================================
// DEFAULT CAPABILITIES - Merged from both contexts
// ============================================================================

const unifiedCapabilities: AICapability[] = [
  // Campaign Management & Control
  {
    id: 'campaign-crud',
    name: 'Campaign Management',
    description: 'Create, read, update, and delete campaigns autonomously',
    enabled: true,
    category: 'control',
    permissions: ['campaigns:create', 'campaigns:update', 'campaigns:delete', 'campaigns:read']
  },
  {
    id: 'budget-control',
    name: 'Budget Management',
    description: 'Modify campaign budgets and spending limits',
    enabled: true,
    category: 'control',
    permissions: ['budget:modify', 'budget:allocate', 'budget:limits']
  },
  
  // Optimization Features
  {
    id: 'campaign-optimization',
    name: 'Campaign Optimization',
    description: 'Automatically optimize campaigns based on performance data',
    enabled: true,
    category: 'optimization'
  },
  {
    id: 'optimization-engine',
    name: 'Auto-Optimization',
    description: 'Automatically optimize campaigns based on performance',
    enabled: true,
    category: 'optimization',
    permissions: ['optimization:execute', 'optimization:configure']
  },
  {
    id: 'ad-copy-optimization',
    name: 'Ad Copy Optimization',
    description: 'Generate and test optimized ad copy variations',
    enabled: false,
    category: 'optimization'
  },
  
  // Analytics & Insights
  {
    id: 'performance-analysis',
    name: 'Performance Analysis',
    description: 'Analyze campaign performance and identify trends',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    description: 'Forecast campaign performance and trends',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'audience-insights',
    name: 'Audience Insights',
    description: 'AI-generated audience behavior and targeting insights',
    enabled: true,
    category: 'insights'
  },
  {
    id: 'keyword-discovery',
    name: 'Keyword Discovery',
    description: 'AI-powered keyword research and suggestions',
    enabled: true,
    category: 'insights'
  },
  
  // Automation Features
  {
    id: 'automated-bidding',
    name: 'Automated Bidding',
    description: 'Smart bid adjustments based on performance patterns',
    enabled: false,
    category: 'automation'
  },
  {
    id: 'smart-recommendations',
    name: 'Smart Recommendations',
    description: 'AI-powered campaign and optimization recommendations',
    enabled: true,
    category: 'insights'
  },
  
  // Platform Navigation & Control
  {
    id: 'platform-navigation',
    name: 'Platform Navigation',
    description: 'Navigate and control the platform interface',
    enabled: true,
    category: 'control',
    permissions: ['navigation:execute', 'ui:control']
  },
  {
    id: 'dashboard-control',
    name: 'Dashboard Control',
    description: 'Modify and control dashboard layouts and widgets',
    enabled: true,
    category: 'control',
    permissions: ['dashboard:modify', 'widgets:control']
  }
];

// ============================================================================
// DEFAULT AI PROVIDERS
// ============================================================================

const defaultProviders: AIProvider[] = [
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    available: true,
    preferred: true
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    available: true,
    preferred: false
  },
  {
    id: 'mock',
    name: 'Mock Provider (Development)',
    available: true,
    preferred: false
  }
];

// ============================================================================
// UNIFIED AI PROVIDER COMPONENT
// ============================================================================

export function UnifiedAIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // ========== CORE STATE ==========
  const [aiEnabled, setAIEnabled] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [humanApprovalRequired, setHumanApprovalRequired] = useState(true);
  const [aiStatus, setAIStatus] = useState<'active' | 'idle' | 'processing' | 'error'>('idle');
  const [lastAIActivity, setLastAIActivity] = useState<Date | null>(null);
  
  // ========== CHAT STATE ==========
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  
  // ========== CAPABILITIES & INSIGHTS ==========
  const [capabilities, setCapabilities] = useState<AICapability[]>(unifiedCapabilities);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  // ========== ACTIONS ==========
  const [pendingActions, setPendingActions] = useState<AIAction[]>([]);
  const [actionHistory, setActionHistory] = useState<AIAction[]>([]);
  
  // ========== SETTINGS ==========
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [insightNotifications, setInsightNotifications] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  
  // ========== PROVIDERS ==========
  const [providers, setProviders] = useState<AIProvider[]>(defaultProviders);
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(
    defaultProviders.find(p => p.preferred) || defaultProviders[0]
  );
  
  // ========== COMPUTED VALUES ==========
  const enabledCapabilities = capabilities.filter(cap => cap.enabled).map(cap => cap.id);
  
  // ========== PERSISTENCE ==========
  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('unified-ai-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAIEnabled(settings.aiEnabled ?? true);
      setAutonomousMode(settings.autonomousMode ?? false);
      setHumanApprovalRequired(settings.humanApprovalRequired ?? true);
      setAutoOptimization(settings.autoOptimization ?? false);
      setInsightNotifications(settings.insightNotifications ?? true);
      setSmartSuggestions(settings.smartSuggestions ?? true);
    }

    // Load saved capabilities
    const savedCapabilities = localStorage.getItem('unified-ai-capabilities');
    if (savedCapabilities) {
      setCapabilities(JSON.parse(savedCapabilities));
    }
    
    // Load saved provider preference
    const savedProvider = localStorage.getItem('unified-ai-provider');
    if (savedProvider) {
      const provider = providers.find(p => p.id === savedProvider);
      if (provider) setCurrentProvider(provider);
    }
  }, []);

  // Save settings when they change
  const saveSettings = useCallback(() => {
    localStorage.setItem('unified-ai-settings', JSON.stringify({
      aiEnabled,
      autonomousMode,
      humanApprovalRequired,
      autoOptimization,
      insightNotifications,
      smartSuggestions
    }));
    localStorage.setItem('unified-ai-capabilities', JSON.stringify(capabilities));
    localStorage.setItem('unified-ai-provider', currentProvider.id);
  }, [aiEnabled, autonomousMode, humanApprovalRequired, autoOptimization, insightNotifications, smartSuggestions, capabilities, currentProvider]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);
  
  // ========== AI CHAT FUNCTIONALITY ==========
  const sendMessage = useCallback(async (content: string, context?: any): Promise<void> => {
    if (!aiEnabled || !chatEnabled) return;
    
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      context
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setAIStatus('processing');
    setLastAIActivity(new Date());
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      
      const response = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          context: context || {},
          conversation_history: messages.slice(-10),
          page: context?.page || 'dashboard',
          provider: currentProvider.id
        })
      });
      
      if (response.ok) {
        const aiResponse = await response.json();
        
        const assistantMessage: AIChatMessage = {
          id: Date.now().toString(),
          content: aiResponse.response,
          role: 'assistant',
          timestamp: new Date(),
          context
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Handle any actions returned by the AI
        if (aiResponse.actions && aiResponse.actions.length > 0) {
          for (const action of aiResponse.actions) {
            await executeAIAction(action);
          }
        }
        
        setAIStatus('active');
      } else {
        throw new Error('AI API request failed');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback mock response
      const mockResponse: AIChatMessage = {
        id: Date.now().toString(),
        content: `I understand you said: "${content}". I'm currently working on processing your request. This is a fallback response while the AI service is being optimized.`,
        role: 'assistant',
        timestamp: new Date(),
        context
      };
      
      setMessages(prev => [...prev, mockResponse]);
      setAIStatus('error');
    } finally {
      setIsTyping(false);
    }
  }, [aiEnabled, chatEnabled, messages, currentProvider]);
  
  // ========== AI ACTIONS ==========
  const executeAIAction = useCallback(async (actionData: Omit<AIAction, 'id' | 'timestamp' | 'status'>): Promise<any> => {
    const action: AIAction = {
      ...actionData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending'
    };
    
    setPendingActions(prev => [...prev, action]);
    setLastAIActivity(new Date());
    
    // Check if human approval is required
    if (humanApprovalRequired && action.human_approval_required !== false) {
      showNotification(
        'AI Action Pending Approval',
        `Action "${action.function}" requires human approval`,
        'info'
      );
      return;
    }
    
    // Update action status
    setPendingActions(prev => prev.map(a => 
      a.id === action.id ? { ...a, status: 'executing' } : a
    ));
    
    try {
      let result;
      
      // Execute based on action type
      switch (action.type) {
        case 'navigation':
          navigateToPage(action.arguments.page);
          result = { success: true, page: action.arguments.page };
          break;
          
        case 'campaign_action':
          result = await manageCampaigns(action.function, action.arguments.campaignId, action.arguments);
          break;
          
        case 'optimization':
          if (action.function === 'optimize_campaign') {
            await optimizeCampaign(action.arguments.campaignId);
            result = { success: true, optimized: true };
          }
          break;
          
        case 'ui_control':
          controlDashboard(action.function, action.arguments);
          result = { success: true, action: action.function };
          break;
          
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
      
      // Update action as completed
      const completedAction = { ...action, status: 'completed' as const, result };
      setPendingActions(prev => prev.filter(a => a.id !== action.id));
      setActionHistory(prev => [...prev, completedAction]);
      
      showNotification(
        'AI Action Completed',
        `Successfully executed "${action.function}"`,
        'success'
      );
      
      return result;
    } catch (error) {
      // Update action as failed
      const errorMessage = error instanceof Error ? error.message : String(error);
      const failedAction = { ...action, status: 'failed' as const, result: { error: errorMessage } };
      setPendingActions(prev => prev.filter(a => a.id !== action.id));
      setActionHistory(prev => [...prev, failedAction]);
      
      showNotification(
        'AI Action Failed',
        `Failed to execute "${action.function}": ${errorMessage}`,
        'error'
      );
      
      throw error;
    }
  }, [humanApprovalRequired]);
  
  // ========== PLATFORM CONTROL ==========
  const navigateToPage = useCallback((page: string) => {
    router.push(`/${page}`);
    setLastAIActivity(new Date());
  }, [router]);
  
  const controlDashboard = useCallback((action: string, params?: any) => {
    console.log('Dashboard control:', action, params);
    setLastAIActivity(new Date());
    // Dashboard control logic would go here
  }, []);
  
  const manageCampaigns = useCallback(async (action: string, campaignId?: string, params?: any): Promise<any> => {
    console.log('Campaign management:', action, campaignId, params);
    setLastAIActivity(new Date());
    // Campaign management logic would go here
    return { success: true, action, campaignId };
  }, []);
  
  // ========== AI INSIGHTS ==========
  const addInsight = useCallback((insightData: Omit<AIInsight, 'id' | 'timestamp'>) => {
    const insight: AIInsight = {
      ...insightData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setInsights(prev => [...prev, insight]);
  }, []);
  
  const generatePageInsights = useCallback(async (page: string, data?: any): Promise<AIInsight[]> => {
    // Mock insights generation - would call AI service in production
    const mockInsights: AIInsight[] = [
      {
        id: Date.now().toString(),
        title: `AI Insight for ${page}`,
        description: 'Generated insight based on current page data',
        severity: 'medium',
        category: page,
        actionable: true,
        timestamp: new Date()
      }
    ];
    
    setInsights(prev => [...prev, ...mockInsights]);
    return mockInsights;
  }, []);
  
  // ========== OPTIMIZATION FUNCTIONS ==========
  const optimizeCampaign = useCallback(async (campaignId: string): Promise<void> => {
    console.log('Optimizing campaign:', campaignId);
    setLastAIActivity(new Date());
    // Optimization logic would go here
  }, []);
  
  const analyzeBudget = useCallback(async (): Promise<string[]> => {
    console.log('Analyzing budget');
    setLastAIActivity(new Date());
    return ['Budget analysis complete', 'Recommendations generated'];
  }, []);
  
  const getCampaignSuggestions = useCallback((campaignData: any): string[] => {
    console.log('Getting campaign suggestions for:', campaignData);
    setLastAIActivity(new Date());
    return ['Suggestion 1', 'Suggestion 2'];
  }, []);
  
  // ========== CAPABILITY MANAGEMENT ==========
  const toggleCapability = useCallback((capabilityId: string) => {
    setCapabilities(prev => prev.map(cap =>
      cap.id === capabilityId ? { ...cap, enabled: !cap.enabled } : cap
    ));
  }, []);
  
  const grantAIPermission = useCallback((permission: string) => {
    console.log('Granting AI permission:', permission);
    // Permission logic would go here
  }, []);
  
  const revokeAIPermission = useCallback((permission: string) => {
    console.log('Revoking AI permission:', permission);
    // Permission logic would go here
  }, []);
  
  // ========== SETTINGS ==========
  const toggleAutonomousMode = useCallback(() => {
    setAutonomousMode(prev => !prev);
    setHumanApprovalRequired(prev => !prev);
  }, []);
  
  const updateSettings = useCallback((settings: Partial<{
    autoOptimization: boolean;
    insightNotifications: boolean;
    smartSuggestions: boolean;
    autonomousMode: boolean;
    humanApprovalRequired: boolean;
  }>) => {
    if (settings.autoOptimization !== undefined) setAutoOptimization(settings.autoOptimization);
    if (settings.insightNotifications !== undefined) setInsightNotifications(settings.insightNotifications);
    if (settings.smartSuggestions !== undefined) setSmartSuggestions(settings.smartSuggestions);
    if (settings.autonomousMode !== undefined) setAutonomousMode(settings.autonomousMode);
    if (settings.humanApprovalRequired !== undefined) setHumanApprovalRequired(settings.humanApprovalRequired);
  }, []);
  
  // ========== PROVIDER MANAGEMENT ==========
  const switchProvider = useCallback((providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider && provider.available) {
      setCurrentProvider(provider);
      showNotification(
        'AI Provider Switched',
        `Now using ${provider.name}`,
        'info'
      );
    }
  }, [providers]);
  
  // ========== NOTIFICATIONS ==========
  const showNotification = useCallback((title: string, description: string, type: 'success' | 'error' | 'warning' | 'info') => {
    console.log(`[${type.toUpperCase()}] ${title}: ${description}`);
    
    // Browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: description });
    }
  }, []);
  
  // ========== CONTEXT VALUE ==========
  const value: UnifiedAIContextValue = {
    // Core AI State
    aiEnabled,
    autonomousMode,
    humanApprovalRequired,
    aiStatus,
    lastAIActivity,
    
    // Chat System
    messages,
    isTyping,
    chatEnabled,
    sendMessage,
    
    // AI Capabilities
    capabilities,
    enabledCapabilities,
    toggleCapability,
    grantAIPermission,
    revokeAIPermission,
    
    // AI Insights & Recommendations
    insights,
    recommendations,
    addInsight,
    generatePageInsights,
    
    // AI Actions & Control
    executeAIAction,
    pendingActions,
    actionHistory,
    
    // Platform Control
    navigateToPage,
    controlDashboard,
    manageCampaigns,
    optimizeCampaign,
    analyzeBudget,
    getCampaignSuggestions,
    
    // AI Settings
    autoOptimization,
    insightNotifications,
    smartSuggestions,
    toggleAutonomousMode,
    updateSettings,
    
    // Provider Management
    providers,
    currentProvider,
    switchProvider,
    
    // Notifications
    showNotification
  };
  
  return (
    <UnifiedAIContext.Provider value={value}>
      {children}
    </UnifiedAIContext.Provider>
  );
}

// ============================================================================
// UNIFIED AI HOOKS
// ============================================================================

export function useUnifiedAI(): UnifiedAIContextValue {
  const context = useContext(UnifiedAIContext);
  if (context === undefined) {
    throw new Error('useUnifiedAI must be used within a UnifiedAIProvider');
  }
  return context;
}

// Legacy hook aliases for backward compatibility
export const useAI = useUnifiedAI;
export const useAIControl = useUnifiedAI;
export const usePageAI = (page: string) => {
  const ai = useUnifiedAI();
  return {
    ...ai,
    sendContextualMessage: (message: string) => ai.sendMessage(message, { page })
  };
};

export default UnifiedAIContext;