# Security Restoration & Testing Checklist
## October 13, 2025

---

## Phase 1: Re-enable Security (DATABASE)

### Step 1: Run RESTORE_SECURITY.sql
- [ ] Open Supabase SQL Editor
- [ ] Copy and paste entire RESTORE_SECURITY.sql
- [ ] Execute the script
- [ ] Verify output shows: "✅ RLS RE-ENABLED"
- [ ] Confirm all policies are created

**Expected Result:**
- RLS enabled on `profiles` and `companies` tables
- 5 policies on `profiles` table
- 6 policies on `companies` table

---

## Phase 2: Deploy Route Protection (CODE)

### Step 2: Commit and Deploy Middleware
```bash
git add src/middleware.ts
git commit -m "feat: add authentication middleware for route protection"
git push origin main
```

- [ ] Middleware file created
- [ ] Code committed to git
- [ ] Pushed to GitHub
- [ ] Vercel deployment triggered
- [ ] Deployment completed successfully

**Expected Result:**
- Middleware protects all routes except public ones
- Unauthenticated users redirected to /login
- Authenticated users can't access /login or /signup

---

## Phase 3: Security Audit

### Step 3: Run SECURITY_AUDIT.sql
- [ ] Open Supabase SQL Editor
- [ ] Run SECURITY_AUDIT.sql
- [ ] Review all sections of the audit
- [ ] Verify "Security Level: 🟢 EXCELLENT"

**What to Check:**
- ✅ RLS enabled on all critical tables
- ✅ Policies count: profiles (5), companies (6)
- ✅ No users without profiles
- ✅ No invalid company references
- ✅ All token columns handled properly

---

## Phase 4: Functional Testing

### Test 1: Unauthenticated User Access
- [ ] Open incognito window
- [ ] Try to access https://pulsebridge.ai/dashboard
- [ ] **Expected:** Redirected to /login
- [ ] Try to access https://pulsebridge.ai/admin
- [ ] **Expected:** Redirected to /login
- [ ] Access https://pulsebridge.ai (homepage)
- [ ] **Expected:** Loads successfully
- [ ] Access https://pulsebridge.ai/pricing
- [ ] **Expected:** Loads successfully

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 2: Regular User Login
- [ ] Go to https://pulsebridge.ai/login
- [ ] Login with test@example.com / Test123456!
- [ ] **Expected:** Redirected to /dashboard
- [ ] Dashboard loads successfully
- [ ] Try to access https://pulsebridge.ai/admin
- [ ] **Expected:** Redirected to /dashboard (blocked from admin)
- [ ] Try to access /campaigns, /reports
- [ ] **Expected:** All load successfully

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 3: Admin User Access
- [ ] Logout from test user
- [ ] Login with devtestai.os@gmail.com / TestPassword123!
- [ ] **Expected:** Redirected to /dashboard
- [ ] Access https://pulsebridge.ai/admin
- [ ] **Expected:** Admin dashboard loads
- [ ] Can see "User Management" section
- [ ] Can see all users in the list

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 4: User Invite Flow (CRITICAL)
- [ ] Login as admin (devtestai.os@gmail.com)
- [ ] Go to /admin
- [ ] Click "Invite User" button
- [ ] Fill in:
  - Email: newuser@test.com
  - Role: campaign_manager
  - Company: (select or leave blank)
