-- =============================================================================
-- COMPREHENSIVE SECURITY AUDIT - Enhanced Database Security Assessment
-- =============================================================================
-- This script performs a complete security audit of your Supabase database
-- It checks RLS policies, permissions, triggers, functions, and potential vulnerabilities
-- Run this script to get a detailed security report with recommendations
-- =============================================================================

-- SECTION 1: Database Overview
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 COMPREHENSIVE DATABASE SECURITY AUDIT';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Timestamp: %', NOW();
  RAISE NOTICE 'Database: %', current_database();
  RAISE NOTICE 'Current User: %', current_user;
  RAISE NOTICE '';
END $$;

-- SECTION 2: RLS (Row Level Security) Status
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '📋 RLS STATUS AUDIT';
  RAISE NOTICE '===================';
END $$;

-- Check RLS status on all public tables
SELECT
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- SECTION 3: RLS Policies Analysis
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🛡️  RLS POLICIES ANALYSIS';
  RAISE NOTICE '========================';
END $$;

-- Detailed policy analysis
SELECT
  schemaname,
  tablename,
  policyname,
  CASE 
    WHEN permissive = 'PERMISSIVE' THEN '✅ PERMISSIVE'
    ELSE '⚠️  RESTRICTIVE'
  END as policy_type,
  roles,
  cmd as command_type,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Count policies per table
SELECT
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(DISTINCT cmd, ', ') as commands_covered
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC;

-- SECTION 4: Authentication & User Management
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '👥 AUTHENTICATION AUDIT';
  RAISE NOTICE '=======================';
END $$;

-- Check auth schema structure
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name IN ('users', 'sessions', 'refresh_tokens')
ORDER BY table_name, ordinal_position;

-- Check profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN is_nullable = 'NO' THEN '✅ NOT NULL'
    ELSE '⚠️  NULLABLE'
  END as null_constraint
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- SECTION 5: Triggers and Functions Audit
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚡ TRIGGERS & FUNCTIONS AUDIT';
  RAISE NOTICE '=============================';
END $$;

-- Check all triggers
SELECT
  trigger_name,
  event_object_table as table_name,
  event_manipulation as event_type,
  action_timing,
  action_statement,
  CASE 
    WHEN trigger_name LIKE '%auth%' THEN '🔐 AUTH-RELATED'
    WHEN trigger_name LIKE '%audit%' THEN '📝 AUDIT-RELATED'
    ELSE '⚙️  GENERAL'
  END as trigger_category
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check functions that handle authentication
SELECT
  routine_name,
  routine_type,
  security_type,
  CASE 
    WHEN security_type = 'DEFINER' THEN '⚠️  DEFINER (Elevated)'
    ELSE '✅ INVOKER (User Context)'
  END as security_context,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%user%' OR routine_name LIKE '%auth%' OR routine_name LIKE '%profile%')
ORDER BY routine_name;

-- SECTION 6: Permissions and Grants Analysis
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔑 PERMISSIONS AUDIT';
  RAISE NOTICE '====================';
END $$;

-- Check table permissions
SELECT
  schemaname,
  tablename,
  grantor,
  grantee,
  privilege_type,
  is_grantable,
  CASE 
    WHEN grantee = 'authenticated' THEN '👤 AUTHENTICATED USERS'
    WHEN grantee = 'anon' THEN '🌐 ANONYMOUS USERS'
    WHEN grantee = 'service_role' THEN '🤖 SERVICE ROLE'
    WHEN grantee = 'public' THEN '⚠️  PUBLIC ACCESS'
    ELSE '👥 ' || grantee
  END as role_description
FROM information_schema.table_privileges
WHERE table_schema = 'public'
ORDER BY tablename, grantee, privilege_type;

-- SECTION 7: Potential Security Vulnerabilities
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  SECURITY VULNERABILITY SCAN';
  RAISE NOTICE '===============================';
END $$;

-- Check for tables without RLS
SELECT
  '❌ RLS DISABLED' as issue_type,
  'HIGH' as severity,
  tablename as affected_object,
  'Table has RLS disabled - all data accessible' as description
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;

-- Check for overly permissive policies
SELECT
  '⚠️  PERMISSIVE POLICY' as issue_type,
  'MEDIUM' as severity,
  tablename || '.' || policyname as affected_object,
  'Policy uses USING (true) - allows unrestricted access' as description
FROM pg_policies
WHERE schemaname = 'public'
  AND (qual LIKE '%true%' OR qual IS NULL);

-- Check for public grants
SELECT
  '🌐 PUBLIC ACCESS' as issue_type,
  'HIGH' as severity,
  table_name as affected_object,
  'Table has public access granted - accessible to everyone' as description
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'public';

-- Check for anonymous user access
SELECT
  '👻 ANONYMOUS ACCESS' as issue_type,
  'MEDIUM' as severity,
  table_name as affected_object,
  privilege_type || ' access granted to anonymous users' as description
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'anon';

