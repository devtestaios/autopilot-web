# 📋 **SUPABASE DATABASE COMPLETE REQUIREMENTS CHECKLIST**

## 🎯 **CRITICAL: What Must Exist Before/After Deployment**

Based on analysis of your codebase, here's the complete inventory of what your Supabase database needs:

## ✅ **REQUIRED TABLES (8 Total)**

### **1. 📊 campaigns** 
**Primary table for all campaign data across platforms**
```sql
Columns Required:
- id (UUID, Primary Key)
- name (TEXT, NOT NULL)
- platform (TEXT, CHECK: google_ads, meta, pinterest, linkedin)
- client_name (TEXT, NOT NULL)
- budget (NUMERIC)
- spend (NUMERIC, DEFAULT 0)
- status (TEXT, CHECK: active, paused, ended, draft)
- platform_config (JSONB)
- campaign_type (TEXT)
- target_audience (JSONB)
- keywords (JSONB)
- ad_groups (JSONB)
- start_date, end_date (TIMESTAMP WITH TIME ZONE)
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
- last_sync_at (TIMESTAMP WITH TIME ZONE)
- google_ads_id, meta_campaign_id, pinterest_campaign_id, linkedin_campaign_id (TEXT)
```
**Usage**: Referenced by frontend components (DashboardStats, GlobalSearch, campaign routes)

### **2. 📈 performance_snapshots**
**Daily performance metrics for campaigns**
```sql
Columns Required:
- id (UUID, Primary Key)
- campaign_id (UUID, Foreign Key to campaigns)
- date (DATE, NOT NULL)
- platform (TEXT, NOT NULL)
- impressions, clicks, conversions (INTEGER, DEFAULT 0)
- spend, revenue, ctr, cpc, cpa, cpm, roas (NUMERIC)
- platform_metrics (JSONB)
- quality_score (INTEGER)
- relevance_score (NUMERIC)
- created_at (TIMESTAMP WITH TIME ZONE)
- UNIQUE(campaign_id, date, platform)
```
**Usage**: Backend analytics engine, performance reports, optimization engine

### **3. 🔑 ad_accounts**
**Platform account credentials and settings**
```sql
Columns Required:
- id (UUID, Primary Key)
- platform (TEXT, CHECK: google_ads, meta, pinterest, linkedin)
- account_name, account_id (TEXT, NOT NULL)
- access_token, refresh_token (TEXT)
- token_expires_at (TIMESTAMP WITH TIME ZONE)
- currency (TEXT, DEFAULT 'USD')
- timezone (TEXT, DEFAULT 'UTC')
- status (TEXT, CHECK: active, inactive, suspended, pending)
- api_credentials (JSONB)
- auto_sync_enabled (BOOLEAN, DEFAULT true)
- sync_frequency (INTEGER, DEFAULT 24)
- last_sync_at (TIMESTAMP WITH TIME ZONE)
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
- UNIQUE(platform, account_id)
```
**Usage**: Platform integrations, sync engine, credential management

### **4. 🔍 keywords**
**Keyword tracking and optimization**
```sql
Columns Required:
- id (UUID, Primary Key)
- campaign_id (UUID, Foreign Key to campaigns)
- platform (TEXT, NOT NULL)
- keyword_text (TEXT, NOT NULL)
- match_type, bid_amount (varies)
- impressions, clicks, conversions (INTEGER, DEFAULT 0)
- cost (NUMERIC, DEFAULT 0)
- quality_score, first_page_cpc, top_page_cpc (NUMERIC)
- status (TEXT, CHECK: active, paused, removed)
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
```
**Usage**: Google Ads integration, keyword optimization, bid management

### **5. 🎯 audiences**
**Audience definitions and targeting**
```sql
Columns Required:
- id (UUID, Primary Key)
- platform (TEXT, CHECK: google_ads, meta, pinterest, linkedin)
- name (TEXT, NOT NULL)
- audience_type (TEXT)
- criteria (JSONB)
- size_estimate (INTEGER)
- platform_audience_id (TEXT)
- status (TEXT, CHECK: active, building, ready, error)
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
```
**Usage**: Targeting optimization, audience analysis, cross-platform sync

### **6. 👥 leads**
**Lead capture and management (WITH USER OWNERSHIP)**
```sql
Columns Required:
- id (UUID, Primary Key)
- email (TEXT, NOT NULL)
- name, company, phone (TEXT)
- source_platform (TEXT)
- source_campaign_id (UUID, Foreign Key to campaigns)
- source_ad_group, source_keyword (TEXT)
- lead_score (INTEGER, DEFAULT 0)
- status (TEXT, CHECK: new, contacted, qualified, converted, lost)
- utm_source, utm_medium, utm_campaign, landing_page (TEXT)
- first_seen_at, last_activity_at (TIMESTAMP WITH TIME ZONE)
- converted_at (TIMESTAMP WITH TIME ZONE)
- conversion_value (NUMERIC)
- created_by (UUID, DEFAULT auth.uid()) ← CRITICAL FOR RLS
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
```
**Usage**: GlobalSearch component, lead management, ROI tracking
**CRITICAL**: RLS policies require `created_by` for user ownership

