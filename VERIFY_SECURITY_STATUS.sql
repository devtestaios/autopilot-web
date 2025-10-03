-- ============================================================================
-- SUPABASE TABLE & SECURITY STATUS VERIFICATION
-- ============================================================================
-- Run this query to see which tables exist and their RLS status
-- Use this BEFORE and AFTER running the security fix to verify results

-- 1. Show all existing public tables with their RLS status
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status,
    tableowner,
    hasindexes,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Count tables by RLS status
SELECT 
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled'
        ELSE 'RLS Disabled'
    END as status,
    COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname = 'public' 
GROUP BY rowsecurity;

-- 3. Show existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Security Issues Checklist
-- Run this to see which tables from the security report actually exist
WITH security_tables AS (
    SELECT unnest(ARRAY[
        'campaigns',
        'optimization_actions', 
        'meta_ai_insights',
        'alerts',
        'client_settings',
        'performance_benchmarks',
        'ai_decision_logs',
        'cross_platform_performance',
        'testing_configurations',
        'master_ai_cycles',
        'platform_ai_coordination',
        'executive_dashboards',
        'kpi_definitions',
        'kpi_values',
        'available_integrations',
        'user_integrations',
        'collaboration_sessions',
        'activity_feed',
        'email_lists'
    ]) as table_name
)
SELECT 
    st.table_name,
    CASE 
        WHEN t.tablename IS NOT NULL THEN '✅ Table Exists'
        ELSE '❌ Table Missing'
    END as exists_status,
    CASE 
        WHEN t.tablename IS NOT NULL AND t.rowsecurity THEN '✅ RLS Enabled'
        WHEN t.tablename IS NOT NULL AND NOT t.rowsecurity THEN '❌ RLS Disabled'  
        ELSE 'N/A - Table Missing'
    END as rls_status
FROM security_tables st
LEFT JOIN pg_tables t ON t.tablename = st.table_name AND t.schemaname = 'public'
ORDER BY 
    CASE WHEN t.tablename IS NOT NULL THEN 0 ELSE 1 END,
    st.table_name;

-- ============================================================================
-- INSTRUCTIONS:
-- 1. Run this query BEFORE applying security fixes to see current state
-- 2. Apply the SAFE_SUPABASE_SECURITY_FIX.sql 
-- 3. Run this query AGAIN to verify the security fixes were applied
-- ============================================================================