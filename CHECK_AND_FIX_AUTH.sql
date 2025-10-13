-- =============================================================================
-- CHECK AND FIX AUTHENTICATION
-- =============================================================================
-- This script will check all users and help set a working test password
-- =============================================================================

-- Step 1: List ALL users in auth.users table
SELECT
  id,
  email,
  created_at,
  confirmed_at,
  email_confirmed_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Check which users have profiles
SELECT
  u.email,
  u.id as user_id,
  p.id as profile_id,
  p.role,
  p.account_status,
  p.email_verified
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- =============================================================================
-- OPTION A: Use devtestai.os@gmail.com (Known to exist)
-- =============================================================================
-- This user already has a profile with super_admin role
-- Let's verify it exists and has correct setup:

SELECT
  id,
  email,
  confirmed_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'devtestai.os@gmail.com';

SELECT
  id,
  email,
  role,
  account_status,
  email_verified
FROM public.profiles
WHERE email = 'devtestai.os@gmail.com';

-- =============================================================================
-- OPTION B: Check test@pulsebridge.ai
-- =============================================================================

SELECT
  id,
  email,
  confirmed_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'test@pulsebridge.ai';

SELECT
  id,
  email,
  role,
  account_status,
  email_verified
FROM public.profiles
WHERE email = 'test@pulsebridge.ai';

-- =============================================================================
-- INSTRUCTIONS:
-- =============================================================================
-- 1. Run the queries above to see which users exist
-- 2. Copy the results and share with me
-- 3. Then we'll use Supabase Dashboard to reset password properly
--
-- To reset password in Supabase Dashboard:
-- 1. Go to Authentication -> Users
-- 2. Find the user you want to use
-- 3. Click the "..." menu on the right
-- 4. Select "Reset Password"
-- 5. Choose "Send recovery email" OR "Set password manually"
-- 6. If setting manually, use: TestPassword123!
-- =============================================================================
