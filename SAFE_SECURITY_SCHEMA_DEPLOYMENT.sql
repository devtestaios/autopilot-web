-- ===============================================
-- SAFE SECURITY FOUNDATION SCHEMA DEPLOYMENT
-- Handles existing constraints and tables gracefully
-- PulseBridge.ai Enterprise Platform
-- Execute in Supabase SQL Editor
-- ===============================================

-- Enable necessary extensions (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- ===============================================
-- 1. SAFE TABLE CREATION WITH CONFLICT HANDLING
-- ===============================================

DO $$ 
BEGIN
  -- Check if companies table exists and handle foreign key constraint
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies' AND table_schema = 'public') THEN
    -- Check if the constraint already exists before trying to add it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'fk_companies_created_by' 
      AND table_name = 'companies' 
      AND table_schema = 'public'
    ) THEN
      -- Only add constraint if it doesn't exist
      ALTER TABLE public.companies 
      ADD CONSTRAINT fk_companies_created_by FOREIGN KEY (created_by) REFERENCES public.profiles(id);
    END IF;
  ELSE
    -- Create companies table if it doesn't exist
    CREATE TABLE public.companies (
      id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      domain TEXT UNIQUE,
      industry TEXT,
      company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
      
      -- Contact Information
      address JSONB,
      phone TEXT,
      website TEXT,
      
      -- Subscription & Billing
      subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus')),
      billing_email TEXT,
      tax_id TEXT,
      
      -- Settings & Preferences
      settings JSONB DEFAULT '{
        "brand_colors": [],
        "logo_url": null,
        "default_timezone": "UTC",
        "business_hours": {},
        "approval_workflow_enabled": false,
        "sso_enabled": false
      }'::jsonb,
      
      -- Usage & Analytics
      user_limit INTEGER DEFAULT 5,
      current_user_count INTEGER DEFAULT 0,
      storage_limit_gb INTEGER DEFAULT 10,
      current_storage_gb NUMERIC(10,2) DEFAULT 0,
      
      -- Account Management
      account_status TEXT DEFAULT 'trial' CHECK (account_status IN ('trial', 'active', 'suspended', 'cancelled')),
      trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
      trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- Audit Trail
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID
    );
  END IF;
END $$;

-- ===============================================
-- 2. ENHANCED PROFILES TABLE (SAFE UPDATE)
-- ===============================================

DO $$
BEGIN
  -- Add missing columns to profiles table if they don't exist
  
  -- Check and add subscription_tier column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'trial' 
    CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'));
  END IF;

  -- Check and add mfa_enabled column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'mfa_enabled' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
  END IF;

  -- Check and add mfa_secret column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'mfa_secret' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN mfa_secret TEXT;
  END IF;

  -- Check and add backup_codes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'backup_codes' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN backup_codes TEXT[];
  END IF;

  -- Check and add login_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'login_count' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN login_count INTEGER DEFAULT 0;
  END IF;

  -- Check and add failed_login_attempts column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'failed_login_attempts' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
  END IF;

  -- Check and add locked_until column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'locked_until' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN locked_until TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Check and add last_login_ip column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login_ip' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_login_ip INET;
  END IF;

  -- Check and add last_login_location column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login_location' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_login_location JSONB;
  END IF;

  -- Check and add trusted_devices column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'trusted_devices' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN trusted_devices JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Check and add suspicious_activity_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'suspicious_activity_count' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN suspicious_activity_count INTEGER DEFAULT 0;
  END IF;

  -- Check and add terms_accepted_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'terms_accepted_at' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN terms_accepted_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Check and add privacy_policy_accepted_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'privacy_policy_accepted_at' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Check and add gdpr_consent column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gdpr_consent' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN gdpr_consent BOOLEAN DEFAULT FALSE;
  END IF;

  -- Check and add ccpa_opt_out column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'ccpa_opt_out' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN ccpa_opt_out BOOLEAN DEFAULT FALSE;
  END IF;

  -- Check and add data_retention_until column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'data_retention_until' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN data_retention_until TIMESTAMP WITH TIME ZONE;
  END IF;

END $$;

-- ===============================================
-- 3. CREATE SECURITY TABLES (SAFE CREATION)
-- ===============================================

-- User Sessions Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  
  -- Session Details
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  location JSONB,
  
  -- Security & Management
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT,
  
  -- Audit Trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_sessions_expires_at_check CHECK (expires_at > created_at)
);

