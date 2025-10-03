-- ========================================
-- CREATE RLS POLICIES (ALLOW ALL FOR NOW)
-- ========================================

-- Email Marketing Policies
CREATE POLICY "Allow all operations on email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_subscribers" ON email_subscribers FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_campaign_analytics" ON email_campaign_analytics FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_automations" ON email_automations FOR ALL USING (true);

-- Social Media Policies
CREATE POLICY "Allow all operations on social_media_accounts" ON social_media_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_posts" ON social_media_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_comments" ON social_media_comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media_analytics" ON social_media_analytics FOR ALL USING (true);

-- Collaboration Policies
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_activities" ON team_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations on collaboration_projects" ON collaboration_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_presence" ON user_presence FOR ALL USING (true);
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true);

-- Integration Policies
CREATE POLICY "Allow all operations on integration_apps" ON integration_apps FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_integrations" ON user_integrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_usage" ON integration_usage FOR ALL USING (true);
CREATE POLICY "Allow all operations on integration_categories" ON integration_categories FOR ALL USING (true);

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'RLS policies created successfully!';
END $$;