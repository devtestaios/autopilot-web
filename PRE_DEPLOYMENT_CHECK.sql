-- ============================================================================
-- PRE-DEPLOYMENT TABLE CHECK SCRIPT
-- Run this BEFORE the master recovery to see what exists
-- ============================================================================

-- Check existing tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count current tables
SELECT COUNT(*) as current_table_count 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check for specific AI tables
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ai_performance_scores') THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as ai_performance_scores,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'master_ai_cycles') THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as master_ai_cycles,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_campaigns') THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as email_campaigns,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'campaigns') THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as campaigns;

-- Show table sizes (data check)
SELECT 
    schemaname,
    tablename,
    n_tup_ins as rows_inserted,
    n_tup_upd as rows_updated,
    n_tup_del as rows_deleted
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY n_tup_ins DESC
LIMIT 10;