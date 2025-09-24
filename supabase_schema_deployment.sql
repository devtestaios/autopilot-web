-- ===============================================
-- PULSEBRIDGE.AI DATABASE SCHEMA DEPLOYMENT (Corrected)
-- Multi-Platform Marketing Automation Platform
-- Execute this script in Supabase SQL Editor
-- ===============================================

-- Extensions (install in public so uuid_generate_v4() is available unqualified)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- Helper: updated_at trigger function
-- ===============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ===============================================
-- 1. CORE CAMPAIGNS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  client_name TEXT NOT NULL,
  budget NUMERIC(10,2),
  spend NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'draft')),
  
  -- Platform-specific configuration
  platform_config JSONB DEFAULT '{}'::jsonb,
  
  -- Campaign metadata
  campaign_type TEXT, -- 'search', 'display', 'video', 'shopping', etc.
  target_audience JSONB DEFAULT '{}'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  ad_groups JSONB DEFAULT '[]'::jsonb,
  
  -- Tracking and dates
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Platform-specific IDs
  google_ads_id TEXT,
  meta_campaign_id TEXT,
  pinterest_campaign_id TEXT,
  linkedin_campaign_id TEXT
);

CREATE TRIGGER trg_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 2. PERFORMANCE SNAPSHOTS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  -- Core metrics (universal across platforms)
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Calculated metrics
  ctr DECIMAL(5,4), -- Click-through rate
  cpc DECIMAL(10,2), -- Cost per click
  cpa DECIMAL(10,2), -- Cost per acquisition
  cpm DECIMAL(10,2), -- Cost per mille
  roas DECIMAL(10,2), -- Return on ad spend
  
  -- Platform-specific metrics (stored as JSON)
  platform_metrics JSONB DEFAULT '{}',
  
  -- Quality and performance scores
  quality_score INTEGER,
  relevance_score DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date, platform)
);

-- ===============================================
-- 3. AD ACCOUNTS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL, -- Platform-specific account ID
  
  -- Authentication and access
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Account metadata
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  
  -- API credentials (encrypted)
  api_credentials JSONB DEFAULT '{}',
  
  -- Sync settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency INTEGER DEFAULT 24, -- hours
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(platform, account_id)
);

-- ===============================================
-- 4. KEYWORDS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  keyword_text TEXT NOT NULL,
  match_type TEXT, -- 'exact', 'phrase', 'broad', 'broad_modified'
  bid_amount DECIMAL(10,2),
  
  -- Performance metrics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  
  -- Quality metrics
  quality_score INTEGER,
  first_page_cpc DECIMAL(10,2),
  top_page_cpc DECIMAL(10,2),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. AUDIENCES TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS audiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  name TEXT NOT NULL,
  audience_type TEXT, -- 'custom', 'lookalike', 'interest', 'demographic'
  
  -- Audience definition
  criteria JSONB DEFAULT '{}',
  size_estimate INTEGER,
  
  -- Platform-specific IDs
  platform_audience_id TEXT,
  
  -- Status and tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'building', 'ready', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 6. LEADS TABLE (Enhanced)
-- ===============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  
  -- Lead source tracking
  source_platform TEXT,
  source_campaign_id UUID REFERENCES campaigns(id),
  source_ad_group TEXT,
  source_keyword TEXT,
  
  -- Lead qualification
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  
  -- Additional data
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  landing_page TEXT,
  
  -- Tracking
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 7. SYNC LOGS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  sync_type TEXT NOT NULL, -- 'campaigns', 'performance', 'keywords', 'audiences'
  
  -- Sync results
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Error handling
  error_message TEXT,
  error_details JSONB,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 8. AI INSIGHTS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  
  -- Insight metadata
  insight_type TEXT NOT NULL, -- 'optimization', 'anomaly', 'recommendation', 'prediction'
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Insight content
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  
  -- AI analysis
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  expected_impact TEXT,
  ai_model_used TEXT,
  
  -- Implementation
  implemented BOOLEAN DEFAULT false,
  implemented_at TIMESTAMP WITH TIME ZONE,
  results JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Campaign indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);

