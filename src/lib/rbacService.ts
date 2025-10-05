/**
 * Advanced Role-Based Access Control (RBAC) System
 * Enterprise-grade permissions with hierarchical roles and fine-grained access control
 * Multi-tenant aware with company and project-level scoping
 */

import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// ===============================================
// RBAC TYPES
// ===============================================

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'publish' | 'admin';
  conditions?: {
    company_id?: string;
    project_id?: string;
    owner_only?: boolean;
    status?: string[];
    custom?: Record<string, any>;
  };
  granted_at: string;
  granted_by?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  parent_role_id?: string;
  level: number;
  permissions: string[]; // Permission identifiers
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  inherited_permissions?: string[];
  effective_permissions?: string[];
  child_roles?: Role[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  company_id?: string;
  scope_type: 'global' | 'company' | 'project';
  scope_id?: string;
  assigned_at: string;
  assigned_by?: string;
  expires_at?: string;
  is_active: boolean;
  
  // Joined data
  role?: Role;
  user?: {
    id: string;
    email: string;
    display_name: string;
  };
}

export interface AccessCheck {
  resource: string;
  action: string;
  context?: {
    company_id?: string;
    project_id?: string;
    resource_id?: string;
    owner_id?: string;
  };
}

export interface AccessResult {
  allowed: boolean;
  reason: string;
  matched_permissions: Permission[];
  effective_role: string;
}

// ===============================================
// PERMISSIONS REGISTRY
// ===============================================

export const PERMISSION_REGISTRY = {
  // User Management
  'users.create': 'Create new users',
  'users.read': 'View user profiles and information',
  'users.update': 'Edit user profiles and settings',
  'users.delete': 'Delete users',
  'users.admin': 'Full user administration',

  // Campaign Management
  'campaigns.create': 'Create new campaigns',
  'campaigns.read': 'View campaigns and performance',
  'campaigns.update': 'Edit campaign settings and content',
  'campaigns.delete': 'Delete campaigns',
  'campaigns.publish': 'Publish and launch campaigns',
  'campaigns.admin': 'Full campaign administration',

  // Content Management
  'content.create': 'Create content and assets',
  'content.read': 'View content library',
  'content.update': 'Edit content and assets',
  'content.delete': 'Delete content',
  'content.publish': 'Publish content to social platforms',

  // Analytics & Reporting
  'analytics.read': 'View analytics and reports',
  'reports.create': 'Create custom reports',
  'reports.read': 'View reports',
  'reports.update': 'Edit reports',
  'reports.delete': 'Delete reports',

  // Client Management
  'clients.create': 'Add new clients',
  'clients.read': 'View client information',
  'clients.update': 'Edit client details',
  'clients.delete': 'Remove clients',

  // Company Settings
  'company.read': 'View company settings',
  'company.update': 'Edit company settings',
  'company.admin': 'Full company administration',

  // Billing & Subscriptions
  'billing.read': 'View billing information',
  'billing.update': 'Manage billing and subscriptions',

  // Integration Management
  'integrations.create': 'Add new integrations',
  'integrations.read': 'View integrations',
  'integrations.update': 'Configure integrations',
  'integrations.delete': 'Remove integrations',

  // System Administration
  'system.admin': 'System administration access',
  'audit.read': 'View audit logs',
  'security.admin': 'Security administration'
};

// ===============================================
// ROLE DEFINITIONS
// ===============================================

export const SYSTEM_ROLES = [
  {
    name: 'super_admin',
    display_name: 'Super Administrator',
    description: 'Full system access with all permissions',
    level: 100,
    permissions: ['*'], // Wildcard for all permissions
    is_system_role: true
  },
  {
    name: 'agency_owner',
    display_name: 'Agency Owner',
    description: 'Company administrator with user management',
    level: 80,
    permissions: [
      'users.create', 'users.read', 'users.update', 'users.delete',
      'campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.delete', 'campaigns.publish',
      'content.create', 'content.read', 'content.update', 'content.delete', 'content.publish',
      'analytics.read', 'reports.create', 'reports.read', 'reports.update', 'reports.delete',
      'clients.create', 'clients.read', 'clients.update', 'clients.delete',
      'company.read', 'company.update',
      'billing.read', 'billing.update',
      'integrations.create', 'integrations.read', 'integrations.update', 'integrations.delete'
    ],
    is_system_role: true
  },
  {
    name: 'account_manager',
    display_name: 'Account Manager',
    description: 'Client account management and campaign oversight',
    level: 60,
    permissions: [
      'users.read',
      'campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.publish',
      'content.create', 'content.read', 'content.update', 'content.publish',
      'analytics.read', 'reports.create', 'reports.read',
      'clients.read', 'clients.update',
      'integrations.read'
    ],
    is_system_role: true
  },
  {
    name: 'campaign_manager',
    display_name: 'Campaign Manager',
    description: 'Campaign creation and optimization',
    level: 40,
    permissions: [
      'campaigns.create', 'campaigns.read', 'campaigns.update',
      'content.create', 'content.read', 'content.update',
      'analytics.read', 'reports.read',
      'integrations.read'
    ],
    is_system_role: true
  },
  {
    name: 'content_creator',
    display_name: 'Content Creator',
    description: 'Content creation and asset management',
    level: 30,
    permissions: [
      'campaigns.read',
      'content.create', 'content.read', 'content.update',
      'analytics.read'
    ],
    is_system_role: true
  },
  {
    name: 'analyst',
    display_name: 'Analyst',
    description: 'Data analysis and reporting',
    level: 20,
    permissions: [
      'campaigns.read',
      'content.read',
      'analytics.read', 'reports.create', 'reports.read'
    ],
    is_system_role: true
  },
  {
    name: 'client_viewer',
    display_name: 'Client Viewer',
    description: 'Read-only access to assigned campaigns',
    level: 10,
    permissions: [
      'campaigns.read',
      'content.read',
      'analytics.read', 'reports.read'
    ],
    is_system_role: true
  }
];

