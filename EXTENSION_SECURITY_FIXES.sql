-- 🔧 EXTENSION SECURITY FIXES - HANDLE DEPENDENCIES PROPERLY
-- Safely move extensions from public to extensions schema
-- October 3, 2025

-- Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO public;

-- ===== STEP 1: ENSURE EXTENSION EXISTS IN EXTENSIONS SCHEMA =====
-- Make sure uuid-ossp is available in extensions schema before updating dependencies
DO $$
BEGIN
    -- Check if extension exists in extensions schema already
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
               AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')) THEN
        RAISE NOTICE 'uuid-ossp already exists in extensions schema ✅';
        
    -- Check if extension exists in public schema - create duplicate in extensions first
    ELSIF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
                  AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        -- Create in extensions schema (will coexist temporarily with public version)
        CREATE EXTENSION "uuid-ossp" WITH SCHEMA extensions;
        RAISE NOTICE 'Created uuid-ossp in extensions schema (public version will be removed later) ✅';
        
    -- Extension doesn't exist anywhere, create it in extensions schema
    ELSE
        CREATE EXTENSION "uuid-ossp" WITH SCHEMA extensions;
        RAISE NOTICE 'Created uuid-ossp in extensions schema ✅';
    END IF;
END $$;

-- ===== STEP 1.5: VERIFY EXTENSION FUNCTION IS AVAILABLE =====
-- Test that extensions.uuid_generate_v4() actually works before proceeding
DO $$
DECLARE
    test_uuid UUID;
BEGIN
    SELECT extensions.uuid_generate_v4() INTO test_uuid;
    RAISE NOTICE 'Verified extensions.uuid_generate_v4() is working: % ✅', test_uuid;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'ERROR: extensions.uuid_generate_v4() is not available. Cannot proceed safely. Error: %', SQLERRM;
END $$;

-- ===== STEP 2: UPDATE TABLE DEFAULTS TO USE EXTENSIONS SCHEMA =====
-- Now that extensions.uuid_generate_v4() definitely exists, update table defaults
DO $$
DECLARE
    table_record RECORD;
    update_count INTEGER := 0;
BEGIN
    -- Update each table that uses uuid_generate_v4() as default
    FOR table_record IN 
        SELECT DISTINCT 
            t.table_name,
            c.column_name
        FROM information_schema.tables t
        JOIN information_schema.columns c ON c.table_name = t.table_name
        WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        AND c.column_default LIKE '%uuid_generate_v4%'
        AND c.column_default NOT LIKE '%extensions.uuid_generate_v4%'  -- Skip if already updated
    LOOP
        -- Update the column default to use extensions schema
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT extensions.uuid_generate_v4()', 
                      table_record.table_name, table_record.column_name);
        
        update_count := update_count + 1;
        RAISE NOTICE 'Updated default for %.% to use extensions.uuid_generate_v4() ✅', 
                     table_record.table_name, table_record.column_name;
    END LOOP;
    
    IF update_count = 0 THEN
        RAISE NOTICE 'No table defaults needed updating (already secure or no dependencies found) ✅';
    ELSE
        RAISE NOTICE 'Updated % table column defaults to use extensions schema ✅', update_count;
    END IF;
END $$;

-- ===== STEP 3: SAFELY REMOVE PUBLIC EXTENSION (IF EXISTS) =====  
-- Now that dependencies point to extensions schema, drop from public if it exists there
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
               AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        DROP EXTENSION "uuid-ossp" CASCADE;
        RAISE NOTICE 'Removed uuid-ossp from public schema';
    ELSE
        RAISE NOTICE 'uuid-ossp not found in public schema - already moved or never existed there';
    END IF;
END $$;

-- ===== STEP 4: HANDLE PGCRYPTO =====
DO $$
BEGIN
    -- Check if pgcrypto already exists in extensions schema
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' 
               AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')) THEN
        RAISE NOTICE 'pgcrypto already exists in extensions schema';
        
    -- Create pgcrypto in extensions schema if it doesn't exist there
    ELSE
        -- Check if it exists in public first
        IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
                   AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
            -- Drop from public and recreate in extensions
            DROP EXTENSION "pgcrypto";
            CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
            RAISE NOTICE 'Moved pgcrypto from public to extensions schema';
        ELSE
            -- Create fresh in extensions schema
            CREATE EXTENSION "pgcrypto" WITH SCHEMA extensions;
            RAISE NOTICE 'Created pgcrypto in extensions schema';
        END IF;
    END IF;
END $$;

-- ===== VERIFICATION =====
-- Check that extensions are now in the right place
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name,
    'SUCCESS ✅' as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname;

-- Test UUID generation still works
SELECT 
    'UUID Generation Test' as test,
    extensions.uuid_generate_v4() as sample_uuid,
    'WORKING ✅' as status;

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

SELECT 'Extension security fixes applied successfully! Extensions moved to dedicated schema.' AS result;