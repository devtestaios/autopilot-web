'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ===============================================
// ENHANCED USER TYPES - PRODUCTION READY
// ===============================================

export type UserRole = 
  | 'super_admin' 
  | 'agency_owner' 
  | 'account_manager' 
  | 'campaign_manager' 
  | 'content_creator' 
  | 'analyst' 
  | 'client_viewer';

export type AccountStatus = 
  | 'active' 
  | 'suspended' 
  | 'pending_verification' 
  | 'deactivated';

export type SubscriptionTier = 
  | 'free' 
  | 'starter' 
  | 'professional' 
  | 'enterprise';

export interface UserPermissions {
  [resource: string]: string[]; // e.g., { "campaigns": ["create", "read", "update"], "reports": ["read"] }
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  campaignAlerts: boolean;
  performanceUpdates: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'private' | 'contacts';
  gdprConsent: boolean;
  ccpaOptOut: boolean;
}

export interface DashboardPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  defaultLayout: string;
  sidebarCollapsed: boolean;
  denseMode: boolean;
  defaultView: 'dashboard' | 'campaigns' | 'analytics';
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  lastPasswordChange?: string;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: string;
    location?: string;
  }>;
  loginNotifications: boolean;
  sessionTimeout: number; // minutes
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  subscriptionTier: SubscriptionTier;
  userLimit: number;
  currentUserCount: number;
  accountStatus: AccountStatus;
  settings: {
    brandColors: string[];
    logoUrl?: string;
    defaultTimezone: string;
    businessHours: Record<string, any>;
    approvalWorkflowEnabled: boolean;
    ssoEnabled: boolean;
  };
}

export interface EnhancedUser {
  // Basic Identity
  id: string;
  email: string;
  username?: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  
  // Business Context
  company?: Company;
  companyId?: string;
  department?: string;
  jobTitle?: string;
  
  // Account Management
  role: UserRole;
  permissions: UserPermissions;
  accountStatus: AccountStatus;
  subscriptionTier: SubscriptionTier;
  
  // Security & Verification
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  securitySettings: SecuritySettings;
  
  // Activity & Session
  lastLoginAt?: string;
  lastActivityAt?: string;
  loginCount: number;
  
  // Preferences
  preferences: {
    dashboard: DashboardPreferences;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
  };
  
  // Compliance & Legal
  termsAcceptedAt?: string;
  privacyPolicyAcceptedAt?: string;
  gdprConsent: boolean;
  
