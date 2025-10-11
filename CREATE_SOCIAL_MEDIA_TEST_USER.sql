-- ===============================================
-- SOCIAL MEDIA SUITE TEST USER SETUP
-- PulseBridge.ai - Hyper-Specific Suite Testing
-- ===============================================
-- Creates a dedicated test user with pre-populated social media data
-- for testing all social media features in isolation

-- ===============================================
-- STEP 1: CREATE TEST USER IN SUPABASE DASHBOARD
-- ===============================================
/*
MANUAL STEP - Do this first in Supabase Dashboard:

1. Go to: Authentication → Users → Add user
2. Create:
   - Email: social-test@pulsebridge.ai
   - Password: SocialTest123
   - ✅ Auto Confirm User
3. COPY THE USER ID (you'll need it below)
*/

-- ===============================================
-- STEP 2: CREATE TEST COMPANY FOR SOCIAL MEDIA USER
-- ===============================================

-- Create a test company for social media testing
INSERT INTO public.companies (
  id,
  name,
  slug,
  subscription_tier,
  account_status,
  user_limit,
  settings,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Social Media Test Company',
  'social-test-company',
  'professional_agency', -- Full access to social features
  'active',
  5,
  '{
    "brand_colors": ["#1DA1F2", "#E1306C", "#0A66C2"],
    "default_timezone": "America/New_York",
    "approval_workflow_enabled": false
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug;

-- Note the company ID from above (SOCIAL_COMPANY_ID)

-- ===============================================
-- STEP 3: CREATE TEST USER PROFILE
-- ===============================================

-- Replace USER_ID_FROM_AUTH and COMPANY_ID_FROM_ABOVE
INSERT INTO public.profiles (
  id, -- MUST match auth.users ID
  email,
  username,
  display_name,
  first_name,
  last_name,
  company_id,
  role,
  account_status,
  subscription_tier,
  email_verified,
  preferences,
  created_at,
  updated_at
) VALUES (
  'USER_ID_FROM_AUTH'::uuid, -- Replace with actual auth user ID
  'social-test@pulsebridge.ai',
  'socialtest',
  'Social Media Tester',
  'Social',
  'Tester',
  'COMPANY_ID_FROM_ABOVE'::uuid, -- Replace with company ID
  'campaign_manager', -- Has permissions for social media management
  'active',
  'professional_agency',
  TRUE,
  '{
    "theme": "light",
    "language": "en",
    "timezone": "America/New_York",
    "notifications": {
      "email": true,
      "push": true,
      "digest_frequency": "daily"
    },
    "dashboard": {
      "default_layout": "social-media",
      "sidebar_collapsed": false
    },
    "social_media": {
      "default_platforms": ["instagram", "facebook", "twitter"],
      "auto_schedule_enabled": true,
      "best_time_posting": true
    }
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  account_status = 'active',
  email_verified = TRUE,
  role = 'campaign_manager',
  updated_at = NOW();

-- ===============================================
-- STEP 4: GRANT SOCIAL MEDIA PERMISSIONS
-- ===============================================

INSERT INTO public.user_permissions (user_id, resource, action, is_active)
SELECT
  'USER_ID_FROM_AUTH'::uuid,
  resource,
  action,
  TRUE
FROM (
  VALUES
    ('social_media', 'create'),
    ('social_media', 'read'),
    ('social_media', 'update'),
    ('social_media', 'delete'),
    ('social_media', 'publish'),
    ('social_media_accounts', 'create'),
    ('social_media_accounts', 'read'),
    ('social_media_accounts', 'update'),
    ('social_media_posts', 'create'),
    ('social_media_posts', 'read'),
    ('social_media_posts', 'update'),
    ('social_media_posts', 'delete'),
    ('social_media_posts', 'publish'),
    ('social_media_analytics', 'read'),
    ('social_media_calendar', 'create'),
    ('social_media_calendar', 'read'),
    ('social_media_calendar', 'update')
) AS permissions(resource, action)
ON CONFLICT (user_id, resource, action) DO UPDATE SET is_active = TRUE;

-- ===============================================
-- STEP 5: CREATE TEST SOCIAL MEDIA ACCOUNTS
-- ===============================================

-- Insert test social media accounts for all platforms
INSERT INTO public.social_media_accounts (
  id,
  user_id,
  platform,
  username,
  account_id,
  account_type,
  is_active,
  follower_count,
  following_count,
  post_count,
  profile_data,
  created_at,
  updated_at
) VALUES
  -- Instagram Business Account
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    'instagram',
    '@pulsebridge_test',
    'test_instagram_12345',
    'business',
    TRUE,
    15420,
    892,
    247,
    '{
      "bio": "AI-Powered Marketing Automation | Social Media Management | Test Account",
      "website": "https://pulsebridge.ai",
      "profile_pic": "https://placeholder.com/150",
      "verified": false,
      "category": "Marketing Agency"
    }'::jsonb,
    NOW() - INTERVAL '90 days',
    NOW()
  ),
  -- Facebook Page
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    'facebook',
    'PulseBridge Test Page',
    'test_facebook_67890',
    'business',
    TRUE,
    8932,
    0,
    184,
    '{
      "about": "AI Marketing Automation Platform - Test Account",
      "category": "Software Company",
      "page_url": "https://facebook.com/pulsebridgetest",
      "verified": false,
      "rating": 4.7,
      "reviews_count": 23
    }'::jsonb,
    NOW() - INTERVAL '120 days',
    NOW()
  ),
  -- Twitter/X Business Account
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    'twitter',
    '@pulsebridge_ai',
    'test_twitter_24680',
    'business',
    TRUE,
    24567,
    1834,
    1456,
    '{
      "bio": "🚀 AI-Powered Marketing Automation | Test Account",
      "location": "San Francisco, CA",
      "website": "https://pulsebridge.ai",
      "verified": false,
      "protected": false
    }'::jsonb,
    NOW() - INTERVAL '180 days',
    NOW()
  ),
  -- LinkedIn Company Page
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    'linkedin',
    'PulseBridge AI Test',
    'test_linkedin_13579',
    'business',
    TRUE,
    5423,
    0,
    89,
    '{
      "company_size": "11-50",
      "industry": "Software Development",
      "headquarters": "San Francisco, CA",
      "specialties": ["AI", "Marketing Automation", "Social Media"],
      "verified": false
    }'::jsonb,
    NOW() - INTERVAL '60 days',
    NOW()
  ),
  -- TikTok Business Account
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    'tiktok',
    '@pulsebridgeai',
    'test_tiktok_98765',
    'business',
    TRUE,
    31245,
    234,
    67,
    '{
      "bio": "AI Marketing Magic ✨ | Test Account",
      "verified": false,
      "likes_count": 145678,
      "video_views": 2456789
    }'::jsonb,
    NOW() - INTERVAL '30 days',
    NOW()
  );

