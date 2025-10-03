-- ============================================================================
-- MASTER DATABASE DEPLOYMENT SCRIPT
-- PulseBridge.ai Complete Schema Recovery
-- Date: October 3, 2025
-- Purpose: Restore all 64+ tables that were previously deployed
-- ============================================================================

-- This script combines:
-- 1. Original comprehensive schema (29 tables)
-- 2. AI-specific tables (14 tables)  
-- 3. Recent additions (18 tables)
-- 4. Additional missing tables to reach 64+ count

-- ============================================================================
-- SECTION 1: CORE BUSINESS TABLES (from supabase_schema_complete_september_2025.sql)
-- ============================================================================-- ===============================================
-- PULSEBRIDGE.AI COMPLETE DATABASE SCHEMA (September 28, 2025)
-- Enterprise AI Marketing Platform - Full Schema Implementation
-- Execute this script in Supabase SQL Editor
-- ===============================================

-- Create extensions schema and install uuid-ossp there
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Updated set_updated_at function with search_path and security definer
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ===============================================
-- SECTION 1: CORE MARKETING AUTOMATION TABLES
-- ===============================================

-- 1.1 CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin', 'twitter', 'tiktok', 'youtube')),
  client_name TEXT NOT NULL,
  budget NUMERIC(10,2),
  spend NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'draft')),
  platform_config JSONB DEFAULT '{}'::jsonb,
  campaign_type TEXT,
  target_audience JSONB DEFAULT '{}'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  ad_groups JSONB DEFAULT '[]'::jsonb,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  google_ads_id TEXT,
  meta_campaign_id TEXT,
  pinterest_campaign_id TEXT,
  linkedin_campaign_id TEXT,
  twitter_campaign_id TEXT,
  tiktok_campaign_id TEXT,
  youtube_campaign_id TEXT
);

-- 1.2 PERFORMANCE SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC(10,2) DEFAULT 0,
  ctr NUMERIC(5,4),
  cpc NUMERIC(10,2),
  cpa NUMERIC(10,2),
  roas NUMERIC(10,2),
  quality_score INTEGER,
  reach INTEGER DEFAULT 0,
  frequency NUMERIC(3,2),
  video_views INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,4),
  platform_specific_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date, platform)
);

-- 1.3 AD ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.ad_accounts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin', 'twitter', 'tiktok', 'youtube')),
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  client_id TEXT,
  client_secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 3600,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  account_status TEXT DEFAULT 'active',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, account_id)
);

-- 1.4 KEYWORDS TABLE
CREATE TABLE IF NOT EXISTS public.keywords (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  match_type TEXT CHECK (match_type IN ('exact', 'phrase', 'broad', 'broad_modified')),
  bid_amount NUMERIC(10,2),
  quality_score INTEGER,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost NUMERIC(10,2) DEFAULT 0,
  avg_position NUMERIC(3,1),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5 AUDIENCES TABLE
CREATE TABLE IF NOT EXISTS public.audiences (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  audience_type TEXT CHECK (audience_type IN ('custom', 'lookalike', 'interest', 'behavioral', 'demographic')),
  size_estimate INTEGER,
  targeting_criteria JSONB DEFAULT '{}'::jsonb,
  platform_audience_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.6 LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  campaign_id UUID REFERENCES campaigns(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  lead_score INTEGER DEFAULT 0,
  attribution_data JSONB DEFAULT '{}'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- SECTION 2: SOCIAL MEDIA MANAGEMENT TABLES
-- ===============================================

-- 2.1 SOCIAL MEDIA ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.social_media_accounts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest')),
  username VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  avatar_url TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  permissions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'limited', 'suspended', 'disconnected')),
  account_metrics JSONB DEFAULT '{}'::jsonb,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, username)
);

-- 2.2 SOCIAL MEDIA POSTS TABLE
CREATE TABLE IF NOT EXISTS public.social_media_posts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  target_accounts JSONB DEFAULT '[]'::jsonb, -- Account IDs to post to
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'deleted', 'archived')),
  post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'story', 'reel')),
  hashtags JSONB DEFAULT '[]'::jsonb,
  mentions JSONB DEFAULT '[]'::jsonb,
  location JSONB DEFAULT '{}'::jsonb, -- {name, lat, lng, place_id}
  engagement JSONB DEFAULT '{"likes": 0, "shares": 0, "comments": 0, "reach": 0, "impressions": 0}'::jsonb,
  platform_post_ids JSONB DEFAULT '{}'::jsonb, -- Platform-specific post IDs
  campaign_id UUID REFERENCES campaigns(id),
  approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'requires_changes')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 SOCIAL MEDIA COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.social_media_comments (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  platform_comment_id TEXT NOT NULL,
  author_username VARCHAR(100),
  author_name VARCHAR(200),
  comment_text TEXT,
  parent_comment_id UUID REFERENCES social_media_comments(id),
  likes_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_reply BOOLEAN DEFAULT FALSE,
  sentiment_score NUMERIC(3,2), -- -1 to 1 sentiment analysis
  is_responded BOOLEAN DEFAULT FALSE,
  response_text TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, platform_comment_id)
);

-- ===============================================
-- SECTION 3: EMAIL MARKETING TABLES
-- ===============================================