  // Audit Trail
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  // Core State
  user: EnhancedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Authentication Methods
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; requiresMfa?: boolean }>;
  signup: (email: string, password: string, displayName: string, companyName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // MFA Methods
  enableMfa: () => Promise<{ success: boolean; secret?: string; qrCode?: string; backupCodes?: string[]; error?: string }>;
  disableMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  verifyMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  
  // User Management
  updateUser: (updates: Partial<EnhancedUser>) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (preferences: Partial<EnhancedUser['preferences']>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  
  // Permission & Role Management
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccess: (feature: string) => boolean;
  
  // Security & Session Management
  getSessions: () => Promise<Array<{
    id: string;
    deviceInfo: string;
    location?: string;
    lastActivity: string;
    isCurrent: boolean;
  }>>;
  revokeSession: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
  revokeAllSessions: () => Promise<{ success: boolean; error?: string }>;
  
  // Audit & Compliance
  getAuditLogs: (limit?: number) => Promise<Array<{
    id: string;
    action: string;
    resource: string;
    timestamp: string;
    ipAddress?: string;
    details?: Record<string, any>;
  }>>;
  
  // Company Management (for company admins)
  updateCompany: (updates: Partial<Company>) => Promise<{ success: boolean; error?: string }>;
  inviteUser: (email: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  getCompanyUsers: () => Promise<EnhancedUser[]>;
  updateUserRole: (userId: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  deactivateUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('⚠️ useAuth called outside of AuthProvider!');
    // Return a mock context instead of throwing
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => ({ success: false, error: 'Auth provider not initialized' }),
      signup: async () => ({ success: false, error: 'Auth provider not initialized' }),
      logout: async () => {},
      resetPassword: async () => ({ success: false }),
      enableMfa: async () => ({ success: false }),
      disableMfa: async () => ({ success: false }),
      verifyMfa: async () => ({ success: false }),
      updateUser: async () => ({ success: false }),
      updatePreferences: async () => ({ success: false }),
      changePassword: async () => ({ success: false }),
      deleteAccount: async () => ({ success: false }),
      hasPermission: () => false,
      hasRole: () => false,
      canAccess: () => false,
      getSessions: async () => [],
      revokeSession: async () => ({ success: false }),
      revokeAllSessions: async () => ({ success: false }),
      getAuditLogs: async () => [],
      updateCompany: async () => ({ success: false }),
      inviteUser: async () => ({ success: false }),
      getCompanyUsers: async () => [],
      updateUserRole: async () => ({ success: false }),
      deactivateUser: async () => ({ success: false }),
    } as AuthContextType;
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Check if Supabase is properly configured
  useEffect(() => {
    const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsSupabaseConfigured(configured);
    if (!configured) {
      console.warn('Supabase not configured. Using mock authentication for demo purposes.');
    }
  }, []);

  // Helper function for safe localStorage access
  const safeLocalStorage = {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  };

  // Enhanced user profile fetching with company data
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<EnhancedUser | null> => {
    try {
      // Fetch user profile with company data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      // Fetch user permissions
      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('resource, action')
        .eq('user_id', supabaseUser.id)
        .eq('is_active', true);

      // Build permissions object
      const userPermissions: UserPermissions = {};
      permissions?.forEach(perm => {
        if (!userPermissions[perm.resource]) {
          userPermissions[perm.resource] = [];
        }
        userPermissions[perm.resource].push(perm.action);
      });

      // Transform to EnhancedUser format
      const enhancedUser: EnhancedUser = {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.display_name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        avatar: profile.avatar_url,
        phone: profile.phone,
        
        company: profile.company,
        companyId: profile.company_id,
        department: profile.department,
        jobTitle: profile.job_title,
        
        role: profile.role,
        permissions: userPermissions,
        accountStatus: profile.account_status,
        subscriptionTier: profile.subscription_tier,
        
        emailVerified: profile.email_verified,
        phoneVerified: profile.phone_verified,
        mfaEnabled: profile.mfa_enabled,
        securitySettings: {
          mfaEnabled: profile.mfa_enabled,
          trustedDevices: [],
          loginNotifications: true,
          sessionTimeout: 480 // 8 hours default
        },
        
        lastLoginAt: profile.last_login_at,
        lastActivityAt: profile.last_activity_at,
        loginCount: profile.login_count || 0,
        
        preferences: {
          dashboard: {
            theme: profile.preferences?.theme || 'light',
            language: profile.preferences?.language || 'en',
            timezone: profile.preferences?.timezone || 'UTC',
            dateFormat: profile.preferences?.date_format || 'MM/dd/yyyy',
            numberFormat: profile.preferences?.number_format || 'en-US',
            defaultLayout: profile.preferences?.dashboard?.default_layout || 'default',
            sidebarCollapsed: profile.preferences?.dashboard?.sidebar_collapsed || false,
            denseMode: profile.preferences?.dashboard?.dense_mode || false,
            defaultView: profile.preferences?.dashboard?.default_view || 'dashboard'
          },
          notifications: {
            email: profile.preferences?.notifications?.email ?? true,
            push: profile.preferences?.notifications?.push ?? true,
            sms: false,
            campaignAlerts: true,
            performanceUpdates: true,
            budgetAlerts: true,
            weeklyReports: true,
            digestFrequency: profile.preferences?.notifications?.digest_frequency || 'daily'
          },
          privacy: {
            dataSharing: profile.preferences?.privacy?.data_sharing_consent || false,
            analytics: profile.preferences?.privacy?.analytics_opt_in ?? true,
            marketingEmails: true,
            profileVisibility: profile.preferences?.privacy?.profile_visibility || 'private',
            gdprConsent: profile.gdpr_consent || false,
            ccpaOptOut: profile.ccpa_opt_out || false
          }
        },
        
        termsAcceptedAt: profile.terms_accepted_at,
        privacyPolicyAcceptedAt: profile.privacy_policy_accepted_at,
        gdprConsent: profile.gdpr_consent || false,
        
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      };

      return enhancedUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check for existing session and listen for auth changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const enhancedUser = await fetchUserProfile(session.user);
          setUser(enhancedUser);
          
          // Update last activity
          if (enhancedUser) {
            await supabase
              .from('profiles')
              .update({ 
                last_activity_at: new Date().toISOString(),
                last_login_ip: null // This would be set server-side
              })
              .eq('id', enhancedUser.id);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const enhancedUser = await fetchUserProfile(session.user);
        setUser(enhancedUser);
        
        // Log security event
        if (enhancedUser) {
          await supabase.from('security_events').insert({
            user_id: enhancedUser.id,
            event_type: 'login_success',
            severity: 'info',
            description: 'User logged in successfully'
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  // Enhanced login with security logging
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string; requiresMfa?: boolean }> => {
    console.log('🔐 Login attempt started for:', email);

    try {
      if (!isSupabaseConfigured) {
        console.log('⚠️ Supabase not configured, using mock login');
        // Mock login for demo
        const mockUser: EnhancedUser = {
          id: 'mock-user-id',
          email,
          displayName: email.split('@')[0],
          role: 'account_manager',
          permissions: {
            campaigns: ['create', 'read', 'update'],
            reports: ['read']
          },
          accountStatus: 'active',
          subscriptionTier: 'professional',
          emailVerified: true,
          phoneVerified: false,
          mfaEnabled: false,
          securitySettings: {
            mfaEnabled: false,
            trustedDevices: [],
            loginNotifications: true,
            sessionTimeout: 480
          },
          loginCount: 1,
          preferences: {
            dashboard: {
              theme: 'light',
              language: 'en',
              timezone: 'UTC',
              dateFormat: 'MM/dd/yyyy',
              numberFormat: 'en-US',
              defaultLayout: 'default',
              sidebarCollapsed: false,
              denseMode: false,
              defaultView: 'dashboard'
            },
            notifications: {
              email: true,
              push: true,
              sms: false,
              campaignAlerts: true,
              performanceUpdates: true,
              budgetAlerts: true,
              weeklyReports: true,
              digestFrequency: 'daily'
            },
            privacy: {
              dataSharing: false,
              analytics: true,
              marketingEmails: true,
              profileVisibility: 'private',
              gdprConsent: false,
              ccpaOptOut: false
            }
          },
          gdprConsent: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setUser(mockUser);
        safeLocalStorage.setItem('demo_user', JSON.stringify(mockUser));
        console.log('✅ Mock login successful');
        return { success: true };
      }

      console.log('🔍 Attempting Supabase authentication...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Authentication failed:', error.message);

        // Log failed login attempt (non-blocking)
        try {
          await supabase.from('security_events').insert({
            user_id: null,
            event_type: 'login_failure',
            severity: 'warning',
            description: `Failed login attempt for ${email}`,
            metadata: { error: error.message }
          });
        } catch (logError) {
          console.warn('Failed to log security event:', logError);
        }

        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Authentication successful, fetching profile...');
        const enhancedUser = await fetchUserProfile(data.user);

        if (!enhancedUser) {
          console.error('❌ Failed to fetch user profile');
          return { success: false, error: 'Failed to load user profile' };
        }

        console.log('✅ User profile loaded:', enhancedUser.displayName);

        if (enhancedUser.mfaEnabled) {
          console.log('🔐 MFA enabled for user, requiring verification');
          return { success: true, requiresMfa: true };
        }

        setUser(enhancedUser);

        // Update login statistics (non-blocking)
        try {
          await supabase
            .from('profiles')
            .update({
              last_login_at: new Date().toISOString(),
              login_count: (enhancedUser.loginCount || 0) + 1,
              failed_login_attempts: 0
            })
            .eq('id', data.user.id);
        } catch (updateError) {
          console.warn('Failed to update login stats:', updateError);
        }

        console.log('✅ Login completed successfully');
        return { success: true };
      }

      console.error('❌ No user data returned from authentication');
      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Enhanced signup with company creation
  const signup = async (email: string, password: string, displayName: string, companyName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        return { success: false, error: 'Authentication not configured' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        let companyId = null;
        
        // Create company if provided
        if (companyName) {
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: companyName,
              slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              created_by: data.user.id
            })
            .select()
            .single();
            
          if (!companyError && company) {
            companyId = company.id;
          }
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            display_name: displayName,
            company_id: companyId,
            role: companyName ? 'agency_owner' : 'user',
            terms_accepted_at: new Date().toISOString(),
            privacy_policy_accepted_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { success: false, error: 'Failed to create user profile' };
        }

        return { success: true };
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Enhanced logout with session cleanup
  const logout = async (): Promise<void> => {
    try {
      if (user) {
        // Log security event
        await supabase.from('security_events').insert({
          user_id: user.id,
          event_type: 'logout',
          severity: 'info',
          description: 'User logged out'
        });
      }

      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      safeLocalStorage.removeItem('demo_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Permission checking helpers
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    
    // Check specific permissions
    const resourcePermissions = user.permissions[resource];
    return resourcePermissions?.includes(action) || resourcePermissions?.includes('*') || false;
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    
    // Define feature access matrix
    const featureAccess: Record<string, UserRole[]> = {
      'user_management': ['super_admin', 'agency_owner'],
      'billing': ['super_admin', 'agency_owner'],
      'company_settings': ['super_admin', 'agency_owner'],
      'advanced_analytics': ['super_admin', 'agency_owner', 'account_manager', 'analyst'],
      'campaign_creation': ['super_admin', 'agency_owner', 'account_manager', 'campaign_manager'],
      'content_creation': ['super_admin', 'agency_owner', 'account_manager', 'campaign_manager', 'content_creator'],
      'reports': ['super_admin', 'agency_owner', 'account_manager', 'campaign_manager', 'analyst', 'client_viewer']
    };
    
    const allowedRoles = featureAccess[feature];
    return allowedRoles ? allowedRoles.includes(user.role) : true;
  };

  // Placeholder implementations for advanced features
  const resetPassword = async (email: string) => ({ success: true });
  const enableMfa = async () => ({ success: true, secret: 'mock-secret', backupCodes: ['123456'] });
  const disableMfa = async (code: string) => ({ success: true });
  const verifyMfa = async (code: string) => ({ success: true });
  const updateUser = async (updates: Partial<EnhancedUser>) => ({ success: true });
  const updatePreferences = async (preferences: Partial<EnhancedUser['preferences']>) => ({ success: true });
  const changePassword = async (currentPassword: string, newPassword: string) => ({ success: true });
  const deleteAccount = async (password: string) => ({ success: true });
  const getSessions = async () => ([]);
  const revokeSession = async (sessionId: string) => ({ success: true });
  const revokeAllSessions = async () => ({ success: true });
  const getAuditLogs = async (limit: number = 50) => ([]);
  const updateCompany = async (updates: Partial<Company>) => ({ success: true });
  const inviteUser = async (email: string, role: UserRole) => ({ success: true });
  const getCompanyUsers = async (): Promise<EnhancedUser[]> => ([]);
  const updateUserRole = async (userId: string, role: UserRole) => ({ success: true });
  const deactivateUser = async (userId: string) => ({ success: true });

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPassword,
    enableMfa,
    disableMfa,
    verifyMfa,
    updateUser,
    updatePreferences,
    changePassword,
    deleteAccount,
    hasPermission,
    hasRole,
    canAccess,
    getSessions,
    revokeSession,
    revokeAllSessions,
    getAuditLogs,
    updateCompany,
    inviteUser,
    getCompanyUsers,
    updateUserRole,
    deactivateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}