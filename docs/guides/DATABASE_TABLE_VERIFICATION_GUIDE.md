# 🛠️ Database Table Verification Guide

## Issue: Backend returns "Could not find table 'email_campaigns'"

### ✅ Good News: Supabase Connection Working!
- ✅ Backend connects to Supabase successfully
- ✅ Environment variables configured correctly
- ✅ Authentication working

### 🔍 Next Step: Verify Tables Exist in Database

**Please check your Supabase dashboard:**

1. **Go to supabase.com** → Your project
2. **Go to Table Editor** (left sidebar)
3. **Look for these tables:**
   - `email_campaigns`
   - `email_subscribers` 
   - `social_media_accounts`
   - `team_members`
   - `integration_apps`

### 📋 If Tables DON'T Exist:

Run the database schema deployment script again:

```sql
-- Go to Supabase → SQL Editor → New Query
-- Copy and paste the contents of COMPLETE_DATABASE_SCHEMA.sql
-- Click "Run"
```

### 📋 If Tables DO Exist:

The issue might be with permissions. Check:

1. **RLS (Row Level Security)** - Make sure it's enabled
2. **API permissions** - Ensure your anon key has access
3. **Table naming** - Verify exact table names match

### 🧪 Test Commands:

```bash
# Test backend connection
curl -s https://autopilot-api-1.onrender.com/debug/supabase

# Test table access (wait for deployment)
curl -s https://autopilot-api-1.onrender.com/debug/tables
```

### 🎯 Expected Outcome:

Once tables are verified/created, this should work:
```bash
curl -s https://autopilot-api-1.onrender.com/api/email-marketing/campaigns
# Should return: [] (empty array, not an error)
```