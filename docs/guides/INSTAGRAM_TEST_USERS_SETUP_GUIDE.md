# 👥 Instagram Test Users Setup Guide
**How to add test users and grant permissions for Instagram development testing**

## 🎯 **Overview: Test Users vs App Review**

### **Test Users (Development Mode):**
- ✅ **Manually add specific Instagram accounts** for testing
- ✅ **Full API access** for approved test users
- ✅ **No limits on functionality** - everything works
- ✅ **Perfect for development** and client demos

### **App Review (Production Mode):**
- 📝 **Any user can connect** after Meta approval
- 📝 **Public marketplace** ready
- 📝 **Required for unlimited users**

---

## 🔧 **Step-by-Step: Add Instagram Test Users**

### **Method 1: Add Test Users in Meta Console**

#### **Step 1: Access Test Users Section**
1. Go to your **Meta Developer Console**: https://developers.facebook.com/
2. Select your **PulseBridge.ai app**
3. In the left sidebar, click **"App roles"**
4. Click **"Test Users"**

#### **Step 2: Create or Add Test Users**
1. Click **"Add Test Users"**
2. **Option A: Create New Test User**
   - Click **"Create test user"**
   - Choose **"Instagram"** as the platform
   - Set **permissions** you need

3. **Option B: Add Existing Instagram Account**
   - Click **"Add existing test user"**
   - Enter the **Instagram username** or **User ID**
   - Send invitation to the account owner

#### **Step 3: Grant Instagram Permissions**
For each test user, grant these permissions:
```bash
✅ instagram_basic                # Basic profile access
✅ pages_show_list               # List Facebook pages
✅ instagram_content_publish     # Post content (development only)
✅ instagram_manage_insights     # Access analytics
```

---

### **Method 2: Add via Instagram Account Owner**

#### **Step 1: Instagram Account Owner Actions**
1. **Instagram account owner** goes to: https://developers.facebook.com/
2. **Logs in** with their Facebook account (linked to Instagram)
3. **Accepts test user invitation** from your app
4. **Grants permissions** for your app to access their Instagram

#### **Step 2: Verify Test User Status**
Back in your Meta Console:
1. **App roles** → **Test Users**
2. **Verify** the Instagram account appears as **"Active"**
3. **Check permissions** are granted correctly

---

## 🎯 **Alternative: Use Your Own Instagram Accounts**

### **Easiest Method for Development:**

#### **Step 1: Use Your Personal Instagram Business Account**
1. **Convert** your personal Instagram to **Business** account
2. **Connect** it to a Facebook page you manage
3. **Add yourself** as a test user in Meta Console

#### **Step 2: Use Team Instagram Accounts**
1. **Team members** convert their Instagram to Business
2. **Add each team member** as a test user
3. **Grant permissions** for development testing

#### **Step 3: Create Demo Instagram Accounts**
1. **Create new Instagram accounts** specifically for testing
2. **Convert to Business** accounts
3. **Add as test users** for unlimited testing

---

## 📋 **Required Instagram Account Setup**

### **Instagram Account Requirements:**
```bash
Account Type: ✅ Business or Creator (NOT Personal)
Facebook Page: ✅ Must be connected to a Facebook page
Business Manager: ✅ Page should be in your Business Manager
Verification: ✅ Complete business profile information
```

### **How to Convert Instagram to Business:**
1. **Open Instagram mobile app**
2. **Settings** → **Account** → **Switch to Professional Account**
3. **Choose "Business"** (recommended) or "Creator"
4. **Connect to Facebook page** you manage
5. **Complete business information**

---

## 🧪 **Testing Your Setup**

### **Step 1: Verify Test User Access**
```bash
# Test if your Instagram test user can authenticate
1. Visit: https://pulsebridge.ai/social-media
2. Click "Connect Instagram Account"
3. Log in with your test Instagram account
4. Should successfully grant permissions
5. Should redirect back to your platform
```

### **Step 2: Test API Functionality**
```bash
# After successful OAuth, test these features:
✅ Account information retrieval
✅ Post content to Instagram feed
✅ Access Instagram insights/analytics
✅ Upload media (photos/videos)
✅ Schedule posts for later
```

### **Step 3: Test AI Integration**
```bash
# Test your AI-powered features:
✅ AI content generation for Instagram
✅ Hashtag optimization
✅ Engagement predictions
✅ Optimal posting time suggestions
```

---

## 🚨 **Common Issues & Solutions**

### **Issue: "Instagram Account Not Eligible"**
**Solution:**
- ✅ Convert Instagram to **Business** account
- ✅ Connect to a **Facebook page** you manage
- ✅ Complete **business profile** information

### **Issue: "Permission Denied"**
**Solution:**
- ✅ Add Instagram account as **test user** in Meta Console
- ✅ Grant **all required permissions**
- ✅ Ensure account owner **accepts invitation**

### **Issue: "OAuth Redirect Failed"**
**Solution:**
- ✅ Check **redirect URI** in Meta Console settings
- ✅ Should be: `https://pulsebridge.ai/auth/instagram/callback`
- ✅ Verify **environment variables** are set correctly

### **Issue: "App Not Found"**
**Solution:**
- ✅ Check **App ID** matches in environment variables
- ✅ Verify **App Secret** is correctly set in Render
- ✅ Ensure app is in **Development mode** (not disabled)

---

## 💡 **Pro Tips for Test User Management**

### **Development Strategy:**
1. **Start small** - Add 2-3 test accounts initially
2. **Test core features** with limited accounts first
3. **Expand gradually** - Add more test users as needed
4. **Document workflows** - Track what works and what doesn't

### **Team Collaboration:**
1. **Add team members** as test users for collaborative testing
2. **Create shared test accounts** for consistent testing
3. **Use real business content** for authentic testing
4. **Rotate test accounts** to test different scenarios

### **Client Demos:**
1. **Use polished test accounts** with quality content
2. **Prepare demo scripts** showing key features
3. **Test beforehand** to ensure smooth demos
4. **Have backup accounts** ready in case of issues

---

## 🎯 **Your Test User Action Plan**

### **Immediate (Today):**
1. ✅ **Add environment variables** to Render and Vercel
2. ✅ **Convert your Instagram** to Business account (if needed)
3. ✅ **Add yourself** as test user in Meta Console
4. ✅ **Test OAuth flow** end-to-end

### **This Week:**
1. 👥 **Add team members** as test users
2. 📱 **Create demo Instagram accounts** for testing
3. 🧪 **Test all core features** with multiple accounts
4. 📊 **Validate AI content generation** quality

### **Next Week:**
1. 🎯 **Add client test accounts** (with permission)
2. 🚀 **Conduct user testing** sessions
3. 📈 **Optimize based on feedback**
4. 📝 **Prepare for Meta app review** submission

**Ready to add your first Instagram test user?** Start with your own Instagram Business account - it's the fastest way to get testing! 🚀