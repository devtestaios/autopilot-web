# 🚀 Render Environment Variables Setup Guide
**Complete step-by-step guide to configure social media API credentials in Render**

## 🎯 **Your Backend Deployment: https://autopilot-api-1.onrender.com**

### **📍 Where to Add Environment Variables in Render:**

1. **Go to your Render Dashboard**: https://dashboard.render.com/
2. **Select your backend service**: `autopilot-web-backend` (or similar name)
3. **Navigate to**: **Environment** → **Environment Variables**
4. **Add each variable** using the format below

---

## 🔧 **Environment Variables to Add in Render**

### **🔑 Backend Secrets (Add these to Render):**

```bash
# Facebook & Instagram Secrets
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
INSTAGRAM_APP_SECRET=a7d04912a36f6847993c7fe099a6b07a

# Twitter API Secrets  
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# LinkedIn API Secret
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# TikTok Business API Secret
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret_here

# YouTube Data API Secret (Optional)
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here

# Pinterest API Secret (Optional)
PINTEREST_APP_SECRET=your_pinterest_app_secret_here

# AI API Keys (for content generation)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase (if not already configured)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## 📋 **Step-by-Step Render Configuration**

### **Step 1: Access Your Backend Service**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your backend service (likely named something like `autopilot-web-backend`)
3. You should see your service URL: `https://autopilot-api-1.onrender.com`

### **Step 2: Navigate to Environment Variables**
1. In your service dashboard, click the **"Environment"** tab
2. Scroll down to **"Environment Variables"** section
3. Click **"Add Environment Variable"**

### **Step 3: Add Each Variable**
For each environment variable, add:

**Key**: `INSTAGRAM_APP_SECRET`  
**Value**: `68944f08577717087ddcfce75914fe5d`  
*Click "Add"*

**Key**: `FACEBOOK_APP_SECRET`  
**Value**: `your_facebook_app_secret_here`  
*Click "Add"*

**Key**: `TWITTER_CLIENT_SECRET`  
**Value**: `your_twitter_client_secret_here`  
*Click "Add"*

**Key**: `LINKEDIN_CLIENT_SECRET`  
**Value**: `your_linkedin_client_secret_here`  
*Click "Add"*

**Key**: `TIKTOK_CLIENT_SECRET`  
**Value**: `your_tiktok_client_secret_here`  
*Click "Add"*

### **Step 4: Add AI API Keys** (for content generation)
**Key**: `OPENAI_API_KEY`  
**Value**: `your_openai_api_key_here`  
*Click "Add"*

**Key**: `ANTHROPIC_API_KEY`  
**Value**: `your_anthropic_api_key_here`  
*Click "Add"*

### **Step 5: Deploy Changes**
1. After adding all variables, click **"Save Changes"**
2. Render will automatically **redeploy your backend** with the new environment variables
3. Wait for deployment to complete (usually 2-3 minutes)

---

## 🎯 **Frontend Environment Variables (Vercel)**

### **📍 Where to Add Frontend Variables:**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `autopilot-web` 
3. **Navigate to**: **Settings** → **Environment Variables**

### **🔑 Frontend Public Variables (Add these to Vercel):**

```bash
# Public API Keys (safe to expose)
NEXT_PUBLIC_FACEBOOK_APP_ID=1978667392867839
NEXT_PUBLIC_INSTAGRAM_APP_ID=1070854764927241
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id_here
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_tiktok_client_key_here

# Application URLs
NEXT_PUBLIC_BASE_URL=https://pulsebridge.ai
NEXT_PUBLIC_API_BASE=https://autopilot-api-1.onrender.com

# Supabase (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 **Testing Your Setup**

### **Step 1: Test Backend API**
```bash
# Test if environment variables are loaded
curl https://autopilot-api-1.onrender.com/api/social-media/oauth/platforms

# Should return list of configured platforms
```

### **Step 2: Test Frontend Integration**
1. Visit: https://pulsebridge.ai/social-media
2. Click **"Connect Instagram Account"** 
3. Should redirect to Instagram OAuth (if configured correctly)

### **Step 3: Check Backend Logs**
1. In Render dashboard → your service → **"Logs"** tab
2. Look for any environment variable errors
3. Restart service if needed: **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📊 **Current Status Based on Your Setup:**

### **✅ Already Configured:**
- ✅ **Instagram App ID**: `1070854764927241` ✓
- ✅ **Instagram App Secret**: `68944f08577717087ddcfce75914fe5d` ✓
- ✅ **Backend API**: Ready to receive environment variables
- ✅ **Frontend Service**: Ready for Instagram OAuth

### **📝 Next Steps:**
1. **Add Instagram credentials to Render** (you have these ready!)
2. **Test Instagram connection** on production
3. **Add other platforms** as you get their credentials
4. **Configure AI API keys** for content generation

---

## 🔧 **Quick Commands to Check Status:**

### **Check Backend Environment Variables:**
```bash
# Test if your backend can access the variables
curl https://autopilot-api-1.onrender.com/health

# Test social media OAuth platforms endpoint
curl https://autopilot-api-1.onrender.com/api/social-media/oauth/platforms
```

### **Local Development Test:**
```bash
# Update your .env.local with the Instagram credentials
echo "NEXT_PUBLIC_INSTAGRAM_APP_ID=1070854764927241" >> .env.local
echo "INSTAGRAM_APP_SECRET=68944f08577717087ddcfce75914fe5d" >> .env.local

# Test locally
npm run dev --turbopack
# Visit: http://localhost:3000/social-media
```

---

## 🚀 **Expected Results After Setup:**

### **Instagram Integration Working:**
- ✅ OAuth redirect to Instagram
- ✅ Successfully connect Instagram Business accounts
- ✅ Post content directly to Instagram
- ✅ Retrieve Instagram analytics and insights
- ✅ AI-powered content generation for Instagram

### **Backend API Responses:**
```json
// GET /api/social-media/oauth/platforms
{
  "platforms": [
    {
      "platform": "instagram", 
      "configured": true,
      "oauth_url": "https://api.instagram.com/oauth/authorize?..."
    }
  ]
}
```

---

## 💡 **Pro Tips:**

### **Security Best Practices:**
- ✅ **Secrets only in backend** (Render environment variables)
- ✅ **Public IDs in frontend** (Vercel environment variables)  
- ✅ **Never commit secrets** to version control
- ✅ **Rotate keys regularly** for security

### **Testing Strategy:**
1. **Start with Instagram** (you have credentials ready)
2. **Test OAuth flow** end-to-end
3. **Verify posting works** with test content
4. **Add other platforms** one by one

Your Instagram integration is **ready to go live** as soon as you add the `INSTAGRAM_APP_SECRET` to your Render environment variables! 🎉