### **7. 🔄 sync_logs**
**Multi-platform sync tracking and debugging**
```sql
Columns Required:
- id (UUID, Primary Key)
- platform (TEXT, NOT NULL)
- sync_type (TEXT, NOT NULL)
- status (TEXT, CHECK: success, error, partial)
- records_processed, records_updated, records_created, records_failed (INTEGER)
- error_message (TEXT)
- error_details (JSONB)
- started_at, completed_at (TIMESTAMP WITH TIME ZONE)
- duration_seconds (INTEGER)
- created_at (TIMESTAMP WITH TIME ZONE)
```
**Usage**: Sync engine monitoring, debugging, error tracking

### **8. 🤖 ai_insights**
**AI-generated recommendations and insights**
```sql
Columns Required:
- id (UUID, Primary Key)
- campaign_id (UUID, Foreign Key to campaigns)
- insight_type (TEXT, NOT NULL)
- priority (TEXT, CHECK: low, medium, high, critical)
- title (TEXT, NOT NULL)
- description, recommendation (TEXT)
- confidence_score (NUMERIC)
- expected_impact (TEXT)
- ai_model_used (TEXT)
- implemented (BOOLEAN, DEFAULT false)
- implemented_at (TIMESTAMP WITH TIME ZONE)
- results (JSONB)
- created_at, updated_at (TIMESTAMP WITH TIME ZONE)
```
**Usage**: AI chat service, optimization recommendations, autonomous decisions

## 🔧 **REQUIRED EXTENSIONS & FUNCTIONS**

### **Extensions**
```sql
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
```

### **Functions**
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
```

## 🛡️ **REQUIRED SECURITY (RLS)**

### **Critical Security Requirements:**
1. **All tables MUST have RLS enabled**
2. **Authenticated-only access** for most tables
3. **User ownership for leads table** (created_by = auth.uid())
4. **Proper policy naming** for consistency

## 📊 **REQUIRED INDEXES (Performance Critical)**

### **High-Priority Indexes:**
```sql
-- Campaign queries (used heavily by frontend)
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_name);

-- Performance data queries (analytics engine)
CREATE INDEX IF NOT EXISTS idx_performance_campaign_date ON performance_snapshots(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_platform_date ON performance_snapshots(platform, date DESC);

-- Lead management (GlobalSearch, user-specific queries)
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_source_campaign ON leads(source_campaign_id);

-- Foreign key performance
CREATE INDEX IF NOT EXISTS idx_performance_campaign_id ON performance_snapshots(campaign_id);
CREATE INDEX IF NOT EXISTS idx_keywords_campaign_id ON keywords(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_source_campaign_id ON leads(source_campaign_id);
```

## ✅ **SAMPLE DATA REQUIREMENTS**

### **Minimum Test Data:**
```sql
-- 3 sample campaigns (Google Ads, Meta, LinkedIn)
-- 7 days of performance data for testing
-- Unique constraints to prevent conflicts
```

## 🚨 **CRITICAL CHECKLIST BEFORE DEPLOYMENT**

### **Pre-Deployment Verification:**
- [ ] **Supabase project created and accessible**
- [ ] **Environment variables ready** (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] **SQL Editor access confirmed**
- [ ] **No existing conflicting tables**

### **Post-Deployment Verification:**
- [ ] **8 tables created successfully**
- [ ] **All triggers functioning** (updated_at columns)
- [ ] **RLS policies active** (test with authenticated user)
- [ ] **Sample data inserted** (3 campaigns + performance data)
- [ ] **Frontend can connect** (test GlobalSearch, DashboardStats)
- [ ] **Backend can connect** (test API endpoints)

## 📋 **DEPLOYMENT COMMAND**

Copy and execute the entire `supabase_schema_final_corrected.sql` file in your Supabase SQL Editor. This file contains:

✅ All 8 required tables
✅ All required indexes  
✅ All security policies
✅ Sample test data
✅ Comprehensive validation
✅ Success confirmation

**File Size**: 517 lines of production-ready SQL
**Estimated Execution Time**: 30-60 seconds
**Expected Output**: "PulseBridge.ai Database Schema Deployed Successfully! 🚀"

## 🎯 **WHAT YOUR APPLICATION EXPECTS**

Your codebase references these specific database patterns:
- **Frontend**: DashboardStats expects campaigns data structure
- **GlobalSearch**: Expects campaigns and leads tables
- **Backend**: AI chat expects ai_insights table
- **Analytics**: Expects performance_snapshots with proper date indexing
- **Sync Engine**: Expects sync_logs for monitoring
- **Multi-Platform**: Expects ad_accounts for credential management

**The provided SQL schema matches ALL these requirements perfectly.**