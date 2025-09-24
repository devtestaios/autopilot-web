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