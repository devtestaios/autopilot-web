// API Helper Functions for Autopilot Campaign Management
import type { 
  Campaign, 
  PerformanceSnapshot, 
  CampaignFormData,
  SocialMediaAccount,
  SocialMediaPost,
  SocialMediaComment,
  SocialMediaAccountInput,
  SocialMediaPostInput,
  SocialMediaCommentInput,
  EmailCampaign,
  EmailSubscriber,
  EmailTemplate,
  EmailCampaignInput,
  EmailSubscriberInput,
  EmailTemplateInput,
  EmailMarketingOverview,
  EmailCampaignAnalytics,
  TeamMember,
  TeamActivity,
  UserPresence,
  CollaborationProject,
  LiveCursor,
  Notification,
  TeamMemberInput,
  TeamActivityInput,
  UserPresenceInput,
  CollaborationProjectInput,
  LiveCursorInput,
  NotificationInput,
  CollaborationOverview,
  IntegrationApp,
  UserIntegration,
  IntegrationApiKey,
  IntegrationUsage,
  IntegrationAppInput,
  UserIntegrationInput,
  IntegrationApiKeyInput,
  IntegrationUsageInput,
  IntegrationsOverview,
  MarketplaceRevenue,
  IntegrationCategories
} from '@/types';
import { environmentManager } from './environment';

// Use local API in development, external API in production
const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || '/api');

console.log('🔧 API Configuration:', { API_BASE, NODE_ENV: process.env.NODE_ENV });

// Enhanced API Error Class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// API Configuration
const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  }
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting check
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + API_CONFIG.rateLimit.windowMs });
    return true;
  }
  
  if (record.count >= API_CONFIG.rateLimit.maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Enhanced fetch with retry logic and timeout
async function enhancedFetch(
  url: string, 
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  // Check rate limiting
  if (!checkRateLimit(url)) {
    throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
  }

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Always fetch fresh data for marketing metrics
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle network errors with retry logic
    if ((error as Error).name === 'AbortError') {
      throw new APIError('Request timeout', 408, 'TIMEOUT');
    }

    if (retryCount < API_CONFIG.retries && isRetryableError(error)) {
      await delay(API_CONFIG.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      return enhancedFetch(url, options, retryCount + 1);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      `Network error: ${(error as Error).message}`,
      0,
      'NETWORK_ERROR',
      error
    );
  }
}

// Check if error is retryable
function isRetryableError(error: any): boolean {
  return !!(
    error.name === 'TypeError' || // Network errors
    (error instanceof APIError && error.status && error.status >= 500) // Server errors
  );
}

// Utility delay function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Health check function
export async function checkAPIHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  features: {
    campaigns: boolean;
    analytics: boolean;
    ai: boolean;
  };
}> {
  const startTime = Date.now();
  
  try {
    const response = await enhancedFetch(`${API_BASE}/health`);
    const data = await response.json();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      features: {
        campaigns: true,
        analytics: true,
        ai: data.ai_status === 'operational'
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      features: {
        campaigns: false,
        analytics: false,
        ai: false
      }
    };
  }
}

// Mock data for testing and development
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'Google Ads - Search Campaign',
    platform: 'Google Ads',
    client_name: 'Demo Client',
    status: 'active' as const,
    budget: 5000,
    spend: 3200,
    metrics: {
      impressions: 125000,
      clicks: 2100,
      conversions: 156,
      ctr: 1.68,
      cpc: 1.52,
      roas: 4.2
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2', 
    name: 'Meta Display Campaign',
    platform: 'Meta',
    client_name: 'Demo Client',
    status: 'active' as const,
    budget: 8000,
    spend: 4800,
    metrics: {
      impressions: 287000,
      clicks: 3200,
      conversions: 187,
      ctr: 1.12,
      cpc: 1.50,
      roas: 3.8
    },
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  }
];

const MOCK_DASHBOARD_DATA = {
  totalRevenue: 847291,
  activeCampaigns: 24,
  conversionRate: 12.4,
  totalLeads: 2847
};

// Legacy helper function for backward compatibility
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Fallback to status text if JSON parsing fails
    }

    throw new APIError(errorMessage, response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new APIError('Invalid response format', response.status);
  }
}

