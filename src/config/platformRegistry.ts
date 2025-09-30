// Platform Registry - Maps existing and future platforms
// CRITICAL: This file establishes the foundation for 20-platform architecture

export interface WidgetConfig {
  type: string;
  size: 'small' | 'medium' | 'large';
  title?: string;
  dataSource?: string;
}

export interface QuickAction {
  label: string;
  action: string;
  icon?: string;
  route?: string;
}

export interface PlatformModule {
  id: string;
  name: string;
  icon: string;
  route: string;
  category: 'marketing' | 'business' | 'operations' | 'commerce' | 'analytics' | 'enterprise';
  status: 'active' | 'development' | 'planning';
  features: string[];
  widgets: WidgetConfig[];
  quickActions: QuickAction[];
  aiCapabilities: string[];
  description: string;
}

// ✅ EXISTING PLATFORMS - Currently functional and working
export const EXISTING_PLATFORMS: PlatformModule[] = [
  // UNIFIED MARKETING COMMAND CENTER (Primary Marketing Hub)
  {
    id: 'marketing',
    name: 'Marketing Command Center',
    icon: 'Target',
    route: '/marketing',
    category: 'marketing',
    status: 'active',
    description: 'Unified marketing ecosystem combining campaigns, social media, email marketing, and content creation with AI optimization. Central hub for all marketing operations.',
    features: [
      'campaign-management', 
      'social-media-management', 
      'email-marketing', 
      'content-creation', 
      'ai-optimization', 
      'cross-channel-analytics',
      'marketing-automation',
      'lead-management',
      'unified-kpi-dashboard',
      'cross-platform-insights'
    ],
    widgets: [
      { type: 'unified-kpi-dashboard', size: 'large', title: 'Marketing KPI Overview' },
      { type: 'cross-channel-performance', size: 'large', title: 'Cross-Channel Performance' },
      { type: 'campaign-status', size: 'medium', title: 'Active Campaigns' },
      { type: 'social-engagement', size: 'medium', title: 'Social Engagement' },
      { type: 'email-performance', size: 'medium', title: 'Email Performance' },
      { type: 'content-pipeline', size: 'medium', title: 'Content Pipeline' },
      { type: 'lead-funnel', size: 'medium', title: 'Lead Conversion Funnel' },
      { type: 'ai-recommendations', size: 'small', title: 'AI Recommendations' }
    ],
    quickActions: [
      { label: 'New Campaign', action: 'create-campaign', route: '/marketing/campaigns/new' },
      { label: 'Schedule Post', action: 'schedule-social-post', route: '/marketing/social/compose' },
      { label: 'Send Email', action: 'create-email-campaign', route: '/marketing/email/compose' },
      { label: 'Generate Content', action: 'generate-content', route: '/marketing/content/ai-generator' },
      { label: 'View Analytics', action: 'view-analytics', route: '/marketing/analytics' }
    ],
    aiCapabilities: [
      'campaign-optimization',
      'content-generation', 
      'audience-targeting',
      'performance-prediction',
      'automated-bidding',
      'cross-channel-attribution',
      'sentiment-analysis',
      'lead-scoring'
    ]
  },

  // LEGACY PLATFORMS (Keep for backward compatibility during transition)
  {
    id: 'campaigns',
    name: 'Campaign Management (Legacy)',
    icon: 'Target',
    route: '/campaigns',
    category: 'marketing',
    status: 'active',
    description: 'Legacy campaign management - now part of Marketing Command Center',
    features: ['campaign-management', 'ai-optimization', 'lead-management'],
    widgets: [
      { type: 'campaign-performance', size: 'large', title: 'Campaign Performance' },
      { type: 'active-campaigns', size: 'medium', title: 'Active Campaigns' }
    ],
    quickActions: [
      { label: 'New Campaign', action: 'create-campaign' },
      { label: 'Optimize All', action: 'optimize-campaigns' }
    ],
    aiCapabilities: ['optimization', 'prediction', 'automation']
  },

  // ANALYTICS PLATFORM
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    icon: 'BarChart3',
    route: '/analytics',
    category: 'analytics',
    status: 'active',
    description: 'Advanced analytics, reporting, and business intelligence',
    features: ['performance-analytics', 'real-time-data', 'custom-reports', 'predictive-modeling'],
    widgets: [
      { type: 'analytics-overview', size: 'large', title: 'Analytics Overview' },
      { type: 'real-time-metrics', size: 'medium', title: 'Real-Time Metrics' },
      { type: 'conversion-tracking', size: 'medium', title: 'Conversion Tracking' },
      { type: 'traffic-sources', size: 'small', title: 'Traffic Sources' }
    ],
    quickActions: [
      { label: 'View Real-Time', action: 'real-time-view', icon: 'Activity', route: '/analytics/real-time' },
      { label: 'Custom Report', action: 'create-report', icon: 'FileText', route: '/analytics/report-builder' },
      { label: 'ROI Analysis', action: 'roi-analysis', icon: 'TrendingUp', route: '/analytics/roi' }
    ],
    aiCapabilities: ['predictive-analytics', 'anomaly-detection', 'trend-analysis', 'automated-insights']
  },

  {
    id: 'social-media-platform',
    name: 'Social Media Platform',
    icon: 'Users',
    route: '/social-media',
    category: 'marketing',
    status: 'active',
    description: 'Multi-platform social media management with AI content generation',
    features: ['multi-platform-posting', 'content-scheduling', 'engagement-tracking', 'ai-content-generation'],
    widgets: [
      { type: 'post-scheduler', size: 'large', title: 'Content Calendar' },
      { type: 'engagement-metrics', size: 'medium', title: 'Engagement Overview' },
      { type: 'content-library', size: 'medium', title: 'Content Library' },
      { type: 'platform-performance', size: 'small', title: 'Platform Performance' }
    ],
    quickActions: [
      { label: 'Schedule Post', action: 'schedule-post', icon: 'Calendar', route: '/social-media/schedule' },
      { label: 'Generate Content', action: 'generate-content', icon: 'Sparkles', route: '/social-media/generate' },
      { label: 'Analyze Performance', action: 'analyze-performance', icon: 'BarChart3', route: '/social-media/analytics' }
    ],
    aiCapabilities: ['content-generation', 'hashtag-optimization', 'engagement-prediction', 'optimal-posting-times']
  },

  {
    id: 'email-marketing',
    name: 'Email Marketing',
    icon: 'Mail',
    route: '/email-marketing',
    category: 'marketing',
    status: 'active',
    description: 'Comprehensive email marketing with automation and AI optimization',
    features: ['campaign-management', 'email-automation', 'audience-segmentation', 'deliverability-optimization'],
    widgets: [
      { type: 'campaign-overview', size: 'large', title: 'Campaign Performance' },
      { type: 'automation-status', size: 'medium', title: 'Active Automations' },
      { type: 'deliverability-metrics', size: 'medium', title: 'Deliverability Stats' },
      { type: 'subscriber-growth', size: 'small', title: 'Subscriber Growth' }
    ],
    quickActions: [
      { label: 'Create Campaign', action: 'create-campaign', icon: 'Plus', route: '/email-marketing/campaigns/new' },
      { label: 'Import Contacts', action: 'import-contacts', icon: 'Upload', route: '/email-marketing/contacts/import' },
      { label: 'Generate Content', action: 'generate-content', icon: 'Sparkles', route: '/email-marketing/content/generate' },
      { label: 'Setup Automation', action: 'setup-automation', icon: 'Zap', route: '/email-marketing/automations/new' }
    ],
    aiCapabilities: ['subject-line-optimization', 'content-generation', 'send-time-optimization', 'audience-segmentation']
  },

  {
    id: 'lead-management',
    name: 'Lead Management', 
    icon: 'Users',
    route: '/leads',
    category: 'business',
    status: 'active',
    description: 'Comprehensive lead tracking and management system',
    features: ['lead-tracking', 'contact-management', 'pipeline-management', 'lead-scoring'],
    widgets: [
      { type: 'lead-overview', size: 'large', title: 'Lead Overview' },
      { type: 'recent-leads', size: 'medium', title: 'Recent Leads' },
      { type: 'conversion-rates', size: 'small', title: 'Conversion Rates' }
    ],
    quickActions: [
      { label: 'Add Lead', action: 'add-lead', icon: 'UserPlus' },
      { label: 'Import Leads', action: 'import-leads', icon: 'Upload' },
      { label: 'Export Data', action: 'export-leads', icon: 'Download' }
    ],
    aiCapabilities: ['lead-scoring', 'qualification-prediction', 'automated-follow-up']
  },

  {
    id: 'smart-alerts',
    name: 'Smart Alerts',
    icon: 'Bell',
    route: '/alerts', 
    category: 'operations',
    status: 'active',
    description: 'Intelligent alert system for monitoring and notifications',
    features: ['real-time-monitoring', 'custom-alerts', 'notification-management', 'escalation-rules'],
    widgets: [
      { type: 'alert-summary', size: 'medium', title: 'Alert Summary' },
      { type: 'recent-alerts', size: 'medium', title: 'Recent Alerts' },
      { type: 'alert-trends', size: 'small', title: 'Alert Trends' }
    ],
    quickActions: [
      { label: 'Create Alert', action: 'create-alert', icon: 'Plus' },
      { label: 'Alert History', action: 'view-history', icon: 'History' },
      { label: 'Settings', action: 'alert-settings', icon: 'Settings' }
    ],
    aiCapabilities: ['intelligent-monitoring', 'predictive-alerts', 'automated-responses']
  },

  {
    id: 'system-status',
    name: 'System Status',
    icon: 'Activity',
    route: '/status',
    category: 'operations', 
    status: 'active',
    description: 'System health monitoring and performance dashboard',
    features: ['system-monitoring', 'performance-tracking', 'uptime-monitoring', 'health-checks'],
    widgets: [
      { type: 'system-health', size: 'large', title: 'System Health' },
      { type: 'performance-metrics', size: 'medium', title: 'Performance Metrics' },
      { type: 'uptime-status', size: 'small', title: 'Uptime Status' }
    ],
    quickActions: [
      { label: 'Health Check', action: 'run-health-check', icon: 'CheckCircle' },
      { label: 'View Logs', action: 'view-logs', icon: 'FileText' },
      { label: 'System Report', action: 'system-report', icon: 'Download' }
    ],
    aiCapabilities: ['predictive-maintenance', 'anomaly-detection', 'automated-diagnostics']
  },

  {
    id: 'platform-setup',
    name: 'Platform Setup',
    icon: 'Settings',
    route: '/platforms',
    category: 'enterprise',
    status: 'active',
    description: 'Platform configuration and integration management',
    features: ['platform-integration', 'configuration-management', 'api-setup', 'credential-management'],
    widgets: [
      { type: 'integration-status', size: 'large', title: 'Integration Status' },
      { type: 'api-health', size: 'medium', title: 'API Health' },
      { type: 'setup-progress', size: 'small', title: 'Setup Progress' }
    ],
    quickActions: [
      { label: 'Add Platform', action: 'add-platform', icon: 'Plus' },
      { label: 'Test APIs', action: 'test-apis', icon: 'Zap' },
      { label: 'View Docs', action: 'view-docs', icon: 'BookOpen' }
    ],
    aiCapabilities: ['automated-setup', 'configuration-optimization', 'integration-assistance']
  },

  {
    id: 'social-media-management',
    name: 'Social Media Management',
    icon: 'Share2', 
    route: '/social-media-mgmt',
    category: 'marketing',
    status: 'active',
    description: 'Comprehensive social media management across all platforms',
    features: ['post-scheduling', 'engagement-tracking', 'content-calendar', 'social-listening'],
    widgets: [
      { type: 'social-calendar', size: 'large', title: 'Content Calendar' },
      { type: 'engagement-metrics', size: 'medium', title: 'Engagement Metrics' },
      { type: 'post-performance', size: 'medium', title: 'Post Performance' },
      { type: 'social-mentions', size: 'small', title: 'Brand Mentions' }
    ],
    quickActions: [
      { label: 'Schedule Post', action: 'schedule-post', icon: 'Calendar' },
      { label: 'Create Content', action: 'create-content', icon: 'PenTool' },
      { label: 'View Mentions', action: 'view-mentions', icon: 'MessageCircle' }
    ],
    aiCapabilities: ['content-generation', 'sentiment-analysis', 'optimal-timing', 'hashtag-optimization']
  },

  {
    id: 'content-creation-suite',
    name: 'Content Creation Suite',
    icon: 'Edit',
    route: '/content-suite',
    category: 'marketing',
    status: 'active',
    description: 'Comprehensive content creation platform with Social Media Management, Email Marketing, CMS, and AI-powered Content Generation Workspace',
    features: ['ai-content-generation', 'social-media-management', 'email-marketing', 'content-management', 'manual-editing', 'content-library'],
    widgets: [
      { type: 'content-generator', size: 'large', title: 'AI Content Generator' },
      { type: 'social-scheduler', size: 'medium', title: 'Social Media Scheduler' },
      { type: 'email-campaigns', size: 'medium', title: 'Email Campaigns' },
      { type: 'content-library', size: 'small', title: 'Content Library' }
    ],
    quickActions: [
      { label: 'Generate Content', action: 'generate-content', icon: 'Sparkles', route: '/content-suite/generator' },
      { label: 'Schedule Social', action: 'schedule-social', icon: 'Calendar', route: '/content-suite/social' },
      { label: 'Create Email', action: 'create-email', icon: 'Mail', route: '/content-suite/email' },
      { label: 'Manage Content', action: 'manage-content', icon: 'FolderOpen', route: '/content-suite/library' }
    ],
    aiCapabilities: ['content-generation', 'social-optimization', 'email-personalization', 'seo-optimization', 'brand-voice-matching', 'multi-format-creation']
  },

  {
    id: 'business-suite',
    name: 'Business Suite',
    icon: 'Building2',
    route: '/business-suite',
    category: 'business',
    status: 'active',
    description: 'Complete business management platform with Advanced CRM, Sales Automation, and Financial Management',
    features: ['advanced-crm', 'sales-automation', 'financial-management', 'lead-tracking', 'pipeline-management', 'invoicing', 'reporting'],
    widgets: [
      { type: 'crm-dashboard', size: 'large', title: 'CRM Overview' },
      { type: 'sales-pipeline', size: 'medium', title: 'Sales Pipeline' },
      { type: 'financial-summary', size: 'medium', title: 'Financial Summary' },
      { type: 'recent-activities', size: 'small', title: 'Recent Activities' }
    ],
    quickActions: [
      { label: 'Add Contact', action: 'add-contact', icon: 'UserPlus', route: '/business-suite/crm' },
      { label: 'Create Deal', action: 'create-deal', icon: 'Handshake', route: '/business-suite/sales' },
      { label: 'Generate Invoice', action: 'create-invoice', icon: 'FileText', route: '/business-suite/finance' },
      { label: 'View Reports', action: 'view-reports', icon: 'BarChart3', route: '/business-suite/reports' }
    ],
    aiCapabilities: ['lead-scoring', 'sales-forecasting', 'customer-insights', 'financial-analysis', 'automated-follow-ups', 'predictive-analytics']
  },

  {
    id: 'unified-crm-suite',
    name: 'Unified CRM Platform Suite',
    icon: 'Users',
    route: '/unified-crm',
    category: 'business',
    status: 'active',
    description: 'Advanced CRM platform with AI-powered lead scoring, customer journey mapping, and major CRM integrations',
    features: ['lead-scoring-automation', 'customer-journey-mapping', 'crm-integrations', 'ai-insights', 'sales-pipeline', 'contact-management'],
    widgets: [
      { type: 'lead-score-dashboard', size: 'large', title: 'Lead Scoring Dashboard' },
      { type: 'customer-journey-map', size: 'large', title: 'Customer Journey Visualization' },
      { type: 'pipeline-overview', size: 'medium', title: 'Sales Pipeline' },
      { type: 'crm-sync-status', size: 'small', title: 'CRM Integrations' },
      { type: 'ai-recommendations', size: 'medium', title: 'AI Insights' }
    ],
    quickActions: [
      { label: 'Score Leads', action: 'score-leads', icon: 'Target', route: '/unified-crm/scoring' },
      { label: 'View Journey', action: 'view-journey', icon: 'Map', route: '/unified-crm/journey' },
      { label: 'Sync CRMs', action: 'sync-crms', icon: 'RefreshCw', route: '/unified-crm/integrations' },
      { label: 'Generate Report', action: 'generate-report', icon: 'FileText', route: '/unified-crm/reports' }
    ],
    aiCapabilities: ['lead-scoring', 'journey-prediction', 'crm-insights', 'sales-forecasting']
  }
];

