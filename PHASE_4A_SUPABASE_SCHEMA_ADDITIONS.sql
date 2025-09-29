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