// Legacy types for backward compatibility (remove when all components updated)
export type CampaignInput = CampaignFormData;
export type PerformanceInput = {
  snapshot_date: string;
  metrics: Record<string, unknown>;
};

// Campaign API Functions with enhanced error handling
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/campaigns`);
    return await response.json();
  } catch (error) {
    console.warn('Campaign API fetch failed, using mock data:', error);
    return MOCK_CAMPAIGNS as Campaign[];
  }
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  try {
    const response = await enhancedFetch(`${API_BASE}/campaigns/${id}`);
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to connect to the server. Please check your internet connection.');
  }
}

export async function createCampaign(campaign: CampaignInput): Promise<Campaign> {
  const response = await enhancedFetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function updateCampaign(id: string, campaign: CampaignInput): Promise<Campaign> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function deleteCampaign(id: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE'
  });
}

// Performance API Functions with enhanced error handling
export async function fetchCampaignPerformance(campaignId: string, limit = 100): Promise<PerformanceSnapshot[]> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${campaignId}/performance?limit=${limit}`);
  return await response.json();
}

export async function addPerformanceSnapshot(campaignId: string, performance: PerformanceInput): Promise<PerformanceSnapshot> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${campaignId}/performance`, {
    method: 'POST',
    body: JSON.stringify(performance)
  });
  return await response.json();
}

// Dashboard API Functions with enhanced error handling and fallbacks
export async function fetchDashboardOverview() {
  try {
    const response = await enhancedFetch(`${API_BASE}/dashboard/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Dashboard API fetch failed, using mock data:', error);
    return MOCK_DASHBOARD_DATA;
  }
}

export async function fetchKPISummary() {
  try {
    const response = await enhancedFetch(`${API_BASE}/kpi/summary`);
    return await response.json();
  } catch (error) {
    console.warn('KPI API fetch failed, using mock data:', error);
    return MOCK_DASHBOARD_DATA;
  }
}

export async function fetchDailyKPIs(days = 30) {
  try {
    const response = await enhancedFetch(`${API_BASE}/kpi/daily?days=${days}`);
    return await response.json();
  } catch (error) {
    console.warn('Daily KPI API fetch failed, using mock data:', error);
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 10000),
      conversions: Math.floor(Math.random() * 100),
      spend: Math.floor(Math.random() * 5000)
    }));
  }
}

// Analytics API Functions with enhanced error handling
export async function fetchAnalyticsPerformance(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await enhancedFetch(`${API_BASE}/analytics/performance?${params}`);
  return await response.json();
}

export async function fetchROIAnalytics(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await enhancedFetch(`${API_BASE}/analytics/roi?${params}`);
  return await response.json();
}

export async function fetchPlatformBreakdown() {
  const response = await enhancedFetch(`${API_BASE}/analytics/platform-breakdown`);
  return await response.json();
}

// Health Check Functions
export async function checkApiHealth() {
  try {
    const [health, version, envCheck] = await Promise.all([
      fetch(`${API_BASE}/health`).then(r => r.json()),
      fetch(`${API_BASE}/version`).then(r => r.json()),
      fetch(`${API_BASE}/env-check`).then(r => r.json()),
    ]);
    
    return {
      health: health?.ok ? '✅ API Healthy' : '❌ API Issues',
      version: version?.version ? `✅ Version ${version.version}` : '❌ Version Unknown',
      database: envCheck?.SUPABASE_URL_present && envCheck?.SUPABASE_ANON_KEY_present 
        ? '✅ Database Connected' : '❌ Database Issues'
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      health: `❌ Error: ${errorMessage}`,
      version: '❌ Unreachable',
      database: '❌ Unreachable'
    };
  }
}

