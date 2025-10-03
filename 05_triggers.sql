-- ========================================
-- CREATE UPDATE TRIGGERS
-- ========================================

-- Email Marketing Triggers
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_subscribers_updated_at BEFORE UPDATE ON email_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_automations_updated_at BEFORE UPDATE ON email_automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Social Media Triggers
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_media_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_comments_updated_at BEFORE UPDATE ON social_media_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Collaboration Triggers
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON collaboration_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Integration Triggers
CREATE TRIGGER update_integration_apps_updated_at BEFORE UPDATE ON integration_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON user_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integration_categories_updated_at BEFORE UPDATE ON integration_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Update triggers created successfully!';
END $$;