-- =============================================================================
-- FIX CONFIRMATION TOKEN ISSUE
-- =============================================================================
-- The error is: converting NULL to string is unsupported
-- This means the confirmation_token column needs to be properly typed
-- =============================================================================

-- First, let's see what the column looks like now
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
  AND column_name IN ('confirmation_token', 'recovery_token', 'email_change_token_new', 'reauthentication_token');

-- Check if there are any users with problematic NULL values
SELECT
  id,
  email,
  confirmation_token IS NULL as conf_token_null,
  recovery_token IS NULL as rec_token_null,
  email_change_token_new IS NULL as email_token_null,
  reauthentication_token IS NULL as reauth_token_null
FROM auth.users
LIMIT 5;

-- The fix: Set empty string instead of NULL for token columns
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE
  confirmation_token IS NULL
  OR recovery_token IS NULL
  OR email_change_token_new IS NULL
  OR reauthentication_token IS NULL;

-- Verify the fix
SELECT
  COUNT(*) as users_fixed
FROM auth.users
WHERE
  confirmation_token = ''
  OR recovery_token = ''
  OR email_change_token_new = ''
  OR reauthentication_token = '';

DO $$
BEGIN
  RAISE NOTICE '✅ Fixed NULL token columns!';
  RAISE NOTICE '🧪 Test login at: https://pulsebridge.ai/simple-login';
  RAISE NOTICE '';
  RAISE NOTICE 'The confirmation_token NULL issue should be resolved.';
END $$;
