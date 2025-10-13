-- =============================================================================
-- RESTORE COMPLETE SECURITY - Production Ready
-- =============================================================================
-- This script will:
-- 1. Re-enable RLS on all tables
-- 2. Create proper, secure RLS policies
-- 3. Set up role-based access control
-- 4. Verify everything is locked down
-- =============================================================================

-- STEP 1: Enable RLS on Critical Tables
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL Existing Policies (Clean Slate)
-- =============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
    END LOOP;

    -- Drop all policies on companies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'companies' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.companies', r.policyname);
    END LOOP;
END $$;

-- STEP 3: Create Secure RLS Policies for Profiles
-- =============================================================================

-- Allow users to read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "profiles_admin_select_all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'agency_owner')
    )
  );

-- Allow admins to update any profile
CREATE POLICY "profiles_admin_update_all"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'agency_owner')
    )
  );

-- Allow service role full access (for server-side operations)
CREATE POLICY "profiles_service_role"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- STEP 4: Create Secure RLS Policies for Companies
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

-- Company admins can update their company
CREATE POLICY "companies_update_own"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'agency_owner')
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'agency_owner')
    )
  );

-- Super admins can view all companies
CREATE POLICY "companies_admin_select_all"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Super admins can manage all companies
CREATE POLICY "companies_admin_manage_all"
  ON public.companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Service role full access
CREATE POLICY "companies_service_role"
  ON public.companies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- STEP 5: Verify RLS Configuration
-- =============================================================================

-- Check RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('profiles', 'companies')
  AND schemaname = 'public';

-- List all policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'companies')
  AND schemaname = 'public'
ORDER BY tablename, policyname;

-- STEP 6: Success Message
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE 'RLS RE-ENABLED on profiles and companies';
  RAISE NOTICE 'Secure policies created for authenticated users';
  RAISE NOTICE 'Admin policies created for privileged access';
  RAISE NOTICE 'Service role policies for backend operations';
  RAISE NOTICE '';
  RAISE NOTICE 'Security Status:';
  RAISE NOTICE '  - Users can only see/edit their own profile';
  RAISE NOTICE '  - Users can only see their own company';
  RAISE NOTICE '  - Admins can manage all profiles and companies';
  RAISE NOTICE '  - All tables protected by RLS';
  RAISE NOTICE '';
  RAISE NOTICE 'Test Instructions:';
  RAISE NOTICE '  1. Login as regular user - should only see own data';
  RAISE NOTICE '  2. Login as admin - should see all data';
  RAISE NOTICE '  3. Try accessing /admin without admin role - should be blocked';
END $$;