-- Performance snapshots indexes
CREATE INDEX IF NOT EXISTS idx_performance_campaign_date ON performance_snapshots(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_platform_date ON performance_snapshots(platform, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_date ON performance_snapshots(date DESC);

-- Ad accounts indexes
CREATE INDEX IF NOT EXISTS idx_ad_accounts_platform ON ad_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_ad_accounts_status ON ad_accounts(status);

-- Keywords indexes
CREATE INDEX IF NOT EXISTS idx_keywords_campaign ON keywords(campaign_id);
CREATE INDEX IF NOT EXISTS idx_keywords_platform ON keywords(platform);
CREATE INDEX IF NOT EXISTS idx_keywords_status ON keywords(status);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source_campaign ON leads(source_campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_platform ON sync_logs(platform);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at ON sync_logs(started_at DESC);

-- AI insights indexes
CREATE INDEX IF NOT EXISTS idx_ai_insights_campaign ON ai_insights(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON ai_insights(priority);

-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now - customize based on auth requirements)
CREATE POLICY "Allow all on campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all on performance_snapshots" ON performance_snapshots FOR ALL USING (true);
CREATE POLICY "Allow all on ad_accounts" ON ad_accounts FOR ALL USING (true);
CREATE POLICY "Allow all on keywords" ON keywords FOR ALL USING (true);
CREATE POLICY "Allow all on audiences" ON audiences FOR ALL USING (true);
CREATE POLICY "Allow all on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all on sync_logs" ON sync_logs FOR ALL USING (true);
CREATE POLICY "Allow all on ai_insights" ON ai_insights FOR ALL USING (true);

-- ===============================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ===============================================

-- Insert sample campaign
INSERT INTO campaigns (name, platform, client_name, budget, status, campaign_type)
VALUES 
  ('Test Google Campaign', 'google_ads', 'Sample Client', 1000.00, 'active', 'search'),
  ('Test Meta Campaign', 'meta', 'Sample Client', 500.00, 'active', 'display'),
  ('Test LinkedIn Campaign', 'linkedin', 'Sample Client', 750.00, 'paused', 'sponsored_content')
ON CONFLICT DO NOTHING;

-- Insert sample performance data
WITH sample_campaign AS (
  SELECT id FROM campaigns WHERE name = 'Test Google Campaign' LIMIT 1
)
INSERT INTO performance_snapshots (campaign_id, date, platform, impressions, clicks, conversions, spend)
SELECT 
  sample_campaign.id,
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
  'google_ads',
  (RANDOM() * 1000)::INTEGER + 100,
  (RANDOM() * 50)::INTEGER + 5,
  (RANDOM() * 5)::INTEGER,
  (RANDOM() * 50)::DECIMAL(10,2) + 10
FROM sample_campaign
ON CONFLICT DO NOTHING;

-- ===============================================
-- DEPLOYMENT COMPLETE
-- ===============================================

-- ===============================================
-- DEPLOYMENT VALIDATION & VERIFICATION
-- ===============================================

-- Verify all tables were created successfully
DO $$
DECLARE
    missing_tables TEXT[];
    expected_tables TEXT[] := ARRAY['campaigns', 'performance_snapshots', 'ad_accounts', 'keywords', 'audiences', 'leads', 'sync_logs', 'ai_insights'];
    table_name TEXT;
BEGIN
    -- Check each expected table exists
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            missing_tables := missing_tables || table_name;
        END IF;
    END LOOP;
    
    -- Report results
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'WARNING: Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'SUCCESS: All tables created successfully!';
    END IF;
END $$;

-- Verify status columns exist where expected
DO $$
BEGIN
    -- Check campaigns.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing campaigns.status column';
    END IF;
    
    -- Check ad_accounts.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad_accounts' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing ad_accounts.status column';
    END IF;
    
    -- Check keywords.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'keywords' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing keywords.status column';
    END IF;
    
    -- Check audiences.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audiences' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing audiences.status column';
    END IF;
    
    -- Check leads.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing leads.status column';
    END IF;
    
    -- Check sync_logs.status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sync_logs' AND column_name = 'status') THEN
        RAISE EXCEPTION 'Missing sync_logs.status column';
    END IF;
    
    RAISE NOTICE 'SUCCESS: All status columns verified!';
END $$;

-- Verify tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN ('campaigns', 'performance_snapshots', 'ad_accounts', 'keywords', 'audiences', 'leads', 'sync_logs', 'ai_insights')
ORDER BY tablename;

-- Show table row counts
SELECT 
  'campaigns' as table_name, COUNT(*) as row_count FROM campaigns
UNION ALL
SELECT 'performance_snapshots', COUNT(*) FROM performance_snapshots
UNION ALL  
SELECT 'ad_accounts', COUNT(*) FROM ad_accounts
UNION ALL
SELECT 'keywords', COUNT(*) FROM keywords
UNION ALL
SELECT 'audiences', COUNT(*) FROM audiences
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'sync_logs', COUNT(*) FROM sync_logs
UNION ALL
SELECT 'ai_insights', COUNT(*) FROM ai_insights;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================
SELECT 'PulseBridge.ai Database Schema Deployed Successfully! 🚀' as deployment_status;