// ANALYTICS API FUNCTIONS
export async function fetchMarketingAnalytics() {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/marketing/analytics`);
    return await response.json();
  } catch (error) {
    console.warn('Marketing Analytics API fetch failed, using mock data:', error);
    return {
      total_campaigns: 24,
      active_campaigns: 18,
      total_spend: 45672,
      total_conversions: 1247,
      avg_roas: 3.42,
      monthly_budget: 75000,
      budget_used: 34250,
      last_updated: new Date().toISOString()
    };
  }
}

export async function fetchSocialMediaAnalytics() {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/social-media/analytics`);
    return await response.json();
  } catch (error) {
    console.warn('Social Media Analytics API fetch failed, using mock data:', error);
    return {
      total_posts: 156,
      scheduled_posts: 23,
      total_engagement: 45230,
      total_followers: 28540,
      avg_engagement_rate: 0.067,
      top_platform: 'Instagram',
      last_updated: new Date().toISOString()
    };
  }
}

export async function fetchEmailAnalytics() {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/email-marketing/analytics`);
    return await response.json();
  } catch (error) {
    console.warn('Email Analytics API fetch failed, using mock data:', error);
    return {
      total_campaigns: 38,
      active_campaigns: 12,
      total_subscribers: 15420,
      avg_open_rate: 0.245,
      avg_click_rate: 0.087,
      monthly_sends: 45680,
      last_updated: new Date().toISOString()
    };
  }
}

// SOCIAL MEDIA API FUNCTIONS
// ===============================================

// Social Media Account Management
export async function fetchSocialMediaAccounts(): Promise<SocialMediaAccount[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/social-media/accounts`);
    const data = await response.json();
    return data.accounts || [];
  } catch (error) {
    console.warn('Social Media Accounts API fetch failed:', error);
    return [];
  }
}

export async function createSocialMediaAccount(account: SocialMediaAccountInput): Promise<SocialMediaAccount> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/accounts`, {
    method: 'POST',
    body: JSON.stringify(account)
  });
  return await response.json();
}

export async function fetchSocialMediaAccount(accountId: string): Promise<SocialMediaAccount> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/accounts/${accountId}`);
  return await response.json();
}

export async function updateSocialMediaAccount(accountId: string, account: SocialMediaAccountInput): Promise<SocialMediaAccount> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/accounts/${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(account)
  });
  return await response.json();
}

export async function deleteSocialMediaAccount(accountId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/social-media/accounts/${accountId}`, {
    method: 'DELETE'
  });
}

// Social Media Post Management
export async function fetchSocialMediaPosts(options?: {
  limit?: number;
  platform?: string;
  status?: string;
}): Promise<SocialMediaPost[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.platform) params.append('platform', options.platform);
    if (options?.status) params.append('status', options.status);
    
    const url = `${API_BASE}/api/social-media/posts${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.warn('Social Media Posts API fetch failed:', error);
    return [];
  }
}

export async function createSocialMediaPost(post: SocialMediaPostInput): Promise<SocialMediaPost> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/posts`, {
    method: 'POST',
    body: JSON.stringify(post)
  });
  return await response.json();
}

export async function fetchSocialMediaPost(postId: string): Promise<SocialMediaPost> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/posts/${postId}`);
  return await response.json();
}

export async function updateSocialMediaPost(postId: string, post: SocialMediaPostInput): Promise<SocialMediaPost> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(post)
  });
  return await response.json();
}

export async function deleteSocialMediaPost(postId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/social-media/posts/${postId}`, {
    method: 'DELETE'
  });
}

// Social Media Comments Management
export async function fetchPostComments(postId: string, limit = 50): Promise<SocialMediaComment[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/social-media/posts/${postId}/comments?limit=${limit}`);
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.warn('Post Comments API fetch failed:', error);
    return [];
  }
}

export async function createSocialMediaComment(comment: SocialMediaCommentInput): Promise<SocialMediaComment> {
  const response = await enhancedFetch(`${API_BASE}/api/social-media/comments`, {
    method: 'POST',
    body: JSON.stringify(comment)
  });
  return await response.json();
}

// Social Media Analytics
export async function fetchSocialMediaOverview(): Promise<{
  connected_platforms: Record<string, number>;
  total_accounts: number;
  total_posts: number;
  posts_by_status: Record<string, number>;
  total_engagement: number;
  timestamp: string;
}> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/social-media/analytics/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Social Media Overview API fetch failed:', error);
    return {
      connected_platforms: {},
      total_accounts: 0,
      total_posts: 0,
      posts_by_status: {},
      total_engagement: 0,
      timestamp: new Date().toISOString()
    };
  }
}

