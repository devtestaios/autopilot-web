-- ===============================================
-- CREATE PLATFORM CONNECTIONS TABLE
-- ===============================================

-- Table to store user's connected ad platforms
CREATE TABLE IF NOT EXISTS public.platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('meta_ads', 'google_ads', 'linkedin_ads', 'pinterest_ads', 'twitter_ads', 'tiktok_ads')),
  credentials JSONB NOT NULL, -- Encrypted credentials for the platform
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed')),
  sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one connection per platform per user
  UNIQUE(user_id, platform)
);

-- Add platform_campaign_id column to campaigns table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'platform_campaign_id'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN platform_campaign_id TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'campaigns' AND column_name = 'platform_data'
  ) THEN
    ALTER TABLE public.campaigns ADD COLUMN platform_data JSONB;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id ON public.platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform ON public.platform_connections(platform);
CREATE INDEX IF NOT EXISTS idx_platform_connections_active ON public.platform_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_platform_connections_sync_status ON public.platform_connections(sync_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform_campaign_id ON public.campaigns(platform_campaign_id);

-- Enable RLS
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Users can insert own platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Users can update own platform connections" ON public.platform_connections;
DROP POLICY IF EXISTS "Users can delete own platform connections" ON public.platform_connections;

CREATE POLICY "Users can view own platform connections" ON public.platform_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform connections" ON public.platform_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform connections" ON public.platform_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own platform connections" ON public.platform_connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for platform_connections
DROP TRIGGER IF EXISTS update_platform_connections_updated_at ON public.platform_connections;
CREATE TRIGGER update_platform_connections_updated_at
  BEFORE UPDATE ON public.platform_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verification
SELECT
  '✅ PLATFORM CONNECTIONS TABLE CREATED' as status,
  COUNT(*) as connection_count,
  table_schema,
  table_name
FROM public.platform_connections
CROSS JOIN information_schema.tables
WHERE table_name = 'platform_connections' AND table_schema = 'public'
GROUP BY table_schema, table_name;
