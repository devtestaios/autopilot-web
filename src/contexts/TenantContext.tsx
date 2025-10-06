'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/lib/supabase';
import type { EnterpriseCompany, EnterpriseUser } from '@/lib/enterpriseAPI';

/**
 * Tenant Context Provider
 * Manages multi-tenant state and tenant-aware data operations
 * Provides tenant isolation for enterprise customers
 */

// ===============================================
// TENANT CONTEXT TYPES
// ===============================================

interface TenantSettings {
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    companyName?: string;
  };
  features?: {
    aiEnabled?: boolean;
    socialMediaEnabled?: boolean;
    emailMarketingEnabled?: boolean;
    analyticsEnabled?: boolean;
    collaborationEnabled?: boolean;
  };
  limits?: {
    maxUsers?: number;
    maxProjects?: number;
    maxCampaigns?: number;
    storageLimit?: number;
  };
  integrations?: {
    enabledPlatforms?: string[];
    apiKeys?: Record<string, string>;
  };
}

interface TenantUsage {
  currentUsers: number;
  currentProjects: number;
  currentCampaigns: number;
  storageUsed: number;
  aiUsageToday: number;
  aiCostToday: number;
}

interface TenantContextType {
  // Current tenant state
  currentTenant: EnterpriseCompany | null;
  tenantUsers: EnterpriseUser[];
  tenantSettings: TenantSettings;
  tenantUsage: TenantUsage;
  
  // Tenant management
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  inviteUserToTenant: (email: string, role: string) => Promise<void>;
  removeUserFromTenant: (userId: string) => Promise<void>;
  
  // Tenant-aware data operations
  getTenantData: <T>(table: string, query?: any) => Promise<T[]>;
  createTenantData: <T>(table: string, data: any) => Promise<T>;
  updateTenantData: <T>(table: string, id: string, updates: any) => Promise<T>;
  deleteTenantData: (table: string, id: string) => Promise<void>;
  
  // Utilities
  isLoading: boolean;
  error: string | null;
  refreshTenantData: () => Promise<void>;
  canAccessFeature: (feature: string) => boolean;
  isWithinUsageLimits: (resource: string) => boolean;
}