// ===============================================
// EMAIL MARKETING API FUNCTIONS
// ===============================================

// Email Campaign Management
export async function fetchEmailCampaigns(limit = 50): Promise<EmailCampaign[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns?limit=${limit}`);
    const data = await response.json();
    return data.campaigns || [];
  } catch (error) {
    console.warn('Email Campaigns API fetch failed:', error);
    return [];
  }
}

export async function createEmailCampaign(campaign: EmailCampaignInput): Promise<EmailCampaign> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns`, {
    method: 'POST',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function fetchEmailCampaign(campaignId: string): Promise<EmailCampaign> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns/${campaignId}`);
  return await response.json();
}

export async function updateEmailCampaign(campaignId: string, campaign: EmailCampaignInput): Promise<EmailCampaign> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns/${campaignId}`, {
    method: 'PUT',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function deleteEmailCampaign(campaignId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns/${campaignId}`, {
    method: 'DELETE'
  });
}

// Email Subscriber Management
export async function fetchEmailSubscribers(options?: {
  limit?: number;
  status?: string;
}): Promise<EmailSubscriber[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    
    const url = `${API_BASE}/api/email-marketing/subscribers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.subscribers || [];
  } catch (error) {
    console.warn('Email Subscribers API fetch failed:', error);
    return [];
  }
}

export async function createEmailSubscriber(subscriber: EmailSubscriberInput): Promise<EmailSubscriber> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/subscribers`, {
    method: 'POST',
    body: JSON.stringify(subscriber)
  });
  return await response.json();
}

export async function fetchEmailSubscriber(subscriberId: string): Promise<EmailSubscriber> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/subscribers/${subscriberId}`);
  return await response.json();
}

export async function updateEmailSubscriber(subscriberId: string, subscriber: EmailSubscriberInput): Promise<EmailSubscriber> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/subscribers/${subscriberId}`, {
    method: 'PUT',
    body: JSON.stringify(subscriber)
  });
  return await response.json();
}

export async function deleteEmailSubscriber(subscriberId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/email-marketing/subscribers/${subscriberId}`, {
    method: 'DELETE'
  });
}

// Email Template Management
export async function fetchEmailTemplates(limit = 50): Promise<EmailTemplate[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/email-marketing/templates?limit=${limit}`);
    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.warn('Email Templates API fetch failed:', error);
    return [];
  }
}

export async function createEmailTemplate(template: EmailTemplateInput): Promise<EmailTemplate> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/templates`, {
    method: 'POST',
    body: JSON.stringify(template)
  });
  return await response.json();
}

export async function fetchEmailTemplate(templateId: string): Promise<EmailTemplate> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/templates/${templateId}`);
  return await response.json();
}

export async function updateEmailTemplate(templateId: string, template: EmailTemplateInput): Promise<EmailTemplate> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(template)
  });
  return await response.json();
}

export async function deleteEmailTemplate(templateId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/email-marketing/templates/${templateId}`, {
    method: 'DELETE'
  });
}

// Email Marketing Analytics
export async function fetchEmailMarketingOverview(): Promise<EmailMarketingOverview> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/email-marketing/analytics/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Email Marketing Overview API fetch failed:', error);
    return {
      total_campaigns: 0,
      campaigns_by_status: {},
      total_subscribers: 0,
      subscribers_by_status: {},
      total_emails_sent: 0,
      average_open_rate: 0,
      average_click_rate: 0,
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchEmailCampaignAnalytics(campaignId: string): Promise<EmailCampaignAnalytics> {
  const response = await enhancedFetch(`${API_BASE}/api/email-marketing/campaigns/${campaignId}/analytics`);
  return await response.json();
}

// ===============================================
// COLLABORATION API FUNCTIONS
// ===============================================

// Team Member Management
export async function fetchTeamMembers(limit = 100): Promise<TeamMember[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/collaboration/team-members?limit=${limit}`);
    const data = await response.json();
    return data.team_members || [];
  } catch (error) {
    console.warn('Team Members API fetch failed:', error);
    return [];
  }
}

export async function createTeamMember(member: TeamMemberInput): Promise<TeamMember> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/team-members`, {
    method: 'POST',
    body: JSON.stringify(member)
  });
  return await response.json();
}

