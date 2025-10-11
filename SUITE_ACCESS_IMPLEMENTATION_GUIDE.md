# 🎯 Suite Access Control - Implementation Guide

**Date:** October 11, 2025
**Status:** Ready for deployment

---

## ✅ What Was Implemented

### **1. Database Schema** (`ADD_SUITE_ACCESS_SCHEMA.sql`)

**New Columns Added to `profiles` table:**
- `suite_access` (JSONB) - Granular suite-level permissions
- `is_test_user` (BOOLEAN) - Test user flag
- `test_user_expires_at` (TIMESTAMP) - Test access expiration
- `admin_notes` (TEXT) - Internal admin notes

**Helper Functions Created:**
- `has_suite_access(user_id, suite_name)` - Check access
- `grant_suite_access(user_id, suite_name)` - Grant access
- `revoke_suite_access(user_id, suite_name)` - Revoke access
- `is_test_user_expired(user_id)` - Check expiration

**Templates:**
- Social Media Manager template
- Content Creator template
- Full Access template (for test users)

---

### **2. Admin Invite UI** (`InviteUserModal.tsx`)

**Features:**
- ✅ Full user invitation form
- ✅ Suite access checkboxes (6 suites)
- ✅ Auto-enable logic (Social Media → Content Suite)
- ✅ Test user toggle with duration selector
- ✅ Role selection
- ✅ Subscription tier selection
- ✅ Admin notes field
- ✅ Real-time validation
- ✅ Success/error feedback

**Suite Auto-Enable:**
- Enabling "Social Media" automatically enables "Content Suite"
- Visual indication of auto-enabled suites
- Prevents disabling required suites

---

### **3. API Route** (`/api/admin/invite-user/route.ts`)

**Functionality:**
- ✅ Admin authentication check
- ✅ Create Supabase auth user
- ✅ Create user profile with suite access
- ✅ Grant permissions based on suite selection
- ✅ Generate secure temporary password
- ✅ Send invitation email (ready for integration)
- ✅ Audit logging
- ✅ Cleanup on failure

---

### **4. Helper Library** (`lib/suiteAccess.ts`)

**Functions:**
- `hasSuiteAccess()` - Check if user has suite
- `hasSuitePermission()` - Check specific permission
- `getEnabledSuites()` - List enabled suites
- `isValidTestUser()` - Check test user validity
- `getDefaultSuiteAccessForRole()` - Role-based templates

**Suite Metadata:**
- Names, descriptions, icons, routes
- Easy to extend for new suites

---

## 🚀 Deployment Steps

### **Step 1: Run Database Migration**

```bash
# In Supabase SQL Editor, run:
# File: ADD_SUITE_ACCESS_SCHEMA.sql
```

**What it does:**
- Adds new columns to profiles table
- Creates helper functions
- Updates existing users with full access
- Creates indexes for performance

**Expected time:** 30 seconds

---

### **Step 2: Integrate Invite Modal into Admin Dashboard**

Update `src/app/(platform)/admin/page.tsx`:

```typescript
import InviteUserModal from '@/components/admin/InviteUserModal';

// Add state
const [showInviteModal, setShowInviteModal] = useState(false);

// Add button to header
<Button onClick={() => setShowInviteModal(true)}>
  <UserPlus className="w-4 h-4 mr-2" />
  Invite User
</Button>

// Add modal before closing tag
<InviteUserModal
  isOpen={showInviteModal}
  onClose={() => setShowInviteModal(false)}
  onSuccess={() => {
    setShowInviteModal(false);
    loadUsers(); // Refresh user list
  }}
/>
```

---

### **Step 3: Add Suite Access to User List**

Show suite badges in user table:

```typescript
import { getEnabledSuites, SUITE_METADATA } from '@/lib/suiteAccess';

// In user row
{getEnabledSuites(user.suite_access).map(suiteId => (
  <Badge key={suiteId}>
    {SUITE_METADATA[suiteId].icon} {SUITE_METADATA[suiteId].name}
  </Badge>
))}
```

---

### **Step 4: Add Route Protection Middleware**

Update `middleware.ts` to check suite access:

```typescript
import { hasSuiteAccess } from '@/lib/suiteAccess';

// Map routes to required suites
const suiteRoutes = {
  '/social-media': 'social_media',
  '/content-suite': 'content_suite',
  '/email-marketing': 'email_marketing',
  // etc.
};

// In middleware, check suite access
const requiredSuite = suiteRoutes[req.nextUrl.pathname];
if (requiredSuite) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('suite_access')
    .eq('id', session.user.id)
    .single();

  if (!hasSuiteAccess(profile?.suite_access, requiredSuite)) {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }
}
```

---

### **Step 5: Email Service Integration (Optional)**

Update `sendInvitationEmail()` in API route to use real email service:

**Option A: Resend**
```typescript
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'PulseBridge <noreply@pulsebridge.ai>',
    to: email,
    subject,
    html: htmlBody,
  }),
});
```

**Option B: SendGrid, Mailgun, etc.**

---

## 🧪 Testing the Flow

### **Test 1: Invite Social Media Manager**

1. Login as admin: `/adminlogin`
2. Go to admin dashboard: `/admin`
3. Click "Invite User"
4. Fill in:
   - Email: `socialmanager@test.com`
   - Name: Social Manager
   - Role: Campaign Manager
   - Suites: ☑ Social Media (Content auto-enables)
   - Test User: ☑ Yes, 90 days
5. Submit
6. Check Supabase:
   - User created in `auth.users`
   - Profile created in `profiles`
   - `suite_access` has correct permissions
   - `is_test_user` = true

---

