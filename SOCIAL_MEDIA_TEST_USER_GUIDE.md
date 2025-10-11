# 📱 Social Media Suite Test User Guide

**Purpose:** Dedicated test account for hyper-specific testing of all social media features
**Created:** October 11, 2025

---

## 🎯 Test User Credentials

**Email:** `social-test@pulsebridge.ai`
**Password:** `SocialTest123`
**Role:** Campaign Manager (full social media access)

---

## 🚀 Quick Setup

### **Option 1: Automated Setup (Recommended)**

1. **Create Auth User:**
   - Go to Supabase Dashboard → Authentication → Users
   - Add user: `social-test@pulsebridge.ai` / `SocialTest123`
   - ✅ Auto Confirm User
   - **Copy User ID**

2. **Run SQL Script:**
   - Open SQL Editor in Supabase
   - Open `CREATE_SOCIAL_MEDIA_TEST_USER.sql`
   - Replace all instances of `USER_ID_FROM_AUTH` with actual user ID
   - Replace `COMPANY_ID_FROM_ABOVE` after company creation
   - Execute the entire script

3. **Login & Test:**
   - Go to: https://autopilot-web-rho.vercel.app/login
   - Login with test credentials
   - Navigate to: Social Media section

---

## 📊 What Gets Created

### **1. Social Media Accounts (5 platforms)**

| Platform | Username | Followers | Posts | Status |
|----------|----------|-----------|-------|--------|
| Instagram | @pulsebridge_test | 15,420 | 247 | Active ✅ |
| Facebook | PulseBridge Test Page | 8,932 | 184 | Active ✅ |
| Twitter/X | @pulsebridge_ai | 24,567 | 1,456 | Active ✅ |
| LinkedIn | PulseBridge AI Test | 5,423 | 89 | Active ✅ |
| TikTok | @pulsebridgeai | 31,245 | 67 | Active ✅ |

---

### **2. Posts (10 total)**

**Draft Posts (2):**
- Ready to edit and publish
- Test content editing workflow
- Test media upload functionality

**Scheduled Posts (3):**
- Scheduled for next 1-7 days
- Test scheduling system
- Test rescheduling functionality
- Test cancellation workflow

**Published Posts (5+):**
- Complete engagement data
- Realistic likes, comments, shares
- Test analytics viewing
- Test performance comparison

---

### **3. Engagement Data**

**Comments (30+):**
- Mix of positive, neutral, negative sentiment
- Realistic usernames and content
- Test comment moderation
- Test sentiment analysis

**Metrics:**
- Likes: 1,247 - 3,456 per post
- Comments: 45 - 234 per post
- Shares: 34 - 156 per post
- Engagement Rate: 11% - 19%

---

### **4. Analytics (30 days)**

**Daily Metrics Per Platform:**
- Reach: 1,000 - 6,000 per day
- Impressions: 2,000 - 10,000 per day
- Engagement: 100 - 600 per day
- Profile visits: 50 - 350 per day
- Website clicks: 30 - 180 per day

**Growth Metrics:**
- Follower gains: 5-50 per day
- Follower losses: 1-20 per day
- Best posting times identified
- Top content type per platform

---

### **5. Content Calendar (7 entries)**

Planned posts for the next week:
- Product launch announcements
- Behind-the-scenes content
- Customer testimonials
- Industry tips
- Newsletter teasers

**Test Cases:**
- View calendar by week/month
- Drag-and-drop rescheduling
- Bulk scheduling
- Content approval workflow

---

### **6. Hashtag Performance**

Top-performing hashtags across platforms:
- `#AI` - 15.67% avg engagement
- `#MarketingAutomation` - 13.45% avg engagement
- `#SocialMedia` - 14.23% avg engagement
- `#Tech` - 17.89% avg engagement

**Test Cases:**
- Hashtag suggestions
- Performance comparison
- Trending hashtag identification
- Platform-specific hashtag optimization

---

## 🧪 Testing Scenarios

### **Basic Operations**

✅ **View Connected Accounts**
- All 5 platforms visible
- Account stats displayed correctly
- Profile info loaded

✅ **Create New Post**
- Draft post creation
- Media upload
- Hashtag suggestions
- Mention autocomplete

✅ **Schedule Post**
- Date/time picker
- Timezone handling
- Schedule confirmation
- Calendar integration

✅ **Edit Scheduled Post**
- Load scheduled content
- Modify text/media
- Reschedule time
- Save changes

✅ **Publish Post Immediately**
- Quick publish flow
- Multi-platform selection
- Publish confirmation
- Real-time status update

---

### **Analytics & Insights**

✅ **View Post Analytics**
- Engagement metrics
- Reach vs impressions
- Click-through rates
- Audience demographics

✅ **Compare Platform Performance**
- Side-by-side metrics
- Best performing platform
- Content type analysis
- Optimal posting times

✅ **Hashtag Analysis**
- Performance by hashtag
- Platform-specific trends
- Engagement correlation
- Recommendations

✅ **Audience Insights**
- Demographics breakdown
- Active hours
- Geographic distribution
- Interest categories

---

### **Advanced Features**

✅ **AI Content Generation**
- Generate post captions
- Suggest hashtags
- Optimize timing
- A/B test recommendations

✅ **Cross-Platform Posting**
- Single post → multiple platforms
- Platform-specific adaptations
- Character limit handling
- Media format conversion