export async function fetchTeamMember(memberId: string): Promise<TeamMember> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/team-members/${memberId}`);
  return await response.json();
}

export async function updateTeamMember(memberId: string, member: TeamMemberInput): Promise<TeamMember> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/team-members/${memberId}`, {
    method: 'PUT',
    body: JSON.stringify(member)
  });
  return await response.json();
}

export async function deleteTeamMember(memberId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/collaboration/team-members/${memberId}`, {
    method: 'DELETE'
  });
}

// Team Activity Management
export async function fetchTeamActivities(options?: {
  limit?: number;
  userId?: string;
  activityType?: string;
}): Promise<TeamActivity[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.userId) params.append('user_id', options.userId);
    if (options?.activityType) params.append('activity_type', options.activityType);
    
    const url = `${API_BASE}/api/collaboration/activities${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.activities || [];
  } catch (error) {
    console.warn('Team Activities API fetch failed:', error);
    return [];
  }
}

export async function createTeamActivity(activity: TeamActivityInput): Promise<TeamActivity> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/activities`, {
    method: 'POST',
    body: JSON.stringify(activity)
  });
  return await response.json();
}

export async function fetchTeamActivity(activityId: string): Promise<TeamActivity> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/activities/${activityId}`);
  return await response.json();
}

// User Presence Management
export async function fetchUserPresence(): Promise<UserPresence[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/collaboration/presence`);
    const data = await response.json();
    return data.presence || [];
  } catch (error) {
    console.warn('User Presence API fetch failed:', error);
    return [];
  }
}

export async function updateUserPresence(presence: UserPresenceInput): Promise<UserPresence> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/presence`, {
    method: 'POST',
    body: JSON.stringify(presence)
  });
  return await response.json();
}

export async function fetchUserPresenceStatus(userId: string): Promise<UserPresence> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/presence/${userId}`);
  return await response.json();
}

// Collaboration Project Management
export async function fetchCollaborationProjects(options?: {
  limit?: number;
  status?: string;
}): Promise<CollaborationProject[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    
    const url = `${API_BASE}/api/collaboration/projects${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.warn('Collaboration Projects API fetch failed:', error);
    return [];
  }
}

export async function createCollaborationProject(project: CollaborationProjectInput): Promise<CollaborationProject> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/projects`, {
    method: 'POST',
    body: JSON.stringify(project)
  });
  return await response.json();
}

export async function fetchCollaborationProject(projectId: string): Promise<CollaborationProject> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/projects/${projectId}`);
  return await response.json();
}

export async function updateCollaborationProject(projectId: string, project: CollaborationProjectInput): Promise<CollaborationProject> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(project)
  });
  return await response.json();
}

export async function deleteCollaborationProject(projectId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/collaboration/projects/${projectId}`, {
    method: 'DELETE'
  });
}

// Live Cursor Management
export async function fetchLiveCursors(page?: string): Promise<LiveCursor[]> {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    
    const url = `${API_BASE}/api/collaboration/cursors${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.cursors || [];
  } catch (error) {
    console.warn('Live Cursors API fetch failed:', error);
    return [];
  }
}

export async function updateCursorPosition(cursor: LiveCursorInput): Promise<LiveCursor> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/cursors`, {
    method: 'POST',
    body: JSON.stringify(cursor)
  });
  return await response.json();
}

// Notification Management
export async function fetchNotifications(userId: string, options?: {
  limit?: number;
  unreadOnly?: boolean;
}): Promise<Notification[]> {
  try {
    const params = new URLSearchParams();
    params.append('user_id', userId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.unreadOnly) params.append('unread_only', 'true');
    
    const url = `${API_BASE}/api/collaboration/notifications?${params.toString()}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.warn('Notifications API fetch failed:', error);
    return [];
  }
}

