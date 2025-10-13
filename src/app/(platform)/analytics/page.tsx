'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Activity,
  Eye,
  Clock,
  MousePointer,
  Zap,
  Home,
  Globe,
  Mail,
  MessageSquare,
  Puzzle,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  Filter,
  Download,
  Share
} from 'lucide-react';
import { useAnalytics as useAnalyticsContext } from '@/contexts/AnalyticsContext';
import { useABTest } from '@/contexts/ABTestContext';
import { designTokens } from '@/lib/designTokens';
import { animationVariants } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';
import { trackingHelpers, realAnalytics } from '@/lib/performance/realAnalytics';
import { analyticsManager } from '@/lib/performance/analyticsManager';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
// NavigationTabs removed - using root layout Navigation instead
// ==================== TYPES ====================

interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  domain?: string;
}

interface DateRangeStats {
  period: string;
  kpis: KPI[];
}

interface DomainAnalytics {
  total_events: number;
  event_types: Record<string, number>;
  recent_activity: any[];
  performance_metrics: {
    response_time: number;
    success_rate: number;
    total_operations: number;
  };
}

// Safe analytics hook that handles missing provider
function useSafeAnalytics() {
  try {
    return useAnalyticsContext();
  } catch (error) {
    // Return mock functions if AnalyticsProvider is not available
    return {
      getSessionStats: () => ({ totalSessions: 0, averageDuration: 0, bounceRate: 0 }),
      getTotalEvents: () => 0,
      getPerformanceStats: () => ({ averageLoadTime: 0 })
    };
  }
}

