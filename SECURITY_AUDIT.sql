-- =============================================================================
-- COMPREHENSIVE SECURITY AUDIT
-- =============================================================================
-- This script audits the entire database security configuration
-- =============================================================================

-- ===== SECTION 1: RLS STATUS =====
SELECT '===== RLS STATUS =====' as section;

SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'companies', 'campaigns', 'user_permissions', 'security_events')
ORDER BY tablename;

-- ===== SECTION 2: POLICY COUNT =====
SELECT '===== POLICY COUNT =====' as section;

SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ===== SECTION 3: DETAILED POLICIES =====
SELECT '===== PROFILES POLICIES =====' as section;

SELECT
  policyname as policy_name,
  cmd as operation,
  CASE WHEN roles::text[] = '{authenticated}' THEN 'authenticated'
       WHEN roles::text[] = '{service_role}' THEN 'service_role'
       ELSE roles::text END as role,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅ Permissive' ELSE 'Restrictive' END as type
FROM pg_policies
WHERE tablename = 'profiles'
  AND schemaname = 'public'
ORDER BY policyname;

SELECT '===== COMPANIES POLICIES =====' as section;

SELECT
  policyname as policy_name,
  cmd as operation,
  CASE WHEN roles::text[] = '{authenticated}' THEN 'authenticated'
       WHEN roles::text[] = '{service_role}' THEN 'service_role'
       ELSE roles::text END as role,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅ Permissive' ELSE 'Restrictive' END as type
FROM pg_policies
WHERE tablename = 'companies'
  AND schemaname = 'public'
ORDER BY policyname;

-- ===== SECTION 4: USER ROLES DISTRIBUTION =====
SELECT '===== USER ROLES =====' as section;

SELECT
  role,
  COUNT(*) as user_count,
  CASE
    WHEN role IN ('super_admin', 'admin') THEN '🔴 Admin Access'
    WHEN role = 'agency_owner' THEN '🟡 Company Admin'
    ELSE '🟢 Regular User'
  END as access_level
FROM public.profiles
GROUP BY role
ORDER BY
  CASE
    WHEN role = 'super_admin' THEN 1
    WHEN role = 'admin' THEN 2
    WHEN role = 'agency_owner' THEN 3
    ELSE 4
  END;

-- ===== SECTION 5: ACCOUNT STATUS =====
SELECT '===== ACCOUNT STATUS =====' as section;

SELECT
  account_status,
  COUNT(*) as count,
  CASE
    WHEN account_status = 'active' THEN '✅ Active'
    WHEN account_status = 'suspended' THEN '⛔ Suspended'
    WHEN account_status = 'pending_verification' THEN '⏳ Pending'
    ELSE '❓ Unknown'
  END as status_icon
FROM public.profiles
GROUP BY account_status
ORDER BY count DESC;

-- ===== SECTION 6: EMAIL VERIFICATION =====
SELECT '===== EMAIL VERIFICATION =====' as section;

SELECT
  CASE WHEN email_verified THEN 'Verified' ELSE 'Unverified' END as email_status,
  COUNT(*) as user_count
FROM public.profiles
GROUP BY email_verified;

-- ===== SECTION 7: RECENT SECURITY EVENTS =====
SELECT '===== RECENT SECURITY EVENTS (Last 10) =====' as section;

SELECT
  event_type,
  severity,
  description,
  created_at
FROM public.security_events
ORDER BY created_at DESC
LIMIT 10;

-- ===== SECTION 8: AUTH TRIGGERS =====
SELECT '===== AUTH TRIGGERS =====' as section;

SELECT
  trigger_name,
  event_manipulation as trigger_event,
  action_timing as timing,
  CASE
    WHEN trigger_name LIKE '%user%' THEN '✅ User Trigger'
    ELSE 'Other'
  END as type
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- ===== SECTION 9: TOKEN STATUS =====
SELECT '===== TOKEN COLUMNS STATUS =====' as section;

SELECT
  COUNT(*) as total_users,
  COUNT(CASE WHEN confirmation_token = '' THEN 1 END) as empty_conf_tokens,
  COUNT(CASE WHEN confirmation_token IS NULL THEN 1 END) as null_conf_tokens,
  COUNT(CASE WHEN recovery_token = '' THEN 1 END) as empty_recovery_tokens,
  COUNT(CASE WHEN recovery_token IS NULL THEN 1 END) as null_recovery_tokens
FROM auth.users;

-- ===== SECTION 10: SECURITY GAPS =====
SELECT '===== POTENTIAL SECURITY GAPS =====' as section;

-- Check for users without profiles
SELECT
  'Users without profiles' as gap_type,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

-- Check for profiles without companies (where company_id is set but company doesn't exist)
SELECT
  'Profiles with invalid company_id' as gap_type,
  COUNT(*) as count
FROM public.profiles p
WHERE p.company_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.companies c WHERE c.id = p.company_id)

UNION ALL

-- Check for unverified emails
SELECT
  'Unverified emails' as gap_type,
  COUNT(*) as count
FROM public.profiles
WHERE email_verified = false

UNION ALL

-- Check for suspended accounts
SELECT
  'Suspended accounts' as gap_type,
  COUNT(*) as count
FROM public.profiles
WHERE account_status = 'suspended';

-- ===== FINAL SUMMARY =====
DO $$
DECLARE
  profiles_rls boolean;
  companies_rls boolean;
  profile_policy_count int;
  company_policy_count int;
  admin_count int;
  total_users int;
BEGIN
  -- Check RLS status
  SELECT rowsecurity INTO profiles_rls FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public';
  SELECT rowsecurity INTO companies_rls FROM pg_tables WHERE tablename = 'companies' AND schemaname = 'public';

  -- Count policies
  SELECT COUNT(*) INTO profile_policy_count FROM pg_policies WHERE tablename = 'profiles';
  SELECT COUNT(*) INTO company_policy_count FROM pg_policies WHERE tablename = 'companies';

  -- Count admins and total users
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role IN ('super_admin', 'admin', 'agency_owner');
  SELECT COUNT(*) INTO total_users FROM public.profiles;

  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '         SECURITY AUDIT SUMMARY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Status:';
  RAISE NOTICE '  Profiles: %', CASE WHEN profiles_rls THEN '✅ ENABLED' ELSE '❌ DISABLED' END;
  RAISE NOTICE '  Companies: %', CASE WHEN companies_rls THEN '✅ ENABLED' ELSE '❌ DISABLED' END;
  RAISE NOTICE '';
  RAISE NOTICE 'Policy Count:';
  RAISE NOTICE '  Profiles: % policies', profile_policy_count;
  RAISE NOTICE '  Companies: % policies', company_policy_count;
  RAISE NOTICE '';
  RAISE NOTICE 'User Stats:';
  RAISE NOTICE '  Total Users: %', total_users;
  RAISE NOTICE '  Admin Users: % (%.1f%%)', admin_count, (admin_count::numeric / NULLIF(total_users, 0) * 100);
  RAISE NOTICE '';
  RAISE NOTICE 'Security Level: %',
    CASE
      WHEN profiles_rls AND companies_rls AND profile_policy_count >= 4 AND company_policy_count >= 4
        THEN '🟢 EXCELLENT - Fully Secured'
      WHEN profiles_rls AND companies_rls
        THEN '🟡 GOOD - RLS Enabled'
      ELSE '🔴 POOR - Security Issues Detected'
    END;
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
END $$;
