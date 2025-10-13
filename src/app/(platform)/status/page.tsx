'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// NavigationTabs removed - using root layout Navigation instead
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  RefreshCw, 
  TrendingUp, 
  Bot, 
  Brain, 
  Zap, 
  Target,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { checkApiHealth } from '@/lib/api';

interface HealthStatus {
  health: string;
  version: string;
  database: string;
}

interface AIMetrics {
  totalProcessedCampaigns: number;
  optimizationRate: number;
  avgResponseTime: number;
  modelsActive: number;
  predictionsToday: number;
  accuracyScore: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  uptime: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Mock AI metrics data (in real app, this would come from your API)
  const [aiMetrics] = useState<AIMetrics>({
    totalProcessedCampaigns: 1247,
    optimizationRate: 94.2,
    avgResponseTime: 340,
    modelsActive: 8,
    predictionsToday: 2156,
    accuracyScore: 96.8
  });

  const [systemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45.2,
    memoryUsage: 62.8,
    networkLatency: 34,
    uptime: "7d 14h 23m"
  });

  useEffect(() => {
    async function loadStatus() {
      try {
        const healthData = await checkApiHealth();
        setStatus(healthData);
        setLastUpdated(new Date());
      } catch {
        setStatus({
          health: '❌ Connection Failed',
          version: '❌ Unreachable',
          database: '❌ Unreachable'
        });
        setLastUpdated(new Date());
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (statusText: string) => {
    if (statusText.includes('✅') || statusText.includes('healthy')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (statusText.includes('❌')) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (statusText: string) => {
    if (statusText.includes('✅') || statusText.includes('healthy')) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    } else if (statusText.includes('❌')) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    } else {
      return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI System Dashboard</h1>
                        <p className="text-black dark:text-gray-400 mt-1">
              Monitor system health, API status, and performance metrics in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            <>
              <div className={`rounded-xl shadow-sm border p-6 ${getStatusColor(status?.health || '')}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">API Health</h3>
                  {getStatusIcon(status?.health || '')}
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{status?.health}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-4 h-4 text-black" />
                  <span className="text-xs text-black dark:text-gray-400">Live monitoring</span>
                </div>
              </div>
              
              <div className={`rounded-xl shadow-sm border p-6 ${getStatusColor(status?.version || '')}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">API Version</h3>
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{status?.version}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-black" />
                  <span className="text-xs text-black dark:text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className={`rounded-xl shadow-sm border p-6 ${getStatusColor(status?.database || '')}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</h3>
                  <Database className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{status?.database}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Target className="w-4 h-4 text-black" />
                  <span className="text-xs text-black dark:text-gray-400">Connection pool: Active</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Optimization Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Performance</h2>
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Models Active</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{aiMetrics.modelsActive}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{aiMetrics.accuracyScore}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Predictions Today</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{aiMetrics.predictionsToday.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Optimization Rate</span>
                </div>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{aiMetrics.optimizationRate}%</p>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Performance</h2>
              <Cpu className="w-6 h-6 text-green-500" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</span>
                  <span className="text-sm text-black dark:text-gray-400">{systemMetrics.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemMetrics.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</span>
                  <span className="text-sm text-black dark:text-gray-400">{systemMetrics.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemMetrics.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Latency</span>
                  <span className="text-sm text-black dark:text-gray-400">{systemMetrics.networkLatency}ms</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(systemMetrics.networkLatency / 2, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Uptime</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">{systemMetrics.uptime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Processing Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processed Campaigns</h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{aiMetrics.totalProcessedCampaigns.toLocaleString()}</p>
            <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response Time</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{aiMetrics.avgResponseTime}ms</p>
            <p className="text-sm text-green-600 dark:text-green-400">-8% improvement</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Success Rate</h3>
              <PieChart className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">99.7%</p>
            <p className="text-sm text-green-600 dark:text-green-400">+0.3% this week</p>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-gray-400 mb-2">API Endpoint</h3>
                <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-black dark:text-gray-400 mb-2">Environment</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  process.env.NODE_ENV === 'production' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                }`}>
                  {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-gray-400 mb-2">Last Health Check</h3>
                <p className="text-sm text-gray-900 dark:text-white">
                  {lastUpdated.toLocaleString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-black dark:text-gray-400 mb-2">Auto Refresh</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 dark:text-white">Every 30 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">Quick Actions</h3>
          <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
            Manage your AI marketing system with these quick actions:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
            <Link
              href="/leads"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              View Campaigns
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Activity className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
