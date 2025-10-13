-- =============================================================================
-- DISABLE RLS COMPLETELY - FOR TESTING ONLY
-- =============================================================================
-- This will disable RLS on both tables to confirm login works
-- =============================================================================

-- Disable RLS completely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('profiles', 'companies')
  AND schemaname = 'public';

DO $$
BEGIN
  RAISE NOTICE '⚠️  RLS COMPLETELY DISABLED';
  RAISE NOTICE '🧪 Test login at: https://pulsebridge.ai/simple-login';
  RAISE NOTICE '';
  RAISE NOTICE 'If this works, we know RLS is the issue.';
  RAISE NOTICE 'We will add proper policies after confirming login.';
END $$;
