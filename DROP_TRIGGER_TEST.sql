-- =============================================================================
-- TEMPORARILY DROP THE TRIGGER TO TEST
-- =============================================================================
-- If the trigger is causing the issue, dropping it should fix login
-- =============================================================================

-- Drop the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verify trigger is dropped
SELECT
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '⚠️  Trigger DROPPED for testing';
  RAISE NOTICE '🧪 Test login at: https://pulsebridge.ai/simple-login';
  RAISE NOTICE '';
  RAISE NOTICE 'If login works now, the trigger was the problem.';
  RAISE NOTICE 'We will recreate it properly after confirming.';
END $$;