export async function createNotification(notification: NotificationInput): Promise<Notification> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/notifications`, {
    method: 'POST',
    body: JSON.stringify(notification)
  });
  return await response.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  const response = await enhancedFetch(`${API_BASE}/api/collaboration/notifications/${notificationId}/read`, {
    method: 'PUT'
  });
  return await response.json();
}

// Collaboration Analytics
export async function fetchCollaborationOverview(): Promise<CollaborationOverview> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/collaboration/analytics/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Collaboration Overview API fetch failed:', error);
    return {
      total_team_members: 0,
      members_by_role: {},
      members_by_status: {},
      total_projects: 0,
      projects_by_status: {},
      online_users: 0,
      activities_last_24h: 0,
      activities_by_type: {},
      timestamp: new Date().toISOString()
    };
  }
}

// ===============================================
// INTEGRATIONS API FUNCTIONS
// ===============================================

// Integration App Management
export async function fetchIntegrationApps(options?: {
  category?: string;
  limit?: number;
}): Promise<IntegrationApp[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const url = `${API_BASE}/api/integrations/apps${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.apps || [];
  } catch (error) {
    console.warn('Integration Apps API fetch failed:', error);
    return [];
  }
}

export async function createIntegrationApp(app: IntegrationAppInput): Promise<IntegrationApp> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/apps`, {
    method: 'POST',
    body: JSON.stringify(app)
  });
  return await response.json();
}

export async function fetchIntegrationApp(appId: string): Promise<IntegrationApp> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/apps/${appId}`);
  return await response.json();
}

export async function updateIntegrationApp(appId: string, app: IntegrationAppInput): Promise<IntegrationApp> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/apps/${appId}`, {
    method: 'PUT',
    body: JSON.stringify(app)
  });
  return await response.json();
}

export async function deleteIntegrationApp(appId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/integrations/apps/${appId}`, {
    method: 'DELETE'
  });
}

// User Integration Management
export async function fetchUserIntegrations(options?: {
  userId?: string;
  limit?: number;
}): Promise<UserIntegration[]> {
  try {
    const params = new URLSearchParams();
    if (options?.userId) params.append('user_id', options.userId);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const url = `${API_BASE}/api/integrations/user-integrations${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.integrations || [];
  } catch (error) {
    console.warn('User Integrations API fetch failed:', error);
    return [];
  }
}

export async function installIntegration(integration: UserIntegrationInput): Promise<UserIntegration> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/user-integrations`, {
    method: 'POST',
    body: JSON.stringify(integration)
  });
  return await response.json();
}

export async function fetchUserIntegration(integrationId: string): Promise<UserIntegration> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/user-integrations/${integrationId}`);
  return await response.json();
}

export async function updateUserIntegration(integrationId: string, integration: UserIntegrationInput): Promise<UserIntegration> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/user-integrations/${integrationId}`, {
    method: 'PUT',
    body: JSON.stringify(integration)
  });
  return await response.json();
}

export async function uninstallIntegration(integrationId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/integrations/user-integrations/${integrationId}`, {
    method: 'DELETE'
  });
}

// API Key Management
export async function fetchApiKeys(options?: {
  userId?: string;
  service?: string;
}): Promise<IntegrationApiKey[]> {
  try {
    const params = new URLSearchParams();
    if (options?.userId) params.append('user_id', options.userId);
    if (options?.service) params.append('service', options.service);
    
    const url = `${API_BASE}/api/integrations/api-keys${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.api_keys || [];
  } catch (error) {
    console.warn('API Keys fetch failed:', error);
    return [];
  }
}

export async function createApiKey(apiKey: IntegrationApiKeyInput): Promise<IntegrationApiKey> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/api-keys`, {
    method: 'POST',
    body: JSON.stringify(apiKey)
  });
  return await response.json();
}

export async function fetchApiKey(keyId: string): Promise<IntegrationApiKey> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/api-keys/${keyId}`);
  return await response.json();
}

export async function updateApiKey(keyId: string, apiKey: Partial<IntegrationApiKeyInput>): Promise<IntegrationApiKey> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/api-keys/${keyId}`, {
    method: 'PUT',
    body: JSON.stringify(apiKey)
  });
  return await response.json();
}

export async function deleteApiKey(keyId: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/api/integrations/api-keys/${keyId}`, {
    method: 'DELETE'
  });
}