-- Store account IDs for later use
CREATE TEMP TABLE temp_social_accounts AS
SELECT id, platform FROM social_media_accounts
WHERE user_id = 'USER_ID_FROM_AUTH'::uuid;

-- ===============================================
-- STEP 6: CREATE TEST POSTS (Draft, Scheduled, Published)
-- ===============================================

-- Get Instagram account ID
WITH instagram_account AS (
  SELECT id FROM temp_social_accounts WHERE platform = 'instagram' LIMIT 1
),
facebook_account AS (
  SELECT id FROM temp_social_accounts WHERE platform = 'facebook' LIMIT 1
),
twitter_account AS (
  SELECT id FROM temp_social_accounts WHERE platform = 'twitter' LIMIT 1
)

INSERT INTO public.social_media_posts (
  id,
  user_id,
  account_id,
  platform,
  content,
  media_urls,
  scheduled_at,
  published_at,
  status,
  post_type,
  hashtags,
  mentions,
  likes_count,
  comments_count,
  shares_count,
  reach,
  impressions,
  engagement_rate,
  created_at,
  updated_at
) VALUES
  -- DRAFT POSTS
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM instagram_account),
    'instagram',
    '🚀 Exciting new AI features coming soon! Get ready to revolutionize your marketing strategy. What feature would you love to see?',
    ARRAY['https://placeholder.com/1080x1080/draft1.jpg'],
    NULL,
    NULL,
    'draft',
    'post',
    ARRAY['#AI', '#MarketingAutomation', '#SocialMedia', '#Innovation'],
    ARRAY['@influencer1', '@brandpartner'],
    0, 0, 0, 0, 0, 0.0,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM facebook_account),
    'facebook',
    'Check out our latest blog post on social media trends for 2025! Link in bio. 📊',
    ARRAY['https://placeholder.com/1200x630/draft2.jpg'],
    NULL,
    NULL,
    'draft',
    'post',
    ARRAY['#SocialMediaMarketing', '#Trends2025', '#DigitalMarketing'],
    ARRAY[],
    0, 0, 0, 0, 0, 0.0,
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '3 hours'
  ),

  -- SCHEDULED POSTS
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM instagram_account),
    'instagram',
    '✨ Monday Motivation: Success is not final, failure is not fatal. Keep pushing forward! 💪',
    ARRAY['https://placeholder.com/1080x1080/scheduled1.jpg'],
    NOW() + INTERVAL '2 days',
    NULL,
    'scheduled',
    'post',
    ARRAY['#MondayMotivation', '#Success', '#Inspiration', '#Marketing'],
    ARRAY[],
    0, 0, 0, 0, 0, 0.0,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM twitter_account),
    'twitter',
    '🔥 Hot take: AI will not replace marketers, but marketers who use AI will replace those who don''t. Thoughts?',
    ARRAY[],
    NOW() + INTERVAL '1 day',
    NULL,
    'scheduled',
    'post',
    ARRAY['#AIMarketing', '#FutureOfWork', '#MarketingTech'],
    ARRAY[],
    0, 0, 0, 0, 0, 0.0,
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM facebook_account),
    'facebook',
    'Join us for a FREE webinar: "Mastering Social Media in 2025" 🎓 Register now! Link in comments.',
    ARRAY['https://placeholder.com/1200x630/scheduled3.jpg'],
    NOW() + INTERVAL '5 days',
    NULL,
    'scheduled',
    'post',
    ARRAY['#Webinar', '#SocialMedia', '#FreeLearning'],
    ARRAY[],
    0, 0, 0, 0, 0, 0.0,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),

  -- PUBLISHED POSTS (with engagement data)
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM instagram_account),
    'instagram',
    'Behind the scenes at PulseBridge HQ! Our team working on the next big feature 💻✨',
    ARRAY['https://placeholder.com/1080x1080/published1.jpg'],
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    'published',
    'post',
    ARRAY['#BehindTheScenes', '#TechLife', '#Startup', '#AI'],
    ARRAY['@teammember1', '@teammember2'],
    1247, 89, 34, 8932, 12456, 14.35,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM instagram_account),
    'instagram',
    '🎉 We just hit 15K followers! Thank you for being part of our journey. Here''s to the next milestone! 🚀',
    ARRAY['https://placeholder.com/1080x1080/published2.jpg'],
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days',
    'published',
    'post',
    ARRAY['#Milestone', '#ThankYou', '#Community', '#Growth'],
    ARRAY[],
    2134, 156, 67, 15234, 21890, 17.82,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '7 days'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM twitter_account),
    'twitter',
    'Just shipped a major update! 🎯 New AI-powered scheduling, advanced analytics, and multi-platform posting. Check it out! 🔗',
    ARRAY['https://placeholder.com/1200x675/published3.jpg'],
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    'published',
    'post',
    ARRAY['#ProductUpdate', '#AI', '#SocialMedia', '#Tech'],
    ARRAY['@techcrunch', '@producthunt'],
    567, 45, 123, 24567, 34890, 12.45,
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM facebook_account),
    'facebook',
    'Client success story: How Company X increased their social media ROI by 340% in 90 days using PulseBridge AI 📈',
    ARRAY['https://placeholder.com/1200x630/published4.jpg'],
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days',
    'published',
    'post',
    ARRAY['#CaseStudy', '#ROI', '#Success', '#Marketing'],
    ARRAY[],
    892, 67, 45, 18934, 28456, 11.23,
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    gen_random_uuid(),
    'USER_ID_FROM_AUTH'::uuid,
    (SELECT id FROM instagram_account),
    'instagram',
    'Quick tip: Post when your audience is most active! Our AI analyzes the best times for YOU. ⏰📊',
    ARRAY['https://placeholder.com/1080x1080/published5.jpg'],
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '14 days',
    'published',
    'reel',
    ARRAY['#SocialMediaTips', '#Marketing', '#AI', '#BestPractices'],
    ARRAY[],
    3456, 234, 156, 28934, 45678, 19.67,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '14 days'
  );

