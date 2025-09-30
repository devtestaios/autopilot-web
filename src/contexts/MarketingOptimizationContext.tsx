/**
 * Marketing Optimization Platform Context
 * Consolidates original PulseBridge.ai functionality into Master Terminal ecosystem
 * Features: Cross-platform campaigns, AI optimization, analytics, lead management
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useReducer, useRef, useEffect, useMemo } from 'react';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { toast } from 'sonner';

// ==================== TYPE DEFINITIONS ====================

export interface Campaign {
  id: string;
  name: string;
  platform: 'google_ads' | 'meta' | 'linkedin' | 'cross_platform';
  status: 'active' | 'paused' | 'ended' | 'draft';
  client_name: string;
  budget: number;
  spend: number;
  target_audience: {
    demographics: Record<string, any>;
    interests: string[];
    locations: string[];
    custom_audiences: string[];
  };
  
  // Performance Metrics
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number; // Click-through rate
    cpc: number; // Cost per click
    cpa: number; // Cost per acquisition
    roas: number; // Return on ad spend
    quality_score?: number;
  };
  
  // AI Optimization
  ai_optimization: {
    enabled: boolean;
    strategy: 'conservative' | 'balanced' | 'aggressive';
    auto_budget: boolean;
    auto_bidding: boolean;
    last_optimized?: Date;
    optimization_score: number; // 0-100
  };
  
  created_at: Date;
  updated_at: Date;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;
  campaign_id?: string;
  platform?: string;
  
  // Lead Scoring
  score: number; // 0-100
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'purchase';
  
  // Engagement Data
  engagement: {
    email_opened: boolean;
    link_clicked: boolean;
    form_submitted: boolean;
    page_views: number;
    time_on_site: number;
    last_activity?: Date;
  };
  
  // AI Insights
  ai_insights: {
    conversion_probability: number;
    recommended_actions: string[];
    best_contact_time?: Date;
    predicted_value: number;
  };
  
  created_at: Date;
  updated_at: Date;
}

export interface Alert {
  id: string;
  type: 'performance' | 'budget' | 'anomaly' | 'opportunity' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  campaign_id?: string;
  platform?: string;
  
  // Alert Data
  threshold_exceeded?: {
    metric: string;
    current_value: number;
    threshold: number;
  };
  
  // AI Recommendations
  ai_recommendation?: {
    action: string;
    expected_impact: string;
    confidence: number;
  };
  
  // Status
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  created_at: Date;
  resolved_at?: Date;
}

export interface OptimizationDecision {
  id: string;
  type: 'budget_allocation' | 'bid_adjustment' | 'audience_expansion' | 'creative_optimization';
  ai_system: 'pulsebridge_ai' | 'meta_ai' | 'google_ai' | 'hybrid';
  campaign_ids: string[];
  
  // Decision Details
  decision: {
    action: string;
    reasoning: string;
    confidence: number; // 0-1
    expected_improvement: Record<string, number>;
  };
  
  // Implementation
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
  auto_implement: boolean;
  implemented_at?: Date;
  
  // Results
  actual_results?: {
    metric_improvements: Record<string, number>;
    roi_impact: number;
  };
  
  created_at: Date;
}

export interface AnalyticsData {
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  // Overall Performance
  overview: {
    total_campaigns: number;
    total_spend: number;
    total_revenue: number;
    overall_roas: number;
    avg_cpc: number;
    avg_conversion_rate: number;
  };
  
  // Platform Breakdown
  platform_performance: Array<{
    platform: string;
    spend: number;
    revenue: number;
    roas: number;
    campaigns: number;
    leads: number;
  }>;
  
  // Trends
  performance_trends: Array<{
    date: string;
    spend: number;
    revenue: number;
    leads: number;
    roas: number;
  }>;
  
  // AI Insights
  ai_insights: {
    top_opportunities: Array<{
      opportunity: string;
      potential_impact: string;
      confidence: number;
    }>;
    recommendations: Array<{
      action: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
}

export interface MarketingOptimizationState {
  // Campaigns
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  
  // Leads
  leads: Lead[];
  leadFilters: {
    status: string[];
    source: string[];
    score_range: [number, number];
    date_range: string;
  };
  
  // Alerts
  alerts: Alert[];
  unreadAlerts: number;
  
  // Optimization
  optimizationDecisions: OptimizationDecision[];
  aiOptimization: {
    enabled: boolean;
    mode: 'conservative' | 'balanced' | 'aggressive';
    auto_approve_threshold: number; // Confidence threshold for auto-approval
    daily_budget_limit: number;
  };
  
  // Analytics
  analytics: AnalyticsData | null;
  
  // UI State
  loading: {
    campaigns: boolean;
    leads: boolean;
    alerts: boolean;
    analytics: boolean;
    optimization: boolean;
  };
  
  errors: {
    campaigns?: string;
    leads?: string;
    alerts?: string;
    analytics?: string;
    optimization?: string;
  };
  
  // Features
  features: {
    crossPlatformOptimization: boolean;
    aiAutomation: boolean;
    predictiveAnalytics: boolean;
    leadScoring: boolean;
    alertsSystem: boolean;
    hybridAI: boolean;
  };
}

// ==================== ACTION TYPES ====================

type MarketingOptimizationAction =
  | { type: 'SET_LOADING'; payload: { key: keyof MarketingOptimizationState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof MarketingOptimizationState['errors']; value: string | undefined } }
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: { id: string; updates: Partial<Campaign> } }
  | { type: 'SET_ACTIVE_CAMPAIGN'; payload: Campaign | null }
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: { id: string; updates: Partial<Lead> } }
  | { type: 'SET_ALERTS'; payload: Alert[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'UPDATE_ALERT'; payload: { id: string; updates: Partial<Alert> } }
  | { type: 'SET_OPTIMIZATION_DECISIONS'; payload: OptimizationDecision[] }
  | { type: 'ADD_OPTIMIZATION_DECISION'; payload: OptimizationDecision }
  | { type: 'UPDATE_AI_SETTINGS'; payload: Partial<MarketingOptimizationState['aiOptimization']> }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData }
  | { type: 'UPDATE_FEATURES'; payload: Partial<MarketingOptimizationState['features']> }
  | { type: 'RESET_STATE' };

// ==================== REDUCER ====================

const initialState: MarketingOptimizationState = {
  campaigns: [],
  activeCampaign: null,
  leads: [],
  leadFilters: {
    status: [],
    source: [],
    score_range: [0, 100],
    date_range: 'all'
  },
  alerts: [],
  unreadAlerts: 0,
  optimizationDecisions: [],
  aiOptimization: {
    enabled: true,
    mode: 'balanced',
    auto_approve_threshold: 0.8,
    daily_budget_limit: 1000
  },
  analytics: null,
  loading: {
    campaigns: false,
    leads: false,
    alerts: false,
    analytics: false,
    optimization: false
  },
  errors: {},
  features: {
    crossPlatformOptimization: true,
    aiAutomation: true,
    predictiveAnalytics: true,
    leadScoring: true,
    alertsSystem: true,
    hybridAI: true
  }
};

function marketingOptimizationReducer(
  state: MarketingOptimizationState, 
  action: MarketingOptimizationAction
): MarketingOptimizationState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };

    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };

    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [...state.campaigns, action.payload] };

    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.payload.id
            ? { ...campaign, ...action.payload.updates }
            : campaign
        ),
      };

    case 'SET_ACTIVE_CAMPAIGN':
      return { ...state, activeCampaign: action.payload };

    case 'SET_LEADS':
      return { ...state, leads: action.payload };

    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, action.payload] };

    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === action.payload.id
            ? { ...lead, ...action.payload.updates }
            : lead
        ),
      };

    case 'SET_ALERTS':
      return { 
        ...state, 
        alerts: action.payload,
        unreadAlerts: action.payload.filter(alert => alert.status === 'active').length
      };

    case 'ADD_ALERT':
      return { 
        ...state, 
        alerts: [...state.alerts, action.payload],
        unreadAlerts: state.unreadAlerts + (action.payload.status === 'active' ? 1 : 0)
      };

    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.updates }
            : alert
        ),
        unreadAlerts: state.alerts.filter(alert => 
          alert.status === 'active' && alert.id !== action.payload.id
        ).length + (action.payload.updates.status === 'active' ? 1 : 0)
      };

    case 'SET_OPTIMIZATION_DECISIONS':
      return { ...state, optimizationDecisions: action.payload };

    case 'ADD_OPTIMIZATION_DECISION':
      return { ...state, optimizationDecisions: [...state.optimizationDecisions, action.payload] };

    case 'UPDATE_AI_SETTINGS':
      return {
        ...state,
        aiOptimization: { ...state.aiOptimization, ...action.payload }
      };

    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };

    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: { ...state.features, ...action.payload }
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ==================== CONTEXT ====================

interface MarketingOptimizationContextType extends MarketingOptimizationState {
  // Campaign Management
  createCampaign: (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  setActiveCampaign: (campaign: Campaign | null) => void;
  optimizeCampaign: (campaignId: string) => Promise<void>;
  
  // Lead Management
  createLead: (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  scoreLeads: () => Promise<void>;
  
  // Alerts Management
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  createAlert: (alertData: Omit<Alert, 'id' | 'created_at'>) => Promise<void>;
  
  // Optimization
  triggerOptimization: () => Promise<void>;
  approveOptimization: (decisionId: string) => Promise<void>;
  rejectOptimization: (decisionId: string) => Promise<void>;
  updateAISettings: (settings: Partial<MarketingOptimizationState['aiOptimization']>) => void;
  
  // Analytics
  fetchAnalytics: (timeframe: AnalyticsData['timeframe']) => Promise<void>;
  generateReport: (type: string, params: any) => Promise<string>;
  
  // Real-time Updates
  subscribeToUpdates: () => void;
}

const MarketingOptimizationContext = createContext<MarketingOptimizationContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export function MarketingOptimizationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marketingOptimizationReducer, initialState);
  const { subscribe } = useWebSocket();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ==================== CAMPAIGN MANAGEMENT ====================

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'campaigns', value: undefined } });

    try {
      const response = await fetch('/api/marketing-optimization/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const newCampaign: Campaign = await response.json();
      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
      
      toast.success('Campaign created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create campaign';
      dispatch({ type: 'SET_ERROR', payload: { key: 'campaigns', value: message } });
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: false } });
    }
  }, []);

  const optimizeCampaign = useCallback(async (campaignId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'optimization', value: true } });

    try {
      const response = await fetch(`/api/marketing-optimization/campaigns/${campaignId}/optimize`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to optimize campaign');
      }

      const optimization = await response.json();
      toast.success('Campaign optimization completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to optimize campaign';
      toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'optimization', value: false } });
    }
  }, []);

  const setActiveCampaign = useCallback((campaign: Campaign | null) => {
    dispatch({ type: 'SET_ACTIVE_CAMPAIGN', payload: campaign });
  }, []);

  // ==================== LEAD MANAGEMENT ====================

  const scoreLeads = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'leads', value: true } });

    try {
      const response = await fetch('/api/marketing-optimization/leads/score', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to score leads');
      }

      const { leads } = await response.json();
      dispatch({ type: 'SET_LEADS', payload: leads });
      
      toast.success('Lead scoring completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to score leads';
      toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'leads', value: false } });
    }
  }, []);

  // ==================== OPTIMIZATION ====================

  const triggerOptimization = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'optimization', value: true } });

    try {
      const response = await fetch('/api/marketing-optimization/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: state.aiOptimization.mode,
          auto_approve_threshold: state.aiOptimization.auto_approve_threshold
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger optimization');
      }

      const { decisions } = await response.json();
      dispatch({ type: 'SET_OPTIMIZATION_DECISIONS', payload: decisions });
      
      toast.success('AI optimization analysis completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to trigger optimization';
      toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'optimization', value: false } });
    }
  }, [state.aiOptimization]);

  const updateAISettings = useCallback((settings: Partial<MarketingOptimizationState['aiOptimization']>) => {
    dispatch({ type: 'UPDATE_AI_SETTINGS', payload: settings });
  }, []);

  // ==================== REAL-TIME UPDATES ====================

  const subscribeToUpdates = useCallback(() => {
    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    const unsubscribeFn = subscribe('marketing-optimization', (data) => {
      switch (data.type) {
        case 'campaign_updated':
          dispatch({ 
            type: 'UPDATE_CAMPAIGN', 
            payload: { id: data.campaignId, updates: data.updates } 
          });
          break;
        case 'new_alert':
          dispatch({ type: 'ADD_ALERT', payload: data.alert });
          break;
        case 'optimization_decision':
          dispatch({ type: 'ADD_OPTIMIZATION_DECISION', payload: data.decision });
          break;
        default:
          break;
      }
    });
    
    unsubscribeRef.current = unsubscribeFn;
  }, [subscribe]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: true } });
        
        // ✅ ENHANCED: Fetch data individually with proper error handling
        const fetchEndpoint = async (url: string, fallback: any = []) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              return await response.json();
            } else {
              console.warn(`API endpoint ${url} returned ${response.status}, using fallback data`);
              return fallback;
            }
          } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
            return fallback;
          }
        };

        const defaultAnalytics = {
          timeframe: 'month' as const,
          overview: { 
            total_campaigns: 0, 
            total_spend: 0, 
            total_revenue: 0, 
            overall_roas: 0,
            avg_cpc: 0,
            avg_conversion_rate: 0
          },
          platform_performance: [],
          performance_trends: [],
          ai_insights: { 
            top_opportunities: [], 
            recommendations: [] 
          }
        };

        const [campaigns, leads, alerts, analytics] = await Promise.all([
          fetchEndpoint('/api/marketing-optimization/campaigns', []),
          fetchEndpoint('/api/marketing-optimization/leads', []),
          fetchEndpoint('/api/marketing-optimization/alerts', []),
          fetchEndpoint('/api/marketing-optimization/analytics?timeframe=month', defaultAnalytics),
        ]);

        dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
        dispatch({ type: 'SET_LEADS', payload: leads });
        dispatch({ type: 'SET_ALERTS', payload: alerts });
        dispatch({ type: 'SET_ANALYTICS', payload: analytics });
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Set fallback data to prevent undefined state
        dispatch({ type: 'SET_CAMPAIGNS', payload: [] });
        dispatch({ type: 'SET_LEADS', payload: [] });
        dispatch({ type: 'SET_ALERTS', payload: [] });
        dispatch({ type: 'SET_ANALYTICS', payload: {
          timeframe: 'month' as const,
          overview: { 
            total_campaigns: 0, 
            total_spend: 0, 
            total_revenue: 0, 
            overall_roas: 0,
            avg_cpc: 0,
            avg_conversion_rate: 0
          },
          platform_performance: [],
          performance_trends: [],
          ai_insights: { 
            top_opportunities: [], 
            recommendations: [] 
          }
        }});
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: false } });
      }
    };

    loadInitialData();
    subscribeToUpdates();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [subscribeToUpdates]);

  // ==================== MEMOIZED CONTEXT VALUE ====================

  const contextValue = useMemo(() => ({
    ...state,
    createCampaign,
    updateCampaign: async (campaignId: string, updates: Partial<Campaign>) => {
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id: campaignId, updates } });
    },
    deleteCampaign: async (campaignId: string) => {
      // Implementation would go here
    },
    setActiveCampaign,
    optimizeCampaign,
    createLead: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      // Implementation would go here
    },
    updateLead: async (leadId: string, updates: Partial<Lead>) => {
      dispatch({ type: 'UPDATE_LEAD', payload: { id: leadId, updates } });
    },
    scoreLeads,
    acknowledgeAlert: async (alertId: string) => {
      dispatch({ type: 'UPDATE_ALERT', payload: { id: alertId, updates: { status: 'acknowledged' } } });
    },
    resolveAlert: async (alertId: string) => {
      dispatch({ type: 'UPDATE_ALERT', payload: { id: alertId, updates: { status: 'resolved', resolved_at: new Date() } } });
    },
    createAlert: async (alertData: Omit<Alert, 'id' | 'created_at'>) => {
      // Implementation would go here
    },
    triggerOptimization,
    approveOptimization: async (decisionId: string) => {
      // Implementation would go here
    },
    rejectOptimization: async (decisionId: string) => {
      // Implementation would go here
    },
    updateAISettings,
    fetchAnalytics: async (timeframe: AnalyticsData['timeframe']) => {
      // Implementation would go here
    },
    generateReport: async (type: string, params: any): Promise<string> => {
      // Implementation would return report URL
      return '';
    },
    subscribeToUpdates,
  }), [
    state, 
    createCampaign, 
    setActiveCampaign, 
    optimizeCampaign,
    scoreLeads,
    triggerOptimization,
    updateAISettings,
    subscribeToUpdates
  ]);

  return (
    <MarketingOptimizationContext.Provider value={contextValue}>
      {children}
    </MarketingOptimizationContext.Provider>
  );
}

// ==================== HOOK ====================

export function useMarketingOptimization() {
  const context = useContext(MarketingOptimizationContext);
  if (context === undefined) {
    throw new Error('useMarketingOptimization must be used within a MarketingOptimizationProvider');
  }
  return context;
}