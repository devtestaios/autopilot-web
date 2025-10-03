-- ========================================
-- CREATE INDEXES FOR PERFORMANCE (SAFE VERSION)
-- Only creates indexes on columns that actually exist
-- ========================================

-- Safe index creation function
CREATE OR REPLACE FUNCTION create_index_if_column_exists(
    index_name text,
    table_name text,
    column_name text
) RETURNS void AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND c.relname = table_name
        AND a.attname = column_name
        AND a.attnum > 0
    ) THEN
        EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I(%I)', index_name, table_name, column_name);
        RAISE NOTICE 'Created index % on %.%', index_name, table_name, column_name;
    ELSE
        RAISE NOTICE 'Skipped index % - column %.% does not exist', index_name, table_name, column_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Email Marketing Indexes (only create if columns exist)
SELECT create_index_if_column_exists('idx_email_campaigns_status', 'email_campaigns', 'status');
SELECT create_index_if_column_exists('idx_email_campaigns_created_at', 'email_campaigns', 'created_at');
SELECT create_index_if_column_exists('idx_email_subscribers_email', 'email_subscribers', 'email');
SELECT create_index_if_column_exists('idx_email_subscribers_status', 'email_subscribers', 'status');
SELECT create_index_if_column_exists('idx_email_templates_template_type', 'email_templates', 'template_type');

-- Social Media Indexes
SELECT create_index_if_column_exists('idx_social_accounts_platform', 'social_media_accounts', 'platform');
SELECT create_index_if_column_exists('idx_social_accounts_is_active', 'social_media_accounts', 'is_active');
SELECT create_index_if_column_exists('idx_social_posts_account_id', 'social_media_posts', 'account_id');
SELECT create_index_if_column_exists('idx_social_posts_status', 'social_media_posts', 'status');
SELECT create_index_if_column_exists('idx_social_posts_scheduled_at', 'social_media_posts', 'scheduled_at');

-- Collaboration Indexes
SELECT create_index_if_column_exists('idx_team_members_email', 'team_members', 'email');
SELECT create_index_if_column_exists('idx_team_members_role', 'team_members', 'role');
SELECT create_index_if_column_exists('idx_team_activities_user_id', 'team_activities', 'user_id');
SELECT create_index_if_column_exists('idx_team_activities_created_at', 'team_activities', 'created_at');
SELECT create_index_if_column_exists('idx_projects_status', 'collaboration_projects', 'status');
SELECT create_index_if_column_exists('idx_projects_owner_id', 'collaboration_projects', 'owner_id');

-- Integration Indexes
SELECT create_index_if_column_exists('idx_integration_apps_category', 'integration_apps', 'category');
SELECT create_index_if_column_exists('idx_integration_apps_is_featured', 'integration_apps', 'is_featured');
SELECT create_index_if_column_exists('idx_user_integrations_app_id', 'user_integrations', 'app_id');
SELECT create_index_if_column_exists('idx_user_integrations_user_id', 'user_integrations', 'user_id');

-- Try to create indexes on ID columns (these should always exist)
CREATE INDEX IF NOT EXISTS idx_email_campaigns_id ON email_campaigns(id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_id ON email_subscribers(id);
CREATE INDEX IF NOT EXISTS idx_email_templates_id ON email_templates(id);
CREATE INDEX IF NOT EXISTS idx_social_media_accounts_id ON social_media_accounts(id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_id ON social_media_posts(id);
CREATE INDEX IF NOT EXISTS idx_team_members_id ON team_members(id);
CREATE INDEX IF NOT EXISTS idx_collaboration_projects_id ON collaboration_projects(id);
CREATE INDEX IF NOT EXISTS idx_integration_apps_id ON integration_apps(id);

-- Drop the helper function
DROP FUNCTION create_index_if_column_exists(text, text, text);

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Safe index creation completed!';
    RAISE NOTICE 'Check the messages above to see which indexes were created';
    RAISE NOTICE '========================================';
END $$;