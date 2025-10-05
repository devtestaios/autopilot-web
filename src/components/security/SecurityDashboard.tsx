'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Activity, 
  Users, 
  Lock,
  Unlock,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface SecurityEvent {
  id: string;
  userId?: string;
  userName?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress?: string;
  location?: string;
  userAgent?: string;
  blocked: boolean;
  resolved: boolean;
  createdAt: string;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  blockedAttempts: number;
  activeUsers: number;
  loginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  mfaEnabled: number;
  suspiciousActivity: number;
}

interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ipAddress: string;
  location?: string;
  timestamp: string;
  userAgent?: string;
  failureReason?: string;
}

const SecurityDashboard: React.FC = () => {
  const { user, canAccess } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    blockedAttempts: 0,
    activeUsers: 0,
    loginAttempts: 0,
    successfulLogins: 0,
    failedLogins: 0,
    mfaEnabled: 0,
    suspiciousActivity: 0
  });
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check if user can access security dashboard
  if (!canAccess('security_monitoring')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access security monitoring.
          </p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  useEffect(() => {
    const loadSecurityData = async () => {
      setIsLoading(true);
      
      // Mock security events
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Admin',
          eventType: 'login_success',
          severity: 'low',
          description: 'Successful login from new device',
          ipAddress: '192.168.1.100',
          location: 'New York, NY, US',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          blocked: false,
          resolved: true,
          createdAt: '2025-10-04T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Sarah Manager',
          eventType: 'login_failure',
          severity: 'medium',
          description: 'Multiple failed login attempts detected',
          ipAddress: '203.0.113.42',
          location: 'Unknown',
          userAgent: 'curl/7.68.0',
          blocked: true,
          resolved: false,
          createdAt: '2025-10-04T09:15:00Z'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Creator',
          eventType: 'suspicious_login',
          severity: 'high',
          description: 'Login from unusual location detected',
          ipAddress: '198.51.100.25',
          location: 'Unknown Location',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          blocked: true,
          resolved: false,
          createdAt: '2025-10-04T08:45:00Z'
        },
        {
          id: '4',
          eventType: 'bulk_operation',
          severity: 'critical',
          description: 'Suspicious bulk user data access attempt',
          ipAddress: '185.220.101.42',
          location: 'Tor Exit Node',
          userAgent: 'python-requests/2.28.1',
          blocked: true,
          resolved: false,
          createdAt: '2025-10-04T07:20:00Z'
        },
        {
          id: '5',
          userId: 'user1',
          userName: 'John Admin',
          eventType: 'mfa_enabled',
          severity: 'low',
          description: 'Multi-factor authentication enabled',
          ipAddress: '192.168.1.100',
          location: 'New York, NY, US',
          blocked: false,
          resolved: true,
          createdAt: '2025-10-04T06:30:00Z'
        }
      ];

      // Mock login attempts
      const mockLoginAttempts: LoginAttempt[] = [
        {
          id: '1',
          email: 'admin@company.com',
          success: true,
          ipAddress: '192.168.1.100',
          location: 'New York, NY, US',
          timestamp: '2025-10-04T10:30:00Z',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          email: 'manager@company.com',
          success: false,
          ipAddress: '203.0.113.42',
          location: 'Unknown',
          timestamp: '2025-10-04T09:15:00Z',
          userAgent: 'curl/7.68.0',
          failureReason: 'Invalid credentials'
        },
        {
          id: '3',
          email: 'test@malicious.com',
          success: false,
          ipAddress: '198.51.100.25',
          location: 'Unknown Location',
          timestamp: '2025-10-04T08:45:00Z',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          failureReason: 'Account not found'
        }
      ];

      // Mock stats
      const mockStats: SecurityStats = {
        totalEvents: mockEvents.length,
        criticalEvents: mockEvents.filter(e => e.severity === 'critical').length,
        blockedAttempts: mockEvents.filter(e => e.blocked).length,
        activeUsers: 15,
        loginAttempts: mockLoginAttempts.length,
        successfulLogins: mockLoginAttempts.filter(l => l.success).length,
        failedLogins: mockLoginAttempts.filter(l => !l.success).length,
        mfaEnabled: 8,
        suspiciousActivity: mockEvents.filter(e => e.eventType.includes('suspicious')).length
      };

      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoginAttempts(mockLoginAttempts);
      setStats(mockStats);
      setIsLoading(false);
    };

    loadSecurityData();
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ipAddress?.includes(searchTerm)
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case '1h':
          filterDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
        default:
          break;
      }
      
      if (timeFilter !== 'all') {
        filtered = filtered.filter(event => new Date(event.createdAt) >= filterDate);
      }
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, severityFilter, timeFilter]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In production, this would refetch data
      console.log('Auto-refreshing security data...');
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleResolveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
  };

  const handleExportData = () => {
    const exportData = {
      events: filteredEvents,
      loginAttempts,
      stats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor security events and user activity
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
              autoRefresh 
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
          
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalEvents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Blocked Attempts</p>
              <p className="text-2xl font-bold text-orange-600">{stats.blockedAttempts}</p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed Logins</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedLogins}</p>
            </div>
            <Unlock className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">MFA Enabled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.mfaEnabled}</p>
            </div>
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security Events
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Recent security events and alerts
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {getSeverityIcon(event.severity)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.eventType.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {event.description}
                        </div>
                        {event.ipAddress && (
                          <div className="text-xs text-gray-400 mt-1">
                            IP: {event.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {event.userName ? (
                      <div className="text-sm text-gray-900 dark:text-white">
                        {event.userName}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Anonymous
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Globe className="w-4 h-4 mr-1" />
                      {event.location || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(event.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {event.blocked && (
                        <span className="text-red-600 bg-red-100 dark:bg-red-900/20 px-2 py-1 text-xs rounded-full">
                          Blocked
                        </span>
                      )}
                      {event.resolved ? (
                        <span className="text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 text-xs rounded-full">
                          Resolved
                        </span>
                      ) : (
                        <span className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 text-xs rounded-full">
                          Open
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!event.resolved && (
                      <button
                        onClick={() => handleResolveEvent(event.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Login Attempts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Login Attempts
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Latest authentication attempts and their status
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loginAttempts.map((attempt, index) => (
                <motion.tr
                  key={attempt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {attempt.email}
                  </td>
                  <td className="px-6 py-4">
                    {attempt.success ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Success
                      </span>
                    ) : (
                      <div>
                        <span className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Failed
                        </span>
                        {attempt.failureReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {attempt.failureReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {attempt.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {attempt.location || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(attempt.timestamp)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;