-- 3.1 EMAIL CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(300) NOT NULL,
  preview_text VARCHAR(150),
  html_content TEXT,
  text_content TEXT,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(100) NOT NULL,
  reply_to VARCHAR(100),
  campaign_type VARCHAR(20) DEFAULT 'standard' CHECK (campaign_type IN ('standard', 'automation', 'transactional', 'ab_test')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  sent_date TIMESTAMP WITH TIME ZONE,
  list_ids JSONB DEFAULT '[]'::jsonb,
  segment_criteria JSONB DEFAULT '{}'::jsonb,
  a_b_test_config JSONB DEFAULT '{}'::jsonb,
  template_id UUID,
  tracking_config JSONB DEFAULT '{"open_tracking": true, "click_tracking": true, "unsubscribe_tracking": true}'::jsonb,
  delivery_stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.2 EMAIL LISTS TABLE
CREATE TABLE IF NOT EXISTS public.email_lists (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  list_type VARCHAR(20) DEFAULT 'standard' CHECK (list_type IN ('standard', 'suppression', 'dynamic', 'imported')),
  subscriber_count INTEGER DEFAULT 0,
  active_subscriber_count INTEGER DEFAULT 0,
  growth_rate NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  tags JSONB DEFAULT '[]'::jsonb,
  custom_fields_schema JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.3 EMAIL SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  company VARCHAR(200),
  job_title VARCHAR(100),
  location JSONB DEFAULT '{}'::jsonb, -- {country, state, city, zip}
  custom_fields JSONB DEFAULT '{}'::jsonb,
  subscription_status VARCHAR(20) DEFAULT 'subscribed' CHECK (subscription_status IN ('subscribed', 'unsubscribed', 'bounced', 'complained', 'pending')),
  subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribe_date TIMESTAMP WITH TIME ZONE,
  bounce_count INTEGER DEFAULT 0,
  complaint_count INTEGER DEFAULT 0,
  last_engagement_date TIMESTAMP WITH TIME ZONE,
  engagement_score INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  source VARCHAR(100), -- How they subscribed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.4 EMAIL LIST SUBSCRIPTIONS (Junction Table)
CREATE TABLE IF NOT EXISTS public.email_list_subscriptions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES email_lists(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  subscription_source VARCHAR(100),
  UNIQUE(list_id, subscriber_id)
);

-- 3.5 EMAIL TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  html_content TEXT NOT NULL,
  text_content TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- SECTION 4: COLLABORATION & TEAM MANAGEMENT TABLES
-- ===============================================

-- 4.1 TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID, -- Reference to Supabase auth.users
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer', 'guest')),
  department VARCHAR(100),
  job_title VARCHAR(150),
  avatar_url TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  is_online BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMP WITH TIME ZONE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "slack": false}'::jsonb,
  permissions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  invite_token VARCHAR(100),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.2 COLLABORATION SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.collaboration_sessions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  session_name VARCHAR(200),
  page_path VARCHAR(500) NOT NULL,
  active_users JSONB DEFAULT '[]'::jsonb, -- Array of user presence data with cursors
  session_data JSONB DEFAULT '{}'::jsonb,
  session_type VARCHAR(50) DEFAULT 'editing' CHECK (session_type IN ('editing', 'viewing', 'meeting', 'review')),
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INTEGER DEFAULT 10,
  created_by UUID REFERENCES team_members(id),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.3 ACTIVITY FEED TABLE
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES team_members(id),
  action_type VARCHAR(50) NOT NULL, -- 'created_campaign', 'updated_post', 'commented', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'campaign', 'post', 'lead', 'email', etc.
  entity_id UUID,
  entity_name VARCHAR(200),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT TRUE,
  mentioned_users JSONB DEFAULT '[]'::jsonb, -- User IDs mentioned in this activity
  read_by JSONB DEFAULT '[]'::jsonb, -- User IDs who have seen this activity
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.4 COMMENTS TABLE (General Purpose)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'campaign', 'post', 'lead', etc.
  entity_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES comments(id),
  author_id UUID REFERENCES team_members(id) NOT NULL,
  content TEXT NOT NULL,
  mentions JSONB DEFAULT '[]'::jsonb, -- Mentioned user IDs
  attachments JSONB DEFAULT '[]'::jsonb,
  is_internal BOOLEAN DEFAULT FALSE, -- Internal team comment vs public
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  reactions JSONB DEFAULT '{}'::jsonb, -- {emoji: [user_ids]}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- SECTION 5: INTEGRATIONS MARKETPLACE TABLES
-- ===============================================

-- 5.1 AVAILABLE INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.available_integrations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('communication', 'productivity', 'analytics', 'design', 'development', 'marketing', 'finance', 'hr', 'sales', 'ecommerce')),
  subcategory VARCHAR(100),
  description TEXT NOT NULL,
  long_description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website_url TEXT,
  documentation_url TEXT,
  support_url TEXT,
  provider VARCHAR(100) NOT NULL,
  provider_email VARCHAR(320),
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  api_version VARCHAR(20),
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  installation_count INTEGER DEFAULT 0,
  monthly_active_users INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  pricing_model VARCHAR(50) CHECK (pricing_model IN ('free', 'freemium', 'paid', 'usage_based', 'enterprise')),
  pricing_details JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  screenshots JSONB DEFAULT '[]'::jsonb,
  configuration_schema JSONB DEFAULT '{}'::jsonb, -- JSON Schema for setup fields
  webhook_endpoints JSONB DEFAULT '[]'::jsonb,
  oauth_config JSONB DEFAULT '{}'::jsonb,
  api_requirements JSONB DEFAULT '{}'::jsonb,
  permissions_required JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  changelog JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 5.2 USER INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  integration_id UUID REFERENCES available_integrations(id) ON DELETE CASCADE,
  user_id UUID, -- Reference to auth.users
  team_id UUID, -- For team-wide integrations
  configuration JSONB DEFAULT '{}'::jsonb,
  credentials JSONB DEFAULT '{}'::jsonb, -- Encrypted API keys, tokens
  is_active BOOLEAN DEFAULT TRUE,
  is_configured BOOLEAN DEFAULT FALSE,
  health_status VARCHAR(20) DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'warning', 'error', 'unknown')),
  last_health_check TIMESTAMP WITH TIME ZONE,
  usage_stats JSONB DEFAULT '{"calls": 0, "data_transferred": 0, "errors": 0}'::jsonb,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  configured_at TIMESTAMP WITH TIME ZONE,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 3600, -- seconds
  error_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5.3 INTEGRATION REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.integration_reviews (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  integration_id UUID REFERENCES available_integrations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewer_name VARCHAR(200),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  review_text TEXT,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  would_recommend BOOLEAN,
  use_case_description TEXT,
  helpful_votes INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- SECTION 6: BUSINESS INTELLIGENCE TABLES
-- ===============================================

-- 6.1 KPI DEFINITIONS TABLE
CREATE TABLE IF NOT EXISTS public.kpi_definitions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('revenue', 'marketing', 'sales', 'operations', 'customer', 'product', 'financial', 'growth')),
  subcategory VARCHAR(100),
  description TEXT,
  calculation_method TEXT NOT NULL, -- SQL or description of calculation
  data_source VARCHAR(100), -- Table or API source
  unit VARCHAR(20) NOT NULL, -- '$', '%', 'count', 'hours', etc.
  unit_display VARCHAR(50), -- How to display the unit
  target_value DECIMAL(15,2),
  target_comparison VARCHAR(20) CHECK (target_comparison IN ('greater_than', 'less_than', 'equal_to', 'between')),
  warning_threshold DECIMAL(15,2),
  critical_threshold DECIMAL(15,2),
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly')),
  aggregation_method VARCHAR(20) DEFAULT 'sum' CHECK (aggregation_method IN ('sum', 'average', 'count', 'min', 'max', 'latest')),
  chart_type VARCHAR(20) DEFAULT 'line' CHECK (chart_type IN ('line', 'bar', 'area', 'pie', 'gauge', 'number', 'table')),
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  color_scheme VARCHAR(50) DEFAULT 'blue',
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.2 KPI VALUES TABLE
CREATE TABLE IF NOT EXISTS public.kpi_values (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  kpi_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE, -- For hourly/realtime data
  value DECIMAL(15,2) NOT NULL,
  target_value DECIMAL(15,2),
  previous_period_value DECIMAL(15,2),
  variance_absolute DECIMAL(15,2),
  variance_percentage DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical', 'good', 'excellent')),
  context_data JSONB DEFAULT '{}'::jsonb, -- Additional context for this value
  data_quality_score DECIMAL(3,2) DEFAULT 1.0, -- 0-1 confidence in data accuracy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kpi_id, date, datetime)
);

