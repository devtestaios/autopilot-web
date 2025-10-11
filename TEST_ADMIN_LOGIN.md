# Test Admin Login Locally

## Step 1: Open local dev server
Visit: http://localhost:3001/adminlogin

## Step 2: Open browser console
**Chrome/Brave:** Command + Option + J
**Safari:** Command + Option + C
**Firefox:** Command + Option + K

## Step 3: Try logging in
Email: admin@pulsebridge.ai
Password: PulseBridge2025!

## Expected console output:
```
🔐 Starting admin login process...
📧 Email: admin@pulsebridge.ai
🔌 Supabase client exists: true
✅ Supabase client initialized, attempting login...
🔍 Auth response: { hasUser: true, hasError: false, errorMessage: undefined }
✅ User authenticated: [user-id]
🔍 Fetching user profile...
🔍 Profile response: { hasProfile: true, role: 'super_admin', status: 'active', hasError: false }
✅ Admin verification passed!
💾 Setting localStorage...
🚀 Redirecting to admin dashboard...
```

## If you see NO console output:
The button click handler is not firing. Possible causes:
1. React hydration error
2. Form preventDefault not working
3. Button component issue
4. JavaScript error blocking execution

## If you see console output but auth fails:
Check the error message in the console and in the red error box on the page.

## Common issues:

### Issue: "Supabase client not initialized"
**Fix:** Check .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

### Issue: "Invalid login credentials"
**Fix:** Run CREATE_ADMIN_USER.sql to set up admin profile

### Issue: "Profile not found"
**Fix:** Run CREATE_ADMIN_USER.sql to create the profile

### Issue: "Access denied. Admin privileges required"
**Fix:** The profile exists but role is not super_admin. Run:
```sql
UPDATE public.profiles
SET role = 'super_admin', account_status = 'active'
WHERE email = 'admin@pulsebridge.ai';
```
