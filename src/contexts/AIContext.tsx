'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AICapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'optimization' | 'analytics' | 'automation' | 'insights';
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

interface AIContextValue {
  // Chat state
  messages: AIChatMessage[];
  isTyping: boolean;
  chatEnabled: boolean;
  
  // AI capabilities
  capabilities: AICapability[];
  enabledCapabilities: string[];
  
  // Insights and recommendations
  insights: AIInsight[];
  recommendations: string[];
  
  // AI settings
  autoOptimization: boolean;
  insightNotifications: boolean;
  smartSuggestions: boolean;
  
  // Actions
  sendMessage: (content: string, context?: any) => Promise<void>;
  addInsight: (insight: Omit<AIInsight, 'id' | 'timestamp'>) => void;
  toggleCapability: (capabilityId: string) => void;
  generatePageInsights: (page: string, data?: any) => Promise<AIInsight[]>;
  optimizeCampaign: (campaignId: string) => Promise<void>;
  analyzeBudget: () => Promise<string[]>;
  getCampaignSuggestions: (campaignData: any) => string[];
  
  // Settings
  updateSettings: (settings: Partial<{
    autoOptimization: boolean;
    insightNotifications: boolean;
    smartSuggestions: boolean;
  }>) => void;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

const defaultCapabilities: AICapability[] = [
  {
    id: 'campaign-optimization',
    name: 'Campaign Optimization',
    description: 'Automatically optimize campaigns based on performance data',
    enabled: true,
    category: 'optimization'
  },
  {
    id: 'budget-allocation',
    name: 'Smart Budget Allocation',
    description: 'AI-powered budget distribution across campaigns',
    enabled: true,
    category: 'optimization'
  },
  {
    id: 'performance-analysis',
    name: 'Performance Analysis',
    description: 'Deep analysis of campaign metrics and trends',
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
    id: 'automated-bidding',
    name: 'Automated Bidding',
    description: 'Smart bid adjustments based on performance patterns',
    enabled: false,
    category: 'automation'
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    description: 'Forecast campaign performance and trends',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'keyword-discovery',
    name: 'Keyword Discovery',
    description: 'AI-powered keyword research and suggestions',
    enabled: true,
    category: 'insights'
  },
  {
    id: 'ad-copy-optimization',
    name: 'Ad Copy Optimization',
    description: 'Generate and test optimized ad copy variations',
    enabled: false,
    category: 'optimization'
  }
];

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [capabilities, setCapabilities] = useState<AICapability[]>(defaultCapabilities);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [insightNotifications, setInsightNotifications] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(true);

  const enabledCapabilities = capabilities.filter(cap => cap.enabled).map(cap => cap.id);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('ai-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoOptimization(settings.autoOptimization ?? false);
      setInsightNotifications(settings.insightNotifications ?? true);
      setSmartSuggestions(settings.smartSuggestions ?? true);
    }

