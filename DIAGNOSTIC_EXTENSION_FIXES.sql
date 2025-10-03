-- 🔍 EXTENSION DIAGNOSTIC & MINIMAL FIXES
-- First understand the current state, then apply minimal fixes
-- October 3, 2025

-- Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO public;

-- ===== DIAGNOSTIC: UNDERSTAND CURRENT STATE =====
SELECT '=== EXTENSION LOCATIONS ===' as diagnostic_section;

-- Show exactly where extensions are installed
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name,
    e.extversion as version,
    CASE 
        WHEN n.nspname = 'extensions' THEN 'TARGET SCHEMA ✅'
        WHEN n.nspname = 'public' THEN 'NEEDS MOVING ⚠️'
        ELSE 'UNEXPECTED LOCATION ❓'
    END as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname;

SELECT '=== FUNCTION AVAILABILITY ===' as diagnostic_section;

-- Test which uuid_generate_v4 functions are available
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    'AVAILABLE ✅' as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'uuid_generate_v4'
ORDER BY n.nspname;

SELECT '=== TABLE DEPENDENCIES ===' as diagnostic_section;

-- Show which tables depend on uuid functions
SELECT 
    t.table_name,
    c.column_name,
    c.column_default,
    CASE 
        WHEN c.column_default LIKE '%extensions.uuid_generate_v4%' THEN 'SECURE ✅'
        WHEN c.column_default LIKE '%uuid_generate_v4%' THEN 'NEEDS UPDATE ⚠️'
        ELSE 'OTHER DEFAULT ❓'
    END as dependency_status
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND c.column_default LIKE '%uuid_generate_v4%'
ORDER BY t.table_name, c.column_name;

-- ===== MINIMAL FIX: ENSURE FUNCTIONS ARE AVAILABLE =====
DO $$
DECLARE
    extensions_has_uuid BOOLEAN := FALSE;
    public_has_uuid BOOLEAN := FALSE;
    can_call_extensions_uuid BOOLEAN := FALSE;
    can_call_public_uuid BOOLEAN := FALSE;
BEGIN
    -- Check if functions exist in schemas
    SELECT EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
                  WHERE p.proname = 'uuid_generate_v4' AND n.nspname = 'extensions')
    INTO extensions_has_uuid;
    
    SELECT EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
                  WHERE p.proname = 'uuid_generate_v4' AND n.nspname = 'public')
    INTO public_has_uuid;
    
    RAISE NOTICE 'Function availability - Extensions schema: %, Public schema: %', 
                 extensions_has_uuid, public_has_uuid;
    
    -- Test if we can actually call the functions
    IF extensions_has_uuid THEN
        BEGIN
            PERFORM extensions.uuid_generate_v4();
            can_call_extensions_uuid := TRUE;
            RAISE NOTICE 'extensions.uuid_generate_v4() works ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'extensions.uuid_generate_v4() exists but cannot call: %', SQLERRM;
        END;
    END IF;
    
    IF public_has_uuid THEN
        BEGIN
            PERFORM uuid_generate_v4();
            can_call_public_uuid := TRUE;
            RAISE NOTICE 'public.uuid_generate_v4() works ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'public.uuid_generate_v4() exists but cannot call: %', SQLERRM;
        END;
    END IF;
    
    -- If extensions version doesn't work but public does, create alias/wrapper
    IF NOT can_call_extensions_uuid AND can_call_public_uuid THEN
        RAISE NOTICE 'Creating wrapper function in extensions schema...';
        
        -- Create a wrapper function that calls the public version
        EXECUTE 'CREATE OR REPLACE FUNCTION extensions.uuid_generate_v4() RETURNS uuid AS $wrapper$ 
                 BEGIN 
                     RETURN public.uuid_generate_v4(); 
                 END; 
                 $wrapper$ LANGUAGE plpgsql;';
        
        -- Test the wrapper
        BEGIN
            PERFORM extensions.uuid_generate_v4();
            RAISE NOTICE 'Created working wrapper function in extensions schema ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Wrapper function failed: %', SQLERRM;
        END;
        
    ELSIF NOT can_call_extensions_uuid AND NOT can_call_public_uuid THEN
        -- Neither works, try to install fresh
        RAISE NOTICE 'Neither function works, attempting fresh installation...';
        
        BEGIN
            -- Try installing in extensions schema
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
            RAISE NOTICE 'Installed uuid-ossp in extensions schema';
            
            PERFORM extensions.uuid_generate_v4();
            RAISE NOTICE 'Fresh installation successful ✅';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Fresh installation failed: %', SQLERRM;
            
            -- Fallback: try in public and create wrapper
            BEGIN
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                RAISE NOTICE 'Installed in public schema as fallback';
                
                EXECUTE 'CREATE OR REPLACE FUNCTION extensions.uuid_generate_v4() RETURNS uuid AS $fallback$ 
                         BEGIN 
                             RETURN uuid_generate_v4(); 
                         END; 
                         $fallback$ LANGUAGE plpgsql;';
                
                PERFORM extensions.uuid_generate_v4();
                RAISE NOTICE 'Created fallback wrapper function ✅';
            EXCEPTION WHEN OTHERS THEN
                RAISE EXCEPTION 'All installation attempts failed: %', SQLERRM;
            END;
        END;
    ELSE
        RAISE NOTICE 'extensions.uuid_generate_v4() is already working ✅';
    END IF;
END $$;

-- ===== FINAL VERIFICATION =====
SELECT '=== FINAL STATUS ===' as final_section;

-- Test the function one more time
SELECT 
    'Function Test' as test_name,
    extensions.uuid_generate_v4()::text as sample_uuid,
    'SUCCESS ✅' as status;

-- Show final extension status
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name,
    'INSTALLED' as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname;

SELECT 'Diagnostic and minimal fixes completed!' as result;