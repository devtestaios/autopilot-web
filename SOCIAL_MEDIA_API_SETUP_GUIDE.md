# 🚀 Social Media API Setup Guide
**Complete step-by-step guide to connect Instagram, Facebook, TikTok, LinkedIn & Twitter**

## 📋 **Environment Variables Required**

### **Frontend (.env.local)**
```bash
# Facebook/Instagram APIs
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id

# Twitter API v2
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id

# LinkedIn API
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# TikTok Business API
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_tiktok_client_key

# Base URL for OAuth callbacks
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
```

### **Backend (.env on Render)**
```bash
# Facebook/Instagram Secrets
FACEBOOK_APP_SECRET=your_facebook_app_secret
INSTAGRAM_APP_SECRET=your_instagram_app_secret

# Twitter API Secrets
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn API Secret
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# TikTok Business API Secret
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

---

## 🔧 **Step-by-Step Setup Instructions**

### **1. Facebook & Instagram Business API** 📱

#### **Step 1: Create Facebook App**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"Create App"** → **"Business"** → **"Continue"**
3. Fill in app details:
   - **App Name**: "PulseBridge Social Media Manager"
   - **App Contact Email**: your_email@domain.com
   - **Business Account**: Select or create one

#### **Step 2: Configure Instagram Basic Display**
1. In your Facebook app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** → **"Set Up"**
3. In **Settings** → **Basic Display**:
   - **Valid OAuth Redirect URIs**: `https://pulsebridge.ai/auth/instagram/callback`
   - **Deauthorize Callback URL**: `https://pulsebridge.ai/auth/instagram/deauth`
   - **Data Deletion Request URL**: `https://pulsebridge.ai/auth/instagram/delete`

#### **Step 3: Add Instagram Content Publishing**
1. Add **"Instagram Content Publishing"** product
2. Configure permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_manage_posts`

#### **Step 4: Get Credentials**
1. Go to **Settings** → **Basic**
2. Copy **App ID** → `NEXT_PUBLIC_FACEBOOK_APP_ID`
3. Copy **App Secret** → `FACEBOOK_APP_SECRET`
4. For Instagram: Use same App ID → `NEXT_PUBLIC_INSTAGRAM_APP_ID`

#### **Step 5: Test Users (for development)**
1. Go to **Roles** → **Test Users**
2. Add test Instagram accounts for testing

---

### **2. TikTok Business API** 🎵

#### **Step 1: Apply for TikTok Business API**
1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Click **"Get Started"** → **"Business Solutions"**
3. Fill out application:
   - **Company Name**: Your Agency Name
   - **Use Case**: Social Media Management Platform
   - **Expected Volume**: Based on your client needs

#### **Step 2: Create TikTok App**
1. Once approved, go to **"My Apps"** → **"Create an App"**
2. Fill in app details:
   - **App Name**: "PulseBridge Social Manager"
   - **App Description**: AI-powered social media automation
   - **Category**: Marketing Tools

#### **Step 3: Configure OAuth**
1. In app settings → **"Login Kit"**
2. Add **Redirect URI**: `https://pulsebridge.ai/auth/tiktok/callback`
3. Select scopes:
   - `user.info.basic`
   - `video.publish`
   - `video.list`

#### **Step 4: Get Credentials**
1. Copy **Client Key** → `NEXT_PUBLIC_TIKTOK_CLIENT_KEY`
2. Copy **Client Secret** → `TIKTOK_CLIENT_SECRET`

---

### **3. Twitter API v2** 🐦

#### **Step 1: Create Twitter Developer Account**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for developer account (usually approved within 24 hours)
3. Create new project: **"PulseBridge Social Media Manager"**

#### **Step 2: Create Twitter App**
1. In your project → **"Add App"**
2. App details:
   - **App Name**: "PulseBridge-Social-Manager"
   - **App Description**: AI-powered social media automation and optimization

#### **Step 3: Configure OAuth 2.0**
1. Go to app settings → **"Authentication settings"**
2. Enable **OAuth 2.0**
3. Add **Callback URI**: `https://pulsebridge.ai/auth/twitter/callback`
4. Add **Website URL**: `https://pulsebridge.ai`

#### **Step 4: Set Permissions**
1. Go to **"User authentication settings"**
2. Select permissions:
   - **Read** (tweet.read, users.read, follows.read)
   - **Write** (tweet.write)
3. Request **"Read and Write"** permissions

#### **Step 5: Get Credentials**
1. Go to **"Keys and Tokens"**
2. Copy **Client ID** → `NEXT_PUBLIC_TWITTER_CLIENT_ID`
3. Copy **Client Secret** → `TWITTER_CLIENT_SECRET`

---

### **4. LinkedIn API** 💼

