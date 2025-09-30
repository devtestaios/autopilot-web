# 🔐 Multi-User Instagram Integration Setup Guide
**How to allow any PulseBridge.ai subscriber to connect their Instagram accounts**

## 🎯 **Current Status vs Production Requirements**

### **✅ What You Have Now (Development Mode):**
- Instagram API configured for **your accounts only**
- App in **Development Mode** (limited to test users)
- OAuth flow works for **developers and test users**

### **🚀 What You Need for Production (Any User):**
- Instagram API approved for **public use**
- App in **Live Mode** (available to all users)
- **App Review process** completed for advanced permissions
- **Business verification** completed

---

## 📋 **Step-by-Step Production Setup**

### **Step 1: App Review for Public Access**

#### **Required Permissions for User Accounts:**
```bash
# Basic Permissions (Usually Auto-Approved)
✅ instagram_basic               # User profile and media
✅ pages_show_list              # List user's Facebook pages

# Advanced Permissions (Require App Review)
📝 instagram_content_publish    # Post content on user's behalf
📝 instagram_manage_insights    # Access user's analytics
📝 pages_read_engagement       # Read engagement metrics
```

#### **How to Submit for App Review:**
1. **In Meta Developer Console**: App Review → Permissions and Features
2. **Request each advanced permission** individually
3. **Provide detailed use case** for each permission
4. **Submit screenshots** of your social media platform
5. **Wait for approval** (typically 1-2 weeks)

### **Step 2: Business Verification**

