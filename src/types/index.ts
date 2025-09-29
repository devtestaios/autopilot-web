// Core application types for Autopilot Marketing Platform

export interface Lead {
  id: string;
  name: string | null;
  email: string;
  company?: string;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend: number;
  status: 'active' | 'paused' | 'ended';
  metrics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PerformanceSnapshot {
  id: string;
  campaign_id: string;
  date: string;
  snapshot_date?: string; // For backward compatibility
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr?: number;
  cpc?: number;
  cpa?: number;
  roas?: number;
  metrics?: Record<string, unknown>; // For additional metrics
  created_at: string;
}

export interface DashboardOverview {
  total_campaigns: number;
  total_spend: number;
  recent_spend_7d: number;
  recent_conversions_7d: number;
  campaigns_by_status: Record<string, number>;
}

// Analytics and Dashboard Types
export interface AnalyticsPerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface AnalyticsOverview {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  avgCtr: number;
  avgCpc: number;
  avgCpa: number;
  roas: number;
}

export interface PlatformBreakdownData {
  platform: string;
  spend: number;
  conversions: number;
  impressions: number;
  clicks: number;
  color?: string;
  [key: string]: any; // Make chart-compatible
}

export interface AnalyticsPerformanceResponse {
  overview: AnalyticsOverview;
  dailyMetrics: AnalyticsPerformanceData[];
  platformBreakdown: PlatformBreakdownData[];
}

export interface ROIAnalyticsData {
  campaign: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  profit: number;
  margin: number;
}

export interface PlatformBreakdown {
  platform: string;
  spend: number;
  revenue: number;
  campaigns: number;
  conversions: number;
  roas: number;
}

export interface KPISummary {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_revenue: number;
  total_conversions: number;
  average_roas: number;
  average_cpc: number;
  average_ctr: number;
}

export interface DailyKPI {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  campaigns_active: number;
}

export interface KPISummary {
  total_leads: number;
  total_campaigns: number;
  total_revenue: number;
  avg_cpa: number;
  avg_roas: number;
}

export interface DailyKPI {
  date: string;
  leads: number;
  spend: number;
  revenue: number;
  roas: number;
}

export interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  database_connected: boolean;
  environment: string;
}

// Form types
export interface CampaignFormData {
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  status?: string;
  metrics?: Record<string, unknown>;
}

