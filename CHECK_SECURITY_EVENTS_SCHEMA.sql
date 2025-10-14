-- Check the actual schema of security_events table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'security_events'
ORDER BY ordinal_position;

-- Check current policies
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'security_events'
ORDER BY policyname;

-- Try a test insert to see what the actual error is
-- (This will show us the exact column mismatch)
SELECT
    'user_id' as expected_column,
    EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'security_events'
        AND column_name = 'user_id'
    ) as column_exists;
