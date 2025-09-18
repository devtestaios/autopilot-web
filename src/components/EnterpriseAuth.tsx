'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Key,
  Building,
  UserPlus,
  UserMinus,
  Crown,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Settings,
  Globe,
  Database,
  Activity,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Zap,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  Minus,
  ExternalLink,
  LogIn,
  LogOut,
  UserCheck,
  AlertCircle,
  Info
} from 'lucide-react';

interface EnterpriseAuthProps {
  className?: string;
}

// Mock data for enterprise authentication
const mockEnterpriseData = {
  organization: {
    id: 'org_enterprise_001',
    name: 'Marketing Dynamics Inc',
    plan: 'Enterprise',
    domain: 'marketingdynamics.com',
    userCount: 47,
    maxUsers: 100,
    createdAt: new Date('2024-01-15'),
    billingCycle: 'annual',
    features: ['SSO', 'API Access', 'White Label', 'Priority Support', 'Advanced Analytics'],
    complianceStatus: 'SOC2 Compliant'
  },
  users: [
    {
      id: 'user_001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@marketingdynamics.com',
      role: 'owner',
      department: 'Leadership',
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'active',
      permissions: ['full_access'],
      ssoEnabled: true,
      mfaEnabled: true,
      invitedBy: null,
      joinedAt: new Date('2024-01-15')
    },
    {
      id: 'user_002',
      name: 'Mike Chen',
      email: 'mike.chen@marketingdynamics.com',
      role: 'admin',
      department: 'Marketing Operations',
      lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'active',
      permissions: ['manage_campaigns', 'view_analytics', 'manage_users'],
      ssoEnabled: true,
      mfaEnabled: true,
      invitedBy: 'user_001',
      joinedAt: new Date('2024-01-20')
    },
    {
      id: 'user_003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@marketingdynamics.com',
      role: 'manager',
      department: 'Paid Media',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'active',
      permissions: ['manage_campaigns', 'view_analytics'],
      ssoEnabled: true,
      mfaEnabled: false,
      invitedBy: 'user_002',
      joinedAt: new Date('2024-02-01')
    },
    {
      id: 'user_004',
      name: 'David Kim',
      email: 'david.kim@marketingdynamics.com',
      role: 'analyst',
      department: 'Analytics',
      lastActive: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'active',
      permissions: ['view_analytics', 'export_data'],
      ssoEnabled: false,
      mfaEnabled: true,
      invitedBy: 'user_003',
      joinedAt: new Date('2024-02-15')
    },
    {
      id: 'user_005',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@contractor.com',
      role: 'viewer',
      department: 'External',
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'pending',
      permissions: ['view_campaigns'],
      ssoEnabled: false,
      mfaEnabled: false,
      invitedBy: 'user_001',
      joinedAt: null
    }
  ],
  roles: [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full administrative access and billing management',
      color: 'purple',
      userCount: 1,
      permissions: [
        'full_access',
        'billing_management',
        'organization_settings',
        'user_management',
        'api_management',
        'audit_logs'
      ]
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Manage users, campaigns, and organizational settings',
      color: 'red',
      userCount: 1,
      permissions: [
        'manage_campaigns',
        'manage_users',
        'view_analytics',
        'export_data',
        'integration_management'
      ]
    },
    {
      id: 'manager',
      name: 'Campaign Manager',
      description: 'Create and manage marketing campaigns and view analytics',
      color: 'blue',
      userCount: 1,
      permissions: [
        'manage_campaigns',
        'view_analytics',
        'export_data',
        'create_reports'
      ]
    },
    {
      id: 'analyst',
      name: 'Data Analyst',
      description: 'View analytics, create reports, and export data',
      color: 'green',
      userCount: 1,
      permissions: [
        'view_analytics',
        'export_data',
        'create_reports',
        'view_ai_insights'
      ]
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to campaigns and basic analytics',
      color: 'gray',
      userCount: 1,
      permissions: [
        'view_campaigns',
        'view_basic_analytics'
      ]
    }
  ],
  workspaces: [
    {
      id: 'ws_001',
      name: 'North America Operations',
      description: 'Campaigns and analytics for North American markets',
      userCount: 25,
      campaignCount: 45,
      budget: 125000,
      manager: 'user_002',
      createdAt: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: 'ws_002',
      name: 'European Expansion',
      description: 'New market expansion campaigns for EU region',
      userCount: 12,
      campaignCount: 23,
      budget: 75000,
      manager: 'user_003',
      createdAt: new Date('2024-02-01'),
      status: 'active'
    },
    {
      id: 'ws_003',
      name: 'Product Launch Q2',
      description: 'Dedicated workspace for Q2 product launch campaigns',
      userCount: 8,
      campaignCount: 12,
      budget: 50000,
      manager: 'user_004',
      createdAt: new Date('2024-03-01'),
      status: 'active'
    }
  ],
  auditLogs: [
    {
      id: 'audit_001',
      userId: 'user_002',
      userName: 'Mike Chen',
      action: 'user_invited',
      details: 'Invited emily.rodriguez@marketingdynamics.com as Campaign Manager',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'info'
    },
    {
      id: 'audit_002',
      userId: 'user_001',
      userName: 'Sarah Johnson',
      action: 'role_changed',
      details: 'Changed Mike Chen role from Manager to Administrator',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'warning'
    },
    {
      id: 'audit_003',
      userId: 'user_003',
      userName: 'Emily Rodriguez',
      action: 'campaign_created',
      details: 'Created campaign "Holiday Sales Push" with $25,000 budget',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info'
    },
    {
      id: 'audit_004',
      userId: 'system',
      userName: 'System',
      action: 'security_alert',
      details: 'Failed login attempt for david.kim@marketingdynamics.com',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      ipAddress: '203.0.113.1',
      userAgent: 'Unknown',
      severity: 'critical'
    }
  ],
  ssoConfig: {
    enabled: true,
    provider: 'Azure AD',
    domain: 'marketingdynamics.com',
    lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
    usersSynced: 47,
    autoProvisioning: true,
    groupMapping: true
  },
  securitySettings: {
    mfaRequired: true,
    sessionTimeout: 8, // hours
    passwordPolicy: {
      minLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxAge: 90 // days
    },
    ipWhitelisting: true,
    auditRetention: 365 // days
  }
};

