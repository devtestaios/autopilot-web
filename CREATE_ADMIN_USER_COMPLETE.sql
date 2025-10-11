-- ===============================================
-- CREATE ADMIN USER - COMPLETE SETUP
-- Run this in Supabase SQL Editor
-- ===============================================

-- STEP 1: Check if admin user already exists in auth.users
DO $$
DECLARE
  admin_user_id UUID;
  admin_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@pulsebridge.ai';

  admin_exists := admin_user_id IS NOT NULL;

  IF admin_exists THEN
    RAISE NOTICE '✅ Admin user already exists in auth.users with ID: %', admin_user_id;
    RAISE NOTICE '⚠️ You need to RESET the password in Supabase Dashboard:';
    RAISE NOTICE '   1. Go to Authentication > Users';
    RAISE NOTICE '   2. Find admin@pulsebridge.ai';
    RAISE NOTICE '   3. Click the three dots (•••)';
    RAISE NOTICE '   4. Select "Reset Password"';
    RAISE NOTICE '   5. Set password to: PulseBridge2025!';
  ELSE
    RAISE NOTICE '❌ Admin user does NOT exist in auth.users';
    RAISE NOTICE '📝 You must create it manually:';
    RAISE NOTICE '   1. Go to Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '   2. Click "Add User"';
    RAISE NOTICE '   3. Email: admin@pulsebridge.ai';
    RAISE NOTICE '   4. Password: PulseBridge2025!';
    RAISE NOTICE '   5. Check "Auto Confirm User"';
    RAISE NOTICE '   6. Click "Create User"';
    RAISE NOTICE '   7. Then run this script again';
    RETURN;
  END IF;

  -- STEP 2: Create or update profile
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_user_id) THEN
    -- Update existing profile
    UPDATE public.profiles
    SET
      role = 'super_admin',
      account_status = 'active',
      email_verified = TRUE,
      display_name = 'System Administrator',
      first_name = 'System',
      last_name = 'Administrator',
      subscription_tier = 'enterprise',
      suite_access = jsonb_build_object(
        'social_media', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_publish', true, 'can_view_analytics', true),
        'content_suite', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_edit', true),
        'email_marketing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_send', true, 'can_view_analytics', true),
        'analytics', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_export', true),
        'campaigns', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_manage_budget', true),
        'billing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_view', true, 'can_edit', true)
      ),
      updated_at = NOW()
    WHERE id = admin_user_id;

    RAISE NOTICE '✅ Admin profile UPDATED successfully';
  ELSE
    -- Create new profile
    INSERT INTO public.profiles (
      id,
      email,
      username,
      display_name,
      first_name,
      last_name,
      role,
      account_status,
      subscription_tier,
      email_verified,
      suite_access,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'admin@pulsebridge.ai',
      'admin',
      'System Administrator',
      'System',
      'Administrator',
      'super_admin',
      'active',
      'enterprise',
      TRUE,
      jsonb_build_object(
        'social_media', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_publish', true, 'can_view_analytics', true),
        'content_suite', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_edit', true),
        'email_marketing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_send', true, 'can_view_analytics', true),
        'analytics', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_export', true),
        'campaigns', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_create', true, 'can_manage_budget', true),
        'billing', jsonb_build_object('enabled', true, 'access_level', 'full', 'can_view', true, 'can_edit', true)
      ),
      NOW(),
      NOW()
    );

    RAISE NOTICE '✅ Admin profile CREATED successfully';
  END IF;
END $$;

-- STEP 3: Verify the setup
SELECT
  '🔍 VERIFICATION' as check_type,
  au.id,
  au.email,
  au.email_confirmed_at,
  p.role,
  p.account_status,
  p.display_name,
  CASE
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅'
    ELSE '❌ NOT CONFIRMED'
  END as email_status,
  CASE
    WHEN p.role = 'super_admin' THEN '✅'
    ELSE '❌ NOT ADMIN'
  END as role_status,
  CASE
    WHEN p.account_status = 'active' THEN '✅'
    ELSE '❌ NOT ACTIVE'
  END as account_status_check
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email = 'admin@pulsebridge.ai';

-- ===============================================
-- IMPORTANT NOTES:
-- ===============================================
--
-- If you see "Admin user does NOT exist":
-- 1. Go to Supabase Dashboard
-- 2. Authentication > Users > Add User
-- 3. Email: admin@pulsebridge.ai
-- 4. Password: PulseBridge2025!
-- 5. Check "Auto Confirm User"
-- 6. Run this script again
--
-- If you see "Admin user already exists" but login still fails:
-- 1. The password might be wrong
-- 2. Go to Authentication > Users
-- 3. Find admin@pulsebridge.ai
-- 4. Click ••• > Reset Password
-- 5. Set to: PulseBridge2025!
--
-- ===============================================
