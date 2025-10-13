-- =============================================================================
-- DATABASE FIX SQL V2 - Run in Supabase SQL Editor
-- =============================================================================
-- This script fixes RLS policies and handles NOT NULL constraints properly
-- =============================================================================

-- STEP 1: Enable RLS on Both Tables
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop All Existing Policies (Clean Slate)
-- =============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
    END LOOP;

    -- Drop all existing policies on companies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'companies' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.companies', r.policyname);
    END LOOP;
END $$;

-- STEP 3: Create Proper RLS Policies for Profiles
-- =============================================================================

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (for new signups)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "profiles_admin_select_all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update any profile
CREATE POLICY "profiles_admin_update_all"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Service role has full access (for server-side operations)
CREATE POLICY "profiles_service_role_all"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- STEP 4: Create Proper RLS Policies for Companies
-- =============================================================================

-- Users can view their own company
CREATE POLICY "companies_select_own"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Admins can view all companies
CREATE POLICY "companies_admin_select_all"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can manage companies
CREATE POLICY "companies_admin_manage"
  ON public.companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Service role has full access
CREATE POLICY "companies_service_role_all"
  ON public.companies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- STEP 5: Fix Existing Profile for Test User
-- =============================================================================

-- Update the test user's profile to have a display_name
UPDATE public.profiles
SET
  display_name = COALESCE(display_name, 'Test User'),
  username = COALESCE(username, 'devtest'),
  first_name = COALESCE(first_name, 'Test'),
  last_name = COALESCE(last_name, 'User'),
  account_status = 'active',
  email_verified = true,
  updated_at = NOW()
WHERE email = 'devtestai.os@gmail.com';

-- STEP 6: Create or Replace Profile Creation Trigger (Fixed)
-- =============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_display_name TEXT;
  default_username TEXT;
BEGIN
  -- Generate default display_name from email (part before @)
  default_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Generate default username from email
  default_username := LOWER(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', ''));

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    first_name,
    last_name,
    role,
    account_status,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_display_name,
    default_username,
    COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(default_display_name, ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'campaign_manager',
    'active',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    username = COALESCE(public.profiles.username, EXCLUDED.username),
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 7: Verification
-- =============================================================================

-- Show RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'companies')
ORDER BY tablename, policyname;

-- Verify test user profile
SELECT
  id,
  email,
  display_name,
  username,
  role,
  account_status,
  email_verified
FROM public.profiles
WHERE email = 'devtestai.os@gmail.com';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database fix complete!';
  RAISE NOTICE '✅ RLS enabled with proper policies';
  RAISE NOTICE '✅ Test user profile updated with display_name';
  RAISE NOTICE '✅ Trigger fixed to handle NOT NULL constraints';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test login at: https://pulsebridge.ai/simple-login';
  RAISE NOTICE '   Email: devtestai.os@gmail.com';
  RAISE NOTICE '   Password: TestPassword123!';
END $$;