✅ **Auto-Scheduling**
- Best time predictions
- Queue management
- Smart distribution
- Avoid overlaps

✅ **Comment Management**
- View all comments
- Sentiment filtering
- Quick replies
- Moderation tools

---

### **Content Calendar**

✅ **Calendar View**
- Week/month/day views
- Drag-and-drop scheduling
- Color coding by platform
- Status indicators

✅ **Bulk Operations**
- Schedule multiple posts
- Bulk edit
- Bulk delete
- Bulk approve

✅ **Workflow Testing**
- Draft → Approval → Scheduled → Published
- Rejection handling
- Revision requests
- Approval notifications

---

## 🎨 Use Cases by Role

### **Marketing Manager**
- Review analytics dashboards
- Compare campaign performance
- Approve content calendar
- Set posting schedules

### **Content Creator**
- Create draft posts
- Upload media assets
- Use AI suggestions
- Schedule content

### **Social Media Analyst**
- Deep-dive analytics
- Hashtag performance
- Audience insights
- ROI tracking

### **Community Manager**
- Monitor comments
- Respond to engagement
- Sentiment tracking
- Crisis management

---

## 📋 Testing Checklist

### **Account Management**
- [ ] View all connected accounts
- [ ] Check account status
- [ ] View follower counts
- [ ] Access profile settings

### **Content Creation**
- [ ] Create text-only post
- [ ] Create post with image
- [ ] Create post with multiple images
- [ ] Create video post
- [ ] Add hashtags
- [ ] Add mentions
- [ ] Save as draft

### **Scheduling**
- [ ] Schedule for tomorrow
- [ ] Schedule for specific time
- [ ] Schedule recurring posts
- [ ] View scheduled queue
- [ ] Edit scheduled post
- [ ] Cancel scheduled post

### **Publishing**
- [ ] Publish immediately
- [ ] Publish to single platform
- [ ] Publish to multiple platforms
- [ ] Verify published status
- [ ] Check engagement updates

### **Analytics**
- [ ] View post performance
- [ ] Compare platform metrics
- [ ] Export analytics report
- [ ] View audience insights
- [ ] Track hashtag performance

### **Engagement**
- [ ] View comments
- [ ] Filter by sentiment
- [ ] Reply to comment
- [ ] Like comment
- [ ] Report spam

### **Content Calendar**
- [ ] View calendar
- [ ] Drag-and-drop reschedule
- [ ] Filter by platform
- [ ] Filter by status
- [ ] Bulk schedule posts

---

## 🐛 Known Test Data Quirks

**Scheduled Posts:**
- Set for future dates (1-7 days out)
- Won't auto-publish without cron job setup
- Manual publish testing recommended

**Analytics Data:**
- Randomly generated for past 30 days
- Not real-time (historical only)
- Simulates realistic patterns

**Comments:**
- Pre-populated with test data
- No real user interactions
- Good for UI/sentiment testing only

**Account Tokens:**
- Placeholder values
- Won't connect to real platforms
- For UI testing only

---

## 🔄 Reset Test Data

To start fresh, run cleanup section in SQL script:

```sql
-- Uncomment and run the CLEANUP section
-- in CREATE_SOCIAL_MEDIA_TEST_USER.sql
```

Then re-run setup to repopulate with fresh data.

---

## 🆘 Troubleshooting

### **Issue: Can't see social media accounts**

**Check:**
1. User logged in correctly
2. Accounts table has data for user_id
3. API route returning data
4. No JavaScript errors in console

**Solution:**
```sql
-- Verify accounts exist
SELECT * FROM social_media_accounts WHERE user_id = 'YOUR_USER_ID';
```

---

### **Issue: Posts not showing**

**Check:**
1. Posts table populated
2. account_id matches social_media_accounts
3. user_id correct
4. API route filtering properly

**Solution:**
```sql
-- Verify posts exist
SELECT status, COUNT(*) FROM social_media_posts
WHERE user_id = 'YOUR_USER_ID'
GROUP BY status;
```

---

### **Issue: Analytics not loading**

**Check:**
1. Analytics table has data
2. Date range includes test data (past 30 days)
3. account_id references valid accounts

**Solution:**
```sql
-- Verify analytics exist
SELECT platform, COUNT(*) FROM social_media_analytics a
JOIN social_media_accounts sa ON a.account_id = sa.id
WHERE sa.user_id = 'YOUR_USER_ID'
GROUP BY platform;
```

---

## 🎓 Best Practices

**For Testing:**
1. **Start Simple:** Test basic CRUD operations first
2. **Check Console:** Always have DevTools open
3. **Verify Data:** Check database after each operation
4. **Use Filters:** Test all filter combinations
5. **Edge Cases:** Try empty states, max limits, errors

**For Development:**
1. **Realistic Data:** Use test data that mirrors production
2. **Permissions:** Test role-based access control
3. **Performance:** Monitor query performance with test data
4. **Validation:** Test all form validations
5. **Error Handling:** Test failure scenarios

---

## 📞 Support

**Found an issue?**
- Check existing test data with verification queries
- Review API route console logs
- Check Supabase logs for errors
- Verify environment variables

**Need more test data?**
- Modify SQL script counts (posts, comments, etc.)
- Add more platforms/accounts
- Extend date range for analytics
- Add specific edge cases

---

**Created:** October 11, 2025
**Last Updated:** October 11, 2025
**Maintainer:** PulseBridge.ai Team
**Status:** Ready for testing ✅
