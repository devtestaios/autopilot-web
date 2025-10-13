-- =============================================================================
-- COMPLETE USER RESET - Start Fresh
-- =============================================================================
-- Let's completely reset this user from scratch
-- =============================================================================

-- 1. Check if user exists
SELECT
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at
FROM auth.users
WHERE email = 'devtestai.os@gmail.com';

-- 2. Delete the user completely (we'll recreate)
DELETE FROM auth.users WHERE email = 'devtestai.os@gmail.com';

-- 3. Verify user is deleted
SELECT COUNT(*) as user_count FROM auth.users WHERE email = 'devtestai.os@gmail.com';

-- 4. Delete profile if exists
DELETE FROM public.profiles WHERE email = 'devtestai.os@gmail.com';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ User completely deleted';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next: Use the Supabase Dashboard to invite the user again:';
  RAISE NOTICE '   1. Go to Authentication > Users';
  RAISE NOTICE '   2. Click "Invite User"';
  RAISE NOTICE '   3. Email: devtestai.os@gmail.com';
  RAISE NOTICE '   4. This will send a fresh invitation email with a new password';
  RAISE NOTICE '';
  RAISE NOTICE 'OR try signing up at: https://pulsebridge.ai/signup';
END $$;
