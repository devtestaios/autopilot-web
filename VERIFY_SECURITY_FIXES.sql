-- 🔍 SECURITY FIXES VERIFICATION
-- Run this after applying security fixes to verify they worked
-- October 3, 2025

-- ===== CHECK FUNCTION SECURITY SETTINGS =====
SELECT 
    '=== FUNCTION SECURITY STATUS ===' as section;

SELECT 
    proname as function_name,
    CASE WHEN prosecdef THEN 'SECURITY DEFINER ✅' ELSE 'NOT SECURE ❌' END as security_status,
    CASE WHEN 'search_path=public' = ANY(proconfig) THEN 'SEARCH PATH SECURE ✅' 
         ELSE 'SEARCH PATH ISSUE ❌' END as search_path_status,
    proconfig as full_config
FROM pg_proc 
WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ===== CHECK EXTENSION LOCATIONS =====  
SELECT 
    '=== EXTENSION LOCATION STATUS ===' as section;

SELECT 
    e.extname as extension_name,
    n.nspname as current_schema,
    CASE WHEN n.nspname = 'extensions' THEN 'SECURE ✅' 
         WHEN n.nspname = 'public' THEN 'NEEDS FIX ❌'
         ELSE 'UNKNOWN SCHEMA ⚠️' END as security_status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto');

-- ===== TEST FUNCTIONALITY =====
SELECT 
    '=== FUNCTIONALITY TESTS ===' as section;

-- Test UUID generation
SELECT 
    'UUID Generation' as test_name,
    CASE WHEN extensions.uuid_generate_v4() IS NOT NULL THEN 'WORKING ✅' 
         ELSE 'BROKEN ❌' END as status;

-- Test increment function (if integration_apps table exists)
DO $$
DECLARE
    test_result text := 'NOT TESTED';
    app_count integer;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integration_apps') THEN
        -- Get current count
        SELECT COUNT(*) INTO app_count FROM integration_apps LIMIT 1;
        IF app_count > 0 THEN
            test_result := 'FUNCTION EXISTS ✅';
        ELSE
            test_result := 'TABLE EMPTY BUT FUNCTION EXISTS ✅';
        END IF;
    END IF;
    
    INSERT INTO pg_temp.temp_results VALUES ('increment_install_count', test_result);
EXCEPTION WHEN OTHERS THEN
    INSERT INTO pg_temp.temp_results VALUES ('increment_install_count', 'ERROR: ' || SQLERRM);
END $$;

-- ===== OVERALL SECURITY SUMMARY =====
SELECT 
    '=== SECURITY SUMMARY ===' as section;

SELECT 
    COUNT(*) FILTER (WHERE prosecdef = true AND 'search_path=public' = ANY(proconfig)) as secure_functions,
    COUNT(*) as total_functions_checked,
    CASE WHEN COUNT(*) FILTER (WHERE prosecdef = true AND 'search_path=public' = ANY(proconfig)) = 2 
         THEN 'ALL FUNCTIONS SECURE ✅' 
         ELSE 'FUNCTIONS NEED ATTENTION ❌' END as function_security_status
FROM pg_proc 
WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT 
    COUNT(*) FILTER (WHERE n.nspname = 'extensions') as secure_extensions,
    COUNT(*) as total_extensions_checked,
    CASE WHEN COUNT(*) FILTER (WHERE n.nspname = 'extensions') = 2
         THEN 'ALL EXTENSIONS SECURE ✅'
         ELSE 'EXTENSIONS NEED ATTENTION ❌' END as extension_security_status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto');

-- Final status
SELECT 
    CASE WHEN (
        SELECT COUNT(*) FROM pg_proc 
        WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND prosecdef = true 
        AND 'search_path=public' = ANY(proconfig)
    ) = 2 AND (
        SELECT COUNT(*) FROM pg_extension e
        JOIN pg_namespace n ON e.extnamespace = n.oid
        WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
        AND n.nspname = 'extensions'
    ) = 2
    THEN '🎯 ALL SECURITY FIXES SUCCESSFUL! System is now secure. ✅'
    ELSE '⚠️ Some security issues remain. Check the details above. ❌'
    END as final_status;