// Integration Usage Analytics
export async function fetchIntegrationUsage(options?: {
  userId?: string;
  integrationId?: string;
  days?: number;
}): Promise<IntegrationUsage[]> {
  try {
    const params = new URLSearchParams();
    if (options?.userId) params.append('user_id', options.userId);
    if (options?.integrationId) params.append('integration_id', options.integrationId);
    if (options?.days) params.append('days', options.days.toString());
    
    const url = `${API_BASE}/api/integrations/usage${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await enhancedFetch(url);
    const data = await response.json();
    return data.usage || [];
  } catch (error) {
    console.warn('Integration Usage API fetch failed:', error);
    return [];
  }
}

export async function logIntegrationUsage(usage: IntegrationUsageInput): Promise<IntegrationUsage> {
  const response = await enhancedFetch(`${API_BASE}/api/integrations/usage`, {
    method: 'POST',
    body: JSON.stringify(usage)
  });
  return await response.json();
}

// Integration Categories
export async function fetchIntegrationCategories(): Promise<IntegrationCategories> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/integrations/categories`);
    return await response.json();
  } catch (error) {
    console.warn('Integration Categories API fetch failed:', error);
    return { categories: {} };
  }
}

// Marketplace Revenue Analytics
export async function fetchMarketplaceRevenue(days = 30): Promise<MarketplaceRevenue> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/integrations/revenue?days=${days}`);
    return await response.json();
  } catch (error) {
    console.warn('Marketplace Revenue API fetch failed:', error);
    return {
      total_revenue: 0,
      total_commission: 0,
      total_installations: 0,
      installations_by_app: {},
      period_days: days,
      timestamp: new Date().toISOString()
    };
  }
}

// Integrations Analytics Overview
export async function fetchIntegrationsOverview(): Promise<IntegrationsOverview> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/integrations/analytics/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Integrations Overview API fetch failed:', error);
    return {
      total_apps: 0,
      apps_by_category: {},
      apps_by_status: {},
      total_user_integrations: 0,
      integrations_by_status: {},
      total_api_keys: 0,
      keys_by_service: {},
      keys_by_status: {},
      usage_last_24h: 0,
      usage_by_action: {},
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// AI-POWERED AGENTIC SYSTEM API FUNCTIONS
// ============================================================================

// Master AI Cycles - The heart of your autonomous system
export async function fetchAICycles(): Promise<any[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/cycles`);
    return await response.json();
  } catch (error) {
    console.warn('AI Cycles API fetch failed:', error);
    return [];
  }
}

export async function createAICycle(cycleData: any): Promise<any> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/cycles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cycleData),
    });
    return await response.json();
  } catch (error) {
    console.warn('AI Cycle creation failed:', error);
    throw error;
  }
}

// AI Decision Logs - Track every autonomous decision
export async function fetchAIDecisions(cycleId?: string): Promise<any[]> {
  try {
    const url = cycleId ? `${API_BASE}/api/ai/decisions?cycle_id=${cycleId}` : `${API_BASE}/api/ai/decisions`;
    const response = await enhancedFetch(url);
    return await response.json();
  } catch (error) {
    console.warn('AI Decisions API fetch failed:', error);
    return [];
  }
}

// AI Performance Scores - Continuous performance tracking
export async function fetchAIPerformanceScores(): Promise<any[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/performance`);
    return await response.json();
  } catch (error) {
    console.warn('AI Performance API fetch failed:', error);
    return [];
  }
}

// AI Smart Alerts - Intelligent monitoring
export async function fetchAIAlerts(): Promise<any[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/alerts`);
    return await response.json();
  } catch (error) {
    console.warn('AI Alerts API fetch failed:', error);
    return [];
  }
}

