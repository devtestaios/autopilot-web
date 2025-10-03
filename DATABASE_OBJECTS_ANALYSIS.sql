-- ============================================================================
-- DATABASE OBJECT ANALYSIS QUERY
-- Understanding the 97 SQLs vs 40 Tables Mystery
-- Date: October 3, 2025
-- ============================================================================

-- Count all types of database objects in your Supabase database
-- This will show you exactly what makes up the "97 SQLs"

-- 1. COUNT ALL USER TABLES (what you see in Supabase dashboard)
SELECT 
  'USER_TABLES' as object_type,
  COUNT(*) as count,
  'These are your actual data tables (campaigns, ai_cycles, etc.)' as description
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. COUNT ALL VIEWS
SELECT 
  'VIEWS' as object_type,
  COUNT(*) as count,
  'Virtual tables created from queries' as description
FROM pg_views 
WHERE schemaname = 'public';

-- 3. COUNT ALL FUNCTIONS/PROCEDURES
SELECT 
  'FUNCTIONS' as object_type,
  COUNT(*) as count,
  'Stored procedures and functions' as description
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';

-- 4. COUNT ALL SEQUENCES
SELECT 
  'SEQUENCES' as object_type,
  COUNT(*) as count,
  'Auto-increment ID generators' as description
FROM pg_sequences 
WHERE schemaname = 'public';

-- 5. COUNT ALL INDEXES
SELECT 
  'INDEXES' as object_type,
  COUNT(*) as count,
  'Database performance indexes' as description
FROM pg_indexes 
WHERE schemaname = 'public';

-- 6. COUNT RLS POLICIES
SELECT 
  'RLS_POLICIES' as object_type,
  COUNT(*) as count,
  'Row Level Security policies' as description
FROM pg_policies 
WHERE schemaname = 'public';

-- 7. COUNT ALL TRIGGERS
SELECT 
  'TRIGGERS' as object_type,
  COUNT(*) as count,
  'Automatic event handlers' as description
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND NOT t.tgisinternal;

-- 8. DETAILED TABLE BREAKDOWN
SELECT 
  '=== YOUR ACTUAL TABLES ===' as info,
  tablename,
  'TABLE' as type
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. TOTAL OBJECTS SUMMARY
SELECT 
  'TOTAL_SUMMARY' as analysis,
  'Tables + Views + Functions + Sequences + Indexes + Policies + Triggers = Total Objects' as explanation,
  'Your 40 tables + 57 other objects = ~97 total database objects' as likely_breakdown;

-- 10. SUPABASE SPECIFIC OBJECTS
SELECT 
  'SUPABASE_SYSTEM' as category,
  COUNT(*) as count,
  'Supabase creates many internal objects for auth, realtime, etc.' as note
FROM pg_tables 
WHERE schemaname IN ('auth', 'realtime', 'storage', 'supabase_functions');