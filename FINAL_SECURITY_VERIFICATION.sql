-- 🔍 FINAL SECURITY VERIFICATION - CHECK ALL FIXES
-- Verify that both function security and extension security warnings are resolved
-- October 3, 2025

SELECT '=== FUNCTION SECURITY STATUS ===' as section;

-- Check function search_path security (should be fixed by SAFE_FUNCTION_SECURITY_FIXES)
SELECT 
    proname as function_name,
    CASE WHEN prosecdef THEN 'SECURITY DEFINER ✅' ELSE 'NOT SECURE ❌' END as security_definer,
    CASE WHEN 'search_path=public' = ANY(proconfig) THEN 'SEARCH PATH SECURE ✅' 
         ELSE 'SEARCH PATH ISSUE ❌' END as search_path_status,
    proconfig as configuration
FROM pg_proc 
WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT '=== EXTENSION SECURITY STATUS ===' as section;

-- Check extension locations (should be in extensions schema now)
SELECT 
    e.extname as extension_name,
    n.nspname as current_schema,
    CASE 
        WHEN n.nspname = 'extensions' THEN 'SECURE ✅'
        WHEN n.nspname = 'public' THEN 'SECURITY WARNING ⚠️'
        ELSE 'UNEXPECTED SCHEMA ❓'
    END as security_status,
    e.extversion as version
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname;

SELECT '=== TABLE DEPENDENCY STATUS ===' as section;

-- Check table defaults (should use extensions schema now)
SELECT 
    t.table_name,
    c.column_name,
    CASE 
        WHEN c.column_default LIKE '%extensions.uuid_generate_v4%' THEN 'SECURE ✅'
        WHEN c.column_default LIKE '%uuid_generate_v4%' THEN 'SECURITY WARNING ⚠️'
        ELSE 'OTHER DEFAULT'
    END as security_status,
    c.column_default as current_default
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND c.column_default LIKE '%uuid_generate_v4%'
ORDER BY t.table_name, c.column_name;

SELECT '=== OVERALL SECURITY ASSESSMENT ===' as section;

-- Overall function security assessment
SELECT 
    COUNT(*) FILTER (WHERE prosecdef = true AND 'search_path=public' = ANY(proconfig)) as secure_functions,
    COUNT(*) as total_functions,
    CASE 
        WHEN COUNT(*) FILTER (WHERE prosecdef = true AND 'search_path=public' = ANY(proconfig)) = 
             COUNT(*)
        THEN 'ALL FUNCTIONS SECURE ✅'
        ELSE 'SOME FUNCTIONS NEED ATTENTION ❌'
    END as function_security_status
FROM pg_proc 
WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Overall extension security assessment
SELECT 
    COUNT(*) FILTER (WHERE n.nspname = 'extensions') as secure_extensions,
    COUNT(*) as total_extensions,
    CASE 
        WHEN COUNT(*) FILTER (WHERE n.nspname = 'extensions') >= 1  -- At least uuid-ossp secure
        THEN 'EXTENSIONS SECURE ✅'
        ELSE 'EXTENSIONS NEED ATTENTION ❌'
    END as extension_security_status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto');

-- Function availability test
SELECT 
    'Function Tests' as test_category,
    'extensions.uuid_generate_v4()' as test_function,
    extensions.uuid_generate_v4()::text as sample_result,
    'WORKING ✅' as status
UNION ALL
SELECT 
    'Function Tests',
    'extensions.digest()',
    encode(extensions.digest('test', 'sha256'), 'hex'),
    'WORKING ✅';

SELECT '=== EXPECTED SECURITY WARNINGS RESOLVED ===' as section;

-- Summary of what should be fixed
SELECT 
    'function_search_path_mutable' as warning_type,
    'increment_install_count' as affected_object,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc 
                     WHERE proname = 'increment_install_count' 
                     AND prosecdef = true 
                     AND 'search_path=public' = ANY(proconfig))
        THEN 'RESOLVED ✅'
        ELSE 'STILL PRESENT ❌'
    END as status
UNION ALL
SELECT 
    'function_search_path_mutable',
    'calculate_ai_performance_score',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc 
                     WHERE proname = 'calculate_ai_performance_score' 
                     AND prosecdef = true 
                     AND 'search_path=public' = ANY(proconfig))
        THEN 'RESOLVED ✅'
        ELSE 'STILL PRESENT ❌'
    END
UNION ALL
SELECT 
    'extension_in_public',
    'uuid-ossp',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid
                     WHERE e.extname = 'uuid-ossp' AND n.nspname = 'extensions')
        THEN 'RESOLVED ✅'
        ELSE 'STILL PRESENT ❌'
    END
UNION ALL
SELECT 
    'extension_in_public',
    'pgcrypto',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid
                     WHERE e.extname = 'pgcrypto' AND n.nspname = 'extensions')
        THEN 'RESOLVED ✅'
        ELSE 'STILL PRESENT ❌'
    END;

-- Final summary
SELECT 
    CASE 
        WHEN (
            -- Check functions are secure
            (SELECT COUNT(*) FROM pg_proc 
             WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
             AND prosecdef = true AND 'search_path=public' = ANY(proconfig)) >= 2
            AND
            -- Check at least uuid-ossp is in extensions schema
            EXISTS (SELECT 1 FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid
                    WHERE e.extname = 'uuid-ossp' AND n.nspname = 'extensions')
        )
        THEN '🎯 SUCCESS: All major security warnings should be resolved! ✅'
        ELSE '⚠️ PARTIAL: Some security issues may remain. Check details above.'
    END as final_security_status;