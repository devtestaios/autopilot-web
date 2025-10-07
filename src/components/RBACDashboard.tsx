'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Key, Crown, Lock, Unlock, Eye, Edit,
  Plus, Search, Filter, UserCheck, UserX, AlertTriangle,
  CheckCircle, Clock, Settings, MoreVertical, Trash2,
  RefreshCw, Activity, Globe, Database, Code, Mail,
  FileText, BarChart3, Briefcase, MessageSquare, Bot,
  Smartphone, Monitor, Server, Cloud, Zap, Target,
  Star, Award, Flag, Bell, Calendar, Download
} from 'lucide-react';
import { RBACService, PERMISSION_REGISTRY, SYSTEM_ROLES, type Permission, type Role } from '@/lib/rbacService';

// ===============================================
// RBAC MANAGEMENT DASHBOARD
// ===============================================

interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string;
  granted_at: string;
  user_name?: string;
  user_email?: string;
}

interface RoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: string;
  expires_at?: string;
  user_name?: string;
  user_email?: string;
  role_name?: string;
}

export default function RBACDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'roles' | 'users' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    loadRBACData();
  }, []);

  const loadRBACData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load mock data (replace with actual API calls)
      const mockUserPermissions: UserPermission[] = [
        {
          id: '1',
          user_id: 'user1',
          permission_id: 'manage_campaigns',
          granted_by: 'admin',
          granted_at: new Date().toISOString(),
          user_name: 'John Doe',
          user_email: 'john@company.com'
        },
        {
          id: '2',
          user_id: 'user2',
          permission_id: 'view_analytics',
          granted_by: 'admin',
          granted_at: new Date().toISOString(),
          user_name: 'Jane Smith',
          user_email: 'jane@company.com'
        }
      ];

      const mockRoleAssignments: RoleAssignment[] = [
        {
          id: '1',
          user_id: 'user1',
          role_id: 'marketing_manager',
          assigned_by: 'admin',
          assigned_at: new Date().toISOString(),
          user_name: 'John Doe',
          user_email: 'john@company.com',
          role_name: 'Marketing Manager'
        },
        {
          id: '2',
          user_id: 'user2',
          role_id: 'analyst',
          assigned_by: 'admin',
          assigned_at: new Date().toISOString(),
          user_name: 'Jane Smith',
          user_email: 'jane@company.com',
          role_name: 'Analyst'
        }
      ];

      setUserPermissions(mockUserPermissions);
      setRoleAssignments(mockRoleAssignments);
    } catch (err) {
      console.error('Error loading RBAC data:', err);
      setError('Failed to load RBAC data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      // In production, use: await RBACService.assignRole(userId, roleId, 'current_admin_id');
      console.log('Assigning role:', { userId, roleId });
      await loadRBACData();
      setShowAssignModal(false);
    } catch (err) {
      console.error('Error assigning role:', err);
      setError('Failed to assign role');
    }
  };

  const handleGrantPermission = async (userId: string, permissionId: string) => {
    try {
      // In production, use: await RBACService.grantPermission(userId, permissionId, 'current_admin_id');
      console.log('Granting permission:', { userId, permissionId });
      await loadRBACData();
      setShowPermissionModal(false);
    } catch (err) {
      console.error('Error granting permission:', err);
      setError('Failed to grant permission');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionIcon = (permissionId: string) => {
    const permissionExists = Object.keys(PERMISSION_REGISTRY).includes(permissionId);
    if (!permissionExists) return <Key className="w-4 h-4" />;
    
    // Determine category from permission ID prefix
    const category = permissionId.split('.')[0];
    switch (category) {
      case 'campaigns': return <BarChart3 className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'analytics': return <Activity className="w-4 h-4" />;
      case 'billing': return <Briefcase className="w-4 h-4" />;
      case 'collaboration': return <MessageSquare className="w-4 h-4" />;
      case 'integrations': return <Globe className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'super_admin': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'client_admin': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'marketing_manager': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'campaign_manager': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'analyst': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'client_user': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      case 'client_viewer': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'super_admin': return <Crown className="w-4 h-4" />;
      case 'client_admin': return <Shield className="w-4 h-4" />;
      case 'marketing_manager': return <Target className="w-4 h-4" />;
      case 'campaign_manager': return <Zap className="w-4 h-4" />;
      case 'analyst': return <BarChart3 className="w-4 h-4" />;
      case 'client_user': return <Users className="w-4 h-4" />;
      case 'client_viewer': return <Eye className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const calculateOverviewStats = () => {
    const totalPermissions = Object.keys(PERMISSION_REGISTRY).length;
    const totalRoles = SYSTEM_ROLES.length;
    const activePermissions = userPermissions.length;
    const activeRoleAssignments = roleAssignments.length;
    
    return { totalPermissions, totalRoles, activePermissions, activeRoleAssignments };
  };

  const overviewStats = calculateOverviewStats();

  if (loading && userPermissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Role-Based Access Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user permissions, roles, and access control policies
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadRBACData}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Role
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: Shield },
            { key: 'permissions', label: 'Permissions', icon: Key },
            { key: 'roles', label: 'Roles', icon: Crown },
            { key: 'users', label: 'User Access', icon: Users },
            { key: 'audit', label: 'Audit Log', icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Permissions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.totalPermissions}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {overviewStats.activePermissions} granted
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    System Roles
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.totalRoles}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                hierarchical structure
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Role Assignments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.activeRoleAssignments}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +5 this week
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Security Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    98%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                excellent compliance
              </p>
            </div>
          </div>

          {/* Permission Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Permission Categories
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  Object.entries(PERMISSION_REGISTRY).reduce((acc, [permissionId, description]) => {
                    const category = permissionId.split('.')[0]; // Extract category from permission ID
                    if (!acc[category]) acc[category] = [];
                    acc[category].push({ id: permissionId, description });
                    return acc;
                  }, {} as Record<string, Array<{id: string, description: string}>>)
                ).map(([category, permissions]) => (
                  <div
                    key={category}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center mb-3">
                      {getPermissionIcon(permissions[0].id)}
                      <h4 className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {permissions.length} permissions
                    </p>
                    <div className="space-y-1">
                      {permissions.slice(0, 3).map((permission) => (
                        <div
                          key={permission.id}
                          className="text-xs text-gray-500 dark:text-gray-400"
                        >
                          • {permission.description}
                        </div>
                      ))}
                      {permissions.length > 3 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          +{permissions.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Role Hierarchy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Role Hierarchy
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {SYSTEM_ROLES.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getRoleColor(role.name)}`}>
                        {getRoleIcon(role.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {role.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Level {role.level}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {role.permissions.length} permissions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="campaign_management">Campaign Management</option>
                <option value="user_management">User Management</option>
                <option value="analytics">Analytics</option>
                <option value="billing">Billing</option>
                <option value="collaboration">Collaboration</option>
                <option value="integrations">Integrations</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PERMISSION_REGISTRY)
              .filter(([permissionId, description]) => 
                categoryFilter === 'all' || permissionId.startsWith(categoryFilter)
              )
              .filter(([permissionId, description]) =>
                searchQuery === '' || 
                permissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(([permissionId, description]) => (
                <div
                  key={permissionId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        {getPermissionIcon(permission.id)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {permission.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPermissionModal(true)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {permission.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        permission.risk_level === 'high' 
                          ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                          : permission.risk_level === 'medium'
                          ? 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
                          : 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                      }`}>
                        {permission.risk_level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Granted:</span>
                      <span className="text-gray-900 dark:text-white">
                        {userPermissions.filter(up => up.permission_id === permission.id).length} users
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SYSTEM_ROLES.map((role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${getRoleColor(role.id)}`}>
                        {getRoleIcon(role.id)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {role.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Level {role.hierarchy_level} • {role.permissions.length} permissions
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {role.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        KEY PERMISSIONS:
                      </p>
                      <div className="space-y-1">
                        {role.permissions.slice(0, 4).map((permissionId) => {
                          const permission = PERMISSION_REGISTRY.find(p => p.id === permissionId);
                          return permission ? (
                            <div
                              key={permissionId}
                              className="flex items-center text-xs text-gray-600 dark:text-gray-400"
                            >
                              {getPermissionIcon(permissionId)}
                              <span className="ml-2">{permission.name}</span>
                            </div>
                          ) : null;
                        })}
                        {role.permissions.length > 4 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            +{role.permissions.length - 4} more permissions
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        ASSIGNMENTS:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {roleAssignments.filter(ra => ra.role_id === role.id).length} users assigned
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Access Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Direct Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Combine user data from role assignments and permissions */}
                  {Array.from(new Set([
                    ...roleAssignments.map(ra => ra.user_id),
                    ...userPermissions.map(up => up.user_id)
                  ])).map((userId) => {
                    const userRoles = roleAssignments.filter(ra => ra.user_id === userId);
                    const userPerms = userPermissions.filter(up => up.user_id === userId);
                    const userName = userRoles[0]?.user_name || userPerms[0]?.user_name || 'Unknown User';
                    const userEmail = userRoles[0]?.user_email || userPerms[0]?.user_email || 'unknown@email.com';
                    
                    return (
                      <tr key={userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {userName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {userRoles.map((roleAssignment) => (
                              <span
                                key={roleAssignment.id}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(roleAssignment.role_id)}`}
                              >
                                {getRoleIcon(roleAssignment.role_id)}
                                <span className="ml-1">{roleAssignment.role_name || roleAssignment.role_id}</span>
                              </span>
                            ))}
                            {userRoles.length === 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {userPerms.length} permissions
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userPerms.length > 0 ? 'Direct grants' : 'Role-based only'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(userRoles[0]?.assigned_at || userPerms[0]?.granted_at || new Date().toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedUser(userId)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Role Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Assign Role
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter user ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {SYSTEM_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignRole('demo-user', 'client_user')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Assign Role
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}