export interface LeadFormData {
  name: string;
  email: string;
  company?: string;
  source: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Social Media types
export interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest';
  username: string;
  display_name?: string;
  avatar_url?: string;
  is_connected: boolean;
  followers: number;
  following?: number;
  posts_count?: number;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  permissions: string[];
  status: 'active' | 'expired' | 'limited' | 'suspended' | 'disconnected';
  account_metrics: Record<string, any>;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaPost {
  id: string;
  content: string;
  media_urls: string[];
  target_accounts: string[]; // Account IDs to post to
  scheduled_date?: string;
  published_date?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'deleted' | 'archived';
  post_type: 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel';
  hashtags: string[];
  mentions: string[];
  location?: {
    name: string;
    lat: number;
    lng: number;
    place_id?: string;
  };
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
    impressions: number;
  };
  platform_post_ids: Record<string, string>; // Platform-specific post IDs
  campaign_id?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'requires_changes';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaComment {
  id: string;
  post_id: string;
  platform: string;
  platform_comment_id: string;
  author_username: string;
  author_name?: string;
  comment_text: string;
  parent_comment_id?: string;
  likes_count: number;
  reply_count: number;
  is_reply: boolean;
  sentiment_score?: number; // -1 to 1 sentiment analysis
  is_responded: boolean;
  response_text?: string;
  response_date?: string;
  created_at: string;
}

// Social Media form input types
export interface SocialMediaAccountInput {
  platform: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  access_token?: string;
  refresh_token?: string;
  permissions?: string[];
  status?: string;
  followers?: number;
}

export interface SocialMediaPostInput {
  content: string;
  media_urls?: string[];
  target_accounts?: string[];
  scheduled_date?: string;
  post_type?: string;
  hashtags?: string[];
  mentions?: string[];
  location?: Record<string, any>;
  campaign_id?: string;
  approval_status?: string;
}

// Social Media Comment Input Type
export interface SocialMediaCommentInput {
  post_id: string;
  author_name?: string;
  content: string;
  likes?: number;
  reply_to?: string;
  platform_comment_id?: string;
}

// ===============================================
// EMAIL MARKETING TYPES
// ===============================================

// Email Campaign Types
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'completed';
  sender_name?: string;
  sender_email?: string;
  reply_to?: string;
  subscriber_list_ids?: string[];
  sent_count?: number;
  delivered_count?: number;
  opened_count?: number;
  clicked_count?: number;
  unsubscribed_count?: number;
  bounced_count?: number;
  open_rate?: number;
  click_rate?: number;
  unsubscribe_rate?: number;
  bounce_rate?: number;
  scheduled_at?: string;
  sent_at?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Email Campaign Input Type
export interface EmailCampaignInput {
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'completed';
  sender_name?: string;
  sender_email?: string;
  reply_to?: string;
  subscriber_list_ids?: string[];
  scheduled_at?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// Email Subscriber Types
export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  source?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
  subscribed_at: string;
  unsubscribed_at?: string;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

// Email Subscriber Input Type
export interface EmailSubscriberInput {
  email: string;
  first_name?: string;
  last_name?: string;
  status?: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  source?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  thumbnail?: string;
  category?: string;
  is_system?: boolean;
  tags?: string[];
  variables?: string[];
  created_at: string;
  updated_at: string;
}

// Email Template Input Type
export interface EmailTemplateInput {
  name: string;
  subject?: string;
  content: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  variables?: string[];
}

// Email Analytics Types
export interface EmailMarketingOverview {
  total_campaigns: number;
  campaigns_by_status: Record<string, number>;
  total_subscribers: number;
  subscribers_by_status: Record<string, number>;
  total_emails_sent: number;
  average_open_rate: number;
  average_click_rate: number;
  timestamp: string;
}

export interface EmailCampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  status: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  bounced_count: number;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
  bounce_rate: number;
  created_at: string;
  sent_at: string;
}

// ===============================================
// COLLABORATION TYPES
// ===============================================

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  department?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  permissions?: string[];
  last_login?: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// Team Member Input Type
export interface TeamMemberInput {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  department?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  permissions?: string[];
}

// Team Activity Types
export interface TeamActivity {
  id: string;
  user_id: string;
  user_name?: string;
  activity_type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'comment' | 'share' | 'view';
  description: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Team Activity Input Type
export interface TeamActivityInput {
  user_id: string;
  user_name?: string;
  activity_type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'comment' | 'share' | 'view';
  description: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
}

// User Presence Types
export interface UserPresence {
  id: string;
  user_id: string;
  user_name?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  current_page?: string;
  cursor_position?: {
    x: number;
    y: number;
  };
  last_seen: string;
  created_at: string;
  updated_at: string;
}

// User Presence Input Type
export interface UserPresenceInput {
  user_id: string;
  user_name?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  current_page?: string;
  cursor_position?: {
    x: number;
    y: number;
  };
}

// Collaboration Project Types
export interface CollaborationProject {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner_id: string;
  team_members?: string[];
  start_date?: string;
  due_date?: string;
  completion_percentage?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Collaboration Project Input Type
export interface CollaborationProjectInput {
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  owner_id: string;
  team_members?: string[];
  start_date?: string;
  due_date?: string;
  completion_percentage?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// Live Cursor Types
export interface LiveCursor {
  id: string;
  user_id: string;
  user_name?: string;
  page: string;
  position: {
    x: number;
    y: number;
  };
  color?: string;
  updated_at: string;
}

// Live Cursor Input Type
export interface LiveCursorInput {
  user_id: string;
  user_name?: string;
  page: string;
  position: {
    x: number;
    y: number;
  };
  color?: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  action_url?: string;
  action_text?: string;
  metadata?: Record<string, unknown>;
  read_at?: string;
  created_at: string;
}

// Notification Input Type
export interface NotificationInput {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority?: 'low' | 'medium' | 'high';
  action_url?: string;
  action_text?: string;
  metadata?: Record<string, unknown>;
}

// Collaboration Analytics Types
export interface CollaborationOverview {
  total_team_members: number;
  members_by_role: Record<string, number>;
  members_by_status: Record<string, number>;
  total_projects: number;
  projects_by_status: Record<string, number>;
  online_users: number;
  activities_last_24h: number;
  activities_by_type: Record<string, number>;
  timestamp: string;
}

// ===============================================
// INTEGRATIONS TYPES
// ===============================================

// Integration App Types
export interface IntegrationApp {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Productivity' | 'Analytics' | 'Design' | 'Development' | 'Marketing' | 'Finance' | 'HR' | 'Sales' | 'Other';
  developer: string;
  icon?: string;
  screenshots?: string[];
  price: number;
  commission_rate?: number;
  status: 'active' | 'pending' | 'suspended' | 'deprecated';
  rating?: number;
  review_count?: number;
  install_count?: number;
  version: string;
  permissions?: string[];
  webhook_url?: string;
  api_endpoints?: string[];
  documentation_url?: string;
  support_url?: string;
  tags?: string[];
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Integration App Input Type
export interface IntegrationAppInput {
  name: string;
  description: string;
  category: 'Communication' | 'Productivity' | 'Analytics' | 'Design' | 'Development' | 'Marketing' | 'Finance' | 'HR' | 'Sales' | 'Other';
  developer: string;
  icon?: string;
  screenshots?: string[];
  price: number;
  commission_rate?: number;
  status?: 'active' | 'pending' | 'suspended' | 'deprecated';
  version: string;
  permissions?: string[];
  webhook_url?: string;
  api_endpoints?: string[];
  documentation_url?: string;
  support_url?: string;
  tags?: string[];
  featured?: boolean;
}

// User Integration Types
export interface UserIntegration {
  id: string;
  user_id: string;
  app_id: string;
  app_name?: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  configuration?: Record<string, unknown>;
  api_key_id?: string;
  last_sync?: string;
  sync_frequency?: string;
  error_message?: string;
  installed_at: string;
  created_at: string;
  updated_at: string;
}

// User Integration Input Type
export interface UserIntegrationInput {
  user_id: string;
  app_id: string;
  status?: 'active' | 'inactive' | 'error' | 'pending';
  configuration?: Record<string, unknown>;
  api_key_id?: string;
  sync_frequency?: string;
}

// API Key Types
export interface IntegrationApiKey {
  id: string;
  user_id: string;
  service: string;
  name: string;
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  expires_at?: string;
  last_used?: string;
  usage_count?: number;
  rate_limit?: number;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

// API Key Input Type
export interface IntegrationApiKeyInput {
  user_id: string;
  service: string;
  name: string;
  key_value: string;
  status?: 'active' | 'inactive' | 'expired' | 'revoked';
  expires_at?: string;
  rate_limit?: number;
  permissions?: string[];
}

// Integration Usage Types
export interface IntegrationUsage {
  id: string;
  user_id: string;
  integration_id: string;
  action: string;
  endpoint?: string;
  request_count?: number;
  response_time?: number;
  status_code?: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Integration Usage Input Type
export interface IntegrationUsageInput {
  user_id: string;
  integration_id: string;
  action: string;
  endpoint?: string;
  request_count?: number;
  response_time?: number;
  status_code?: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

// Integrations Analytics Types
export interface IntegrationsOverview {
  total_apps: number;
  apps_by_category: Record<string, number>;
  apps_by_status: Record<string, number>;
  total_user_integrations: number;
  integrations_by_status: Record<string, number>;
  total_api_keys: number;
  keys_by_service: Record<string, number>;
  keys_by_status: Record<string, number>;
  usage_last_24h: number;
  usage_by_action: Record<string, number>;
  timestamp: string;
}

export interface MarketplaceRevenue {
  total_revenue: number;
  total_commission: number;
  total_installations: number;
  installations_by_app: Record<string, {
    count: number;
    revenue: number;
  }>;
  period_days: number;
  timestamp: string;
}

export interface IntegrationCategories {
  categories: Record<string, number>;
}