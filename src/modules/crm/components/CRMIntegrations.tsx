// CRM Integrations Component  
// Advanced CRM integration management with real-time sync and field mapping

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Activity,
  Database,
  MapPin,
  Key,
  Globe,
  Zap,
  Bell,
  Download,
  Upload,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import CRMApiService from '../services/crm-api.service';
import { CRMIntegration, CRMProvider, IntegrationStatus, SyncFrequency } from '../types/crm.types';

interface CRMIntegrationsProps {
  className?: string;
}

interface IntegrationStats {
  total: number;
  connected: number;
  syncing: number;
  errors: number;
  lastSyncTime: Date;
  recordsSynced: number;
  totalRecords: number;
}

const CRMIntegrations: React.FC<CRMIntegrationsProps> = ({ className = '' }) => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [stats, setStats] = useState<IntegrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<IntegrationStatus | 'all'>('all');

  // Mock data for demonstration
  const mockIntegrations: CRMIntegration[] = [
    {
      id: '1',
      name: 'Salesforce Production',
      provider: 'salesforce',
      status: 'connected',
      lastSync: new Date('2024-01-15T10:30:00Z'),
      syncFrequency: 'hourly',
      recordCount: 1250,
      config: {
        instanceUrl: 'https://mycompany.salesforce.com',
        userId: 'admin@company.com',
        customSettings: {
          syncContacts: true,
          syncLeads: true,
          syncOpportunities: true,
          autoCreateLeads: false
        }
      },
      errors: [],
      fieldMappings: [
        { localField: 'name', remoteField: 'Name', direction: 'bidirectional', required: true },
        { localField: 'email', remoteField: 'Email', direction: 'bidirectional', required: true },
        { localField: 'company', remoteField: 'Company', direction: 'bidirectional', required: false },
        { localField: 'phone', remoteField: 'Phone', direction: 'import', required: false },
        { localField: 'stage', remoteField: 'LeadStatus', direction: 'export', required: false }
      ]
    },
    {
      id: '2',
      name: 'HubSpot Marketing',
      provider: 'hubspot',
      status: 'syncing',
      lastSync: new Date('2024-01-15T14:20:00Z'),
      syncFrequency: '15_minutes',
      recordCount: 892,
      config: {
        apiKey: '*********************abc123',
        domain: 'mycompany.hubspot.com',
        customSettings: {
          syncDeals: true,
          syncContacts: true,
          syncCompanies: true,
          enableWebhooks: true
        }
      },
      errors: [],
      fieldMappings: [
        { localField: 'name', remoteField: 'firstname', direction: 'bidirectional', required: true },
        { localField: 'email', remoteField: 'email', direction: 'bidirectional', required: true },
        { localField: 'company', remoteField: 'company', direction: 'bidirectional', required: false }
      ]
    },
    {
      id: '3',
      name: 'Pipedrive Sales',
      provider: 'pipedrive',
      status: 'error',
      lastSync: new Date('2024-01-14T09:15:00Z'),
      syncFrequency: 'daily',
      recordCount: 445,
      config: {
        apiKey: '*********************xyz789',
        domain: 'mycompany.pipedrive.com',
        customSettings: {
          syncPersons: true,
          syncDeals: true,
          syncOrganizations: false
        }
      },
      errors: [
        {
          id: 'error1',
          timestamp: new Date('2024-01-15T08:30:00Z'),
          type: 'auth_failed',
          message: 'API authentication failed. Please check your credentials.',
          details: { errorCode: 401, endpoint: '/api/v1/persons' },
          resolved: false
        }
      ],
      fieldMappings: [
        { localField: 'name', remoteField: 'name', direction: 'bidirectional', required: true },
        { localField: 'email', remoteField: 'email', direction: 'bidirectional', required: true }
      ]
    },
    {
      id: '4',
      name: 'Zoho CRM',
      provider: 'zoho',
      status: 'disconnected',
      lastSync: new Date('2024-01-10T16:45:00Z'),
      syncFrequency: 'weekly',
      recordCount: 0,
      config: {
        refreshToken: '*********************refresh123',
        domain: 'mycompany.zohocrm.com',
        customSettings: {
          syncLeads: true,
          syncContacts: false,
          syncAccounts: true
        }
      },
      errors: [],
      fieldMappings: []
    },
    {
      id: '5',
      name: 'Microsoft Dynamics',
      provider: 'microsoft_dynamics',
      status: 'pending_auth',
      lastSync: new Date('2024-01-12T11:30:00Z'),
      syncFrequency: 'real_time',
      recordCount: 156,
      config: {
        instanceUrl: 'https://mycompany.crm.dynamics.com',
        customSettings: {
          syncLeads: true,
          syncOpportunities: true,
          enableRealTimeSync: false
        }
      },
      errors: [],
      fieldMappings: []
    }
  ];

  const mockStats: IntegrationStats = {
    total: mockIntegrations.length,
    connected: mockIntegrations.filter(i => i.status === 'connected').length,
    syncing: mockIntegrations.filter(i => i.status === 'syncing').length,
    errors: mockIntegrations.filter(i => i.status === 'error').length,
    lastSyncTime: new Date('2024-01-15T14:20:00Z'),
    recordsSynced: mockIntegrations.reduce((sum, i) => sum + i.recordCount, 0),
    totalRecords: 3500
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In a real implementation, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setIntegrations(mockIntegrations);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load integration data:', error);
      // Use mock data on error
      setIntegrations(mockIntegrations);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredIntegrations = useMemo(() => {
    if (filterStatus === 'all') return integrations;
    return integrations.filter(i => i.status === filterStatus);
  }, [integrations, filterStatus]);

  const getProviderInfo = (provider: CRMProvider) => {
    const providerMap = {
      salesforce: { name: 'Salesforce', color: 'bg-blue-600', icon: '🏢' },
      hubspot: { name: 'HubSpot', color: 'bg-orange-600', icon: '🎯' },
      pipedrive: { name: 'Pipedrive', color: 'bg-green-600', icon: '📊' },
      zoho: { name: 'Zoho CRM', color: 'bg-purple-600', icon: '⚡' },
      microsoft_dynamics: { name: 'Microsoft Dynamics', color: 'bg-blue-700', icon: '🔷' },
      sugar_crm: { name: 'Sugar CRM', color: 'bg-red-600', icon: '🍯' },
      copper: { name: 'Copper', color: 'bg-orange-700', icon: '🔶' },
      insightly: { name: 'Insightly', color: 'bg-indigo-600', icon: '👁️' },
      freshworks: { name: 'Freshworks', color: 'bg-green-700', icon: '🌿' },
      monday: { name: 'Monday.com', color: 'bg-pink-600', icon: '📅' }
    };
    return providerMap[provider] || { name: provider, color: 'bg-gray-600', icon: '🔗' };
  };

  const getStatusInfo = (status: IntegrationStatus) => {
    const statusMap = {
      connected: { 
        label: 'Connected', 
        color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
        icon: CheckCircle 
      },
      connecting: { 
        label: 'Connecting', 
        color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
        icon: RefreshCw 
      },
      disconnected: { 
        label: 'Disconnected', 
        color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
        icon: XCircle 
      },
      error: { 
        label: 'Error', 
        color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
        icon: AlertTriangle 
      },
      syncing: { 
        label: 'Syncing', 
        color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
        icon: Sync 
      },
      pending_auth: { 
        label: 'Pending Auth', 
        color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
        icon: Key 
      }
    };
    return statusMap[status];
  };

  const getSyncFrequencyLabel = (frequency: SyncFrequency) => {
    const frequencyMap = {
      real_time: 'Real-time',
      '15_minutes': 'Every 15 minutes',
      hourly: 'Hourly',
      daily: 'Daily',
      weekly: 'Weekly',
      manual: 'Manual'
    };
    return frequencyMap[frequency] || frequency;
  };

  const toggleCredentialVisibility = (integrationId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const handleSync = async (integrationId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update integration status to syncing
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId
            ? { ...integration, status: 'syncing' as IntegrationStatus }
            : integration
        )
      );

      // Simulate sync completion
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.id === integrationId
              ? { 
                  ...integration, 
                  status: 'connected' as IntegrationStatus,
                  lastSync: new Date()
                }
              : integration
          )
        );
      }, 5000);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleTest = async (integrationId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Connection test successful!');
    } catch (error) {
      alert('Connection test failed!');
    }
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Link className="w-7 h-7 text-green-600" />
            CRM Integrations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage connections and sync data with external CRM systems
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Integration
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">+2 this month</span>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Connected</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.connected}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">
                {Math.round((stats.connected / stats.total) * 100)}% uptime
              </span>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Records Synced</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.recordsSynced.toLocaleString()}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Last sync: {stats.lastSyncTime.toLocaleTimeString()}
              </span>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Sync Health</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(((stats.total - stats.errors) / stats.total) * 100)}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stats.errors > 0 ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              )}
              <span className={`text-sm font-medium ${
                stats.errors > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {stats.errors} error{stats.errors !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Integrations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Integrations
            </h3>
            
            {/* Status Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                All ({integrations.length})
              </button>
              <button
                onClick={() => setFilterStatus('connected')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filterStatus === 'connected' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Connected ({stats?.connected || 0})
              </button>
              <button
                onClick={() => setFilterStatus('error')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filterStatus === 'error' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Errors ({stats?.errors || 0})
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredIntegrations.map((integration) => {
            const providerInfo = getProviderInfo(integration.provider);
            const statusInfo = getStatusInfo(integration.status);
            const StatusIcon = statusInfo.icon;
            const showCreds = showCredentials[integration.id];
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Provider Icon */}
                    <div className={`w-12 h-12 ${providerInfo.color} rounded-lg flex items-center justify-center text-white text-lg font-bold`}>
                      {providerInfo.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {integration.name}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {providerInfo.name} • {getSyncFrequencyLabel(integration.syncFrequency)} sync
                      </p>

                      {/* Integration Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                            Records
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {integration.recordCount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                            Last Sync
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {integration.lastSync.toLocaleDateString()} {integration.lastSync.toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                            Field Mappings
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {integration.fieldMappings.length} active
                          </p>
                        </div>
                      </div>

                      {/* Errors */}
                      {integration.errors.length > 0 && (
                        <div className="mb-4">
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">
                                {integration.errors.length} error{integration.errors.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {integration.errors[0].message}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Configuration */}
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Configuration Details
                        </summary>
                        <div className="mt-3 ml-6 space-y-3 text-sm">
                          {Object.entries(integration.config).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              {key.toLowerCase().includes('key') || key.toLowerCase().includes('token') ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-gray-900 dark:text-white">
                                    {showCreds ? value : '*********************'}
                                  </span>
                                  <button
                                    onClick={() => toggleCredentialVisibility(integration.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    {showCreds ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-900 dark:text-white">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {integration.status === 'connected' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSync(integration.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Sync Now"
                      >
                    <RefreshCw className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTest(integration.id)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Test Connection"
                    >
                      <PlayCircle className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      title="Edit Integration"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete Integration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CRMIntegrations;