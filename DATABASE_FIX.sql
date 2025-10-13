-- =============================================================================
-- DATABASE FIX SQL - Run in Supabase SQL Editor
-- =============================================================================
-- This script fixes RLS policies and ensures proper database schema
-- =============================================================================

-- STEP 1: Verify Tables Exist
-- =============================================================================

-- Check if profiles table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
  ) THEN
    RAISE EXCEPTION 'profiles table does not exist! Please create it first.';
  END IF;
END $$;

-- Check if companies table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'companies'
  ) THEN
    RAISE EXCEPTION 'companies table does not exist! Please create it first.';
  END IF;
END $$;

-- STEP 2: Enable RLS on Both Tables
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop All Existing Policies (Clean Slate)
-- =============================================================================

-- Drop all existing policies on profiles
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
    END LOOP;
END $$;

-- Drop all existing policies on companies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'companies' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.companies', r.policyname);
    END LOOP;
END $$;

-- STEP 4: Create Proper RLS Policies for Profiles
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

-- STEP 5: Create Proper RLS Policies for Companies
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

-- STEP 6: Create or Replace Profile Creation Trigger
-- =============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    account_status,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    'campaign_manager',
    'active',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 7: Verify Test User Exists and Has Profile
-- =============================================================================

-- Check if test user exists in auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = 'devtestai.os@gmail.com'
  ) THEN
    RAISE NOTICE 'Test user devtestai.os@gmail.com does not exist in auth.users';
  ELSE
    RAISE NOTICE 'Test user exists in auth.users';
  END IF;
END $$;

-- Ensure test user has a profile (create if missing)
INSERT INTO public.profiles (
  id,
  email,
  role,
  account_status,
  email_verified,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'campaign_manager',
  'active',
  true,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'devtestai.os@gmail.com'
ON CONFLICT (id) DO UPDATE
SET
  account_status = 'active',
  email_verified = true,
  updated_at = NOW();

-- STEP 8: Verification Queries
-- =============================================================================

-- Show all RLS policies on profiles
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Show all RLS policies on companies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'companies'
ORDER BY policyname;

-- Verify test user profile
SELECT
  id,
  email,
  role,
  account_status,
  email_verified,
  created_at
FROM public.profiles
WHERE email = 'devtestai.os@gmail.com';

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database fix complete!';
  RAISE NOTICE '✅ RLS enabled on profiles and companies tables';
  RAISE NOTICE '✅ All policies recreated from clean slate';
  RAISE NOTICE '✅ Profile creation trigger configured';
  RAISE NOTICE '✅ Test user profile verified/created';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Next step: Test login at https://pulsebridge.ai/simple-login';
  RAISE NOTICE '   Email: devtestai.os@gmail.com';
  RAISE NOTICE '   Password: TestPassword123!';
END $$;