export default function EnterpriseAuth({ className }: EnterpriseAuthProps) {
  const [selectedUser, setSelectedUser] = useState(mockEnterpriseData.users[0]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (roleId: string) => {
    const role = mockEnterpriseData.roles.find(r => r.id === roleId);
    switch (role?.color) {
      case 'purple':
        return 'text-purple-600 bg-purple-100';
      case 'red':
        return 'text-red-600 bg-red-100';
      case 'blue':
        return 'text-blue-600 bg-blue-100';
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'gray':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLastActiveText = (lastActive: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'Active now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    } else {
      return `${Math.floor(diffHours / 24)} days ago`;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Enterprise Authentication
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, workspaces, and security settings for your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{mockEnterpriseData.organization.userCount}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">
                    {mockEnterpriseData.organization.maxUsers - mockEnterpriseData.organization.userCount} remaining
                  </span>
                </div>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan Type</p>
                <p className="text-2xl font-bold">{mockEnterpriseData.organization.plan}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Premium Features</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SSO Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{mockEnterpriseData.ssoConfig.provider}</span>
                </div>
              </div>
              <Key className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
              <Lock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="sso">SSO Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input placeholder="Search users..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button size="sm" onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User List */}
            <div className="lg:col-span-2 space-y-3">
              {mockEnterpriseData.users.map((user) => (
                <div
                  key={user.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <Card className={`transition-all ${selectedUser.id === user.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.department}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{getLastActiveText(user.lastActive)}</span>
                      <div className="flex items-center gap-2">
                        {user.ssoEnabled && <Badge variant="outline">SSO</Badge>}
                        {user.mfaEnabled && <Badge variant="outline">MFA</Badge>}
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </div>
              ))}
            </div>            {/* User Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    User Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <div className="mt-1">
                        <Badge className={getRoleColor(selectedUser.role)}>
                          {selectedUser.role}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedUser.department}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(selectedUser.status)}>
                          {selectedUser.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Last Active</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getLastActiveText(selectedUser.lastActive)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Security</label>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SSO Enabled</span>
                          {selectedUser.ssoEnabled ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">MFA Enabled</span>
                          {selectedUser.mfaEnabled ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          }
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Permissions</label>
                      <div className="mt-1 space-y-1">
                        {selectedUser.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEnterpriseData.roles.map((role) => (
              <Card key={role.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{role.name}</h3>
                    <Badge className={`text-${role.color}-600 bg-${role.color}-100`}>
                      {role.userCount} users
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Permissions:</h4>
                    <div className="space-y-1">
                      {role.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{permission.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockEnterpriseData.workspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{workspace.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {workspace.status}
                    </Badge>
                  </div>
                  <CardDescription>{workspace.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">{workspace.userCount}</p>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{workspace.campaignCount}</p>
                      <p className="text-xs text-muted-foreground">Campaigns</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{formatCurrency(workspace.budget)}</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager:</span>
                      <span className="font-medium">
                        {mockEnterpriseData.users.find(u => u.id === workspace.manager)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{workspace.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Single Sign-On Configuration
              </CardTitle>
              <CardDescription>Configure SSO integration for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">SSO Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Connected to {mockEnterpriseData.ssoConfig.provider}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Provider</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockEnterpriseData.ssoConfig.provider}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Domain</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockEnterpriseData.ssoConfig.domain}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Sync</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockEnterpriseData.ssoConfig.lastSync.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Auto Provisioning</label>
                      <p className="text-xs text-muted-foreground">Automatically create user accounts</p>
                    </div>
                    <Switch 
                      checked={mockEnterpriseData.ssoConfig.autoProvisioning} 
                      onCheckedChange={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Group Mapping</label>
                      <p className="text-xs text-muted-foreground">Map SSO groups to roles</p>
                    </div>
                    <Switch 
                      checked={mockEnterpriseData.ssoConfig.groupMapping} 
                      onCheckedChange={() => {}}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Users Synced</label>
                    <p className="text-sm font-medium text-green-600">
                      {mockEnterpriseData.ssoConfig.usersSynced}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Metadata
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Require MFA</label>
                    <p className="text-xs text-muted-foreground">Force multi-factor authentication</p>
                  </div>
                  <Switch 
                    checked={mockEnterpriseData.securitySettings.mfaRequired} 
                    onCheckedChange={() => {}}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">IP Whitelisting</label>
                    <p className="text-xs text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch 
                    checked={mockEnterpriseData.securitySettings.ipWhitelisting} 
                    onCheckedChange={() => {}}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Session Timeout</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockEnterpriseData.securitySettings.sessionTimeout} hours
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Audit Retention</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockEnterpriseData.securitySettings.auditRetention} days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Minimum Length</span>
                  <span className="font-medium">{mockEnterpriseData.securitySettings.passwordPolicy.minLength} characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Special Characters</span>
                  {mockEnterpriseData.securitySettings.passwordPolicy.requireSpecialChars ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Numbers Required</span>
                  {mockEnterpriseData.securitySettings.passwordPolicy.requireNumbers ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uppercase Required</span>
                  {mockEnterpriseData.securitySettings.passwordPolicy.requireUppercase ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Max Age</span>
                  <span className="font-medium">{mockEnterpriseData.securitySettings.passwordPolicy.maxAge} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            {mockEnterpriseData.auditLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{log.userName}</h4>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>IP: {log.ipAddress}</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}