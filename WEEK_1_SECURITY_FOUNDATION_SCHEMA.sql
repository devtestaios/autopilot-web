-- ===============================================
-- WEEK 1: SECURITY FOUNDATION - USER MANAGEMENT SCHEMA
-- Production-ready user management for 1200+ users
-- PulseBridge.ai Enterprise Platform
-- Execute in Supabase SQL Editor
-- ===============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- ===============================================
-- 1. COMPREHENSIVE USER MANAGEMENT TABLES
-- ===============================================

-- 1.1 Enhanced Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Business Context
  company_id UUID,
  department TEXT,
  job_title TEXT,
  
  -- Account Management
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'agency_owner', 'account_manager', 'campaign_manager', 'content_creator', 'analyst', 'client_viewer')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending_verification', 'deactivated')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  
  -- Security & Session Management
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret TEXT,
  backup_codes TEXT[],
  
  -- Login & Activity Tracking
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Security Monitoring
  last_login_ip INET,
  last_login_location JSONB,
  trusted_devices JSONB DEFAULT '[]'::jsonb,
  suspicious_activity_count INTEGER DEFAULT 0,
  
  -- Preferences & Personalization
  preferences JSONB DEFAULT '{
    "theme": "light",
    "language": "en",
    "timezone": "UTC",
    "date_format": "MM/dd/yyyy",
    "number_format": "en-US",
    "notifications": {
      "email": true,
      "push": true,
      "digest_frequency": "daily"
    },
    "dashboard": {
      "default_layout": "default",
      "sidebar_collapsed": false,
      "dense_mode": false
    },
    "privacy": {
      "analytics_opt_in": true,
      "data_sharing_consent": false,
      "profile_visibility": "private"
    }
  }'::jsonb,
  
  -- Audit Trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  
  -- Compliance & Legal
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  ccpa_opt_out BOOLEAN DEFAULT FALSE,
  data_retention_until TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL,
  CONSTRAINT fk_profiles_created_by FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT fk_profiles_updated_by FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);

-- 1.2 Companies/Organizations Table
CREATE TABLE IF NOT EXISTS public.companies (
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
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
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
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'trial', 'cancelled')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit Trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT fk_companies_created_by FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);

-- 1.3 User Sessions Table
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

-- 1.4 User Permissions Table
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

-- 1.5 Audit Logs Table
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

-- 1.6 Security Events Table
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

-- ===============================================
-- 2. ROLE-BASED ACCESS CONTROL (RBAC)
-- ===============================================

-- 2.1 Roles Table
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

-- 2.2 User Roles Table (Many-to-Many)
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
-- 3. INDEXES FOR PERFORMANCE
-- ===============================================

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login_at);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);

-- Audit logs indexes (for performance and compliance)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON public.security_events(ip_address);

-- User permissions indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON public.user_permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_user_permissions_active ON public.user_permissions(user_id, is_active) WHERE is_active = true;

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON public.companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(account_status);

-- ===============================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Company admins can view company users" ON public.profiles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('agency_owner', 'account_manager')
    )
  );

-- User sessions policies  
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs policies (read-only for users, admins can see all)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin', 'agency_owner')
    )
  );

-- Security events policies
CREATE POLICY "Users can view own security events" ON public.security_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Security admins can view all events" ON public.security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin')
    )
  );

-- Companies policies
CREATE POLICY "Company members can view their company" ON public.companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ===============================================
-- 5. TRIGGERS FOR AUTOMATION
-- ===============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trail trigger
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, new_values, ip_address
    ) VALUES (
      auth.uid(),
      'CREATE',
      TG_TABLE_NAME,
      NEW.id::text,
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, old_values, new_values, ip_address
    ) VALUES (
      auth.uid(),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id::text,
      to_jsonb(OLD),
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, old_values, ip_address
    ) VALUES (
      auth.uid(),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id::text,
      to_jsonb(OLD),
      inet_client_addr()
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_companies_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ===============================================
-- 6. INITIAL DATA SETUP
-- ===============================================

-- Create default roles
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
-- 7. UTILITY FUNCTIONS
-- ===============================================

-- Function to check user permissions
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

-- Function to log security events
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
    inet_client_addr(), current_setting('request.headers', true)::jsonb->>'user-agent'
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 8. GRANT PERMISSIONS
-- ===============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

SELECT 'Week 1 Security Foundation: User Management Schema deployed successfully!' AS result;
SELECT 'Tables created: profiles, companies, user_sessions, user_permissions, audit_logs, security_events, roles, user_roles' AS tables_created;
SELECT 'Next steps: Update AuthContext.tsx to use new schema and implement frontend user management' AS next_steps;