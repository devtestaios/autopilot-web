-- =============================================================================
-- CREATE USER WITH PASSWORD - SIMPLE DIRECT APPROACH
-- =============================================================================
-- This creates a user with a known password, bypassing all email/redirect issues
-- =============================================================================

-- IMPORTANT: Run this in Supabase SQL Editor with RLS DISABLED
-- Go to SQL Editor -> New Query -> Paste this -> Run

-- Step 1: Check if user exists
SELECT id, email, encrypted_password FROM auth.users WHERE email = 'admin@pulsebridge.ai';

-- Step 2: If user doesn't exist, you'll need to create via Supabase Dashboard first
-- Go to Authentication -> Users -> Add User
-- Email: admin@pulsebridge.ai
-- Password: TestPassword123!
-- Check "Auto Confirm User"

-- Step 3: After creating via dashboard, verify it exists
SELECT id, email FROM auth.users WHERE email = 'admin@pulsebridge.ai';

-- Step 4: Create profile for the user (use the ID from step 3)
-- Replace 'USER_ID_HERE' with actual ID
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@pulsebridge.ai';

  IF v_user_id IS NOT NULL THEN
    -- Delete existing profile if any
    DELETE FROM public.profiles WHERE id = v_user_id;

    -- Create new profile
    INSERT INTO public.profiles (
      id,
      email,
      display_name,
      role,
      account_status,
      email_verified,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'admin@pulsebridge.ai',
      'Admin User',
      'super_admin',
      'active',
      true,
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Profile created for admin@pulsebridge.ai';
  ELSE
    RAISE NOTICE 'User admin@pulsebridge.ai not found. Create via Dashboard first.';
  END IF;
END $$;

-- Step 5: Verify everything
SELECT
  u.id,
  u.email,
  u.created_at,
  u.confirmed_at,
  p.role,
  p.account_status,
  p.display_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@pulsebridge.ai';

-- =============================================================================
-- INSTRUCTIONS TO USE THIS:
-- =============================================================================
--
-- 1. Go to Supabase Dashboard
-- 2. Click "Authentication" -> "Users"
-- 3. Click "Add User" button (green button top right)
-- 4. Fill in:
--    - Email: admin@pulsebridge.ai
--    - Password: TestPassword123!
--    - Check "Auto Confirm User" checkbox
-- 5. Click "Create User"
-- 6. Go to "SQL Editor"
-- 7. Paste the DO $$ block above (Step 4)
-- 8. Click "Run"
-- 9. Go to https://pulsebridge.ai/simple-login
-- 10. Login with:
--     Email: admin@pulsebridge.ai
--     Password: TestPassword123!
--
-- =============================================================================
