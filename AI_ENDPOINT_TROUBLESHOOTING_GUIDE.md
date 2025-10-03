# 🔧 AI ENDPOINT VERIFICATION & TROUBLESHOOTING GUIDE

## 🚨 **Current Issue Identified**

**Problem**: Supabase schema cache error preventing database queries
**Symptoms**: All endpoints returning "Internal Server Error" with schema cache message
**Root Cause**: Recent security fixes and function recreation need schema cache refresh

## 🛠️ **Immediate Solutions**

### **Option 1: Render Backend Restart (Recommended)**
1. Go to Render Dashboard: https://render.com
2. Find the `autopilot-api-1` service
3. Click "Manual Deploy" or "Restart Service"
4. Wait 2-3 minutes for full restart
5. Test endpoints again

### **Option 2: Supabase Schema Refresh**
Run this in Supabase SQL Editor:
```sql
-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Verify AI tables exist
SELECT 
    table_name,
    'Table exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'master_ai_cycles',
    'ai_decision_logs', 
    'ai_performance_scores',
    'ai_smart_alerts',
    'ai_recommendations'
)
ORDER BY table_name;
```

### **Option 3: Environment Variable Check**
Verify these are set in Render:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY` or `SUPABASE_ANON_KEY`: Your Supabase anon key

## 🧪 **Testing AI Endpoints After Fix**

### **Basic Health Check**
```bash
curl https://autopilot-api-1.onrender.com/health
```

### **AI Cycles Endpoint**
```bash
curl "https://autopilot-api-1.onrender.com/api/ai/cycles?limit=5"
```

### **AI Decisions Endpoint** 
```bash
curl "https://autopilot-api-1.onrender.com/api/ai/decisions?limit=5"
```

### **AI Performance Endpoint**
```bash
curl "https://autopilot-api-1.onrender.com/api/ai/performance?limit=5"
```

### **Expected Response Format**
```json
{
  "cycles": [...],
  "count": 0,
  "timestamp": "2025-10-03T17:45:00Z"
}
```

## ✅ **Verification Checklist**

- [ ] Backend service restarted in Render
- [ ] Health endpoint returns "healthy" status  
- [ ] Database status shows "operational" (not "error")
- [ ] AI endpoints return JSON (not "Internal Server Error")
- [ ] Frontend can load dashboard without API errors

## 🎯 **Next Steps After Resolution**

1. **Connect AI Dashboard**: Link frontend AI components to live endpoints
2. **Test Real-time Data**: Verify AI cycle creation and tracking
3. **Performance Monitoring**: Check AI decision logging and analytics
4. **User Acceptance Testing**: Deploy for business validation

## 🚨 **If Issues Persist**

1. Check Render logs for specific error details
2. Verify Supabase project is active and accessible
3. Ensure all environment variables are correctly set
4. Consider recreating the Render service if database connection is corrupted

---

**Expected Resolution Time**: 5-10 minutes with backend restart
**Success Indicator**: AI endpoints return JSON data instead of "Internal Server Error"