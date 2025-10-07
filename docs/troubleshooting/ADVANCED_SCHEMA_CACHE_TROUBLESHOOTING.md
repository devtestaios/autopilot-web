# 🔧 Persistent Schema Cache Error - Advanced Troubleshooting

## Current Status (October 3, 2025 - 19:08 UTC)

### ✅ Actions Completed
- ✅ Schema cache refresh executed in Supabase
- ✅ Render service restart initiated 
- ✅ Environment variables correctly configured (UPPERCASE)
- ✅ Service responding to health checks

### ❌ Persistent Issue
**Error Message:** "Could not query the database for the schema cache. Retrying."
**Impact:** API endpoints returning Internal Server Error

## 🔍 Advanced Diagnosis

### Possible Root Causes

1. **Supabase Project Settings Issue**
   - Project might be paused or suspended
   - Regional access restrictions
   - Database connection limits exceeded

2. **Service Role Key Permissions**
   - Key might not have proper schema access
   - Key might be from wrong project
   - Key might have been regenerated recently

3. **PostgREST Configuration**
   - Supabase's PostgREST service having issues
   - Schema introspection failing due to complex RLS policies
   - Database schema corruption or conflicts

4. **Network/Firewall Issues**
   - Render IP ranges blocked by Supabase
   - Connection timeout issues
   - SSL/TLS handshake problems

## 🛠️ Advanced Troubleshooting Steps

### Step 1: Verify Supabase Project Status
1. Go to Supabase Dashboard
2. Check project status indicator (should be green)
3. Look for any alerts or warnings
4. Verify project isn't paused

### Step 2: Test Direct Database Connection
Create a simple test script to verify database connectivity:

```python
import os
from supabase import create_client

# Test with your exact credentials
SUPABASE_URL = "your_supabase_url"
SUPABASE_KEY = "your_service_role_key"

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    result = supabase.table('leads').select("*").limit(1).execute()
    print("✅ Database connection successful")
    print(f"Data: {result}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
```

### Step 3: Check Service Role Key Validity
1. Go to Supabase → Settings → API
2. Copy the service_role secret key again
3. Verify it starts with `eyJ` (JWT format)
4. Check if it was recently regenerated

### Step 4: Regenerate Service Role Key
If the key seems invalid:
1. Go to Supabase → Settings → API
2. Click regenerate on service_role secret
3. Update Render environment variables
4. Restart service

### Step 5: Alternative Environment Variable Format
Try adding these additional variables to Render:
```
SUPABASE_SERVICE_ROLE_KEY=[service_role_value]
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Step 6: Check Supabase Logs
1. Go to Supabase → Logs
2. Look for connection errors or permission issues
3. Filter by API logs to see failed requests

## 🎯 Immediate Next Steps

### Option A: Key Regeneration (Recommended)
1. Regenerate service role key in Supabase
2. Update Render environment variables
3. Restart Render service
4. Test endpoints

### Option B: Direct Database URL
1. Get the direct PostgreSQL connection string from Supabase
2. Add as DATABASE_URL in Render
3. Modify backend to use direct connection if Supabase client fails

### Option C: Fallback to Anon Key (Temporary)
1. Temporarily use anon key in backend for testing
2. This will have RLS restrictions but should connect
3. Helps isolate if it's a key permission issue

## 📊 Expected Timeline
- Key regeneration + restart: 5-10 minutes
- Database connection test: Immediate
- Full resolution: 15-30 minutes

## 🚨 Escalation Path
If all steps fail:
1. Check Supabase status page for outages
2. Contact Supabase support with project reference
3. Consider temporary local database for development
4. Review Render service logs for additional error details

## 💡 Prevention
- Set up monitoring for database connectivity
- Create backup connection methods
- Document exact working configuration
- Regular health check automation