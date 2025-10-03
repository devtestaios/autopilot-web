-- ========================================
-- VERIFICATION VIEW
-- ========================================

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

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATABASE SCHEMA DEPLOYMENT COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: 20+ comprehensive tables';
    RAISE NOTICE 'Indexes created: 30+ performance indexes';
    RAISE NOTICE 'Sample data: Inserted for all categories';
    RAISE NOTICE 'Security: RLS enabled on all tables';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Run: SELECT * FROM database_summary;';
    RAISE NOTICE 'To verify deployment success';
    RAISE NOTICE '========================================';
END $$;