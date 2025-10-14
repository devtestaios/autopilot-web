/**
 * Admin API Client - Database Integration for Admin Dashboard
 * Connects /adminlogin system to real Supabase database
 * Enterprise user management with comprehensive security
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { PostgrestError } from '@supabase/supabase-js';

// Initialize cookie-based Supabase client (FIXED: was using localStorage client)
const supabase = createClientComponentClient();

// ===============================================
// ADMIN API TYPES
// ===============================================

export interface AdminUser {
  id: string;
  email: string;
  username?: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  
  // Business Context
  company_id?: string;
  company_name?: string;
  department?: string;
  job_title?: string;
  
  // Account Management
  role: 'super_admin' | 'agency_owner' | 'account_manager' | 'campaign_manager' | 'content_creator' | 'analyst' | 'client_viewer';
  account_status: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  
  // Security
  email_verified: boolean;
  phone_verified: boolean;
  mfa_enabled: boolean;
  last_login_at?: string;
  last_activity_at?: string;
  login_count: number;
  failed_login_attempts: number;
  locked_until?: string;
  
  // Audit
  created_at: string;
  updated_at: string;
}

export interface AdminSecurityEvent {
  id: string;
  user_id?: string;
  user_email?: string;
  event_type: 'login_success' | 'login_failure' | 'logout' | 'password_change' | 'suspicious_login' | 'account_locked' | 'permission_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  ip_address?: string;
  user_agent?: string;
  location?: any;
  blocked: boolean;
  resolved: boolean;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  severity: 'low' | 'info' | 'warning' | 'high' | 'critical';
  category: 'auth' | 'user_action' | 'system' | 'security' | 'admin';
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalCompanies: number;
  securityEventsToday: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

// ===============================================
// ADMIN API ERROR HANDLING
// ===============================================

export class AdminAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AdminAPIError';
  }
}

// ===============================================
// ADMIN USER MANAGEMENT
// ===============================================

export async function fetchAllUsers(limit = 50, offset = 0): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        username,
        display_name,
        first_name,
        last_name,
        avatar_url,
        phone,
        company_id,
        department,
        job_title,
        role,
        account_status,
        subscription_tier,
        email_verified,
        phone_verified,
        mfa_enabled,
        last_login_at,
        last_activity_at,
        login_count,
        failed_login_attempts,
        locked_until,
        created_at,
        updated_at,
        companies (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new AdminAPIError('FETCH_USERS_ERROR', error.message, error);
    }

    return (data || []).map(user => ({
      ...user,
      company_name: user.companies?.name || undefined,
      companies: undefined // Remove nested object
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('FETCH_USERS_ERROR', 'Failed to fetch users');
  }
}

export async function updateUserStatus(userId: string, status: AdminUser['account_status']): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        account_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new AdminAPIError('UPDATE_USER_ERROR', error.message, error);
    }

    // Log the admin action
    await logAdminAction(userId, 'UPDATE', 'user_status', { new_status: status });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('UPDATE_USER_ERROR', 'Failed to update user status');
  }
}

export async function updateUserRole(userId: string, role: AdminUser['role']): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new AdminAPIError('UPDATE_USER_ERROR', error.message, error);
    }

    // Log the admin action
    await logAdminAction(userId, 'UPDATE', 'user_role', { new_role: role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('UPDATE_USER_ERROR', 'Failed to update user role');
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new AdminAPIError('DELETE_USER_ERROR', error.message, error);
    }

    // Log the admin action
    await logAdminAction(userId, 'DELETE', 'user', { deleted_user_id: userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('DELETE_USER_ERROR', 'Failed to delete user');
  }
}

// ===============================================
// SECURITY MONITORING
// ===============================================

export async function fetchSecurityEvents(limit = 20, offset = 0): Promise<AdminSecurityEvent[]> {
  try {
    const { data, error } = await supabase
      .from('security_events')
      .select(`
        id,
        user_id,
        event_type,
        severity,
        description,
        ip_address,
        user_agent,
        location,
        blocked,
        resolved,
        created_at,
        profiles!inner (
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new AdminAPIError('FETCH_SECURITY_EVENTS_ERROR', error.message, error);
    }

    return (data || []).map(event => ({
      ...event,
      user_email: event.profiles?.email || 'Unknown',
      profiles: undefined // Remove nested object
    }));
  } catch (error) {
    console.error('Error fetching security events:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('FETCH_SECURITY_EVENTS_ERROR', 'Failed to fetch security events');
  }
}

export async function fetchAuditLogs(limit = 50, offset = 0): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        severity,
        category,
        created_at,
        profiles (
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new AdminAPIError('FETCH_AUDIT_LOGS_ERROR', error.message, error);
    }

    return (data || []).map(log => ({
      ...log,
      user_email: log.profiles?.email || 'System',
      profiles: undefined // Remove nested object
    }));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('FETCH_AUDIT_LOGS_ERROR', 'Failed to fetch audit logs');
  }
}

// ===============================================
// ADMIN STATISTICS
// ===============================================

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers, error: activeError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', thirtyDaysAgo);

    if (activeError) throw activeError;

    // New users today
    const { count: newUsersToday, error: newUsersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today + 'T00:00:00.000Z');

    if (newUsersError) throw newUsersError;

    // Total companies
    const { count: totalCompanies, error: companiesError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (companiesError) throw companiesError;

    // Security events today
    const { count: securityEventsToday, error: securityError } = await supabase
      .from('security_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today + 'T00:00:00.000Z');

    if (securityError) throw securityError;

    // Determine system health based on security events
    let systemHealth: AdminStats['systemHealth'] = 'good';
    if ((securityEventsToday || 0) > 10) systemHealth = 'warning';
    if ((securityEventsToday || 0) > 50) systemHealth = 'critical';

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsersToday: newUsersToday || 0,
      totalCompanies: totalCompanies || 0,
      securityEventsToday: securityEventsToday || 0,
      systemHealth
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('FETCH_STATS_ERROR', 'Failed to fetch admin statistics');
  }
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

async function logAdminAction(
  targetUserId: string,
  action: string,
  resourceType: string,
  metadata: any = {}
): Promise<void> {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: null, // Admin actions logged separately
        action: `ADMIN_${action}`,
        resource_type: resourceType,
        resource_id: targetUserId,
        new_values: metadata,
        severity: 'high',
        category: 'admin',
        metadata: {
          admin_action: true,
          timestamp: new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw error for logging failures
  }
}

export async function searchUsers(query: string, limit = 20): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        username,
        display_name,
        first_name,
        last_name,
        avatar_url,
        role,
        account_status,
        last_login_at,
        created_at,
        companies (
          name
        )
      `)
      .or(`email.ilike.%${query}%,display_name.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw new AdminAPIError('SEARCH_USERS_ERROR', error.message, error);
    }

    return (data || []).map(user => ({
      ...user,
      company_name: user.companies?.name || undefined,
      companies: undefined
    })) as AdminUser[];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error instanceof AdminAPIError ? error : new AdminAPIError('SEARCH_USERS_ERROR', 'Failed to search users');
  }
}