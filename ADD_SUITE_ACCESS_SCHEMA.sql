-- ===============================================
-- ADD SUITE ACCESS CONTROL TO PROFILES
-- Enables granular suite-level permissions for users
-- ===============================================

-- Add suite_access column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS suite_access JSONB DEFAULT '{
  "social_media": {
    "enabled": true,
    "access_level": "full",
    "can_publish": true,
    "can_view_analytics": true,
    "granted_at": null
  },
  "content_suite": {
    "enabled": true,
    "access_level": "full",
    "can_create": true,
    "can_edit": true,
    "granted_at": null
  },
  "email_marketing": {
    "enabled": true,
    "access_level": "full",
    "can_send": true,
    "can_view_analytics": true,
    "granted_at": null
  },
  "analytics": {
    "enabled": true,
    "access_level": "read_only",
    "can_export": false,
    "granted_at": null
  },
  "campaigns": {
    "enabled": true,
    "access_level": "full",
    "can_create": true,
    "can_manage_budget": false,
    "granted_at": null
  },
  "billing": {
    "enabled": false,
    "access_level": "none",
    "can_view": false,
    "can_edit": false,
    "granted_at": null
  }
}'::jsonb;

-- Add test user flag
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT FALSE;

-- Add test user expiration
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS test_user_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add notes field for admin tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT NULL;

-- Create index for faster suite access queries
CREATE INDEX IF NOT EXISTS idx_profiles_suite_access ON public.profiles USING GIN (suite_access);
CREATE INDEX IF NOT EXISTS idx_profiles_test_user ON public.profiles (is_test_user) WHERE is_test_user = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.suite_access IS 'Granular suite-level access control. Each suite has enabled flag and specific permissions.';
COMMENT ON COLUMN public.profiles.is_test_user IS 'Marks user as test/beta user with special privileges and no payment requirement.';
COMMENT ON COLUMN public.profiles.test_user_expires_at IS 'Expiration date for test user access. NULL means no expiration.';

-- ===============================================
-- HELPER FUNCTIONS
-- ===============================================

