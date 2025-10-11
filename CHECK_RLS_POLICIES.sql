-- ===============================================
-- CHECK RLS POLICIES ON PROFILES TABLE
-- Run this in Supabase SQL Editor
-- ===============================================

-- Check if RLS is enabled on profiles table
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- List all RLS policies on profiles table
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
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- If RLS is blocking, temporarily disable it for testing:
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Or create a policy that allows authenticated users to read their own profile:
-- CREATE POLICY "Users can read own profile" ON public.profiles
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);
