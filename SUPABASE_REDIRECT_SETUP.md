# Supabase Redirect URL Configuration

## Problem
Password reset emails from Supabase are redirecting to the landing page instead of the reset-password page.

## Solution
Configure the redirect URL in Supabase Dashboard.

## Steps to Fix

### 1. Go to Supabase Dashboard
- URL: https://supabase.com/dashboard
- Select your project

### 2. Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Look for "Redirect URLs" or "Site URL" section
3. Add the following URLs:

**Site URL:**
```
https://pulsebridge.ai
```

**Redirect URLs (Add all of these):**
```
https://pulsebridge.ai/reset-password
https://pulsebridge.ai/auth/callback
https://pulsebridge.ai/login
http://localhost:3000/reset-password
http://localhost:3000/auth/callback
```

### 3. Email Templates
1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Make sure the confirmation URL uses this format:
```
{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery
```

Or use the default Supabase magic link:
```
{{ .ConfirmationURL }}
```

### 4. Test the Setup
1. Request a password reset for: `devtestai.os@gmail.com`
2. Check the email
3. Click the link - it should now take you to `/reset-password`
4. Set your new password: `TestPassword123!`
5. You'll be redirected to `/login`
6. Login with the new credentials

## Alternative: Manual Password Reset

If you don't want to wait for email setup:

### Option 1: Use Supabase Dashboard (Easiest)
1. Go to **Authentication** → **Users**
2. Find user: `devtestai.os@gmail.com`
3. Click **"..."** menu → **"Reset Password"**
4. Choose **"Set password manually"**
5. Enter: `TestPassword123!`
6. Save
7. Go to https://pulsebridge.ai/simple-login
8. Login with: devtestai.os@gmail.com / TestPassword123!

### Option 2: Use SQL (Advanced)
⚠️ **Warning**: This requires the password to be hashed. It's better to use the Dashboard method above.

## Current Status

✅ Created `/reset-password` page
✅ Added to public routes in middleware
⬜ Need to configure Supabase redirect URLs
⬜ Need to test password reset flow

## Files Modified
- `src/app/(auth)/reset-password/page.tsx` (NEW)
- `src/middleware.ts` (added /reset-password to PUBLIC_ROUTES)
