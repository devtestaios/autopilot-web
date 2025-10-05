-- ===============================================
-- AI USAGE TRACKING TABLE IMPLEMENTATION
-- Persistent storage for AI rate limiting and cost tracking
-- PulseBridge.ai Enterprise Platform
-- Execute in Supabase SQL Editor
-- ===============================================

-- ===============================================
-- 1. CREATE AI_USAGE TABLE FOR PERSISTENT TRACKING
-- ===============================================

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  tenant_id UUID, -- Additional tenant reference if needed
  
  -- Request Details
  model VARCHAR(50) NOT NULL, -- 'claude', 'gpt-4', 'gpt-3.5', etc.
  endpoint VARCHAR(100) NOT NULL, -- '/api/chat', '/api/ai/generate-content', etc.
  subscription_tier VARCHAR(50) NOT NULL, -- 'trial', 'solo_professional', etc.
  
  -- Usage Metrics
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  
  -- Cost Tracking
  cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000, -- Cost in USD
  
  -- Request Metadata
  request_duration_ms INTEGER, -- How long the request took
  request_status VARCHAR(20) DEFAULT 'success', -- 'success', 'error', 'rate_limited'
  error_message TEXT, -- Store error details if request failed
  
  -- Additional Context
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. CREATE PERFORMANCE INDEXES
-- ===============================================

-- User-based queries (rate limiting checks)
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date 
ON public.ai_usage(user_id, created_at DESC);

-- Company-based queries (tenant usage tracking)
CREATE INDEX IF NOT EXISTS idx_ai_usage_company_date 
ON public.ai_usage(company_id, created_at DESC);

-- Cost tracking and analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_cost_tracking 
ON public.ai_usage(created_at, cost_usd);

-- Model and endpoint analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_model_endpoint 
ON public.ai_usage(model, endpoint, created_at DESC);

-- Subscription tier analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_tier_cost 
ON public.ai_usage(subscription_tier, created_at, cost_usd);

-- Status and error tracking
CREATE INDEX IF NOT EXISTS idx_ai_usage_status 
ON public.ai_usage(request_status, created_at) 
WHERE request_status != 'success';

-- ===============================================
-- 3. ROW-LEVEL SECURITY POLICIES
-- ===============================================

-- Enable RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own AI usage" ON public.ai_usage
  FOR SELECT USING (
    user_id = auth.uid()
  );

-- Company admins can see company usage
CREATE POLICY "Company admins can view company AI usage" ON public.ai_usage
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('company_admin', 'super_admin')
    )
  );

-- System can insert usage records
CREATE POLICY "System can insert AI usage" ON public.ai_usage
  FOR INSERT WITH CHECK (true);

-- ===============================================
-- 4. AI USAGE ANALYTICS FUNCTIONS
-- ===============================================

