-- ===============================================
-- DEBUG ADMIN PROFILE ISSUE
-- Run this in Supabase SQL Editor
-- ===============================================

-- Step 1: Check if admin user exists in auth.users
SELECT
  'AUTH USER' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Check if profile exists in public.profiles
SELECT
  'PROFILE' as check_type,
  id,
  email,
  role,
  account_status,
  created_at
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Step 3: Check if there's an ID mismatch
SELECT
  'ID MISMATCH CHECK' as check_type,
  au.id as auth_user_id,
  p.id as profile_id,
  CASE
    WHEN au.id = p.id THEN '✅ IDs MATCH'
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    ELSE '❌ ID MISMATCH'
  END as status
FROM auth.users au
LEFT JOIN public.profiles p ON p.email = au.email
WHERE au.email = 'admin@pulsebridge.ai';

-- Step 4: If profile exists but IDs don't match, fix it
-- (Don't run this yet - just for reference)
-- UPDATE public.profiles
-- SET id = (SELECT id FROM auth.users WHERE email = 'admin@pulsebridge.ai')
-- WHERE email = 'admin@pulsebridge.ai';
