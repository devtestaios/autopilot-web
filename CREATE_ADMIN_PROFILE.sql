-- ===============================================
-- CREATE ADMIN PROFILE
-- Creates the missing admin profile in public.profiles table
-- ===============================================

-- Step 1: Check if profile already exists
SELECT 
  'Current Profile Status' as status,
  COUNT(*) as profile_count
FROM public.profiles 
WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Create the admin profile (using the user ID from auth.users)
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
  preferences,
  created_at,
  updated_at
) VALUES (
  '6d2abae5-febf-413d-b6f5-12506b6a43fe'::uuid, -- The exact ID from your auth.users
  'admin@pulsebridge.ai',
  'admin',
  'System Administrator',
  'Admin',
  'User',
  'super_admin',
  'active',
  'enterprise_plus',
  TRUE,
  '{
    "theme": "dark",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "push": true,
      "digest_frequency": "daily"
    },
    "dashboard": {
      "default_layout": "admin",
      "sidebar_collapsed": false
    }
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  account_status = 'active',
  subscription_tier = 'enterprise_plus',
  email_verified = TRUE,
  updated_at = NOW();

-- Step 3: Verify the profile was created
SELECT
  'Profile Created Successfully' as result,
  id,
  email,
  role,
  account_status,
  display_name,
  email_verified
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Step 4: Grant admin permissions (if user_permissions table exists)
INSERT INTO public.user_permissions (user_id, resource, action, is_active)
SELECT
  '6d2abae5-febf-413d-b6f5-12506b6a43fe'::uuid,
  resource,
  action,
  TRUE
FROM (
  VALUES
    ('*', 'admin'),
    ('users', 'admin'),
    ('companies', 'admin'),
    ('campaigns', 'admin'),
    ('reports', 'admin'),
    ('billing', 'admin'),
    ('settings', 'admin'),
    ('integrations', 'admin')
) AS permissions(resource, action)
ON CONFLICT (user_id, resource, action) DO UPDATE SET is_active = TRUE;

-- Step 5: Final verification
SELECT
  '🎉 ADMIN SETUP COMPLETE' as final_status,
  CASE
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@pulsebridge.ai')
     AND EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@pulsebridge.ai' AND role = 'super_admin')
    THEN '✅ Admin user fully configured and ready to login!'
    ELSE '❌ Something went wrong - check the steps above'
  END as login_ready;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🎯 Admin Profile Creation Complete!';
  RAISE NOTICE '';
  RAISE NOTICE '✅ You can now login at: http://localhost:3001/adminlogin';
  RAISE NOTICE '📧 Email: admin@pulsebridge.ai';
  RAISE NOTICE '🔑 Password: PulseBridge2025!';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 After login, you will be redirected to: /admin';
END $$;