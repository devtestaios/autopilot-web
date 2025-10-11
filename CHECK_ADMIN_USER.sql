-- ===============================================
-- CHECK IF ADMIN USER EXISTS
-- Run this in Supabase SQL Editor to see if admin user is set up
-- ===============================================

-- Check if admin user exists in auth.users
SELECT
  'Auth User Check' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '❌ Email NOT Confirmed'
  END as status
FROM auth.users
WHERE email = 'admin@pulsebridge.ai';

-- Check if profile exists
SELECT
  'Profile Check' as check_type,
  id,
  email,
  role,
  account_status,
  display_name,
  email_verified,
  CASE
    WHEN role IN ('super_admin', 'agency_owner') THEN '✅ Admin Role'
    ELSE '❌ Not Admin'
  END as admin_check,
  CASE
    WHEN account_status = 'active' THEN '✅ Active'
    ELSE '❌ Not Active'
  END as status_check
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Check suite access
SELECT
  'Suite Access Check' as check_type,
  email,
  suite_access
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- If user doesn't exist, show this message
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@pulsebridge.ai') THEN
    RAISE NOTICE '❌ ADMIN USER DOES NOT EXIST IN auth.users';
    RAISE NOTICE 'You need to create it manually in Supabase Dashboard:';
    RAISE NOTICE '1. Go to Authentication > Users';
    RAISE NOTICE '2. Click "Add User"';
    RAISE NOTICE '3. Email: admin@pulsebridge.ai';
    RAISE NOTICE '4. Password: PulseBridge2025!';
    RAISE NOTICE '5. Check "Auto Confirm User"';
  ELSE
    RAISE NOTICE '✅ Admin user exists in auth.users';
  END IF;
END $$;