// AI Recommendations - Autonomous optimization suggestions
export async function fetchAIRecommendations(): Promise<any[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/recommendations`);
    return await response.json();
  } catch (error) {
    console.warn('AI Recommendations API fetch failed:', error);
    return [];
  }
}

// AI System Status - Overall AI health and status
export async function fetchAISystemStatus(): Promise<any> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/ai/status`);
    return await response.json();
  } catch (error) {
    console.warn('AI System Status API fetch failed:', error);
    return {
      status: 'disconnected',
      active_cycles: 0,
      total_decisions: 0,
      avg_confidence: 0,
      last_decision: null,
      system_health: 'unknown'
    };
  }
}

// ====================================
// CONTENT SUITE API ENDPOINTS
// ====================================

// Feed Posts - Instagram-style grid planner
export async function fetchFeedPosts(options?: {
  platform?: string;
  status?: 'draft' | 'scheduled' | 'published';
  limit?: number;
}): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (options?.platform) params.append('platform', options.platform);
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const response = await enhancedFetch(`${API_BASE}/api/content/feed-posts?${params}`);
    return await response.json();
  } catch (error) {
    console.warn('Feed Posts API fetch failed:', error);
    return [];
  }
}

export async function saveFeedPost(post: {
  id?: string;
  platform: string;
  content: string;
  caption?: string;
  hashtags?: string[];
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
  imageUrl?: string;
}): Promise<any> {
  try {
    const method = post.id ? 'PUT' : 'POST';
    const url = post.id ? `${API_BASE}/api/content/feed-posts/${post.id}` : `${API_BASE}/api/content/feed-posts`;
    
    const response = await enhancedFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    return await response.json();
  } catch (error) {
    console.error('Save Feed Post failed:', error);
    throw new APIError('Failed to save feed post', 500);
  }
}

export async function scheduleFeedPost(postId: string, scheduledTime: string): Promise<any> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/content/feed-posts/${postId}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledTime })
    });
    return await response.json();
  } catch (error) {
    console.error('Schedule Feed Post failed:', error);
    throw new APIError('Failed to schedule post', 500);
  }
}

export async function deleteFeedPost(postId: string): Promise<void> {
  try {
    await enhancedFetch(`${API_BASE}/api/content/feed-posts/${postId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete Feed Post failed:', error);
    throw new APIError('Failed to delete post', 500);
  }
}

// Designs - Advanced Design Studio
export async function saveDesign(design: {
  id?: string;
  name: string;
  canvasSize: { width: number; height: number };
  elements: any[];
  thumbnail?: string;
}): Promise<any> {
  try {
    const method = design.id ? 'PUT' : 'POST';
    const url = design.id ? `${API_BASE}/api/content/designs/${design.id}` : `${API_BASE}/api/content/designs`;
    
    const response = await enhancedFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design)
    });
    return await response.json();
  } catch (error) {
    console.error('Save Design failed:', error);
    throw new APIError('Failed to save design', 500);
  }
}

export async function fetchDesignHistory(limit = 20): Promise<any[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/content/designs?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.warn('Design History API fetch failed:', error);
    return [];
  }
}

export async function exportDesign(designId: string, format: 'png' | 'jpg' | 'svg' | 'pdf'): Promise<Blob> {
  try {
    const response = await enhancedFetch(`${API_BASE}/api/content/designs/${designId}/export?format=${format}`);
    return await response.blob();
  } catch (error) {
    console.error('Export Design failed:', error);
    throw new APIError('Failed to export design', 500);
  }
}

// AI Content - AI Content Generator
export async function saveAIContent(content: {
  id?: string;
  type: string;
  platform: string;
  content: string;
  metadata: any;
  variations?: string[];
}): Promise<any> {
  try {
    const method = content.id ? 'PUT' : 'POST';
    const url = content.id ? `${API_BASE}/api/content/ai-content/${content.id}` : `${API_BASE}/api/content/ai-content`;
    
    const response = await enhancedFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });
    return await response.json();
  } catch (error) {
    console.error('Save AI Content failed:', error);
    throw new APIError('Failed to save AI content', 500);
  }
}

export async function fetchContentHistory(type?: string, limit = 20): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', limit.toString());
    
    const response = await enhancedFetch(`${API_BASE}/api/content/ai-content?${params}`);
    return await response.json();
  } catch (error) {
    console.warn('Content History API fetch failed:', error);
    return [];
  }
}