-- ===============================================
-- CREATE LEADS TABLE FOR MARKETING OPTIMIZATION
-- ===============================================

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  source TEXT DEFAULT 'Direct',
  campaign_id UUID,
  platform TEXT,
  score INTEGER DEFAULT 50,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  stage TEXT DEFAULT 'awareness' CHECK (stage IN ('awareness', 'consideration', 'decision', 'retention')),
  engagement JSONB DEFAULT '{
    "email_opened": false,
    "link_clicked": false,
    "form_submitted": false,
    "page_views": 0,
    "time_on_site": 0
  }'::jsonb,
  ai_insights JSONB DEFAULT '{
    "conversion_probability": 0.5,
    "recommended_actions": [],
    "predicted_value": 0
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_platform ON public.leads(platform);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

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

-- Insert sample lead data for testing (optional)
INSERT INTO public.leads (
  user_id,
  email,
  name,
  company,
  phone,
  source,
  platform,
  score,
  status,
  stage,
  engagement,
  ai_insights
)
SELECT
  au.id,
  'sample.lead@example.com',
  'Sample Lead',
  'Example Corp',
  '+1-555-0123',
  'Google Ads',
  'google_ads',
  75,
  'qualified',
  'consideration',
  jsonb_build_object(
    'email_opened', true,
    'link_clicked', true,
    'form_submitted', true,
    'page_views', 15,
    'time_on_site', 420,
    'last_activity', NOW()
  ),
  jsonb_build_object(
    'conversion_probability', 0.75,
    'recommended_actions', ARRAY['Send pricing information', 'Schedule demo call', 'Share case studies'],
    'predicted_value', 7500
  )
FROM auth.users au
WHERE au.email = 'admin@pulsebridge.ai'
ON CONFLICT DO NOTHING;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify table creation
SELECT
  '✅ VERIFICATION' as status,
  COUNT(*) as lead_count,
  table_schema,
  table_name
FROM public.leads
CROSS JOIN information_schema.tables
WHERE table_name = 'leads' AND table_schema = 'public'
GROUP BY table_schema, table_name;
