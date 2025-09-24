-- ===============================================
-- PULSEBRIDGE.AI DATABASE SCHEMA DEPLOYMENT (FINAL CORRECTED)
-- Multi-Platform Marketing Automation Platform
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
-- 1. CORE CAMPAIGNS TABLE
-- ===============================================
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

-- Ensure status column exists (safety measure)
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'paused', 'ended', 'draft'));

CREATE TRIGGER trg_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 2. PERFORMANCE SNAPSHOTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC(10,2) DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  ctr NUMERIC(7,6),
  cpc NUMERIC(10,2),
  cpa NUMERIC(10,2),
  cpm NUMERIC(10,2),
  roas NUMERIC(10,2),
  platform_metrics JSONB DEFAULT '{}'::jsonb,
  quality_score INTEGER,
  relevance_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date, platform)
);

CREATE TRIGGER trg_performance_snapshots_updated_at
    BEFORE UPDATE ON public.performance_snapshots
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 3. AD ACCOUNTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.ad_accounts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  api_credentials JSONB DEFAULT '{}'::jsonb,
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency INTEGER DEFAULT 24,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, account_id)
);

CREATE TRIGGER trg_ad_accounts_updated_at
    BEFORE UPDATE ON public.ad_accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 4. KEYWORDS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.keywords (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  keyword_text TEXT NOT NULL,
  match_type TEXT,
  bid_amount NUMERIC(10,2),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost NUMERIC(10,2) DEFAULT 0,
  quality_score INTEGER,
  first_page_cpc NUMERIC(10,2),
  top_page_cpc NUMERIC(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_keywords_updated_at
    BEFORE UPDATE ON public.keywords
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 5. AUDIENCES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.audiences (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  name TEXT NOT NULL,
  audience_type TEXT,
  criteria JSONB DEFAULT '{}'::jsonb,
  size_estimate INTEGER,
  platform_audience_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'building', 'ready', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_audiences_updated_at
    BEFORE UPDATE ON public.audiences
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 6. LEADS TABLE (Enhanced)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  source_platform TEXT,
  source_campaign_id UUID REFERENCES public.campaigns(id),
  source_ad_group TEXT,
  source_keyword TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  landing_page TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value NUMERIC(10,2),
  created_by UUID DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add created_by to leads (if not exists) and index it
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();

CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 7. SYNC LOGS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  error_details JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_sync_logs_updated_at
    BEFORE UPDATE ON public.sync_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 8. AI INSIGHTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id),
  insight_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  confidence_score NUMERIC(3,2),
  expected_impact TEXT,
  ai_model_used TEXT,
  implemented BOOLEAN DEFAULT false,
  implemented_at TIMESTAMP WITH TIME ZONE,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_ai_insights_updated_at
    BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- INDEXES FOR PERFORMANCE (including FK indexes)
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON public.campaigns(client_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_campaign_date ON public.performance_snapshots(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_platform_date ON public.performance_snapshots(platform, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_date ON public.performance_snapshots(date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_campaign_id ON public.performance_snapshots(campaign_id);

CREATE INDEX IF NOT EXISTS idx_ad_accounts_platform ON public.ad_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_ad_accounts_status ON public.ad_accounts(status);

CREATE INDEX IF NOT EXISTS idx_keywords_campaign ON public.keywords(campaign_id);
CREATE INDEX IF NOT EXISTS idx_keywords_platform ON public.keywords(platform);
CREATE INDEX IF NOT EXISTS idx_keywords_status ON public.keywords(status);
CREATE INDEX IF NOT EXISTS idx_keywords_campaign_id ON public.keywords(campaign_id);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source_campaign ON public.leads(source_campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_campaign_id ON public.leads(source_campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON public.leads(created_by);

CREATE INDEX IF NOT EXISTS idx_sync_logs_platform ON public.sync_logs(platform);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON public.sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at ON public.sync_logs(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_insights_campaign ON public.ai_insights(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON public.ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON public.ai_insights(priority);

-- ===============================================
-- ENHANCED ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Campaigns: authenticated only
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Campaigns select anon,authenticated" ON public.campaigns;
DROP POLICY IF EXISTS "Campaigns select authenticated" ON public.campaigns;
DROP POLICY IF EXISTS "Campaigns insert authenticated" ON public.campaigns;
DROP POLICY IF EXISTS "Campaigns update authenticated" ON public.campaigns;
DROP POLICY IF EXISTS "Campaigns delete authenticated" ON public.campaigns;

CREATE POLICY "Campaigns select authenticated" ON public.campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Campaigns insert authenticated" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Campaigns update authenticated" ON public.campaigns FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Campaigns delete authenticated" ON public.campaigns FOR DELETE TO authenticated USING (true);

-- Performance Snapshots: authenticated only
ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Performance select anon,authenticated" ON public.performance_snapshots;
DROP POLICY IF EXISTS "Performance insert authenticated" ON public.performance_snapshots;
DROP POLICY IF EXISTS "Performance update authenticated" ON public.performance_snapshots;
DROP POLICY IF EXISTS "Performance delete authenticated" ON public.performance_snapshots;

CREATE POLICY "Performance select authenticated" ON public.performance_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Performance insert authenticated" ON public.performance_snapshots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Performance update authenticated" ON public.performance_snapshots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Performance delete authenticated" ON public.performance_snapshots FOR DELETE TO authenticated USING (true);

-- Ad Accounts: authenticated only
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "AdAccounts select anon,authenticated" ON public.ad_accounts;
DROP POLICY IF EXISTS "AdAccounts select authenticated" ON public.ad_accounts;
DROP POLICY IF EXISTS "AdAccounts insert authenticated" ON public.ad_accounts;
DROP POLICY IF EXISTS "AdAccounts update authenticated" ON public.ad_accounts;
DROP POLICY IF EXISTS "AdAccounts delete authenticated" ON public.ad_accounts;

CREATE POLICY "AdAccounts select authenticated" ON public.ad_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "AdAccounts insert authenticated" ON public.ad_accounts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AdAccounts update authenticated" ON public.ad_accounts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "AdAccounts delete authenticated" ON public.ad_accounts FOR DELETE TO authenticated USING (true);

-- Keywords: authenticated only
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Keywords select anon,authenticated" ON public.keywords;
DROP POLICY IF EXISTS "Keywords insert authenticated" ON public.keywords;
DROP POLICY IF EXISTS "Keywords update authenticated" ON public.keywords;
DROP POLICY IF EXISTS "Keywords delete authenticated" ON public.keywords;

CREATE POLICY "Keywords select authenticated" ON public.keywords FOR SELECT TO authenticated USING (true);
CREATE POLICY "Keywords insert authenticated" ON public.keywords FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Keywords update authenticated" ON public.keywords FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Keywords delete authenticated" ON public.keywords FOR DELETE TO authenticated USING (true);

-- Audiences: authenticated only
ALTER TABLE public.audiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Audiences select anon,authenticated" ON public.audiences;
DROP POLICY IF EXISTS "Audiences insert authenticated" ON public.audiences;
DROP POLICY IF EXISTS "Audiences update authenticated" ON public.audiences;
DROP POLICY IF EXISTS "Audiences delete authenticated" ON public.audiences;

CREATE POLICY "Audiences select authenticated" ON public.audiences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Audiences insert authenticated" ON public.audiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Audiences update authenticated" ON public.audiences FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Audiences delete authenticated" ON public.audiences FOR DELETE TO authenticated USING (true);

-- Leads: restrict to owner via created_by
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leads select authenticated" ON public.leads;
DROP POLICY IF EXISTS "Leads select owner" ON public.leads;
DROP POLICY IF EXISTS "Leads insert authenticated" ON public.leads;
DROP POLICY IF EXISTS "Leads update authenticated" ON public.leads;
DROP POLICY IF EXISTS "Leads update owner" ON public.leads;
DROP POLICY IF EXISTS "Leads delete authenticated" ON public.leads;
DROP POLICY IF EXISTS "Leads delete owner" ON public.leads;

CREATE POLICY "Leads select owner" ON public.leads FOR SELECT TO authenticated USING ((SELECT auth.uid()) = created_by);
CREATE POLICY "Leads insert authenticated" ON public.leads FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = created_by);
CREATE POLICY "Leads update owner" ON public.leads FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = created_by) WITH CHECK ((SELECT auth.uid()) = created_by);
CREATE POLICY "Leads delete owner" ON public.leads FOR DELETE TO authenticated USING ((SELECT auth.uid()) = created_by);

-- Sync Logs: authenticated only
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "SyncLogs select authenticated" ON public.sync_logs;
DROP POLICY IF EXISTS "SyncLogs insert authenticated" ON public.sync_logs;
DROP POLICY IF EXISTS "SyncLogs update authenticated" ON public.sync_logs;
DROP POLICY IF EXISTS "SyncLogs delete authenticated" ON public.sync_logs;

CREATE POLICY "SyncLogs select authenticated" ON public.sync_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "SyncLogs insert authenticated" ON public.sync_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "SyncLogs update authenticated" ON public.sync_logs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "SyncLogs delete authenticated" ON public.sync_logs FOR DELETE TO authenticated USING (true);

-- AI Insights: authenticated only
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "AIInsights select authenticated" ON public.ai_insights;
DROP POLICY IF EXISTS "AIInsights insert authenticated" ON public.ai_insights;
DROP POLICY IF EXISTS "AIInsights update authenticated" ON public.ai_insights;
DROP POLICY IF EXISTS "AIInsights delete authenticated" ON public.ai_insights;

CREATE POLICY "AIInsights select authenticated" ON public.ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "AIInsights insert authenticated" ON public.ai_insights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AIInsights update authenticated" ON public.ai_insights FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "AIInsights delete authenticated" ON public.ai_insights FOR DELETE TO authenticated USING (true);

-- ===============================================
-- SAMPLE DATA FOR TESTING (SAFE)
-- ===============================================

-- Fix sample INSERT ON CONFLICT usage: ensure unique index then insert
CREATE UNIQUE INDEX IF NOT EXISTS uq_campaigns_name_platform ON public.campaigns(name, platform);

-- Re-run sample campaigns insert safely
INSERT INTO public.campaigns (name, platform, client_name, budget, status, campaign_type)
VALUES 
  ('Test Google Campaign', 'google_ads', 'Sample Client', 1000.00, 'active', 'search'),
  ('Test Meta Campaign', 'meta', 'Sample Client', 500.00, 'active', 'display'),
  ('Test LinkedIn Campaign', 'linkedin', 'Sample Client', 750.00, 'paused', 'sponsored_content')
ON CONFLICT (name, platform) DO NOTHING;

-- Fix performance sample generation using generate_series correctly
WITH sample_campaign AS (
  SELECT id FROM public.campaigns WHERE name = 'Test Google Campaign' LIMIT 1
)
INSERT INTO public.performance_snapshots (campaign_id, date, platform, impressions, clicks, conversions, spend)
SELECT 
  sc.id,
  (CURRENT_DATE - gs.n)::date,
  'google_ads'::text,
  (RANDOM() * 1000)::INTEGER + 100,
  (RANDOM() * 50)::INTEGER + 5,
  (RANDOM() * 5)::INTEGER,
  ((RANDOM() * 50)::numeric(10,2)) + 10
FROM sample_campaign sc, generate_series(0,6) AS gs(n)
ON CONFLICT (campaign_id, date, platform) DO NOTHING;

-- ===============================================
-- DEPLOYMENT VALIDATION & VERIFICATION
-- ===============================================
DO $$
DECLARE
    missing_tables TEXT[] := ARRAY[]::text[];
    expected_tables TEXT[] := ARRAY['campaigns', 'performance_snapshots', 'ad_accounts', 'keywords', 'audiences', 'leads', 'sync_logs', 'ai_insights'];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY expected_tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = tbl AND table_schema = 'public'
        ) THEN
            missing_tables := array_append(missing_tables, tbl);
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'WARNING: Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'SUCCESS: All tables created successfully!';
    END IF;
END;
$$;

-- Schema-aware column validation using NOTICE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing campaigns.status column';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ad_accounts' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing ad_accounts.status column';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'keywords' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing keywords.status column';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audiences' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing audiences.status column';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing leads.status column';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sync_logs' AND column_name = 'status') THEN
        RAISE NOTICE 'WARNING: Missing sync_logs.status column';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Status column validation completed!';
END;
$$;

-- Validation: show created_by column presence and indexes created
SELECT column_name FROM information_schema.columns 
WHERE table_schema='public' AND table_name='leads' AND column_name='created_by';

-- Verify tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN ('campaigns', 'performance_snapshots', 'ad_accounts', 'keywords', 'audiences', 'leads', 'sync_logs', 'ai_insights')
  AND schemaname = 'public'
ORDER BY tablename;

-- Verify status columns specifically
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'status'
  AND table_name IN ('campaigns', 'ad_accounts', 'keywords', 'audiences', 'leads', 'sync_logs')
ORDER BY table_name;

-- Show table row counts
SELECT 
  'campaigns' AS table_name, COUNT(*) AS row_count FROM public.campaigns
UNION ALL
SELECT 'performance_snapshots', COUNT(*) FROM public.performance_snapshots
UNION ALL  
SELECT 'ad_accounts', COUNT(*) FROM public.ad_accounts
UNION ALL
SELECT 'keywords', COUNT(*) FROM public.keywords
UNION ALL
SELECT 'audiences', COUNT(*) FROM public.audiences
UNION ALL
SELECT 'leads', COUNT(*) FROM public.leads
UNION ALL
SELECT 'sync_logs', COUNT(*) FROM public.sync_logs
UNION ALL
SELECT 'ai_insights', COUNT(*) FROM public.ai_insights;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================
SELECT 'PulseBridge.ai Database Schema Deployed Successfully! 🚀' AS deployment_status;
SELECT 'Applied security and schema adjustments.' AS status;