- [ ] Click "Send Invitation"
- [ ] **Expected:** Success message
- [ ] Check email for invitation
- [ ] Click invitation link
- [ ] Set password
- [ ] **Expected:** Can login with new credentials
- [ ] New user can access /dashboard
- [ ] New user CANNOT access /admin

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 5: Role-Based Access Control
- [ ] Login as super_admin
- [ ] **Expected:** Can access all routes
- [ ] **Expected:** Can manage all users
- [ ] **Expected:** Can manage all companies
- [ ] Logout and login as campaign_manager
- [ ] **Expected:** Can access /dashboard, /campaigns
- [ ] **Expected:** CANNOT access /admin
- [ ] **Expected:** Can only see own profile data

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 6: Data Isolation (RLS Verification)
- [ ] Login as regular user (test@example.com)
- [ ] Open browser DevTools → Console
- [ ] Try manual query:
```javascript
const { data } = await supabase.from('profiles').select('*');
console.log(data);
```
- [ ] **Expected:** Only sees own profile
- [ ] Try to access another user's profile by ID
- [ ] **Expected:** Returns empty or error
- [ ] Login as admin
- [ ] Repeat query
- [ ] **Expected:** Sees all profiles

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 7: Public Routes (No Auth Required)
- [ ] Logout completely
- [ ] Access these routes without authentication:
  - [ ] / (homepage)
  - [ ] /pricing
  - [ ] /enterprise-contact
  - [ ] /signup
  - [ ] /login
- [ ] **Expected:** All load without redirect
- [ ] Try to signup with new@example.com
- [ ] **Expected:** Signup flow works OR redirects to trial signup

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 8: Session Management
- [ ] Login successfully
- [ ] Close browser completely
- [ ] Reopen and go to https://pulsebridge.ai/dashboard
- [ ] **Expected:** Still logged in (session persisted)
- [ ] Clear browser cookies
- [ ] Refresh dashboard
- [ ] **Expected:** Redirected to login

**Status:** ⬜ Pass / ⬜ Fail

---

## Phase 5: Security Gaps Check

### Gap Analysis
Run through this checklist:

- [ ] **No users without profiles** (verified in audit)
- [ ] **No profiles with invalid company_id** (verified in audit)
- [ ] **All admin accounts are legitimate** (review admin list)
- [ ] **No suspended accounts are still active** (check account_status)
- [ ] **All confirmation tokens handled** (no NULL values)
- [ ] **RLS enabled on all critical tables**
- [ ] **Middleware protects all routes**
- [ ] **No hardcoded credentials in code**
- [ ] **Environment variables secured**

---

## Phase 6: Performance Check

- [ ] Dashboard loads in < 3 seconds
- [ ] Login completes in < 2 seconds
- [ ] No console errors on any page
- [ ] No failed network requests
- [ ] Sidebar navigation works smoothly
- [ ] All navigation links work

---

## Phase 7: Commit Final Changes

```bash
# Commit middleware and any other changes
git add -A
git commit -m "feat: restore full security with RLS policies and route protection

- Re-enabled RLS on profiles and companies tables
- Added secure RLS policies for authenticated users and admins
- Implemented middleware for route protection
- Added comprehensive security audit scripts
- All tests passing

🔒 Security Status: LOCKED DOWN
✅ Login: WORKING
✅ Route Protection: ACTIVE
✅ RLS: ENABLED
✅ Admin Access: RESTRICTED

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

- [ ] Changes committed
- [ ] Pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] Production site updated

---

## Issues Found

### Issue Log
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |

---

## Final Sign-Off

- [ ] All tests passing
- [ ] No security gaps identified
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for user testing

**Signed off by:** _________________
**Date:** _________________

---

## Next Steps

After all checks pass:

1. **User Testing Phase**
   - Invite real test users
   - Gather feedback on flow
   - Monitor for errors

2. **Feature Testing**
   - Test campaign creation
   - Test analytics
   - Test integrations

3. **Production Monitoring**
   - Monitor Supabase logs
   - Check error rates
   - Review user activity

---

## Quick Reference

**Test Users:**
- Admin: devtestai.os@gmail.com / TestPassword123!
- Regular: test@example.com / Test123456!

**Important URLs:**
- Login: https://pulsebridge.ai/login
- Simple Login: https://pulsebridge.ai/simple-login
- Admin: https://pulsebridge.ai/admin
- Dashboard: https://pulsebridge.ai/dashboard

**Database:**
- Supabase Project: devtestai.os@gmail.com's Project
- Environment: Production
- RLS: ✅ ENABLED

---

## Emergency Rollback

If something goes wrong:

```sql
-- Disable RLS (emergency only)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
```

```bash
# Revert middleware
git revert HEAD
git push origin main
```
