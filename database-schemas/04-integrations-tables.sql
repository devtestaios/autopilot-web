-- ========================================
-- INTEGRATIONS DATABASE SCHEMA
-- ========================================

-- Integration Apps Table (App Marketplace)
CREATE TABLE IF NOT EXISTS integration_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('productivity', 'analytics', 'design', 'marketing', 'automation', 'crm', 'social', 'email', 'storage', 'communication')),
    subcategory VARCHAR(50),
    icon_url VARCHAR(500),
    banner_url VARCHAR(500),
    screenshot_urls TEXT[] DEFAULT '{}',
    developer VARCHAR(255) NOT NULL,
    developer_email VARCHAR(255),
    developer_website VARCHAR(500),
    website_url VARCHAR(500),
    documentation_url VARCHAR(500),
    support_url VARCHAR(500),
    privacy_policy_url VARCHAR(500),
    terms_of_service_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    pricing_model VARCHAR(20) DEFAULT 'free' CHECK (pricing_model IN ('free', 'paid', 'freemium', 'subscription')),
    pricing_details JSONB DEFAULT '{}',
    capabilities TEXT[] DEFAULT '{}',
    required_permissions TEXT[] DEFAULT '{}',
    supported_platforms TEXT[] DEFAULT '{}',
    api_version VARCHAR(20),
    webhook_url VARCHAR(500),
    oauth_config JSONB DEFAULT '{}',
    configuration_schema JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    install_count INTEGER DEFAULT 0,
    active_installs INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    version VARCHAR(20) DEFAULT '1.0.0'
);

-- User Integrations Table (Installed Apps)
CREATE TABLE IF NOT EXISTS user_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    user_id UUID, -- References team_members(id) but keeping flexible for now
    installation_name VARCHAR(255), -- User-defined name for this installation
    configuration JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}', -- Encrypted API keys, tokens, etc.
    is_active BOOLEAN DEFAULT true,
    auto_sync BOOLEAN DEFAULT false,
    sync_frequency VARCHAR(20) DEFAULT 'hourly' CHECK (sync_frequency IN ('manual', 'hourly', 'daily', 'weekly', 'real-time')),
    last_sync TIMESTAMPTZ,
    next_sync TIMESTAMPTZ,
    sync_status VARCHAR(20) DEFAULT 'connected' CHECK (sync_status IN ('connected', 'error', 'syncing', 'paused', 'disconnected')),
    sync_error_message TEXT,
    sync_stats JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    app_name VARCHAR(255), -- Denormalized for performance
    app_icon VARCHAR(500), -- Denormalized for performance
    
    UNIQUE(app_id, user_id)
);

-- Integration API Keys Table
CREATE TABLE IF NOT EXISTS integration_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    user_integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    key_type VARCHAR(50) DEFAULT 'api_key' CHECK (key_type IN ('api_key', 'oauth_token', 'webhook_secret', 'certificate')),
    encrypted_value TEXT NOT NULL, -- Always encrypted
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    last_used TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    permissions TEXT[] DEFAULT '{}',
    rate_limit_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_integration_id, key_name)
);

-- Integration Usage Logs Table
CREATE TABLE IF NOT EXISTS integration_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    user_id UUID, -- References team_members(id)
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    api_endpoint VARCHAR(255),
    request_method VARCHAR(10),
    response_status INTEGER,
    response_time_ms INTEGER,
    data_transferred_kb INTEGER DEFAULT 0,
    error_message TEXT,
    request_metadata JSONB DEFAULT '{}',
    response_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Partitioning by month for performance
    PARTITION BY RANGE (created_at)
);

-- Integration Webhooks Table
CREATE TABLE IF NOT EXISTS integration_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
    webhook_url VARCHAR(500) NOT NULL,
    secret_key VARCHAR(255),
    event_types TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    retry_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App Reviews and Ratings Table
