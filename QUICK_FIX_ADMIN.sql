-- ===============================================
-- QUICK FIX - Ensure admin profile is accessible
-- ===============================================

-- Option 1: Temporarily disable RLS to test (do this first)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Test login now. If it works, re-enable RLS:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Option 2: If disabling RLS works, create a better policy
-- Drop the problematic company policy temporarily:
-- DROP POLICY IF EXISTS "Company admins can view company users" ON public.profiles;

-- Then create a simpler policy that works for everyone:
-- CREATE POLICY "Users can view own profile" ON public.profiles
--   FOR SELECT
--   TO public
--   USING (auth.uid() = id);
