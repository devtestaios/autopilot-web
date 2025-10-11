# 🔐 Authentication Fix Guide

**Date:** October 11, 2025
**Status:** Critical fixes applied, user action required

---

## 🚨 Issues Found

### **1. Supabase Client Not Working** ✅ FIXED
**Problem:** Supabase client only initialized in browser (`typeof window !== 'undefined'`), causing server-side auth to fail

**Fix Applied:**
- Updated `/src/lib/supabase.ts` to work both client-side and server-side
- Now properly initializes in all environments where env vars exist
- Added better logging for debugging

**Status:** ✅ Code fixed, will work after deployment

---

### **2. Admin Password Mismatch** ✅ FIXED
**Problem:** Admin login expected `PulseBridge2025!` but user said `PulseBridge2025`

**Fix Applied:**
- Updated `/src/app/adminlogin/page.tsx` to accept both passwords
- Now accepts: `PulseBridge2025` OR `PulseBridge2025!`

**Status:** ✅ Code fixed

---

### **3. No Users in Supabase** ⚠️ USER ACTION REQUIRED
**Problem:** Admin and demo users don't exist in Supabase `auth.users` table

**Solution:** Create users manually in Supabase Dashboard

---

## 📋 Required Actions (Step-by-Step)

### **Step 1: Create Users in Supabase Dashboard**

1. **Go to Supabase Dashboard:**
   - URL: https://app.supabase.com
   - Select your project

2. **Navigate to Authentication:**
   - Left sidebar → **Authentication** → **Users**

