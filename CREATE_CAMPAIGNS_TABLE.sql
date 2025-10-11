-- ===============================================
-- CREATE CAMPAIGNS TABLE FOR MARKETING OPTIMIZATION
-- ===============================================

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'linkedin', 'twitter', 'tiktok', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  client_name TEXT,
  budget NUMERIC(12, 2) DEFAULT 0,
  spend NUMERIC(12, 2) DEFAULT 0,
  target_audience JSONB DEFAULT '{}'::jsonb,
  metrics JSONB DEFAULT '{
    "impressions": 0,
    "clicks": 0,
    "conversions": 0,
    "ctr": 0,
    "cpc": 0,
    "cpa": 0,
    "roas": 0,
    "quality_score": 0
  }'::jsonb,
  ai_optimization JSONB DEFAULT '{
    "enabled": false,
    "strategy": "balanced",
    "auto_budget": false,
    "auto_bidding": false,
    "optimization_score": 0
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_name ON public.campaigns(name);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own campaigns" ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample campaign data for testing (optional)
INSERT INTO public.campaigns (
  user_id,
  name,
  platform,
  status,
  client_name,
  budget,
  spend,
  target_audience,
  metrics,
  ai_optimization
)
SELECT
  au.id,
  'Q4 Holiday Campaign',
  'google_ads',
  'active',
  'Sample Client',
  10000.00,
  3500.50,
  jsonb_build_object(
    'age_range', '25-54',
    'location', 'United States',
    'interests', ARRAY['technology', 'business', 'marketing']
  ),
  jsonb_build_object(
    'impressions', 125000,
    'clicks', 4200,
    'conversions', 145,
    'ctr', 3.36,
    'cpc', 0.83,
    'cpa', 24.14,
    'roas', 4.5,
    'quality_score', 8.2
  ),
  jsonb_build_object(
    'enabled', true,
    'strategy', 'maximize_conversions',
    'auto_budget', true,
    'auto_bidding', true,
    'optimization_score', 82
  )
FROM auth.users au
WHERE au.email = 'admin@pulsebridge.ai'
ON CONFLICT DO NOTHING;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify table creation
SELECT
  '✅ VERIFICATION' as status,
  COUNT(*) as campaign_count,
  table_schema,
  table_name
FROM public.campaigns
CROSS JOIN information_schema.tables
WHERE table_name = 'campaigns' AND table_schema = 'public'
GROUP BY table_schema, table_name;