-- ===============================================
-- STEP 7: CREATE TEST COMMENTS
-- ===============================================

-- Add some test comments to published posts
WITH published_posts AS (
  SELECT id FROM social_media_posts
  WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
    AND status = 'published'
  LIMIT 3
)

INSERT INTO public.social_media_comments (
  id,
  post_id,
  platform_comment_id,
  author_name,
  author_username,
  content,
  sentiment,
  is_reply,
  likes_count,
  replies_count,
  created_at
)
SELECT
  gen_random_uuid(),
  post_id,
  'test_comment_' || row_number() OVER (),
  CASE (row_number() OVER ()) % 5
    WHEN 0 THEN 'Sarah Johnson'
    WHEN 1 THEN 'Mike Chen'
    WHEN 2 THEN 'Emily Rodriguez'
    WHEN 3 THEN 'David Kim'
    ELSE 'Alex Thompson'
  END,
  CASE (row_number() OVER ()) % 5
    WHEN 0 THEN '@sarahjohnson'
    WHEN 1 THEN '@mikechen'
    WHEN 2 THEN '@emilyrodriguez'
    WHEN 3 THEN '@davidkim'
    ELSE '@alexthompson'
  END,
  CASE (row_number() OVER ()) % 10
    WHEN 0 THEN 'This is amazing! Love it! 😍'
    WHEN 1 THEN 'Great content as always! 👏'
    WHEN 2 THEN 'Can you share more details about this?'
    WHEN 3 THEN 'Interesting perspective! 🤔'
    WHEN 4 THEN 'Following for more updates!'
    WHEN 5 THEN 'Really helpful, thank you! 🙏'
    WHEN 6 THEN 'How does this compare to other tools?'
    WHEN 7 THEN 'Bookmarked for later! 📌'
    WHEN 8 THEN 'This is exactly what I needed!'
    ELSE 'Keep up the great work! 💪'
  END,
  CASE (row_number() OVER ()) % 3
    WHEN 0 THEN 'positive'
    WHEN 1 THEN 'neutral'
    ELSE 'positive'
  END,
  FALSE,
  floor(random() * 50 + 5)::int,
  floor(random() * 10)::int,
  NOW() - (random() * INTERVAL '14 days')
