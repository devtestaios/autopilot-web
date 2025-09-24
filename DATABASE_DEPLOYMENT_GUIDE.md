# 🚀 PHASE C: DATABASE SCHEMA DEPLOYMENT GUIDE

## Overview
Deploy the comprehensive 8-table database schema for the PulseBridge.ai multi-platform marketing automation system.

## Prerequisites
- Supabase project created and accessible
- Admin access to Supabase SQL Editor
- Database connection established

## Deployment Steps

### Step 1: Access Supabase SQL Editor
1. Log into your Supabase dashboard
2. Navigate to **SQL Editor** tab
3. Create a new query

### Step 2: Execute Schema Deployment
```sql
-- Copy the entire contents of supabase_schema_deployment.sql
-- and execute in Supabase SQL Editor
```

### Step 3: Verify Schema Creation
After execution, verify these tables exist:
- [ ] `campaigns` - Core campaign data
- [ ] `performance_snapshots` - Daily performance metrics
- [ ] `leads` - Lead management and tracking
- [ ] `ai_decisions` - Autonomous AI decision log
- [ ] `platform_credentials` - Encrypted API credentials
- [ ] `automation_rules` - Campaign automation logic
- [ ] `alert_configurations` - Smart alerting system
- [ ] `sync_logs` - Multi-platform sync tracking

### Step 4: Enable Row Level Security (RLS)
The schema automatically enables RLS on all tables with permissive policies for development.

### Step 5: Test Database Connection
```bash
# Backend environment variables needed:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

## Database Architecture Features

### Multi-Platform Support
- **Google Ads**: google_ads_id, Google-specific metrics
- **Meta Ads**: meta_campaign_id, Meta-specific tracking  
- **LinkedIn Ads**: linkedin_campaign_id, LinkedIn metrics
- **Pinterest Ads**: pinterest_campaign_id, Pinterest analytics

### Advanced Features
- **AI Decision Logging**: Track autonomous decisions and outcomes
- **Performance Tracking**: Granular daily metrics with derived calculations
- **Lead Management**: Complete lead lifecycle tracking
- **Automation Rules**: Configurable campaign automation
- **Alert System**: Smart threshold-based alerting
- **Sync Management**: Multi-platform synchronization logs

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Encrypted credential storage** for API keys
- **Audit logging** for all data modifications
- **Permissive policies** for development (tighten for production)

## Verification Checklist
After deployment, verify:
- [ ] All 8 tables created successfully
- [ ] RLS policies applied correctly
- [ ] Extensions (uuid-ossp) enabled
- [ ] Sample data insertion works
- [ ] Backend connection successful

## Next Phase: Environment Configuration
Once database deployment is complete, proceed to Phase D: Environment Configuration for API key setup and platform authentication.

## Schema Size & Performance
- **8 comprehensive tables** with optimized indexes
- **JSONB support** for flexible platform-specific data
- **Timestamp tracking** for audit trails and sync management
- **Check constraints** for data integrity
- **Foreign key relationships** for referential integrity