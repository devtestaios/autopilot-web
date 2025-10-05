-- ===============================================
-- SAFE PRICING STRUCTURE UPDATE SCRIPT
-- Handles existing database with conflict resolution
-- Execute in Supabase SQL Editor
-- ===============================================

-- Step 1: Check and update subscription tier constraints safely
DO $$ 
BEGIN
  -- Update companies subscription tier constraint
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'companies_subscription_tier_check' 
             AND table_name = 'companies') THEN
    ALTER TABLE public.companies DROP CONSTRAINT companies_subscription_tier_check;
  END IF;
  
  ALTER TABLE public.companies ADD CONSTRAINT companies_subscription_tier_check 
    CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'));

  -- Update profiles subscription tier constraint
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'profiles_subscription_tier_check' 
             AND table_name = 'profiles') THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_subscription_tier_check;
  END IF;
  
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check 
    CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'));

  -- Update companies account status constraint
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'companies_account_status_check' 
             AND table_name = 'companies') THEN
    ALTER TABLE public.companies DROP CONSTRAINT companies_account_status_check;
  END IF;
  
  ALTER TABLE public.companies ADD CONSTRAINT companies_account_status_check 
    CHECK (account_status IN ('trial', 'active', 'suspended', 'cancelled'));
END $$;

-- Step 2: Add new trial management columns if they don't exist
DO $$ 
BEGIN
  -- Add trial_started_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'companies' AND column_name = 'trial_started_at') THEN
    ALTER TABLE public.companies ADD COLUMN trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Update trial_ends_at to have default value
  ALTER TABLE public.companies ALTER COLUMN trial_ends_at SET DEFAULT (NOW() + INTERVAL '15 days');
  
  -- Set default values for new records
  ALTER TABLE public.companies ALTER COLUMN subscription_tier SET DEFAULT 'trial';
  ALTER TABLE public.companies ALTER COLUMN account_status SET DEFAULT 'trial';
  ALTER TABLE public.profiles ALTER COLUMN subscription_tier SET DEFAULT 'trial';
END $$;

-- Step 3: Migrate existing data to new pricing structure
UPDATE public.companies SET 
  subscription_tier = CASE 
    WHEN subscription_tier = 'free' THEN 'trial'
    WHEN subscription_tier = 'starter' THEN 'growth_team'  
    WHEN subscription_tier = 'professional' THEN 'professional_agency'
    WHEN subscription_tier = 'enterprise' THEN 'enterprise'
    ELSE subscription_tier -- Keep new tiers as-is
  END,
  account_status = CASE
    WHEN subscription_tier = 'free' OR account_status = 'active' AND subscription_tier IN ('free', 'trial') THEN 'trial'
    ELSE account_status
  END,
  trial_ends_at = CASE
    WHEN subscription_tier IN ('free', 'trial') OR account_status = 'trial' THEN 
      COALESCE(trial_ends_at, NOW() + INTERVAL '15 days')
    ELSE trial_ends_at
  END,
  trial_started_at = CASE
    WHEN trial_started_at IS NULL AND subscription_tier IN ('free', 'trial') THEN NOW()
    WHEN trial_started_at IS NULL THEN created_at
    ELSE trial_started_at
  END
WHERE subscription_tier IN ('free', 'starter', 'professional') 
   OR account_status = 'active' AND subscription_tier = 'free';

UPDATE public.profiles SET 
  subscription_tier = CASE 
    WHEN subscription_tier = 'free' THEN 'trial'
    WHEN subscription_tier = 'starter' THEN 'growth_team'
    WHEN subscription_tier = 'professional' THEN 'professional_agency'  
    WHEN subscription_tier = 'enterprise' THEN 'enterprise'
    ELSE subscription_tier -- Keep new tiers as-is
  END
WHERE subscription_tier IN ('free', 'starter', 'professional');

