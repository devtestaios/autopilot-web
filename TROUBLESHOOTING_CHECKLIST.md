# 🔍 Troubleshooting Checklist - Phase 1 Verification

**Date:** October 11, 2025
**Status:** Investigating database connection issues

---

## ✅ What's Working

1. **Backend Deployed:** https://autopilot-api-1.onrender.com ✅
2. **Backend Health:** Operational, returning 200 OK ✅
3. **Backend Code:** Supabase connection logic fixed ✅
4. **Frontend Deployed:** https://autopilot-web-rho.vercel.app ✅
5. **API Routes Migrated:** 10/30 routes connected to Supabase ✅
6. **RLS Policies:** Set to "Allow all" (no blocking) ✅

---

## ⚠️ Issues Found & Fixes

### **Issue 1: Google Ads Customer ID Format ❌**

**Error in Render Logs:**
```
ERROR: Failed to initialize Google Ads client: The specified login customer ID is invalid.
It must be a ten digit number represented as a string, i.e. '1234567890'
```

**Root Cause:** Customer ID has dashes instead of being 10 consecutive digits

**Fix Applied (Local):**
- ✅ Updated `.env.local` from `879-724-5319` to `8797245319`

**Still Required (Render):**
1. Go to: https://dashboard.render.com
2. Navigate to: `autopilot-api-1` service
3. Go to: **Environment** tab
4. Find: `GOOGLE_ADS_CUSTOMER_ID`
5. Update to: `8797245319` (remove dashes)
6. Click: **Save Changes** (auto-triggers redeploy)

---

### **Issue 2: Vercel Environment Variables (MOST LIKELY ISSUE) ⚠️**

**Problem:** Frontend API routes run on Vercel, NOT Render. They need Supabase credentials in Vercel dashboard.

**Current State:** Unknown - need to verify these are set in Vercel

**Required Variables in Vercel:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://aggorhmzuhdirterhyej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ29yaG16dWhkaXJ0ZXJoeWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDU0MTAsImV4cCI6MjA3MTM4MTQxMH0.3eFQjOK_P2fV3UcbH6BC_OB5UcvJPf43Eb9ze8gQyAc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ29yaG16dWhkaXJ0ZXJoeWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwNTQxMCwiZXhwIjoyMDcxMzgxNDEwfQ.tHazY5biN1jekA_zR2CNpL-o1-HoKiOoxSwExBZTtMg
```

**How to Verify/Add:**

1. Go to: https://vercel.com/dashboard
2. Find your project: `autopilot-web-rho`
3. Go to: **Settings** → **Environment Variables**
4. Verify these 3 variables exist with correct values
5. If missing or incorrect, add/update them
6. **Important:** Set for all environments (Production, Preview, Development)
7. After saving, trigger new deployment:
   - Go to **Deployments** tab
   - Click **...** menu on latest deployment
   - Select **Redeploy**

---

## 🧪 Testing Sequence

Once environment variables are verified, test in this order:

### **Test 1: Frontend API Route Health**

```bash
# Test email contacts endpoint (should require auth)
curl -X GET "https://autopilot-web-rho.vercel.app/api/email-marketing/contacts" \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized (means route is working, just needs auth)
# Bad: 500 Internal Server Error (means Supabase connection issue)
```

### **Test 2: Login & Manual UI Test**

1. **Login:** https://autopilot-web-rho.vercel.app/login
2. **Navigate to:** Email Marketing → Contacts
3. **Create Test Contact:**
   - Email: `test-phase1@example.com`
   - First Name: Test
   - Last Name: User
   - Click: **Save** or **Add Contact**
4. **Check for Success:**
   - Contact appears in list immediately
   - No console errors (F12 → Console tab)
5. **Refresh Page (Cmd+R or F5)**
6. **Verify:** Contact still appears ✅

### **Test 3: Verify in Supabase**

1. Go to: https://app.supabase.com
2. Select your project
3. Go to: **Table Editor**
4. Open: `email_subscribers` table
5. **Verify:** Your test contact exists with:
   - Correct email
   - Your user_id populated
   - created_at timestamp
   - updated_at timestamp

### **Test 4: Test Email Templates**

Repeat same process for:
- Navigate to: **Email Marketing** → **Templates**
- Create test template
- Verify persistence after refresh
- Check `email_templates` table in Supabase

---

## 🔧 Diagnostic Commands

### **Check Render Backend Connection:**

```bash
# Test backend health
curl https://autopilot-api-1.onrender.com/

# Expected output:
# {"service":"PulseBridge.ai Backend","status":"operational","version":"1.0.0"}
```

### **Check Render Logs for Supabase:**

1. Go to: https://dashboard.render.com
2. Select: `autopilot-api-1`
3. Click: **Logs** tab
4. Search for: `Supabase`
5. **Look for:**
   ```
   ✅ Supabase client initialized successfully
   Connected to: https://aggorhmzuhdirterhyej...
   ```
6. **Should NOT see:**
   ```
   ❌ Supabase environment variables not found
   WARNING: SUPABASE_URL: False
   ```

### **Check Vercel Deployment Logs:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click: **Deployments** tab
4. Click on latest deployment
5. Check **Build Logs** for any errors
6. Check **Function Logs** for runtime errors

---

## 📊 Expected Results

### **If Everything Works:**

- ✅ Contact created via UI
- ✅ Contact persists after refresh
- ✅ Contact visible in Supabase table
- ✅ No console errors
- ✅ No 500 errors in network tab
- ✅ User ID populated in database

### **If Supabase Connection Fails:**

Common errors in browser console:
```
TypeError: Cannot read properties of null (reading 'from')
Failed to fetch contacts
500 Internal Server Error
```

**Solution:** Verify Vercel environment variables

---

## 🎯 Success Criteria

Before moving to Phase 2, verify:

- [x] Backend health endpoint operational
- [ ] **Vercel environment variables verified**
- [ ] **Google Ads customer ID fixed in Render**
- [ ] Email contacts API creates data successfully
- [ ] Email contacts data persists after refresh
- [ ] Email contacts visible in Supabase
- [ ] Email templates API creates data successfully
- [ ] Email templates data persists after refresh
- [ ] Email templates visible in Supabase
- [ ] No authentication errors
- [ ] No database connection errors

---

## 📝 Next Steps After Verification

**If Tests Pass:**
- Proceed to Phase 2: Connect remaining 20 API routes
- Target: Social media routes, billing routes, analytics

**If Tests Fail:**
- Debug based on error messages
- Check Vercel logs for specific errors
- Verify Supabase RLS policies if 403 errors
- Check browser console for client-side errors

---

## 🆘 Common Issues & Solutions

### **Problem: 401 Unauthorized**
**Cause:** Not logged in or session expired
**Solution:** Logout and login again

### **Problem: 500 Internal Server Error**
**Cause:** Supabase connection failed in API route
**Solution:** Check Vercel environment variables

### **Problem: 403 Forbidden**
**Cause:** RLS policy blocking access
**Solution:** Check `04_rls_policies.sql` - should be "Allow all"

### **Problem: Data not persisting**
**Cause:** API route still using mock data
**Solution:** Verify route file contains `createRouteHandlerClient`

### **Problem: No data in Supabase**
**Cause:** POST request not reaching database
**Solution:** Check network tab for successful POST (201 Created)

---

**Status:** Ready for verification testing
**Last Updated:** October 11, 2025, 03:10 AM UTC