#### **Step 1: Create LinkedIn App**
1. Go to [LinkedIn Developers](https://developer.linkedin.com/)
2. Click **"Create App"**
3. Fill in details:
   - **App Name**: "PulseBridge Social Media Manager"
   - **LinkedIn Company Page**: Your company page
   - **Privacy Policy URL**: `https://pulsebridge.ai/privacy`
   - **App Logo**: Upload your logo

#### **Step 2: Request API Access**
1. Go to **"Products"** tab
2. Request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn** (requires approval)
   - **Marketing Developer Platform** (for advanced features)

#### **Step 3: Configure OAuth**
1. Go to **"Auth"** tab
2. Add **Authorized Redirect URLs**: `https://pulsebridge.ai/auth/linkedin/callback`
3. Note your **Client ID** and **Client Secret**

#### **Step 4: Get Credentials**
1. Copy **Client ID** → `NEXT_PUBLIC_LINKEDIN_CLIENT_ID`
2. Copy **Client Secret** → `LINKEDIN_CLIENT_SECRET`

---

## ⚙️ **Environment Variable Configuration**

### **Step 1: Local Development (.env.local)**
Create or update your local `.env.local` file:

```bash
# Create the .env.local file in your project root
touch .env.local

# Add all the public environment variables
echo "NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id" >> .env.local
echo "NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id" >> .env.local
echo "NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id" >> .env.local
echo "NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id" >> .env.local
echo "NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_tiktok_client_key" >> .env.local
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.local
```

### **Step 2: Production Environment (Vercel)**
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `autopilot-web` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

**Frontend Variables:**
```
NEXT_PUBLIC_FACEBOOK_APP_ID = your_facebook_app_id
NEXT_PUBLIC_INSTAGRAM_APP_ID = your_instagram_app_id  
NEXT_PUBLIC_TWITTER_CLIENT_ID = your_twitter_client_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID = your_linkedin_client_id
NEXT_PUBLIC_TIKTOK_CLIENT_KEY = your_tiktok_client_key
NEXT_PUBLIC_BASE_URL = https://pulsebridge.ai
```

### **Step 3: Backend Environment (Render)**
1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Go to **Environment** → **Environment Variables**
4. Add each secret variable:

**Backend Variables:**
```
FACEBOOK_APP_SECRET = your_facebook_app_secret
INSTAGRAM_APP_SECRET = your_instagram_app_secret
TWITTER_CLIENT_SECRET = your_twitter_client_secret
LINKEDIN_CLIENT_SECRET = your_linkedin_client_secret
TIKTOK_CLIENT_SECRET = your_tiktok_client_secret
```

---

## 🧪 **Testing Your Setup**

### **Step 1: Test Locally**
```bash
# Start your development server
npm run dev --turbopack

# Check if environment variables are loaded
curl http://localhost:3000/social-media
```

### **Step 2: Test OAuth Flows**
1. Go to `http://localhost:3000/social-media`
2. Click **"Connect Account"** for each platform
3. Verify OAuth redirects work correctly
4. Check that access tokens are obtained

### **Step 3: Test API Connections**
```bash
# Test social media API endpoints
curl http://localhost:8000/api/social-media/accounts
curl http://localhost:8000/api/social-media/oauth/platforms
```

---

## 🚀 **Deployment & Verification**

### **Step 1: Deploy Changes**
```bash
# Commit and deploy
git add .
git commit -m "🔧 Add social media API environment variables"
git push origin main
```

### **Step 2: Verify Production**
1. Visit `https://pulsebridge.ai/social-media`
2. Test each platform connection
3. Verify OAuth callbacks work with production URLs
4. Test posting functionality

### **Step 3: Monitor API Usage**
- Check platform developer consoles for API usage
- Monitor rate limits and quotas
- Set up webhooks for real-time updates

---

## 📊 **Expected Results**

Once configured, your social media platform will support:

✅ **Multi-Platform Authentication**: OAuth for all 5 platforms  
✅ **Real-time Posting**: Direct API publishing to all connected accounts  
✅ **AI Content Generation**: Automated content creation with platform optimization  
✅ **Analytics Integration**: Real-time engagement and performance data  
✅ **Automated Scheduling**: Optimal timing suggestions and automated posting  
✅ **Competitor Analysis**: Cross-platform competitor tracking and insights  

---

## 🔍 **Troubleshooting Common Issues**

### **Issue: OAuth Callback Errors**
- **Solution**: Ensure callback URLs match exactly in platform developer consoles
- **Check**: Both development (`localhost:3000`) and production (`pulsebridge.ai`) URLs

### **Issue: API Rate Limits**
- **Solution**: Implement rate limiting in your backend service
- **Monitor**: Platform developer consoles for usage quotas

### **Issue: Permissions Denied**
- **Solution**: Ensure all required scopes are requested during OAuth
- **Verify**: Platform-specific permission requirements

### **Issue: Environment Variables Not Loading**
- **Solution**: Restart development server after adding new variables
- **Check**: Variable naming matches exactly (case-sensitive)

Your enhanced social media platform is now ready for full third-party integration! 🎉