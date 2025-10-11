-- ===============================================
-- CREATE ADMIN AND DEMO USERS
-- PulseBridge.ai Authentication Setup
-- ===============================================
-- Run this in Supabase SQL Editor to create initial users

-- ===============================================
-- STEP 1: Create Admin User in auth.users
-- ===============================================
-- Note: You'll need to do this via Supabase Dashboard → Authentication → Users
-- OR use Supabase CLI/API to create the auth user first

-- After creating auth.users entry for admin@pulsebridge.ai, run this:

-- ===============================================
-- STEP 2: Create Admin Profile (if auth user exists)
-- ===============================================

-- First, check if admin auth user exists and get their ID
-- You'll need to replace 'YOUR_ADMIN_AUTH_USER_ID' with the actual UUID from auth.users

-- Create a company for admin
INSERT INTO public.companies (
  id,
  name,
  slug,
  subscription_tier,
  account_status,
  user_limit,
  created_at,
  updated_at
) VALUES (
  extensions.uuid_generate_v4(),
  'PulseBridge Administration',
  'pulsebridge-admin',
  'enterprise_plus',
  'active',
  9999,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Note the company ID from above, then create admin profile
-- Replace COMPANY_ID_FROM_ABOVE and ADMIN_AUTH_USER_ID with actual values

/*
INSERT INTO public.profiles (
  id, -- This MUST match the ID from auth.users
  email,
  username,
  display_name,
  first_name,
  last_name,
  company_id, -- Use company ID from above
  role,
  account_status,
  subscription_tier,
  email_verified,
  preferences,
  created_at,
  updated_at
) VALUES (
  'ADMIN_AUTH_USER_ID'::uuid, -- Replace with actual admin auth.users ID
  'admin@pulsebridge.ai',
  'admin',
  'PulseBridge Administrator',
  'Admin',
  'User',
  'COMPANY_ID_FROM_ABOVE'::uuid, -- Replace with actual company ID
  'super_admin',
  'active',
  'enterprise_plus',
  TRUE,
  '{
    "theme": "dark",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "push": true,
      "digest_frequency": "daily"
    },
    "dashboard": {
      "default_layout": "admin",
      "sidebar_collapsed": false
    }
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  account_status = 'active',
  subscription_tier = 'enterprise_plus',
  email_verified = TRUE,
  updated_at = NOW();
*/

-- ===============================================
-- STEP 3: Create Demo User Profile (if auth user exists)
-- ===============================================

-- Create a demo company
INSERT INTO public.companies (
  id,
  name,
  slug,
  subscription_tier,
  account_status,
  user_limit,
  created_at,
  updated_at
) VALUES (
  extensions.uuid_generate_v4(),
  'Demo Company',
  'demo-company',
  'professional_agency',
  'active',
  10,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Create demo user profile
-- Replace DEMO_COMPANY_ID and DEMO_AUTH_USER_ID with actual values

/*
INSERT INTO public.profiles (
  id, -- This MUST match the ID from auth.users
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
  'DEMO_AUTH_USER_ID'::uuid, -- Replace with actual demo auth.users ID
  'demo@pulsebridge.ai',
  'demo',
  'Demo User',
  'Demo',
  'User',
  'DEMO_COMPANY_ID'::uuid, -- Replace with actual demo company ID
  'account_manager',
  'active',
  'professional_agency',
  TRUE,
  '{
    "theme": "light",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "push": true,
      "digest_frequency": "daily"
    }
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  account_status = 'active',
  email_verified = TRUE,
  updated_at = NOW();
*/

-- ===============================================
-- STEP 4: Grant Admin Permissions
-- ===============================================

-- After creating admin profile, grant full permissions
-- Replace ADMIN_AUTH_USER_ID with actual admin user ID

/*
INSERT INTO public.user_permissions (user_id, resource, action, is_active)
SELECT
  'ADMIN_AUTH_USER_ID'::uuid,
  resource,
  action,
  TRUE
FROM (
  VALUES
    ('*', 'admin'),
    ('users', 'admin'),
    ('companies', 'admin'),
    ('campaigns', 'admin'),
    ('reports', 'admin'),
    ('billing', 'admin'),
    ('settings', 'admin'),
    ('integrations', 'admin')
) AS permissions(resource, action)
ON CONFLICT (user_id, resource, action) DO UPDATE SET is_active = TRUE;
*/

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Check if companies were created
SELECT id, name, slug, subscription_tier, account_status FROM public.companies
WHERE slug IN ('pulsebridge-admin', 'demo-company');

-- Check if auth users exist (run this after creating via Dashboard)
SELECT id, email, email_confirmed_at, created_at FROM auth.users
WHERE email IN ('admin@pulsebridge.ai', 'demo@pulsebridge.ai');

-- Check if profiles exist
SELECT id, email, role, account_status, subscription_tier FROM public.profiles
WHERE email IN ('admin@pulsebridge.ai', 'demo@pulsebridge.ai');

-- ===============================================
-- MANUAL STEPS REQUIRED IN SUPABASE DASHBOARD
-- ===============================================

/*
1. Go to: https://app.supabase.com
2. Select your project
3. Go to: Authentication → Users
4. Click: "Add user" → "Create new user"
5. Create Admin User:
   - Email: admin@pulsebridge.ai
   - Password: PulseBridge2025
   - Auto-confirm email: YES
   - Click: Create user
   - Copy the User ID

6. Create Demo User:
   - Email: demo@pulsebridge.ai
   - Password: demo123
   - Auto-confirm email: YES
   - Click: Create user
   - Copy the User ID

7. Go back to SQL Editor
8. Run the INSERT statements above, replacing:
   - ADMIN_AUTH_USER_ID with admin user ID
   - DEMO_AUTH_USER_ID with demo user ID
   - COMPANY_ID_FROM_ABOVE with company IDs from first queries

9. Verify all users are created correctly using the verification queries above
*/

-- ===============================================
-- QUICK SETUP ALTERNATIVE
-- ===============================================
-- If you have Supabase CLI or API access, you can create users programmatically:

/*
# Using Supabase CLI:
supabase auth sign-up admin@pulsebridge.ai PulseBridge2025
supabase auth sign-up demo@pulsebridge.ai demo123

# Then run the profile creation SQL above
*/