3. **Create Admin User:**
   - Click: **Add user** → **Create new user**
   - Email: `admin@pulsebridge.ai`
   - Password: `PulseBridge2025`
   - ✅ Check: "Auto Confirm User" (bypasses email verification)
   - Click: **Create user**
   - **COPY THE USER ID** (you'll need it next)

4. **Create Demo User:**
   - Click: **Add user** → **Create new user**
   - Email: `demo@pulsebridge.ai`
   - Password: `demo123`
   - ✅ Check: "Auto Confirm User"
   - Click: **Create user**
   - **COPY THE USER ID**

---

### **Step 2: Create User Profiles in Database**

1. **Open SQL Editor:**
   - Left sidebar → **SQL Editor**
   - Click: **New query**

2. **Run This SQL** (replace the UUIDs with actual IDs from Step 1):

```sql
-- First, create companies
INSERT INTO public.companies (
  name,
  slug,
  subscription_tier,
  account_status,
  user_limit
) VALUES
  ('PulseBridge Administration', 'pulsebridge-admin', 'enterprise_plus', 'active', 9999),
  ('Demo Company', 'demo-company', 'professional_agency', 'active', 10)
ON CONFLICT (slug) DO NOTHING
RETURNING id, name;

-- Note the company IDs from above, then create profiles
-- Replace these UUIDs with actual values:
-- ADMIN_USER_ID = ID copied from admin user creation
-- DEMO_USER_ID = ID copied from demo user creation
-- ADMIN_COMPANY_ID = ID from first company (pulsebridge-admin)
-- DEMO_COMPANY_ID = ID from second company (demo-company)

INSERT INTO public.profiles (
  id,
  email,
  username,
  display_name,
  first_name,
  last_name,
  company_id,
  role,
  account_status,
  subscription_tier,
  email_verified
) VALUES
  (
    'ADMIN_USER_ID'::uuid, -- Replace with actual admin auth.users ID
    'admin@pulsebridge.ai',
    'admin',
    'PulseBridge Administrator',
    'Admin',
    'User',
    'ADMIN_COMPANY_ID'::uuid, -- Replace with actual company ID
    'super_admin',
    'active',
    'enterprise_plus',
    TRUE
  ),
  (
    'DEMO_USER_ID'::uuid, -- Replace with actual demo auth.users ID
    'demo@pulsebridge.ai',
    'demo',
    'Demo User',
    'Demo',
    'User',
    'DEMO_COMPANY_ID'::uuid, -- Replace with actual company ID
    'account_manager',
    'active',
    'professional_agency',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  email_verified = TRUE,
  account_status = 'active',
  updated_at = NOW();

-- Grant admin permissions
INSERT INTO public.user_permissions (user_id, resource, action, is_active)
SELECT
  'ADMIN_USER_ID'::uuid, -- Replace with actual admin user ID
  resource,
  action,
  TRUE
FROM (
  VALUES
    ('*', 'admin'),
    ('users', 'admin'),
    ('companies', 'admin'),
    ('campaigns', 'admin'),
    ('reports', 'admin')
) AS permissions(resource, action)
ON CONFLICT (user_id, resource, action) DO UPDATE SET is_active = TRUE;
```

---

### **Step 3: Deploy Code Changes**

The code fixes need to be deployed:

**Option A: Git Commit & Push (Recommended)**
```bash
cd /Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web
git add .
git commit -m "fix: Resolve authentication issues - Supabase client and admin login"
git push origin main
```

**Option B: Vercel Manual Redeploy**
1. Go to: https://vercel.com/dashboard
2. Find project: `autopilot-web-rho`
3. Deployments → Latest deployment → Redeploy

---

### **Step 4: Test Authentication**

#### **Test 1: Admin Login**
1. Go to: https://autopilot-web-rho.vercel.app/adminlogin
2. Enter:
   - Email: `admin@pulsebridge.ai`
   - Password: `PulseBridge2025`
3. Click: **Sign In**
4. **Expected:** Redirect to `/admin` dashboard

#### **Test 2: Regular Login**
1. Go to: https://autopilot-web-rho.vercel.app/login
2. Enter:
   - Email: `admin@pulsebridge.ai` or `demo@pulsebridge.ai`
   - Password: `PulseBridge2025` or `demo123`
3. Click: **Sign in**
4. **Expected:** Redirect to `/dashboard`

#### **Test 3: Demo Auto-Login**
1. Go to: https://autopilot-web-rho.vercel.app/login
2. Click: **🚀 Auto Login & Access Dashboard**
3. **Expected:** Automatically login and redirect to dashboard

#### **Test 4: Signup**
1. Go to: https://autopilot-web-rho.vercel.app/signup
2. Fill in new user details
3. Submit
4. **Expected:** Account created, redirect to dashboard

---

## 🎯 Beta User System

You mentioned wanting to set test/beta users who can create accounts without paying.

### **Current Setup:**

The profile schema already has fields for this:
- `account_status`: Can be 'trial', 'active', 'suspended'
- `subscription_tier`: Can be 'trial', 'solo_professional', etc.

### **To Enable Beta Users:**

**Option 1: Manual in Database**
```sql
-- Mark a user as beta/test user
UPDATE public.profiles
SET
  account_status = 'active',
  subscription_tier = 'professional_agency',
  -- Add a custom field to track beta users
  preferences = jsonb_set(
    preferences,
    '{beta_user}',
    'true'
  )
WHERE email = 'beta-user@example.com';
```

**Option 2: Admin Dashboard Feature**
Create an admin UI to:
1. View all users
2. Mark users as beta/test
3. Set their subscription tier without payment
4. Bypass payment requirements

Would you like me to implement the admin dashboard feature for managing beta users?

---

## 📊 Verification Checklist

After completing Steps 1-4:

- [ ] Admin user exists in Supabase Authentication
- [ ] Demo user exists in Supabase Authentication
- [ ] Admin profile exists in `public.profiles` table
- [ ] Demo profile exists in `public.profiles` table
- [ ] Companies created in `public.companies` table
- [ ] Admin permissions granted in `public.user_permissions`
- [ ] Code deployed to Vercel
- [ ] Admin login works at `/adminlogin`
- [ ] Regular login works at `/login`
- [ ] Demo auto-login works
- [ ] Signup creates new users successfully

---

## 🔧 Troubleshooting

### **Issue: "Supabase not configured" Error**

**Check:**
1. Vercel environment variables are set correctly
2. Vercel was redeployed after adding env vars
3. No typos in env var values

**Solution:**
```bash
# Verify env vars in Vercel Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://aggorhmzuhdirterhyej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Issue: "Invalid login credentials" Error**

**Check:**
1. User exists in Supabase Authentication
2. Email is confirmed (auto-confirm when creating)
3. Password is correct
4. Profile exists in `public.profiles` table

**Solution:**
- Re-create user with "Auto Confirm" checked
- Verify password matches exactly
- Check profile was created with correct user ID

---

### **Issue: Login Success but Redirect Fails**

**Check:**
1. User profile exists in database
2. `account_status` is 'active'
3. No middleware blocking access
4. Browser console for JavaScript errors

**Solution:**
- Verify profile in database
- Check browser DevTools → Console for errors
- Clear browser cache and cookies

---

### **Issue: Signup Not Working**

**Possible Causes:**
1. Supabase email confirmation required
2. Profile creation failing
3. Company creation failing

**Solution:**
1. Disable email confirmation in Supabase settings
2. Check SQL logs for profile creation errors
3. Verify company creation logic

---

## 🎉 Expected Results

After completing all steps:

✅ **Admin Login:**
- Email: `admin@pulsebridge.ai`
- Password: `PulseBridge2025`
- Access: Full admin dashboard at `/admin`
- Permissions: Super admin (all resources)

✅ **Demo Login:**
- Email: `demo@pulsebridge.ai`
- Password: `demo123`
- Access: User dashboard at `/dashboard`
- Permissions: Account manager level

✅ **New User Signup:**
- Any email can create account
- Account starts in trial mode
- Can be upgraded to beta/paid via admin dashboard

✅ **Beta Users:**
- Managed via admin dashboard (to be implemented)
- Can use full features without payment
- Marked with `beta_user: true` in preferences

---

## 🚀 Next Steps

1. **Complete Steps 1-4 above** to create users and deploy fixes
2. **Test all login methods** to verify fixes work
3. **Let me know results** - any errors or issues?
4. **Optional:** Implement admin dashboard for beta user management

---

**Status:** Awaiting user action on Steps 1-2 (creating users in Supabase)
**Estimated Time:** 10-15 minutes to complete all steps