-- Function to check if user has access to a suite
CREATE OR REPLACE FUNCTION has_suite_access(
  p_user_id UUID,
  p_suite_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_suite_access JSONB;
  v_enabled BOOLEAN;
BEGIN
  -- Get suite access for user
  SELECT suite_access INTO v_suite_access
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if suite exists and is enabled
  IF v_suite_access ? p_suite_name THEN
    v_enabled := (v_suite_access->p_suite_name->>'enabled')::BOOLEAN;
    RETURN COALESCE(v_enabled, FALSE);
  END IF;

  -- Default to false if suite not found
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to grant suite access to user
CREATE OR REPLACE FUNCTION grant_suite_access(
  p_user_id UUID,
  p_suite_name TEXT,
  p_access_level TEXT DEFAULT 'full',
  p_granted_by UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET
    suite_access = jsonb_set(
      suite_access,
      ARRAY[p_suite_name],
      jsonb_build_object(
        'enabled', true,
        'access_level', p_access_level,
        'granted_at', NOW(),
        'granted_by', p_granted_by
      )
    ),
    updated_at = NOW(),
    updated_by = p_granted_by
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke suite access from user
CREATE OR REPLACE FUNCTION revoke_suite_access(
  p_user_id UUID,
  p_suite_name TEXT,
  p_revoked_by UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET
    suite_access = jsonb_set(
      suite_access,
      ARRAY[p_suite_name, 'enabled'],
      'false'::jsonb
    ),
    updated_at = NOW(),
    updated_by = p_revoked_by
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if test user is expired
CREATE OR REPLACE FUNCTION is_test_user_expired(
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_is_test BOOLEAN;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT is_test_user, test_user_expires_at
  INTO v_is_test, v_expires_at
  FROM public.profiles
  WHERE id = p_user_id;

  -- Not a test user
  IF NOT v_is_test THEN
    RETURN FALSE;
  END IF;

  -- No expiration set
  IF v_expires_at IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if expired
  RETURN v_expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- DEFAULT SUITE ACCESS TEMPLATES
-- ===============================================

-- Social Media Manager Template
CREATE OR REPLACE FUNCTION apply_social_media_manager_template(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET suite_access = '{
    "social_media": {"enabled": true, "access_level": "full", "can_publish": true, "can_view_analytics": true},
    "content_suite": {"enabled": true, "access_level": "full", "can_create": true, "can_edit": true},
    "analytics": {"enabled": true, "access_level": "read_only", "can_export": true},
    "campaigns": {"enabled": true, "access_level": "full", "can_create": true, "can_manage_budget": false},
    "email_marketing": {"enabled": false},
    "billing": {"enabled": false}
  }'::jsonb
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Content Creator Template
CREATE OR REPLACE FUNCTION apply_content_creator_template(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET suite_access = '{
    "content_suite": {"enabled": true, "access_level": "full", "can_create": true, "can_edit": true},
    "social_media": {"enabled": false},
    "analytics": {"enabled": true, "access_level": "read_only", "can_export": false},
    "campaigns": {"enabled": false},
    "email_marketing": {"enabled": false},
    "billing": {"enabled": false}
  }'::jsonb
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full Access Template (for test users)
CREATE OR REPLACE FUNCTION apply_full_access_template(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET suite_access = '{
    "social_media": {"enabled": true, "access_level": "full", "can_publish": true, "can_view_analytics": true},
    "content_suite": {"enabled": true, "access_level": "full", "can_create": true, "can_edit": true},
    "email_marketing": {"enabled": true, "access_level": "full", "can_send": true, "can_view_analytics": true},
    "analytics": {"enabled": true, "access_level": "full", "can_export": true},
    "campaigns": {"enabled": true, "access_level": "full", "can_create": true, "can_manage_budget": true},
    "billing": {"enabled": true, "access_level": "read_only", "can_view": true, "can_edit": false}
  }'::jsonb
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- UPDATE EXISTING USERS WITH DEFAULT ACCESS
-- ===============================================

-- Give all existing users full access to all suites
UPDATE public.profiles
SET suite_access = '{
  "social_media": {"enabled": true, "access_level": "full", "can_publish": true, "can_view_analytics": true},
  "content_suite": {"enabled": true, "access_level": "full", "can_create": true, "can_edit": true},
  "email_marketing": {"enabled": true, "access_level": "full", "can_send": true, "can_view_analytics": true},
  "analytics": {"enabled": true, "access_level": "full", "can_export": true},
  "campaigns": {"enabled": true, "access_level": "full", "can_create": true, "can_manage_budget": true},
  "billing": {"enabled": true, "access_level": "full", "can_view": true, "can_edit": true}
}'::jsonb
WHERE suite_access IS NULL;

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Check if columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('suite_access', 'is_test_user', 'test_user_expires_at', 'admin_notes');

-- Check existing users' suite access
SELECT
  id,
  email,
  role,
  is_test_user,
  suite_access->'social_media'->>'enabled' as social_media_enabled,
  suite_access->'content_suite'->>'enabled' as content_suite_enabled,
  suite_access->'email_marketing'->>'enabled' as email_marketing_enabled
FROM public.profiles
LIMIT 5;

-- Test helper functions
SELECT has_suite_access(
  (SELECT id FROM public.profiles LIMIT 1),
  'social_media'
) as has_social_access;

-- ===============================================
-- EXAMPLE USAGE
-- ===============================================

/*
-- Create a test user with social media access
INSERT INTO public.profiles (
  id,
  email,
  display_name,
  role,
  is_test_user,
  test_user_expires_at,
  suite_access
) VALUES (
  'user-id-here'::uuid,
  'test@example.com',
  'Test User',
  'campaign_manager',
  TRUE,
  NOW() + INTERVAL '90 days',
  '{
    "social_media": {"enabled": true, "access_level": "full"},
    "content_suite": {"enabled": true, "access_level": "full"},
    "analytics": {"enabled": true, "access_level": "read_only"}
  }'::jsonb
);

-- Grant suite access to existing user
SELECT grant_suite_access(
  'user-id-here'::uuid,
  'social_media',
  'full',
  'admin-id-here'::uuid
);

-- Check if user has access
SELECT has_suite_access('user-id-here'::uuid, 'social_media');

-- Apply template
SELECT apply_social_media_manager_template('user-id-here'::uuid);
*/
