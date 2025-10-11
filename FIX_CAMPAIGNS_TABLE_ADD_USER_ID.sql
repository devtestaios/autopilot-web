-- ===============================================
-- FIX CAMPAIGNS TABLE - ADD MISSING COLUMNS
-- ===============================================

-- Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'campaigns'
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.campaigns
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Set user_id to admin for existing records
    UPDATE public.campaigns
    SET user_id = (SELECT id FROM auth.users WHERE email = 'admin@pulsebridge.ai' LIMIT 1)
    WHERE user_id IS NULL;

    -- Make user_id NOT NULL after populating
    ALTER TABLE public.campaigns ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add other missing columns if they don't exist
DO $$
BEGIN
  -- Add client_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN client_name TEXT;
  END IF;

  -- Add budget column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'budget'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN budget NUMERIC(12, 2) DEFAULT 0;
  END IF;

  -- Add spend column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'spend'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN spend NUMERIC(12, 2) DEFAULT 0;
  END IF;

  -- Add target_audience column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN target_audience JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add metrics column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'metrics'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN metrics JSONB DEFAULT '{
      "impressions": 0,
      "clicks": 0,
      "conversions": 0,
      "ctr": 0,
      "cpc": 0,
      "cpa": 0,
      "roas": 0,
      "quality_score": 0
    }'::jsonb;
  END IF;

  -- Add ai_optimization column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'ai_optimization'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN ai_optimization JSONB DEFAULT '{
      "enabled": false,
      "strategy": "balanced",
      "auto_budget": false,
      "auto_bidding": false,
      "optimization_score": 0
    }'::jsonb;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_name ON public.campaigns(name);

-- Enable RLS if not already enabled
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.campaigns;

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

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the fix
SELECT
  '✅ CAMPAIGNS TABLE UPDATED' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'campaigns'
ORDER BY ordinal_position;
