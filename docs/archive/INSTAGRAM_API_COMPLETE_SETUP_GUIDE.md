# 📱 Complete Instagram API Credentials Setup Guide
**Step-by-step guide using your existing Meta Developer account**

## 🎯 **Goal: Get Complete Instagram Business API Access**

### **✅ What You Need for Full Instagram Integration:**
1. **App ID** (public) - for OAuth initiation
2. **App Secret** (private) - for secure API calls  
3. **Access Token** (user-specific) - obtained via OAuth flow
4. **Business Account Connection** - Instagram Business or Creator account

### **📋 You Already Have:**
- ✅ Meta Developer Account
- ✅ Some Instagram credentials in your `.env.example`

---

## 🚀 **Step-by-Step Instagram API Setup**

### **Step 1: Access Your Meta Developer Console**
1. Go to: https://developers.facebook.com/
2. Click **"My Apps"** (top right)
3. Look for existing apps or click **"Create App"**

### **Step 2: Create or Configure Instagram App**

#### **Option A: Create New App (Recommended)**
1. Click **"Create App"** 
2. Select **"Business"** → **"Continue"**
3. Fill in details:
   - **App Name**: `PulseBridge Social Media Manager`
   - **App Contact Email**: `your_email@domain.com`
   - **Business Manager Account**: Select or create one

#### **Option B: Use Existing App**
1. Select your existing app from the dashboard
2. Make sure it's a **Business type** app (not Consumer)

### **Step 3: Add Instagram Products**

#### **Add Instagram Basic Display:**
1. In your app dashboard → **"Add Product"**
2. Find **"Instagram Basic Display"** → **"Set Up"**
3. Click **"Create New App"** (if prompted)

#### **Add Instagram Graph API:**
1. **Add Product** → **"Instagram Graph API"** → **"Set Up"**
2. This gives you **Instagram Business API** access (posts, insights, media)

### **Step 4: Configure Instagram Basic Display**
1. Go to **Products** → **Instagram Basic Display** → **Basic Display**
2. Add these URLs:

**Valid OAuth Redirect URIs:**
```
https://pulsebridge.ai/auth/instagram/callback
http://localhost:3000/auth/instagram/callback
```

**Deauthorize Callback URL:**
```
https://pulsebridge.ai/auth/instagram/deauth
```

**Data Deletion Request URL:**
```
https://pulsebridge.ai/auth/instagram/delete
```

### **Step 5: Configure App Permissions**
1. Go to **App Review** → **Permissions and Features**
2. Request these permissions:

**Basic Permissions (Usually Auto-Approved):**
- ✅ `instagram_basic` - Access basic profile info
- ✅ `pages_show_list` - Access Facebook pages

**Advanced Permissions (May Need Review):**
- 📝 `instagram_content_publish` - Post content to Instagram
- 📝 `instagram_manage_insights` - Access analytics data
- 📝 `pages_read_engagement` - Read engagement metrics

### **Step 6: Get Your Credentials**

#### **App ID and Secret:**
1. Go to **Settings** → **Basic**
2. Copy these values:

```bash
# These go in your environment variables
App ID: [YOUR_APP_ID]        → NEXT_PUBLIC_INSTAGRAM_APP_ID
App Secret: [YOUR_APP_SECRET] → INSTAGRAM_APP_SECRET
```

### **Step 7: Set Up Instagram Business Account**