    const savedCapabilities = localStorage.getItem('ai-capabilities');
    if (savedCapabilities) {
      setCapabilities(JSON.parse(savedCapabilities));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    localStorage.setItem('ai-settings', JSON.stringify({
      autoOptimization,
      insightNotifications,
      smartSuggestions
    }));
    localStorage.setItem('ai-capabilities', JSON.stringify(capabilities));
  }, [autoOptimization, insightNotifications, smartSuggestions, capabilities]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  const generateAIResponse = useCallback(async (userMessage: string, context?: any): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const input = userMessage.toLowerCase();
    
    // Context-aware responses based on current page/data
    if (context?.page === 'campaigns') {
      if (input.includes('optimize')) {
        return `🎯 **Campaign Optimization for ${context.page}**\n\nAnalyzing your campaigns... I found 3 optimization opportunities:\n\n• **Budget Reallocation**: Move $500 from Campaign A to Campaign B (+15% ROAS)\n• **Keyword Expansion**: Add 12 high-intent keywords\n• **Bid Adjustment**: Increase mobile bids by 20%\n\nShall I implement these changes?`;
      }
    } else if (context?.page === 'analytics') {
      return `📊 **Analytics Insights**\n\nBased on your current analytics data:\n\n• **Conversion Rate**: Up 12% this month\n• **Top Performer**: Search campaigns on mobile\n• **Opportunity**: Display campaigns need attention\n• **Prediction**: 25% growth potential with current trends`;
    }

    // General AI responses
    if (input.includes('optimize') || input.includes('performance')) {
      return "🎯 I can help optimize your campaigns! I've detected several improvement opportunities. Would you like me to analyze specific campaigns or provide general optimization recommendations?";
    } else if (input.includes('budget')) {
      return "💰 Let me analyze your budget allocation. Based on performance data, I can suggest optimal budget distribution across your campaigns. Should I run a budget optimization analysis?";
    } else if (input.includes('analytics') || input.includes('data')) {
      return "📊 I can provide detailed analytics insights. I've been monitoring your campaign performance and can identify trends, anomalies, and opportunities. What specific metrics would you like me to focus on?";
    }

    return "🤖 I'm here to help with your marketing campaigns! I can assist with optimization, analytics, budget allocation, and strategic planning. What would you like to work on?";
  }, []);

  const sendMessage = useCallback(async (content: string, context?: any) => {
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const responseContent = await generateAIResponse(content, context);
      
      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        context
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsTyping(false);
    }
  }, [generateAIResponse]);

  const addInsight = useCallback((insight: Omit<AIInsight, 'id' | 'timestamp'>) => {
    const newInsight: AIInsight = {
      ...insight,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setInsights(prev => [newInsight, ...prev.slice(0, 19)]); // Keep only 20 most recent
  }, []);

  const toggleCapability = useCallback((capabilityId: string) => {
    setCapabilities(prev => prev.map(cap => 
      cap.id === capabilityId ? { ...cap, enabled: !cap.enabled } : cap
    ));
  }, []);

  const generatePageInsights = useCallback(async (page: string, data?: any): Promise<AIInsight[]> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insights: AIInsight[] = [];

    if (page === 'dashboard') {
      insights.push({
        id: 'dashboard-1',
        title: 'Campaign Performance Alert',
        description: 'Campaign "Summer Sale" is underperforming by 23% vs target',
        severity: 'high',
        category: 'performance',
        actionable: true,
        actions: [
          { label: 'Optimize Now', action: () => console.log('Optimizing campaign...') }
        ],
        timestamp: new Date()
      });
    } else if (page === 'campaigns') {
      insights.push({
        id: 'campaigns-1',
        title: 'Budget Optimization Opportunity',
        description: 'Reallocating budget could increase ROAS by 18%',
        severity: 'medium',
        category: 'budget',
        actionable: true,
        timestamp: new Date()
      });
    }

    return insights;
  }, []);

  const optimizeCampaign = useCallback(async (campaignId: string) => {
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addInsight({
      title: 'Campaign Optimized',
      description: `Campaign ${campaignId} has been optimized with new bid strategies and keyword adjustments`,
      severity: 'low',
      category: 'optimization',
      actionable: false
    });
  }, [addInsight]);

  const analyzeBudget = useCallback(async (): Promise<string[]> => {
    // Simulate budget analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      'Increase search campaign budget by 25%',
      'Reduce display network spend by 15%',
      'Allocate more budget to mobile traffic',
      'Consider dayparting optimizations'
    ];
  }, []);

  const getCampaignSuggestions = useCallback((campaignData: any): string[] => {
    const suggestions: string[] = [];
    
    if (campaignData?.ctr < 2) {
      suggestions.push('Improve ad copy to increase CTR');
    }
    if (campaignData?.cpa > 50) {
      suggestions.push('Optimize bidding strategy to reduce CPA');
    }
    if (campaignData?.impressions < 1000) {
      suggestions.push('Expand keyword targeting to increase reach');
    }
    
    return suggestions;
  }, []);

  const updateSettings = useCallback((settings: Partial<{
    autoOptimization: boolean;
    insightNotifications: boolean;
    smartSuggestions: boolean;
  }>) => {
    if (settings.autoOptimization !== undefined) {
      setAutoOptimization(settings.autoOptimization);
    }
    if (settings.insightNotifications !== undefined) {
      setInsightNotifications(settings.insightNotifications);
    }
    if (settings.smartSuggestions !== undefined) {
      setSmartSuggestions(settings.smartSuggestions);
    }
  }, []);

  const value: AIContextValue = {
    messages,
    isTyping,
    chatEnabled,
    capabilities,
    enabledCapabilities,
    insights,
    recommendations,
    autoOptimization,
    insightNotifications,
    smartSuggestions,
    sendMessage,
    addInsight,
    toggleCapability,
    generatePageInsights,
    optimizeCampaign,
    analyzeBudget,
    getCampaignSuggestions,
    updateSettings
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

// Hook for page-specific AI features
export function usePageAI(page: string, data?: any) {
  const ai = useAI();
  
  const sendContextualMessage = useCallback((content: string) => {
    return ai.sendMessage(content, { page, data });
  }, [ai, page, data]);

  const generateInsights = useCallback(() => {
    return ai.generatePageInsights(page, data);
  }, [ai, page, data]);

  return {
    ...ai,
    sendContextualMessage,
    generateInsights
  };
}