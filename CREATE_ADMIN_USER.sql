-- ===============================================
-- CREATE ADMIN USER IN SUPABASE
-- Run this in Supabase SQL Editor
-- ===============================================

-- Step 1: Create the admin user in Supabase Auth
-- Note: You need to run this through Supabase Dashboard > Authentication > Users > Add User
-- OR use the Supabase Admin API

-- For manual creation via Dashboard:
-- Email: admin@pulsebridge.ai
-- Password: PulseBridge2025!
-- Auto-confirm user: YES

-- Step 2: After creating the user, get their UUID from the auth.users table
-- You can find it in Supabase Dashboard > Authentication > Users
-- Or run this query:
SELECT id, email, created_at
FROM auth.users
WHERE email = 'admin@pulsebridge.ai';

-- Step 3: Create/Update the profile with admin role
-- Replace 'USER_UUID_HERE' with the actual UUID from Step 2
-- OR use this dynamic approach:

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@pulsebridge.ai';

  -- If user doesn't exist yet, skip
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'Admin user not found. Please create admin@pulsebridge.ai in Supabase Authentication first.';
    RETURN;
  END IF;

  -- Check if profile exists
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

    RAISE NOTICE 'Admin profile updated successfully for user: %', admin_user_id;
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

    RAISE NOTICE 'Admin profile created successfully for user: %', admin_user_id;
  END IF;
END $$;

-- Step 4: Verify the admin user
SELECT
  p.id,
  p.email,
  p.role,
  p.account_status,
  p.display_name,
  p.suite_access,
  au.email_confirmed_at,
  au.created_at as auth_created_at
FROM public.profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.email = 'admin@pulsebridge.ai';

-- ===============================================
-- MANUAL STEPS REQUIRED:
-- ===============================================
--
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" (or "Invite User")
-- 4. Enter:
--    - Email: admin@pulsebridge.ai
--    - Password: PulseBridge2025!
--    - Auto Confirm User: YES (check this box)
-- 5. Click "Create User"
-- 6. Then run this SQL script
--
-- ===============================================
