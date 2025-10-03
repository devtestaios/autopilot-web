-- ========================================
-- CHECK COLUMN EXISTENCE
-- ========================================

-- Check email_campaigns columns
SELECT 'email_campaigns' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'email_campaigns'
ORDER BY ordinal_position;

-- Check email_subscribers columns  
SELECT 'email_subscribers' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'email_subscribers'
ORDER BY ordinal_position;

-- Check social_media_accounts columns
SELECT 'social_media_accounts' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'social_media_accounts'
ORDER BY ordinal_position;

-- Check social_media_posts columns
SELECT 'social_media_posts' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'social_media_posts'
ORDER BY ordinal_position;

-- Check team_members columns
SELECT 'team_members' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'team_members'
ORDER BY ordinal_position;

-- Check collaboration_projects columns
SELECT 'collaboration_projects' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'collaboration_projects'
ORDER BY ordinal_position;

-- Check integration_apps columns
SELECT 'integration_apps' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'integration_apps'
ORDER BY ordinal_position;