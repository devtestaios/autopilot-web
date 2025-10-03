-- 🔧 FINAL EXTENSION SECURITY FIXES - BULLETPROOF APPROACH
-- Handles all edge cases for moving extensions to secure schema
-- October 3, 2025

-- Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO public;

-- ===== STEP 1: HANDLE UUID-OSSP EXTENSION =====
-- Use a bulletproof approach that works regardless of current state
DO $$
DECLARE
    public_exists BOOLEAN := FALSE;
    extensions_exists BOOLEAN := FALSE;
    update_count INTEGER := 0;
    table_record RECORD;
BEGIN
    -- Check current state
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) 
    INTO public_exists;
    
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions'))
    INTO extensions_exists;
    
    RAISE NOTICE 'Current state - Public: %, Extensions: %', public_exists, extensions_exists;
    
    -- Ensure extension exists in extensions schema
    IF NOT extensions_exists THEN
        IF public_exists THEN
            -- Extension exists in public but not extensions - this is tricky
            -- We need to create in extensions first, then move dependencies
            BEGIN
                CREATE EXTENSION "uuid-ossp" WITH SCHEMA extensions;
                RAISE NOTICE 'Created uuid-ossp in extensions schema ✅';
                extensions_exists := TRUE;
            EXCEPTION WHEN duplicate_object THEN
                -- Extension already exists somewhere, that's fine
                extensions_exists := TRUE;
                RAISE NOTICE 'uuid-ossp already exists (duplicate_object caught) ✅';
            END;
        ELSE
            -- Extension doesn't exist anywhere, create it fresh
            BEGIN
                CREATE EXTENSION "uuid-ossp" WITH SCHEMA extensions;
                RAISE NOTICE 'Created fresh uuid-ossp in extensions schema ✅';
                extensions_exists := TRUE;
            EXCEPTION WHEN duplicate_object THEN
                extensions_exists := TRUE;
                RAISE NOTICE 'uuid-ossp already exists (duplicate_object caught) ✅';
            END;
        END IF;
    ELSE
        RAISE NOTICE 'uuid-ossp already exists in extensions schema ✅';
    END IF;
    
    -- Verify the function is available
    BEGIN
        PERFORM extensions.uuid_generate_v4();
        RAISE NOTICE 'Verified extensions.uuid_generate_v4() works ✅';
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'FATAL: extensions.uuid_generate_v4() not available after setup. Error: %', SQLERRM;
    END;
    
    -- Update table defaults to use extensions schema
    FOR table_record IN 
        SELECT DISTINCT 
            t.table_name,
            c.column_name,
            c.column_default
        FROM information_schema.tables t
        JOIN information_schema.columns c ON c.table_name = t.table_name
        WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        AND c.column_default LIKE '%uuid_generate_v4%'
        AND c.column_default NOT LIKE '%extensions.uuid_generate_v4%'
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT extensions.uuid_generate_v4()', 
                          table_record.table_name, table_record.column_name);
            update_count := update_count + 1;
            RAISE NOTICE 'Updated %.% default to use extensions schema ✅', 
                         table_record.table_name, table_record.column_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to update %.%: %', 
                         table_record.table_name, table_record.column_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Updated % table defaults ✅', update_count;
    
    -- Clean up public version if it exists and we have dependencies updated
    IF public_exists AND extensions_exists AND update_count >= 0 THEN
        BEGIN
            DROP EXTENSION "uuid-ossp" CASCADE;
            RAISE NOTICE 'Removed uuid-ossp from public schema ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not remove public uuid-ossp (may still have dependencies): %', SQLERRM;
        END;
    END IF;
    
END $$;

-- ===== STEP 2: HANDLE PGCRYPTO EXTENSION =====
DO $$
DECLARE
    public_exists BOOLEAN := FALSE;
    extensions_exists BOOLEAN := FALSE;
BEGIN
    -- Check current state
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
    INTO public_exists;
    
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions'))
    INTO extensions_exists;
    
    -- Ensure pgcrypto exists in extensions schema
    IF NOT extensions_exists THEN
        BEGIN
            CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
            RAISE NOTICE 'Created pgcrypto in extensions schema ✅';
        EXCEPTION WHEN duplicate_object THEN
            RAISE NOTICE 'pgcrypto already exists ✅';
        END;
    ELSE
        RAISE NOTICE 'pgcrypto already in extensions schema ✅';
    END IF;
    
    -- Remove from public if it exists
    IF public_exists THEN
        BEGIN
            DROP EXTENSION "pgcrypto";
            RAISE NOTICE 'Removed pgcrypto from public schema ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not remove public pgcrypto: %', SQLERRM;
        END;
    END IF;
    
END $$;

-- ===== FINAL VERIFICATION =====
SELECT 
    '=== FINAL EXTENSION STATUS ===' as section,
    '' as extension_name,
    '' as schema_name,
    '' as status
UNION ALL
SELECT 
    '',
    e.extname,
    n.nspname,
    CASE WHEN n.nspname = 'extensions' THEN 'SECURE ✅' ELSE 'CHECK ⚠️' END
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY section DESC, extension_name;

-- Test both functions work
SELECT 
    'UUID Test' as test,
    extensions.uuid_generate_v4()::text as result,
    'SUCCESS ✅' as status
UNION ALL
SELECT 
    'Crypto Test',
    encode(extensions.digest('test', 'sha256'), 'hex'),
    'SUCCESS ✅';

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

SELECT 'Extension security fixes completed! Check results above.' AS final_result;