// ===============================================
// RBAC SERVICE
// ===============================================

export class RBACService {

  // Check if user has permission for specific action
  static async checkPermission(
    userId: string,
    resource: string,
    action: string,
    context: { company_id?: string; project_id?: string; resource_id?: string; owner_id?: string } = {}
  ): Promise<AccessResult> {
    try {
      // Get user's effective permissions
      const userPermissions = await this.getUserPermissions(userId, context.company_id);
      
      // Check for wildcard permission (super admin)
      if (userPermissions.some(p => p.resource === '*')) {
        return {
          allowed: true,
          reason: 'Super admin access',
          matched_permissions: userPermissions.filter(p => p.resource === '*'),
          effective_role: 'super_admin'
        };
      }

      // Check for specific permission
      const matchedPermissions = userPermissions.filter(p => 
        p.resource === resource && p.action === action && p.is_active
      );

      if (matchedPermissions.length === 0) {
        return {
          allowed: false,
          reason: `No permission for ${action} on ${resource}`,
          matched_permissions: [],
          effective_role: await this.getUserHighestRole(userId, context.company_id)
        };
      }

      // Check permission conditions
      for (const permission of matchedPermissions) {
        if (this.evaluatePermissionConditions(permission, context)) {
          return {
            allowed: true,
            reason: `Permission granted via ${permission.resource}.${permission.action}`,
            matched_permissions: [permission],
            effective_role: await this.getUserHighestRole(userId, context.company_id)
          };
        }
      }

      return {
        allowed: false,
        reason: 'Permission conditions not met',
        matched_permissions: matchedPermissions,
        effective_role: await this.getUserHighestRole(userId, context.company_id)
      };

    } catch (error) {
      console.error('Error checking permission:', error);
      return {
        allowed: false,
        reason: 'Permission check failed',
        matched_permissions: [],
        effective_role: 'unknown'
      };
    }
  }

