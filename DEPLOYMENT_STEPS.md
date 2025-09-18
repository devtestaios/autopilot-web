# 🚀 Google Ads Integration - Deployment Steps

## Quick Implementation Checklist

### Phase 1: Prepare Your Credentials (Do This First!)

#### ✅ Step 1: Get Developer Token
1. Go to: https://developers.google.com/google-ads/api/docs/first-call/overview
2. Apply for developer token (takes 24-48 hours)
3. **Wait for approval email before proceeding**

#### ✅ Step 2: Create OAuth2 Credentials  
1. Go to: https://console.cloud.google.com
2. Create/select project
3. Enable "Google Ads API"
4. Credentials → Create → OAuth 2.0 Client ID → Desktop Application
5. Save Client ID and Secret

#### ✅ Step 3: Generate Refresh Token
1. **In this project directory**, run:
   ```bash
   pip install google-auth-oauthlib
   python generate_refresh_token.py
   ```
2. Follow the prompts, authenticate in browser
3. Copy the refresh token from output

#### ✅ Step 4: Get Customer ID
1. Log into Google Ads account
2. Note the 10-digit Customer ID (remove dashes: 123-456-7890 → 1234567890)

---

### Phase 2: Backend Implementation

#### 🔧 Step 1: Update Requirements
Add to your backend `requirements.txt`:
```
google-ads==23.1.0
google-auth==2.23.3
google-auth-oauthlib==1.1.0
```

#### 🔧 Step 2: Add Integration Files
1. Copy `backend_google_ads_integration.py` to your FastAPI project
2. Copy the endpoints from `updated_fastapi_endpoints.py` into your `main.py`

#### 🔧 Step 3: Update main.py Imports
Add this import to the top of your `main.py`:
```python
from backend_google_ads_integration import get_google_ads_client, fetch_campaigns_from_google_ads, fetch_performance_from_google_ads
```

---

### Phase 3: Environment Configuration

#### ⚙️ Render Environment Variables
In your Render service dashboard, add these environment variables:

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

**🚨 CRITICAL**: Make sure Customer ID has **no dashes**!

---

### Phase 4: Deploy & Test

#### 🚀 Step 1: Deploy Backend
1. Commit and push your changes
2. Render will automatically deploy
3. Wait for deployment to complete

#### 🧪 Step 2: Test Connection
Test these endpoints in order:

1. **Connection Status**:
   ```bash
   curl https://your-api-url.onrender.com/google-ads/status
   ```
   Expected: `{"status": "connected", "connected": true}`

2. **Test Detailed Diagnostics**:
   ```bash
   curl https://your-api-url.onrender.com/google-ads/test-connection
   ```
   
3. **Fetch Campaigns**:
   ```bash
   curl https://your-api-url.onrender.com/google-ads/campaigns
   ```

4. **Sync Campaigns to Database**:
   ```bash
   curl -X POST https://your-api-url.onrender.com/google-ads/sync-campaigns
   ```

#### 🎯 Step 3: Frontend Testing
1. Go to https://autopilot-web-rho.vercel.app
2. Check the "Google Ads Integration" section on dashboard
3. Should show "Connected to Google Ads" 
4. Click "Sync Campaigns" - should see real campaigns appear

---

### Phase 5: Verification

#### ✅ Success Indicators
- [ ] `/google-ads/status` returns `"connected": true`
- [ ] `/google-ads/campaigns` returns real campaign data
- [ ] Frontend shows "Connected to Google Ads"
- [ ] Real campaigns appear in dashboard after sync
- [ ] Campaigns saved to Supabase database

#### 🔍 Troubleshooting Common Issues

**Issue**: `"Developer token not approved"`
**Fix**: Wait for Google's approval email (24-48 hours)

**Issue**: `"Invalid customer ID"`  
**Fix**: Remove dashes from Customer ID (123-456-7890 → 1234567890)

**Issue**: `"Invalid grant" or OAuth errors`
**Fix**: Re-run `generate_refresh_token.py` to get new token

**Issue**: `"Quota exceeded"`
**Fix**: Check API usage in Google Cloud Console

**Issue**: Connection test fails
**Fix**: Check all 5 environment variables are set correctly in Render

---

### Phase 6: Next Steps (After Basic Integration Works)

1. **Performance Data Sync**: Set up automated performance data collection
2. **Multi-Account Support**: Handle multiple Google Ads accounts  
3. **Real-time Optimization**: Implement automated bid adjustments
4. **Advanced Reporting**: Add detailed analytics and insights
5. **Campaign Management**: Allow campaign creation/editing through UI

---

## 🆘 Need Help?

### Debug Commands
```bash
# Check environment variables are set
curl https://your-api-url.onrender.com/google-ads/test-connection

# View Render logs
# Go to Render dashboard → Your service → Logs

# Test locally (if running backend locally)
uvicorn main:app --reload
curl http://localhost:8000/google-ads/status
```

### Quick Fixes
- **Can't connect**: Double-check all 5 environment variables
- **No campaigns**: Verify Customer ID is correct (no dashes)
- **API errors**: Check Google Ads account has active campaigns
- **Frontend not updating**: Hard refresh browser (Cmd+Shift+R)

---

**🎯 Goal**: See real Google Ads campaigns in your dashboard at https://autopilot-web-rho.vercel.app**

Once this works, we'll have **live Google Ads data** flowing into your Autopilot platform! 🚀