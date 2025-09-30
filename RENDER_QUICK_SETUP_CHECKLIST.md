# ✅ RENDER DEPLOYMENT - QUICK VERIFICATION CHECKLIST

## 🎯 Your Instagram App Credentials (CONFIRMED)
- **App ID:** `1187899253219875` ✅
- **App Secret:** `a7d04912a36f6847993c7fe099a6b07a` ✅
- **Local Environment:** Updated ✅
- **Code Pushed to GitHub:** ✅

## 🚀 IMMEDIATE RENDER SETUP (Copy & Paste)

### Render Environment Variables
Go to your Render dashboard and set these **EXACT** values:

```
NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875
INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
NEXT_PUBLIC_FACEBOOK_APP_ID=1187899253219875
FACEBOOK_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
```

### Manual Redeploy Steps
1. Save environment variables in Render
2. Go to "Deployments" tab
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment success

## ✅ VERIFICATION STEPS

### 1. Check Deployment Success
- [ ] Render deployment completes without errors
- [ ] Service shows as "Live" in Render dashboard

### 2. Test Health Endpoints
- [ ] Visit: `https://autopilot-api-1.onrender.com/health`
- [ ] Visit: `https://autopilot-api-1.onrender.com/health/instagram`

**Expected Instagram Health Response:**
```json
{
  "status": "healthy",
  "details": {
    "instagram_app_id_configured": true,
    "instagram_app_secret_configured": true,
    "base_url_configured": true,
    "app_id_preview": "1187...9875"
  },
  "ready_for_oauth": true
}
```

### 3. Test OAuth Flow (After Render is Working)
- [ ] Go to: `https://pulsebridge.ai/social-media`
- [ ] Click "Connect Account" for Instagram
- [ ] Should generate OAuth URL and redirect

## 🔧 IF DEPLOYMENT STILL FAILS

### Check Render Logs
1. Go to Render → Your service → "Logs" tab
2. Look for specific error messages
3. Common issues:
   - Missing environment variables
   - Syntax errors
   - Import failures

### Common Fixes
- **Missing Variables:** Ensure ALL 5 environment variables are set
- **Wrong Format:** Double-check App ID (no spaces, exact match)
- **Old Cache:** Try manual redeploy after environment variable changes

## 📞 NEXT STEPS

1. **Update Render environment variables** (5 variables above)
2. **Manual redeploy** the service
3. **Test health endpoints** to verify configuration
4. **Report back** if deployment succeeds or share any error messages

## 🎯 SUCCESS INDICATORS

- ✅ Render deployment successful
- ✅ `/health/instagram` shows all configurations as `true`
- ✅ OAuth URL generation works
- ✅ No environment variable errors in logs

**Your deployment should now work with the new app credentials!**

Let me know when you've updated Render and I'll help verify everything is working correctly.