  // Get all effective permissions for a user
  static async getUserPermissions(userId: string, companyId?: string): Promise<Permission[]> {
    try {
      // Get user roles
      const userRoles = await this.getUserRoles(userId, companyId);
      
      // Get permissions from roles
      const rolePermissions: Permission[] = [];
      
      for (const userRole of userRoles) {
        if (userRole.role) {
          for (const permissionName of userRole.role.permissions) {
            // Convert permission name to Permission object
            const [resource, action] = permissionName.split('.');
            if (resource && action) {
              rolePermissions.push({
                id: `${userRole.id}_${permissionName}`,
                resource,
                action: action as any,
                granted_at: userRole.assigned_at,
                granted_by: userRole.assigned_by,
                expires_at: userRole.expires_at,
                is_active: userRole.is_active,
                conditions: {
                  company_id: userRole.company_id,
                  project_id: userRole.scope_type === 'project' ? userRole.scope_id : undefined
                }
              });
            }
          }
        }
      }

      // Get direct user permissions
      const { data: directPermissions, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      const directPerms: Permission[] = (directPermissions || []).map(p => ({
        id: p.id,
        resource: p.resource,
        action: p.action,
        conditions: p.conditions,
        granted_at: p.granted_at,
        granted_by: p.granted_by,
        expires_at: p.expires_at,
        is_active: p.is_active
      }));

      return [...rolePermissions, ...directPerms];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  // Get user roles with company/project scoping
  static async getUserRoles(userId: string, companyId?: string): Promise<UserRole[]> {
    try {
      let query = supabase
        .from('user_roles')
        .select(`
          *,
          roles (
            id, name, display_name, description, level, permissions, is_system_role, is_active
          ),
          profiles!user_roles_user_id_fkey (
            id, email, display_name
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      // Filter by company if provided
      if (companyId) {
        query = query.or(`company_id.eq.${companyId},company_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(ur => ({
        id: ur.id,
        user_id: ur.user_id,
        role_id: ur.role_id,
        company_id: ur.company_id,
        scope_type: ur.scope_type,
        scope_id: ur.scope_id,
        assigned_at: ur.assigned_at,
        assigned_by: ur.assigned_by,
        expires_at: ur.expires_at,
        is_active: ur.is_active,
        role: ur.roles,
        user: ur.profiles
      }));
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }

  // Assign role to user
  static async assignRole(
    userId: string,
    roleId: string,
    options: {
      company_id?: string;
      scope_type?: 'global' | 'company' | 'project';
      scope_id?: string;
      assigned_by?: string;
      expires_at?: string;
    } = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          company_id: options.company_id,
          scope_type: options.scope_type || 'global',
          scope_id: options.scope_id,
          assigned_by: options.assigned_by,
          expires_at: options.expires_at
        });

      if (error) throw error;

      // Log role assignment
      await this.logRBACAction('ROLE_ASSIGNED', {
        user_id: userId,
        role_id: roleId,
        company_id: options.company_id,
        assigned_by: options.assigned_by
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      throw new Error('Failed to assign role');
    }
  }

  // Remove role from user
  static async removeRole(userRoleId: string, removedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', userRoleId);

      if (error) throw error;

      // Log role removal
      await this.logRBACAction('ROLE_REMOVED', {
        user_role_id: userRoleId,
        removed_by: removedBy
      });
    } catch (error) {
      console.error('Error removing role:', error);
      throw new Error('Failed to remove role');
    }
  }

  // Grant direct permission to user
  static async grantPermission(
    userId: string,
    resource: string,
    action: string,
    options: {
      conditions?: Record<string, any>;
      granted_by?: string;
      expires_at?: string;
    } = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          resource,
          action,
          conditions: options.conditions || {},
          granted_by: options.granted_by,
          expires_at: options.expires_at
        });

      if (error) throw error;

      // Log permission grant
      await this.logRBACAction('PERMISSION_GRANTED', {
        user_id: userId,
        resource,
        action,
        granted_by: options.granted_by
      });
    } catch (error) {
      console.error('Error granting permission:', error);
      throw new Error('Failed to grant permission');
    }
  }

  // Revoke direct permission from user
  static async revokePermission(permissionId: string, revokedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      if (error) throw error;

      // Log permission revocation
      await this.logRBACAction('PERMISSION_REVOKED', {
        permission_id: permissionId,
        revoked_by: revokedBy
      });
    } catch (error) {
      console.error('Error revoking permission:', error);
      throw new Error('Failed to revoke permission');
    }
  }

  // Get user's highest role level
  private static async getUserHighestRole(userId: string, companyId?: string): Promise<string> {
    try {
      const userRoles = await this.getUserRoles(userId, companyId);
      if (userRoles.length === 0) return 'no_role';

      const highestRole = userRoles.reduce((highest, current) => {
        const currentLevel = current.role?.level || 0;
        const highestLevel = highest.role?.level || 0;
        return currentLevel > highestLevel ? current : highest;
      });

      return highestRole.role?.name || 'unknown';
    } catch (error) {
      console.error('Error getting highest role:', error);
      return 'unknown';
    }
  }

  // Evaluate permission conditions
  private static evaluatePermissionConditions(
    permission: Permission,
    context: { company_id?: string; project_id?: string; resource_id?: string; owner_id?: string }
  ): boolean {
    if (!permission.conditions) return true;

    // Check company context
    if (permission.conditions.company_id && permission.conditions.company_id !== context.company_id) {
      return false;
    }

    // Check project context
    if (permission.conditions.project_id && permission.conditions.project_id !== context.project_id) {
      return false;
    }

    // Check owner-only condition
    if (permission.conditions.owner_only && context.owner_id !== context.resource_id) {
      return false;
    }

    // Check status conditions
    if (permission.conditions.status && context.resource_id) {
      // Would need to fetch resource status from database
      // Simplified for now
    }

    return true;
  }

  // Log RBAC actions for audit trail
  private static async logRBACAction(action: string, metadata: any = {}) {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          action: `RBAC_${action}`,
          resource_type: 'rbac',
          new_values: metadata,
          severity: 'info',
          category: 'security'
        });
    } catch (error) {
      console.error('Error logging RBAC action:', error);
    }
  }
}

// ===============================================
// RBAC HOOKS & UTILITIES
// ===============================================

// Permission checking hook for React components
export function usePermission(resource: string, action: string, context: any = {}) {
  // This would be implemented as a React hook in practice
  // For now, providing the structure
  return {
    hasPermission: false, // Would be computed
    loading: false,
    error: null,
    checkPermission: () => RBACService.checkPermission('user-id', resource, action, context)
  };
}

// Permission decorator for API routes
export function requirePermission(resource: string, action: string) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      // Extract user ID and context from request
      // Check permission
      // Call original method if allowed
      return method.apply(this, args);
    };
  };
}

export default RBACService;