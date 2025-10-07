# Meta Business API Live Configuration Guide
## Phase 1 Real Data Integration Setup

### 🚀 **STEP 1: Meta Developer App Creation**

#### **1.1 Create Meta Developer App**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"Create App"**
3. Select **"Business"** as app type
4. Fill in app details:
   - **App Name**: `PulseBridge AI Marketing`
   - **App Contact Email**: Your business email
   - **Business Manager Account**: Select your business account

#### **1.2 Add Marketing API Product**
1. In your app dashboard, click **"Add Product"**
2. Find **"Marketing API"** and click **"Set up"**
3. This gives you access to campaign management and insights

---

### 🔑 **STEP 2: Generate Access Tokens**

#### **2.1 Get App Access Token**
1. Go to **Tools & Support** > **Graph API Explorer**
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Select these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
   - `read_insights`

#### **2.2 Get Long-lived User Access Token**
```bash
# Exchange short-lived token for long-lived (60 days)
curl -X GET "https://graph.facebook.com/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

---

### 🏢 **STEP 3: Business Manager Setup**

#### **3.1 Create/Access Business Manager**
1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Create a business account if you don't have one
3. Add your ad accounts to the Business Manager

#### **3.2 Get Ad Account ID**
1. In Business Manager, go to **"Ad Accounts"**
2. Your Ad Account ID will be in format: `act_XXXXXXXXXX`
3. Copy this ID - you'll need it for API calls

---

### ⚙️ **STEP 4: Environment Configuration**

#### **4.1 Backend Environment Variables**
Add these to your backend `.env` file:

```bash
# Meta Business API Configuration
META_APP_ID="your_app_id_here"
META_APP_SECRET="your_app_secret_here"
META_ACCESS_TOKEN="your_long_lived_access_token_here"
META_AD_ACCOUNT_ID="act_your_ad_account_id_here"

# Optional: Webhook configuration
META_WEBHOOK_SECRET="your_webhook_secret"
META_WEBHOOK_URL="https://your-domain.com/webhooks/meta"
```

#### **4.2 Frontend Environment Variables**
Add to your `.env.local`:

```bash
# Meta Business API (Frontend)
NEXT_PUBLIC_META_APP_ID="your_app_id_here"
```

---

### 🧪 **STEP 5: Test Your Configuration**

#### **5.1 Test API Access**
```bash
# Test basic access to your ad account
curl -X GET \
  "https://graph.facebook.com/v19.0/act_YOUR_AD_ACCOUNT_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "account_id": "YOUR_AD_ACCOUNT_ID",
  "name": "Your Ad Account Name",
  "account_status": 1,
  "currency": "USD"
}
```

#### **5.2 Test Campaign Retrieval**
```bash
# Get your campaigns
curl -X GET \
  "https://graph.facebook.com/v19.0/act_YOUR_AD_ACCOUNT_ID/campaigns" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "fields=id,name,status,objective,created_time,updated_time"
```

---

### 🔒 **STEP 6: Security & Permissions**

#### **6.1 Required Permissions**
Ensure your access token has these permissions:
- `ads_management` - Create/edit campaigns
- `ads_read` - Read campaign data and insights
- `business_management` - Manage business assets
- `read_insights` - Access performance metrics

#### **6.2 Rate Limiting**
- Meta API has rate limits per app and per user
- Production apps get higher limits
- Monitor usage in your App Dashboard

---

### 📊 **STEP 7: Live Data Testing**

#### **7.1 Test with PulseBridge Integration**
Once configured, test with our Phase 1 dashboard:

```bash
# Start your development server
npm run dev --turbopack

# Visit Phase 1 Dashboard
# http://localhost:3000/dashboard/phase1

# Check browser console for API responses
```

#### **7.2 Backend API Testing**
```bash
# Test Meta integration endpoint
curl -X GET "http://localhost:8000/api/v1/integrations/campaigns/meta" \
  -H "Content-Type: application/json"

# Test performance data retrieval
curl -X GET "http://localhost:8000/api/v1/integrations/performance/meta?days_back=7" \
  -H "Content-Type: application/json"
```

---

### 🚨 **STEP 8: Production Considerations**

#### **8.1 App Review Process**
For production use, you'll need Meta's app review for:
- Advanced permissions
- Higher rate limits
- Business verification

#### **8.2 Webhooks (Optional)**
Set up webhooks for real-time updates:
```javascript
// Webhook endpoint for campaign updates
POST /webhooks/meta
{
  "object": "page",
  "entry": [{
    "id": "campaign_id",
    "changes": [{
      "field": "campaign_status",
      "value": "PAUSED"
    }]
  }]
}
```

---

### 🎯 **STEP 9: Integration Validation**

#### **9.1 Check Phase 1 Dashboard**
1. Navigate to: `http://localhost:3000/dashboard/phase1`
2. Look for **Meta campaign data** in the widgets
3. Verify **real-time updates** are working
4. Check **cross-platform comparison** shows Meta vs Google data

#### **9.2 Database Verification**
Check that data is flowing into your Supabase tables:
```sql
-- Check campaigns table
SELECT * FROM campaigns WHERE platform = 'meta';

-- Check performance snapshots
SELECT * FROM performance_snapshots 
WHERE campaign_id IN (SELECT id FROM campaigns WHERE platform = 'meta');

-- Check AI insights
SELECT * FROM meta_ai_insights;
```

---

### ⚡ **Quick Start Commands**

```bash
# 1. Install dependencies (if needed)
pip install facebook-business requests python-dotenv

# 2. Test your token
curl -X GET "https://graph.facebook.com/me?access_token=YOUR_TOKEN"

# 3. Start Phase 1 dashboard
npm run dev --turbopack

# 4. Open dashboard
open http://localhost:3000/dashboard/phase1
```

---

### 🆘 **Troubleshooting**

#### **Common Issues:**

**Error: "Invalid OAuth 2.0 Access Token"**
- Token expired (regenerate long-lived token)
- Wrong app ID/secret combination
- Token doesn't have required permissions

**Error: "Unsupported request"**
- Check API version (use v19.0 or latest)
- Verify endpoint URL format
- Ensure ad account ID has `act_` prefix

**No campaigns returned**
- Ad account might be empty
- Check ad account permissions
- Verify business manager access

---

### 🎉 **Success Indicators**

✅ **API Access Working**: You can fetch ad account info
✅ **Campaign Data**: Real campaigns appear in Phase 1 dashboard  
✅ **Performance Metrics**: Live spend/conversion data updating
✅ **AI Insights**: Meta recommendations appear in dashboard
✅ **Database Integration**: Data flows into Supabase tables

---

**Once Meta is configured, you'll have real Facebook/Instagram campaign data flowing into your Phase 1 dashboard within minutes!**

**Next**: Configure Google Ads API for complete cross-platform integration.