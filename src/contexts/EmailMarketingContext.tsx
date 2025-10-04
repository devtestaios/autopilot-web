/**
 * Email Marketing Platform Context
 * Enterprise-grade state management for email marketing operations
 * Features: Campaign management, automation, segmentation, analytics
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { optimizedAPI } from '@/lib/performance/optimizedAPI';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
import { realAnalytics, trackingHelpers } from '@/lib/performance/realAnalytics';
import { 
  fetchEmailCampaigns,
  fetchEmailSubscribers,
  fetchEmailTemplates,
  fetchEmailMarketingOverview,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  createEmailSubscriber,
  updateEmailSubscriber,
  deleteEmailSubscriber,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  fetchEmailCampaignAnalytics
} from '@/lib/api';

// Type mappers to convert between API types and context types
import type {
  EmailCampaign as ApiEmailCampaign,
  EmailSubscriber as ApiEmailSubscriber,
  EmailTemplate as ApiEmailTemplate
} from '@/types';

// ==================== TYPE DEFINITIONS ====================

export interface EmailContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  tags: string[];
  segments: string[];
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  source: 'import' | 'form' | 'api' | 'manual';
  customFields: Record<string, string>;
  engagementScore: number; // 0-100
  lastEngaged?: Date;
  subscribeDate: Date;
  unsubscribeDate?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  thumbnailUrl?: string;
  category: 'newsletter' | 'promotional' | 'transactional' | 'welcome' | 'abandoned_cart';
  variables: string[]; // Dynamic content placeholders
  isResponsive: boolean;
  preheader?: string;
  tags: string[];
  usage: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId?: string;
  htmlContent: string;
  textContent: string;
  preheader?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  
  // Targeting
  segments: string[];
  tags: string[];
  excludeSegments?: string[];
  
  // Scheduling
  scheduledDate?: Date;
  sentDate?: Date;
  timezone: string;
  
  // Status
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  
  // Analytics
  stats: {
    totalSent: number;
    delivered: number;
    bounced: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    complained: number;
    openRate: number; // Percentage
    clickRate: number; // Percentage
    unsubscribeRate: number;
    bounceRate: number;
  };
  
  // A/B Testing
  abTest?: {
    isEnabled: boolean;
    testType: 'subject' | 'content' | 'send_time' | 'from_name';
    variants: Array<{
      id: string;
      name: string;
      percentage: number;
      subject?: string;
      content?: string;
      sendTime?: Date;
      fromName?: string;
    }>;
    winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
    testDuration: number; // hours
    winnerVariant?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAutomation {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  
  // Trigger
  trigger: {
    type: 'welcome' | 'abandoned_cart' | 'birthday' | 'anniversary' | 'tag_added' | 'segment_entered' | 'custom_event';
    conditions?: Record<string, any>;
    delay?: number; // minutes
  };
  
  // Email Sequence
  emails: Array<{
    id: string;
    delay: number; // minutes after previous email or trigger
    templateId: string;
    subject: string;
    conditions?: Record<string, any>; // Send only if conditions met
  }>;
  
  // Analytics
  stats: {
    totalTriggered: number;
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    conversionRate: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
    value: string | number;
    logic?: 'and' | 'or';
  }>;
  contactCount: number;
  lastUpdated: Date;
  isAutoUpdate: boolean;
  createdAt: Date;
}

export interface EmailAnalytics {
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    totalCampaigns: number;
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalUnsubscribed: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgUnsubscribeRate: number;
    revenue: number;
    roi: number;
  };
  trends: {
    campaignPerformance: Array<{
      date: string;
      sent: number;
      opened: number;
      clicked: number;
      revenue: number;
    }>;
    audienceGrowth: Array<{
      date: string;
      subscribed: number;
      unsubscribed: number;
      netGrowth: number;
    }>;
  };
  topPerformingCampaigns: EmailCampaign[];
  segmentPerformance: Array<{
    segmentId: string;
    segmentName: string;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  }>;
}

// Type mapper functions to convert between API types and context types
export const mapApiEmailCampaignToContext = (apiCampaign: ApiEmailCampaign): EmailCampaign => ({
  id: apiCampaign.id,
  name: apiCampaign.name,
  subject: apiCampaign.subject,
  templateId: apiCampaign.template_id,
  htmlContent: apiCampaign.content || '',
  textContent: apiCampaign.content || '',
  preheader: apiCampaign.subject,
  fromName: apiCampaign.sender_name || 'Default Sender',
  fromEmail: apiCampaign.sender_email || 'sender@example.com',
  replyTo: apiCampaign.reply_to,
  segments: [],
  tags: apiCampaign.tags || [],
  excludeSegments: [],
  scheduledDate: apiCampaign.scheduled_at ? new Date(apiCampaign.scheduled_at) : undefined,
  // timezone: 'UTC', // Removed - doesn't exist in type
  timezone: 'UTC', // Default timezone
  status: apiCampaign.status === 'completed' ? 'sent' : 
         apiCampaign.status === 'sending' ? 'sent' : apiCampaign.status,
  sentDate: apiCampaign.sent_at ? new Date(apiCampaign.sent_at) : undefined,
  stats: {
    totalSent: apiCampaign.sent_count || 0,
    delivered: apiCampaign.delivered_count || 0,
    bounced: apiCampaign.bounced_count || 0,
    opened: apiCampaign.opened_count || 0,
    clicked: apiCampaign.clicked_count || 0,
    unsubscribed: apiCampaign.unsubscribed_count || 0,
    complained: 0,
    openRate: (apiCampaign.open_rate || 0) * 100,
    clickRate: (apiCampaign.click_rate || 0) * 100,
    unsubscribeRate: (apiCampaign.unsubscribe_rate || 0) * 100,
    bounceRate: (apiCampaign.bounce_rate || 0) * 100
  },
  createdAt: new Date(apiCampaign.created_at),
  updatedAt: new Date(apiCampaign.updated_at)
});

export const mapApiEmailSubscriberToContext = (apiSubscriber: ApiEmailSubscriber): EmailContact => ({
  id: apiSubscriber.id,
  email: apiSubscriber.email,
  firstName: apiSubscriber.first_name || '',
  lastName: apiSubscriber.last_name || '',
  status: apiSubscriber.status === 'active' ? 'subscribed' : 
          apiSubscriber.status === 'unsubscribed' ? 'unsubscribed' :
          apiSubscriber.status === 'bounced' ? 'bounced' : 'complained',
  tags: apiSubscriber.tags || [],
  customFields: Object.fromEntries(
    Object.entries(apiSubscriber.custom_fields || {}).map(([k, v]) => [k, String(v)])
  ),
  source: (apiSubscriber.source as 'import' | 'form' | 'api' | 'manual') || 'manual',
  subscribeDate: new Date(apiSubscriber.subscribed_at),
  segments: [],
  engagementScore: 50 // Default value since API doesn't provide this
});

export const mapApiEmailTemplateToContext = (apiTemplate: ApiEmailTemplate): EmailTemplate => ({
  id: apiTemplate.id,
  name: apiTemplate.name,
  subject: apiTemplate.subject || '',
  htmlContent: apiTemplate.content || '',
  textContent: apiTemplate.content || '',
  thumbnailUrl: apiTemplate.thumbnail,
  category: (apiTemplate.category as any) || 'newsletter',
  variables: apiTemplate.variables || [],
  isResponsive: true,
  preheader: apiTemplate.subject,
  tags: apiTemplate.tags || [],
  usage: 0,
  lastUsed: undefined,
  createdAt: new Date(apiTemplate.created_at),
  updatedAt: new Date(apiTemplate.updated_at)
});

export interface EmailMarketingState {
  // Contacts & Segmentation
  contacts: EmailContact[];
  segments: EmailSegment[];
  selectedContacts: string[];
  
  // Campaigns
  campaigns: EmailCampaign[];
  activeCampaign: EmailCampaign | null;
  
  // Templates
  templates: EmailTemplate[];
  
  // Automations
  automations: EmailAutomation[];
  
  // Analytics
  analytics: EmailAnalytics | null;
  
  // UI State
  loading: {
    contacts: boolean;
    campaigns: boolean;
    templates: boolean;
    automations: boolean;
    analytics: boolean;
    sending: boolean;
  };
  
  // Errors
  errors: {
    contacts?: string;
    campaigns?: string;
    templates?: string;
    automations?: string;
    analytics?: string;
  };
  
  // Features
  features: {
    aiContentGeneration: boolean;
    advancedSegmentation: boolean;
    abTesting: boolean;
    automationWorkflows: boolean;
    deliverabilityOptimization: boolean;
  };
}

// ==================== ACTION TYPES ====================

type EmailMarketingAction =
  | { type: 'SET_LOADING'; payload: { key: keyof EmailMarketingState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof EmailMarketingState['errors']; value: string | undefined } }
  | { type: 'SET_CONTACTS'; payload: EmailContact[] }
  | { type: 'ADD_CONTACT'; payload: EmailContact }
  | { type: 'UPDATE_CONTACT'; payload: { id: string; updates: Partial<EmailContact> } }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'SELECT_CONTACTS'; payload: string[] }
  | { type: 'SET_SEGMENTS'; payload: EmailSegment[] }
  | { type: 'ADD_SEGMENT'; payload: EmailSegment }
  | { type: 'UPDATE_SEGMENT'; payload: { id: string; updates: Partial<EmailSegment> } }
  | { type: 'SET_CAMPAIGNS'; payload: EmailCampaign[] }
  | { type: 'ADD_CAMPAIGN'; payload: EmailCampaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: { id: string; updates: Partial<EmailCampaign> } }
  | { type: 'SET_ACTIVE_CAMPAIGN'; payload: EmailCampaign | null }
  | { type: 'SET_TEMPLATES'; payload: EmailTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'SET_AUTOMATIONS'; payload: EmailAutomation[] }
  | { type: 'ADD_AUTOMATION'; payload: EmailAutomation }
  | { type: 'UPDATE_AUTOMATION'; payload: { id: string; updates: Partial<EmailAutomation> } }
  | { type: 'SET_ANALYTICS'; payload: EmailAnalytics }
  | { type: 'UPDATE_FEATURES'; payload: Partial<EmailMarketingState['features']> }
  | { type: 'RESET_STATE' };

// ==================== REDUCER ====================

const initialState: EmailMarketingState = {
  contacts: [],
  segments: [],
  selectedContacts: [],
  campaigns: [],
  activeCampaign: null,
  templates: [],
  automations: [],
  analytics: null,
  loading: {
    contacts: false,
    campaigns: false,
    templates: false,
    automations: false,
    analytics: false,
    sending: false,
  },
  errors: {},
  features: {
    aiContentGeneration: true,
    advancedSegmentation: true,
    abTesting: true,
    automationWorkflows: true,
    deliverabilityOptimization: true,
  },
};

function emailMarketingReducer(state: EmailMarketingState, action: EmailMarketingAction): EmailMarketingState {
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

    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };

    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };

    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id
            ? { ...contact, ...action.payload.updates }
            : contact
        ),
      };

    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id !== action.payload),
        selectedContacts: state.selectedContacts.filter(id => id !== action.payload),
      };

    case 'SELECT_CONTACTS':
      return { ...state, selectedContacts: action.payload };

    case 'SET_SEGMENTS':
      return { ...state, segments: action.payload };

    case 'ADD_SEGMENT':
      return { ...state, segments: [...state.segments, action.payload] };

    case 'UPDATE_SEGMENT':
      return {
        ...state,
        segments: state.segments.map((segment) =>
          segment.id === action.payload.id
            ? { ...segment, ...action.payload.updates }
            : segment
        ),
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

    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };

    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };

    case 'SET_AUTOMATIONS':
      return { ...state, automations: action.payload };

    case 'ADD_AUTOMATION':
      return { ...state, automations: [...state.automations, action.payload] };

    case 'UPDATE_AUTOMATION':
      return {
        ...state,
        automations: state.automations.map((automation) =>
          automation.id === action.payload.id
            ? { ...automation, ...action.payload.updates }
            : automation
        ),
      };

    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };

    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: { ...state.features, ...action.payload },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ==================== CONTEXT ====================

interface EmailMarketingContextType extends EmailMarketingState {
  // Contact Management
  importContacts: (contacts: Omit<EmailContact, 'id'>[]) => Promise<void>;
  updateContact: (contactId: string, updates: Partial<EmailContact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  selectContacts: (contactIds: string[]) => void;
  
  // Segmentation
  createSegment: (segmentData: Omit<EmailSegment, 'id' | 'contactCount' | 'lastUpdated' | 'createdAt'>) => Promise<void>;
  updateSegment: (segmentId: string, updates: Partial<EmailSegment>) => Promise<void>;
  refreshSegment: (segmentId: string) => Promise<void>;
  
  // Campaign Management
  createCampaign: (campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<EmailCampaign>) => Promise<void>;
  sendCampaign: (campaignId: string) => Promise<void>;
  pauseCampaign: (campaignId: string) => Promise<void>;
  setActiveCampaign: (campaign: EmailCampaign | null) => void;
  
  // Template Management
  createTemplate: (templateData: Omit<EmailTemplate, 'id' | 'usage' | 'lastUsed' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (templateId: string, updates: Partial<EmailTemplate>) => Promise<void>;
  duplicateTemplate: (templateId: string, newName: string) => Promise<void>;
  
  // Automation Management
  createAutomation: (automationData: Omit<EmailAutomation, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAutomation: (automationId: string, updates: Partial<EmailAutomation>) => Promise<void>;
  toggleAutomation: (automationId: string) => Promise<void>;
  
  // Analytics
  fetchAnalytics: (timeframe: EmailAnalytics['timeframe']) => Promise<void>;
  
  // AI Features
  generateSubjectLine: (content: string, audience?: string) => Promise<string[]>;
  optimizeSendTime: (segmentIds: string[]) => Promise<Date>;
  generateContent: (prompt: string, templateType: string) => Promise<string>;
  
  // Real-time Updates
  subscribeToUpdates: () => void;
}

const EmailMarketingContext = createContext<EmailMarketingContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export function EmailMarketingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(emailMarketingReducer, initialState);
  const { subscribe } = useWebSocket();
  // Real analytics integration
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const realtimeSubscriptionRef = useRef<string>('');

  // ==================== OPTIMIZED DATA LOADING ====================

  const loadCampaigns = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'campaigns', value: undefined } });

    try {
      // Track loading attempt
      await trackingHelpers.trackCampaignCreate('load_request', 0);
      
      // Use API client to fetch campaigns
      const campaigns = await optimizedAPI.emailMarketing.getCampaigns();
      dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
      
      // Track successful load with real analytics
      await trackingHelpers.trackCampaignCreate('campaigns_loaded', campaigns.length);
      
      // Also track with simple analytics
      simpleAnalytics.trackPerformance('email_campaigns_loaded', campaigns.length);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { 
        key: 'campaigns', 
        value: error.message || 'Failed to load campaigns' 
      }});
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: false } });
    }
  }, []);

  // Setup real-time subscriptions for email marketing data
  useEffect(() => {
    // Subscribe to email marketing updates via WebSocket
    const unsubscribe = subscribe('email_marketing_updates', async (data: any) => {
      await realAnalytics.trackEmailMarketingEvent('realtime_update', {
        operation: data.type || 'unknown',
        table: 'email_campaigns'
      });
      
      // Refresh campaigns data when changes occur
      if (data.type && ['campaign_created', 'campaign_updated', 'campaign_deleted'].includes(data.type)) {
        loadCampaigns();
      }
    });
    
    unsubscribeRef.current = unsubscribe;

    // Initial load
    loadCampaigns();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [loadCampaigns, subscribe]);

  // ==================== CONTACT MANAGEMENT ====================

  const importContacts = useCallback(async (contacts: Omit<EmailContact, 'id'>[]) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'contacts', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'contacts', value: undefined } });

    try {
      const response = await fetch('/api/email-marketing/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts }),
      });

      if (!response.ok) {
        throw new Error('Failed to import contacts');
      }

      const { imported, errors } = await response.json();
      
      // Add imported contacts to state
      imported.forEach((contact: EmailContact) => {
        dispatch({ type: 'ADD_CONTACT', payload: contact });
      });
      
      // toast(`${imported.length} contacts imported successfully`, 'success');
      
      if (errors.length > 0) {
        // toast(`${errors.length} contacts failed to import`, 'warning');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import contacts';
      dispatch({ type: 'SET_ERROR', payload: { key: 'contacts', value: message } });
      // toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'contacts', value: false } });
    }
  }, []);

  const selectContacts = useCallback((contactIds: string[]) => {
    dispatch({ type: 'SELECT_CONTACTS', payload: contactIds });
  }, []);

  // ==================== CAMPAIGN MANAGEMENT ====================

  // ✅ DATABASE CONNECTED: Enhanced createCampaign using real API with type mapping
  const createCampaign = useCallback(async (campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: true } });

    try {
      const apiCampaign = await createEmailCampaign({
        name: campaignData.name,
        subject: campaignData.subject,
        content: campaignData.htmlContent || '',
        status: campaignData.status === 'cancelled' ? 'paused' : (campaignData.status || 'draft'),
        sender_name: campaignData.fromName,
        sender_email: campaignData.fromEmail,
        reply_to: campaignData.replyTo,
        scheduled_at: campaignData.scheduledDate?.toISOString(),
        template_id: campaignData.templateId,
        tags: campaignData.tags
      });

      // Map API response to context type
      const newCampaign = mapApiEmailCampaignToContext(apiCampaign);
      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
      
      // toast('Campaign created successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create campaign';
      console.error('Failed to create campaign:', error);
      // toast(message, 'error');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: false } });
    }
  }, []);

  const sendCampaign = useCallback(async (campaignId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'sending', value: true } });

    try {
      const response = await fetch(`/api/email-marketing/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign');
      }

      dispatch({ 
        type: 'UPDATE_CAMPAIGN', 
        payload: { 
          id: campaignId, 
          updates: { status: 'sending', sentDate: new Date() } 
        } 
      });
      
      // toast('Campaign is being sent', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send campaign';
      // toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'sending', value: false } });
    }
  }, []);

  const setActiveCampaign = useCallback((campaign: EmailCampaign | null) => {
    dispatch({ type: 'SET_ACTIVE_CAMPAIGN', payload: campaign });
  }, []);

  // ==================== AI FEATURES ====================

  const generateSubjectLine = useCallback(async (content: string, audience?: string): Promise<string[]> => {
    try {
      const response = await fetch('/api/email-marketing/ai/generate-subject-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, audience }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate subject lines');
      }

      const { subjectLines } = await response.json();
      return subjectLines;
    } catch (error) {
      console.error('Subject line generation failed:', error);
      throw error;
    }
  }, []);

  const generateContent = useCallback(async (prompt: string, templateType: string): Promise<string> => {
    try {
      const response = await fetch('/api/email-marketing/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, templateType }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const { content } = await response.json();
      return content;
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    }
  }, []);

  // ==================== REAL-TIME UPDATES ====================

  const subscribeToUpdates = useCallback(() => {
    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    const unsubscribeFn = subscribe('email-marketing', (data) => {
      switch (data.type) {
        case 'campaign_stats_updated':
          dispatch({ 
            type: 'UPDATE_CAMPAIGN', 
            payload: { id: data.campaignId, updates: { stats: data.stats } } 
          });
          break;
        case 'contact_updated':
          dispatch({ 
            type: 'UPDATE_CONTACT', 
            payload: { id: data.contactId, updates: data.updates } 
          });
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
        dispatch({ type: 'SET_LOADING', payload: { key: 'contacts', value: true } });
        
        // ✅ DATABASE CONNECTED: Use real API functions with type mapping
        const [apiContacts, apiCampaigns, apiTemplates, overview] = await Promise.all([
          fetchEmailSubscribers({ limit: 100 }).catch(error => {
            console.warn('Failed to fetch email subscribers:', error);
            return [];
          }),
          fetchEmailCampaigns(50).catch(error => {
            console.warn('Failed to fetch email campaigns:', error);
            return [];
          }),
          fetchEmailTemplates(50).catch(error => {
            console.warn('Failed to fetch email templates:', error);
            return [];
          }),
          fetchEmailMarketingOverview().catch(error => {
            console.warn('Failed to fetch email marketing overview:', error);
            return null;
          }),
        ]);

        // Map API types to context types
        const contacts = apiContacts.map(mapApiEmailSubscriberToContext);
        const campaigns = apiCampaigns.map(mapApiEmailCampaignToContext);
        const templates = apiTemplates.map(mapApiEmailTemplateToContext);

        dispatch({ type: 'SET_CONTACTS', payload: contacts });
        dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
        dispatch({ type: 'SET_AUTOMATIONS', payload: [] }); // Automations will be added in next phase
        
        // Update analytics if overview data is available
        if (overview) {
          const analyticsData = {
            timeframe: 'month' as const,
            metrics: {
              totalCampaigns: overview.total_campaigns,
              totalSent: overview.total_emails_sent,
              totalDelivered: Math.round(overview.total_emails_sent * 0.97), // Estimate 97% delivery
              totalOpened: Math.round(overview.total_emails_sent * (overview.average_open_rate / 100)),
              totalClicked: Math.round(overview.total_emails_sent * (overview.average_click_rate / 100)),
              totalUnsubscribed: Math.round(overview.total_subscribers * 0.02), // Estimate 2% unsubscribe
              avgOpenRate: overview.average_open_rate,
              avgClickRate: overview.average_click_rate,
              avgUnsubscribeRate: 2.0, // Estimate
              revenue: 0, // Will be calculated from campaign data
              roi: 0 // Will be calculated from campaign data
            },
            trends: { campaignPerformance: [], audienceGrowth: [] },
            topPerformingCampaigns: campaigns.slice(0, 5),
            segmentPerformance: []
          };
          dispatch({ type: 'SET_ANALYTICS', payload: analyticsData });
        }
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Set fallback data to prevent undefined state
        dispatch({ type: 'SET_CONTACTS', payload: [] });
        dispatch({ type: 'SET_CAMPAIGNS', payload: [] });
        dispatch({ type: 'SET_TEMPLATES', payload: [] });
        dispatch({ type: 'SET_AUTOMATIONS', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'contacts', value: false } });
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
    importContacts,
    updateContact: async (contactId: string, updates: Partial<EmailContact>): Promise<void> => {
      try {
        const apiStatusMap = {
          'subscribed': 'active' as const,
          'unsubscribed': 'unsubscribed' as const,
          'bounced': 'bounced' as const,
          'complained': 'pending' as const
        };
        
        const updateData: any = {
          first_name: updates.firstName,
          last_name: updates.lastName,
          status: updates.status ? apiStatusMap[updates.status] : undefined,
          tags: updates.tags,
          custom_fields: updates.customFields
        };
        
        if (updates.email) {
          updateData.email = updates.email;
        }
        
        await updateEmailSubscriber(contactId, updateData);
        
        dispatch({ type: 'UPDATE_CONTACT', payload: { id: contactId, updates } });
      } catch (error) {
        console.error('Failed to update contact:', error);
        throw error;
      }
    },
    deleteContact: async (contactId: string) => {
      try {
        await deleteEmailSubscriber(contactId);
        dispatch({ type: 'DELETE_CONTACT', payload: contactId });
      } catch (error) {
        console.error('Failed to delete contact:', error);
        throw error;
      }
    },
    selectContacts,
    createSegment: async (segmentData: Omit<EmailSegment, 'id' | 'contactCount' | 'lastUpdated' | 'createdAt'>) => {
      // Implementation would go here
    },
    updateSegment: async (segmentId: string, updates: Partial<EmailSegment>) => {
      dispatch({ type: 'UPDATE_SEGMENT', payload: { id: segmentId, updates } });
    },
    refreshSegment: async (segmentId: string) => {
      // Implementation would refresh segment contact count
    },
    createCampaign,
    updateCampaign: async (campaignId: string, updates: Partial<EmailCampaign>): Promise<void> => {
      try {
        const apiStatusMap = {
          'cancelled': 'paused' as const,
          'draft': 'draft' as const,
          'scheduled': 'scheduled' as const,
          'sending': 'sending' as const,
          'sent': 'sent' as const,
          'paused': 'paused' as const
        };
        
        await updateEmailCampaign(campaignId, {
          ...(updates.name && { name: updates.name }),
          ...(updates.subject && { subject: updates.subject }),
          ...(updates.htmlContent && { content: updates.htmlContent }),
          ...(updates.status && { status: apiStatusMap[updates.status] || 'draft' }),
          ...(updates.scheduledDate && { scheduled_at: updates.scheduledDate.toISOString() }),
          ...(updates.templateId && { template_id: updates.templateId })
        });
        
        dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id: campaignId, updates } });
      } catch (error) {
        console.error('Failed to update campaign:', error);
        throw error;
      }
    },
    sendCampaign,
    pauseCampaign: async (campaignId: string) => {
      dispatch({ 
        type: 'UPDATE_CAMPAIGN', 
        payload: { id: campaignId, updates: { status: 'paused' } } 
      });
    },
    setActiveCampaign,
    createTemplate: async (templateData: Omit<EmailTemplate, 'id' | 'usage' | 'lastUsed' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newTemplate = await createEmailTemplate({
          name: templateData.name,
          subject: templateData.subject,
          content: templateData.htmlContent,
          category: templateData.category,
          variables: templateData.variables,
          tags: templateData.tags
        });
        
        // Map API response to context format
        const mappedTemplate = mapApiEmailTemplateToContext(newTemplate);
        dispatch({ type: 'ADD_TEMPLATE', payload: mappedTemplate });
        return;
      } catch (error) {
        console.error('Failed to create template:', error);
        throw error;
      }
    },
    updateTemplate: async (templateId: string, updates: Partial<EmailTemplate>) => {
      try {
        const currentTemplate = state.templates.find(t => t.id === templateId);
        if (!currentTemplate) throw new Error('Template not found');
        
        const updatedTemplate = await updateEmailTemplate(templateId, {
          name: updates.name || currentTemplate.name,
          subject: updates.subject,
          content: updates.htmlContent || currentTemplate.htmlContent,
          category: updates.category,
          variables: updates.variables,
          tags: updates.tags
        });
        
        // Map API response to context format
        const mappedTemplate = mapApiEmailTemplateToContext(updatedTemplate);
        dispatch({ type: 'SET_TEMPLATES', payload: state.templates.map(t => t.id === templateId ? mappedTemplate : t) });
        return;
      } catch (error) {
        console.error('Failed to update template:', error);
        throw error;
      }
    },
    duplicateTemplate: async (templateId: string, newName: string) => {
      // Implementation would go here
    },
    createAutomation: async (automationData: Omit<EmailAutomation, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {
      // Implementation would go here
    },
    updateAutomation: async (automationId: string, updates: Partial<EmailAutomation>) => {
      dispatch({ type: 'UPDATE_AUTOMATION', payload: { id: automationId, updates } });
    },
    toggleAutomation: async (automationId: string) => {
      // Implementation would toggle automation status
    },
    fetchAnalytics: async (timeframe: EmailAnalytics['timeframe']) => {
      // Implementation would go here
    },
    generateSubjectLine,
    optimizeSendTime: async (segmentIds: string[]): Promise<Date> => {
      // AI-powered optimal send time
      return new Date();
    },
    generateContent,
    subscribeToUpdates,
  }), [state, importContacts, selectContacts, createCampaign, sendCampaign, setActiveCampaign, generateSubjectLine, generateContent, subscribeToUpdates]);

  return (
    <EmailMarketingContext.Provider value={contextValue}>
      {children}
    </EmailMarketingContext.Provider>
  );
}

// ==================== HOOK ====================

export function useEmailMarketing() {
  const context = useContext(EmailMarketingContext);
  if (context === undefined) {
    throw new Error('useEmailMarketing must be used within an EmailMarketingProvider');
  }
  return context;
}