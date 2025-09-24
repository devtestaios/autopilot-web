"""
Database Schema and Configuration for PulseBridge.ai
Multi-Platform Marketing Automation Platform

This file contains the complete database schema for:
- Google Ads Integration
- Meta (Facebook) Integration  
- Pinterest Integration
- LinkedIn Integration
- Campaign Management
- Performance Tracking
- Multi-Platform Analytics
"""

# ================================
# SUPABASE DATABASE SCHEMA SETUP
# ================================

# Execute these SQL commands in your Supabase SQL Editor:

# 1. CORE CAMPAIGNS TABLE
campaigns_table_sql = """
-- Core campaigns table for multi-platform management
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  client_name TEXT NOT NULL,
  budget DECIMAL(10,2),
  spend DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'draft')),
  
  -- Platform-specific configuration
  platform_config JSONB DEFAULT '{}',
  
  -- Campaign metadata
  campaign_type TEXT, -- 'search', 'display', 'video', 'shopping', etc.
  target_audience JSONB DEFAULT '{}',
  keywords JSONB DEFAULT '[]',
  ad_groups JSONB DEFAULT '[]',
  
  -- Tracking and dates
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Platform-specific IDs
  google_ads_id TEXT,
  meta_campaign_id TEXT,
  pinterest_campaign_id TEXT,
  linkedin_campaign_id TEXT
);
"""

# 2. PERFORMANCE SNAPSHOTS TABLE
performance_snapshots_sql = """
-- Multi-platform performance tracking
CREATE TABLE IF NOT EXISTS performance_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  -- Core metrics (universal across platforms)
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Calculated metrics
  ctr DECIMAL(5,4), -- Click-through rate
  cpc DECIMAL(10,2), -- Cost per click
  cpa DECIMAL(10,2), -- Cost per acquisition
  cpm DECIMAL(10,2), -- Cost per mille
  roas DECIMAL(10,2), -- Return on ad spend
  
  -- Platform-specific metrics (stored as JSON)
  platform_metrics JSONB DEFAULT '{}',
  
  -- Quality and performance scores
  quality_score INTEGER,
  relevance_score DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date, platform)
);
"""

# 3. AD ACCOUNTS TABLE
ad_accounts_sql = """
-- Multi-platform ad accounts management
CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL, -- Platform-specific account ID
  
  -- Authentication and access
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Account metadata
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  account_status TEXT DEFAULT 'active',
  
  -- API credentials (encrypted)
  api_credentials JSONB DEFAULT '{}',
  
  -- Sync settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency INTEGER DEFAULT 24, -- hours
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(platform, account_id)
);
"""

# 4. KEYWORDS TABLE  
keywords_sql = """
-- Multi-platform keyword management
CREATE TABLE IF NOT EXISTS keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  keyword_text TEXT NOT NULL,
  match_type TEXT, -- 'exact', 'phrase', 'broad', 'broad_modified'
  bid_amount DECIMAL(10,2),
  
  -- Performance metrics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  
  -- Quality metrics
  quality_score INTEGER,
  first_page_cpc DECIMAL(10,2),
  top_page_cpc DECIMAL(10,2),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
"""

# 5. AUDIENCES TABLE
audiences_sql = """
-- Multi-platform audience management
CREATE TABLE IF NOT EXISTS audiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  audience_type TEXT, -- 'custom', 'lookalike', 'interest', 'demographic', 'remarketing'
  audience_size INTEGER,
  
  -- Targeting criteria
  targeting_config JSONB DEFAULT '{}',
  
  -- Platform-specific IDs
  platform_audience_id TEXT,
  
  -- Metadata
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(platform, platform_audience_id)
);
"""

# 6. ADS TABLE
ads_sql = """
-- Individual ad management across platforms
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  -- Ad content
  headline TEXT,
  description TEXT,
  display_url TEXT,
  final_url TEXT,
  
  -- Creative assets
  image_urls JSONB DEFAULT '[]',
  video_url TEXT,
  
  -- Ad configuration
  ad_type TEXT, -- 'text', 'image', 'video', 'carousel', etc.
  ad_format TEXT,
  
  -- Platform-specific data
  platform_ad_id TEXT,
  platform_config JSONB DEFAULT '{}',
  
  -- Performance (current period)
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
"""

