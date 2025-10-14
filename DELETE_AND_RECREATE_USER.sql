-- =============================================================================
-- DELETE AND RECREATE USER - NUCLEAR OPTION
-- =============================================================================
-- This completely removes the user and lets you recreate fresh via Dashboard
-- =============================================================================

-- Step 1: Find the user ID
SELECT id, email FROM auth.users WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Delete profile first (replace with actual ID from step 1)
DELETE FROM public.profiles WHERE email = 'admin@pulsebridge.ai';

-- Step 3: Delete from auth.users (this requires service_role, may not work in SQL Editor)
-- You'll need to do this via Dashboard instead:
-- Go to Authentication -> Users -> Find admin@pulsebridge.ai -> Click "..." -> Delete user

-- =============================================================================
-- THEN CREATE USER PROPERLY:
-- =============================================================================
-- 1. Go to Authentication -> Users
-- 2. Click "Add user"
-- 3. Email: admin@pulsebridge.ai
-- 4. Password: TestPassword123!
-- 5. ✅ CHECK "Auto Confirm User" (THIS IS CRITICAL!)
-- 6. Click Create User
-- 7. Run the profile creation SQL from earlier
-- =============================================================================

-- Alternative: Use existing user devtestai.os@gmail.com
-- This user already exists and has a profile
SELECT
  u.id,
  u.email,
  u.confirmed_at,
  p.role,
  p.account_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'devtestai.os@gmail.com';

-- If devtestai.os@gmail.com exists with confirmed_at set,
-- just send a password reset email for it and use the /reset-password page