CREATE TABLE IF NOT EXISTS app_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    user_id UUID, -- References team_members(id)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(app_id, user_id)
);

-- Integration Categories Table (for better organization)
CREATE TABLE IF NOT EXISTS integration_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(7), -- Hex color code
    parent_category_id UUID REFERENCES integration_categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    app_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration Marketplace Revenue Table
CREATE TABLE IF NOT EXISTS marketplace_revenue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES integration_apps(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
    revenue_type VARCHAR(30) NOT NULL CHECK (revenue_type IN ('installation', 'subscription', 'usage', 'commission')),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period VARCHAR(20) CHECK (billing_period IN ('one-time', 'monthly', 'yearly', 'usage-based')),
    transaction_id VARCHAR(255),
    payment_processor VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    revenue_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Data Sync Jobs Table
CREATE TABLE IF NOT EXISTS integration_sync_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('full_sync', 'incremental_sync', 'real_time_update', 'cleanup')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_details JSONB DEFAULT '{}',
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    next_job_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Integration Tables
CREATE INDEX IF NOT EXISTS idx_integration_apps_category ON integration_apps(category);
CREATE INDEX IF NOT EXISTS idx_integration_apps_featured ON integration_apps(is_featured);
CREATE INDEX IF NOT EXISTS idx_integration_apps_active ON integration_apps(is_active);
CREATE INDEX IF NOT EXISTS idx_integration_apps_rating ON integration_apps(rating DESC);
CREATE INDEX IF NOT EXISTS idx_integration_apps_installs ON integration_apps(install_count DESC);
CREATE INDEX IF NOT EXISTS idx_user_integrations_app ON user_integrations(app_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_active ON user_integrations(is_active);
CREATE INDEX IF NOT EXISTS idx_user_integrations_sync_status ON user_integrations(sync_status);
CREATE INDEX IF NOT EXISTS idx_api_keys_integration ON integration_api_keys(user_integration_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON integration_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_usage_integration ON integration_usage(integration_id);
CREATE INDEX IF NOT EXISTS idx_usage_app ON integration_usage(app_id);
CREATE INDEX IF NOT EXISTS idx_usage_created ON integration_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_app ON integration_webhooks(app_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON integration_webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_app ON app_reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON app_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON integration_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_revenue_app ON marketplace_revenue(app_id);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON marketplace_revenue(revenue_date);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_integration ON integration_sync_jobs(integration_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON integration_sync_jobs(status);

-- Row Level Security (RLS) Policies
ALTER TABLE integration_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_jobs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now)
CREATE POLICY "Allow all operations on integration_apps" ON integration_apps FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_integrations" ON user_integrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_api_keys" ON integration_api_keys FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_usage" ON integration_usage FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_webhooks" ON integration_webhooks FOR ALL USING (true);
CREATE POLICY "Allow all operations on app_reviews" ON app_reviews FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_categories" ON integration_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on marketplace_revenue" ON marketplace_revenue FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_sync_jobs" ON integration_sync_jobs FOR ALL USING (true);

-- Triggers for updating updated_at timestamp
CREATE TRIGGER update_integration_apps_updated_at BEFORE UPDATE ON integration_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON user_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON integration_api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON integration_webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON app_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON integration_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_jobs_updated_at BEFORE UPDATE ON integration_sync_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment app install count
CREATE OR REPLACE FUNCTION increment_install_count(app_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE integration_apps 
    SET install_count = install_count + 1,
        active_installs = active_installs + 1
    WHERE id = app_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update app ratings
CREATE OR REPLACE FUNCTION update_app_rating(app_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE integration_apps 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0.0)
            FROM app_reviews 
            WHERE app_reviews.app_id = integration_apps.id 
            AND is_published = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM app_reviews 
            WHERE app_reviews.app_id = integration_apps.id 
            AND is_published = true
        )
    WHERE id = app_id;
END;
$$ LANGUAGE plpgsql;