// 🚧 NEW PLATFORMS - To be implemented following the roadmap
export const PLANNED_PLATFORMS: PlatformModule[] = [
  // PHASE 1: MARKETING & CONTENT SUITE (Months 1-3)

  {
    id: 'email-marketing-advanced',
    name: 'Email Marketing',
    icon: 'Mail',
    route: '/email',
    category: 'marketing',
    status: 'planning',
    description: 'Advanced email marketing automation and analytics',
    features: ['email-campaigns', 'automation-sequences', 'segmentation', 'a/b-testing'],
    widgets: [
      { type: 'campaign-performance', size: 'large', title: 'Campaign Performance' },
      { type: 'subscriber-growth', size: 'medium', title: 'Subscriber Growth' },
      { type: 'email-analytics', size: 'medium', title: 'Email Analytics' },
      { type: 'automation-status', size: 'small', title: 'Automation Status' }
    ],
    quickActions: [
      { label: 'New Campaign', action: 'create-campaign', icon: 'Plus' },
      { label: 'Design Template', action: 'design-template', icon: 'Palette' },
      { label: 'View Analytics', action: 'view-analytics', icon: 'BarChart3' }
    ],
    aiCapabilities: ['subject-line-optimization', 'send-time-optimization', 'content-personalization']
  },

  {
    id: 'content-management',
    name: 'Content Hub',
    icon: 'FileText',
    route: '/content',
    category: 'marketing',
    status: 'planning',
    description: 'Centralized content creation, management, and optimization',
    features: ['content-creation', 'asset-management', 'seo-optimization', 'content-calendar'],
    widgets: [
      { type: 'content-calendar', size: 'large', title: 'Content Calendar' },
      { type: 'seo-performance', size: 'medium', title: 'SEO Performance' },
      { type: 'content-analytics', size: 'medium', title: 'Content Analytics' },
      { type: 'asset-library', size: 'small', title: 'Asset Library' }
    ],
    quickActions: [
      { label: 'Create Content', action: 'create-content', icon: 'PenTool' },
      { label: 'SEO Analysis', action: 'seo-analysis', icon: 'Search' },
      { label: 'Upload Assets', action: 'upload-assets', icon: 'Upload' }
    ],
    aiCapabilities: ['content-generation', 'seo-optimization', 'content-suggestions']
  },

  // PHASE 2: CORE BUSINESS SUITE (Months 3-6)
  {
    id: 'advanced-crm',
    name: 'Advanced CRM',
    icon: 'Users',
    route: '/crm',
    category: 'business',
    status: 'planning',
    description: 'Comprehensive customer relationship management system',
    features: ['contact-management', 'deal-tracking', 'pipeline-management', 'customer-insights'],
    widgets: [],
    quickActions: [],
    aiCapabilities: ['lead-scoring', 'deal-prediction', 'customer-insights']
  },

  {
    id: 'sales-automation',
    name: 'Sales Automation',
    icon: 'TrendingUp',
    route: '/sales',
    category: 'business', 
    status: 'planning',
    description: 'Automated sales processes and pipeline management',
    features: ['sales-pipeline', 'automation-workflows', 'performance-tracking', 'forecasting'],
    widgets: [],
    quickActions: [],
    aiCapabilities: ['sales-forecasting', 'deal-optimization', 'automated-follow-up']
  },

  {
    id: 'financial-management',
    name: 'Financial Management',
    icon: 'DollarSign',
    route: '/finance',
    category: 'business',
    status: 'planning',
    description: 'Financial tracking, reporting, and budget management',
    features: ['budget-management', 'expense-tracking', 'financial-reporting', 'forecasting'],
    widgets: [],
    quickActions: [],
    aiCapabilities: ['budget-optimization', 'expense-prediction', 'financial-insights']
  }

  // Continue with remaining 14 platforms...
];

// Combined registry for all platforms
export const PLATFORM_REGISTRY = [...EXISTING_PLATFORMS, ...PLANNED_PLATFORMS];

// Platform categories for navigation
export const PLATFORM_CATEGORIES = {
  marketing: 'Marketing Suite',
  business: 'Business Suite', 
  operations: 'Operations Suite',
  commerce: 'Commerce Suite',
  analytics: 'Analytics Suite',
  enterprise: 'Enterprise Suite'
} as const;

// Helper functions
export function getPlatformById(id: string): PlatformModule | undefined {
  return PLATFORM_REGISTRY.find(platform => platform.id === id);
}

export function getPlatformsByCategory(category: string): PlatformModule[] {
  return PLATFORM_REGISTRY.filter(platform => platform.category === category);
}

export function getActivePlatforms(): PlatformModule[] {
  return PLATFORM_REGISTRY.filter(platform => platform.status === 'active');
}

export function getDevelopmentPlatforms(): PlatformModule[] {
  return PLATFORM_REGISTRY.filter(platform => platform.status === 'development');
}