FROM generate_series(1, 30) AS gs
CROSS JOIN LATERAL (SELECT id AS post_id FROM published_posts) AS posts;

-- ===============================================
-- STEP 8: CREATE TEST ANALYTICS DATA
-- ===============================================

-- Generate daily analytics for the past 30 days
WITH account_ids AS (
  SELECT id, platform FROM temp_social_accounts
)

INSERT INTO public.social_media_analytics (
  id,
  account_id,
  post_id,
  metric_date,
  platform,
  reach,
  impressions,
  engagement,
  clicks,
  shares,
  saves,
  profile_visits,
  website_clicks,
  metrics,
  created_at
)
SELECT
  gen_random_uuid(),
  a.id,
  NULL, -- Account-level analytics, not post-specific
  current_date - days.day,
  a.platform,
  floor(random() * 5000 + 1000)::int, -- reach
  floor(random() * 8000 + 2000)::int, -- impressions
  floor(random() * 500 + 100)::int,   -- engagement
  floor(random() * 200 + 50)::int,    -- clicks
  floor(random() * 50 + 10)::int,     -- shares
  floor(random() * 100 + 20)::int,    -- saves
  floor(random() * 300 + 50)::int,    -- profile_visits
  floor(random() * 150 + 30)::int,    -- website_clicks
  jsonb_build_object(
    'followers_gained', floor(random() * 50 + 5),
    'followers_lost', floor(random() * 20 + 1),
    'top_content_type', CASE floor(random() * 3)
      WHEN 0 THEN 'image'
      WHEN 1 THEN 'video'
      ELSE 'carousel'
    END,
    'best_posting_time', (floor(random() * 24))::text || ':00'
  ),
  NOW()
