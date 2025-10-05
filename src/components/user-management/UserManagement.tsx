'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  UserCheck,
  UserX,
  AlertTriangle,
  Crown,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Activity
} from 'lucide-react';
import { useAuth, type EnhancedUser, type UserRole } from '@/contexts/EnhancedAuthContext';

interface UserManagementProps {
  className?: string;
}

interface UserStats {
  total: number;
  active: number;
  suspended: number;
  pendingVerification: number;
  newThisMonth: number;
}

const UserManagement: React.FC<UserManagementProps> = ({ className = '' }) => {
  const { user, hasPermission, canAccess, getCompanyUsers, updateUserRole, deactivateUser, inviteUser } = useAuth();
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<EnhancedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending_verification'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    suspended: 0,
    pendingVerification: 0,
    newThisMonth: 0
  });

  // Check if user can access user management
  if (!canAccess('user_management')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access user management.
          </p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      
      // In production, this would fetch from getCompanyUsers()
      const mockUsers: EnhancedUser[] = [
        {
          id: '1',
          email: 'admin@company.com',
          displayName: 'John Admin',
          firstName: 'John',
          lastName: 'Admin',
          role: 'agency_owner',
          accountStatus: 'active',
          subscriptionTier: 'enterprise',
          emailVerified: true,
          phoneVerified: true,
          mfaEnabled: true,
          permissions: { '*': ['*'] },
          securitySettings: {
            mfaEnabled: true,
            trustedDevices: [],
            loginNotifications: true,
            sessionTimeout: 480
          },
          loginCount: 156,
          lastLoginAt: '2025-10-04T10:30:00Z',
          preferences: {
            dashboard: {
              theme: 'dark',
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
              gdprConsent: true,
              ccpaOptOut: false
            }
          },
          gdprConsent: true,
          createdAt: '2025-01-15T09:00:00Z',
          updatedAt: '2025-10-04T10:30:00Z'
        },
        {
          id: '2',
          email: 'manager@company.com',
          displayName: 'Sarah Manager',
          firstName: 'Sarah',
          lastName: 'Manager',
          role: 'account_manager',
          accountStatus: 'active',
          subscriptionTier: 'professional',
          emailVerified: true,
          phoneVerified: false,
          mfaEnabled: false,
          permissions: { campaigns: ['create', 'read', 'update'], reports: ['read'] },
          securitySettings: {
            mfaEnabled: false,
            trustedDevices: [],
            loginNotifications: true,
            sessionTimeout: 480
          },
          loginCount: 89,
          lastLoginAt: '2025-10-03T16:45:00Z',
          preferences: {
            dashboard: {
              theme: 'light',
              language: 'en',
              timezone: 'America/New_York',
              dateFormat: 'MM/dd/yyyy',
              numberFormat: 'en-US',
              defaultLayout: 'default',
              sidebarCollapsed: false,
              denseMode: false,
              defaultView: 'campaigns'
            },
            notifications: {
              email: true,
              push: true,
              sms: false,
              campaignAlerts: true,
              performanceUpdates: true,
              budgetAlerts: true,
              weeklyReports: true,
              digestFrequency: 'weekly'
            },
            privacy: {
              dataSharing: false,
              analytics: true,
              marketingEmails: true,
              profileVisibility: 'private',
              gdprConsent: true,
              ccpaOptOut: false
            }
          },
          gdprConsent: true,
          createdAt: '2025-03-10T14:20:00Z',
          updatedAt: '2025-10-03T16:45:00Z'
        },
        {
          id: '3',
          email: 'creator@company.com',
          displayName: 'Mike Creator',
          firstName: 'Mike',
          lastName: 'Creator',
          role: 'content_creator',
          accountStatus: 'pending_verification',
          subscriptionTier: 'starter',
          emailVerified: false,
          phoneVerified: false,
          mfaEnabled: false,
          permissions: { content: ['create', 'read', 'update'], assets: ['create', 'read'] },
          securitySettings: {
            mfaEnabled: false,
            trustedDevices: [],
            loginNotifications: true,
            sessionTimeout: 480
          },
          loginCount: 5,
          lastLoginAt: '2025-10-02T11:20:00Z',
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
              push: false,
              sms: false,
              campaignAlerts: false,
              performanceUpdates: false,
              budgetAlerts: false,
              weeklyReports: false,
              digestFrequency: 'daily'
            },
            privacy: {
              dataSharing: false,
              analytics: true,
              marketingEmails: false,
              profileVisibility: 'private',
              gdprConsent: false,
              ccpaOptOut: false
            }
          },
          gdprConsent: false,
          createdAt: '2025-09-28T08:15:00Z',
          updatedAt: '2025-10-02T11:20:00Z'
        }
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      // Calculate stats
      const statsData: UserStats = {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.accountStatus === 'active').length,
        suspended: mockUsers.filter(u => u.accountStatus === 'suspended').length,
        pendingVerification: mockUsers.filter(u => u.accountStatus === 'pending_verification').length,
        newThisMonth: mockUsers.filter(u => {
          const createdDate = new Date(u.createdAt);
          const thisMonth = new Date();
          return createdDate.getMonth() === thisMonth.getMonth() && 
                 createdDate.getFullYear() === thisMonth.getFullYear();
        }).length
      };
      
      setStats(statsData);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.accountStatus === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'agency_owner':
        return <Shield className="w-4 h-4 text-purple-500" />;
      case 'account_manager':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'campaign_manager':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'content_creator':
        return <Edit className="w-4 h-4 text-orange-500" />;
      case 'analyst':
        return <Eye className="w-4 h-4 text-indigo-500" />;
      case 'client_viewer':
        return <UserCheck className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'suspended':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending_verification':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'deactivated':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleUserAction = async (userId: string, action: 'edit' | 'suspend' | 'activate' | 'delete') => {
    // Implementation would depend on the action
    console.log(`${action} user ${userId}`);
  };

  const handleBulkAction = async (action: 'suspend' | 'activate' | 'delete') => {
    const userIds = Array.from(selectedUsers);
    console.log(`${action} users:`, userIds);
    setSelectedUsers(new Set());
  };

  const InviteUserModal = () => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('client_viewer');
    const [inviteMessage, setInviteMessage] = useState('');

    const handleInvite = async () => {
      const result = await inviteUser(inviteEmail, inviteRole);
      if (result.success) {
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteRole('client_viewer');
        setInviteMessage('');
        // Refresh users list
      }
    };

    if (!showInviteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invite New User
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="client_viewer">Client Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="content_creator">Content Creator</option>
                <option value="campaign_manager">Campaign Manager</option>
                <option value="account_manager">Account Manager</option>
                {hasPermission('users', 'admin') && (
                  <option value="agency_owner">Agency Owner</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Welcome Message (Optional)
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Welcome to our team..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!inviteEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send Invitation
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage team members, roles, and permissions
          </p>
        </div>
        
        {hasPermission('users', 'create') && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite User
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
              <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="agency_owner">Agency Owner</option>
              <option value="account_manager">Account Manager</option>
              <option value="campaign_manager">Campaign Manager</option>
              <option value="content_creator">Content Creator</option>
              <option value="analyst">Analyst</option>
              <option value="client_viewer">Client Viewer</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending</option>
            </select>
          </div>
        </div>

        {selectedUsers.size > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedUsers.size} users selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
                      } else {
                        setSelectedUsers(new Set());
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Security
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedUsers);
                        if (e.target.checked) {
                          newSelected.add(user.id);
                        } else {
                          newSelected.delete(user.id);
                        }
                        setSelectedUsers(newSelected);
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.accountStatus)}`}>
                      {user.accountStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatLastLogin(user.lastLoginAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.emailVerified ? (
                        <span className="text-green-500" title="Email Verified">
                          <Mail className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-gray-400" title="Email Not Verified">
                          <Mail className="w-4 h-4" />
                        </span>
                      )}
                      {user.mfaEnabled ? (
                        <span className="text-green-500" title="MFA Enabled">
                          <Shield className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-gray-400" title="MFA Disabled">
                          <Shield className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setShowUserDetail(showUserDetail === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showUserDetail === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                          <div className="py-1">
                            <button
                              onClick={() => handleUserAction(user.id, 'edit')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, user.accountStatus === 'active' ? 'suspend' : 'activate')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            >
                              {user.accountStatus === 'active' ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate User
                                </>
                              )}
                            </button>
                            {hasPermission('users', 'delete') && (
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteUserModal />
    </div>
  );
};

export default UserManagement;