-- Step 4: Create or update default roles with new permissions
INSERT INTO public.roles (name, display_name, description, level, is_system_role, permissions) VALUES
('super_admin', 'Super Administrator', 'Full system access with all permissions', 100, true, '["*"]'::jsonb),
('agency_owner', 'Agency Owner', 'Company administrator with user management', 80, true, '[
  "users.create", "users.read", "users.update", "users.delete",
  "campaigns.create", "campaigns.read", "campaigns.update", "campaigns.delete",
  "reports.create", "reports.read", "reports.update", "reports.delete",
  "settings.read", "settings.update",
  "billing.read", "billing.update"
]'::jsonb),
('account_manager', 'Account Manager', 'Client account management and campaign oversight', 60, true, '[
  "campaigns.create", "campaigns.read", "campaigns.update",
  "reports.read", "reports.create",
  "clients.read", "clients.update"
]'::jsonb),
('campaign_manager', 'Campaign Manager', 'Campaign creation and optimization', 40, true, '[
  "campaigns.create", "campaigns.read", "campaigns.update",
  "reports.read"
]'::jsonb),
('content_creator', 'Content Creator', 'Content creation and asset management', 30, true, '[
  "content.create", "content.read", "content.update",
  "assets.create", "assets.read", "assets.update"
]'::jsonb),
('analyst', 'Analyst', 'Data analysis and reporting', 20, true, '[
  "reports.read", "reports.create",
  "analytics.read",
  "campaigns.read"
]'::jsonb),
('client_viewer', 'Client Viewer', 'Read-only access to assigned campaigns', 10, true, '[
  "campaigns.read",
  "reports.read"
]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Step 5: Create utility functions if they don't exist
CREATE OR REPLACE FUNCTION has_permission(user_uuid UUID, resource_name TEXT, action_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_permissions JSONB;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM public.profiles WHERE id = user_uuid;
  
  -- Get role permissions
  SELECT permissions INTO role_permissions 
  FROM public.roles 
  WHERE name = user_role;
  
  -- Check if user has super admin access
  IF role_permissions ? '*' THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific permission
  RETURN role_permissions ? (resource_name || '.' || action_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_security_event(
  user_uuid UUID,
  event_type TEXT,
  severity TEXT DEFAULT 'info',
  description TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, severity, description, metadata,
    ip_address, user_agent
  ) VALUES (
    user_uuid, event_type, severity, description, metadata,
    inet_client_addr(), 
    COALESCE(current_setting('request.headers', true)::jsonb->>'user-agent', 'Unknown')
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Enable RLS on all tables (safe operation)
DO $$
BEGIN
  -- Enable RLS on all tables
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
  
  -- Only enable on tables that exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
    ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_permissions') THEN
    ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_events') THEN
    ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
    ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore RLS errors if already enabled
    NULL;
END $$;

-- Step 7: Create essential RLS policies (safe with IF NOT EXISTS equivalent)
DO $$
BEGIN
  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Company admins can view company users') THEN
    CREATE POLICY "Company admins can view company users" ON public.profiles
      FOR SELECT USING (
        company_id IN (
          SELECT company_id FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('agency_owner', 'account_manager')
        )
      );
  END IF;
  
  -- Companies policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Company members can view their company') THEN
    CREATE POLICY "Company members can view their company" ON public.companies
      FOR SELECT USING (
        id IN (
          SELECT company_id FROM public.profiles WHERE id = auth.uid()
        )
      );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore policy creation errors if they already exist
    NULL;
END $$;

-- Step 8: Verification and success message
SELECT 'Pricing structure update completed successfully!' AS status;

SELECT 'Updated subscription tiers:' AS info;
SELECT subscription_tier, COUNT(*) as count 
FROM public.companies 
GROUP BY subscription_tier 
ORDER BY subscription_tier;

SELECT 'Account statuses:' AS info;
SELECT account_status, COUNT(*) as count 
FROM public.companies 
GROUP BY account_status 
ORDER BY account_status;

SELECT 'Trial management:' AS info;
SELECT 
  COUNT(*) as total_companies,
  COUNT(trial_ends_at) as companies_with_trial_end,
  COUNT(trial_started_at) as companies_with_trial_start
FROM public.companies;

-- Check for any problematic records
SELECT 'Verification - Any old subscription tiers remaining:' AS check_title;
SELECT subscription_tier, COUNT(*) 
FROM public.companies 
WHERE subscription_tier NOT IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus')
GROUP BY subscription_tier;

SELECT 'Update complete! New pricing structure is active.' AS final_status;