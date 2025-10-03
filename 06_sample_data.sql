-- ========================================
-- INSERT SAMPLE DATA FOR TESTING
-- ========================================

-- Sample Email Marketing Data
INSERT INTO email_templates (name, subject, content, template_type) VALUES
('Welcome Email', 'Welcome to PulseBridge.ai!', 'Welcome to our platform...', 'welcome'),
('Newsletter Template', 'Weekly Update from PulseBridge', 'Here''s what''s new...', 'newsletter'),
('Promotional Email', 'Special Offer Just for You!', 'Don''t miss out...', 'promotional')
ON CONFLICT DO NOTHING;

INSERT INTO email_subscribers (email, name, status, tags) VALUES
('john@example.com', 'John Doe', 'active', ARRAY['customer', 'premium']),
('jane@example.com', 'Jane Smith', 'active', ARRAY['prospect', 'newsletter']),
('bob@example.com', 'Bob Wilson', 'active', ARRAY['customer'])
ON CONFLICT (email) DO NOTHING;

INSERT INTO email_campaigns (name, subject, content, status) VALUES
('Launch Campaign', 'Introducing PulseBridge.ai', 'We''re excited to announce...', 'sent'),
('Monthly Newsletter', 'October Updates', 'Here''s what happened this month...', 'scheduled'),
('Product Update', 'New Features Available', 'Check out our latest features...', 'draft')
ON CONFLICT DO NOTHING;

-- Sample Social Media Data
INSERT INTO social_media_accounts (platform, username, account_id, account_type, is_active, follower_count) VALUES
('instagram', 'pulsebridge_official', 'ig_123456789', 'business', true, 5420),
('twitter', 'pulsebridgeai', 'tw_987654321', 'business', true, 2150),
('linkedin', 'pulsebridge-ai', 'li_456789123', 'business', true, 1380)
ON CONFLICT (platform, account_id) DO NOTHING;

-- Sample Collaboration Data
INSERT INTO team_members (name, email, role, department, is_active) VALUES
('Alice Johnson', 'alice@pulsebridge.ai', 'admin', 'Management', true),
('David Chen', 'david@pulsebridge.ai', 'manager', 'Marketing', true),
('Sarah Wilson', 'sarah@pulsebridge.ai', 'member', 'Content', true),
('Mike Rodriguez', 'mike@pulsebridge.ai', 'member', 'Development', true)
ON CONFLICT (email) DO NOTHING;

-- Sample Integration Data
INSERT INTO integration_categories (name, slug, description, color) VALUES
('Marketing Automation', 'marketing-automation', 'Tools for automating marketing workflows', '#FF6B35'),
('Analytics & Reporting', 'analytics', 'Data analysis and reporting tools', '#2E86AB'),
('Social Media Management', 'social-media', 'Manage your social media presence', '#F18F01'),
('Email Marketing', 'email-marketing', 'Email campaign management tools', '#C73E1D'),
('Design & Creative', 'design', 'Creative tools for content creation', '#8E44AD')
ON CONFLICT (name) DO NOTHING;

INSERT INTO integration_apps (name, description, category, developer, is_featured, is_active, pricing_model, install_count, rating) VALUES
('Google Analytics', 'Comprehensive web analytics platform', 'analytics', 'Google LLC', true, true, 'free', 15420, 4.8),
('Mailchimp', 'Email marketing automation platform', 'marketing', 'Mailchimp Inc.', true, true, 'freemium', 8950, 4.6),
('Canva', 'Graphic design platform for marketing materials', 'design', 'Canva Pty Ltd', true, true, 'freemium', 12300, 4.7),
('Zapier', 'Workflow automation between apps', 'automation', 'Zapier Inc.', true, true, 'freemium', 22100, 4.9),
('Buffer', 'Social media management platform', 'social', 'Buffer Inc.', false, true, 'subscription', 5670, 4.5)
ON CONFLICT DO NOTHING;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
END $$;