# 🚀 COMPLETE RENDER DEPLOYMENT SETUP - YOUR CREDENTIALS

## ✅ Your New Instagram App Credentials
- **Instagram App ID:** `1187899253219875`
- **Instagram App Secret:** `a7d04912a36f6847993c7fe099a6b07a`

## 🎯 IMMEDIATE RENDER SETUP STEPS

### Step 1: Update Render Environment Variables
Go to [Render Dashboard](https://dashboard.render.com/) → Find your `autopilot-api-1` service → Environment tab

**COPY AND PASTE THESE EXACT VALUES:**

```bash
# Instagram/Facebook App (NEW CREDENTIALS)
NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875
INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
NEXT_PUBLIC_FACEBOOK_APP_ID=1187899253219875
FACEBOOK_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a

# Base URLs (Required)
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai

# Keep your existing Supabase credentials (DON'T CHANGE THESE)
SUPABASE_URL=your_existing_supabase_url
SUPABASE_ANON_KEY=your_existing_supabase_key
```

### Step 2: Manual Redeploy
1. After saving environment variables, go to "Deployments" tab
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete (should succeed now!)

### Step 3: Verify Deployment Health
Test these URLs after deployment:
- `https://autopilot-api-1.onrender.com/health` 
- `https://autopilot-api-1.onrender.com/health/instagram`

Expected response from `/health/instagram`:
```json
{
  "status": "healthy",
  "details": {
    "instagram_app_id_configured": true,
    "instagram_app_secret_configured": true,
    "base_url_configured": true,
    "oauth_endpoints_available": true,
    "app_id_preview": "1187...9875",
    "redirect_uri": "https://pulsebridge.ai/auth/instagram/callback"
  },
  "ready_for_oauth": true
}
```

## 🔧 FRONTEND DEPLOYMENT (Vercel)

### Update Vercel Environment Variables
Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your project → Settings → Environment Variables

**ADD THESE VARIABLES:**

```bash
# Instagram/Facebook App
NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875
INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
NEXT_PUBLIC_FACEBOOK_APP_ID=1187899253219875
FACEBOOK_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a

# API Configuration
NEXT_PUBLIC_API_BASE=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
```

Set Environment: **Production, Preview, and Development**

Then redeploy your Vercel application.

## 📱 META DEVELOPER CONSOLE SETUP

### Update Instagram App Settings
1. Go to [Meta Developer Console](https://developers.facebook.com/apps/1187899253219875/)
2. Navigate to **Products** → **Instagram** → **Basic Display**
3. Update **Valid OAuth Redirect URIs** to include:
   ```
   https://pulsebridge.ai/auth/instagram/callback
   http://localhost:3000/auth/instagram/callback
   ```
4. Save changes

### Verify App Configuration
- ✅ Instagram Basic Display product added
- ✅ Facebook Login product added (if needed)
- ✅ Your Facebook page connected to the app
- ✅ Instagram account connected to your Facebook page
- ✅ Redirect URIs configured correctly

## 🧪 TESTING THE COMPLETE FLOW

### 1. Test Backend Health
```bash
curl https://autopilot-api-1.onrender.com/health/instagram
```

### 2. Test OAuth Flow
1. Go to `https://pulsebridge.ai/social-media`
2. Click "Connect Account" under Instagram
3. Should redirect to Instagram OAuth
4. Login and authorize
5. Should redirect to callback page with success message

### 3. Test Development Environment
```bash
# Local development
npm run dev --turbopack
# Visit http://localhost:3000/oauth-test
```

## 🔍 TROUBLESHOOTING

### If Render Deployment Still Fails:
1. Check Render deployment logs for specific errors
2. Verify all environment variables are set exactly as shown above
3. Ensure no extra spaces or characters in values
4. Try manual redeploy after environment variable updates

### If OAuth Fails:
1. Verify redirect URI in Meta console matches exactly
2. Check that Instagram app is in "Live" mode (not Development)
3. Ensure Instagram account is connected to your Facebook page
4. Test with Meta's Graph API Explorer first

### If Health Check Fails:
- App ID not configured: Check environment variables in Render
- Base URL not set: Ensure NEXT_PUBLIC_BASE_URL is set
- Endpoints not available: Verify latest code is deployed

## 📊 SUCCESS METRICS

- ✅ Render deployment succeeds
- ✅ `/health/instagram` returns "healthy" status
- ✅ OAuth URL generation works
- ✅ Instagram login flow completes
- ✅ Account appears in social media dashboard

## 🚀 NEXT STEPS AFTER DEPLOYMENT

Once everything is working:
1. Test complete OAuth flow on production
2. Verify account connection in dashboard
3. Test posting capabilities (when ready)
4. Set up additional social media platforms

---

## 🎯 IMMEDIATE ACTION CHECKLIST

- [ ] Update Render environment variables with new app credentials
- [ ] Manual redeploy Render service
- [ ] Test health endpoints
- [ ] Update Vercel environment variables  
- [ ] Update Meta Developer Console redirect URIs
- [ ] Test complete OAuth flow

**Your deployment should now work with these exact credentials!**