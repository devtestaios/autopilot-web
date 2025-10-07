# 🔧 RENDER ENVIRONMENT VARIABLE UPDATE GUIDE

## 🎯 **QUICK FIX: Update to Service Role Key**

### **Step 1: Access Render Dashboard**
1. Go to https://dashboard.render.com
2. Click on your `autopilot-api-1` service
3. Navigate to **Environment** tab

### **Step 2: Update SUPABASE_KEY**
**Current Value (Anon Key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ29yaG16dWhkaXJ0ZXJoeWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDU0MTAsImV4cCI6MjA3MTM4MTQxMH0.3eFQjOK_P2fV3UcbH6BC_OB5UcvJPf43Eb9ze8gQyAc
```

**New Value (Service Role Key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ29yaG16dWhkaXJ0ZXJoeWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwNTQxMCwiZXhwIjoyMDcxMzgxNDEwfQ.tHazY5biN1jekA_zR2CNpL-o1-HoKiOoxSwExBZTtMg
```

### **Step 3: Deploy Changes**
1. Click **Save** or **Update Environment Variables**
2. Wait for the automatic redeploy (3-5 minutes)
3. Service will restart with new credentials

## ✅ **IMMEDIATE VERIFICATION**

After deployment completes, test these endpoints:

### **1. Health Check (Should Show Database Operational)**
```bash
curl https://autopilot-api-1.onrender.com/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T...",
  "database": "operational",
  "environment": "production"
}
```

### **2. AI Endpoints (Should Return Data)**
```bash
curl "https://autopilot-api-1.onrender.com/api/ai/cycles?limit=1"
```
**Expected Response:**
```json
{
  "status": "success",
  "data": [...],
  "count": 1
}
```

### **3. Leads Endpoint (Should Return Empty Array or Data)**
```bash
curl "https://autopilot-api-1.onrender.com/leads?limit=1"
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "...",
    "email": "...",
    "created_at": "..."
  }
]
```

## 🚀 **SUCCESS INDICATORS**

✅ **Health endpoint** shows `"database": "operational"`  
✅ **AI endpoints** return JSON data (not Internal Server Error)  
✅ **Leads endpoint** returns array (empty or with data)  
✅ **No more schema cache errors** in logs  

## ⚡ **IF STILL HAVING ISSUES**

If service role key doesn't resolve it immediately:

### **Option 1: Check Render Logs**
```bash
# In Render dashboard, check "Logs" tab for:
# - Connection errors
# - Authentication errors
# - Schema errors
```

### **Option 2: Alternative Environment Variable Names**
Some backends expect different variable names. Try adding:
```
SUPABASE_SERVICE_ROLE_KEY: eyJhbGci... (service role key)
DATABASE_URL: postgresql://... (if available)
```

### **Option 3: Restart Service Manually**
In Render dashboard:
1. Go to **Settings** tab
2. Click **Manual Deploy**
3. Deploy latest commit

## 🎯 **ESTIMATED RESOLUTION TIME**

- **Environment Variable Update**: 2 minutes
- **Render Redeploy**: 3-5 minutes
- **Testing & Verification**: 2 minutes
- **Total Time**: ~10 minutes

## ✅ **NEXT STEPS AFTER SUCCESS**

Once database connectivity is restored:

1. **Frontend Testing**: Verify dashboard loads AI data
2. **AI System Testing**: Test all 15 AI endpoints
3. **Complete System Verification**: End-to-end testing
4. **Documentation Update**: Mark connectivity as ✅ Complete

---

**The service role key should resolve this immediately. It's the standard solution for backend database access with Supabase.**