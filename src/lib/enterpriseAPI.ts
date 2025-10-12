/**
 * Enterprise Multi-Tenant Company Management API
 * Comprehensive company/organization management with tenant isolation
 * Subscription management and user limits enforcement
 */

import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// ===============================================
// ENTERPRISE COMPANY TYPES
// ===============================================

export interface EnterpriseCompany {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  industry?: string;
  company_size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  
  // Contact Information
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
  website?: string;
  
  // Subscription & Billing
  subscription_tier: 'trial' | 'solo_professional' | 'growth_team' | 'professional_agency' | 'enterprise' | 'enterprise_plus';
  billing_email?: string;
  tax_id?: string;
  
  // Enterprise Settings
  settings: {
    brand_colors: string[];
    logo_url?: string;
    default_timezone: string;
    business_hours: {
      [day: string]: { start: string; end: string; enabled: boolean };
    };
    approval_workflow_enabled: boolean;
    sso_enabled: boolean;
    data_retention_days: number;
    api_rate_limit: number;
    custom_domain?: string;
    white_label_enabled: boolean;
  };
  
  // Usage & Analytics
  user_limit: number;
  current_user_count: number;
  storage_limit_gb: number;
  current_storage_gb: number;
  api_calls_month: number;
  api_limit_month: number;
  
  // Account Management
  account_status: 'active' | 'suspended' | 'trial' | 'cancelled';
  trial_ends_at?: string;
  
  // Audit Trail
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Computed fields
  users?: EnterpriseUser[];
  usage_stats?: CompanyUsageStats;
}

export interface EnterpriseUser {
  id: string;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  company_id?: string;
  company_name?: string;
  department?: string;
  job_title?: string;
  role: 'super_admin' | 'agency_owner' | 'account_manager' | 'campaign_manager' | 'content_creator' | 'analyst' | 'client_viewer';
  account_status: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  subscription_tier: 'trial' | 'solo_professional' | 'growth_team' | 'professional_agency' | 'enterprise' | 'enterprise_plus';
  last_login_at?: string;
  created_at: string;
}

export interface CompanyUsageStats {
  total_users: number;
  active_users_30d: number;
  storage_used_gb: number;
  api_calls_month: number;
  campaigns_active: number;
  emails_sent_month: number;
  social_posts_month: number;
  last_activity: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    users: number;
    storage_gb: number;
    api_calls_month: number;
    campaigns: number;
    social_accounts: number;
    email_contacts: number;
  };
  enterprise_features: {
    sso: boolean;
    white_label: boolean;
    custom_domain: boolean;
    dedicated_support: boolean;
    advanced_analytics: boolean;
    api_access: boolean;
  };
  contact_sales?: boolean; // Flag for custom pricing tiers
  custom_pricing?: boolean; // Hide price display
}

// ===============================================
// COMPANY MANAGEMENT API
// ===============================================

export class EnterpriseCompanyAPI {
  
