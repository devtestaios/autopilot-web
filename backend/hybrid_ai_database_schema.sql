-- PulseBridge AI Hybrid AI System Database Schema
-- Extends existing 8-table schema with hybrid AI capabilities
-- Deploy this in Supabase SQL Editor after main schema

-- 1. AI Decision Logs - Track all hybrid AI decisions with full context
CREATE TABLE IF NOT EXISTS ai_decision_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  master_cycle_id UUID, -- References master_ai_cycles
  decision_type VARCHAR(50) NOT NULL, -- 'budget_optimization', 'campaign_creation', 'audience_targeting', etc.
  platform VARCHAR(30) NOT NULL, -- 'google_ads', 'meta', 'linkedin', 'cross_platform'
  campaign_ids TEXT[], -- Array of affected campaign UUIDs
  input_data JSONB NOT NULL, -- Complete input context for decision
  ai_recommendation JSONB NOT NULL, -- AI's recommended action
  risk_assessment JSONB NOT NULL, -- Risk analysis results
  final_decision JSONB NOT NULL, -- Actual decision made (may differ from recommendation)
  execution_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'executed', 'failed', 'cancelled'
  human_override BOOLEAN DEFAULT FALSE, -- Whether human intervened
  override_reason TEXT, -- Reason for any override
  performance_impact JSONB, -- Measured impact after execution
  confidence_score DECIMAL(3,2), -- AI confidence (0.00-1.00)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Meta AI Insights - Store Meta's native AI recommendations
CREATE TABLE IF NOT EXISTS meta_ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID, -- References campaigns table
  ad_account_id VARCHAR(50), -- Meta ad account ID
  insight_type VARCHAR(50) NOT NULL, -- 'advantage_plus', 'dynamic_creative', 'audience_expansion', 'budget_optimization'
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

-- 3. Cross Platform Performance - Unified performance tracking across all platforms
CREATE TABLE IF NOT EXISTS cross_platform_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  -- Cross-platform totals
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
  -- Platform distribution
  google_spend_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN (google_spend + meta_spend + linkedin_spend) > 0 
      THEN (google_spend / (google_spend + meta_spend + linkedin_spend)) * 100
      ELSE 0 
    END
  ) STORED,
  meta_spend_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN (google_spend + meta_spend + linkedin_spend) > 0 
      THEN (meta_spend / (google_spend + meta_spend + linkedin_spend)) * 100
      ELSE 0 
    END
  ) STORED,
  linkedin_spend_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN (google_spend + meta_spend + linkedin_spend) > 0 
      THEN (linkedin_spend / (google_spend + meta_spend + linkedin_spend)) * 100
      ELSE 0 
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

-- 4. Testing Configurations - Manage different AI testing modes
CREATE TABLE IF NOT EXISTS testing_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- 5. Master AI Cycles - Track complete optimization cycles
CREATE TABLE IF NOT EXISTS master_ai_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (COALESCE(end_time, NOW()) - start_time)) / 60
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Platform AI Coordination - Track coordination between different AI systems
CREATE TABLE IF NOT EXISTS platform_ai_coordination (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  master_cycle_id UUID REFERENCES master_ai_cycles(id),
  coordination_type VARCHAR(50) NOT NULL, -- 'budget_reallocation', 'audience_sync', 'creative_sync', 'bidding_coordination'
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
  total_coordination_time_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (COALESCE(coordination_end, NOW()) - coordination_start)) / 60
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
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

-- Enable Row Level Security
ALTER TABLE ai_decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_platform_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_ai_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_ai_coordination ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, customize based on auth requirements)
CREATE POLICY "Allow all on ai_decision_logs" ON ai_decision_logs FOR ALL USING (true);
CREATE POLICY "Allow all on meta_ai_insights" ON meta_ai_insights FOR ALL USING (true);
CREATE POLICY "Allow all on cross_platform_performance" ON cross_platform_performance FOR ALL USING (true);
CREATE POLICY "Allow all on testing_configurations" ON testing_configurations FOR ALL USING (true);
CREATE POLICY "Allow all on master_ai_cycles" ON master_ai_cycles FOR ALL USING (true);
CREATE POLICY "Allow all on platform_ai_coordination" ON platform_ai_coordination FOR ALL USING (true);

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
  'Conservative Beta Testing',
  true,
  'conservative',
  5.00, -- Max 5% daily budget changes
  15.00, -- Max 15% weekly increases
  250.00, -- Hard $250 daily limit
  0.85, -- Require 85% confidence
  100.00, -- Require approval for $100+ changes
  false, -- No auto-execution in beta
  true, -- Enable A/B testing
  5.00, -- Only 5% for testing
  14, -- 2-week test cycles
  '{"google_ads": 0.4, "meta": 0.4, "linkedin": 0.2}',
  10.00, -- Alert on 10% performance drops
  15.00, -- Alert on 15% spend anomalies
  'daily',
  true, -- Always require client approval in beta
  true, -- Show only PulseBridge AI branding
  'System Default'
) ON CONFLICT DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE ai_decision_logs IS 'Comprehensive log of all AI decisions with full context and outcomes';
COMMENT ON TABLE meta_ai_insights IS 'Meta AI native recommendations processed by PulseBridge AI Master Controller';
COMMENT ON TABLE cross_platform_performance IS 'Unified performance tracking across Google Ads, Meta, and LinkedIn';
COMMENT ON TABLE testing_configurations IS 'Configurable testing modes for different risk tolerances and client requirements';
COMMENT ON TABLE master_ai_cycles IS 'Complete optimization cycles managed by PulseBridge AI Master Controller';
COMMENT ON TABLE platform_ai_coordination IS 'Coordination activities between different platform AI systems';