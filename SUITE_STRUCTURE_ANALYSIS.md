# 🔍 Suite Structure Analysis & Verification

**Date:** October 11, 2025
**Purpose:** Analyze current suite structure before implementing admin user onboarding

---

## 📊 Current Suite Structure

### **Identified Suites:**

1. **Content Suite** (`/content-suite`)
   - Location: `src/app/(marketing)/content-suite/page.tsx`
   - Components:
     - Feed Grid Planner
     - Asset Manager
     - Advanced Design Studio
     - AI Content Generator
   - Content Types:
     - Social posts
     - Stories, Reels, Videos
     - Email templates
     - Blog graphics
     - Marketing materials
   - **Status:** Standalone page/suite

2. **Social Media Suite** (`/social-media`)
   - Location: `src/app/(marketing)/social-media/page.tsx`
   - Features:
     - Account management
     - Post scheduling
     - Publishing
     - Analytics
     - Engagement tracking
   - **Status:** Standalone page/suite

3. **Email Marketing Suite** (`/email-marketing`)
   - Location: `src/app/(marketing)/email-marketing/`
   - Features:
     - Campaigns
     - Contacts
     - Templates
     - Automations
   - **Status:** Separate suite

4. **Marketing Optimization** (`/marketing` or `/marketing-optimization`)
   - Location: `src/app/(marketing)/marketing/`
   - Sub-sections:
     - Campaigns
     - Content
     - Email
     - Social
   - **Status:** Umbrella suite with sub-sections

---

## 🔗 Suite Relationships

### **Content Suite ↔ Social Media:**

**User's Concern:** "Social media is technically separate from the content suite... they go hand in hand and don't really function without one another."

**Analysis:**

**Content Suite:**
- **Purpose:** Create and design content (graphics, videos, copy)
- **Output:** Content assets ready to be published
- **Dependencies:** Asset library, design tools, AI generation

**Social Media Suite:**
- **Purpose:** Publish, schedule, and analyze social media posts
- **Input:** Content assets (from Content Suite)
- **Dependencies:** Social media accounts, scheduling system, analytics

**Relationship:**
```
Content Suite (Create) → Social Media Suite (Publish)
     ↓                              ↓
  Assets                         Posts
  Graphics                      Analytics
  Copy                          Engagement
```

**Verdict:** ✅ **SEPARATE BUT INTERCONNECTED**
- They are technically separate features
- Content Suite creates assets
- Social Media Suite uses those assets to publish
- A user might need:
  - **Content Only:** Designers, content creators
  - **Social Only:** Social media managers (using external content)
  - **Both:** Full-service marketers (most common)

---

## 👤 User Permission Model

### **Current Schema:**

**Profiles Table:**
- `role`: super_admin, agency_owner, account_manager, campaign_manager, content_creator, analyst, client_viewer
- `subscription_tier`: trial, solo_professional, growth_team, professional_agency, enterprise, enterprise_plus
- `account_status`: active, suspended, pending_verification, deactivated
- `preferences`: JSONB (custom settings)

**User Permissions Table:**
- `resource`: What they can access (e.g., 'social_media', 'content_suite')
- `action`: What they can do (create, read, update, delete, publish, admin)
- `conditions`: Additional restrictions

---

## 🎯 Required Changes for Suite-Specific Access

### **What's Missing:**

1. **Suite Access Control:**
   - No explicit `suite_access` or `enabled_suites` field
   - Currently relying on `subscription_tier` + `user_permissions`
   - Need granular suite-level access control

2. **Admin Onboarding UI:**
   - No UI for inviting users with specific suite access
   - No checkbox/toggle for enabling specific suites
   - No way to create "Social Media Only" test users

3. **Suite Permissions Mapping:**
   - Need to define what permissions each suite requires
   - Content Suite: What resources/actions?
   - Social Media Suite: What resources/actions?

---

## 💡 Proposed Solution

### **Option 1: Use Preferences JSONB (Quick)**

Add to `profiles.preferences`:
```json
{
  "enabled_suites": ["social_media", "content_suite", "email_marketing"],
  "suite_access": {
    "social_media": { "enabled": true, "test_user": true },
    "content_suite": { "enabled": true, "test_user": false },
    "email_marketing": { "enabled": false, "test_user": false }
  }
}
```

**Pros:**
- No schema changes required
- Flexible and extensible
- Quick to implement

**Cons:**
- Not enforceable at database level
- Harder to query/filter
- Less structured

---

### **Option 2: Add Suite Access Column (Better)**

Add new column to `profiles`:
```sql
ALTER TABLE public.profiles
ADD COLUMN enabled_suites TEXT[] DEFAULT ARRAY['all']::TEXT[];

-- Or more granular:
ADD COLUMN suite_access JSONB DEFAULT '{
  "social_media": {"enabled": true, "is_test_user": false},
  "content_suite": {"enabled": true, "is_test_user": false},
  "email_marketing": {"enabled": true, "is_test_user": false}
}'::jsonb;
```

