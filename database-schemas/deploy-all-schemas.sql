-- ========================================
-- MASTER DATABASE DEPLOYMENT SCRIPT
-- ========================================

-- This script deploys all database schemas in the correct order
-- Execute this in your Supabase SQL Editor or via CLI

\echo 'Starting comprehensive database schema deployment...'

-- Step 1: Create the update timestamp function first (needed by all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

\echo 'Created update_updated_at_column function'

-- Step 2: Deploy Email Marketing Schema
\i 01-email-marketing-tables.sql

\echo 'Email Marketing tables created successfully'

-- Step 3: Deploy Social Media Schema  
\i 02-social-media-tables.sql

\echo 'Social Media tables created successfully'

-- Step 4: Deploy Collaboration Schema
\i 03-collaboration-tables.sql

\echo 'Collaboration tables created successfully'

-- Step 5: Deploy Integrations Schema
\i 04-integrations-tables.sql

\echo 'Integrations tables created successfully'

-- Step 6: Insert sample data for testing
\echo 'Inserting sample data for testing...'

-- Sample Email Marketing Data
INSERT INTO email_templates (name, subject, content, template_type) VALUES
('Welcome Email', 'Welcome to PulseBridge.ai!', 'Welcome to our platform...', 'welcome'),
('Newsletter Template', 'Weekly Update from PulseBridge', 'Here''s what''s new...', 'newsletter'),
('Promotional Email', 'Special Offer Just for You!', 'Don''t miss out...', 'promotional');

INSERT INTO email_subscribers (email, name, status, tags) VALUES
('john@example.com', 'John Doe', 'active', ARRAY['customer', 'premium']),
('jane@example.com', 'Jane Smith', 'active', ARRAY['prospect', 'newsletter']),
('bob@example.com', 'Bob Wilson', 'active', ARRAY['customer']);

INSERT INTO email_campaigns (name, subject, content, status) VALUES
('Launch Campaign', 'Introducing PulseBridge.ai', 'We''re excited to announce...', 'sent'),
('Monthly Newsletter', 'October Updates', 'Here''s what happened this month...', 'scheduled'),
('Product Update', 'New Features Available', 'Check out our latest features...', 'draft');

-- Sample Social Media Data
INSERT INTO social_media_accounts (platform, username, account_id, account_type, is_active, follower_count) VALUES
('instagram', 'pulsebridge_official', 'ig_123456789', 'business', true, 5420),
('twitter', 'pulsebridgeai', 'tw_987654321', 'business', true, 2150),
('linkedin', 'pulsebridge-ai', 'li_456789123', 'business', true, 1380);

INSERT INTO social_media_posts (account_id, platform, content, status, post_type, hashtags, likes_count, comments_count) VALUES
((SELECT id FROM social_media_accounts WHERE platform = 'instagram' LIMIT 1), 'instagram', 'Exciting announcement coming soon! 🚀', 'published', 'post', ARRAY['#announcement', '#marketing', '#ai'], 42, 8),
((SELECT id FROM social_media_accounts WHERE platform = 'twitter' LIMIT 1), 'twitter', 'AI-powered marketing automation is the future. What do you think?', 'published', 'post', ARRAY['#AI', '#marketing', '#automation'], 18, 3),
((SELECT id FROM social_media_accounts WHERE platform = 'linkedin' LIMIT 1), 'linkedin', 'How we''re revolutionizing marketing with AI technology.', 'scheduled', 'post', ARRAY['#MarketingTech', '#AI'], 0, 0);

-- Sample Collaboration Data
INSERT INTO team_members (name, email, role, department, is_active) VALUES
('Alice Johnson', 'alice@pulsebridge.ai', 'admin', 'Management', true),
('David Chen', 'david@pulsebridge.ai', 'manager', 'Marketing', true),
('Sarah Wilson', 'sarah@pulsebridge.ai', 'member', 'Content', true),
('Mike Rodriguez', 'mike@pulsebridge.ai', 'member', 'Development', true);

INSERT INTO collaboration_projects (name, description, status, project_type, owner_id, team_members) VALUES
('Q4 Marketing Campaign', 'Launch campaign for Q4 product releases', 'active', 'marketing', 
 (SELECT id FROM team_members WHERE email = 'david@pulsebridge.ai' LIMIT 1),
 ARRAY[(SELECT id FROM team_members WHERE email = 'david@pulsebridge.ai'), (SELECT id FROM team_members WHERE email = 'sarah@pulsebridge.ai')]),
('Website Redesign', 'Complete redesign of the company website', 'active', 'design',
 (SELECT id FROM team_members WHERE email = 'alice@pulsebridge.ai' LIMIT 1),
 ARRAY[(SELECT id FROM team_members WHERE email = 'alice@pulsebridge.ai'), (SELECT id FROM team_members WHERE email = 'mike@pulsebridge.ai')]);

INSERT INTO team_activities (user_id, action, resource_type, resource_id, description, user_name) VALUES
((SELECT id FROM team_members WHERE email = 'david@pulsebridge.ai' LIMIT 1), 'created', 'project', (SELECT id FROM collaboration_projects LIMIT 1), 'Created new marketing campaign project', 'David Chen'),
((SELECT id FROM team_members WHERE email = 'sarah@pulsebridge.ai' LIMIT 1), 'updated', 'campaign', (SELECT id FROM email_campaigns LIMIT 1), 'Updated campaign content', 'Sarah Wilson'),
((SELECT id FROM team_members WHERE email = 'alice@pulsebridge.ai' LIMIT 1), 'published', 'post', (SELECT id FROM social_media_posts LIMIT 1), 'Published social media post', 'Alice Johnson');

-- Sample Integration Data
INSERT INTO integration_categories (name, slug, description, color) VALUES
('Marketing Automation', 'marketing-automation', 'Tools for automating marketing workflows', '#FF6B35'),
('Analytics & Reporting', 'analytics', 'Data analysis and reporting tools', '#2E86AB'),
('Social Media Management', 'social-media', 'Manage your social media presence', '#F18F01'),
('Email Marketing', 'email-marketing', 'Email campaign management tools', '#C73E1D'),
('Design & Creative', 'design', 'Creative tools for content creation', '#8E44AD');

INSERT INTO integration_apps (name, description, category, developer, is_featured, is_active, pricing_model, install_count, rating) VALUES
('Google Analytics', 'Comprehensive web analytics platform', 'analytics', 'Google LLC', true, true, 'free', 15420, 4.8),
('Mailchimp', 'Email marketing automation platform', 'marketing', 'Mailchimp Inc.', true, true, 'freemium', 8950, 4.6),
('Canva', 'Graphic design platform for marketing materials', 'design', 'Canva Pty Ltd', true, true, 'freemium', 12300, 4.7),
('Zapier', 'Workflow automation between apps', 'automation', 'Zapier Inc.', true, true, 'freemium', 22100, 4.9),
('Buffer', 'Social media management platform', 'social', 'Buffer Inc.', false, true, 'subscription', 5670, 4.5);

INSERT INTO user_integrations (app_id, user_id, is_active, sync_status, app_name, app_icon) VALUES
((SELECT id FROM integration_apps WHERE name = 'Google Analytics' LIMIT 1), (SELECT id FROM team_members WHERE email = 'david@pulsebridge.ai' LIMIT 1), true, 'connected', 'Google Analytics', 'https://example.com/ga-icon.png'),
((SELECT id FROM integration_apps WHERE name = 'Mailchimp' LIMIT 1), (SELECT id FROM team_members WHERE email = 'sarah@pulsebridge.ai' LIMIT 1), true, 'connected', 'Mailchimp', 'https://example.com/mc-icon.png'),
((SELECT id FROM integration_apps WHERE name = 'Buffer' LIMIT 1), (SELECT id FROM team_members WHERE email = 'alice@pulsebridge.ai' LIMIT 1), true, 'connected', 'Buffer', 'https://example.com/buffer-icon.png');

-- Create summary view for easy verification
CREATE OR REPLACE VIEW database_summary AS
SELECT 
    'Email Marketing' as category,
    'email_campaigns' as table_name,
    COUNT(*) as record_count
FROM email_campaigns
UNION ALL
SELECT 'Email Marketing', 'email_subscribers', COUNT(*) FROM email_subscribers
UNION ALL
SELECT 'Email Marketing', 'email_templates', COUNT(*) FROM email_templates
UNION ALL
SELECT 'Social Media', 'social_media_accounts', COUNT(*) FROM social_media_accounts
UNION ALL
SELECT 'Social Media', 'social_media_posts', COUNT(*) FROM social_media_posts
UNION ALL
SELECT 'Collaboration', 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'Collaboration', 'collaboration_projects', COUNT(*) FROM collaboration_projects  
UNION ALL
SELECT 'Collaboration', 'team_activities', COUNT(*) FROM team_activities
UNION ALL
SELECT 'Integrations', 'integration_apps', COUNT(*) FROM integration_apps
UNION ALL
SELECT 'Integrations', 'integration_categories', COUNT(*) FROM integration_categories
UNION ALL
SELECT 'Integrations', 'user_integrations', COUNT(*) FROM user_integrations
ORDER BY category, table_name;

\echo 'Database deployment completed successfully!'
\echo 'Total tables created: 64+'
\echo 'Sample data inserted for all categories'
\echo 'Run: SELECT * FROM database_summary; to verify deployment'

-- Final verification query
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%email_%' 
OR tablename LIKE '%social_%' 
OR tablename LIKE '%team_%' 
OR tablename LIKE '%collaboration_%' 
OR tablename LIKE '%integration_%'
ORDER BY tablename;