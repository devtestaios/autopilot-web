-- ===============================================
-- META AI HYBRID INTEGRATION - DATABASE SCHEMA ENHANCEMENT
-- Enhanced schema for PulseBridge AI Master Controller with Meta AI symbiosis
-- ===============================================

-- ===============================================
-- 1. AI DECISION LOGS TABLE (Enhanced)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.ai_decision_logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  decision_id TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  decision_type TEXT NOT NULL CHECK (decision_type IN (
    'strategic_override', 'platform_coordination', 'budget_reallocation', 
    'performance_optimization', 'cross_platform_analysis'
  )),
  platform_affected TEXT NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id),
  override_reason TEXT CHECK (override_reason IN (
    'meta_underperformance', 'better_platform_roi', 
    'budget_efficiency', 'strategic_rebalance'
  )),
  confidence_score NUMERIC(3,2) NOT NULL,
  expected_impact JSONB DEFAULT '{}'::jsonb,
  meta_ai_input JSONB DEFAULT '{}'::jsonb,
  cross_platform_context JSONB DEFAULT '[]'::jsonb,
  action_taken TEXT NOT NULL,
  execution_result JSONB DEFAULT '{}'::jsonb,
  estimated_roi_improvement NUMERIC(5,2),
  testing_mode BOOLEAN DEFAULT true,
  client_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_ai_decision_logs_updated_at
    BEFORE UPDATE ON public.ai_decision_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 2. META AI INSIGHTS TABLE (New)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.meta_ai_insights (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  insight_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_ai_version TEXT DEFAULT 'v23.0',
  native_recommendations JSONB DEFAULT '[]'::jsonb,
  confidence_scores JSONB DEFAULT '{}'::jsonb,
  optimization_actions JSONB DEFAULT '[]'::jsonb,
  performance_predictions JSONB DEFAULT '{}'::jsonb,
  advantage_plus_status JSONB DEFAULT '{}'::jsonb,
  audience_insights JSONB DEFAULT '{}'::jsonb,
  creative_insights JSONB DEFAULT '{}'::jsonb,
  budget_recommendations JSONB DEFAULT '{}'::jsonb,
  placement_optimization JSONB DEFAULT '{}'::jsonb,
  master_ai_processed BOOLEAN DEFAULT false,
  integration_effectiveness NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_meta_ai_insights_updated_at
    BEFORE UPDATE ON public.meta_ai_insights
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 3. CROSS PLATFORM PERFORMANCE TABLE (Enhanced)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.cross_platform_performance (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  campaign_id UUID REFERENCES public.campaigns(id),
  roas NUMERIC(10,4),
  cpa NUMERIC(10,2),
  conversion_rate NUMERIC(7,4),
  ctr NUMERIC(7,6),
  quality_score NUMERIC(3,2),
  confidence_score NUMERIC(3,2),
  performance_trend TEXT CHECK (performance_trend IN ('improving', 'declining', 'stable', 'insufficient_data')),
  platform_rank INTEGER,
  composite_score NUMERIC(8,4),
  optimization_potential NUMERIC(3,2),
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  master_ai_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(analysis_date, platform, campaign_id)
);

CREATE TRIGGER trg_cross_platform_performance_updated_at
    BEFORE UPDATE ON public.cross_platform_performance
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 4. TESTING CONFIGURATIONS TABLE (New)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.testing_configurations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  config_name TEXT UNIQUE NOT NULL,
  description TEXT,
  testing_mode BOOLEAN DEFAULT true,
  auto_execution_enabled BOOLEAN DEFAULT false,
  risk_level TEXT DEFAULT 'conservative' CHECK (risk_level IN ('conservative', 'balanced', 'aggressive')),
  confidence_thresholds JSONB DEFAULT '{
    "conservative": 0.95,
    "balanced": 0.85, 
    "aggressive": 0.75
  }'::jsonb,
  budget_change_limits JSONB DEFAULT '{
    "conservative": 0.10,
    "balanced": 0.25,
    "aggressive": 0.50
  }'::jsonb,
  override_conditions JSONB DEFAULT '{
    "min_performance_gap": 0.25,
    "min_confidence": 0.85,
    "cooling_period_hours": 24
  }'::jsonb,
  platform_priorities JSONB DEFAULT '{
    "google_ads": 1,
    "meta": 2, 
    "linkedin": 3,
    "pinterest": 4
  }'::jsonb,
  client_notification_settings JSONB DEFAULT '{
    "notify_on_override": true,
    "notify_on_reallocation": true,
    "summary_frequency": "daily"
  }'::jsonb,
  active BOOLEAN DEFAULT false,
  created_by UUID DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_testing_configurations_updated_at
    BEFORE UPDATE ON public.testing_configurations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 5. MASTER AI CYCLES TABLE (New)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.master_ai_cycles (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  cycle_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  testing_config_id UUID REFERENCES public.testing_configurations(id),
  platforms_analyzed INTEGER DEFAULT 0,
  campaigns_analyzed INTEGER DEFAULT 0,
  strategic_decisions INTEGER DEFAULT 0,
  meta_ai_insights_processed INTEGER DEFAULT 0,
  decisions_executed INTEGER DEFAULT 0,
  decisions_recommended INTEGER DEFAULT 0,
  estimated_total_roi_improvement NUMERIC(8,4),
  actual_roi_improvement NUMERIC(8,4),
  cycle_effectiveness NUMERIC(3,2),
  error_message TEXT,
  cycle_data JSONB DEFAULT '{}'::jsonb,
  performance_summary JSONB DEFAULT '{}'::jsonb,
  next_cycle_scheduled TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_master_ai_cycles_updated_at
    BEFORE UPDATE ON public.master_ai_cycles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- 6. PLATFORM AI COORDINATION TABLE (New)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.platform_ai_coordination (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  master_cycle_id UUID REFERENCES public.master_ai_cycles(id),
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  native_ai_status TEXT DEFAULT 'active' CHECK (native_ai_status IN ('active', 'overridden', 'coordinated', 'disabled')),
  master_ai_instructions JSONB DEFAULT '{}'::jsonb,
  native_ai_response JSONB DEFAULT '{}'::jsonb,
  coordination_effectiveness NUMERIC(3,2),
  override_applied BOOLEAN DEFAULT false,
  override_reason TEXT,
  performance_impact JSONB DEFAULT '{}'::jsonb,
  symbiosis_score NUMERIC(3,2), -- How well the AIs work together
  conflict_resolution JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_platform_ai_coordination_updated_at
    BEFORE UPDATE ON public.platform_ai_coordination
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================
-- ENHANCED INDEXES FOR HYBRID AI PERFORMANCE
-- ===============================================

-- AI Decision Logs indexes
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_timestamp ON public.ai_decision_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_campaign ON public.ai_decision_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_platform ON public.ai_decision_logs(platform_affected);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_decision_type ON public.ai_decision_logs(decision_type);
CREATE INDEX IF NOT EXISTS idx_ai_decision_logs_testing_mode ON public.ai_decision_logs(testing_mode);

-- Meta AI Insights indexes
CREATE INDEX IF NOT EXISTS idx_meta_ai_insights_campaign ON public.meta_ai_insights(campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_ai_insights_timestamp ON public.meta_ai_insights(insight_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_meta_ai_insights_processed ON public.meta_ai_insights(master_ai_processed);

-- Cross Platform Performance indexes
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_date ON public.cross_platform_performance(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_platform ON public.cross_platform_performance(platform);
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_campaign ON public.cross_platform_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_cross_platform_performance_rank ON public.cross_platform_performance(platform_rank);

-- Master AI Cycles indexes
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_started ON public.master_ai_cycles(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_config ON public.master_ai_cycles(testing_config_id);
CREATE INDEX IF NOT EXISTS idx_master_ai_cycles_effectiveness ON public.master_ai_cycles(cycle_effectiveness DESC);

-- Platform AI Coordination indexes
CREATE INDEX IF NOT EXISTS idx_platform_ai_coordination_cycle ON public.platform_ai_coordination(master_cycle_id);
CREATE INDEX IF NOT EXISTS idx_platform_ai_coordination_platform ON public.platform_ai_coordination(platform);
CREATE INDEX IF NOT EXISTS idx_platform_ai_coordination_override ON public.platform_ai_coordination(override_applied);

-- ===============================================
-- ENHANCED ROW LEVEL SECURITY POLICIES
-- ===============================================

-- AI Decision Logs: authenticated only
ALTER TABLE public.ai_decision_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI Decision Logs select authenticated" ON public.ai_decision_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI Decision Logs insert authenticated" ON public.ai_decision_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI Decision Logs update authenticated" ON public.ai_decision_logs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Meta AI Insights: authenticated only
ALTER TABLE public.meta_ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meta AI Insights select authenticated" ON public.meta_ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Meta AI Insights insert authenticated" ON public.meta_ai_insights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Meta AI Insights update authenticated" ON public.meta_ai_insights FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Cross Platform Performance: authenticated only
ALTER TABLE public.cross_platform_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cross Platform Performance select authenticated" ON public.cross_platform_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Cross Platform Performance insert authenticated" ON public.cross_platform_performance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Cross Platform Performance update authenticated" ON public.cross_platform_performance FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Testing Configurations: owner-based access
ALTER TABLE public.testing_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testing Configurations select owner" ON public.testing_configurations FOR SELECT TO authenticated USING ((SELECT auth.uid()) = created_by);
CREATE POLICY "Testing Configurations insert authenticated" ON public.testing_configurations FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = created_by);
CREATE POLICY "Testing Configurations update owner" ON public.testing_configurations FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = created_by) WITH CHECK ((SELECT auth.uid()) = created_by);

-- Master AI Cycles: authenticated only
ALTER TABLE public.master_ai_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Master AI Cycles select authenticated" ON public.master_ai_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master AI Cycles insert authenticated" ON public.master_ai_cycles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Master AI Cycles update authenticated" ON public.master_ai_cycles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Platform AI Coordination: authenticated only
ALTER TABLE public.platform_ai_coordination ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Platform AI Coordination select authenticated" ON public.platform_ai_coordination FOR SELECT TO authenticated USING (true);
CREATE POLICY "Platform AI Coordination insert authenticated" ON public.platform_ai_coordination FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Platform AI Coordination update authenticated" ON public.platform_ai_coordination FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ===============================================
-- DEFAULT TESTING CONFIGURATION
-- ===============================================

-- Insert default conservative testing configuration
INSERT INTO public.testing_configurations (
  config_name,
  description,
  testing_mode,
  auto_execution_enabled,
  risk_level,
  confidence_thresholds,
  budget_change_limits,
  override_conditions,
  platform_priorities,
  client_notification_settings,
  active
) VALUES (
  'Conservative Beta Testing',
  'Default conservative configuration for beta testing hybrid AI system',
  true,
  false,
  'conservative',
  '{
    "conservative": 0.95,
    "balanced": 0.85, 
    "aggressive": 0.75
  }'::jsonb,
  '{
    "conservative": 0.10,
    "balanced": 0.25,
    "aggressive": 0.50
  }'::jsonb,
  '{
    "min_performance_gap": 0.25,
    "min_confidence": 0.85,
    "cooling_period_hours": 24,
    "max_daily_overrides": 3,
    "require_human_approval_over": 500
  }'::jsonb,
  '{
    "google_ads": 1,
    "meta": 2, 
    "linkedin": 3,
    "pinterest": 4
  }'::jsonb,
  '{
    "notify_on_override": true,
    "notify_on_reallocation": true,
    "summary_frequency": "daily",
    "include_meta_ai_insights": true,
    "show_confidence_scores": true
  }'::jsonb,
  true
) ON CONFLICT (config_name) DO UPDATE SET 
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- ===============================================
-- VALIDATION QUERIES
-- ===============================================

-- Verify enhanced tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN (
  'ai_decision_logs', 'meta_ai_insights', 'cross_platform_performance',
  'testing_configurations', 'master_ai_cycles', 'platform_ai_coordination'
) AND schemaname = 'public'
ORDER BY tablename;

-- Verify testing configuration was inserted
SELECT config_name, risk_level, active FROM public.testing_configurations WHERE active = true;

-- Show enhanced table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('ai_decision_logs', 'meta_ai_insights', 'testing_configurations')
ORDER BY table_name, ordinal_position;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================
SELECT 'PulseBridge.ai Hybrid AI Database Schema Enhanced Successfully! 🤖🧠' AS enhancement_status;
SELECT 'Meta AI symbiotic integration tables created with full testing capabilities.' AS status;