**Pros:**
- Proper database structure
- Easy to query and filter
- Can add constraints
- Clear intent

**Cons:**
- Requires schema migration
- Need to update existing users

---

### **Option 3: Expand User Permissions (Most Robust)**

Use existing `user_permissions` table with suite-specific resources:
```sql
-- Example permissions for Social Media Only user:
INSERT INTO user_permissions (user_id, resource, action) VALUES
  ('user_id', 'social_media', 'read'),
  ('user_id', 'social_media', 'create'),
  ('user_id', 'social_media', 'update'),
  ('user_id', 'social_media_posts', 'publish'),
  ('user_id', 'social_media_accounts', 'read'),
  ('user_id', 'social_media_analytics', 'read');
```

**Pros:**
- Uses existing schema
- Fine-grained control
- Aligns with RBAC pattern
- Scalable

**Cons:**
- More complex to manage
- Many permission rows per user
- Need UI to bulk assign

---

## 🎨 Admin UI Flow for Onboarding

### **User Story:**
> "I want to invite and onboard a user who manages multiple social media accounts"

### **Desired Flow:**

1. **Admin Dashboard → Users → Invite New User**
2. **Invite Modal Shows:**
   - Email: `socialmanager@company.com`
   - Role: Campaign Manager
   - **Suite Access:**
     - ☑ Social Media Suite
     - ☑ Content Suite (linked)
     - ☐ Email Marketing
     - ☐ Analytics
     - ☐ Billing
   - **Test User:** ☑ (bypass payment, full access for testing)
   - **Account Status:** Active
   - **Subscription Tier:** Professional Agency (or custom)

3. **System Creates:**
   - Auth user in Supabase
   - Profile with selected suite access
   - Permissions for selected suites
   - Pre-populated test data (if test user)

4. **User Receives:**
   - Invitation email
   - Temp password
   - Direct link to their suite(s)

---

## 📋 Implementation Checklist

### **Phase 1: Database Schema** (Recommended: Option 2)
- [ ] Add `enabled_suites` JSONB column to profiles
- [ ] Define suite access structure
- [ ] Create migration script
- [ ] Add default values for existing users

### **Phase 2: Permission Logic**
- [ ] Create suite permission constants
- [ ] Build `hasAccess(suite)` helper function
- [ ] Update middleware to check suite access
- [ ] Add UI guards for suite-specific pages

### **Phase 3: Admin UI**
- [ ] Add "Invite User" button to admin dashboard
- [ ] Create invite modal with suite selection
- [ ] Add bulk permission assignment logic
- [ ] Add test user checkbox + data seeding
- [ ] Show suite access in user list

### **Phase 4: Test Data Seeding**
- [ ] Social media accounts setup script
- [ ] Content assets pre-population
- [ ] Sample posts/analytics data
- [ ] Link content assets to social accounts

---

## 🤔 Questions to Answer

1. **Suite Dependencies:**
   - Should Social Media automatically enable Content Suite?
   - Or allow Social-only access (using external content)?

2. **Test User Behavior:**
   - Should test users have realistic data limits?
   - Should test data be isolated or shared?

3. **Permission Granularity:**
   - Suite-level access (all or nothing)?
   - Or feature-level within suites?

4. **Billing Integration:**
   - Should test users bypass Stripe?
   - How long should test access last?

---

## ✅ Recommendations

**For Your Use Case:**
> "Invite and onboard a user who manages multiple social media accounts"

**Recommended Approach:**

1. **Use Option 2** (Add suite access column)
   - Clear, structured, queryable
   - Aligns with your needs

2. **Enable Both Suites by Default:**
   - Social Media (primary)
   - Content Suite (supporting)
   - Rationale: They work together

3. **Create Admin Invite UI:**
   - Simple checkboxes for suites
   - "Test User" toggle
   - Auto-seed data option

4. **Test User Features:**
   - Mark as `is_test_user: true`
   - Bypass payment requirements
   - Pre-populate realistic data
   - 90-day expiration (configurable)

---

## 🚀 Next Steps

**BEFORE proceeding, confirm:**

1. ✅ Are Social Media and Content Suite separate but linked? (Answer: Yes)
2. ✅ Should we add `enabled_suites` column to profiles? (Recommended: Yes)
3. ✅ Should test users get both Social + Content by default? (Your preference?)
4. ✅ Do you want full admin UI or just database setup first? (Your choice)

**Then I'll implement:**
1. Database schema for suite access
2. Admin UI for user invitation
3. Test user onboarding with data seeding
4. Suite-specific permission checks

---

**Status:** Awaiting confirmation before implementation
**Risk:** Low (non-breaking changes)
**Timeline:** 2-3 hours for full implementation
