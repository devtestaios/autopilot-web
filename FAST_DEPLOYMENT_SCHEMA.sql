-- 🚀 FAST DEPLOYMENT DATABASE SCHEMA
-- Deploy this in Supabase SQL Editor to enable all API endpoints
-- October 3, 2025 - Complete Integration Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== EMAIL MARKETING TABLES =====
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    template_id UUID,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    tags TEXT[],
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    html_content TEXT,
    text_content TEXT,
    variables JSONB DEFAULT '{}',
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SOCIAL MEDIA TABLES =====
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    account_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_media_accounts(id),
    platform VARCHAR(50) NOT NULL,
    content TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    platform_post_id VARCHAR(255),
    engagement_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_media_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social_media_posts(id),
    platform VARCHAR(50) NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== COLLABORATION TABLES =====
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'member',
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    last_active TIMESTAMP WITH TIME ZONE,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES team_members(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collaboration_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    owner_id UUID REFERENCES team_members(id),
    team_members_ids UUID[],
    settings JSONB DEFAULT '{}',
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_presence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES team_members(id),
    status VARCHAR(50) DEFAULT 'offline',
    current_page VARCHAR(255),
    cursor_position JSONB,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INTEGRATION TABLES =====
CREATE TABLE IF NOT EXISTS integration_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    logo_url TEXT,
    website_url TEXT,
    pricing_model VARCHAR(50),
    base_price DECIMAL(10,2),
    features JSONB DEFAULT '[]',
    api_documentation_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    install_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES team_members(id),
    app_id UUID REFERENCES integration_apps(id),
    status VARCHAR(50) DEFAULT 'active',
    configuration JSONB DEFAULT '{}',
    api_credentials JSONB DEFAULT '{}',
    sync_settings JSONB DEFAULT '{}',
    last_sync TIMESTAMP WITH TIME ZONE,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES user_integrations(id),
    key_name VARCHAR(255) NOT NULL,
    api_key TEXT NOT NULL,
    api_secret TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES user_integrations(id),
    endpoint VARCHAR(255),
    requests_count INTEGER DEFAULT 0,
    data_transferred_mb DECIMAL(10,2) DEFAULT 0,
    success_rate DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RLS POLICIES (PERMISSIVE FOR DEVELOPMENT) =====
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_usage ENABLE ROW LEVEL SECURITY;

-- CREATE PERMISSIVE POLICIES FOR DEVELOPMENT (Simple approach)
-- Email Marketing Policies
CREATE POLICY "dev_policy_select_email_campaigns" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_email_campaigns" ON email_campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_email_campaigns" ON email_campaigns FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_email_campaigns" ON email_campaigns FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_email_subscribers" ON email_subscribers FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_email_subscribers" ON email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_email_subscribers" ON email_subscribers FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_email_subscribers" ON email_subscribers FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_email_templates" ON email_templates FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_email_templates" ON email_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_email_templates" ON email_templates FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_email_templates" ON email_templates FOR DELETE USING (true);

-- Social Media Policies
CREATE POLICY "dev_policy_select_social_media_accounts" ON social_media_accounts FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_social_media_accounts" ON social_media_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_social_media_accounts" ON social_media_accounts FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_social_media_accounts" ON social_media_accounts FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_social_media_posts" ON social_media_posts FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_social_media_posts" ON social_media_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_social_media_posts" ON social_media_posts FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_social_media_posts" ON social_media_posts FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_social_media_analytics" ON social_media_analytics FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_social_media_analytics" ON social_media_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_social_media_analytics" ON social_media_analytics FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_social_media_analytics" ON social_media_analytics FOR DELETE USING (true);

-- Collaboration Policies
CREATE POLICY "dev_policy_select_team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_team_members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_team_members" ON team_members FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_team_members" ON team_members FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_team_activities" ON team_activities FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_team_activities" ON team_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_team_activities" ON team_activities FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_team_activities" ON team_activities FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_collaboration_projects" ON collaboration_projects FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_collaboration_projects" ON collaboration_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_collaboration_projects" ON collaboration_projects FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_collaboration_projects" ON collaboration_projects FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_user_presence" ON user_presence FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_user_presence" ON user_presence FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_user_presence" ON user_presence FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_user_presence" ON user_presence FOR DELETE USING (true);

-- Integration Policies
CREATE POLICY "dev_policy_select_integration_apps" ON integration_apps FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_integration_apps" ON integration_apps FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_integration_apps" ON integration_apps FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_integration_apps" ON integration_apps FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_user_integrations" ON user_integrations FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_user_integrations" ON user_integrations FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_user_integrations" ON user_integrations FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_user_integrations" ON user_integrations FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_integration_api_keys" ON integration_api_keys FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_integration_api_keys" ON integration_api_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_integration_api_keys" ON integration_api_keys FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_integration_api_keys" ON integration_api_keys FOR DELETE USING (true);

CREATE POLICY "dev_policy_select_integration_usage" ON integration_usage FOR SELECT USING (true);
CREATE POLICY "dev_policy_insert_integration_usage" ON integration_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "dev_policy_update_integration_usage" ON integration_usage FOR UPDATE USING (true);
CREATE POLICY "dev_policy_delete_integration_usage" ON integration_usage FOR DELETE USING (true);

-- ===== SAMPLE DATA FOR TESTING =====
-- First, add missing columns if they don't exist
DO $$
BEGIN
    -- Add content column to email_campaigns if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_campaigns' AND column_name = 'content') THEN
        ALTER TABLE email_campaigns ADD COLUMN content TEXT;
    END IF;
    
    -- Add first_name column to team_members if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'team_members' AND column_name = 'first_name') THEN
        ALTER TABLE team_members ADD COLUMN first_name VARCHAR(100);
    END IF;
    
    -- Add last_name column to team_members if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'team_members' AND column_name = 'last_name') THEN
        ALTER TABLE team_members ADD COLUMN last_name VARCHAR(100);
    END IF;
    
    -- Add role column to team_members if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'team_members' AND column_name = 'role') THEN
        ALTER TABLE team_members ADD COLUMN role VARCHAR(50) DEFAULT 'member';
    END IF;
    
    -- Add username column to social_media_accounts if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'social_media_accounts' AND column_name = 'username') THEN
        ALTER TABLE social_media_accounts ADD COLUMN username VARCHAR(255);
    END IF;
    
    -- Add status column to social_media_accounts if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'social_media_accounts' AND column_name = 'status') THEN
        ALTER TABLE social_media_accounts ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    END IF;