#### **Business Verification Requirements:**
- **Business Manager Account** (you likely have this)
- **Valid business documentation** (business license, tax ID)
- **Business website** (https://pulsebridge.ai ✓)
- **Contact information** verification

#### **How to Complete Business Verification:**
1. Go to **https://business.facebook.com/**
2. **Business Settings** → **Business Info** → **Business Verification**
3. Upload required documents:
   - Business registration/license
   - Tax identification documents
   - Proof of business address
4. **Wait for verification** (2-5 business days)

### **Step 3: Switch App to Live Mode**

#### **Prerequisites for Live Mode:**
- ✅ Basic permissions working in Development
- ✅ App Review completed for advanced permissions
- ✅ Business verification completed
- ✅ Privacy Policy and Terms of Service published

#### **Switch to Live:**
1. In Meta Developer Console → **App Settings** → **Basic**
2. Toggle **App Mode** from **Development** to **Live**
3. **Confirm** the switch (irreversible without support request)

---

## 🔧 **Technical Implementation for Multi-User**

### **OAuth Flow for Any User:**

#### **Current Flow (Development):**
```
User clicks "Connect Instagram" → 
Redirects to Instagram OAuth → 
User must be added as Test User → 
Limited to developer's accounts
```

#### **Production Flow (Any User):**
```
Any user clicks "Connect Instagram" → 
Redirects to Instagram OAuth → 
User logs in with their Instagram → 
Grants permissions → 
Returns access token → 
PulseBridge stores encrypted token in Supabase
```

### **User Account Management in Your Platform:**

#### **Database Schema (Already in place):**
```sql
-- User's connected social accounts
social_accounts (
    user_id,
    platform,
    platform_user_id,
    username,
    access_token,        -- Encrypted
    refresh_token,       -- Encrypted  
    expires_at,
    account_type,        -- Business/Creator/Personal
    connected_at
)

-- User's social media posts
social_posts (
    user_id,
    account_id,
    content,
    media_urls,
    scheduled_time,
    posted_at,
    status
)
```

#### **Access Token Management:**
```typescript
// Your platform already handles this in socialMediaService.ts
class SocialMediaAuthManager {
  async connectInstagramAccount(userId: string) {
    // 1. Generate OAuth URL with user-specific state
    // 2. Handle OAuth callback
    // 3. Exchange code for access token
    // 4. Store encrypted token in Supabase
    // 5. Fetch user's Instagram Business account info
  }
  
  async postToInstagram(userId: string, content: PostContent) {
    // 1. Retrieve user's encrypted access token
    // 2. Validate token (refresh if needed)
    // 3. Post content using Instagram API
    // 4. Store post record in database
  }
}
```

---

## 🚨 **Important Considerations for Production**

### **Privacy and Security:**
- **Access Token Storage**: Store encrypted in Supabase (your platform does this)
- **Token Rotation**: Implement refresh token logic for long-lived tokens
- **User Consent**: Clear consent forms for posting permissions
- **Data Retention**: Follow Meta's data usage policies

### **Rate Limiting and Quotas:**
- **Instagram API Limits**: 200 calls per user per hour
- **App-Level Limits**: Based on your app's approval status
- **User Education**: Inform users about posting frequency limits

### **Content Policies:**
- **Instagram Community Guidelines**: All posted content must comply
- **User Responsibility**: Users responsible for their content
- **Moderation**: Consider content review for automated posts

---

## 📊 **What Each App Review Permission Enables**

### **instagram_content_publish:**
```typescript
// Allows posting on behalf of users
await instagramAPI.createMedia({
  image_url: "https://example.com/photo.jpg",
  caption: "AI-generated content via PulseBridge.ai",
  access_token: userToken
});
```

### **instagram_manage_insights:**
```typescript
// Allows accessing user's analytics
await instagramAPI.getInsights({
  user_id: instagramUserId,
  metric: "impressions,reach,engagement",
  period: "day",
  access_token: userToken
});
```

### **pages_read_engagement:**
```typescript
// Allows reading engagement metrics
await facebookAPI.getPagePosts({
  page_id: facebookPageId,
  fields: "likes,comments,shares,reactions",
  access_token: userToken
});
```

---

## 🎯 **Your Action Plan for Production**

### **Phase 1: App Review Submission (This Week)**
1. **Document your use cases** for each permission
2. **Take screenshots** of your social media platform
3. **Submit app review** for instagram_content_publish
4. **Submit app review** for instagram_manage_insights

### **Phase 2: Business Verification (Parallel)**
1. **Gather business documents** (license, tax ID, etc.)
2. **Submit business verification** in Business Manager
3. **Wait for approval** (2-5 days)

### **Phase 3: Testing and Launch (After Approval)**
1. **Switch app to Live Mode**
2. **Test with real user accounts** (not just test users)
3. **Monitor API usage and errors**
4. **Launch to all PulseBridge.ai subscribers**

---

## 📝 **App Review Submission Template**

### **Use Case Description for instagram_content_publish:**
```
PulseBridge.ai is a professional social media management platform that helps businesses automate their Instagram marketing. Users explicitly grant permission to post AI-generated content on their behalf through our platform.

Key Features:
- AI-powered content generation with user approval
- Scheduled posting for optimal engagement times  
- Multi-account management for agencies
- Content calendar and planning tools

User Flow:
1. User connects their Instagram Business account via OAuth
2. User creates content using our AI tools
3. User reviews and approves content before posting
4. System posts content at user-specified times
5. User receives analytics and performance insights

We request instagram_content_publish to enable automated posting functionality that our business users depend on for their marketing operations.
```

---

## 🚀 **Expected Timeline**

### **Realistic Timeline for Full Production:**
- **Week 1**: Submit app review applications
- **Week 2-3**: Wait for Meta review and approval
- **Week 3**: Complete business verification (if not done)
- **Week 4**: Switch to Live Mode and test with real users
- **Week 4+**: Launch to all PulseBridge.ai subscribers

### **What You Can Do While Waiting:**
- ✅ **Test extensively** with development mode
- ✅ **Refine user experience** and error handling
- ✅ **Prepare customer support** documentation
- ✅ **Set up monitoring** and logging systems

---

## 💡 **Pro Tips for App Review Success**

### **Increase Approval Chances:**
1. **Be specific** about your use case and user benefits
2. **Show screenshots** of the actual platform interface
3. **Demonstrate user consent** flows clearly
4. **Follow Meta's developer policies** exactly
5. **Respond quickly** to any review feedback

### **Common Rejection Reasons:**
- ❌ **Vague use case descriptions**
- ❌ **Missing user consent flows**
- ❌ **Violating content policies**
- ❌ **Incomplete business verification**
- ❌ **Poor user experience in screenshots**

Your Instagram integration is **technically ready** - you just need Meta's approval for public use! 🎉