# 7. SYNC LOGS TABLE
sync_logs_sql = """
-- Multi-platform sync operation tracking
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  operation_type TEXT NOT NULL, -- 'sync_campaigns', 'sync_performance', 'sync_keywords', etc.
  
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  
  -- Error tracking
  error_message TEXT,
  error_details JSONB,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  
  -- Additional metadata
  sync_metadata JSONB DEFAULT '{}'
);
"""

# 8. PLATFORM CONFIGURATIONS TABLE
platform_configs_sql = """
-- Platform-specific configuration settings
CREATE TABLE IF NOT EXISTS platform_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'pinterest', 'linkedin')),
  
  -- API Configuration
  api_version TEXT,
  api_base_url TEXT,
  rate_limit_per_hour INTEGER,
  
  -- Feature flags
  features_enabled JSONB DEFAULT '{}',
  
  -- Default settings
  default_settings JSONB DEFAULT '{}',
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(platform)
);
"""

# 9. RLS POLICIES
rls_policies_sql = """
-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_configs ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for authenticated users)
CREATE POLICY "Enable all operations for authenticated users" ON campaigns FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON performance_snapshots FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON ad_accounts FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON keywords FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON audiences FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON ads FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON sync_logs FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON platform_configs FOR ALL USING (true);
"""

# 10. INDEXES FOR PERFORMANCE
indexes_sql = """
-- Performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_name);

CREATE INDEX IF NOT EXISTS idx_performance_campaign_date ON performance_snapshots(campaign_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_performance_platform_date ON performance_snapshots(platform, date DESC);

CREATE INDEX IF NOT EXISTS idx_keywords_campaign ON keywords(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ads_campaign ON ads(campaign_id);

CREATE INDEX IF NOT EXISTS idx_sync_logs_platform_date ON sync_logs(platform, started_at DESC);
"""

# ================================
# SAMPLE DATA INSERTION
# ================================

sample_data_sql = """
-- Insert sample platform configurations
INSERT INTO platform_configs (platform, api_version, rate_limit_per_hour, features_enabled) VALUES
('google_ads', 'v15', 10000, '{"auto_bidding": true, "smart_campaigns": true}'),
('meta', 'v18.0', 600, '{"custom_audiences": true, "lookalike_audiences": true}'),
('pinterest', 'v5', 1000, '{"shopping_ads": true, "video_ads": true}'),
('linkedin', 'v2', 100, '{"sponsored_content": true, "message_ads": true}')
ON CONFLICT (platform) DO NOTHING;

-- Insert sample campaigns
INSERT INTO campaigns (name, platform, client_name, budget, status) VALUES
('Holiday Sale Campaign', 'google_ads', 'Tech Startup Inc', 5000.00, 'active'),
('Brand Awareness Push', 'meta', 'Fashion Brand LLC', 3000.00, 'active'),
('Product Showcase', 'pinterest', 'Home Decor Co', 2000.00, 'active'),
('B2B Lead Generation', 'linkedin', 'Software Solutions', 4000.00, 'active');
"""

if __name__ == "__main__":
    print("📊 PulseBridge.ai Multi-Platform Database Schema")
    print("=" * 60)
    print("Copy and paste the following SQL commands into your Supabase SQL Editor:")
    print("\n1. Core Tables:")
    print(campaigns_table_sql)
    print(performance_snapshots_sql)
    print(ad_accounts_sql)
    print(keywords_sql)
    print(audiences_sql)
    print(ads_sql)
    print(sync_logs_sql)
    print(platform_configs_sql)
    print("\n2. Security Policies:")
    print(rls_policies_sql)
    print("\n3. Performance Indexes:")
    print(indexes_sql)
    print("\n4. Sample Data:")
    print(sample_data_sql)