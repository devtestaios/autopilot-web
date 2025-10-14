-- =============================================================================
-- TEMPORARY: DISABLE RLS TO GET LOGIN WORKING
-- =============================================================================
-- This is a temporary measure to unblock testing
-- We'll re-enable and fix properly once login works
-- =============================================================================

-- Step 1: Check what users exist
SELECT
  id,
  email,
  confirmed_at,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Check what profiles exist
SELECT
  id,
  email,
  role,
  account_status,
  email_verified
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Temporarily disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles' AND schemaname = 'public';
-- Should show rowsecurity = false

-- =============================================================================
-- AFTER THIS, TRY LOGGING IN WITH ANY USER THAT EXISTS IN BOTH TABLES
-- =============================================================================
-- Once login works and we verify the rest of the app, we'll:
-- 1. Re-enable RLS
-- 2. Create proper policies that work
-- 3. Test again with RLS enabled
-- =============================================================================

-- To re-enable later (DON'T RUN YET):
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
