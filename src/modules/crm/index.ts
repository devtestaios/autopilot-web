// CRM Module Index
// Central export file for the Unified CRM Platform Suite

// Types
export * from './types/crm.types';

// Services
export { default as CRMApiService } from './services/crm-api.service';

// Components
export { default as LeadScoringDashboard } from './components/LeadScoringDashboard';
export { default as CustomerJourneyMapper } from './components/CustomerJourneyMapper';
export { default as CRMIntegrations } from './components/CRMIntegrations';

// Utils (to be created later)
// export * from './utils/crm-utils';

// Hooks (to be created later)
// export * from './hooks/useCRM';
// export * from './hooks/useLeadScoring';
// export * from './hooks/useCustomerJourney';
// export * from './hooks/useCRMIntegrations';

// Constants
export const CRM_CONSTANTS = {
  // Lead Score Ranges
  SCORE_RANGES: {
    HOT: [90, 100],
    QUALIFIED: [80, 89],
    WARM: [70, 79],
    POTENTIAL: [60, 69],
    COLD: [0, 59]
  },
  
  // Default Sync Frequencies
  SYNC_FREQUENCIES: [
    'real_time',
    '15_minutes',
    'hourly',
    'daily',
    'weekly',
    'manual'
  ],
  
  // Supported CRM Providers
  CRM_PROVIDERS: [
    'salesforce',
    'hubspot',
    'pipedrive',
    'zoho',
    'microsoft_dynamics',
    'sugar_crm',
    'copper',
    'insightly',
    'freshworks',
    'monday'
  ],
  
  // Journey Stages
  JOURNEY_STAGES: [
    'visitor',
    'lead',
    'qualified',
    'nurturing',
    'discovery',
    'proposal',
    'negotiation',
    'closing',
    'won',
    'lost'
  ],
  
  // Touchpoint Channels
  TOUCHPOINT_CHANNELS: [
    'email',
    'phone',
    'website',
    'social_media',
    'advertising',
    'direct_mail',
    'webinar',
    'trade_show',
    'referral'
  ]
} as const;

// Default Configuration
export const DEFAULT_CRM_CONFIG = {
  leadScoring: {
    enabled: true,
    autoRecalculate: true,
    recalculateFrequency: 'daily',
    factors: {
      demographic: { weight: 0.3 },
      behavioral: { weight: 0.25 },
      engagement: { weight: 0.2 },
      company_fit: { weight: 0.15 },
      intent_signals: { weight: 0.1 }
    }
  },
  
  customerJourney: {
    enabled: true,
    trackTouchpoints: true,
    calculateAttribution: true,
    stageTimeout: 30 // days
  },
  
  integrations: {
    maxRetries: 3,
    timeout: 30000, // 30 seconds
    batchSize: 100,
    rateLimitDelay: 1000 // 1 second
  }
} as const;