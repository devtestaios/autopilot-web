-- =============================================================================
-- FIX RLS PROFILE READ - Allow users to read their own profile
-- =============================================================================
-- The error "Cannot coerce the result to a single JSON object" means
-- the query returned 0 rows, which means RLS is blocking the user
-- =============================================================================

-- First, check what policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_service_role" ON public.profiles;

-- Create simple policy that allows users to read their own profile
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

-- Allow service role full access (for backend operations)
CREATE POLICY "profiles_service_role"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Test the policy with the demo user
-- Replace with actual user ID
SELECT id, email, role, account_status FROM public.profiles WHERE email = 'demo@pulsebridge.ai';

-- =============================================================================
-- After running this, try logging in again
-- The profile fetch should now work
-- =============================================================================