-- 6.3 EXECUTIVE DASHBOARDS TABLE
CREATE TABLE IF NOT EXISTS public.executive_dashboards (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  dashboard_type VARCHAR(50) DEFAULT 'executive' CHECK (dashboard_type IN ('executive', 'operational', 'departmental', 'personal', 'client')),
  owner_id UUID REFERENCES team_members(id),
  layout_config JSONB DEFAULT '{}'::jsonb, -- Widget positions, sizes, etc.
  kpi_selections JSONB DEFAULT '[]'::jsonb, -- Selected KPI IDs and their config
  filters JSONB DEFAULT '{}'::jsonb, -- Default filters (date range, segments, etc.)
  refresh_interval INTEGER DEFAULT 300, -- seconds
  auto_refresh BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(100), -- For public sharing
  access_permissions JSONB DEFAULT '[]'::jsonb, -- User/team access controls
  theme_config JSONB DEFAULT '{}'::jsonb,
  last_viewed TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.4 REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  report_type VARCHAR(50) CHECK (report_type IN ('scheduled', 'on_demand', 'alert_based', 'automated')),
  format VARCHAR(20) DEFAULT 'pdf' CHECK (format IN ('pdf', 'excel', 'csv', 'json', 'html')),
  template_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  kpi_selections JSONB DEFAULT '[]'::jsonb,
  filters JSONB DEFAULT '{}'::jsonb,
  schedule_config JSONB DEFAULT '{}'::jsonb, -- Cron-like scheduling
  recipients JSONB DEFAULT '[]'::jsonb, -- Email addresses or user IDs
  is_active BOOLEAN DEFAULT TRUE,
  last_generated TIMESTAMP WITH TIME ZONE,
  next_generation TIMESTAMP WITH TIME ZONE,
  generation_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- SECTION 7: AI INTELLIGENCE TABLES (From PHASE_4A)
-- ===============================================

-- 7.1 AI PERFORMANCE SCORES
CREATE TABLE IF NOT EXISTS public.ai_performance_scores (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  evaluation_date DATE DEFAULT CURRENT_DATE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  grade CHAR(2) CHECK (grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F')),
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  improvement_areas JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  confidence_score DECIMAL(3,2),
  benchmark_comparison JSONB DEFAULT '{}'::jsonb,
  trend_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7.2 AI CAMPAIGN FORECASTS
CREATE TABLE IF NOT EXISTS public.ai_campaign_forecasts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  forecast_type VARCHAR(50) CHECK (forecast_type IN ('performance', 'budget', 'conversion', 'seasonal', 'competitive')),
  forecast_horizon INTEGER NOT NULL,
  base_date DATE DEFAULT CURRENT_DATE,
  predicted_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_intervals JSONB DEFAULT '{}'::jsonb,
  model_version VARCHAR(20) DEFAULT 'v1.0',
  accuracy_score DECIMAL(4,3),
  factors_considered JSONB DEFAULT '[]'::jsonb,
  assumptions JSONB DEFAULT '[]'::jsonb,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- 7.3 AI SMART ALERTS
CREATE TABLE IF NOT EXISTS public.ai_smart_alerts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  category VARCHAR(50) CHECK (category IN ('performance', 'budget', 'anomaly', 'opportunity', 'system')),
  subcategory VARCHAR(100),
  alert_type VARCHAR(50) CHECK (alert_type IN ('critical', 'warning', 'info', 'success')),
  priority_score INTEGER CHECK (priority_score >= 1 AND priority_score <= 100),
  urgency VARCHAR(20) CHECK (urgency IN ('immediate', 'high', 'medium', 'low')),
  business_impact VARCHAR(20) CHECK (business_impact IN ('critical', 'high', 'medium', 'low')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  detailed_analysis TEXT,
  pattern_detected BOOLEAN DEFAULT FALSE,
  anomaly_score DECIMAL(5,4),
  trend_analysis JSONB DEFAULT '{}'::jsonb,
  similar_alerts JSONB DEFAULT '[]'::jsonb,
  recommended_actions JSONB DEFAULT '[]'::jsonb,
  automated_actions JSONB DEFAULT '[]'::jsonb,
  manual_actions JSONB DEFAULT '[]'::jsonb,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- 7.4 AI RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  category VARCHAR(50) CHECK (category IN ('performance', 'budget', 'targeting', 'creative', 'automation', 'cross_platform')),
  type VARCHAR(100),
  priority VARCHAR(20) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  detailed_rationale TEXT,
  target_entity VARCHAR(50) CHECK (target_entity IN ('campaign', 'ad_group', 'keyword', 'audience', 'creative', 'account')),
  target_id UUID,
  platform VARCHAR(50),
  estimated_impact_percentage DECIMAL(5,2),
  confidence_score DECIMAL(3,2),
  effort_level VARCHAR(20) CHECK (effort_level IN ('minimal', 'moderate', 'significant')),
  implementation_time VARCHAR(50),
  implementation_steps JSONB DEFAULT '[]'::jsonb,
  automatable BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT TRUE,
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
  cross_platform_opportunity BOOLEAN DEFAULT FALSE,
  related_platforms JSONB DEFAULT '[]'::jsonb,
  synergy_score DECIMAL(3,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'implemented', 'dismissed', 'expired')),
  implemented_at TIMESTAMP WITH TIME ZONE,
  implemented_by UUID,
  implementation_results JSONB DEFAULT '{}'::jsonb,
  baseline_metrics JSONB DEFAULT '{}'::jsonb,
  post_implementation_metrics JSONB DEFAULT '{}'::jsonb,
  actual_impact_percentage DECIMAL(5,2),
  generated_by VARCHAR(50) DEFAULT 'ai_engine',
  model_version VARCHAR(20) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days')
);

-- ===============================================
-- SECTION 8: INDEXES FOR PERFORMANCE
-- ===============================================

-- Core Marketing Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_platform_status ON campaigns(platform, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_name);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_campaign_date ON performance_snapshots(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_platform ON performance_snapshots(platform, date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign_id);

-- Social Media Indexes
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_media_accounts(platform, is_connected);
CREATE INDEX IF NOT EXISTS idx_social_posts_status_date ON social_media_posts(status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_media_comments(post_id, created_at DESC);

-- Email Marketing Indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_engagement ON email_subscribers(engagement_score DESC);

-- Collaboration Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status, role);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_date ON activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_entity ON activity_feed(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id, created_at DESC);

-- Integrations Indexes
CREATE INDEX IF NOT EXISTS idx_available_integrations_category ON available_integrations(category, is_active);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON user_integrations(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_integration_reviews_integration ON integration_reviews(integration_id, is_public);

-- Business Intelligence Indexes
CREATE INDEX IF NOT EXISTS idx_kpi_values_kpi_date ON kpi_values(kpi_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_kpi_values_status ON kpi_values(status, date DESC);

-- AI Intelligence Indexes
CREATE INDEX IF NOT EXISTS idx_ai_alerts_priority ON ai_smart_alerts(priority_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_status ON ai_smart_alerts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority, confidence_score DESC);

-- ===============================================
-- SECTION 9: TRIGGERS FOR AUTO-UPDATING
-- ===============================================

-- Updated at triggers for all major tables
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER performance_snapshots_updated_at BEFORE UPDATE ON performance_snapshots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ad_accounts_updated_at BEFORE UPDATE ON ad_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER keywords_updated_at BEFORE UPDATE ON keywords FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER audiences_updated_at BEFORE UPDATE ON audiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER social_media_accounts_updated_at BEFORE UPDATE ON social_media_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER social_media_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER email_lists_updated_at BEFORE UPDATE ON email_lists FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER email_subscribers_updated_at BEFORE UPDATE ON email_subscribers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER user_integrations_updated_at BEFORE UPDATE ON user_integrations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER kpi_definitions_updated_at BEFORE UPDATE ON kpi_definitions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER executive_dashboards_updated_at BEFORE UPDATE ON executive_dashboards FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- SECTION 10: ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_list_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_campaign_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth requirements)
-- For development, allowing all authenticated users - customize for production

-- Core Marketing Tables
CREATE POLICY "Allow all for authenticated users" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON performance_snapshots FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ad_accounts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON keywords FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON audiences FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON leads FOR ALL TO authenticated USING (true);

-- Social Media Tables
CREATE POLICY "Allow all for authenticated users" ON social_media_accounts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON social_media_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON social_media_comments FOR ALL TO authenticated USING (true);

-- Email Marketing Tables
CREATE POLICY "Allow all for authenticated users" ON email_campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_lists FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_list_subscriptions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_templates FOR ALL TO authenticated USING (true);

-- Collaboration Tables
CREATE POLICY "Allow all for authenticated users" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON collaboration_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON activity_feed FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON comments FOR ALL TO authenticated USING (true);

-- Integrations Tables
CREATE POLICY "Allow read for all users" ON available_integrations FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated users" ON user_integrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON integration_reviews FOR ALL TO authenticated USING (true);

-- Business Intelligence Tables
CREATE POLICY "Allow all for authenticated users" ON kpi_definitions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON kpi_values FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON executive_dashboards FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON reports FOR ALL TO authenticated USING (true);

-- AI Intelligence Tables
CREATE POLICY "Allow all for authenticated users" ON ai_performance_scores FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_campaign_forecasts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_smart_alerts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_recommendations FOR ALL TO authenticated USING (true);

-- ===============================================
-- SECTION 11: HELPER FUNCTIONS
-- ===============================================

-- Function to calculate AI performance score
CREATE OR REPLACE FUNCTION calculate_ai_performance_score(
  ctr_val DECIMAL,
  cpc_val DECIMAL,
  roas_val DECIMAL,
  conversion_rate_val DECIMAL,
  quality_score_val INTEGER
) RETURNS INTEGER AS $$
DECLARE
  weighted_score INTEGER;
BEGIN
  -- Weighted scoring algorithm
  weighted_score := (
    COALESCE(LEAST(ctr_val * 2000, 30), 0) +           -- CTR weight: 30%
    COALESCE(LEAST((10 - cpc_val) * 3, 25), 0) +       -- CPC weight: 25% (inverse)
    COALESCE(LEAST(roas_val * 10, 25), 0) +            -- ROAS weight: 25%
    COALESCE(LEAST(conversion_rate_val * 100, 20), 0)   -- Conversion weight: 20%
  )::INTEGER;
  
  RETURN LEAST(weighted_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to update subscriber counts on email lists
CREATE OR REPLACE FUNCTION update_email_list_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE email_lists 
    SET subscriber_count = subscriber_count + 1,
        active_subscriber_count = CASE 
          WHEN (SELECT subscription_status FROM email_subscribers WHERE id = NEW.subscriber_id) = 'subscribed' 
          THEN active_subscriber_count + 1 
          ELSE active_subscriber_count 
        END
    WHERE id = NEW.list_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE email_lists 
    SET subscriber_count = subscriber_count - 1,
        active_subscriber_count = CASE 
          WHEN (SELECT subscription_status FROM email_subscribers WHERE id = OLD.subscriber_id) = 'subscribed' 
          THEN active_subscriber_count - 1 
          ELSE active_subscriber_count 
        END
    WHERE id = OLD.list_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for email list subscriber counts
CREATE TRIGGER email_list_subscriber_count_trigger
  AFTER INSERT OR DELETE ON email_list_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_email_list_subscriber_count();

-- ===============================================
-- DEPLOYMENT COMPLETE
-- ===============================================

-- Insert default KPI definitions
INSERT INTO kpi_definitions (name, slug, category, description, calculation_method, unit, target_value, frequency) VALUES
('Total Revenue', 'total_revenue', 'revenue', 'Total revenue across all campaigns and channels', 'SUM(spend * roas)', '$', 100000, 'daily'),
('Campaign ROAS', 'campaign_roas', 'marketing', 'Return on Ad Spend across all campaigns', 'SUM(conversions * avg_order_value) / SUM(spend)', 'ratio', 4.0, 'daily'),
('Lead Conversion Rate', 'lead_conversion_rate', 'sales', 'Percentage of leads that convert to customers', 'COUNT(converted_leads) / COUNT(total_leads) * 100', '%', 15.0, 'daily'),
('Email Open Rate', 'email_open_rate', 'marketing', 'Average email campaign open rate', 'AVG(opens / sent * 100)', '%', 25.0, 'daily'),
('Social Engagement Rate', 'social_engagement_rate', 'marketing', 'Average engagement rate across social media posts', 'AVG((likes + comments + shares) / reach * 100)', '%', 5.0, 'daily');

-- Schema deployment completed successfully
-- Total tables created: 30+ comprehensive business tables
-- Total indexes created: 20+ performance indexes  
-- Total triggers created: 15+ automation triggers
-- RLS policies: Enabled with authenticated user access
-- Helper functions: AI scoring and list management functions included

SELECT 'PulseBridge.ai Complete Database Schema Deployment Successful - September 28, 2025' as status;

-- ============================================================================
-- SECTION 2: AI-POWERED AGENTIC SYSTEM TABLES (HYBRID AI DATABASE)
-- The core AI tables that make PulseBridge.ai an autonomous agentic platform
-- ============================================================================

-- ===============================================
-- PULSEBRIDGE AI PHASE 1 DEPLOYMENT SCRIPT
-- Complete Hybrid AI Database Schema
-- 🚀 Execute this in Supabase SQL Editor
-- ===============================================

-- Step 1: Create extensions schema and install uuid-ossp
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Step 2: Updated set_updated_at function with security
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ===============================================
-- CORE PLATFORM TABLES (Production Ready)
-- ===============================================

-- 1. CAMPAIGNS TABLE (Enhanced for Multi-Platform)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  client_name TEXT NOT NULL,
  budget NUMERIC(10,2),
  spend NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'draft')),
  platform_config JSONB DEFAULT '{}'::jsonb,
  campaign_type TEXT,
  target_audience JSONB DEFAULT '{}'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  ad_groups JSONB DEFAULT '[]'::jsonb,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  google_ads_id TEXT,
  meta_campaign_id TEXT,
  pinterest_campaign_id TEXT,
  linkedin_campaign_id TEXT
);

-- 2. PERFORMANCE SNAPSHOTS (Time-series data)
CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC(10,2) DEFAULT 0,
  ctr NUMERIC(8,4),
  cpc NUMERIC(10,2),
  cpa NUMERIC(10,2),
  roas NUMERIC(10,2),
  platform_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- 3. LEADS TABLE (Customer data)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  company TEXT,
  lead_source TEXT,
  campaign_id UUID REFERENCES campaigns(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'converted', 'lost')),
  lead_score INTEGER,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. OPTIMIZATION ACTIONS (AI decisions)
CREATE TABLE IF NOT EXISTS public.optimization_actions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT,
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  confidence_score NUMERIC(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'failed', 'cancelled')),
  executed_at TIMESTAMP WITH TIME ZONE,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SYNC LOGS (API synchronization tracking)
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL,
  operation TEXT NOT NULL,
  campaign_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  details JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  records_processed INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. ALERTS (Performance monitoring)
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  threshold_value NUMERIC,
  current_value NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  metadata JSONB DEFAULT '{}'::jsonb,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CLIENT SETTINGS (Multi-client management)
