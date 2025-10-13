-- =============================================================================
-- CHECK AUTH SCHEMA
-- =============================================================================
-- Let's see what columns exist in auth.users
-- =============================================================================

-- Check all columns in auth.users table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if there are any weird constraints
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;

-- Check for any custom columns we might have added
SELECT
  attname as column_name,
  atttypid::regtype as data_type
FROM pg_attribute
WHERE attrelid = 'auth.users'::regclass
  AND attnum > 0
  AND NOT attisdropped
ORDER BY attnum;
