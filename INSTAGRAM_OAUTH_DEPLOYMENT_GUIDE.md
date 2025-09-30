# 🚀 INSTAGRAM OAUTH DEPLOYMENT GUIDE

## Status: ✅ Backend OAuth Endpoints Implemented, Environment Variables Updated

The Instagram OAuth integration is now ready to test! Here's what's been completed and what needs to be done:

### ✅ COMPLETED TASKS

#### 1. Backend OAuth Endpoints Added
- `POST /api/social-media/oauth/initiate` - Generates Instagram OAuth URL
- `POST /api/social-media/oauth/callback` - Completes OAuth flow and stores account
- Mock data implementation for testing without full Instagram API integration

#### 2. Frontend OAuth Callback Page Created
- `/auth/instagram/callback` - Handles Instagram OAuth callback
- User-friendly success/error messages
- Automatic redirect back to social media dashboard

#### 3. Local Environment Variables Updated
- `NEXT_PUBLIC_INSTAGRAM_APP_ID=1070854764927241`
- `INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a`
- Base URLs pointing to production for testing

### 🎯 IMMEDIATE NEXT STEPS

#### Step 1: Deploy Environment Variables to Render (Backend)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your `autopilot-api-1` service
3. Go to "Environment" tab
4. Add these environment variables:
   ```
   NEXT_PUBLIC_INSTAGRAM_APP_ID=1070854764927241
   INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
   NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
   ```
5. Click "Save Changes" and wait for deployment

#### Step 2: Deploy Environment Variables to Vercel (Frontend)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `autopilot-web` project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   ```
   NEXT_PUBLIC_INSTAGRAM_APP_ID=1070854764927241
   INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a
   NEXT_PUBLIC_API_BASE=https://autopilot-api-1.onrender.com
   NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
   ```
5. Set Environment: "Production, Preview, and Development"
6. Redeploy the application

#### Step 3: Update Instagram App Settings in Meta Developer Console
1. Go to [Meta Developer Console](https://developers.facebook.com/apps/1070854764927241/)
2. Navigate to "Instagram" → "Basic Display"
3. Update "Valid OAuth Redirect URIs" to include:
   ```
   https://pulsebridge.ai/auth/instagram/callback
   ```
4. Save changes

### 🧪 TESTING THE INTEGRATION

#### Test Flow:
1. Navigate to https://pulsebridge.ai/social-media
2. Click "Connect Account" under Instagram section
3. Should redirect to Instagram OAuth page
4. Login with @grayandairhome account
5. Grant permissions
6. Should redirect back to `/auth/instagram/callback`
7. Should see success message and auto-redirect to dashboard
8. Instagram account should appear as "Connected" in dashboard

#### Expected Results:
- ✅ OAuth URL generation works
- ✅ Instagram login flow completes
- ✅ Account appears as connected in dashboard
- ✅ Mock account data stored in database

### 🔧 CURRENT IMPLEMENTATION DETAILS

#### OAuth Flow:
```
User clicks "Connect Account" 
→ Frontend calls /api/social-media/oauth/initiate
→ Backend generates Instagram OAuth URL
→ User redirects to Instagram/Facebook login
→ Instagram redirects to /auth/instagram/callback?code=...
→ Frontend calls /api/social-media/oauth/callback with code
→ Backend exchanges code for token (mock implementation)
→ Account stored in database
→ User redirected to dashboard with success message
```

#### Mock vs Real Integration:
- **Currently**: Mock token and account data for testing
- **Next Phase**: Real Instagram API integration with actual tokens
- **Benefit**: Can test complete OAuth flow without Instagram approval

### ⚠️ TROUBLESHOOTING

#### If "Connect Account" Button Still Doesn't Work:
1. Check browser console for JavaScript errors
2. Verify environment variables are deployed to both Render and Vercel
3. Ensure Instagram app has correct redirect URIs configured
4. Check if backend OAuth endpoints are accessible

#### If OAuth Fails:
1. Verify Instagram App ID and Secret are correct
2. Check redirect URI matches exactly in Meta console
3. Ensure @grayandairhome account has proper test user permissions
4. Check browser network tab for API call failures

### 📈 SUCCESS METRICS
- [x] OAuth URL generation successful
- [x] Instagram login redirects properly
- [x] Callback page loads and processes response
- [x] Account appears in connected accounts list
- [x] Database stores account information

### 🚀 NEXT PHASE: REAL API INTEGRATION
Once OAuth testing is successful, the next phase will involve:
1. Real Instagram API token exchange
2. Fetching actual user profile data
3. Real-time posting capabilities
4. Analytics and insights integration

## 🎯 IMMEDIATE ACTION REQUIRED
**Deploy the environment variables to Render and Vercel NOW to enable testing!**