FROM account_ids a
CROSS JOIN generate_series(0, 29) AS days(day);

-- ===============================================
-- STEP 9: CREATE CONTENT CALENDAR ENTRIES
-- ===============================================

WITH account_ids AS (
  SELECT id, platform FROM temp_social_accounts WHERE platform IN ('instagram', 'facebook')
)

INSERT INTO public.social_media_content_calendar (
  id,
  user_id,
  account_id,
  title,
  description,
  content,
  media_urls,
  scheduled_date,
  status,
  post_type,
  hashtags,
  created_at,
  created_by
)
SELECT
  gen_random_uuid(),
  'USER_ID_FROM_AUTH'::uuid,
  a.id,
  CASE (row_number() OVER ()) % 5
    WHEN 0 THEN 'Product Launch Announcement'
    WHEN 1 THEN 'Behind the Scenes Content'
    WHEN 2 THEN 'Customer Testimonial'
    WHEN 3 THEN 'Industry Tips & Tricks'
    ELSE 'Weekly Newsletter Teaser'
  END,
  'Planned content for upcoming week',
  'Content will be finalized closer to publish date',
  ARRAY['https://placeholder.com/1080x1080/calendar' || (row_number() OVER ()) || '.jpg'],
  NOW() + (days.day || ' days')::interval,
  'planned',
  'post',
  ARRAY['#PlannedContent', '#ComingSoon', '#StayTuned'],
  NOW(),
  'USER_ID_FROM_AUTH'::uuid
FROM account_ids a
CROSS JOIN generate_series(1, 7) AS days(day);

-- ===============================================
-- STEP 10: CREATE HASHTAG PERFORMANCE DATA
-- ===============================================

INSERT INTO public.social_media_hashtag_performance (
  id,
  hashtag,
  platform,
  usage_count,
  total_reach,
  total_impressions,
  total_engagement,
  average_engagement,
  last_used,
  created_at
) VALUES
  (gen_random_uuid(), '#AI', 'instagram', 45, 234567, 456789, 12345, 15.67, NOW() - INTERVAL '1 day', NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), '#MarketingAutomation', 'instagram', 38, 198432, 345678, 9876, 13.45, NOW() - INTERVAL '2 days', NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), '#SocialMedia', 'instagram', 52, 287654, 498765, 15234, 14.23, NOW() - INTERVAL '1 day', NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), '#DigitalMarketing', 'facebook', 41, 176543, 298765, 8765, 12.89, NOW() - INTERVAL '3 days', NOW() - INTERVAL '120 days'),
  (gen_random_uuid(), '#AI', 'twitter', 67, 345678, 567890, 18765, 16.34, NOW() - INTERVAL '1 day', NOW() - INTERVAL '180 days'),
  (gen_random_uuid(), '#Tech', 'twitter', 89, 456789, 789012, 23456, 17.89, NOW() - INTERVAL '1 day', NOW() - INTERVAL '180 days'),
  (gen_random_uuid(), '#Marketing', 'linkedin', 34, 145678, 234567, 7654, 11.23, NOW() - INTERVAL '5 days', NOW() - INTERVAL '60 days');

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Check test user profile
SELECT
  id,
  email,
  display_name,
  role,
  account_status,
  subscription_tier
