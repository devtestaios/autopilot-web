-- =============================================================================
-- TEMPORARY: Disable RLS for Testing
-- =============================================================================
-- Run this to test if login works without RLS
-- We'll re-enable it after confirming login works
-- =============================================================================

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'companies')
  AND schemaname = 'public';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '⚠️  RLS DISABLED for testing';
  RAISE NOTICE '🧪 Test login at: https://pulsebridge.ai/simple-login';
  RAISE NOTICE '';
  RAISE NOTICE 'If login works, we know it was an RLS issue.';
  RAISE NOTICE 'Then run DATABASE_FIX_V3.sql to re-enable with proper policies.';
END $$;
