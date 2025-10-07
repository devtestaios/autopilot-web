# 🔑 SUPABASE KEYS EXPLAINED - Legacy vs API Keys

## 📊 **KEY TYPES BREAKDOWN**

### **LEGACY KEYS** ✅ (Use These)
**Location**: Supabase Dashboard → Settings → API → **Legacy Keys tab**

#### **1. Anon (Public) Key**
- **Purpose**: Frontend client-side access
- **Permissions**: Limited, respects RLS policies
- **Use Case**: Vercel frontend environment variables
- **Security**: Safe to expose in browser

#### **2. Service Role (Secret) Key** ⭐
- **Purpose**: Backend server-side access
- **Permissions**: Full admin access, bypasses RLS
- **Use Case**: Render backend environment variables
- **Security**: Must stay secret, server-only

### **API KEYS** ❌ (Don't Use These)
**Location**: Supabase Dashboard → Settings → API → **API Keys tab**

#### **Publishable Key & Secret Key**
- **Purpose**: Third-party integrations and custom auth
- **Use Case**: External services, webhooks, custom auth flows
- **Not Needed**: For standard frontend/backend Supabase integration

## 🎯 **CORRECT CONFIGURATION**

### **VERCEL (Frontend)** - Use Legacy Anon Key
```
NEXT_PUBLIC_SUPABASE_URL=https://aggorhmzuhdirterhyej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Legacy Anon Public Key]
```

### **RENDER (Backend)** - Use Legacy Service Role Key
```
SUPABASE_URL=https://aggorhmzuhdirterhyej.supabase.co
SUPABASE_KEY=[Legacy Service Role Secret Key]
```

## 🔧 **ACTION REQUIRED**

### **Update Render Backend** (Critical Fix)
1. **Go to Render Dashboard** → `autopilot-api-1` → Environment
2. **Update SUPABASE_KEY** to your **Legacy Service Role Secret Key**
3. **Keep SUPABASE_URL** unchanged
4. **Deploy** the changes

### **Verify Vercel Frontend** (Should be correct already)
1. **Check Vercel** environment variables use **Legacy Anon Public Key**
2. **Should already be working** from your previous deployment

## 💡 **WHY LEGACY KEYS?**

### **Legacy Keys = Standard Supabase Integration**
- ✅ **Official Supabase documentation** recommends legacy keys
- ✅ **All tutorials and guides** use legacy keys
- ✅ **Supabase client libraries** designed for legacy keys
- ✅ **Production-ready** and battle-tested

### **API Keys = Advanced Custom Use Cases**
- 🔧 Custom authentication systems
- 🔧 Third-party service integrations
- 🔧 Webhook endpoints
- 🔧 Not needed for standard apps

## 🎯 **EXPECTED FIX**

Once you update Render to use the **Legacy Service Role Secret Key**:

### **Backend Health Check:**
```json
{
  "status": "healthy",
  "database": "operational",  // ← Should change from "error"
  "ai_services": {"service_healthy": true}
}
```

### **Database Endpoints:**
```bash
curl "https://autopilot-api-1.onrender.com/api/ai/cycles?limit=1"
# Should return: {"status": "success", "data": [...]}
# Instead of: "Internal Server Error"
```

## 📋 **QUICK CHECKLIST**

### **Render Backend Update:**
- [ ] Go to Render Dashboard
- [ ] Find `autopilot-api-1` service
- [ ] Go to Environment tab
- [ ] Update `SUPABASE_KEY` to **Legacy Service Role Secret Key**
- [ ] Save and wait for redeploy (3-5 minutes)

### **Verification:**
- [ ] Test health endpoint shows `"database": "operational"`
- [ ] Test AI endpoints return JSON data
- [ ] Confirm complete system integration

## 🚀 **BOTTOM LINE**

**Yes, stick with Legacy Keys!**
- **Frontend**: Legacy Anon Public Key ✅
- **Backend**: Legacy Service Role Secret Key ✅
- **Ignore**: API Keys tab (not needed for your use case)

The Legacy Service Role Secret Key will give your backend full database access and resolve all the "Internal Server Error" issues you're seeing.

---

**Next Step**: Update Render `SUPABASE_KEY` to Legacy Service Role Secret Key and redeploy!