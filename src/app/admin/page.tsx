'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, AlertTriangle, Settings, ChevronRight, UserPlus, UserX, Edit, Trash2, LogOut, Database, BarChart3, Bell } from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';

// Simple authentication check
const useAdminAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('admin_authenticated');
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (adminAuth === 'true' && loginTime) {
        // Check if login is within 24 hours (86400000 ms)
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_login_time');
          router.push('/adminlogin');
        }
      } else {
        router.push('/adminlogin');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    router.push('/adminlogin');
  };

  return { isAuthenticated, loading, logout };
};

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'agency_owner',
    status: 'active',
    lastLogin: '2025-10-03T10:30:00Z',
    createdAt: '2025-09-01T00:00:00Z'
  },
  {
    id: '2', 
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'campaign_manager',
    status: 'active',
    lastLogin: '2025-10-02T15:45:00Z',
    createdAt: '2025-09-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'content_creator',
    status: 'suspended',
    lastLogin: '2025-09-28T09:20:00Z',
    createdAt: '2025-08-20T00:00:00Z'
  }
];

const mockSecurityEvents = [
  {
    id: '1',
    type: 'failed_login',
    user: 'unknown@example.com',
    timestamp: '2025-10-03T14:23:00Z',
    ip: '192.168.1.100',
    severity: 'medium'
  },
  {
    id: '2',
    type: 'permission_denied',
    user: 'jane@example.com', 
    timestamp: '2025-10-03T13:15:00Z',
    ip: '10.0.0.50',
    severity: 'low'
  },
  {
    id: '3',
    type: 'suspicious_activity',
    user: 'john@example.com',
    timestamp: '2025-10-03T11:45:00Z',
    ip: '203.0.113.42',
    severity: 'high'
  }
];

const mockSystemStats = {
  totalUsers: 847,
  activeUsers: 623,
  totalCampaigns: 2341,
  activeCampaigns: 156,
  apiRequests24h: 45678,
  errorRate: 0.02,
  uptime: 99.97,
  storage: { used: 2.3, total: 10 }
};

export default function AdminPage() {
  const { isAuthenticated, loading, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                System administration and user management
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* System Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSystemStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +{mockSystemStats.activeUsers} active
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSystemStats.activeCampaigns}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                of {mockSystemStats.totalCampaigns.toLocaleString()} total
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    System Uptime
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSystemStats.uptime}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Excellent performance
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Storage Used
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSystemStats.storage.used} GB
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                of {mockSystemStats.storage.total} GB total
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Users
                  </h2>
                  <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add User
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {user.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Security Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Security Events
                  </h2>
                  <button className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                    <Bell className="w-4 h-4 mr-1" />
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockSecurityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          event.severity === 'high'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : event.severity === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            event.severity === 'high'
                              ? 'text-red-600 dark:text-red-400'
                              : event.severity === 'medium'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          User: {event.user}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(event.timestamp).toLocaleString()} • IP: {event.ip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}