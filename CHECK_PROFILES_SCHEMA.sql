-- ===============================================
-- CHECK WHICH SCHEMA THE PROFILES TABLE IS IN
-- ===============================================

-- Check all schemas for a profiles table
SELECT
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'profiles';

-- Check the columns in the profiles table
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if we can actually query it
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Try to select the admin profile
SELECT
  id,
  email,
  role,
  account_status
FROM public.profiles
WHERE email = 'admin@pulsebridge.ai';
