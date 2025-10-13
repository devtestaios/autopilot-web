-- =============================================================================
-- DATABASE FIX V3 - Add Anonymous Access for Auth
-- =============================================================================
-- The issue is that Supabase auth needs to query profiles BEFORE the user
-- is authenticated, so we need a policy that allows anonymous reads
-- =============================================================================

-- Add policy to allow anonymous users to read profiles during authentication
CREATE POLICY "profiles_anon_select_for_auth"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

-- Also ensure authenticated users can read during login
CREATE POLICY "profiles_auth_select_for_login"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Verify policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Added anonymous read access for authentication!';
  RAISE NOTICE '✅ This allows Supabase to query profiles during login';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test login again at: https://pulsebridge.ai/simple-login';
END $$;