END $$;

INSERT INTO email_campaigns (name, subject, content, status) VALUES 
('Welcome Series', 'Welcome to PulseBridge!', 'Welcome to our platform...', 'active'),
('Monthly Newsletter', 'Your Monthly Update', 'Here is your monthly update...', 'draft')
ON CONFLICT DO NOTHING;

INSERT INTO email_subscribers (email, first_name, last_name) VALUES 
('john@example.com', 'John', 'Smith'),
('jane@example.com', 'Jane', 'Doe')
ON CONFLICT DO NOTHING;

INSERT INTO social_media_accounts (platform, username, status) VALUES 
('instagram', 'pulsebridge_official', 'active'),
('twitter', 'pulsebridge', 'active')
ON CONFLICT DO NOTHING;

-- Insert team members data safely
DO $$
BEGIN
    -- Check if team_members needs a name column (some existing tables might have it)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'team_members' AND column_name = 'name' AND is_nullable = 'NO') THEN
        -- Insert with name column, check if records exist first
        IF NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'admin@pulsebridge.ai') THEN
            INSERT INTO team_members (name, email, first_name, last_name, role) 
            VALUES ('Admin User', 'admin@pulsebridge.ai', 'Admin', 'User', 'admin');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'user@pulsebridge.ai') THEN
            INSERT INTO team_members (name, email, first_name, last_name, role) 
            VALUES ('Test User', 'user@pulsebridge.ai', 'Test', 'User', 'member');
        END IF;
    ELSE
        -- Insert without name column, check if records exist first
        IF NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'admin@pulsebridge.ai') THEN
            INSERT INTO team_members (email, first_name, last_name, role) 
            VALUES ('admin@pulsebridge.ai', 'Admin', 'User', 'admin');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'user@pulsebridge.ai') THEN
            INSERT INTO team_members (email, first_name, last_name, role) 
            VALUES ('user@pulsebridge.ai', 'Test', 'User', 'member');
        END IF;
    END IF;
END $$;

INSERT INTO integration_apps (name, slug, description, category, pricing_model, base_price) VALUES 
('Google Analytics', 'google-analytics', 'Web analytics service', 'Analytics', 'freemium', 0.00),
('Mailchimp', 'mailchimp', 'Email marketing platform', 'Email Marketing', 'subscription', 9.99),
('Slack', 'slack', 'Team communication tool', 'Communication', 'freemium', 0.00)
ON CONFLICT DO NOTHING;

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

-- Success message
SELECT 'Database schema deployed successfully! All tables created with sample data.' AS result;