-- SECTION 8: Authentication Flow Verification
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 AUTHENTICATION FLOW AUDIT';
  RAISE NOTICE '=============================';
END $$;

-- Check if profile creation trigger exists
SELECT
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PROFILE CREATION TRIGGER EXISTS'
    ELSE '❌ MISSING PROFILE CREATION TRIGGER'
  END as trigger_status,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE trigger_name LIKE '%user%' 
  AND event_object_schema = 'auth'
  AND event_object_table = 'users';

-- Check auth.users table accessibility
SELECT
  COUNT(*) as total_policies,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ AUTH USERS PROTECTED'
    ELSE '⚠️  AUTH USERS NOT PROTECTED'
  END as protection_status
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- SECTION 9: Data Integrity Checks
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 DATA INTEGRITY AUDIT';
  RAISE NOTICE '=======================';
END $$;

-- Check for orphaned profiles (profiles without auth users)
SELECT
  'ORPHANED PROFILES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ NO ORPHANED PROFILES'
    ELSE '⚠️  ' || COUNT(*) || ' ORPHANED PROFILES FOUND'
  END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Check for auth users without profiles
SELECT
  'USERS WITHOUT PROFILES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ ALL USERS HAVE PROFILES'
    ELSE '⚠️  ' || COUNT(*) || ' USERS WITHOUT PROFILES'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- SECTION 10: Security Recommendations
-- =============================================================================
DO $$
DECLARE
  rls_disabled_count INTEGER;
  public_access_count INTEGER;
  missing_trigger_count INTEGER;
BEGIN
  -- Count security issues
  SELECT COUNT(*) INTO rls_disabled_count
  FROM pg_tables
  WHERE schemaname = 'public' AND rowsecurity = false;
  
  SELECT COUNT(*) INTO public_access_count
  FROM information_schema.table_privileges
  WHERE table_schema = 'public' AND grantee = 'public';
  
  SELECT COUNT(*) INTO missing_trigger_count
  FROM information_schema.triggers
  WHERE trigger_name LIKE '%user%' AND event_object_schema = 'auth';
  
  RAISE NOTICE '';
  RAISE NOTICE '💡 SECURITY RECOMMENDATIONS';
  RAISE NOTICE '============================';
  
  IF rls_disabled_count > 0 THEN
    RAISE NOTICE '🔴 CRITICAL: Enable RLS on % table(s)', rls_disabled_count;
    RAISE NOTICE '   Run: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;';
  END IF;
  
  IF public_access_count > 0 THEN
    RAISE NOTICE '🔴 CRITICAL: Remove public access from % table(s)', public_access_count;
    RAISE NOTICE '   Run: REVOKE ALL ON table_name FROM public;';
  END IF;
  
  IF missing_trigger_count = 0 THEN
    RAISE NOTICE '🟡 WARNING: No user creation trigger found';
    RAISE NOTICE '   Consider adding handle_new_user() trigger';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ RECOMMENDED ACTIONS:';
  RAISE NOTICE '   1. Review all policies marked as USING (true)';
  RAISE NOTICE '   2. Ensure service_role access is intentional';
  RAISE NOTICE '   3. Test authentication flow end-to-end';
  RAISE NOTICE '   4. Regular security audits (monthly)';
  RAISE NOTICE '   5. Monitor for unauthorized access patterns';
END $$;

-- SECTION 11: Final Security Score
-- =============================================================================
DO $$
DECLARE
  total_tables INTEGER;
  rls_enabled_tables INTEGER;
  security_score DECIMAL;
BEGIN
  SELECT COUNT(*) INTO total_tables
  FROM pg_tables
  WHERE schemaname = 'public';
  
  SELECT COUNT(*) INTO rls_enabled_tables
  FROM pg_tables
  WHERE schemaname = 'public' AND rowsecurity = true;
  
  IF total_tables > 0 THEN
    security_score := (rls_enabled_tables::DECIMAL / total_tables::DECIMAL) * 100;
  ELSE
    security_score := 0;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '📊 SECURITY SCORE SUMMARY';
  RAISE NOTICE '=========================';
  RAISE NOTICE 'Tables with RLS: % / %', rls_enabled_tables, total_tables;
  RAISE NOTICE 'Security Score: %% (%)', ROUND(security_score, 1), 
    CASE 
      WHEN security_score >= 90 THEN '🟢 EXCELLENT'
      WHEN security_score >= 70 THEN '🟡 GOOD'
      WHEN security_score >= 50 THEN '🟠 FAIR'
      ELSE '🔴 POOR'
    END;
  RAISE NOTICE '';
  RAISE NOTICE '🏁 AUDIT COMPLETED AT %', NOW();
  RAISE NOTICE '';
END $$;