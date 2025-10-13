# Regression Fix Plan - October 13, 2025

## Issues Identified

### 1. CRITICAL: Duplicate Navbar on All Pages
- **Root Cause**: Root layout renders `<Navigation />` AND 35+ pages also render `<NavigationTabs />`
- **Impact**: Two navbars stacked, routes overflow off screen
- **Severity**: HIGH - Blocks all navigation

### 2. CRITICAL: Login Not Working
- **Root Cause**: Database schema issues, RLS blocking queries
- **Impact**: Cannot log in with valid credentials
- **Severity**: HIGH - Blocks application access

### 3. WARNING: Database Security
- **Root Cause**: RLS disabled on profiles table for testing
- **Impact**: No row-level security on user data
- **Severity**: MEDIUM - Security risk

## Fix Plan

### Phase 1: Fix Duplicate Navbar (30 minutes)

**Files to Modify** (Remove NavigationTabs import and usage):
```
1. src/app/(platform)/dashboard/page.tsx - LINE 15, 441
2. src/app/(platform)/dashboard/enhanced/page.tsx - LINE 6
3. src/app/(platform)/admin/page.tsx - LINE 14
4. src/app/(platform)/analytics/page.tsx - LINE 43
5. src/app/(platform)/reports/page.tsx - LINE 28
6. src/app/(platform)/performance/page.tsx - LINE 15
7. src/app/(platform)/status/page.tsx - LINE 5
8. src/app/(platform)/scheduler/page.tsx - LINE 22
9. src/app/(platform)/task-master/page.tsx - LINE 6
10. src/app/(platform)/analytics/performance/page.tsx - LINE 11
11. src/app/(platform)/analytics/report-builder/page.tsx - LINE 4
12. src/app/(platform)/dashboard/phase1/page.tsx - LINE 11
13. src/app/(platform)/performance/monitoring/page.tsx - LINE 12
14. src/app/(platform)/performance/enhanced/page.tsx - LINE 12
15. src/app/(marketing)/campaigns/templates/page.tsx - LINE 5
16. src/app/(marketing)/leads/page.tsx - LINE 5
17. src/app/(marketing)/content-suite/page.tsx - LINE 5
18. src/app/(ai)/ai/predictive-analytics/page.tsx - LINE 10
19. src/app/(ai)/ai/intelligent-alerts/page.tsx - LINE 10
20. src/app/(ai)/ai/performance-advisor/page.tsx - LINE 12
21. src/app/(ai)/ai/recommendation-engine/page.tsx - LINE 10
22. src/app/(public)/onboarding/page.tsx - LINE 6
23. src/app/(public)/pricing/page.tsx - LINE 11
24. src/app/(public)/enterprise-contact/page.tsx - LINE 11
25. src/app/(other)/optimization/page.tsx - LINE 26
26. src/app/(collab)/collaboration/page.tsx
27. src/app/(collab)/team-collaboration/page.tsx
28. src/app/(marketing)/social-media/page.tsx
29. src/app/(platform)/integrations/page.tsx
```

**Loading Components** (Also need fix):
```
- src/app/(marketing)/campaigns/loading.tsx
- src/app/(marketing)/leads/loading.tsx
- src/app/(platform)/reports/loading.tsx
- src/app/(platform)/analytics/performance/loading.tsx
- src/app/(platform)/analytics/roi/loading.tsx
- src/app/(platform)/dashboard/loading.tsx
```

### Phase 2: Fix Database Schema (15 minutes)

**Step 1: Verify Tables Exist**
```sql
-- Check profiles table
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'profiles'
);

-- Check companies table
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'companies'
);
```

**Step 2: Re-enable RLS with Proper Policies**
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.profiles;

-- Create proper policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

**Step 3: Create Profile Trigger (if missing)**
```sql
-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, account_status)
  VALUES (
    NEW.id,
    NEW.email,
    'campaign_manager',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Phase 3: Test Login (10 minutes)

**Test Credentials:**
- Email: `devtestai.os@gmail.com`
- Password: `TestPassword123!`

**Test URLs:**
1. https://pulsebridge.ai/simple-login (simplified auth)
2. https://pulsebridge.ai/login (full auth with context)

**Expected Behavior:**
- Login successful
- Redirects to /dashboard
- No duplicate navbars
- Navigation works correctly

### Phase 4: Verify No Regressions (10 minutes)

**Checklist:**
- [ ] Login works at /simple-login
- [ ] Login works at /login
- [ ] Dashboard loads without duplicate navbar
- [ ] All navigation links work
- [ ] UnifiedSidebar works
- [ ] Role-based access control works (admin can access /admin)
- [ ] User profile loads correctly

## Rollback Plan

If fixes cause issues:

1. **Navbar Issue**:
   - Revert root layout to not render Navigation globally
   - Keep NavigationTabs in individual pages

2. **Database Issue**:
   - Disable RLS again: `ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;`
   - Continue with simple auth testing

3. **Auth Issue**:
   - Use /simple-login exclusively
   - Debug EnhancedAuthContext separately

## Risk Assessment

- **Navbar Fix**: LOW RISK - Simple import removal
- **Database Fix**: MEDIUM RISK - RLS changes could block legitimate queries
- **Auth Testing**: LOW RISK - Non-destructive testing

## Timeline

- Navbar Fix: 30 minutes
- Database Fix: 15 minutes
- Testing: 10 minutes
- Verification: 10 minutes
- **Total: ~65 minutes**

## Success Criteria

1. ✅ Single navbar on all pages
2. ✅ Login works with test credentials
3. ✅ Dashboard loads correctly
4. ✅ Navigation works
5. ✅ RLS properly configured
6. ✅ No console errors
