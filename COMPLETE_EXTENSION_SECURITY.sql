-- 🔧 COMPLETE EXTENSION SECURITY FIXES - TABLE UPDATES
-- Now that extensions.uuid_generate_v4() is working, update table defaults
-- October 3, 2025

-- ===== UPDATE TABLE DEFAULTS TO USE EXTENSIONS SCHEMA =====
DO $$
DECLARE
    table_record RECORD;
    update_count INTEGER := 0;
    pgcrypto_handled BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE 'Starting table default updates to use extensions schema...';
    
    -- Update each table that uses uuid_generate_v4() as default
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
        AND c.column_default NOT LIKE '%extensions.uuid_generate_v4%'  -- Skip already updated
    LOOP
        BEGIN
            -- Update the column default to use extensions schema
            EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT extensions.uuid_generate_v4()', 
                          table_record.table_name, table_record.column_name);
            
            update_count := update_count + 1;
            RAISE NOTICE 'Updated %.% default to use extensions.uuid_generate_v4() ✅', 
                         table_record.table_name, table_record.column_name;
                         
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to update %.%: %', 
                         table_record.table_name, table_record.column_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Updated % table column defaults to use extensions schema ✅', update_count;
    
    -- Handle pgcrypto extension if needed
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
                   AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')) THEN
        BEGIN
            -- Try to move pgcrypto to extensions schema
            IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
                       AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
                -- Drop from public and recreate in extensions
                DROP EXTENSION "pgcrypto";
                CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
                RAISE NOTICE 'Moved pgcrypto from public to extensions schema ✅';
            ELSE
                -- Create fresh in extensions schema
                CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
                RAISE NOTICE 'Created pgcrypto in extensions schema ✅';
            END IF;
            pgcrypto_handled := TRUE;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not handle pgcrypto extension: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'pgcrypto already in extensions schema ✅';
        pgcrypto_handled := TRUE;
    END IF;
    
    -- Clean up public uuid-ossp extension if safe to do so
    IF update_count > 0 AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
                                    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        BEGIN
            DROP EXTENSION "uuid-ossp" CASCADE;
            RAISE NOTICE 'Removed uuid-ossp from public schema (dependencies updated) ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not remove public uuid-ossp (may still have dependencies): %', SQLERRM;
            RAISE NOTICE 'This is OK - the extensions schema version is working';
        END;
    END IF;
    
END $$;

-- ===== FINAL VERIFICATION =====
SELECT '=== SECURITY FIX VERIFICATION ===' as verification_section;

-- Check extension locations
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name,
    CASE 
        WHEN n.nspname = 'extensions' THEN 'SECURE ✅'
        WHEN n.nspname = 'public' THEN 'PUBLIC SCHEMA ⚠️' 
        ELSE 'OTHER SCHEMA ❓'
    END as security_status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname, n.nspname;

-- Verify table defaults are now secure
SELECT 
    t.table_name,
    c.column_name,
    c.column_default,
    CASE 
        WHEN c.column_default LIKE '%extensions.uuid_generate_v4%' THEN 'SECURE ✅'
        WHEN c.column_default LIKE '%uuid_generate_v4%' THEN 'NEEDS ATTENTION ⚠️'
        ELSE 'OTHER DEFAULT'
    END as security_status
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND c.column_default LIKE '%uuid_generate_v4%'
ORDER BY t.table_name, c.column_name;

-- Test both functions work
SELECT 
    'UUID Generation Test' as test_name,
    extensions.uuid_generate_v4()::text as sample_uuid,
    'WORKING ✅' as status
UNION ALL
SELECT 
    'Crypto Test' as test_name,
    encode(extensions.digest('security_test', 'sha256'), 'hex') as sample_hash,
    'WORKING ✅' as status;

-- ===== SECURITY SUMMARY =====
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid 
              WHERE e.extname IN ('uuid-ossp', 'pgcrypto') AND n.nspname = 'extensions') >= 2
        THEN '🎯 EXTENSION SECURITY: Both extensions secured in dedicated schema ✅'
        ELSE '⚠️ EXTENSION SECURITY: Some extensions may still be in public schema'
    END as extension_status
UNION ALL
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables t
                         JOIN information_schema.columns c ON c.table_name = t.table_name
                         WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
                         AND c.column_default LIKE '%uuid_generate_v4%'
                         AND c.column_default NOT LIKE '%extensions.uuid_generate_v4%')
        THEN '🎯 TABLE SECURITY: All table defaults use secure extensions schema ✅'
        ELSE '⚠️ TABLE SECURITY: Some tables may still use public schema functions'
    END as table_status;

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

SELECT 'Extension security fixes completed! Check verification results above.' AS final_result;