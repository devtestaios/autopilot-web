'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  Database, 
  Zap,
  TrendingUp,
  Wifi,
  WifiOff 
} from 'lucide-react';
import {
  fetchSyncMetrics,
  fetchSystemStatuses,
  formatRelativeTime,
  formatNextTime,
  type SyncMetrics,
  type SystemStatus
} from '@/lib/syncApi';

interface RealTimeSyncUpdate {
  timestamp: string;
  system: string;
  status: 'started' | 'completed' | 'failed';
  itemsProcessed?: number;
  message?: string;
}

export default function SyncStatusDashboard() {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [metrics, setMetrics] = useState<SyncMetrics | null>(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealTimeSyncUpdate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Initialize systems and metrics
  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      if (systems.length > 0) {
        const newUpdate: RealTimeSyncUpdate = {
          timestamp: new Date().toISOString(),
          system: systems[Math.floor(Math.random() * systems.length)].name,
          status: Math.random() > 0.8 ? 'failed' : 'completed',
          itemsProcessed: Math.floor(Math.random() * 50) + 10,
          message: Math.random() > 0.8 ? 'API rate limit exceeded' : undefined
        };

        setRealtimeUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(updateInterval);
  }, [systems.length]);

  const loadData = async () => {
    try {
      const [metricsData, systemsData] = await Promise.all([
        fetchSyncMetrics(),
        fetchSystemStatuses()
      ]);
      setMetrics(metricsData);
      setSystems(systemsData);
    } catch (error) {
      console.error('Failed to load sync dashboard data:', error);
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    try {
      await loadData();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Wifi className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'sync':
        return <RefreshCw className="w-4 h-4" />;
      case 'analytics':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'offline':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const successRate = metrics ? ((metrics.successful_jobs / metrics.total_jobs) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Sync Status Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={refreshStatus}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-green-600">{successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Syncs</p>
                <p className="text-2xl font-semibold text-blue-600">{metrics.total_jobs.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Sync Time</p>
                <p className="text-2xl font-semibold text-purple-600">{metrics.avg_sync_time}s</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-2xl font-semibold text-orange-600">{metrics.data_points_synced.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Systems List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          
          {systems.map((system) => (
            <div
              key={system.id}
              className={`border rounded-lg p-4 transition-colors ${getStatusColor(system.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(system.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{system.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getTypeIcon(system.type)}
                      <span className="capitalize">{system.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {system.uptime ? `${system.uptime}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Last Sync:</span>
                  <div className="font-medium">
                    {system.last_sync ? formatRelativeTime(system.last_sync) : 'Never'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Next Sync:</span>
                  <div className="font-medium">
                    {system.next_sync ? formatNextTime(system.next_sync) : 'Manual'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Response Time:</span>
                  <div className="font-medium">
                    {system.response_time ? `${system.response_time}ms` : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Errors (24h):</span>
                  <div className={`font-medium ${system.error_count && system.error_count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {system.error_count || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Updates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
          
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {realtimeUpdates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for sync activity...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {realtimeUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border"
                  >
                    <div className="mt-0.5">
                      {update.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : update.status === 'failed' ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">{update.system}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          update.status === 'completed' ? 'bg-green-100 text-green-700' :
                          update.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {update.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(update.timestamp)}
                        {update.itemsProcessed && (
                          <span className="ml-2">• {update.itemsProcessed} items</span>
                        )}
                      </div>
                      
                      {update.message && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          {update.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}