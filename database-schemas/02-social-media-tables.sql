-- ========================================
-- SOCIAL MEDIA DATABASE SCHEMA
-- ========================================

-- Social Media Accounts Table
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest')),
    username VARCHAR(255) NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    account_type VARCHAR(50) DEFAULT 'personal' CHECK (account_type IN ('personal', 'business', 'creator')),
    is_active BOOLEAN DEFAULT true,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_sync TIMESTAMPTZ,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    
    UNIQUE(platform, account_id)
);

-- Social Media Posts Table
CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'deleted')),
    post_type VARCHAR(50) DEFAULT 'post' CHECK (post_type IN ('post', 'story', 'reel', 'video', 'carousel', 'live')),
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    platform_post_id VARCHAR(255),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.0,
    
    UNIQUE(platform, platform_post_id)
);

-- Social Media Comments Table
CREATE TABLE IF NOT EXISTS social_media_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
    platform_comment_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_username VARCHAR(255) NOT NULL,
    author_id VARCHAR(255),
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES social_media_comments(id) ON DELETE CASCADE,
    sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    is_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    UNIQUE(post_id, platform_comment_id)
);

-- Social Media Analytics Table
CREATE TABLE IF NOT EXISTS social_media_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    profile_visits INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(account_id, post_id, metric_date)
);

-- Social Media Hashtag Performance Table
CREATE TABLE IF NOT EXISTS social_media_hashtag_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hashtag VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    total_reach INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    average_engagement DECIMAL(5,2) DEFAULT 0.0,
    last_used TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(hashtag, platform)
);

-- Social Media Content Calendar Table
CREATE TABLE IF NOT EXISTS social_media_content_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    scheduled_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'scheduled', 'published', 'cancelled')),
    post_type VARCHAR(50) DEFAULT 'post',
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    campaign_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ
);

-- Social Media Audience Insights Table
CREATE TABLE IF NOT EXISTS social_media_audience_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    insight_date DATE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    age_groups JSONB DEFAULT '{}',
    gender_distribution JSONB DEFAULT '{}',
    location_data JSONB DEFAULT '{}',
    interests JSONB DEFAULT '{}',
    activity_times JSONB DEFAULT '{}',
    follower_growth INTEGER DEFAULT 0,
    unfollower_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(account_id, insight_date)
);

-- Indexes for Social Media Tables
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_media_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_media_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_social_posts_account ON social_media_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_media_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_published ON social_media_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_media_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_account ON social_media_analytics(account_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_date ON social_media_analytics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_platform ON social_media_hashtag_performance(platform);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled ON social_media_content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_audience_insights_account ON social_media_audience_insights(account_id);

-- Row Level Security (RLS) Policies
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_hashtag_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_audience_insights ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now)
CREATE POLICY "Allow all operations on social_media_accounts" ON social_media_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_posts" ON social_media_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_comments" ON social_media_comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_analytics" ON social_media_analytics FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_hashtag_performance" ON social_media_hashtag_performance FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_content_calendar" ON social_media_content_calendar FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_audience_insights" ON social_media_audience_insights FOR ALL USING (true);

-- Triggers for updating updated_at timestamp
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_media_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_comments_updated_at BEFORE UPDATE ON social_media_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON social_media_content_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();