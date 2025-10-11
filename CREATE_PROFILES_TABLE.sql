-- ===============================================
-- CREATE PROFILES TABLE IF IT DOESN'T EXIST
-- ===============================================

-- First, check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'profiles'
) as profiles_table_exists;

-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  account_status TEXT NOT NULL DEFAULT 'active',
  subscription_tier TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  suite_access JSONB,
  company_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create the admin user profile
INSERT INTO public.profiles (
  id,
  email,
  username,
  display_name,
  first_name,
  last_name,
  role,
  account_status,
  subscription_tier,
  email_verified,
  suite_access,
  created_at,
  updated_at
)
SELECT
  au.id,
  'admin@pulsebridge.ai',
  'admin',
  'System Administrator',
  'System',
  'Administrator',
  'super_admin',
  'active',
  'enterprise',
  TRUE,
  jsonb_build_object(
    'social_media', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_publish', true, 'can_view_analytics', true),
    'content_suite', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_edit', true),
    'email_marketing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_send', true, 'can_view_analytics', true),
    'analytics', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_export', true),
    'campaigns', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_manage_budget', true),
    'billing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_view', true, 'can_edit', true)
  ),
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'admin@pulsebridge.ai'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  account_status = 'active',
  email_verified = TRUE,
  updated_at = NOW();

-- Verify it worked
SELECT
  '✅ VERIFICATION' as status,
  id,
  email,
  role,
  account_status
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';
