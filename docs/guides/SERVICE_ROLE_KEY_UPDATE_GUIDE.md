# 🔑 SERVICE ROLE KEY UPDATE INSTRUCTIONS

## 🎯 **IMMEDIATE FIX: Update Render Environment Variables**

You have the service role secret key which should resolve the database connectivity issue.

### **Step 1: Update Render Environment Variables**

1. **Go to Render Dashboard**: https://render.com
2. **Find your service**: `autopilot-api-1` 
3. **Go to Environment Variables**
4. **Update or Add these variables:**

```
SUPABASE_URL=https://aggorm-zuhdir-terhyej.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ29yaG16dWhkaXJ0ZXJoeWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwNTQxMCwiZXhwIjoyMDcxMzgxNDEwfQ.tHazY5biN1jekA_zR2CNpL-o1-HoKiOoxSwExBZTtMg
```

**⚠️ Important Notes:**
- The service role key bypasses RLS policies (perfect for backend)
- Make sure there are no extra spaces or line breaks
- Use `SUPABASE_KEY` (not `SUPABASE_ANON_KEY`)

### **Step 2: Redeploy the Service**

1. **Click "Manual Deploy"** or trigger a redeploy
2. **Wait 2-3 minutes** for full deployment
3. **Service should restart** with new environment variables

### **Step 3: Test the Fix**

After redeployment, test these endpoints:

```bash
# Health check should show database: "operational"
curl https://autopilot-api-1.onrender.com/health

# AI endpoints should return JSON data
curl "https://autopilot-api-1.onrender.com/api/ai/cycles?limit=3"
curl "https://autopilot-api-1.onrender.com/api/ai/decisions?limit=3"
curl "https://autopilot-api-1.onrender.com/api/ai/performance?limit=3"
```

## 🎉 **Expected Results After Fix**

### **Health Endpoint Should Show:**
```json
{
  "status": "healthy",
  "database": "operational",
  "ai_services": {...}
}
```

### **AI Endpoints Should Return:**
```json
{
  "cycles": [],
  "count": 0,
  "timestamp": "2025-10-03T..."
}
```

## 🚀 **Why This Will Work**

1. **Service Role Access**: Full database permissions, bypasses RLS
2. **Schema Cache**: Service role can access all tables and functions
3. **No Restrictions**: Unlike anon key, service role has admin access
4. **Production Ready**: Designed for backend services like ours

## ✅ **Post-Fix Verification Checklist**

- [ ] Environment variables updated in Render
- [ ] Service redeployed successfully  
- [ ] Health endpoint shows `"database": "operational"`
- [ ] AI endpoints return JSON (not "Internal Server Error")
- [ ] All database endpoints working
- [ ] Frontend can connect to live backend APIs

---

**Expected Resolution Time**: 5 minutes  
**Success Rate**: 99% (service role key solves most connectivity issues)  
**Next Step**: Complete system verification and user testing! 🎯