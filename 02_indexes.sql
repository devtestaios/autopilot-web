-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Email Marketing Indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_analytics_campaign ON email_campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_analytics_event ON email_campaign_analytics(event_type);

-- Social Media Indexes
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_media_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_media_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_social_posts_account ON social_media_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_media_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_media_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_account ON social_media_analytics(account_id);

-- Collaboration Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_activities_user ON team_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created ON team_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON collaboration_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON collaboration_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user ON user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);

-- Integration Indexes
CREATE INDEX IF NOT EXISTS idx_integration_apps_category ON integration_apps(category);
CREATE INDEX IF NOT EXISTS idx_integration_apps_featured ON integration_apps(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_integrations_app ON user_integrations(app_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_usage_app ON integration_usage(app_id);
CREATE INDEX IF NOT EXISTS idx_integration_categories_parent ON integration_categories(parent_category_id);

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Performance indexes created successfully!';
END $$;