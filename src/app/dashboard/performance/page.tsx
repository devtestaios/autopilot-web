'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useWebSocket, useRealTimePerformance, useRealTimeAlerts } from '@/contexts/WebSocketContext';
import { useCachedData, cacheKeys } from '@/contexts/CacheContext';
import OptimizedChart from '@/components/OptimizedChart';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { AsyncContent } from '@/components/ui/AsyncContent';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { fetchDashboardOverview, fetchCampaigns, fetchKPISummary } from '@/lib/api';
import AIControlChat from '@/components/AIControlChat';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Wifi,
  WifiOff,
  Zap,
  RefreshCw,
  Activity
} from 'lucide-react';

export default function PerformanceOptimizedDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { connected: wsConnected } = useWebSocket();
  const { error, handleError, clearError } = useErrorHandler();
  
  // Real-time data hooks
  const realtimePerformance = useRealTimePerformance();
  const realtimeAlerts = useRealTimeAlerts();

  // Cached data hooks with different TTL for different data types
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useCachedData(
    cacheKeys.dashboard,
    fetchDashboardOverview,
    { ttl: 5 * 60 * 1000, refetchInterval: 30000 } // 5 min cache, refetch every 30s
  );

  const { data: campaigns, loading: campaignsLoading } = useCachedData(
    cacheKeys.campaigns,
    fetchCampaigns,
    { ttl: 2 * 60 * 1000 } // 2 min cache for campaigns
  );

  const { data: kpiData, loading: kpiLoading } = useCachedData(
    cacheKeys.kpi,
    fetchKPISummary,
    { ttl: 1 * 60 * 1000, refetchInterval: 60000 } // 1 min cache, refetch every minute
  );

  // Memoized performance data for charts
  const performanceChartData = useMemo(() => {
    if (!dashboardData?.daily_performance) return [];
    
    return dashboardData.daily_performance.map((day: any) => ({
      date: day.date,
      impressions: day.impressions,
      clicks: day.clicks,
      conversions: day.conversions,
      spend: day.spend
    }));
  }, [dashboardData]);

  // Memoized metrics with real-time updates
  const metrics = useMemo(() => {
    const baseMetrics = [
      {
        title: 'Total Revenue',
        value: `$${dashboardData?.total_spend?.toLocaleString() || '0'}`,
        change: '+12.5%',
        trend: 'up' as const,
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Active Campaigns',
        value: dashboardData?.total_campaigns?.toString() || '0',
        change: '+3',
        trend: 'up' as const,
        icon: Target,
        color: 'blue'
      },
      {
        title: 'Conversion Rate',
        value: `${kpiData?.conversion_rate || '4.82'}%`,
        change: '+0.8%',
        trend: 'up' as const,
        icon: TrendingUp,
        color: 'purple'
      },
      {
        title: 'Active Leads',
        value: kpiData?.total_leads?.toString() || '0',
        change: '+23%',
        trend: 'up' as const,
        icon: Users,
        color: 'orange'
      }
    ];

    // Update with real-time data if available
    if (realtimePerformance) {
      return baseMetrics.map(metric => {
        if (metric.title === 'Conversion Rate') {
          return {
            ...metric,
            value: `${((realtimePerformance.conversions / realtimePerformance.clicks) * 100).toFixed(2)}%`
          };
        }
        return metric;
      });
    }

    return baseMetrics;
  }, [dashboardData, kpiData, realtimePerformance]);

  const loading = dashboardLoading || campaignsLoading || kpiLoading;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchDashboard(),
        // Other refetch functions could be added here
      ]);
    } catch (err) {
      handleError(err as Error);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        {/* Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Performance Dashboard
              </h1>
              <Breadcrumb 
                segments={[
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Performance', href: '/dashboard/performance' }
                ]}
              />
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center gap-4">
              {/* WebSocket Status */}
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {wsConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              
              {/* Refresh Button */}
              <PremiumButton
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRefreshAll}
                disabled={loading}
              >
                Refresh
              </PremiumButton>
            </div>
          </div>

          <AsyncContent
            loading={loading}
            error={error}
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            }
          >
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PremiumCard className="p-6 h-full">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {metric.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {metric.value}
                          </p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600 font-medium">
                              {metric.change}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              vs last month
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          metric.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                          metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          metric.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                          'bg-orange-100 dark:bg-orange-900/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            metric.color === 'green' ? 'text-green-600 dark:text-green-400' :
                            metric.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                            metric.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                            'text-orange-600 dark:text-orange-400'
                          }`} />
                        </div>
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Performance Chart */}
              <OptimizedChart
                type="line"
                data={performanceChartData}
                title="Performance Trends"
                height={400}
                xKey="date"
                yKeys={['clicks', 'conversions']}
                colors={['#3b82f6', '#10b981']}
                animated={true}
                showLegend={true}
              />

              {/* Spend Chart */}
              <OptimizedChart
                type="bar"
                data={performanceChartData}
                title="Daily Spend"
                height={400}
                xKey="date"
                yKeys={['spend']}
                colors={['#f59e0b']}
                animated={true}
              />
            </div>

            {/* Real-time Alerts */}
            {realtimeAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <PremiumCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Real-time Alerts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {realtimeAlerts.slice(0, 3).map((alert, index) => (
                      <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          {alert.message || 'Real-time performance update received'}
                        </p>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>
            )}
          </AsyncContent>
        </main>
      </div>

      {/* AI Chat Assistant */}
      <AIControlChat defaultMinimized={true} />
    </div>
  );
}