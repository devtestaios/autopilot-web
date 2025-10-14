-- =============================================================================
-- CLEAN DELETE USER - Removes profile first, then user
-- =============================================================================

-- Step 1: Delete the profile first (this removes the foreign key constraint)
DELETE FROM public.profiles WHERE email = 'admin@pulsebridge.ai';

-- Step 2: Verify profile is gone
SELECT COUNT(*) as profile_count FROM public.profiles WHERE email = 'admin@pulsebridge.ai';
-- Should return 0

-- Step 3: Now delete from auth.users
-- Note: This might still fail in SQL Editor due to permissions
-- If it fails, you'll see the user ID, then try deleting via Dashboard again
DELETE FROM auth.users WHERE email = 'admin@pulsebridge.ai';

-- Step 4: Verify user is gone
SELECT COUNT(*) as user_count FROM auth.users WHERE email = 'admin@pulsebridge.ai';
-- Should return 0

-- =============================================================================
-- After running this, try deleting via Dashboard again
-- Or just create a NEW user with a different email like:
-- - testuser@pulsebridge.ai
-- - demo@pulsebridge.ai
-- =============================================================================