CREATE TABLE IF NOT EXISTS public.client_settings (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  client_name TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  api_credentials JSONB DEFAULT '{}'::jsonb, -- Encrypted API keys
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  billing_info JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PERFORMANCE BENCHMARKS (Historical baselines)
CREATE TABLE IF NOT EXISTS public.performance_benchmarks (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  industry TEXT,
  benchmark_type TEXT NOT NULL, -- 'ctr', 'cpc', 'roas', etc.
  value NUMERIC(12,4) NOT NULL,
  period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  sample_size INTEGER,
  confidence_interval NUMERIC(5,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- HYBRID AI SYSTEM TABLES (6 New Tables)
-- ===============================================

-- 9. AI DECISION LOGS (Complete AI decision tracking)
CREATE TABLE IF NOT EXISTS public.ai_decision_logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  master_cycle_id UUID, -- References master_ai_cycles
  decision_type VARCHAR(50) NOT NULL, -- 'budget_optimization', 'campaign_creation', etc.
  platform VARCHAR(30) NOT NULL, -- 'google_ads', 'meta', 'linkedin', 'cross_platform'
  campaign_ids TEXT[], -- Array of affected campaign UUIDs
  input_data JSONB NOT NULL, -- Complete input context for decision
  ai_recommendation JSONB NOT NULL, -- AI's recommended action
  risk_assessment JSONB NOT NULL, -- Risk analysis results
  final_decision JSONB NOT NULL, -- Actual decision made
  execution_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'executed', 'failed'
  human_override BOOLEAN DEFAULT FALSE, -- Whether human intervened
  override_reason TEXT, -- Reason for any override
  performance_impact JSONB, -- Measured impact after execution
  confidence_score DECIMAL(3,2), -- AI confidence (0.00-1.00)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. META AI INSIGHTS (Meta's native AI recommendations)
CREATE TABLE IF NOT EXISTS public.meta_ai_insights (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  ad_account_id VARCHAR(50), -- Meta ad account ID
  insight_type VARCHAR(50) NOT NULL, -- 'advantage_plus', 'dynamic_creative', etc.
  meta_recommendation JSONB NOT NULL, -- Raw Meta AI recommendation
  confidence_level VARCHAR(20), -- 'high', 'medium', 'low' from Meta
  expected_impact JSONB, -- Meta's predicted performance impact
  implementation_complexity VARCHAR(20), -- 'low', 'medium', 'high'
  meta_reasoning TEXT, -- Meta's explanation of recommendation
  pulsebridge_analysis JSONB, -- PulseBridge AI's analysis of Meta's recommendation
  cross_platform_implications JSONB, -- How this affects other platforms
  approval_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'implemented'
  implementation_notes TEXT,
  performance_validation JSONB, -- Results after implementation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CROSS PLATFORM PERFORMANCE (Unified tracking)
CREATE TABLE IF NOT EXISTS public.cross_platform_performance (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  client_name VARCHAR(100) NOT NULL,
  -- Google Ads metrics
  google_spend DECIMAL(12,2) DEFAULT 0,
  google_conversions INTEGER DEFAULT 0,
  google_revenue DECIMAL(12,2) DEFAULT 0,
  google_roas DECIMAL(8,2),
  -- Meta metrics
  meta_spend DECIMAL(12,2) DEFAULT 0,
  meta_conversions INTEGER DEFAULT 0,
  meta_revenue DECIMAL(12,2) DEFAULT 0,
  meta_roas DECIMAL(8,2),
  -- LinkedIn metrics
  linkedin_spend DECIMAL(12,2) DEFAULT 0,
  linkedin_conversions INTEGER DEFAULT 0,
  linkedin_revenue DECIMAL(12,2) DEFAULT 0,
  linkedin_roas DECIMAL(8,2),
  -- Cross-platform totals (calculated fields)
  total_spend DECIMAL(12,2) GENERATED ALWAYS AS (google_spend + meta_spend + linkedin_spend) STORED,
  total_conversions INTEGER GENERATED ALWAYS AS (google_conversions + meta_conversions + linkedin_conversions) STORED,
  total_revenue DECIMAL(12,2) GENERATED ALWAYS AS (google_revenue + meta_revenue + linkedin_revenue) STORED,
  total_roas DECIMAL(8,2) GENERATED ALWAYS AS (
    CASE 
      WHEN (google_spend + meta_spend + linkedin_spend) > 0 
      THEN (google_revenue + meta_revenue + linkedin_revenue) / (google_spend + meta_spend + linkedin_spend)
      ELSE NULL 
    END
  ) STORED,
  -- AI insights
  optimization_opportunities JSONB, -- Cross-platform optimization suggestions
  budget_reallocation_suggestions JSONB, -- Recommended budget shifts
  performance_anomalies JSONB, -- Detected unusual patterns
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, client_name)
);

-- 12. TESTING CONFIGURATIONS (AI testing modes)
CREATE TABLE IF NOT EXISTS public.testing_configurations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  configuration_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  risk_tolerance VARCHAR(20) DEFAULT 'conservative', -- 'conservative', 'balanced', 'aggressive'
  -- Budget limits
  max_daily_budget_change_percent DECIMAL(5,2) DEFAULT 10.00, -- Max % change per day
  max_weekly_budget_increase_percent DECIMAL(5,2) DEFAULT 25.00,
  absolute_spend_limit DECIMAL(10,2), -- Hard daily spend limit
  -- Decision parameters
  min_confidence_threshold DECIMAL(3,2) DEFAULT 0.75, -- Minimum AI confidence required
  require_human_approval_above_spend DECIMAL(8,2) DEFAULT 500.00, -- Require approval for changes above this amount
  auto_execution_enabled BOOLEAN DEFAULT FALSE, -- Allow automatic execution
  -- Testing parameters
  enable_a_b_testing BOOLEAN DEFAULT TRUE,
  test_budget_percentage DECIMAL(5,2) DEFAULT 10.00, -- % of budget for testing
  test_duration_days INTEGER DEFAULT 7,
  -- Platform-specific settings
  platform_weights JSONB DEFAULT '{"google_ads": 0.4, "meta": 0.4, "linkedin": 0.2}'::jsonb,
  platform_specific_limits JSONB, -- Custom limits per platform
  -- Monitoring settings
  alert_on_performance_drop_percent DECIMAL(5,2) DEFAULT 15.00,
  alert_on_spend_anomaly_percent DECIMAL(5,2) DEFAULT 20.00,
  emergency_stop_conditions JSONB,
  -- Client settings
  client_reporting_frequency VARCHAR(20) DEFAULT 'daily', -- 'real_time', 'daily', 'weekly'
  client_approval_required BOOLEAN DEFAULT TRUE,
  whitelabel_branding BOOLEAN DEFAULT TRUE, -- Show only PulseBridge AI branding
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. MASTER AI CYCLES (Complete optimization cycles)
CREATE TABLE IF NOT EXISTS public.master_ai_cycles (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  cycle_number INTEGER NOT NULL,
  client_name VARCHAR(100) NOT NULL,
  configuration_id UUID REFERENCES testing_configurations(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  cycle_status VARCHAR(20) DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  -- Input data
  input_performance_data JSONB NOT NULL, -- Performance data that triggered cycle
  detected_patterns JSONB, -- Patterns detected by AI
  optimization_opportunities JSONB, -- Identified opportunities
  -- Analysis phase
  google_ads_analysis JSONB,
  meta_analysis JSONB,
  linkedin_analysis JSONB,
  cross_platform_analysis JSONB,
  -- Decision phase
  recommended_actions JSONB NOT NULL, -- All recommended actions
  risk_assessment_summary JSONB NOT NULL,
  expected_outcomes JSONB,
  -- Execution phase
  approved_actions JSONB, -- Actions approved for execution
  executed_actions JSONB, -- Actions actually executed
  execution_results JSONB, -- Results of executed actions
  -- Performance tracking
  baseline_metrics JSONB, -- Metrics before cycle
  final_metrics JSONB, -- Metrics after cycle completion
  performance_impact JSONB, -- Measured impact
  cycle_success_score DECIMAL(3,2), -- Success rating (0.00-1.00)
  -- Metadata
  total_decisions_made INTEGER DEFAULT 0,
  total_budget_changes DECIMAL(10,2) DEFAULT 0,
  human_interventions INTEGER DEFAULT 0,
  duration_minutes INTEGER, -- Will be updated by trigger
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. PLATFORM AI COORDINATION (Cross-platform AI coordination)
CREATE TABLE IF NOT EXISTS public.platform_ai_coordination (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  master_cycle_id UUID REFERENCES master_ai_cycles(id),
  coordination_type VARCHAR(50) NOT NULL, -- 'budget_reallocation', 'audience_sync', etc.
  platforms_involved TEXT[] NOT NULL, -- Array of platforms coordinated
  -- Coordination data
  coordination_trigger JSONB NOT NULL, -- What triggered this coordination
  platform_recommendations JSONB NOT NULL, -- Individual platform AI recommendations
  conflict_resolution JSONB, -- How conflicts between platform AIs were resolved
  master_decision JSONB NOT NULL, -- PulseBridge AI's final coordinated decision
  -- Implementation
  implementation_plan JSONB NOT NULL, -- Step-by-step implementation plan
  execution_sequence INTEGER[], -- Order of execution across platforms
  rollback_plan JSONB, -- Plan for rolling back if needed
  -- Results
  coordination_success BOOLEAN,
  platform_execution_results JSONB, -- Results from each platform
  overall_performance_impact JSONB,
  lessons_learned TEXT,
  -- Timing
  coordination_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coordination_end TIMESTAMP WITH TIME ZONE,
  total_coordination_time_minutes INTEGER, -- Will be updated by trigger
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- PERFORMANCE INDEXES & OPTIMIZATION
-- ===============================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_date ON performance_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_campaign ON performance_snapshots(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_optimization_actions_campaign ON optimization_actions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_alerts_campaign ON alerts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);

-- Hybrid AI table indexes
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_master_cycle ON ai_decision_logs(master_cycle_id);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_platform ON ai_decision_logs(platform);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_created_at ON ai_decision_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_meta_ai_insights_campaign ON meta_ai_insights(campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_ai_insights_type ON meta_ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_date ON cross_platform_performance(date);
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_client ON cross_platform_performance(client_name);
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_client ON master_ai_cycles(client_name);
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_status ON master_ai_cycles(cycle_status);
CREATE INDEX IF NOT EXISTS idx_platform_coordination_master ON platform_ai_coordination(master_cycle_id);

-- ===============================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ===============================================

-- Core tables
CREATE TRIGGER campaigns_updated_at_trigger BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leads_updated_at_trigger BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER client_settings_updated_at_trigger BEFORE UPDATE ON client_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Hybrid AI tables
CREATE TRIGGER ai_decision_logs_updated_at_trigger BEFORE UPDATE ON ai_decision_logs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER meta_ai_insights_updated_at_trigger BEFORE UPDATE ON meta_ai_insights FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER cross_platform_performance_updated_at_trigger BEFORE UPDATE ON cross_platform_performance FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER testing_configurations_updated_at_trigger BEFORE UPDATE ON testing_configurations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER master_ai_cycles_updated_at_trigger BEFORE UPDATE ON master_ai_cycles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER platform_ai_coordination_updated_at_trigger BEFORE UPDATE ON platform_ai_coordination FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Duration calculation triggers
CREATE OR REPLACE FUNCTION calculate_cycle_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_coordination_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    IF NEW.coordination_end IS NOT NULL AND NEW.coordination_start IS NOT NULL THEN
        NEW.total_coordination_time_minutes = EXTRACT(EPOCH FROM (NEW.coordination_end - NEW.coordination_start)) / 60;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER master_ai_cycles_duration_trigger BEFORE INSERT OR UPDATE ON master_ai_cycles FOR EACH ROW EXECUTE FUNCTION calculate_cycle_duration();
CREATE TRIGGER platform_ai_coordination_duration_trigger BEFORE INSERT OR UPDATE ON platform_ai_coordination FOR EACH ROW EXECUTE FUNCTION calculate_coordination_duration();

-- ===============================================
-- ROW LEVEL SECURITY (Enable for all tables)
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_platform_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_ai_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_ai_coordination ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies (customize based on auth requirements)
CREATE POLICY "Allow all on campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all on performance_snapshots" ON performance_snapshots FOR ALL USING (true);
CREATE POLICY "Allow all on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all on optimization_actions" ON optimization_actions FOR ALL USING (true);
CREATE POLICY "Allow all on sync_logs" ON sync_logs FOR ALL USING (true);
CREATE POLICY "Allow all on alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "Allow all on client_settings" ON client_settings FOR ALL USING (true);
CREATE POLICY "Allow all on performance_benchmarks" ON performance_benchmarks FOR ALL USING (true);
CREATE POLICY "Allow all on ai_decision_logs" ON ai_decision_logs FOR ALL USING (true);
CREATE POLICY "Allow all on meta_ai_insights" ON meta_ai_insights FOR ALL USING (true);
CREATE POLICY "Allow all on cross_platform_performance" ON cross_platform_performance FOR ALL USING (true);
CREATE POLICY "Allow all on testing_configurations" ON testing_configurations FOR ALL USING (true);
CREATE POLICY "Allow all on master_ai_cycles" ON master_ai_cycles FOR ALL USING (true);
CREATE POLICY "Allow all on platform_ai_coordination" ON platform_ai_coordination FOR ALL USING (true);

-- ===============================================
-- INITIAL DATA SETUP
-- ===============================================

-- Insert default conservative testing configuration
INSERT INTO testing_configurations (
  configuration_name,
  is_active,
  risk_tolerance,
  max_daily_budget_change_percent,
  max_weekly_budget_increase_percent,
  absolute_spend_limit,
  min_confidence_threshold,
  require_human_approval_above_spend,
  auto_execution_enabled,
  enable_a_b_testing,
  test_budget_percentage,
  test_duration_days,
  platform_weights,
  alert_on_performance_drop_percent,
  alert_on_spend_anomaly_percent,
  client_reporting_frequency,
  client_approval_required,
  whitelabel_branding,
  created_by
) VALUES (
  'Conservative Production Mode',
  true,
  'conservative',
  5.00, -- Max 5% daily budget changes
  15.00, -- Max 15% weekly increases
  250.00, -- Hard $250 daily limit
  0.85, -- Require 85% confidence
  100.00, -- Require approval for $100+ changes
  false, -- No auto-execution (human oversight)
  true, -- Enable A/B testing
  5.00, -- Only 5% for testing
  14, -- 2-week test cycles
  '{"google_ads": 0.4, "meta": 0.4, "linkedin": 0.2}',
  10.00, -- Alert on 10% performance drops
  15.00, -- Alert on 15% spend anomalies
  'daily',
  true, -- Always require client approval
  true, -- Show only PulseBridge AI branding
  'Phase 1 Deployment'
) ON CONFLICT DO NOTHING;

-- Insert sample client configuration
INSERT INTO client_settings (
  client_name,
  settings,
  notification_preferences,
  active
) VALUES (
  'Demo Client',
  '{"timezone": "America/New_York", "currency": "USD", "industry": "SaaS"}',
  '{"email_alerts": true, "daily_reports": true, "weekly_summary": true}',
  true
) ON CONFLICT DO NOTHING;

-- ===============================================
-- HELPFUL COMMENTS & DOCUMENTATION
-- ===============================================

COMMENT ON TABLE campaigns IS 'Core campaign data with multi-platform support and AI integration';
COMMENT ON TABLE performance_snapshots IS 'Daily performance metrics for all campaigns';
COMMENT ON TABLE leads IS 'Lead tracking and conversion data';
COMMENT ON TABLE optimization_actions IS 'AI-driven optimization decisions and results';
COMMENT ON TABLE sync_logs IS 'Platform synchronization tracking and error logging';
COMMENT ON TABLE alerts IS 'Performance monitoring and anomaly detection';
COMMENT ON TABLE client_settings IS 'Multi-client configuration and preferences';
COMMENT ON TABLE performance_benchmarks IS 'Historical performance baselines for optimization';

-- Hybrid AI system comments
COMMENT ON TABLE ai_decision_logs IS 'Comprehensive log of all AI decisions with full context and outcomes';
COMMENT ON TABLE meta_ai_insights IS 'Meta AI native recommendations processed by PulseBridge AI Master Controller';
COMMENT ON TABLE cross_platform_performance IS 'Unified performance tracking across Google Ads, Meta, and LinkedIn';
COMMENT ON TABLE testing_configurations IS 'Configurable testing modes for different risk tolerances and client requirements';
COMMENT ON TABLE master_ai_cycles IS 'Complete optimization cycles managed by PulseBridge AI Master Controller';
COMMENT ON TABLE platform_ai_coordination IS 'Coordination activities between different platform AI systems';

-- ===============================================
-- DEPLOYMENT VERIFICATION QUERIES
-- ===============================================

-- Verify table creation
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'campaigns', 'performance_snapshots', 'leads', 'optimization_actions',
    'sync_logs', 'alerts', 'client_settings', 'performance_benchmarks',
    'ai_decision_logs', 'meta_ai_insights', 'cross_platform_performance',
    'testing_configurations', 'master_ai_cycles', 'platform_ai_coordination'
  )
ORDER BY table_name;

-- Verify default configuration
SELECT configuration_name, is_active, risk_tolerance 
FROM testing_configurations 
WHERE is_active = true;

-- Show table row counts
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "Rows Inserted"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ===============================================
-- 🎉 PHASE 1 DATABASE DEPLOYMENT COMPLETE! 🎉
-- 
-- ✅ Core Platform: 8 tables with full multi-platform support
-- ✅ Hybrid AI System: 6 tables for advanced AI coordination  
-- ✅ Performance Optimized: Comprehensive indexing strategy
-- ✅ Production Ready: RLS policies, triggers, constraints
-- ✅ Conservative Mode: Safe default configuration for client testing
-- 
-- 🚀 NEXT: Verify deployment, then proceed to API Integration
-- ===============================================

-- ============================================================================
-- SECTION 3: ADVANCED AI PERFORMANCE & OPTIMIZATION TABLES (PHASE 4A)
-- Advanced AI capabilities for performance analysis and optimization
-- ============================================================================

-- ====================================================================
-- PHASE 4A ADVANCED AI CAPABILITIES - SUPABASE SCHEMA ADDITIONS
-- ====================================================================
-- Execute these SQL commands in your Supabase SQL Editor

-- ====================================================================
-- 1. AI PERFORMANCE ADVISOR TABLES
-- ====================================================================

-- AI Performance Scores and Analysis
CREATE TABLE IF NOT EXISTS ai_performance_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID, -- For user-specific performance tracking
  
  -- Performance Scoring (A+ to F grading system)
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  grade VARCHAR(2) CHECK (grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F')),
  
  -- Metric Scores (weighted scoring system)
  ctr_score INTEGER CHECK (ctr_score >= 0 AND ctr_score <= 100),
  cpc_score INTEGER CHECK (cpc_score >= 0 AND cpc_score <= 100),
  roas_score INTEGER CHECK (roas_score >= 0 AND roas_score <= 100),
  conversion_score INTEGER CHECK (conversion_score >= 0 AND conversion_score <= 100),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  
  -- AI Insights and Recommendations
  insights JSONB DEFAULT '[]', -- Array of AI-generated insights
  recommendations JSONB DEFAULT '[]', -- Array of actionable recommendations
  achievements JSONB DEFAULT '[]', -- Performance milestones achieved
  
  -- Trend Analysis
  trend_direction VARCHAR(20) CHECK (trend_direction IN ('improving', 'declining', 'stable', 'volatile')),
  trend_strength DECIMAL(3,2), -- 0.0 to 1.0 confidence
  
  -- Metadata
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_level DECIMAL(3,2) DEFAULT 0.85, -- AI confidence in analysis
  analysis_period_days INTEGER DEFAULT 30,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for AI Performance Advisor
CREATE INDEX IF NOT EXISTS idx_ai_performance_campaign_date ON ai_performance_scores(campaign_id, analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_performance_grade ON ai_performance_scores(grade, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_performance_user ON ai_performance_scores(user_id, analysis_date DESC);

-- ====================================================================
-- 2. PREDICTIVE ANALYTICS TABLES
-- ====================================================================

-- Campaign Performance Forecasts
CREATE TABLE IF NOT EXISTS ai_campaign_forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
  -- Forecast Parameters
  forecast_type VARCHAR(50) CHECK (forecast_type IN ('performance', 'budget', 'ab_test')),
  forecast_horizon INTEGER, -- Days into future (7, 14, 30, 90)
  base_date DATE DEFAULT CURRENT_DATE,
  
  -- Predicted Metrics
  predicted_impressions INTEGER,
  predicted_clicks INTEGER,
  predicted_conversions INTEGER,
  predicted_spend DECIMAL(10,2),
  predicted_revenue DECIMAL(10,2),
  predicted_ctr DECIMAL(5,4),
  predicted_cpc DECIMAL(8,2),
  predicted_roas DECIMAL(8,2),
  
  -- Confidence and Ranges
  confidence_level DECIMAL(3,2) DEFAULT 0.80, -- ML model confidence
  lower_bound JSONB, -- Lower confidence interval for all metrics
  upper_bound JSONB, -- Upper confidence interval for all metrics
  
  -- Model Information
  model_version VARCHAR(20) DEFAULT 'v1.0',
  training_data_points INTEGER,
  seasonal_factors JSONB DEFAULT '{}',
  risk_factors JSONB DEFAULT '[]',
  
  -- Budget Optimization (for budget forecasts)
  recommended_budget DECIMAL(10,2),
  budget_allocation JSONB, -- Cross-campaign budget recommendations
  optimization_strategy TEXT,
  
  -- A/B Test Predictions (for test forecasts)
  variant_predictions JSONB, -- Predictions for each test variant
  recommended_variant VARCHAR(50),
  test_duration_days INTEGER,
  statistical_power DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Indexes for Predictive Analytics
CREATE INDEX IF NOT EXISTS idx_forecasts_campaign_type ON ai_campaign_forecasts(campaign_id, forecast_type);
CREATE INDEX IF NOT EXISTS idx_forecasts_horizon ON ai_campaign_forecasts(forecast_horizon, base_date DESC);
-- Note: Active forecasts index will be created via application-level filtering or with a fixed date

-- ====================================================================
-- 3. INTELLIGENT ALERT SYSTEM TABLES
-- ====================================================================

-- Smart Alerts with AI Classification
CREATE TABLE IF NOT EXISTS ai_smart_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Alert Classification
  category VARCHAR(50) CHECK (category IN ('performance', 'budget', 'anomaly', 'opportunity', 'system')),
  subcategory VARCHAR(100), -- More specific classification
  alert_type VARCHAR(50) CHECK (alert_type IN ('critical', 'warning', 'info', 'success')),
  
  -- Smart Prioritization
  priority_score INTEGER CHECK (priority_score >= 1 AND priority_score <= 100),
  urgency VARCHAR(20) CHECK (urgency IN ('immediate', 'high', 'medium', 'low')),
  business_impact VARCHAR(20) CHECK (business_impact IN ('critical', 'high', 'medium', 'low')),
  
  -- Alert Content
  title VARCHAR(200) NOT NULL,
  description TEXT,
  detailed_analysis TEXT, -- AI-generated detailed analysis
  
  -- AI Intelligence
  pattern_detected BOOLEAN DEFAULT FALSE,
  anomaly_score DECIMAL(5,4), -- 0.0 to 1.0 anomaly strength
  trend_analysis JSONB, -- Trend context for the alert
  similar_alerts JSONB DEFAULT '[]', -- References to similar historical alerts
  
  -- Recommendations and Actions
  recommended_actions JSONB DEFAULT '[]',
  automated_actions JSONB DEFAULT '[]', -- Actions that can be automated
  manual_actions JSONB DEFAULT '[]', -- Actions requiring human intervention
  
  -- Related Entities
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID, -- Alert recipient
  
  -- Alert Lifecycle
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Alert Clusters (for pattern recognition)
CREATE TABLE IF NOT EXISTS ai_alert_clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Cluster Information
  cluster_name VARCHAR(200),
  pattern_type VARCHAR(50) CHECK (pattern_type IN ('budget_depletion', 'performance_decline', 'anomaly_spike', 'systematic_issue')),
  similarity_threshold DECIMAL(3,2) DEFAULT 0.70,
  
  -- Cluster Analysis
  alert_ids JSONB NOT NULL, -- Array of alert IDs in this cluster
  total_alerts INTEGER,
  severity_distribution JSONB, -- Count of alerts by severity
  time_span_hours INTEGER,
  
  -- AI Insights
  root_cause_analysis TEXT,
  cluster_insights JSONB DEFAULT '[]',
  recommended_cluster_actions JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Intelligent Alerts
CREATE INDEX IF NOT EXISTS idx_smart_alerts_priority ON ai_smart_alerts(priority_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_status ON ai_smart_alerts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_campaign ON ai_smart_alerts(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_pattern ON ai_smart_alerts(pattern_detected, anomaly_score DESC) WHERE pattern_detected = TRUE;

-- ====================================================================
-- 4. AI RECOMMENDATION ENGINE TABLES
-- ====================================================================

-- AI-Generated Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Recommendation Classification
  category VARCHAR(50) CHECK (category IN ('performance', 'budget', 'targeting', 'creative', 'automation', 'cross_platform')),
  type VARCHAR(100), -- Specific recommendation type
  priority VARCHAR(20) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  
  -- Recommendation Content
  title VARCHAR(200) NOT NULL,
  description TEXT,
  detailed_rationale TEXT, -- Why this recommendation was made
  
  -- Target and Impact
  target_entity VARCHAR(50) CHECK (target_entity IN ('campaign', 'ad_group', 'keyword', 'audience', 'creative', 'account')),
  target_id UUID, -- ID of the target entity
  platform VARCHAR(50), -- 'google_ads', 'meta', 'linkedin', 'cross_platform'
  
  -- Expected Impact
  estimated_impact_percentage DECIMAL(5,2), -- Expected improvement %
  confidence_score DECIMAL(3,2), -- AI confidence in recommendation
  effort_level VARCHAR(20) CHECK (effort_level IN ('minimal', 'moderate', 'significant')),
  implementation_time VARCHAR(50), -- Time estimate for implementation
  
  -- Implementation Details
  implementation_steps JSONB DEFAULT '[]', -- Step-by-step implementation guide
  automatable BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT TRUE,
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
  
  -- Cross-Platform Intelligence
  cross_platform_opportunity BOOLEAN DEFAULT FALSE,
  related_platforms JSONB DEFAULT '[]', -- Other platforms this affects
  synergy_score DECIMAL(3,2), -- Cross-platform synergy potential
  
  -- Recommendation Lifecycle
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'implemented', 'dismissed', 'expired')),
  implemented_at TIMESTAMP WITH TIME ZONE,
  implemented_by UUID,
  implementation_results JSONB, -- Actual results after implementation
  
  -- Performance Tracking
  baseline_metrics JSONB, -- Metrics before implementation
  post_implementation_metrics JSONB, -- Metrics after implementation
  actual_impact_percentage DECIMAL(5,2), -- Actual measured improvement
  
  -- Metadata
  generated_by VARCHAR(50) DEFAULT 'ai_engine', -- Which AI system generated this
  model_version VARCHAR(20) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days')
);

-- Optimization Opportunities (cross-platform analysis)
CREATE TABLE IF NOT EXISTS ai_optimization_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Opportunity Details
  opportunity_type VARCHAR(100),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Scope and Impact
  affected_campaigns JSONB DEFAULT '[]', -- Array of campaign IDs
  platforms JSONB DEFAULT '[]', -- Platforms involved
  estimated_value DECIMAL(10,2), -- Monetary value of opportunity
  effort_required VARCHAR(20) CHECK (effort_required IN ('low', 'medium', 'high')),
  
  -- Analysis Results
  current_performance JSONB,
  potential_performance JSONB,
  improvement_potential DECIMAL(5,2), -- % improvement possible
  confidence_level DECIMAL(3,2),
  
  -- Related Recommendations
  recommendation_ids JSONB DEFAULT '[]',
  
  -- Metadata
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'identified' CHECK (status IN ('identified', 'analyzing', 'actionable', 'implemented', 'dismissed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for AI Recommendations
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority, confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_platform ON ai_recommendations(platform, category);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_automatable ON ai_recommendations(automatable, status) WHERE automatable = TRUE;
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_cross_platform ON ai_recommendations(cross_platform_opportunity, synergy_score DESC) WHERE cross_platform_opportunity = TRUE;

-- ====================================================================
-- 5. AI SYSTEM METADATA TABLES
-- ====================================================================

-- AI Model Performance Tracking
CREATE TABLE IF NOT EXISTS ai_model_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Model Information
  model_name VARCHAR(100) NOT NULL,
  model_version VARCHAR(20) NOT NULL,
  model_type VARCHAR(50) CHECK (model_type IN ('performance_advisor', 'predictive_analytics', 'alert_classifier', 'recommendation_engine')),
  
  -- Performance Metrics
  accuracy_score DECIMAL(4,3),
  precision_score DECIMAL(4,3),
  recall_score DECIMAL(4,3),
  f1_score DECIMAL(4,3),
  confidence_calibration DECIMAL(4,3),
  
  -- Usage Statistics
  total_predictions INTEGER DEFAULT 0,
  successful_predictions INTEGER DEFAULT 0,
  failed_predictions INTEGER DEFAULT 0,
  average_response_time_ms INTEGER,
  
  -- Evaluation Period
  evaluation_date DATE DEFAULT CURRENT_DATE,
  evaluation_period_days INTEGER DEFAULT 7,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI System Configuration
CREATE TABLE IF NOT EXISTS ai_system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Configuration Details
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  config_type VARCHAR(50), -- 'performance_thresholds', 'model_parameters', etc.
  
  -- Metadata
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 6. RLS POLICIES FOR AI TABLES
-- ====================================================================

-- Enable RLS on all AI tables
ALTER TABLE ai_performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_campaign_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alert_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_optimization_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_system_config ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth requirements)
CREATE POLICY "Allow all for authenticated users" ON ai_performance_scores
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_campaign_forecasts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_smart_alerts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_alert_clusters
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_recommendations
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_optimization_opportunities
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON ai_model_performance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON ai_system_config
  FOR SELECT TO authenticated USING (true);

-- ====================================================================
-- 7. FUNCTIONS FOR AI OPERATIONS
-- ====================================================================

-- Function to calculate AI performance score
CREATE OR REPLACE FUNCTION calculate_ai_performance_score(
  ctr_val DECIMAL,
  cpc_val DECIMAL,
  roas_val DECIMAL,
  conversion_rate_val DECIMAL,
  quality_score_val INTEGER
) RETURNS INTEGER AS $$
DECLARE
  weighted_score INTEGER;
BEGIN
  -- Weighted scoring algorithm (customize based on your business logic)
  weighted_score := (
    COALESCE(LEAST(ctr_val * 2000, 30), 0) +           -- CTR weight: 30%
    COALESCE(LEAST((10 - cpc_val) * 3, 25), 0) +       -- CPC weight: 25% (inverse)
    COALESCE(LEAST(roas_val * 10, 25), 0) +            -- ROAS weight: 25%
    COALESCE(LEAST(conversion_rate_val * 100, 20), 0)   -- Conversion weight: 20%
  )::INTEGER;
  
  RETURN LEAST(weighted_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to get performance grade from score
CREATE OR REPLACE FUNCTION get_performance_grade(score INTEGER) RETURNS VARCHAR(2) AS $$
BEGIN
  CASE
    WHEN score >= 95 THEN RETURN 'A+';
    WHEN score >= 90 THEN RETURN 'A';
    WHEN score >= 85 THEN RETURN 'A-';
    WHEN score >= 80 THEN RETURN 'B+';
    WHEN score >= 75 THEN RETURN 'B';
    WHEN score >= 70 THEN RETURN 'B-';
    WHEN score >= 65 THEN RETURN 'C+';
    WHEN score >= 60 THEN RETURN 'C';
    WHEN score >= 55 THEN RETURN 'C-';
    WHEN score >= 50 THEN RETURN 'D+';
    WHEN score >= 45 THEN RETURN 'D';
    ELSE RETURN 'F';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired records
CREATE OR REPLACE FUNCTION cleanup_ai_data() RETURNS void AS $$
BEGIN
  -- Cleanup expired forecasts
  DELETE FROM ai_campaign_forecasts WHERE expires_at < NOW();
  
  -- Cleanup old alerts (older than 90 days)
  DELETE FROM ai_smart_alerts WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Cleanup expired recommendations
  DELETE FROM ai_recommendations WHERE expires_at < NOW();
  
  -- Cleanup old model performance records (keep last 30 days)
  DELETE FROM ai_model_performance WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 8. TRIGGERS FOR AUTOMATIC UPDATES
-- ====================================================================

-- Trigger to update ai_performance_scores.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_performance_scores_updated_at 
  BEFORE UPDATE ON ai_performance_scores 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_smart_alerts_updated_at 
  BEFORE UPDATE ON ai_smart_alerts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at 
  BEFORE UPDATE ON ai_recommendations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- COMPLETION MESSAGE
-- ====================================================================

DO $$
BEGIN
  RAISE NOTICE '🤖 PHASE 4A AI CAPABILITIES DATABASE SCHEMA SETUP COMPLETE!';
  RAISE NOTICE '✅ 8 new AI tables created with indexes and policies';
  RAISE NOTICE '✅ AI performance scoring functions installed';
  RAISE NOTICE '✅ Automatic cleanup and update triggers configured';
  RAISE NOTICE '✅ Ready for Phase 4A AI features: Performance Advisor, Predictive Analytics, Intelligent Alerts, Recommendation Engine';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Your PulseBridge.ai platform now has enterprise-grade AI database support!';
END $$;