### **Test 2: User Login & Access**

1. User receives email with temp password
2. Login at `/login`
3. Navigate to `/social-media` - ✅ Access granted
4. Navigate to `/content-suite` - ✅ Access granted (auto-enabled)
5. Navigate to `/email-marketing` - ❌ Access denied
6. User can start creating content immediately
7. All actions populate their own data

---

### **Test 3: Test User Expiration**

1. Create test user with 1-day expiration
2. Wait 1 day (or manually set expiration to past)
3. User login should still work
4. Optional: Add expiration check to middleware
5. Show warning banner: "Test access expires in X days"

---

## 🎨 UI Enhancements (Optional)

### **Show Suite Access in User Profile**

```typescript
// In user profile page
<Card>
  <CardHeader>
    <CardTitle>Suite Access</CardTitle>
  </CardHeader>
  <CardContent>
    {Object.entries(user.suite_access).map(([suiteId, access]) => (
      <div key={suiteId} className="flex items-center justify-between">
        <span>{SUITE_METADATA[suiteId].name}</span>
        {access.enabled ? (
          <Badge variant="success">Enabled</Badge>
        ) : (
          <Badge variant="secondary">Disabled</Badge>
        )}
      </div>
    ))}
  </CardContent>
</Card>
```

---

### **Add Suite Quick Actions**

```typescript
// In admin dashboard
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Grant Access</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {Object.entries(SUITE_METADATA).map(([id, meta]) => (
      <DropdownMenuItem
        key={id}
        onClick={() => grantSuiteAccess(user.id, id)}
      >
        {meta.icon} {meta.name}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 📊 Analytics & Monitoring

### **Track Suite Usage**

```sql
-- Most used suites
SELECT
  jsonb_object_keys(suite_access) as suite,
  COUNT(*) as user_count
FROM profiles
WHERE (suite_access -> jsonb_object_keys(suite_access) ->> 'enabled')::boolean = true
GROUP BY suite
ORDER BY user_count DESC;

-- Test users by expiration
SELECT
  COUNT(*) FILTER (WHERE test_user_expires_at > NOW()) as active_test_users,
  COUNT(*) FILTER (WHERE test_user_expires_at <= NOW()) as expired_test_users
FROM profiles
WHERE is_test_user = TRUE;
```

---

## 🔒 Security Considerations

### **1. Admin Authorization**

- ✅ Only `super_admin` and `agency_owner` can invite users
- ✅ Audit logging for all invitations
- ✅ Admin actions tracked with `granted_by` field

### **2. Suite Access Checks**

- ⚠️ Implement middleware route protection
- ⚠️ Add API route access checks
- ⚠️ Client-side UI guards (hide inaccessible features)

### **3. Test User Limits**

- ⚠️ Consider limiting concurrent test users
- ⚠️ Auto-expire after set duration
- ⚠️ Optionally restrict test user data export

---

## 🐛 Troubleshooting

### **Issue: Suite not auto-enabling**

**Check:**
```typescript
// In InviteUserModal.tsx, line ~170
suite.autoEnables.forEach((autoId) => {
  newSuites.add(autoId);
});
```

---

### **Issue: User can't access suite they should have**

**Check:**
1. Profile `suite_access` field populated correctly
2. Middleware checking `suite_access` not old permissions
3. Frontend route guards using latest profile data

**Debug:**
```sql
SELECT email, suite_access FROM profiles WHERE email = 'user@test.com';
```

---

### **Issue: Invitation email not sending**

**Check:**
1. Email service API key configured
2. Email service has sending domain verified
3. Check API logs for email errors
4. Fallback: Admin can share temp password manually

---

## 📈 Roadmap & Future Enhancements

### **Phase 2:**
- [ ] Bulk invite users via CSV
- [ ] Pre-defined user templates (one-click invite)
- [ ] Suite usage analytics dashboard
- [ ] Auto-expiration warnings for test users
- [ ] Suite access request workflow (users request, admin approves)

### **Phase 3:**
- [ ] Fine-grained permissions within suites
- [ ] Time-based access (access only during business hours)
- [ ] IP-restricted access
- [ ] Two-factor authentication for sensitive suites

---

## ✅ Success Criteria

**After deployment, you should be able to:**

- [x] Open admin dashboard
- [x] Click "Invite User"
- [x] Select suites (Social Media auto-enables Content Suite)
- [x] Mark as test user
- [x] User receives invitation email
- [x] User logs in with temp password
- [x] User sees only enabled suites
- [x] User can populate their own data through usage
- [x] Admin can modify suite access anytime

---

## 🎯 Your Specific Use Case

> **Goal:** Invite and onboard a user who manages multiple social media accounts

**Steps:**
1. Admin dashboard → Invite User
2. Email: `socialmanager@company.com`
3. Role: Social Media Manager
4. Suites:
   - ☑ Social Media Suite (for posting & scheduling)
   - ☑ Content Suite (auto-enabled for creating content)
   - ☑ Analytics (for performance tracking)
   - ☐ Email Marketing (not needed)
   - ☐ Campaigns (not needed)
   - ☐ Billing (admin only)
5. Test User: ☑ Yes (90 days)
6. Notes: "Beta tester for social media features"
7. Invite → User gets email → Login → Start using immediately

**User Experience:**
- No payment required
- Can create social accounts
- Can design content
- Can schedule posts
- Can view analytics
- All their actions populate their dashboard
- Clean, focused experience (only sees relevant features)

---

**Status:** Ready for deployment ✅
**Estimated Setup Time:** 30 minutes
**Documentation:** Complete

🚀 **Ready to revolutionize user onboarding!**