-- User Permissions Table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'publish', 'admin')),
  conditions JSONB DEFAULT '{}'::jsonb,
  
  -- Management
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, resource, action)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  -- Action Details
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  
  -- Context & Metadata
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Security Context
  ip_address INET,
  user_agent TEXT,
  session_id UUID REFERENCES public.user_sessions(id),
  
  -- Severity & Classification
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'info', 'warning', 'high', 'critical')),
  category TEXT DEFAULT 'user_action' CHECK (category IN ('auth', 'user_action', 'system', 'security', 'admin')),
  
  -- Compliance
  requires_retention BOOLEAN DEFAULT TRUE,
  retention_until TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Events Table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Event Classification
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_success', 'login_failure', 'logout', 'password_change',
    'mfa_enabled', 'mfa_disabled', 'mfa_challenge_success', 'mfa_challenge_failure',
    'suspicious_login', 'account_locked', 'account_unlocked',
    'permission_escalation', 'data_access', 'bulk_operation'
  )),
  
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Event Context
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Network & Device Context
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  device_fingerprint TEXT,
  
  -- Response & Status
  blocked BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  
  -- Hierarchy & Inheritance
  parent_role_id UUID REFERENCES public.roles(id),
  level INTEGER NOT NULL DEFAULT 0,
  
  -- Permissions
  permissions JSONB DEFAULT '[]'::jsonb,
  
  -- Management
  is_system_role BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  
  -- Context & Scope
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  scope_type TEXT DEFAULT 'global' CHECK (scope_type IN ('global', 'company', 'project')),
  scope_id TEXT,
  
  -- Management
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, role_id, company_id, scope_type, scope_id)
);

-- ===============================================
-- 4. SAFE CONSTRAINT ADDITION
-- ===============================================

DO $$
BEGIN
  -- Add company constraint to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_profiles_company' 
    AND table_name = 'profiles' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;

  -- Add created_by constraint to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_profiles_created_by' 
    AND table_name = 'profiles' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_created_by FOREIGN KEY (created_by) REFERENCES public.profiles(id);
  END IF;

  -- Add updated_by constraint to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_profiles_updated_by' 
    AND table_name = 'profiles' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_updated_by FOREIGN KEY (updated_by) REFERENCES public.profiles(id);
  END IF;

  -- Add companies created_by constraint if it doesn't exist (THIS WAS THE ERROR)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_companies_created_by' 
    AND table_name = 'companies' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.companies 
    ADD CONSTRAINT fk_companies_created_by FOREIGN KEY (created_by) REFERENCES public.profiles(id);
  END IF;

END $$;

-- ===============================================
-- 5. SAFE INDEX CREATION
-- ===============================================

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON public.security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON public.user_permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_user_permissions_active ON public.user_permissions(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON public.companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(account_status);

-- ===============================================
-- 6. SAFE RLS ENABLEMENT
-- ===============================================

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 7. SAFE POLICY CREATION
-- ===============================================

-- Drop existing policies if they exist and recreate
DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Company admins can view company users" ON public.profiles;
  CREATE POLICY "Company admins can view company users" ON public.profiles
    FOR SELECT USING (
      company_id IN (
        SELECT company_id FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('agency_owner', 'account_manager')
      )
    );

  -- User sessions policies
  DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
  CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;
  CREATE POLICY "Users can update own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

  -- Audit logs policies
  DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
  CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
  CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'agency_owner')
      )
    );

  -- Security events policies
  DROP POLICY IF EXISTS "Users can view own security events" ON public.security_events;
  CREATE POLICY "Users can view own security events" ON public.security_events
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Security admins can view all events" ON public.security_events;
  CREATE POLICY "Security admins can view all events" ON public.security_events
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('super_admin')
      )
    );

  -- Companies policies
  DROP POLICY IF EXISTS "Company members can view their company" ON public.companies;
  CREATE POLICY "Company members can view their company" ON public.companies
    FOR SELECT USING (
      id IN (
        SELECT company_id FROM public.profiles WHERE id = auth.uid()
      )
    );
END $$;

-- ===============================================
-- 8. INSERT DEFAULT ROLES (SAFE INSERTION)
-- ===============================================

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
ON CONFLICT (name) DO NOTHING;

-- ===============================================
-- 9. SUCCESS MESSAGE
-- ===============================================

SELECT 'Safe Security Foundation Schema deployed successfully!' AS result;
SELECT 'All existing constraints handled gracefully - no conflicts!' AS status;
SELECT 'Enhanced AuthContext can now connect to production database' AS next_action;