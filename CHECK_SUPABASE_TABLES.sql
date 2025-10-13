-- =============================================================================
-- CHECK SUPABASE REQUIRED TABLES
-- =============================================================================
-- Supabase Auth requires certain tables to exist in the auth schema
-- =============================================================================

-- Check all tables in auth schema
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Check if auth.users table exists and has correct structure
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'auth'
  AND table_name = 'users'
) as users_table_exists;

-- Check if auth.refresh_tokens exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'auth'
  AND table_name = 'refresh_tokens'
) as refresh_tokens_exists;

-- Check if auth.sessions exists (Supabase v2 uses this)
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'auth'
  AND table_name = 'sessions'
) as sessions_exists;

-- Check auth schema permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY grantee;

-- List all auth schema functions
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'auth'
ORDER BY routine_name;