#### **Requirements:**
- ✅ Instagram **Business** or **Creator** account (personal accounts won't work)
- ✅ Connected to a **Facebook Page**
- ✅ Page must be claimed by your Business Manager

#### **Steps:**
1. **Convert to Business Account:**
   - Open Instagram app → Settings → Account → Switch to Professional Account
   - Choose **Business** (recommended) or **Creator**

2. **Connect to Facebook Page:**
   - Instagram Settings → Account → Linked Accounts → Facebook
   - Connect to a Facebook page you manage

3. **Verify Business Manager Access:**
   - Go to https://business.facebook.com/
   - Ensure the Facebook page (and thus Instagram account) is in your Business Manager

---

## 🔧 **Testing Your Setup**

### **Step 1: Test Basic Configuration**
Use the **Graph API Explorer** (https://developers.facebook.com/tools/explorer/):

1. Select your app from dropdown
2. Generate **User Access Token** with permissions:
   - `instagram_basic`
   - `pages_show_list` 
3. Test this call:
```
GET /me/accounts
```
Should return your Facebook pages.

### **Step 2: Get Instagram Business Account ID**
1. From the pages result, find your connected page
2. Use the page's access token to call:
```
GET /{page-id}?fields=instagram_business_account
```
3. This gives you the **Instagram Business Account ID**

### **Step 3: Test Instagram API Calls**
With the Instagram Business Account ID:
```
GET /{instagram-business-account-id}?fields=id,username,account_type,media_count
```

---

## 📋 **Complete Credentials Checklist**

### **✅ For Your Environment Variables:**

```bash
# Public (Frontend - Vercel)
NEXT_PUBLIC_INSTAGRAM_APP_ID=[YOUR_APP_ID]
NEXT_PUBLIC_FACEBOOK_APP_ID=[YOUR_APP_ID]  # Same for Facebook integration

# Private (Backend - Render)  
INSTAGRAM_APP_SECRET=[YOUR_APP_SECRET]
FACEBOOK_APP_SECRET=[YOUR_APP_SECRET]      # Same for Facebook integration
```

### **✅ OAuth Flow URLs to Configure:**
```bash
# Development
http://localhost:3000/auth/instagram/callback

# Production  
https://pulsebridge.ai/auth/instagram/callback
```

### **✅ Required Permissions:**
```bash
# Basic (Auto-approved)
instagram_basic
pages_show_list

# Advanced (May need app review)
instagram_content_publish    # For posting content
instagram_manage_insights    # For analytics
pages_read_engagement       # For engagement metrics
```

---

## 🚀 **Next Steps After Getting Credentials**

### **Step 1: Add to Environment Variables**
```bash
# Add to Render (backend)
INSTAGRAM_APP_SECRET=[your_actual_secret]

# Add to Vercel (frontend)  
NEXT_PUBLIC_INSTAGRAM_APP_ID=[your_actual_app_id]
```

### **Step 2: Test OAuth Flow**
1. Visit: https://pulsebridge.ai/social-media
2. Click **"Connect Instagram Account"**
3. Should redirect to Instagram OAuth
4. Complete authorization
5. Should redirect back with access token

### **Step 3: Test Content Posting**
1. Use the **AI Composer** in your social media dashboard
2. Generate test content
3. Post to your Instagram Business account
4. Verify it appears on Instagram

---

## ⚠️ **Common Issues & Solutions**

### **Issue: "Invalid OAuth Redirect URI"**
**Solution:** 
- Double-check callback URLs in Instagram Basic Display settings
- Must match exactly: `https://pulsebridge.ai/auth/instagram/callback`

### **Issue: "Instagram Account Not Eligible"**
**Solution:**
- Ensure Instagram account is **Business** or **Creator** type
- Must be connected to a Facebook page in your Business Manager

### **Issue: "Permission Denied for instagram_content_publish"**
**Solution:**
- Request permission in **App Review** → **Permissions and Features**
- May take 1-2 weeks for Meta review
- Provide detailed use case description

### **Issue: "Can't Access Instagram Business Account"**
**Solution:**
- Verify Facebook page is in your Business Manager
- Check that Instagram account is properly linked to the page
- Use correct page access token (not user access token)

---

## 💡 **Pro Tips**

### **Development Strategy:**
1. **Start with Basic Display** - Get user info and media
2. **Test OAuth flow** - Ensure authentication works
3. **Request Advanced Permissions** - Submit for app review
4. **Implement Content Publishing** - Once permissions approved

### **Business Manager Setup:**
- Create a dedicated **Business Manager** for your agency
- Add all client Facebook pages to this Business Manager  
- This gives you centralized control over all Instagram Business accounts

### **App Review Tips:**
- **Be specific** about your use case in the review submission
- **Show screenshots** of your social media management platform
- **Explain the business need** for automated posting and analytics
- **Response time** is typically 1-2 weeks

Your existing Meta developer account puts you ahead of the game - you just need to configure the Instagram-specific products and permissions! 🎉

**Ready to start with Step 1?** Go to https://developers.facebook.com/ and let me know what you see in your app dashboard!