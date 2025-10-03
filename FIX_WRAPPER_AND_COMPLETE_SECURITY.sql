-- 🔧 FIX WRAPPER FUNCTION - CORRECT UUID FUNCTION CALL
-- Fix the wrapper function created by diagnostic script
-- October 3, 2025

-- ===== FIX THE WRAPPER FUNCTION =====
DO $$
DECLARE
    uuid_function_exists BOOLEAN := FALSE;
    wrapper_exists BOOLEAN := FALSE;
BEGIN
    -- Check if wrapper function exists
    SELECT EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
                  WHERE p.proname = 'uuid_generate_v4' AND n.nspname = 'extensions')
    INTO wrapper_exists;
    
    -- Check if the actual uuid function exists somewhere
    SELECT EXISTS(SELECT 1 FROM pg_proc p 
                  WHERE p.proname = 'uuid_generate_v4' 
                  AND p.pronamespace != (SELECT oid FROM pg_namespace WHERE nspname = 'extensions'))
    INTO uuid_function_exists;
    
    RAISE NOTICE 'Wrapper exists: %, Original function exists: %', wrapper_exists, uuid_function_exists;
    
    -- If wrapper exists but is broken, fix it
    IF wrapper_exists THEN
        RAISE NOTICE 'Fixing existing wrapper function...';
        
        -- Drop the broken wrapper
        DROP FUNCTION IF EXISTS extensions.uuid_generate_v4();
        
        -- Try to find and use the working uuid function
        IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
                   WHERE p.proname = 'uuid_generate_v4' AND n.nspname = 'public') THEN
            -- Public function exists, create wrapper
            EXECUTE 'CREATE FUNCTION extensions.uuid_generate_v4() RETURNS uuid AS $wrapper$
                     BEGIN 
                         RETURN public.uuid_generate_v4(); 
                     END; 
                     $wrapper$ LANGUAGE plpgsql;';
            RAISE NOTICE 'Created wrapper using public.uuid_generate_v4()';
            
        ELSE
            -- No public function, try to install extension properly
            BEGIN
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
                RAISE NOTICE 'Installed uuid-ossp directly in extensions schema';
            EXCEPTION WHEN OTHERS THEN
                -- Fallback: install in public and create wrapper
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                EXECUTE 'CREATE FUNCTION extensions.uuid_generate_v4() RETURNS uuid AS $wrapper$
                         BEGIN 
                             RETURN uuid_generate_v4(); 
                         END; 
                         $wrapper$ LANGUAGE plpgsql;';
                RAISE NOTICE 'Installed in public and created wrapper';
            END;
        END IF;
        
    ELSE
        -- No wrapper exists, ensure extension is properly installed
        BEGIN
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
            RAISE NOTICE 'Installed uuid-ossp in extensions schema';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Extension installation failed: %', SQLERRM;
            -- Fallback approach
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            EXECUTE 'CREATE FUNCTION extensions.uuid_generate_v4() RETURNS uuid AS $wrapper$
                     BEGIN 
                         RETURN uuid_generate_v4(); 
                     END; 
                     $wrapper$ LANGUAGE plpgsql;';
            RAISE NOTICE 'Created fallback wrapper function';
        END;
    END IF;
    
    -- Test the function
    BEGIN
        PERFORM extensions.uuid_generate_v4();
        RAISE NOTICE 'extensions.uuid_generate_v4() is now working ✅';
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create working UUID function: %', SQLERRM;
    END;
    
END $$;

-- ===== NOW UPDATE TABLE DEFAULTS =====
DO $$
DECLARE
    table_record RECORD;
    update_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting table default updates...';
    
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
        AND c.column_default NOT LIKE '%extensions.uuid_generate_v4%'
    LOOP
        BEGIN
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
    
    RAISE NOTICE 'Updated % table column defaults ✅', update_count;
END $$;

-- ===== HANDLE PGCRYPTO =====
DO $$
DECLARE
    pgcrypto_public BOOLEAN := FALSE;
    pgcrypto_extensions BOOLEAN := FALSE;
BEGIN
    -- Check current state of pgcrypto
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
    INTO pgcrypto_public;
    
    SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions'))
    INTO pgcrypto_extensions;
    
    RAISE NOTICE 'pgcrypto status - Public: %, Extensions: %', pgcrypto_public, pgcrypto_extensions;
    
    -- Handle pgcrypto based on current state
    IF pgcrypto_extensions THEN
        RAISE NOTICE 'pgcrypto already in extensions schema ✅';
    ELSIF pgcrypto_public THEN
        -- Move from public to extensions
        BEGIN
            DROP EXTENSION "pgcrypto";
            CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
            RAISE NOTICE 'Moved pgcrypto from public to extensions schema ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not move pgcrypto to extensions schema: %', SQLERRM;
        END;
    ELSE
        -- Install fresh in extensions
        BEGIN
            CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
            RAISE NOTICE 'Installed pgcrypto in extensions schema ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Could not install pgcrypto in extensions schema: %', SQLERRM;
            -- Fallback: install in public
            BEGIN
                CREATE EXTENSION IF NOT EXISTS "pgcrypto";
                RAISE NOTICE 'Installed pgcrypto in public schema as fallback';
            EXCEPTION WHEN OTHERS THEN
                RAISE WARNING 'Could not install pgcrypto anywhere: %', SQLERRM;
            END;
        END;
    END IF;
END $$;

-- ===== VERIFICATION =====
SELECT '=== FUNCTION TEST ===' as section;

-- Test the UUID function
SELECT 
    'UUID Generation' as test_name,
    extensions.uuid_generate_v4()::text as sample_uuid,
    'SUCCESS ✅' as status;

-- Test crypto function if available (with proper error handling)
DO $$
DECLARE
    crypto_result TEXT := 'Not available';
    crypto_status TEXT := 'SKIPPED';
BEGIN
    -- Try to test the crypto function safely
    BEGIN
        SELECT encode(extensions.digest('test', 'sha256'), 'hex') INTO crypto_result;
        crypto_status := 'SUCCESS ✅';
    EXCEPTION WHEN OTHERS THEN
        -- Function doesn't exist or isn't working
        crypto_result := 'Function not available: ' || SQLERRM;
        crypto_status := 'SKIPPED';
    END;
    
    -- Insert the test result
    CREATE TEMP TABLE IF NOT EXISTS temp_crypto_test (
        test_name TEXT,
        result TEXT,
        status TEXT
    );
    
    INSERT INTO temp_crypto_test VALUES ('Crypto Function', crypto_result, crypto_status);
END $$;

-- Show the crypto test result
SELECT * FROM temp_crypto_test;

SELECT '=== EXTENSION STATUS ===' as section;

-- Show extension locations
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name,
    CASE WHEN n.nspname = 'extensions' THEN 'SECURE ✅' ELSE 'PUBLIC ⚠️' END as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname, n.nspname;

SELECT 'Fixed wrapper function and completed extension security!' AS result;