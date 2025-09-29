/**
 * Unified Marketing Platform Registry
 * Consolidates all marketing tools into one comprehensive suite
 */

export interface MarketingPlatform {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  status: 'production' | 'development' | 'planned';
  features: string[];
  integrations: string[];
  widgets: MarketingWidget[];
}

export interface MarketingWidget {
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  dataSource: string;
  refreshInterval?: number;
}

export const MARKETING_PLATFORMS: MarketingPlatform[] = [
  // Platform 1: Campaign Management (Your existing strength)
  {
    id: 'campaigns',
    name: 'Campaign Management',
    description: 'AI-powered cross-platform advertising optimization',
    route: '/marketing/campaigns',
    icon: 'Target',
    status: 'production',
    features: [
      'Google Ads integration',
      'Meta advertising',
      'LinkedIn campaigns', 
      'AI optimization',
      'Budget management',
      'Performance analytics',
      'Lead tracking'
    ],
    integrations: ['google-ads', 'meta-business', 'linkedin-ads'],
    widgets: [
      { type: 'campaign-performance', title: 'Campaign Performance', size: 'large', dataSource: '/api/campaigns/performance' },
      { type: 'active-campaigns', title: 'Active Campaigns', size: 'medium', dataSource: '/api/campaigns/active' },
      { type: 'budget-tracker', title: 'Budget Tracker', size: 'medium', dataSource: '/api/campaigns/budget' },
      { type: 'conversion-funnel', title: 'Conversion Funnel', size: 'large', dataSource: '/api/campaigns/funnel' }
    ]
  },

  // Platform 2: Social Media Hub  
  {
    id: 'social',
    name: 'Social Media Hub',
    description: 'Multi-platform social media management and engagement',
    route: '/marketing/social',
    icon: 'Share2',
    status: 'production',
    features: [
      'Multi-platform posting',
      'Content scheduling',
      'Engagement tracking',
      'Content templates',
      'Analytics dashboard',
      'Competitor analysis',
      'Hashtag optimization'
    ],
    integrations: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
    widgets: [
      { type: 'social-calendar', title: 'Content Calendar', size: 'large', dataSource: '/api/social/calendar' },
      { type: 'engagement-metrics', title: 'Engagement Overview', size: 'medium', dataSource: '/api/social/engagement' },
      { type: 'follower-growth', title: 'Follower Growth', size: 'medium', dataSource: '/api/social/growth' },
      { type: 'top-content', title: 'Top Performing Posts', size: 'medium', dataSource: '/api/social/top-posts' }
    ]
  },

  // Platform 3: Email Marketing
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Advanced email campaigns with automation and segmentation',
    route: '/marketing/email',
    icon: 'Mail',
    status: 'production', 
    features: [
      'Campaign management',
      'Marketing automation',
      'Advanced segmentation',
      'A/B testing',
      'Template library',
      'Deliverability optimization',
      'Analytics & reporting'
    ],
    integrations: ['sendgrid', 'mailgun', 'ses'],
    widgets: [
      { type: 'email-performance', title: 'Email Performance', size: 'large', dataSource: '/api/email/performance' },
      { type: 'subscriber-growth', title: 'Subscriber Growth', size: 'medium', dataSource: '/api/email/subscribers' },
      { type: 'automation-status', title: 'Automation Status', size: 'medium', dataSource: '/api/email/automation' },
      { type: 'deliverability', title: 'Deliverability Score', size: 'small', dataSource: '/api/email/deliverability' }
    ]
  },

  // Platform 4: Content Studio
  {
    id: 'content',
    name: 'Content Studio', 
    description: 'AI-powered content creation and asset management',
    route: '/marketing/content',
    icon: 'PenTool',
    status: 'production',
    features: [
      'AI content generation',
      'Asset management',
      'Brand guidelines',
      'Content calendar',
      'Cross-platform publishing',
      'Performance tracking',
      'Collaboration tools'
    ],
    integrations: ['openai', 'claude', 'dall-e', 'unsplash'],
    widgets: [
      { type: 'content-pipeline', title: 'Content Pipeline', size: 'large', dataSource: '/api/content/pipeline' },
      { type: 'asset-library', title: 'Asset Library', size: 'medium', dataSource: '/api/content/assets' },
      { type: 'ai-suggestions', title: 'AI Suggestions', size: 'medium', dataSource: '/api/content/ai-suggestions' },
      { type: 'brand-consistency', title: 'Brand Consistency', size: 'small', dataSource: '/api/content/brand-score' }
    ]
  }
];

// Cross-platform marketing automation workflows
export const MARKETING_WORKFLOWS = [
  {
    id: 'lead-nurture',
    name: 'Lead Nurturing Sequence',
    description: 'Automated lead nurturing across email, social, and retargeting',
    platforms: ['campaigns', 'email', 'social'],
    triggers: ['form_submission', 'email_signup', 'ad_click'],
    actions: [
      'send_welcome_email',
      'add_to_retargeting_audience', 
      'schedule_social_follow_up',
      'create_lookalike_audience'
    ]
  },
  {
    id: 'content-promotion',
    name: 'Content Promotion Campaign',
    description: 'Automatic promotion of new content across all channels',
    platforms: ['content', 'social', 'email', 'campaigns'],
    triggers: ['content_published'],
    actions: [
      'create_social_posts',
      'send_email_newsletter',
      'create_promotion_ads',
      'optimize_distribution'
    ]
  }
];

export function getMarketingPlatforms() {
  return MARKETING_PLATFORMS;
}

export function getMarketingPlatform(id: string) {
  return MARKETING_PLATFORMS.find(platform => platform.id === id);
}

export function getAllMarketingWidgets() {
  return MARKETING_PLATFORMS.flatMap(platform => 
    platform.widgets.map(widget => ({
      ...widget,
      platformId: platform.id,
      id: `${platform.id}-${widget.type}`
    }))
  );
}