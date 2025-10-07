'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, Eye, Monitor, Smartphone, 
  MapPin, Clock, CheckCircle, XCircle, RefreshCw,
  Wifi, Globe, Lock, Unlock, Ban, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { fetchSecurityEvents, fetchAuditLogs, type AdminSecurityEvent } from '@/lib/adminAPI';

// ===============================================
// SECURITY MONITORING DASHBOARD
// ===============================================

interface SecuritySession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: {
    city: string;
    country: string;
    ip: string;
  };
  isActive: boolean;
  isCurrent: boolean;
  lastActivity: Date;
  createdAt: Date;
}

interface TrustedDevice {
  id: string;
  name: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  fingerprint: string;
  lastUsed: Date;
  isActive: boolean;
  addedAt: Date;
}

export default function SecurityMonitoring() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sessions' | 'devices' | 'events' | 'settings'>('sessions');
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [securityEvents, setSecurityEvents] = useState<AdminSecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load security events
      const events = await fetchSecurityEvents(20, 0);
      setSecurityEvents(events.filter(event => event.user_id === user?.id));

      // Generate mock session data (would come from database in production)
      setSessions(generateMockSessions());
      setTrustedDevices(generateMockTrustedDevices());
    } catch (err) {
      console.error('Error loading security data:', err);
      setError('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSessions = (): SecuritySession[] => [
    {
      id: '1',
      deviceName: 'MacBook Pro',
      deviceType: 'desktop',
      browser: 'Chrome 119.0',
      location: { city: 'San Francisco', country: 'United States', ip: '192.168.1.1' },
      isActive: true,
      isCurrent: true,
      lastActivity: new Date(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      deviceName: 'iPhone 15 Pro',
      deviceType: 'mobile',
      browser: 'Safari 17.0',
      location: { city: 'San Francisco', country: 'United States', ip: '10.0.0.1' },
      isActive: false,
      isCurrent: false,
      lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];

  const generateMockTrustedDevices = (): TrustedDevice[] => [
    {
      id: '1',
      name: 'MacBook Pro (Work)',
      deviceType: 'desktop',
      fingerprint: 'fp_abc123',
      lastUsed: new Date(),
      isActive: true,
      addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      deviceType: 'mobile',
      fingerprint: 'fp_def456',
      lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isActive: true,
      addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    }
  ];

  const revokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session? The user will be logged out.')) {
      return;
    }

    try {
      // Would call API to revoke session
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Error revoking session:', err);
      setError('Failed to revoke session');
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to remove this trusted device?')) {
      return;
    }

    try {
      // Would call API to remove trusted device
      setTrustedDevices(trustedDevices.filter(d => d.id !== deviceId));
    } catch (err) {
      console.error('Error removing trusted device:', err);
      setError('Failed to remove trusted device');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Monitor className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getEventSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Security Monitoring
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your account security, active sessions, and device access.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
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
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'sessions', label: 'Active Sessions', icon: Activity },
            { key: 'devices', label: 'Trusted Devices', icon: Shield },
            { key: 'events', label: 'Security Events', icon: Eye },
            { key: 'settings', label: 'Settings', icon: Lock },
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

      {/* Content */}
      {activeTab === 'sessions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Active Sessions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                These devices are currently signed in to your account.
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {session.deviceName}
                          </p>
                          {session.isCurrent && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded">
                              Current
                            </span>
                          )}
                          {session.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.browser} • {session.location.city}, {session.location.country}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last activity: {formatDate(session.lastActivity)}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'devices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Trusted Devices
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Devices you've marked as trusted won't require MFA codes.
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trustedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {device.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Added {formatDate(device.addedAt)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last used: {formatDate(device.lastUsed)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTrustedDevice(device.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'events' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Security Events
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track authentication attempts and security-related activities.
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {securityEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No security events found</p>
                  </div>
                ) : (
                  securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventSeverityColor(event.severity)}`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description || 'Security event detected'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(new Date(event.created_at))}
                            </span>
                            {event.ip_address && (
                              <span className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                {event.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Security Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.mfa_enabled ? (
                    <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm">
                      Enabled
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                      Enable
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Login Notifications
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when someone signs in to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Session Timeout
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically log out after periods of inactivity
                  </p>
                </div>
                <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60" selected>1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}