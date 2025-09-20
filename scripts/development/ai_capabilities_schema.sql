-- Advanced AI Capabilities Schema for PulseBridge.ai
-- Execute these commands in Supabase SQL Editor

-- Create ai_predictions table for forecasting and analytics
CREATE TABLE ai_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL, -- 'performance_forecast', 'budget_optimization', 'roi_prediction'
  input_data JSONB NOT NULL, -- Historical data used for prediction
  prediction_data JSONB NOT NULL, -- AI predictions and confidence scores
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  prediction_period TEXT NOT NULL, -- '7d', '30d', '90d'
  model_version TEXT DEFAULT 'claude-3-sonnet',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL -- When prediction becomes stale
);

-- Create ai_content_generation table for ad copy and creatives
CREATE TABLE ai_content_generation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'ad_copy', 'headlines', 'descriptions', 'keywords'
  target_platform TEXT NOT NULL, -- 'google_ads', 'meta', 'linkedin'
  input_prompt TEXT NOT NULL,
  generated_content JSONB NOT NULL, -- Array of generated variations
  performance_data JSONB, -- A/B test results if available
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_by UUID, -- Reference to auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_competitor_analysis table for market intelligence
CREATE TABLE ai_competitor_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  competitor_name TEXT,
  analysis_type TEXT NOT NULL, -- 'market_position', 'keyword_gap', 'ad_strategy', 'pricing'
  analysis_data JSONB NOT NULL, -- Competitor insights and recommendations
  opportunities JSONB, -- Identified opportunities
  threats JSONB, -- Potential threats
  confidence_score DECIMAL(3,2),
  data_sources JSONB, -- Sources used for analysis
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_optimization_recommendations table
CREATE TABLE ai_optimization_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'budget_reallocation', 'audience_expansion', 'bid_adjustment', 'keyword_optimization'
  current_state JSONB NOT NULL, -- Current campaign configuration
  recommended_changes JSONB NOT NULL, -- Suggested optimizations
  expected_impact JSONB NOT NULL, -- Predicted outcomes (CTR, CPA, ROI improvements)
  confidence_score DECIMAL(3,2),
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'implemented', 'rejected'
  implementation_date TIMESTAMP WITH TIME ZONE,
  results JSONB, -- Actual results after implementation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_model_performance table for tracking AI accuracy
CREATE TABLE ai_model_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type TEXT NOT NULL, -- 'prediction', 'content_generation', 'optimization'
  model_version TEXT NOT NULL,
  prediction_id UUID, -- Reference to specific prediction
  actual_outcome JSONB, -- What actually happened
  predicted_outcome JSONB, -- What was predicted
  accuracy_score DECIMAL(5,4), -- 0.0000 to 1.0000
  error_metrics JSONB, -- MAE, RMSE, etc.
  feedback_score INTEGER, -- User feedback 1-5
  notes TEXT,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_generation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_performance ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all on ai_predictions" ON ai_predictions FOR ALL USING (true);
CREATE POLICY "Allow all on ai_content_generation" ON ai_content_generation FOR ALL USING (true);
CREATE POLICY "Allow all on ai_competitor_analysis" ON ai_competitor_analysis FOR ALL USING (true);
CREATE POLICY "Allow all on ai_optimization_recommendations" ON ai_optimization_recommendations FOR ALL USING (true);
CREATE POLICY "Allow all on ai_model_performance" ON ai_model_performance FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_ai_predictions_campaign_id ON ai_predictions(campaign_id);
CREATE INDEX idx_ai_predictions_type ON ai_predictions(prediction_type);
CREATE INDEX idx_ai_predictions_expires_at ON ai_predictions(expires_at);
CREATE INDEX idx_ai_content_campaign_id ON ai_content_generation(campaign_id);
CREATE INDEX idx_ai_content_platform ON ai_content_generation(target_platform);
CREATE INDEX idx_ai_competitor_industry ON ai_competitor_analysis(industry);
CREATE INDEX idx_ai_recommendations_campaign_id ON ai_optimization_recommendations(campaign_id);
CREATE INDEX idx_ai_recommendations_status ON ai_optimization_recommendations(status);
CREATE INDEX idx_ai_recommendations_priority ON ai_optimization_recommendations(priority);

-- Sample AI prediction data
INSERT INTO ai_predictions (campaign_id, prediction_type, input_data, prediction_data, confidence_score, prediction_period, expires_at) 
SELECT 
  c.id,
  'performance_forecast',
  jsonb_build_object(
    'historical_ctr', 0.025,
    'historical_cpa', 45.50,
    'budget', 1000,
    'days_active', 30
  ),
  jsonb_build_object(
    'predicted_ctr', 0.032,
    'predicted_cpa', 38.75,
    'predicted_conversions', 26,
    'predicted_revenue', 2600,
    'confidence_intervals', jsonb_build_object(
      'ctr_range', jsonb_build_array(0.028, 0.036),
      'cpa_range', jsonb_build_array(35.20, 42.30)
    )
  ),
  0.87,
  '30d',
  NOW() + INTERVAL '7 days'
FROM campaigns c LIMIT 3;

-- Sample content generation data
INSERT INTO ai_content_generation (campaign_id, content_type, target_platform, input_prompt, generated_content, is_approved)
SELECT 
  c.id,
  'ad_copy',
  'google_ads',
  'Create compelling ad copy for digital marketing services targeting small businesses',
  jsonb_build_object(
    'variations', jsonb_build_array(
      jsonb_build_object(
        'headline', 'Transform Your Marketing Today',
        'description', 'Boost ROI by 300% with AI-powered campaign optimization. Start your free trial now.',
        'cta', 'Get Started Free'
      ),
      jsonb_build_object(
        'headline', 'Stop Wasting Ad Spend',
        'description', 'Smart automation finds your best customers and maximizes every dollar. See results in 7 days.',
        'cta', 'Try Risk-Free'
      ),
      jsonb_build_object(
        'headline', 'Marketing That Actually Works',
        'description', 'Join 10,000+ businesses using AI to drive real growth. No contracts, cancel anytime.',
        'cta', 'Start Free Trial'
      )
    )
  ),
  true
FROM campaigns c LIMIT 2;

-- Sample optimization recommendations
INSERT INTO ai_optimization_recommendations (campaign_id, recommendation_type, current_state, recommended_changes, expected_impact, confidence_score, priority)
SELECT 
  c.id,
  'budget_reallocation',
  jsonb_build_object(
    'current_budget', 1000,
    'current_allocation', jsonb_build_object('search', 600, 'display', 400)
  ),
  jsonb_build_object(
    'new_allocation', jsonb_build_object('search', 750, 'display', 250),
    'rationale', 'Search campaigns showing 40% higher conversion rate'
  ),
  jsonb_build_object(
    'expected_ctr_improvement', 0.15,
    'expected_cpa_reduction', 12.50,
    'expected_roi_increase', 0.25
  ),
  0.92,
  'high'
FROM campaigns c LIMIT 2;