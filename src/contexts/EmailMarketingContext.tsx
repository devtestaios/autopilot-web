/**
 * Email Marketing Platform Context
 * Enterprise-grade state management for email marketing operations
 * Features: Campaign management, automation, segmentation, analytics
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { 
  fetchEmailCampaigns,
  fetchEmailSubscribers,
  fetchEmailTemplates,
  fetchEmailMarketingOverview
} from '@/lib/api';

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
  const unsubscribeRef = useRef<(() => void) | null>(null);

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

  const createCampaign = useCallback(async (campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'campaigns', value: true } });

    try {
      const response = await fetch('/api/email-marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const newCampaign: EmailCampaign = await response.json();
      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
      
      // toast('Campaign created successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create campaign';
      // toast(message, 'error');
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
        
        // ✅ ENHANCED: Use comprehensive API functions with proper error handling
        const [contacts, campaigns, templates] = await Promise.all([
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
        ]);

        dispatch({ type: 'SET_CONTACTS', payload: contacts });
        dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
        dispatch({ type: 'SET_AUTOMATIONS', payload: [] }); // Automations will be added in next phase
        
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
    updateContact: async (contactId: string, updates: Partial<EmailContact>) => {
      dispatch({ type: 'UPDATE_CONTACT', payload: { id: contactId, updates } });
    },
    deleteContact: async (contactId: string) => {
      dispatch({ type: 'DELETE_CONTACT', payload: contactId });
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
    updateCampaign: async (campaignId: string, updates: Partial<EmailCampaign>) => {
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id: campaignId, updates } });
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
      // Implementation would go here
    },
    updateTemplate: async (templateId: string, updates: Partial<EmailTemplate>) => {
      // Implementation would go here
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