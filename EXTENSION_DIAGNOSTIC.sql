-- 🔍 EXTENSION DIAGNOSTIC - CHECK CURRENT STATE
-- Run this first to understand what extensions exist where
-- October 3, 2025

SELECT '=== CURRENT EXTENSION LOCATIONS ===' as section;

-- Check where extensions currently exist
SELECT 
    e.extname as extension_name,
    n.nspname as current_schema,
    CASE 
        WHEN n.nspname = 'extensions' THEN '✅ ALREADY SECURE'
        WHEN n.nspname = 'public' THEN '⚠️ NEEDS MOVING'
        ELSE '❓ UNEXPECTED SCHEMA'
    END as security_status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY e.extname, n.nspname;

SELECT '=== TABLE DEPENDENCIES ===' as section;

-- Check which tables depend on uuid_generate_v4()
SELECT 
    t.table_name,
    c.column_name,
    c.column_default,
    CASE 
        WHEN c.column_default LIKE '%extensions.uuid_generate_v4%' THEN '✅ USES EXTENSIONS SCHEMA'
        WHEN c.column_default LIKE '%uuid_generate_v4%' THEN '⚠️ USES PUBLIC SCHEMA'
        ELSE '❓ UNEXPECTED DEFAULT'
    END as dependency_status
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND c.column_default LIKE '%uuid_generate_v4%'
ORDER BY t.table_name, c.column_name;

SELECT '=== SCHEMA EXISTENCE ===' as section;

-- Check if extensions schema exists
SELECT 
    nspname as schema_name,
    CASE 
        WHEN nspname = 'extensions' THEN '✅ EXTENSIONS SCHEMA EXISTS'
        ELSE nspname
    END as status
FROM pg_namespace 
WHERE nspname IN ('public', 'extensions')
ORDER BY nspname;

SELECT '=== RECOMMENDED ACTION ===' as section;

-- Provide recommendation based on current state
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid 
              WHERE e.extname IN ('uuid-ossp', 'pgcrypto') AND n.nspname = 'extensions') = 2
        THEN '🎯 Extensions already secure! No action needed.'
        
        WHEN (SELECT COUNT(*) FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid 
              WHERE e.extname = 'uuid-ossp' AND n.nspname = 'extensions') = 1
        THEN '⚡ uuid-ossp already in extensions schema. Run EXTENSION_SECURITY_FIXES.sql to complete setup.'
        
        ELSE '🔧 Extensions need to be moved. Safe to run EXTENSION_SECURITY_FIXES.sql'
    END as recommendation;