// ==================== UNIFIED ANALYTICS DASHBOARD ====================

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DateRangeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [domainAnalytics, setDomainAnalytics] = useState<{
    socialMedia: DomainAnalytics | null;
    emailMarketing: DomainAnalytics | null;
    collaboration: DomainAnalytics | null;
    integrations: DomainAnalytics | null;
  }>({
    socialMedia: null,
    emailMarketing: null,
    collaboration: null,
    integrations: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  const { getSessionStats, getTotalEvents, getPerformanceStats } = useSafeAnalytics();
  const { getExperimentResults } = useABTest();

  // Check backend connectivity
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://autopilot-api-1.onrender.com/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      setBackendStatus(response.ok ? 'connected' : 'disconnected');
      return response.ok;
    } catch (error) {
      setBackendStatus('disconnected');
      return false;
    }
  };

  // Fetch comprehensive analytics from all domains
  const fetchDomainAnalytics = async () => {
    const domains = ['social-media', 'email-marketing', 'collaboration', 'integrations'] as const;
    const results: any = {};

    await Promise.all(
      domains.map(async (domain) => {
        try {
          const data = await realAnalytics.getAnalyticsOverview(domain);
          const key = domain.replace('-', '');
          results[key] = data;
        } catch (error) {
          console.warn(`Failed to fetch analytics for ${domain}:`, error);
          const key = domain.replace('-', '');
          results[key] = null;
        }
      })
    );

    setDomainAnalytics(results);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Check backend connectivity first
    const isBackendAvailable = await checkBackendStatus();
    
    try {
      // Get analytics data from our context and API
      const [apiResponse, sessionStats, eventCount, performanceStats, experimentResults] = await Promise.all([
        fetch(`/api/analytics?range=${dateRange}`).catch(() => null),
        getSessionStats(),
        getTotalEvents(),
        getPerformanceStats(),
        getExperimentResults()
      ]);

      let apiData = null;
      if (apiResponse && apiResponse.ok) {
        apiData = await apiResponse.json();
      }

      // Fetch domain-specific analytics if backend is available
      if (isBackendAvailable) {
        await fetchDomainAnalytics();
      }

      // Calculate total cross-domain metrics
      const totalDomainEvents = Object.values(domainAnalytics).reduce((total, domain) => {
        return total + (domain?.total_events || 0);
      }, 0);

      // Combine data from multiple sources with enhanced KPIs
      const combinedStats: DateRangeStats = {
        period: dateRange,
        kpis: [
          { 
            id: '1', 
            name: 'Total Sessions', 
            value: sessionStats.totalSessions || 0, 
            unit: '', 
            change: 12.5, 
            trend: 'up',
            domain: 'platform'
          },
          { 
            id: '2', 
            name: 'Total Events', 
            value: (eventCount || 0) + totalDomainEvents, 
            unit: '', 
            change: 8.3, 
            trend: 'up',
            domain: 'platform'
          },
          { 
            id: '3', 
            name: 'Avg Session Duration', 
            value: Math.round(sessionStats.averageDuration || 0), 
            unit: 's', 
            change: -2.1, 
            trend: 'down',
            domain: 'platform'
          },
          { 
            id: '4', 
            name: 'Active Experiments', 
            value: Object.keys(experimentResults).length || 0, 
            unit: '', 
            change: 25.0, 
            trend: 'up',
            domain: 'platform'
          },
          { 
            id: '5', 
            name: 'Social Media Posts', 
            value: domainAnalytics.socialMedia?.total_events || 0, 
            unit: '', 
            change: 15.2, 
            trend: 'up',
            domain: 'social-media'
          },
          { 
            id: '6', 
            name: 'Email Campaigns', 
            value: domainAnalytics.emailMarketing?.total_events || 0, 
            unit: '', 
            change: 8.7, 
            trend: 'up',
            domain: 'email'
          },
          { 
            id: '7', 
            name: 'Team Activities', 
            value: domainAnalytics.collaboration?.total_events || 0, 
            unit: '', 
            change: 22.3, 
            trend: 'up',
            domain: 'collaboration'
          },
          { 
            id: '8', 
            name: 'Page Load Time', 
            value: Math.round(performanceStats.averageLoadTime || 0), 
            unit: 'ms', 
            change: -8.7, 
            trend: 'down',
            domain: 'platform'
          }
        ]
      };

      setStats(apiData || combinedStats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Enhanced mock data fallback
      setStats({
        period: dateRange,
        kpis: [
          { id: '1', name: 'Total Sessions', value: 1250, unit: '', change: 12.5, trend: 'up', domain: 'platform' },
          { id: '2', name: 'Total Events', value: 8930, unit: '', change: 8.3, trend: 'up', domain: 'platform' },
          { id: '3', name: 'Avg Session Duration', value: 245, unit: 's', change: -2.1, trend: 'down', domain: 'platform' },
          { id: '4', name: 'Active Experiments', value: 4, unit: '', change: 25.0, trend: 'up', domain: 'platform' },
          { id: '5', name: 'Social Media Posts', value: 156, unit: '', change: 15.2, trend: 'up', domain: 'social-media' },
          { id: '6', name: 'Email Campaigns', value: 43, unit: '', change: 8.7, trend: 'up', domain: 'email' },
          { id: '7', name: 'Team Activities', value: 289, unit: '', change: 22.3, trend: 'up', domain: 'collaboration' },
          { id: '8', name: 'Page Load Time', value: 450, unit: 'ms', change: -8.7, trend: 'down', domain: 'platform' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  // Analytics hook
  const analytics = useAnalyticsContext();
  
  // Real-time tracking helper
  const trackAnalyticsView = () => {
    trackingHelpers.trackPageView('analytics-dashboard');
  };

  useEffect(() => {
    trackAnalyticsView();
  }, [dateRange, backendStatus]);

  // Get appropriate icon for each KPI
  const getIconForKPI = (name: string, domain?: string) => {
    const iconProps = "w-6 h-6 text-blue-600 dark:text-blue-400";
    
    if (domain === 'social-media') return <Globe className={iconProps} />;
    if (domain === 'email') return <Mail className={iconProps} />;
    if (domain === 'collaboration') return <MessageSquare className={iconProps} />;
    
    switch (name.toLowerCase()) {
      case 'total sessions':
      case 'sessions': return <Users className={iconProps} />;
      case 'total events': return <MousePointer className={iconProps} />;
      case 'avg session duration': return <Clock className={iconProps} />;
      case 'active experiments': return <Target className={iconProps} />;
      case 'page load time': return <Zap className={iconProps} />;
      default: return <BarChart3 className={iconProps} />;
    }
  };

  // Get domain-specific colors
  const getDomainColor = (domain?: string) => {
    switch (domain) {
      case 'social-media': return 'text-blue-600 dark:text-blue-400';
      case 'email': return 'text-green-600 dark:text-green-400';
      case 'collaboration': return 'text-purple-600 dark:text-purple-400';
      case 'platform': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation provided by root layout */}
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading unified analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="p-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                title="Back to Home"
              >
                <Home className="w-5 h-5 text-teal-600" />
              </motion.button>
              <div>
                <h1 data-testid="analytics-title" className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Cross-platform performance insights with real-time backend connectivity
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-2">
                {backendStatus === 'connected' ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : backendStatus === 'disconnected' ? (
                  <WifiOff className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-5 animate-spin">
                    <RefreshCw className="w-5 h-5 text-yellow-500" />
                  </div>
                )}
                <span className={`text-sm ${
                  backendStatus === 'connected' ? 'text-green-600 dark:text-green-400' :
                  backendStatus === 'disconnected' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  Backend {backendStatus}
                </span>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>

              {/* Date Range Selector */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <Link 
                href="/analytics/real-time"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Real-time</span>
              </Link>
            </div>
          </div>

          {/* Cross-Platform KPI Grid */}
          <div data-testid="unified-kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats?.kpis.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                data-testid={index === 0 ? "metric-card" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: parseInt(kpi.id) * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  {getIconForKPI(kpi.name, kpi.domain)}
                  <div className={`flex items-center space-x-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 
                    kpi.trend === 'down' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : kpi.trend === 'down' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : null}
                    <span className="text-sm font-medium">
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className={`text-sm font-medium ${getDomainColor(kpi.domain)}`}>
                    {kpi.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpi.value.toLocaleString()}{kpi.unit}
                  </p>
                  {kpi.domain && (
                    <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {kpi.domain}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Domain Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Social Media Analytics */}
            <motion.div
              data-testid="analytics-chart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Analytics</h3>
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Events</span>
                  <span className="font-medium">{domainAnalytics.socialMedia?.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-medium">{domainAnalytics.socialMedia?.performance_metrics.success_rate || 0}%</span>
                </div>
                <Link href="/social-media" className="text-blue-600 hover:text-blue-700 text-sm">
                  View detailed analytics →
                </Link>
              </div>
            </motion.div>

            {/* Email Marketing Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Marketing Analytics</h3>
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Events</span>
                  <span className="font-medium">{domainAnalytics.emailMarketing?.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-medium">{domainAnalytics.emailMarketing?.performance_metrics.success_rate || 0}%</span>
                </div>
                <Link href="/email-marketing" className="text-green-600 hover:text-green-700 text-sm">
                  View detailed analytics →
                </Link>
              </div>
            </motion.div>

            {/* Collaboration Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collaboration Analytics</h3>
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Events</span>
                  <span className="font-medium">{domainAnalytics.collaboration?.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-medium">{domainAnalytics.collaboration?.performance_metrics.success_rate || 0}%</span>
                </div>
                <Link href="/project-management" className="text-purple-600 hover:text-purple-700 text-sm">
                  View detailed analytics →
                </Link>
              </div>
            </motion.div>

            {/* Integration Analytics Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations Analytics</h3>
                <Puzzle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Events</span>
                  <span className="font-medium">{domainAnalytics.integrations?.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Coming Soon</span>
                  <Badge className="border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300">Phase B</Badge>
                </div>
                <span className="text-orange-600 text-sm">Enhanced in next phase →</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Analytics Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/analytics/performance"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Performance Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deep dive into performance metrics</p>
              </Link>
              
              <Link 
                href="/analytics/roi"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">ROI Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Return on investment tracking</p>
              </Link>
              
              <Link 
                href="/analytics/report-builder"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-purple-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Report Builder</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Custom analytics reports</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}