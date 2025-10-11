-- ===============================================
-- FIX LEADS TABLE - ADD MISSING COLUMNS
-- ===============================================

-- Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'leads'
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.leads
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Set user_id to admin for existing records
    UPDATE public.leads
    SET user_id = (SELECT id FROM auth.users WHERE email = 'admin@pulsebridge.ai' LIMIT 1)
    WHERE user_id IS NULL;

    -- Make user_id NOT NULL after populating
    ALTER TABLE public.leads ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add other missing columns if they don't exist
DO $$
BEGIN
  -- Add company column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'company'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN company TEXT;
  END IF;

  -- Add phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN phone TEXT;
  END IF;

  -- Add source column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'source'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN source TEXT DEFAULT 'Direct';
  END IF;

  -- Add platform column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'platform'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN platform TEXT;
  END IF;

  -- Add score column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'score'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN score INTEGER DEFAULT 50;
  END IF;

  -- Add stage column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'stage'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN stage TEXT DEFAULT 'awareness';
  END IF;

  -- Add engagement column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'engagement'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN engagement JSONB DEFAULT '{
      "email_opened": false,
      "link_clicked": false,
      "form_submitted": false,
      "page_views": 0,
      "time_on_site": 0
    }'::jsonb;
  END IF;

  -- Add ai_insights column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'ai_insights'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN ai_insights JSONB DEFAULT '{
      "conversion_probability": 0.5,
      "recommended_actions": [],
      "predicted_value": 0
    }'::jsonb;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_platform ON public.leads(platform);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);

-- Enable RLS if not already enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;

-- Create RLS policies
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the fix
SELECT
  '✅ LEADS TABLE UPDATED' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
ORDER BY ordinal_position;
