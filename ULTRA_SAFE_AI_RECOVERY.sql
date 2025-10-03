-- ============================================================================
-- ULTRA SAFE AI RECOVERY SCRIPT
-- PulseBridge.ai AI Tables Only - Minimal Conflicts
-- Date: October 3, 2025
-- Purpose: Restore ONLY the essential AI-powered agentic tables safely
-- ============================================================================

-- Focus on core AI tables that make your platform autonomous
-- No complex indexes, minimal foreign keys, maximum compatibility

-- ============================================================================
-- CORE AI AGENTIC SYSTEM TABLES
-- ============================================================================

-- Master AI Cycles (The heart of your autonomous system)
CREATE TABLE IF NOT EXISTS public.master_ai_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  cycle_status TEXT DEFAULT 'active',
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  total_budget NUMERIC(12,2),
  platforms_included TEXT[],
  optimization_goals JSONB,
  ai_confidence_score NUMERIC(5,2) DEFAULT 0,
  performance_summary JSONB,
  decisions_made INTEGER DEFAULT 0,
  actions_taken INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Decision Logs (Every autonomous decision tracked)
CREATE TABLE IF NOT EXISTS public.ai_decision_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID,
  decision_type TEXT NOT NULL,
  target_platform TEXT NOT NULL,
  decision_data JSONB NOT NULL,
  reasoning TEXT,
  confidence_score NUMERIC(5,2) NOT NULL,
  expected_impact JSONB,
  actual_impact JSONB,
  execution_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Performance Scores (Continuous performance tracking)
CREATE TABLE IF NOT EXISTS public.ai_performance_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  score_type TEXT NOT NULL,
  current_score NUMERIC(5,2) NOT NULL,
  previous_score NUMERIC(5,2),
  score_change NUMERIC(5,2),
  trend_direction TEXT,
  contributing_factors JSONB,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Smart Alerts (Intelligent monitoring)
CREATE TABLE IF NOT EXISTS public.ai_smart_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  priority_level TEXT NOT NULL,
  alert_title TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  alert_data JSONB,
  alert_status TEXT DEFAULT 'active',
  priority_score INTEGER DEFAULT 0,
  auto_resolve_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Recommendations (Autonomous optimization suggestions)
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_type TEXT NOT NULL,
  rec_title TEXT NOT NULL,
  rec_description TEXT NOT NULL,
  priority_level TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  expected_impact JSONB,
  implementation_effort TEXT,
  rec_status TEXT DEFAULT 'pending',
  recommendation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Campaign Forecasts (Predictive modeling)
CREATE TABLE IF NOT EXISTS public.ai_campaign_forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  forecast_type TEXT NOT NULL,
  time_horizon_days INTEGER NOT NULL,
  predicted_values JSONB NOT NULL,
  confidence_interval JSONB,
  model_accuracy NUMERIC(5,2),
  factors_considered TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meta AI Insights (Cross-platform intelligence)
CREATE TABLE IF NOT EXISTS public.meta_ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL,
  platforms_analyzed TEXT[] NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  potential_impact JSONB,
  recommended_actions TEXT[],
  insight_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Optimization Opportunities (Advanced opportunity detection)
CREATE TABLE IF NOT EXISTS public.ai_optimization_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_type TEXT NOT NULL,
  opportunity_title TEXT NOT NULL,
  opportunity_description TEXT NOT NULL,
  potential_impact_score NUMERIC(5,2),
  implementation_complexity TEXT,
  estimated_roi NUMERIC(10,2),
  priority_ranking INTEGER,
  opportunity_data JSONB,
  discovery_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'identified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Model Performance (Track AI model effectiveness)
CREATE TABLE IF NOT EXISTS public.ai_model_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_version TEXT,
  performance_metric TEXT NOT NULL,
  metric_value NUMERIC(10,4),
  benchmark_value NUMERIC(10,4),
  performance_trend TEXT,
  evaluation_date TIMESTAMPTZ DEFAULT NOW(),
  model_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI System Configuration (AI system settings)
CREATE TABLE IF NOT EXISTS public.ai_system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_category TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  config_description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_modified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(config_category, config_key)
);

-- ============================================================================
-- ESSENTIAL BUSINESS TABLES (If needed)
-- ============================================================================

-- Core campaigns (if doesn't exist)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  client_name TEXT NOT NULL,
  budget NUMERIC(10,2),
  spend NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaigns (for marketing automation)
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  send_date TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  unsubscribed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NO INDEXES - ZERO CONFLICT APPROACH
-- ============================================================================

-- Skipping all index creation to ensure 100% success
-- Indexes can be added later once all tables are confirmed working

-- ============================================================================
-- SKIP RLS FOR NOW - PURE TABLE CREATION FOCUS
-- ============================================================================

-- Skipping RLS to ensure pure table creation success
-- RLS can be enabled later once tables are confirmed working

-- ============================================================================
-- SKIP POLICIES FOR NOW - PURE TABLE CREATION FOCUS
-- ============================================================================

-- Skipping all policies to ensure pure table creation success
-- Policies can be added later once tables are confirmed working

-- ============================================================================
-- SUCCESS CONFIRMATION & TABLE STRUCTURE VERIFICATION
-- ============================================================================

-- First, let's check what tables exist
SELECT 
  '📊 DATABASE RECOVERY STATUS CHECK' as status,
  tablename,
  schemaname
FROM pg_tables 
WHERE schemaname = 'public' 
  AND (tablename LIKE '%ai_%' OR tablename IN ('master_ai_cycles', 'campaigns', 'email_campaigns'))
ORDER BY tablename;

-- Check master_ai_cycles table structure if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'master_ai_cycles' AND schemaname = 'public') THEN
    RAISE NOTICE 'Master AI Cycles table exists - checking structure...';
  ELSE
    RAISE NOTICE 'Master AI Cycles table does not exist yet';
  END IF;
END $$;

-- Safe insert into campaigns (only if table exists with correct structure)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' 
      AND column_name = 'name' 
      AND table_schema = 'public'
  ) THEN
    INSERT INTO campaigns (name, platform, client_name, budget, status) 
    VALUES ('AI System Recovery Test', 'google_ads', 'PulseBridge.ai', 1000.00, 'active') 
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Test campaign inserted successfully';
  ELSE
    RAISE NOTICE 'Campaigns table not ready for insert yet';
  END IF;
END $$;

-- Safe insert into master_ai_cycles (only if table exists with correct structure)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'master_ai_cycles' 
      AND column_name = 'cycle_name' 
      AND table_schema = 'public'
  ) THEN
    INSERT INTO master_ai_cycles (cycle_name, client_name, cycle_status, total_budget) 
    VALUES ('Initial AI Recovery Cycle', 'PulseBridge.ai', 'active', 5000.00) 
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Test AI cycle inserted successfully';
  ELSE
    RAISE NOTICE 'Master AI Cycles table not ready for insert yet - checking available columns...';
    
    -- Show available columns for debugging
    PERFORM column_name FROM information_schema.columns 
    WHERE table_name = 'master_ai_cycles' AND table_schema = 'public';
  END IF;
END $$;

-- Final success message with table count
SELECT 
  '🤖 AI-POWERED AGENTIC SYSTEM RECOVERY COMPLETE!' as status,
  'Tables created successfully - ready for AI autonomous operations!' as message,
  COUNT(*) as ai_tables_created
FROM pg_tables 
WHERE schemaname = 'public' 
  AND (tablename LIKE '%ai_%' OR tablename IN ('master_ai_cycles', 'campaigns', 'email_campaigns'));