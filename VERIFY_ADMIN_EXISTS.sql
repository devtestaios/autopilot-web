-- ===============================================
-- VERIFY ADMIN PROFILE EXISTS
-- Run this and send me EXACT results
-- ===============================================

-- Step 1: Get the auth user
SELECT
  'AUTH USER' as type,
  id as auth_id,
  email,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Get the profile
SELECT
  'PROFILE' as type,
  id as profile_id,
  email,
  role,
  account_status
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Step 3: Check if IDs match
SELECT
  au.id as auth_user_id,
  p.id as profile_id,
  au.email,
  p.role,
  CASE
    WHEN au.id = p.id THEN '✅ IDs MATCH'
    WHEN p.id IS NULL THEN '❌ NO PROFILE EXISTS'
    ELSE '❌ ID MISMATCH - THIS IS THE PROBLEM'
  END as diagnosis
FROM auth.users au
FULL OUTER JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'admin@pulsebridge.ai' OR p.email = 'admin@pulsebridge.ai';