-- Get user daily usage summary
CREATE OR REPLACE FUNCTION get_user_daily_ai_usage(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL(10,4),
  by_model JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_requests,
    SUM(total_tokens) as total_tokens,
    SUM(cost_usd) as total_cost,
    jsonb_object_agg(
      model, 
      jsonb_build_object(
        'requests', model_requests,
        'tokens', model_tokens,
        'cost', model_cost
      )
    ) as by_model
  FROM (
    SELECT 
      model,
      COUNT(*) as model_requests,
      SUM(total_tokens) as model_tokens,
      SUM(cost_usd) as model_cost
    FROM public.ai_usage
    WHERE user_id = p_user_id
      AND DATE(created_at) = p_date
    GROUP BY model
  ) model_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get company monthly usage summary
CREATE OR REPLACE FUNCTION get_company_monthly_ai_usage(
  p_company_id UUID,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)
)
RETURNS TABLE (
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL(10,4),
  unique_users BIGINT,
  avg_cost_per_request DECIMAL(10,4)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_requests,
    SUM(total_tokens) as total_tokens,
    SUM(cost_usd) as total_cost,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(cost_usd) as avg_cost_per_request
  FROM public.ai_usage
  WHERE company_id = p_company_id
    AND EXTRACT(YEAR FROM created_at) = p_year
    AND EXTRACT(MONTH FROM created_at) = p_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get cost alerts for users approaching limits
CREATE OR REPLACE FUNCTION get_ai_cost_alerts()
RETURNS TABLE (
  user_id UUID,
  company_id UUID,
  subscription_tier VARCHAR(50),
  daily_cost DECIMAL(10,4),
  daily_limit DECIMAL(10,4),
  usage_percentage DECIMAL(5,2),
  alert_level VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_usage AS (
    SELECT 
      u.user_id,
      u.company_id,
      u.subscription_tier,
      SUM(u.cost_usd) as daily_cost,
      CASE u.subscription_tier
        WHEN 'trial' THEN 1.00
        WHEN 'solo_professional' THEN 5.00
        WHEN 'growth_team' THEN 15.00
        WHEN 'professional_agency' THEN 30.00
        WHEN 'enterprise' THEN 60.00
        WHEN 'enterprise_plus' THEN 120.00
        ELSE 1.00
      END as daily_limit
    FROM public.ai_usage u
    WHERE DATE(u.created_at) = CURRENT_DATE
    GROUP BY u.user_id, u.company_id, u.subscription_tier
  )
  SELECT 
    du.user_id,
    du.company_id,
    du.subscription_tier,
    du.daily_cost,
    du.daily_limit,
    (du.daily_cost / du.daily_limit * 100) as usage_percentage,
    CASE 
      WHEN du.daily_cost / du.daily_limit >= 0.95 THEN 'critical'
      WHEN du.daily_cost / du.daily_limit >= 0.80 THEN 'warning'
      ELSE 'normal'
    END as alert_level
  FROM daily_usage du
  WHERE du.daily_cost / du.daily_limit >= 0.80
  ORDER BY usage_percentage DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 5. TRIGGER FOR UPDATED_AT
-- ===============================================

CREATE OR REPLACE FUNCTION update_ai_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ai_usage_updated_at
  BEFORE UPDATE ON public.ai_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_usage_updated_at();

-- ===============================================
-- 6. DATA RETENTION POLICY
-- ===============================================

-- Function to clean up old AI usage records (keep 13 months)
CREATE OR REPLACE FUNCTION cleanup_old_ai_usage()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.ai_usage 
  WHERE created_at < (CURRENT_DATE - INTERVAL '13 months');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  INSERT INTO public.audit_logs (
    action, 
    table_name, 
    details,
    created_at
  ) VALUES (
    'cleanup',
    'ai_usage',
    jsonb_build_object(
      'deleted_records', deleted_count,
      'cutoff_date', CURRENT_DATE - INTERVAL '13 months'
    ),
    NOW()
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 7. SAMPLE DATA FOR TESTING (OPTIONAL)
-- ===============================================

-- Uncomment to add sample data for testing
/*
INSERT INTO public.ai_usage (
  user_id,
  company_id,
  model,
  endpoint,
  subscription_tier,
  input_tokens,
  output_tokens,
  cost_usd,
  request_status
) VALUES 
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM public.companies LIMIT 1),
    'claude',
    '/api/chat',
    'trial',
    100,
    150,
    0.0125,
    'success'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM public.companies LIMIT 1),
    'gpt-4',
    '/api/ai/generate-content',
    'trial',
    200,
    300,
    0.0450,
    'success'
  );
*/

-- ===============================================
-- 8. SUCCESS MESSAGE
-- ===============================================

SELECT 'AI Usage Tracking Table Created Successfully!' AS result;
SELECT 'Indexes created for optimal query performance' AS performance_status;
SELECT 'RLS policies enabled for data security' AS security_status;
SELECT 'Analytics functions ready for cost monitoring' AS analytics_status;
SELECT 'Ready for persistent AI usage tracking and cost alerts' AS next_action;