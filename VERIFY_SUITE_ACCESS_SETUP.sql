-- ===============================================
-- VERIFY SUITE ACCESS SETUP
-- Run this to confirm everything was installed correctly
-- ===============================================

-- ✅ TEST 1: Check if new columns exist
SELECT
  'TEST 1: Columns Added' as test_name,
  COUNT(*) as columns_found,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ SUCCESS - All 4 columns exist'
    ELSE '❌ FAILED - Missing columns'
  END as result
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('suite_access', 'is_test_user', 'test_user_expires_at', 'admin_notes');

-- Show which columns exist
SELECT
  'Existing Columns' as info,
  column_name,
  data_type,
  CASE
    WHEN column_default IS NOT NULL THEN 'Has default'
    ELSE 'No default'
  END as has_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('suite_access', 'is_test_user', 'test_user_expires_at', 'admin_notes')
ORDER BY column_name;

-- ✅ TEST 2: Check if helper functions were created
SELECT
  'TEST 2: Helper Functions' as test_name,
  COUNT(*) as functions_found,
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ SUCCESS - Helper functions created'
    ELSE '❌ FAILED - Missing functions'
  END as result
FROM pg_proc
WHERE proname IN ('has_suite_access', 'grant_suite_access', 'revoke_suite_access', 'is_test_user_expired');

-- List the functions
SELECT
  'Available Functions' as info,
  proname as function_name
FROM pg_proc
WHERE proname IN (
  'has_suite_access',
  'grant_suite_access',
  'revoke_suite_access',
  'is_test_user_expired',
  'apply_social_media_manager_template',
  'apply_content_creator_template',
  'apply_full_access_template'
)
ORDER BY proname;

-- ✅ TEST 3: Check if existing users got default suite access
SELECT
  'TEST 3: Existing Users Updated' as test_name,
  COUNT(*) as total_users,
  COUNT(CASE WHEN suite_access IS NOT NULL THEN 1 END) as users_with_access,
  CASE
    WHEN COUNT(*) = COUNT(CASE WHEN suite_access IS NOT NULL THEN 1 END)
    THEN '✅ SUCCESS - All users have suite access'
    ELSE '⚠️ WARNING - Some users missing suite access'
  END as result
FROM public.profiles;

-- Show sample user suite access
SELECT
  'Sample User Data' as info,
  email,
  CASE WHEN suite_access IS NOT NULL THEN '✓ Has access' ELSE '✗ No access' END as suite_access_status,
  CASE WHEN is_test_user THEN 'Yes' ELSE 'No' END as is_test_user
FROM public.profiles
LIMIT 3;

-- ✅ TEST 4: Check if indexes were created
SELECT
  'TEST 4: Indexes Created' as test_name,
  COUNT(*) as indexes_found,
  CASE
    WHEN COUNT(*) >= 2 THEN '✅ SUCCESS - Indexes created'
    ELSE '⚠️ WARNING - Some indexes missing'
  END as result
FROM pg_indexes
WHERE tablename = 'profiles'
  AND indexname IN ('idx_profiles_suite_access', 'idx_profiles_test_user');

-- ===============================================
-- FINAL SUMMARY
-- ===============================================

SELECT
  '🎯 FINAL SUMMARY' as summary,
  CASE
    WHEN (
      SELECT COUNT(*) FROM information_schema.columns
      WHERE table_name = 'profiles' AND column_name IN ('suite_access', 'is_test_user')
    ) >= 2
    AND (
      SELECT COUNT(*) FROM pg_proc
      WHERE proname IN ('has_suite_access', 'grant_suite_access')
    ) >= 2
    THEN '✅ SETUP COMPLETE - Ready to invite users!'
    ELSE '❌ SETUP INCOMPLETE - Check errors above'
  END as status;

-- ===============================================
-- BONUS: Test the helper functions
-- ===============================================

-- Test has_suite_access function (should return boolean)
SELECT
  'Function Test' as test,
  has_suite_access(
    (SELECT id FROM public.profiles LIMIT 1),
    'social_media'
  ) as can_access_social_media,
  '(false is normal if no suite access set yet)' as note;
