-- =============================================================================
-- VERIFY USER EXISTS AND CAN LOGIN
-- =============================================================================

-- Check if user exists in auth.users
SELECT
  id,
  email,
  created_at,
  confirmed_at,
  email_confirmed_at,
  banned_until,
  deleted_at,
  is_sso_user
FROM auth.users
WHERE email = 'admin@pulsebridge.ai';

-- Check if profile exists
SELECT
  id,
  email,
  role,
  account_status,
  email_verified
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';

-- Check ALL users to see what emails exist
SELECT
  id,
  email,
  confirmed_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- =============================================================================
-- RESULTS TO CHECK:
-- =============================================================================
-- 1. Does admin@pulsebridge.ai exist in auth.users?
-- 2. Is confirmed_at NOT NULL?
-- 3. Is email_confirmed_at NOT NULL?
-- 4. Is banned_until NULL?
-- 5. Is deleted_at NULL?
--
-- If ANY of these are wrong, the login will fail!
-- =============================================================================
