# 🎯 Google Ads API Setup Guide for PulseBridge.ai
*Complete setup process for connecting real Google Ads data to your marketing automation platform*

## 📋 **Prerequisites Checklist**
- [ ] Google Ads account with active campaigns
- [ ] Google Cloud Platform (GCP) account  
- [ ] Admin access to your Google Ads account
- [ ] Access to Render dashboard for environment variables

---

## 🔧 **Step 1: Google Cloud Project Setup**

### **1.1 Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "PulseBridge Marketing API"
4. Click "Create"

### **1.2 Enable Google Ads API**
1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Ads API"
3. Click "Google Ads API" → "Enable"
4. Wait for activation (may take 2-3 minutes)

### **1.3 Create Service Credentials**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure OAuth consent screen:
   - User Type: "External" (unless you have Google Workspace)
   - App name: "PulseBridge Marketing Automation"
   - User support email: your email
   - Developer contact: your email
4. Application type: "Desktop application" ⚠️ **Important: Choose Desktop, not Web**
5. Name: "PulseBridge API Client"
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these!

---

## 🔑 **Step 2: Google Ads Developer Token**

### **2.1 Apply for Developer Token**
1. Go to [Google Ads](https://ads.google.com/)
2. Click the tools icon (🔧) → "Setup" → "API Center"
3. Click "Create Developer Token"
4. Fill out the application:
   - **Company Name**: PulseBridge.ai
   - **Company Website**: https://pulsebridge.ai
   - **Use Case**: Marketing automation platform for campaign optimization
   - **API Usage**: Read campaign data, performance metrics, and basic campaign management
5. Submit application

### **2.2 Developer Token Status**
- **Basic Access**: Approved automatically (can access your own accounts)
- **Standard Access**: Requires review (needed for client accounts)
- For testing: Basic access is sufficient to start

---

## 🔐 **Step 3: Generate Refresh Token**

You already have a refresh token generator script! Here's how to use it:

### **3.1 Install Dependencies**
```bash
pip install google-auth-oauthlib
```

### **3.2 Run Token Generator**
```bash
cd scripts/development
python generate_refresh_token.py
```

### **3.3 Follow the Process**
1. Enter your **Client ID** from Step 1.3
2. Enter your **Client Secret** from Step 1.3  
3. Browser will open for Google authentication
4. Sign in with your Google Ads account
5. Grant permissions when prompted
6. Copy the generated refresh token

---

## 🎯 **Step 4: Get Customer ID**

### **4.1 Find Your Customer ID**
1. Go to [Google Ads](https://ads.google.com/)
2. Look at the top-right corner for your Customer ID
3. Format: `123-456-7890` (remove dashes for API)
4. Copy the numbers only: `1234567890`

---

## ⚙️ **Step 5: Configure Environment Variables**

### **5.1 Add to Render Dashboard**
1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Find your `autopilot-api` service
3. Go to "Environment" tab
4. Add these variables:

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id_here  
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

### **5.2 For Local Development**
Create `.env` file in your backend directory:
```bash
# Google Ads API Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here  
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

---

## 🧪 **Step 6: Test Integration**

### **6.1 Test API Connection**
```bash
curl https://autopilot-api-1.onrender.com/google-ads/status
```

**Expected Response:**
```json
{
  "available": true,
  "connection_test": "success"
}
```

### **6.2 Test Campaign Sync**
```bash
curl -X POST https://autopilot-api-1.onrender.com/google-ads/sync-campaigns
```

### **6.3 Check Dashboard**
Visit your dashboard to see real Google Ads campaigns:
- https://pulsebridge.ai/dashboard/enhanced

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**❌ "Developer token not approved"**
- Solution: Apply for standard access or use basic access for your own accounts

**❌ "Invalid client credentials"**  
- Solution: Double-check Client ID and Secret from Google Cloud Console

**❌ "Refresh token expired"**
- Solution: Re-run the refresh token generator script

**❌ "Customer ID not found"**
- Solution: Ensure Customer ID is just numbers (no dashes)

### **Environment Variable Check**
Test your backend configuration:
```bash
curl https://autopilot-api-1.onrender.com/env-check
```

---

## 🎉 **Success Indicators**

When everything is working correctly:

1. ✅ **API Status**: `/google-ads/status` returns `"available": true`
2. ✅ **Campaign Sync**: `/google-ads/sync-campaigns` returns actual campaigns  
3. ✅ **Dashboard Data**: Real campaigns appear in your dashboard
4. ✅ **Performance Metrics**: Live performance data syncing

---

## 📈 **Next Steps After Setup**

Once Google Ads is connected:

1. **Test Campaign Creation**: Create a campaign through your dashboard
2. **Monitor Sync**: Check that performance data updates daily
3. **AI Integration**: Claude AI will now provide recommendations based on real data
4. **Automation Rules**: Test automated bid adjustments and budget optimization
5. **Multi-Platform**: Add Meta Ads, LinkedIn, etc.

---

## 🔐 **Security Best Practices**

- ✅ Never commit API keys to git
- ✅ Use environment variables for all credentials  
- ✅ Regularly rotate refresh tokens
- ✅ Monitor API usage and quotas
- ✅ Enable logging for debugging

---

## ⏱️ **Expected Timeline**

- **Step 1-2**: 15-30 minutes (Google Cloud + Developer Token)
- **Step 3**: 5-10 minutes (Generate refresh token)
- **Step 4**: 2 minutes (Find Customer ID)
- **Step 5**: 5 minutes (Configure environment variables)
- **Step 6**: 5 minutes (Test integration)

**Total Setup Time**: ~45-60 minutes

---

*This setup transforms your PulseBridge.ai platform from using mock data to managing real Google Ads campaigns with live performance data and AI-powered optimization!*

## 🚀 **Quick Start Commands**

Once setup is complete, test everything:

```bash
# 1. Test backend health
curl https://autopilot-api-1.onrender.com/health

# 2. Check Google Ads status  
curl https://autopilot-api-1.onrender.com/google-ads/status

# 3. Sync your campaigns
curl -X POST https://autopilot-api-1.onrender.com/google-ads/sync-campaigns

# 4. View campaigns in dashboard
open https://pulsebridge.ai/dashboard/enhanced
```