// ===============================================
// TENANT CONTEXT
// ===============================================

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// ===============================================
// TENANT PROVIDER
// ===============================================

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // State management
  const [currentTenant, setCurrentTenant] = useState<EnterpriseCompany | null>(null);
  const [tenantUsers, setTenantUsers] = useState<EnterpriseUser[]>([]);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings>({});
  const [tenantUsage, setTenantUsage] = useState<TenantUsage>({
    currentUsers: 0,
    currentProjects: 0,
    currentCampaigns: 0,
    storageUsed: 0,
    aiUsageToday: 0,
    aiCostToday: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===============================================
  // TENANT DATA LOADING
  // ===============================================

  const loadTenantData = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load company details
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (companyError) throw companyError;
      setCurrentTenant(company);

      // Load tenant users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role),
          companies!inner(name)
        `)
        .eq('company_id', tenantId);

      if (usersError) throw usersError;
      setTenantUsers(users as EnterpriseUser[]);

      // Load tenant settings
      const { data: settings, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', tenantId)
        .single();

      if (!settingsError && settings) {
        setTenantSettings(settings);
      }

      // Load usage statistics
      await loadTenantUsage(tenantId);

    } catch (err) {
      console.error('Failed to load tenant data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tenant data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTenantUsage = useCallback(async (tenantId: string) => {
    try {
      // Get current usage counts
      const [usersCount, projectsCount, campaignsCount, aiUsageData] = await Promise.all([
        // Count users
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('company_id', tenantId),
        
        // Count projects
        supabase
          .from('collaboration_projects')
          .select('id', { count: 'exact' })
          .eq('company_id', tenantId),
        
        // Count campaigns
        supabase
          .from('email_campaigns')
          .select('id', { count: 'exact' })
          .eq('company_id', tenantId),
        
        // Get AI usage for today
        supabase
          .from('ai_usage')
          .select('cost_usd')
          .eq('company_id', tenantId)
          .gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      const aiTotalCost = aiUsageData.data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;

      setTenantUsage({
        currentUsers: usersCount.count || 0,
        currentProjects: projectsCount.count || 0,
        currentCampaigns: campaignsCount.count || 0,
        storageUsed: 0, // TODO: Calculate storage usage
        aiUsageToday: aiUsageData.data?.length || 0,
        aiCostToday: aiTotalCost
      });

    } catch (err) {
      console.error('Failed to load tenant usage:', err);
    }
  }, []);

  // ===============================================
  // TENANT OPERATIONS
  // ===============================================

  const switchTenant = useCallback(async (tenantId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    // Verify user has access to this tenant
    const { data: access, error } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .eq('company_id', tenantId)
      .single();

    if (error || !access) {
      throw new Error('Access denied to this tenant');
    }

    await loadTenantData(tenantId);
  }, [user, loadTenantData]);

  const updateTenantSettings = useCallback(async (updates: Partial<TenantSettings>) => {
    if (!currentTenant) throw new Error('No current tenant');

    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          company_id: currentTenant.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setTenantSettings(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Failed to update tenant settings:', err);
      throw err;
    }
  }, [currentTenant]);

  const inviteUserToTenant = useCallback(async (email: string, role: string) => {
    if (!currentTenant) throw new Error('No current tenant');

    try {
      // TODO: Implement user invitation system
      // This would typically:
      // 1. Send invitation email
      // 2. Create pending invitation record
      // 3. Handle invitation acceptance
      
      console.log('Inviting user:', { email, role, tenantId: currentTenant.id });
      
      // For now, just refresh tenant data
      await loadTenantData(currentTenant.id);
    } catch (err) {
      console.error('Failed to invite user:', err);
      throw err;
    }
  }, [currentTenant, loadTenantData]);

  const removeUserFromTenant = useCallback(async (userId: string) => {
    if (!currentTenant) throw new Error('No current tenant');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company_id: null })
        .eq('id', userId)
        .eq('company_id', currentTenant.id);

      if (error) throw error;

      // Refresh tenant users
      await loadTenantData(currentTenant.id);
    } catch (err) {
      console.error('Failed to remove user:', err);
      throw err;
    }
  }, [currentTenant, loadTenantData]);

  // ===============================================
  // TENANT-AWARE DATA OPERATIONS
  // ===============================================

  const getTenantData = useCallback(async (table: string, query?: any): Promise<any[]> => {
    if (!currentTenant) throw new Error('No current tenant');

    const queryBuilder = supabase
      .from(table)
      .select(query?.select || '*')
      .eq('company_id', currentTenant.id);

    if (query?.where) {
      Object.entries(query.where).forEach(([key, value]) => {
        queryBuilder.eq(key, value);
      });
    }

    if (query?.orderBy) {
      queryBuilder.order(query.orderBy.column, { ascending: query.orderBy.ascending });
    }

    if (query?.limit) {
      queryBuilder.limit(query.limit);
    }

    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    return data || [];
  }, [currentTenant]);

  const createTenantData = useCallback(async (table: string, data: any): Promise<any> => {
    if (!currentTenant) throw new Error('No current tenant');

    const { data: result, error } = await supabase
      .from(table)
      .insert({
        ...data,
        company_id: currentTenant.id
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }, [currentTenant]);

  const updateTenantData = useCallback(async (table: string, id: string, updates: any): Promise<any> => {
    if (!currentTenant) throw new Error('No current tenant');

    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .eq('company_id', currentTenant.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, [currentTenant]);

  const deleteTenantData = useCallback(async (table: string, id: string): Promise<void> => {
    if (!currentTenant) throw new Error('No current tenant');

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('company_id', currentTenant.id);

    if (error) throw error;
  }, [currentTenant]);

  // ===============================================
  // UTILITY FUNCTIONS
  // ===============================================

  const refreshTenantData = useCallback(async () => {
    if (currentTenant) {
      await loadTenantData(currentTenant.id);
    }
  }, [currentTenant, loadTenantData]);

  const canAccessFeature = useCallback((feature: string): boolean => {
    if (!currentTenant) return false;
    
    // Check subscription tier features
    const tierFeatures = {
      trial: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled'],
      solo_professional: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled', 'analyticsEnabled'],
      growth_team: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled', 'analyticsEnabled', 'collaborationEnabled'],
      professional_agency: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled', 'analyticsEnabled', 'collaborationEnabled'],
      enterprise: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled', 'analyticsEnabled', 'collaborationEnabled'],
      enterprise_plus: ['aiEnabled', 'socialMediaEnabled', 'emailMarketingEnabled', 'analyticsEnabled', 'collaborationEnabled']
    };

    const tierFeatureList = tierFeatures[currentTenant.subscription_tier as keyof typeof tierFeatures] || [];
    const settingsEnabled = tenantSettings.features?.[feature as keyof typeof tenantSettings.features];
    
    return tierFeatureList.includes(feature) && (settingsEnabled !== false);
  }, [currentTenant, tenantSettings]);

  const isWithinUsageLimits = useCallback((resource: string): boolean => {
    if (!currentTenant) return false;

    const limits = tenantSettings.limits || {};
    const usage = tenantUsage;

    switch (resource) {
      case 'users':
        return !limits.maxUsers || usage.currentUsers < limits.maxUsers;
      case 'projects':
        return !limits.maxProjects || usage.currentProjects < limits.maxProjects;
      case 'campaigns':
        return !limits.maxCampaigns || usage.currentCampaigns < limits.maxCampaigns;
      case 'storage':
        return !limits.storageLimit || usage.storageUsed < limits.storageLimit;
      default:
        return true;
    }
  }, [tenantSettings, tenantUsage]);

  // ===============================================
  // EFFECTS
  // ===============================================

  // Load tenant data when user changes
  useEffect(() => {
    if (user?.companyId && user.companyId !== currentTenant?.id) {
      loadTenantData(user.companyId);
    }
  }, [user, currentTenant?.id, loadTenantData]);

  // ===============================================
  // CONTEXT VALUE
  // ===============================================

  const contextValue: TenantContextType = {
    // State
    currentTenant,
    tenantUsers,
    tenantSettings,
    tenantUsage,
    
    // Operations
    switchTenant,
    updateTenantSettings,
    inviteUserToTenant,
    removeUserFromTenant,
    
    // Data operations
    getTenantData,
    createTenantData,
    updateTenantData,
    deleteTenantData,
    
    // Utilities
    isLoading,
    error,
    refreshTenantData,
    canAccessFeature,
    isWithinUsageLimits
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

// ===============================================
// TENANT HOOK
// ===============================================

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// ===============================================
// TENANT-AWARE DATA HOOKS
// ===============================================

export function useTenantData<T>(
  table: string,
  query?: {
    select?: string;
    where?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    enabled?: boolean;
  }
) {
  const { getTenantData, currentTenant } = useTenant();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!currentTenant || query?.enabled === false) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTenantData<T>(table, query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [getTenantData, table, query, currentTenant]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export default TenantContext;