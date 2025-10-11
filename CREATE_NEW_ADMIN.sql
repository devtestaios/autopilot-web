-- ===============================================
-- DELETE OLD ADMIN AND CREATE NEW ONE
-- Run this if password reset isn't working
-- ===============================================

-- Step 1: Delete old admin profile (if exists)
DELETE FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Delete old admin user from auth
-- NOTE: This requires admin privileges
-- If this fails, do it manually in Supabase Dashboard:
-- Authentication > Users > Find admin@pulsebridge.ai > Delete

-- Now you need to manually create the user again:
-- 1. Go to Supabase Dashboard
-- 2. Authentication > Users
-- 3. Click "Invite User" or "Add User"
-- 4. Email: admin@pulsebridge.ai
-- 5. Password: PulseBridge2025!
-- 6. ✅ Check "Auto Confirm User"
-- 7. Click "Create User"
-- 8. Copy the new user's UUID
-- 9. Replace USER_ID_HERE below and run this:

-- Step 3: Create profile for new user
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
  'USER_ID_HERE'::uuid, -- Replace with actual UUID from step 8
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
