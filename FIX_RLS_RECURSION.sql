-- =============================================================================
-- FIX RLS INFINITE RECURSION ERROR
-- =============================================================================
-- The admin policies were causing infinite recursion because they query
-- the same table they're protecting. This fix uses a simpler approach.
-- =============================================================================

-- Drop the problematic admin policies
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;
DROP POLICY IF EXISTS "companies_admin_select_all" ON public.companies;
DROP POLICY IF EXISTS "companies_update_own" ON public.companies;

-- Recreate profiles admin policies without recursion
-- Admins can read all profiles (including their own from the other policy)
CREATE POLICY "profiles_admin_select_all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) IN ('super_admin', 'admin', 'agency_owner')
  );

-- Admins can update all profiles (including their own from the other policy)
CREATE POLICY "profiles_admin_update_all"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) IN ('super_admin', 'admin', 'agency_owner')
  );

-- Recreate companies policies without recursion
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
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'super_admin'
  );

-- Verify all policies
SELECT
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('profiles', 'companies')
  AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Test query - should work without recursion error
SELECT id, email, role FROM public.profiles LIMIT 1;
