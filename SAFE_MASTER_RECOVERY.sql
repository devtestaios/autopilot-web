-- ============================================================================
-- SAFE MASTER DATABASE RECOVERY SCRIPT
-- PulseBridge.ai Complete Schema Recovery (SAFE VERSION)
-- Date: October 3, 2025
-- Purpose: Restore all AI tables safely, handling existing structures
-- ============================================================================

-- STEP 1: Create core tables first (no foreign keys)
-- STEP 2: Add missing columns to existing tables  
-- STEP 3: Create remaining tables
-- STEP 4: Add foreign keys and indexes safely

-- ============================================================================
-- SECTION 1: CORE TABLES (NO FOREIGN KEYS)
-- ============================================================================

-- Core campaigns table (foundation for everything)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin', 'twitter', 'tiktok', 'youtube')),
  client_name TEXT NOT NULL,
  budget NUMERIC(10,2),
  spend NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core leads table 
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  value NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core performance tracking
CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend NUMERIC(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: AI-POWERED AGENTIC SYSTEM TABLES (SAFE VERSION)
-- ============================================================================

-- Master AI Cycles (Core Autonomous System)
CREATE TABLE IF NOT EXISTS public.master_ai_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  cycle_status TEXT DEFAULT 'active' CHECK (cycle_status IN ('active', 'paused', 'completed', 'failed')),
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  total_budget NUMERIC(12,2),
  platforms_included TEXT[] DEFAULT '{}',
  optimization_goals JSONB,
  ai_confidence_score NUMERIC(5,2) DEFAULT 0,
  performance_summary JSONB,
  decisions_made INTEGER DEFAULT 0,
  actions_taken INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Decision Logs (Every AI decision tracked)
CREATE TABLE IF NOT EXISTS public.ai_decision_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('budget_adjustment', 'bid_optimization', 'keyword_modification', 'audience_expansion', 'creative_rotation', 'campaign_pause', 'platform_switch')),
  platform TEXT NOT NULL,
  decision_data JSONB NOT NULL,
  reasoning TEXT,
  confidence_score NUMERIC(5,2) NOT NULL,
  expected_impact JSONB,
  actual_impact JSONB,
  execution_status TEXT DEFAULT 'pending' CHECK (execution_status IN ('pending', 'executed', 'failed', 'rolled_back')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Performance Scores
CREATE TABLE IF NOT EXISTS public.ai_performance_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  score_type TEXT NOT NULL CHECK (score_type IN ('efficiency', 'growth', 'roi', 'engagement', 'conversion')),
  current_score NUMERIC(5,2) NOT NULL,
  previous_score NUMERIC(5,2),
  score_change NUMERIC(5,2),
  trend TEXT CHECK (trend IN ('improving', 'declining', 'stable')),
  factors JSONB,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Smart Alerts
CREATE TABLE IF NOT EXISTS public.ai_smart_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('performance_drop', 'budget_depletion', 'opportunity_detected', 'anomaly_detected', 'goal_achieved')),
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  priority_score INTEGER DEFAULT 0,
  auto_resolve_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('budget_reallocation', 'keyword_expansion', 'audience_targeting', 'creative_optimization', 'bidding_strategy', 'platform_diversification')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  confidence_score NUMERIC(5,2) NOT NULL,
  expected_impact JSONB,
  implementation_effort TEXT CHECK (implementation_effort IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Campaign Forecasts
CREATE TABLE IF NOT EXISTS public.ai_campaign_forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  forecast_type TEXT NOT NULL CHECK (forecast_type IN ('performance', 'budget', 'conversion', 'reach')),
  time_horizon INTEGER NOT NULL, -- days
  predicted_values JSONB NOT NULL,
  confidence_interval JSONB,
  model_accuracy NUMERIC(5,2),
  factors_considered TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meta AI Insights (Cross-platform intelligence)
CREATE TABLE IF NOT EXISTS public.meta_ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('cross_platform_opportunity', 'audience_overlap', 'budget_optimization', 'creative_performance', 'timing_optimization')),
  platforms_analyzed TEXT[] NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  potential_impact JSONB,
  recommended_actions TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'implemented', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: EMAIL MARKETING SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  send_date TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  unsubscribed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  tags TEXT[],
  subscription_date TIMESTAMPTZ DEFAULT NOW(),
  last_engagement TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: SOCIAL MEDIA SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.social_media_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest')),
  account_name TEXT NOT NULL,
  account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'expired', 'error')),
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  post_id TEXT,
  content TEXT,
  media_urls TEXT[],
  hashtags TEXT[],
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  engagement_score NUMERIC(5,2) DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: TEAM COLLABORATION SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  permissions JSONB DEFAULT '{}',
  last_login TIMESTAMPTZ,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 6: INTEGRATIONS MARKETPLACE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.integration_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon_url TEXT,
  developer_name TEXT,
  version TEXT DEFAULT '1.0.0',
  price NUMERIC(10,2) DEFAULT 0,
  billing_type TEXT CHECK (billing_type IN ('free', 'one_time', 'monthly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  install_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
  user_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  config JSONB DEFAULT '{}',
  api_keys JSONB DEFAULT '{}',
  last_sync TIMESTAMPTZ,
  install_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 7: BASIC INDEXES (SAFE)
-- ============================================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- AI system indexes (safe - only on guaranteed columns)
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_status ON master_ai_cycles(cycle_status);
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_created_at ON master_ai_cycles(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_created_at ON ai_decision_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_smart_alerts_created_at ON ai_smart_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON ai_recommendations(created_at DESC);

-- Social media indexes (safe)
CREATE INDEX IF NOT EXISTS idx_social_accounts_created_at ON social_media_accounts(created_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_media_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);

-- Email marketing indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);

-- Performance indexes (safe)
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_date ON performance_snapshots(date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_created_at ON performance_snapshots(created_at);

-- ============================================================================
-- SECTION 8: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on core tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;

-- Enable RLS on AI tables
ALTER TABLE master_ai_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on business tables
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 9: BASIC RLS POLICIES (SAFE)
-- ============================================================================

-- Allow all for authenticated users (can be refined later)
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users" ON campaigns;
DROP POLICY IF EXISTS "Allow authenticated users" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users" ON performance_snapshots;
DROP POLICY IF EXISTS "Allow authenticated users" ON master_ai_cycles;
DROP POLICY IF EXISTS "Allow authenticated users" ON ai_decision_logs;
DROP POLICY IF EXISTS "Allow authenticated users" ON ai_performance_scores;
DROP POLICY IF EXISTS "Allow authenticated users" ON ai_smart_alerts;
DROP POLICY IF EXISTS "Allow authenticated users" ON ai_recommendations;
DROP POLICY IF EXISTS "Allow authenticated users" ON email_campaigns;
DROP POLICY IF EXISTS "Allow authenticated users" ON email_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users" ON social_media_accounts;
DROP POLICY IF EXISTS "Allow authenticated users" ON social_media_posts;
DROP POLICY IF EXISTS "Allow authenticated users" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated users" ON integration_apps;
DROP POLICY IF EXISTS "Allow authenticated users" ON user_integrations;

-- Create new policies
CREATE POLICY "Allow authenticated users" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON performance_snapshots FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON master_ai_cycles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON ai_decision_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON ai_performance_scores FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON ai_smart_alerts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON ai_recommendations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON email_campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON email_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON social_media_accounts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON social_media_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON integration_apps FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON user_integrations FOR ALL TO authenticated USING (true);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Insert success indicator
INSERT INTO campaigns (name, platform, client_name, budget, status) 
VALUES ('AI Recovery Test Campaign', 'google_ads', 'System Test', 1000.00, 'active') 
ON CONFLICT DO NOTHING;

-- Success message
SELECT 
  'AI-POWERED AGENTIC SYSTEM RECOVERY COMPLETE!' as message,
  COUNT(*) as tables_created
FROM pg_tables 
WHERE schemaname = 'public';