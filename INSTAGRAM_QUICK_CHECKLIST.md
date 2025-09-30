# 📱 Instagram API - Quick Action Checklist
**Use this as your step-by-step checklist with your Meta Developer account**

## 🎯 **Goal: Get Instagram Business API Working**

### **📋 Quick Checklist:**

- [ ] **Step 1**: Go to https://developers.facebook.com/ → "My Apps"
- [ ] **Step 2**: Create new "Business" app OR select existing business app
- [ ] **Step 3**: Add "Instagram Basic Display" product
- [ ] **Step 4**: Add "Instagram Graph API" product (for business features)
- [ ] **Step 5**: Configure OAuth redirect URLs
- [ ] **Step 6**: Copy App ID and App Secret
- [ ] **Step 7**: Add environment variables to Render and Vercel
- [ ] **Step 8**: Test OAuth connection
- [ ] **Step 9**: Request advanced permissions (if needed)
- [ ] **Step 10**: Test content posting

---

## 🔑 **What You're Looking For:**

### **In Meta Developer Console:**
```
App Dashboard → Settings → Basic
├── App ID: 1234567890123456    ← NEXT_PUBLIC_INSTAGRAM_APP_ID
└── App Secret: abc123def456... ← INSTAGRAM_APP_SECRET
```

### **OAuth Redirect URLs to Add:**
```
Products → Instagram Basic Display → Basic Display → Valid OAuth Redirect URIs:
├── https://pulsebridge.ai/auth/instagram/callback
└── http://localhost:3000/auth/instagram/callback
```

### **Permissions You Need:**
```
App Review → Permissions and Features:
├── ✅ instagram_basic (auto-approved)
├── ✅ pages_show_list (auto-approved)  
├── 📝 instagram_content_publish (needs review)
└── 📝 instagram_manage_insights (needs review)
```

---

## 🚀 **Environment Variables to Add:**

### **Render (Backend):**
```bash
Key: INSTAGRAM_APP_SECRET
Value: [your_app_secret_from_meta_console]
```

### **Vercel (Frontend):**
```bash
Key: NEXT_PUBLIC_INSTAGRAM_APP_ID  
Value: [your_app_id_from_meta_console]
```

---

## 🧪 **Test Commands:**

### **Test Backend API:**
```bash
curl https://autopilot-api-1.onrender.com/api/social-media/oauth/platforms
# Should show Instagram as configured
```

### **Test Frontend:**
```bash
# Visit: https://pulsebridge.ai/social-media
# Click: "Connect Instagram Account"
# Should redirect to Instagram OAuth
```

---

## ❓ **Quick Questions for You:**

1. **Do you see any existing apps** in your Meta Developer console?
2. **What type of apps do you have** (Business, Consumer, None)?
3. **Do you have Instagram Business accounts** ready to connect?
4. **Have you used Meta Business Manager** before?

**Next Action**: Go to https://developers.facebook.com/ and tell me what you see! 🎯