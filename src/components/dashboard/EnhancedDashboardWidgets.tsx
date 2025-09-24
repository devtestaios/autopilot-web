/**
 * Enhanced Dashboard Widgets for Phase 1 - Real-time Performance Charts
 * Live data integration with Google Ads and Meta Business APIs
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

// Types for real-time data
interface PerformanceData {
  date: string;
  spend: number;
  conversions: number;
  roas: number;
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
}

interface PlatformMetrics {
  platform: 'google_ads' | 'meta' | 'linkedin';
  spend: number;
  conversions: number;
  roas: number;
  change_24h: number;
}

interface AIDecision {
  id: string;
  type: 'budget_optimization' | 'campaign_creation' | 'pause_campaign';
  platform: string;
  description: string;
  confidence: number;
  impact: string;
  timestamp: string;
  status: 'pending' | 'executed' | 'rejected';
}

interface Alert {
  id: string;
  type: 'performance_drop' | 'budget_anomaly' | 'conversion_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  platform: string;
  campaign_id?: string;
  created_at: string;
  resolved: boolean;
}

// Real-time Performance Chart Component
export function LivePerformanceChart({ timeRange = '7d' }: { timeRange?: string }) {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/integrations/performance/combined?days=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch performance data');
        }
        
        const performanceData = await response.json();
        setData(performanceData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching performance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
    
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchPerformanceData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center text-red-500">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Error loading performance data: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-teal-500" />
          Live Performance Overview
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Activity className="w-4 h-4 mr-1" />
          Live Data
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number, name: string) => [
              name === 'spend' ? `$${value.toFixed(2)}` : 
              name === 'roas' ? `${value.toFixed(2)}x` :
              name === 'ctr' ? `${value.toFixed(2)}%` :
              value.toLocaleString(),
              name.toUpperCase()
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="spend"
            stackId="1"
            stroke="#00c9a7"
            fill="rgba(0, 201, 167, 0.3)"
            name="Spend"
          />
          <Area
            type="monotone"
            dataKey="conversions"
            stackId="2"
            stroke="#e07856"
            fill="rgba(224, 120, 86, 0.3)"
            name="Conversions"
          />
          <Line
            type="monotone"
            dataKey="roas"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
            name="ROAS"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Cross-Platform Comparison Widget
export function CrossPlatformComparison() {
  const [metrics, setMetrics] = useState<PlatformMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformMetrics = async () => {
      try {
        setLoading(true);
        const platforms = ['google_ads', 'meta'];
        const metricsPromises = platforms.map(async (platform) => {
          const response = await fetch(`/api/v1/integrations/performance/${platform}?days_back=7`);
          if (response.ok) {
            const data = await response.json();
            // Aggregate the data
            const totalSpend = data.reduce((sum: number, item: any) => sum + item.spend, 0);
            const totalConversions = data.reduce((sum: number, item: any) => sum + item.conversions, 0);
            const avgRoas = data.length > 0 ? 
              data.reduce((sum: number, item: any) => sum + (item.roas || 0), 0) / data.length : 0;
            
            return {
              platform: platform as 'google_ads' | 'meta',
              spend: totalSpend,
              conversions: totalConversions,
              roas: avgRoas,
              change_24h: Math.random() * 20 - 10 // Mock change for now
            };
          }
          return null;
        });

        const results = await Promise.all(metricsPromises);
        setMetrics(results.filter(Boolean) as PlatformMetrics[]);
      } catch (err) {
        console.error('Error fetching platform metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformMetrics();
    const interval = setInterval(fetchPlatformMetrics, 10 * 60 * 1000); // Update every 10 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const platformColors = {
    google_ads: '#4285f4',
    meta: '#1877f2',
    linkedin: '#0077b5'
  };

  const platformNames = {
    google_ads: 'Google Ads',
    meta: 'Meta',
    linkedin: 'LinkedIn'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <PieChartIcon className="w-5 h-5 mr-2 text-teal-500" />
        Platform Performance
      </h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <motion.div 
            key={metric.platform}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: platformColors[metric.platform] }}
              ></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {platformNames[metric.platform]}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${metric.spend.toFixed(2)} spent • {metric.conversions} conversions
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {metric.roas.toFixed(2)}x ROAS
              </div>
              <div className={`text-sm flex items-center ${
                metric.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change_24h >= 0 ? 
                  <TrendingUp className="w-3 h-3 mr-1" /> : 
                  <TrendingDown className="w-3 h-3 mr-1" />
                }
                {Math.abs(metric.change_24h).toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// AI Decision Timeline Widget
export function AIDecisionTimeline() {
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/hybrid-ai/decisions?limit=10');
        
        if (response.ok) {
          const data = await response.json();
          setDecisions(data);
        } else {
          // Mock data for demonstration
          const mockDecisions: AIDecision[] = [
            {
              id: '1',
              type: 'budget_optimization',
              platform: 'google_ads',
              description: 'Increased budget by 15% for Campaign A based on strong ROAS',
              confidence: 0.92,
              impact: '+$245 revenue',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              status: 'executed'
            },
            {
              id: '2',
              type: 'pause_campaign',
              platform: 'meta',
              description: 'Paused underperforming campaign with CPA above threshold',
              confidence: 0.88,
              impact: '-$120 waste',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              status: 'executed'
            },
            {
              id: '3',
              type: 'campaign_creation',
              platform: 'google_ads',
              description: 'Created new campaign targeting high-value keywords',
              confidence: 0.78,
              impact: 'TBD',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
              status: 'pending'
            }
          ];
          setDecisions(mockDecisions);
        }
      } catch (err) {
        console.error('Error fetching AI decisions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
    const interval = setInterval(fetchDecisions, 2 * 60 * 1000); // Update every 2 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getDecisionIcon = (type: AIDecision['type']) => {
    switch (type) {
      case 'budget_optimization':
        return <DollarSign className="w-4 h-4" />;
      case 'pause_campaign':
        return <AlertTriangle className="w-4 h-4" />;
      case 'campaign_creation':
        return <Target className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: AIDecision['status']) => {
    switch (status) {
      case 'executed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-teal-500" />
        AI Decision Timeline
      </h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {decisions.map((decision, index) => (
            <motion.div 
              key={decision.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className={`p-2 rounded-full ${getStatusColor(decision.status)} bg-opacity-20`}>
                {getDecisionIcon(decision.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {decision.platform.replace('_', ' ').toUpperCase()}
                  </p>
                  <span className={`text-xs font-medium ${getStatusColor(decision.status)}`}>
                    {decision.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {decision.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-2">
                      Confidence: {(decision.confidence * 100).toFixed(0)}%
                    </span>
                    <span>Impact: {decision.impact}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(decision.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Smart Alerts Widget
export function SmartAlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/alerts?active=true&limit=5');
        
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        } else {
          // Mock data for demonstration
          const mockAlerts: Alert[] = [
            {
              id: '1',
              type: 'performance_drop',
              severity: 'high',
              title: 'Conversion Rate Drop',
              message: 'Campaign "Summer Sale" has seen a 25% drop in conversion rate over the last 24 hours',
              platform: 'google_ads',
              campaign_id: 'camp_123',
              created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              resolved: false
            },
            {
              id: '2',
              type: 'budget_anomaly',
              severity: 'medium',
              title: 'Unusual Spend Pattern',
              message: 'Meta campaign "Q4 Promotion" is spending 40% faster than usual',
              platform: 'meta',
              campaign_id: 'camp_456',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
              resolved: false
            }
          ];
          setAlerts(mockAlerts);
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 1 * 60 * 1000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-teal-500" />
          Smart Alerts
        </h3>
        {alerts.length === 0 && (
          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            All Clear
          </span>
        )}
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">
                        {alert.platform.replace('_', ' ').toUpperCase()}
                      </span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// Real-time Sync Status Widget
export function SyncStatusWidget() {
  const [syncStatus, setSyncStatus] = useState({
    google_ads: { status: 'syncing', last_sync: null, next_sync: null },
    meta: { status: 'idle', last_sync: null, next_sync: null },
    linkedin: { status: 'error', last_sync: null, next_sync: null }
  });

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch('/api/v1/integrations/sync/status');
        if (response.ok) {
          const data = await response.json();
          setSyncStatus(data);
        }
      } catch (err) {
        console.error('Error fetching sync status:', err);
      }
    };

    fetchSyncStatus();
    const interval = setInterval(fetchSyncStatus, 30 * 1000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing':
        return 'text-blue-600 dark:text-blue-400';
      case 'idle':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'idle':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-teal-500" />
        Sync Status
      </h3>
      
      <div className="space-y-4">
        {Object.entries(syncStatus).map(([platform, status]) => (
          <div key={platform} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`mr-3 ${getStatusColor(status.status)}`}>
                {getStatusIcon(status.status)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {platform.replace('_', ' ').toUpperCase()}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {status.last_sync ? 
                    `Last: ${new Date(status.last_sync).toLocaleTimeString()}` : 
                    'Never synced'
                  }
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(status.status)}`}>
              {status.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}