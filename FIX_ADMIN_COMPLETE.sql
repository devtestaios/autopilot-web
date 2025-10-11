-- ===============================================
-- COMPLETE ADMIN USER FIX - ONE SCRIPT
-- Run this entire script in Supabase SQL Editor
-- ===============================================

-- Step 1: Delete any existing admin profile (clean slate)
DELETE FROM public.profiles WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Get the admin user ID from auth.users
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'admin@pulsebridge.ai';

  -- Check if user exists
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin user does not exist in auth.users. Please create it in Supabase Dashboard first.';
  END IF;

  RAISE NOTICE 'Found admin user with ID: %', v_admin_id;

  -- Update password
  UPDATE auth.users
  SET
    encrypted_password = crypt('PulseBridge2025!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
  WHERE id = v_admin_id;

  RAISE NOTICE 'Password updated';

  -- Create profile
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
    v_admin_id,
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

  RAISE NOTICE 'Profile created';

END $$;

-- Step 3: Verify everything
SELECT
  '✅ VERIFICATION' as status,
  au.id as user_id,
  au.email,
  au.email_confirmed_at,
  p.role,
  p.account_status,
  p.display_name,
  CASE
    WHEN p.id IS NOT NULL THEN '✅ Profile exists'
    ELSE '❌ Profile missing'
  END as profile_status,
  CASE
    WHEN p.role = 'super_admin' THEN '✅ Is admin'
    ELSE '❌ Not admin'
  END as admin_status
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email = 'admin@pulsebridge.ai';

-- ===============================================
-- If you see "Profile exists" and "Is admin" ✅
-- Then you're ready to login!
-- ===============================================