FROM public.profiles
WHERE email = 'social-test@pulsebridge.ai';

-- Check social media accounts
SELECT
  platform,
  username,
  account_type,
  follower_count,
  post_count,
  is_active
FROM public.social_media_accounts
WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
ORDER BY platform;

-- Check posts breakdown by status
SELECT
  status,
  platform,
  COUNT(*) as count
FROM public.social_media_posts
WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
GROUP BY status, platform
ORDER BY status, platform;

-- Check total engagement
SELECT
  platform,
  COUNT(*) as total_posts,
  SUM(likes_count) as total_likes,
  SUM(comments_count) as total_comments,
  SUM(shares_count) as total_shares,
  AVG(engagement_rate) as avg_engagement_rate
FROM public.social_media_posts
WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
  AND status = 'published'
GROUP BY platform;

-- Check content calendar
SELECT
  title,
  scheduled_date::date,
  status
FROM public.social_media_content_calendar
WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
ORDER BY scheduled_date;

-- ===============================================
-- CLEANUP (if needed)
-- ===============================================

-- Uncomment to remove all test data:
/*
DELETE FROM public.social_media_comments WHERE post_id IN (
  SELECT id FROM public.social_media_posts WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
);
DELETE FROM public.social_media_analytics WHERE account_id IN (
  SELECT id FROM public.social_media_accounts WHERE user_id = 'USER_ID_FROM_AUTH'::uuid
);
DELETE FROM public.social_media_content_calendar WHERE user_id = 'USER_ID_FROM_AUTH'::uuid;
DELETE FROM public.social_media_hashtag_performance; -- Shared table, be careful
DELETE FROM public.social_media_posts WHERE user_id = 'USER_ID_FROM_AUTH'::uuid;
DELETE FROM public.social_media_accounts WHERE user_id = 'USER_ID_FROM_AUTH'::uuid;
DELETE FROM public.user_permissions WHERE user_id = 'USER_ID_FROM_AUTH'::uuid;
DELETE FROM public.profiles WHERE email = 'social-test@pulsebridge.ai';
DELETE FROM public.companies WHERE slug = 'social-test-company';
-- Then delete from auth.users in Supabase Dashboard
*/

-- ===============================================
-- TEST DATA SUMMARY
-- ===============================================

/*
WHAT THIS CREATES:

1. TEST USER:
   - Email: social-test@pulsebridge.ai
   - Password: SocialTest123
   - Role: campaign_manager
   - Full social media permissions

2. SOCIAL MEDIA ACCOUNTS (5):
   - Instagram: @pulsebridge_test (15.4K followers)
   - Facebook: PulseBridge Test Page (8.9K followers)
   - Twitter: @pulsebridge_ai (24.5K followers)
   - LinkedIn: PulseBridge AI Test (5.4K followers)
   - TikTok: @pulsebridgeai (31.2K followers)

3. POSTS (10+):
   - 2 Draft posts (ready to edit)
   - 3 Scheduled posts (future dates)
   - 5+ Published posts (with engagement data)

4. ENGAGEMENT DATA:
   - 30+ comments across posts
   - Realistic likes, shares, saves
   - Sentiment analysis (positive/neutral/negative)

5. ANALYTICS DATA:
   - 30 days of daily metrics per platform
   - Reach, impressions, engagement tracking
   - Follower growth/loss data

6. CONTENT CALENDAR:
   - 7 planned posts for next week
   - Across Instagram and Facebook

7. HASHTAG PERFORMANCE:
   - Top performing hashtags by platform
   - Usage counts and engagement metrics

TESTING SCENARIOS:
✅ View all connected accounts
✅ Create new draft post
✅ Schedule post for future date
✅ Edit scheduled post
✅ Publish post immediately
✅ View post analytics
✅ Respond to comments
✅ View content calendar
✅ Analyze hashtag performance
✅ Compare platform performance
✅ View audience insights
✅ Test auto-scheduling features
✅ Test cross-platform posting
✅ Test AI content generation
✅ Test best time to post recommendations
*/
