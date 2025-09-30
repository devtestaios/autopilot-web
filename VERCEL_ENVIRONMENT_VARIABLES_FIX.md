# 🔧 CONNECT ACCOUNT BUTTON FIX - VERCEL ENVIRONMENT VARIABLES NEEDED

## ✅ ISSUE IDENTIFIED

### 🚨 **Root Cause:**
The "Connect Account" button isn't working because **Vercel (frontend) is missing Instagram environment variables**.

The frontend code tries to access:
- `process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID`
- `process.env.NEXT_PUBLIC_BASE_URL`

But these are only configured on Render (backend), not on Vercel (frontend).

### 🔍 **Debug Output:**
After the next deployment, check browser console. You should see:
- Button click logged
- API Base URL (might be undefined)
- Possible error about missing Instagram App ID

## 🎯 IMMEDIATE FIX: ADD ENVIRONMENT VARIABLES TO VERCEL

### **Step 1: Go to Vercel Dashboard**
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `autopilot-web` project  
3. Click on it to open project settings

### **Step 2: Add Environment Variables**
1. Go to **Settings** → **Environment Variables**
2. Add these **EXACT** variables:

```bash
# Instagram/Facebook Configuration
NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875
NEXT_PUBLIC_FACEBOOK_APP_ID=1187899253219875

# API and Base URLs
NEXT_PUBLIC_API_BASE=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai

# Optional: Instagram App Secret (for frontend if needed)
INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
```

### **Step 3: Set Environment Scope**
For each variable, set the environment to:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### **Step 4: Redeploy**
1. After adding all variables, go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** to apply the new environment variables

## 🧪 TESTING AFTER DEPLOYMENT

### **Test 1: Check Environment Variables**
1. Go to `https://pulsebridge.ai/oauth-test`
2. Should now show:
   - Instagram App ID: `1187899253219875`
   - Base URL: `https://pulsebridge.ai`
   - API Base: `https://autopilot-api-1.onrender.com`

### **Test 2: Connect Account Button**
1. Go to `https://pulsebridge.ai/social-media`
2. Open browser developer tools (F12) → Console tab
3. Click "Connect Account" button
4. Should see debug logs:
   - "Connect Account button clicked for platform: instagram"
   - "Initiating OAuth for platform: instagram"
   - "Generated auth URL: https://www.facebook.com/v18.0/dialog/oauth?..."
5. Should open Instagram OAuth popup window

### **Test 3: Complete OAuth Flow**
1. In the OAuth popup, login with Instagram
2. Grant permissions
3. Should redirect to callback page
4. Should see success message and redirect back to dashboard

## 📋 ENVIRONMENT VARIABLES CHECKLIST

### **Render (Backend) - ✅ ALREADY DONE:**
- [x] `NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875`
- [x] `INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a`
- [x] `NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai`

### **Vercel (Frontend) - 🔧 TODO:**
- [ ] `NEXT_PUBLIC_INSTAGRAM_APP_ID=1187899253219875`
- [ ] `NEXT_PUBLIC_FACEBOOK_APP_ID=1187899253219875`
- [ ] `NEXT_PUBLIC_API_BASE=https://autopilot-api-1.onrender.com`
- [ ] `NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai`
- [ ] `INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a` (optional)

## 🎯 EXPECTED RESULTS

After adding Vercel environment variables:
- ✅ Connect Account button will respond to clicks
- ✅ OAuth URL generation will work
- ✅ Instagram login popup will open
- ✅ Complete OAuth flow will function
- ✅ Accounts will be stored and displayed

## 📞 NEXT ACTIONS

1. **Add environment variables to Vercel** (4-5 variables above)
2. **Redeploy Vercel application** with new variables
3. **Test Connect Account button** with browser console open
4. **Complete Instagram OAuth flow** end-to-end
5. **Report back results** - should work perfectly!

The Connect Account button will work once Vercel has access to the Instagram App ID! 🚀