  // Fetch all companies with pagination and filtering
  static async fetchCompanies(options: {
    limit?: number;
    offset?: number;
    search?: string;
    status?: string;
    subscription_tier?: string;
  } = {}): Promise<{ companies: EnterpriseCompany[]; total: number }> {
    try {
      const { limit = 50, offset = 0, search, status, subscription_tier } = options;
      
      let query = supabase
        .from('companies')
        .select(`
          *,
          profiles!inner(
            id, email, display_name, role, account_status, last_login_at, created_at
          )
        `, { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('account_status', status);
      }
      if (subscription_tier) {
        query = query.eq('subscription_tier', subscription_tier);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const companies = (data || []).map((company: any) => ({
        ...company,
        users: company.profiles || [],
        profiles: undefined // Remove nested object
      }));

      return { companies, total: count || 0 };
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
  }

  // Fetch single company with detailed usage stats
  static async fetchCompanyById(companyId: string): Promise<EnterpriseCompany> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          profiles (
            id, email, display_name, first_name, last_name, avatar_url,
            department, job_title, role, account_status, last_login_at, created_at
          )
        `)
        .eq('id', companyId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Company not found');

      // Fetch usage statistics
      const usage_stats = await this.fetchCompanyUsageStats(companyId);

      return {
        ...data,
        users: data.profiles || [],
        usage_stats,
        profiles: undefined // Remove nested object
      };
    } catch (error) {
      console.error('Error fetching company:', error);
      throw new Error('Failed to fetch company details');
    }
  }

  // Create new company with initial setup
  static async createCompany(companyData: {
    name: string;
    slug: string;
    domain?: string;
    industry?: string;
    company_size: EnterpriseCompany['company_size'];
    subscription_tier: EnterpriseCompany['subscription_tier'];
    owner_email: string;
    owner_name: string;
  }): Promise<EnterpriseCompany> {
    try {
      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          slug: companyData.slug,
          domain: companyData.domain,
          industry: companyData.industry,
          company_size: companyData.company_size,
          subscription_tier: companyData.subscription_tier,
          user_limit: this.getSubscriptionLimits(companyData.subscription_tier).users,
          storage_limit_gb: this.getSubscriptionLimits(companyData.subscription_tier).storage_gb,
          settings: this.getDefaultCompanySettings()
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create owner user profile (would integrate with auth system)
      // This is a placeholder - in production, this would be part of user registration
      
      return company;
    } catch (error) {
      console.error('Error creating company:', error);
      throw new Error('Failed to create company');
    }
  }

  // Update company details
  static async updateCompany(companyId: string, updates: Partial<EnterpriseCompany>): Promise<EnterpriseCompany> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw new Error('Failed to update company');
    }
  }

  // Upgrade/downgrade subscription
  static async updateSubscription(companyId: string, newTier: EnterpriseCompany['subscription_tier']): Promise<void> {
    try {
      const limits = this.getSubscriptionLimits(newTier);
      
      const { error } = await supabase
        .from('companies')
        .update({
          subscription_tier: newTier,
          user_limit: limits.users,
          storage_limit_gb: limits.storage_gb,
          api_limit_month: limits.api_calls_month,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId);

      if (error) throw error;

      // Log subscription change
      await this.logCompanyAction(companyId, 'SUBSCRIPTION_CHANGED', {
        new_tier: newTier,
        new_limits: limits
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  // Fetch company usage statistics
  static async fetchCompanyUsageStats(companyId: string): Promise<CompanyUsageStats> {
    try {
      // Get user count
      const { count: total_users } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

      // Get active users (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count: active_users_30d } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('last_login_at', thirtyDaysAgo);

      // Mock other stats (would come from actual usage tables)
      return {
        total_users: total_users || 0,
        active_users_30d: active_users_30d || 0,
        storage_used_gb: Math.random() * 10, // Would be calculated from actual storage
        api_calls_month: Math.floor(Math.random() * 10000), // Would be from API logs
        campaigns_active: Math.floor(Math.random() * 50), // Would be from campaigns table
        emails_sent_month: Math.floor(Math.random() * 100000), // Would be from email stats
        social_posts_month: Math.floor(Math.random() * 1000), // Would be from social posts
        last_activity: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return {
        total_users: 0,
        active_users_30d: 0,
        storage_used_gb: 0,
        api_calls_month: 0,
        campaigns_active: 0,
        emails_sent_month: 0,
        social_posts_month: 0,
        last_activity: new Date().toISOString()
      };
    }
  }

  // Enforce usage limits
  static async enforceUsageLimits(companyId: string): Promise<{
    users_exceeded: boolean;
    storage_exceeded: boolean;
    api_exceeded: boolean;
  }> {
    try {
      const company = await this.fetchCompanyById(companyId);
      const stats = company.usage_stats!;

      return {
        users_exceeded: stats.total_users > company.user_limit,
        storage_exceeded: stats.storage_used_gb > company.storage_limit_gb,
        api_exceeded: stats.api_calls_month > company.api_limit_month
      };
    } catch (error) {
      console.error('Error enforcing limits:', error);
      return { users_exceeded: false, storage_exceeded: false, api_exceeded: false };
    }
  }

  // Helper: Get subscription limits
  private static getSubscriptionLimits(tier: string) {
    const limits = {
      trial: { users: 2, storage_gb: 5, api_calls_month: 5000 },
      solo_professional: { users: 1, storage_gb: 10, api_calls_month: 15000 },
      growth_team: { users: 5, storage_gb: 50, api_calls_month: 50000 },
      professional_agency: { users: 15, storage_gb: 200, api_calls_month: 200000 },
      enterprise: { users: 50, storage_gb: 1000, api_calls_month: 1000000 },
      enterprise_plus: { users: -1, storage_gb: -1, api_calls_month: -1 }
    };
    return limits[tier as keyof typeof limits] || limits.trial;
  }

  // Helper: Get default company settings
  private static getDefaultCompanySettings() {
    return {
      brand_colors: ['#3B82F6', '#1F2937'],
      logo_url: null,
      default_timezone: 'UTC',
      business_hours: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '09:00', end: '17:00', enabled: false },
        sunday: { start: '09:00', end: '17:00', enabled: false }
      },
      approval_workflow_enabled: false,
      sso_enabled: false,
      data_retention_days: 365,
      api_rate_limit: 1000,
      custom_domain: null,
      white_label_enabled: false
    };
  }

  // Helper: Log company actions
  private static async logCompanyAction(companyId: string, action: string, metadata: any = {}) {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          company_id: companyId,
          action: `COMPANY_${action}`,
          resource_type: 'company',
          resource_id: companyId,
          new_values: metadata,
          severity: 'info',
          category: 'admin'
        });
    } catch (error) {
      console.error('Error logging company action:', error);
    }
  }
}

// ===============================================
// SUBSCRIPTION PLANS
// ===============================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: '14-Day Free Trial',
    description: 'Trial access for small teams with basic features and all platform connections',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Basic platform access',
      'All platforms connected',
      'Basic features only',
      'Content creation tools',
      'Email marketing basics',
      'Community support'
    ],
    limits: {
      users: 2,
      storage_gb: 5,
      api_calls_month: 5000,
      campaigns: 5,
      social_accounts: 10,
      email_contacts: 1000
    },
    enterprise_features: {
      sso: false,
      white_label: false,
      custom_domain: false,
      dedicated_support: false,
      advanced_analytics: false,
      api_access: false
    }
  },
  {
    id: 'solo_professional',
    name: 'Starter',
    description: 'Perfect for solo entrepreneurs, freelancers, and consultants',
    price_monthly: 69,
    price_yearly: 690, // 17% annual savings (2 months free)
    features: [
      'Core platform features',
      '3 platform connections',
      'AI content generation',
      'Basic analytics',
      'Email support',
      'Community access',
      'Mobile app access'
    ],
    limits: {
      users: 1,
      storage_gb: 10,
      api_calls_month: 15000,
      campaigns: 25,
      social_accounts: 3,
      email_contacts: 10000
    },
    enterprise_features: {
      sso: false,
      white_label: false,
      custom_domain: false,
      dedicated_support: false,
      advanced_analytics: false,
      api_access: true
    }
  },
  {
    id: 'growth_team',
    name: 'Growth',
    description: 'For small teams and growing agencies',
    price_monthly: 169,
    price_yearly: 1690, // 17% annual savings (2 months free)
    features: [
      'Everything in Starter',
      'Unlimited platform connections',
      'Team collaboration features',
      'Advanced analytics & reporting',
      'Priority phone + email support',
      'A/B testing framework',
      'Advanced automation workflows'
    ],
    limits: {
      users: 5,
      storage_gb: 50,
      api_calls_month: 50000,
      campaigns: 75,
      social_accounts: -1, // Unlimited
      email_contacts: 30000
    },
    enterprise_features: {
      sso: false,
      white_label: false,
      custom_domain: false,
      dedicated_support: false,
      advanced_analytics: true,
      api_access: true
    }
  },
  {
    id: 'professional_agency',
    name: 'Agency',
    description: 'For established agencies and marketing departments',
    price_monthly: 469,
    price_yearly: 4690, // 17% annual savings (2 months free)
    features: [
      'Everything in Growth',
      'White-label branding options',
      'Advanced client management',
      'Custom integrations & API access',
      'Priority support',
      'Advanced reporting & dashboards',
      'Custom onboarding & training'
    ],
    limits: {
      users: 15,
      storage_gb: 200,
      api_calls_month: 200000,
      campaigns: 250,
      social_accounts: -1, // Unlimited
      email_contacts: 100000
    },
    enterprise_features: {
      sso: true,
      white_label: true,
      custom_domain: true,
      dedicated_support: true,
      advanced_analytics: true,
      api_access: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large agencies and enterprise organizations',
    price_monthly: 1069,
    price_yearly: 10690, // 17% annual savings (2 months free)
    features: [
      'Everything in Agency',
      'Enterprise security & compliance',
      'Single Sign-On (SSO) integration',
      'Dedicated customer success manager',
      'Custom development & features',
      'Premium 24/7 support with SLAs',
      'Advanced user permissions & roles'
    ],
    limits: {
      users: 50,
      storage_gb: 1000,
      api_calls_month: 1000000,
      campaigns: 1000,
      social_accounts: -1, // Unlimited
      email_contacts: 500000
    },
    enterprise_features: {
      sso: true,
      white_label: true,
      custom_domain: true,
      dedicated_support: true,
      advanced_analytics: true,
      api_access: true
    }
  },
  {
    id: 'enterprise_plus',
    name: 'Enterprise Plus',
    description: 'Custom solutions for complex organizations',
    price_monthly: 0, // Contact sales - no public pricing
    price_yearly: 0,   // Contact sales - no public pricing
    features: [
      'Everything in Enterprise',
      'Unlimited users and features',
      'On-premise deployment options',
      'White-glove onboarding',
      'Custom contracts & SLAs',
      '24/7 dedicated support',
      'Custom integrations',
      'Dedicated customer success manager',
      'Priority feature requests',
      'Volume discounts available'
    ],
    limits: {
      users: -1, // Unlimited
      storage_gb: -1, // Unlimited
      api_calls_month: -1, // Unlimited
      campaigns: -1, // Unlimited
      social_accounts: -1, // Unlimited
      email_contacts: -1 // Unlimited
    },
    enterprise_features: {
      sso: true,
      white_label: true,
      custom_domain: true,
      dedicated_support: true,
      advanced_analytics: true,
      api_access: true
    },
    contact_sales: true, // Flag for custom pricing
    custom_pricing: true // Hide price display
  }
];

export default EnterpriseCompanyAPI;