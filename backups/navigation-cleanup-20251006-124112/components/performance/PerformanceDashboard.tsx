/**
 * PERFORMANCE DASHBOARD COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Advanced performance dashboard with detailed metrics visualization,
 * comparison tools, and comprehensive performance analysis.
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePerformance, usePerformanceAnalytics } from '@/contexts/PerformanceContext';
import { optimizedAPI, checkOptimizedAPIHealth, connectionManager } from '@/lib/performance/optimizedAPI';
import { cacheUtils } from '@/lib/performance/apiCache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Database,
  Zap,
  Server,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Dashboard configuration and types
interface PerformanceDashboardProps {
  className?: string;
  showAdvanced?: boolean;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  refreshInterval?: number;
}

interface MetricComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'better' | 'worse' | 'stable';
}

// Helper function to get metric thresholds
function getMetricThresholds(metric: string) {
  const thresholds: Record<string, { good: number; poor: number }> = {
    'CLS': { good: 0.1, poor: 0.25 },
    'LCP': { good: 2500, poor: 4000 },
    'INP': { good: 200, poor: 500 },
    'FCP': { good: 1800, poor: 3000 },
    'TTFB': { good: 800, poor: 1800 }
  };
  return thresholds[metric] || { good: 100, poor: 1000 };
}

/**
 * Advanced metric comparison component
 * 
 * ✅ PERFORMANCE: Memoized component with trend analysis
 */
const MetricComparison = React.memo(({ 
  title, 
  metric, 
  unit = 'ms',
  thresholds 
}: {
  title: string;
  metric: MetricComparison;
  unit?: string;
  thresholds: { good: number; poor: number };
}) => {
  const getRating = (value: number) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  const currentRating = getRating(metric.current);
  const previousRating = getRating(metric.previous);
  
  const ratingColors = {
    good: 'text-green-600',
    'needs-improvement': 'text-yellow-600',
    poor: 'text-red-600'
  };

  const trendIcon = metric.trend === 'better' ? '📈' : 
                   metric.trend === 'worse' ? '📉' : '➡️';
  const trendColor = metric.trend === 'better' ? 'text-green-600' : 
                    metric.trend === 'worse' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className={`text-sm ${trendColor}`}>
          {trendIcon} {Math.abs(metric.changePercent).toFixed(1)}%
        </span>
      </div>

      <div className="space-y-3">
        {/* Current Value */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
            <span className={`font-mono font-bold ${ratingColors[currentRating]}`}>
              {metric.current.toFixed(unit === 'ms' ? 0 : 3)}{unit}
            </span>
          </div>
        </div>

        {/* Previous Value */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Previous</span>
            <span className={`font-mono ${ratingColors[previousRating]}`}>
              {metric.previous.toFixed(unit === 'ms' ? 0 : 3)}{unit}
            </span>
          </div>
        </div>

        {/* Change */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Change</span>
            <span className={`font-mono font-medium ${trendColor}`}>
              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(unit === 'ms' ? 0 : 3)}{unit}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mt-4">
        <div className="flex text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Good</span>
          <span className="ml-auto">Poor</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              currentRating === 'good' ? 'bg-green-500' :
              currentRating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ 
              width: `${Math.min((metric.current / (thresholds.poor * 1.5)) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
});

MetricComparison.displayName = 'MetricComparison';

/**
 * Performance timeline visualization
 * 
 * ✅ ANALYTICS: Simple timeline showing performance over time
 */
const PerformanceTimeline = React.memo(({ history, timeRange }: { 
  history: any[]; 
  timeRange: string;
}) => {
  const timelineData = useMemo(() => {
    if (!history || history.length < 2) return [];

    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const rangeMs = ranges[timeRange as keyof typeof ranges] || ranges['24h'];
    const cutoff = now - rangeMs;

    return history
      .filter(snapshot => snapshot.timestamp >= cutoff)
      .slice(0, 20) // Limit to last 20 data points
      .reverse(); // Chronological order
  }, [history, timeRange]);

  if (timelineData.length < 2) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-2">⏱️</div>
        <p className="text-gray-600 dark:text-gray-400">
          Not enough data for timeline view
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Collect more performance data to see trends
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="font-semibold text-lg mb-4">Performance Timeline ({timeRange})</h3>
      
      <div className="space-y-4">
        {timelineData.map((snapshot, index) => {
          const rating = snapshot.summary.overallRating;
          const ratingColor = rating === 'good' ? 'bg-green-500' :
                             rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500';
          
          const timestamp = new Date(snapshot.timestamp);
          const isLatest = index === timelineData.length - 1;
          
          return (
            <div key={snapshot.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 text-xs text-gray-500">
                {timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${ratingColor} ${
                  isLatest ? 'ring-2 ring-blue-300 animate-pulse' : ''
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-sm font-medium capitalize">
                      {rating.replace('-', ' ')} Performance
                    </span>
                    {isLatest && <span className="ml-2 text-xs text-blue-600">Latest</span>}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {snapshot.summary.completedMetrics}/5 metrics
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 truncate mt-1">
                  {new URL(snapshot.url).pathname}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PerformanceTimeline.displayName = 'PerformanceTimeline';

/**
 * Performance statistics summary
 * 
 * ✅ ANALYTICS: Key statistics and insights
 */
const PerformanceStats = React.memo(({ history, trends }: { 
  history: any[]; 
  trends: any; 
}) => {
  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        totalSessions: 0,
        averageRating: 'No data',
        bestPerformance: 'N/A',
        worstPerformance: 'N/A',
        improvementOpportunities: []
      };
    }

    const ratings = history.map(h => h.summary.overallRating);
    const ratingCounts = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonRating = Object.entries(ratingCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'unknown';

    // Find best and worst sessions
    const sortedByRating = [...history].sort((a, b) => {
      const ratingOrder: Record<string, number> = { good: 3, 'needs-improvement': 2, poor: 1 };
      return (ratingOrder[b.summary.overallRating] || 0) - (ratingOrder[a.summary.overallRating] || 0);
    });

    const bestSession = sortedByRating[0];
    const worstSession = sortedByRating[sortedByRating.length - 1];

    return {
      totalSessions: history.length,
      averageRating: mostCommonRating,
      bestPerformance: bestSession ? {
        rating: bestSession.summary.overallRating,
        url: new URL(bestSession.url).pathname,
        timestamp: bestSession.timestamp
      } : 'N/A',
      worstPerformance: worstSession ? {
        rating: worstSession.summary.overallRating,
        url: new URL(worstSession.url).pathname,  
        timestamp: worstSession.timestamp
      } : 'N/A',
      improvementOpportunities: trends?.alerts?.slice(0, 3) || []
    };
  }, [history, trends]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Performance Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Sessions</span>
            <span className="font-mono font-bold">{stats.totalSessions}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Most Common Rating</span>
            <span className="font-medium capitalize">
              {stats.averageRating.replace('-', ' ')}
            </span>
          </div>
          
          {typeof stats.bestPerformance === 'object' && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Best Performance
              </div>
              <div className="text-sm">
                <span className="capitalize font-medium text-green-600">
                  {stats.bestPerformance.rating.replace('-', ' ')}
                </span>
                <span className="text-gray-500 ml-2">
                  {stats.bestPerformance.url}
                </span>
              </div>
            </div>
          )}
          
          {typeof stats.worstPerformance === 'object' && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Needs Attention
              </div>
              <div className="text-sm">
                <span className="capitalize font-medium text-red-600">
                  {stats.worstPerformance.rating.replace('-', ' ')}
                </span>
                <span className="text-gray-500 ml-2">
                  {stats.worstPerformance.url}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Improvement Opportunities */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Improvement Opportunities</h3>
        
        {stats.improvementOpportunities.length > 0 ? (
          <div className="space-y-3">
            {stats.improvementOpportunities.map((opportunity: any, index: number) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-800 text-sm">
                  {opportunity.metric} Optimization
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  {opportunity.message}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-green-600">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium">All metrics performing well!</div>
            <div className="text-xs mt-1">No immediate optimizations needed</div>
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceStats.displayName = 'PerformanceStats';

/**
 * Main Performance Dashboard Component
 * 
 * ✅ PERFORMANCE: Advanced dashboard with comprehensive analytics
 */
export default function PerformanceDashboard({
  className = '',
  showAdvanced = true,
  timeRange = '24h',
  refreshInterval = 30000
}: PerformanceDashboardProps) {
  const { current } = usePerformance();
  const { history, trends, hasData } = usePerformanceAnalytics();
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Get real-time performance stats
  const cacheStats = useMemo(() => cacheUtils.getStats(), []);
  const connectionStats = useMemo(() => connectionManager.getStats(), []);

  // Refresh API health
  const refreshApiHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const health = await checkOptimizedAPIHealth();
      setApiHealth(health);
    } catch (error) {
      console.error('Failed to check API health:', error);
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  // Auto-refresh API health
  useEffect(() => {
    refreshApiHealth();
    const interval = setInterval(refreshApiHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Export performance data
  const exportPerformanceData = () => {
    const data = {
      history,
      trends,
      cacheStats,
      connectionStats,
      apiHealth,
      timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate metric comparisons
  const metricComparisons = useMemo(() => {
    if (!hasData || history.length < 2) return [];

    const latest = history[0];
    const previous = history[1];

    const metrics = ['CLS', 'LCP', 'INP', 'FCP', 'TTFB'];
    const comparisons = [];

    for (const metricName of metrics) {
      const latestMetric = (latest.webVitals as any)[metricName];
      const previousMetric = (previous.webVitals as any)[metricName];

      if (latestMetric && previousMetric) {
        const current = latestMetric.value;
        const prev = previousMetric.value;
        const change = current - prev;
        const changePercent = ((change / prev) * 100);
        
        // For performance metrics, lower is better (except for some edge cases)
        const trend: 'stable' | 'better' | 'worse' = Math.abs(changePercent) < 5 ? 'stable' :
                     changePercent < 0 ? 'better' : 'worse';

        comparisons.push({
          title: metricName,
          metric: {
            current,
            previous: prev,
            change,
            changePercent,
            trend
          },
          unit: metricName === 'CLS' ? '' : 'ms',
          thresholds: getMetricThresholds(metricName)
        });
      }
    }

    return comparisons;
  }, [hasData, history]);

  if (!hasData) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Performance Data Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start navigating the application to collect performance metrics
        </p>
        
        {/* Show basic optimization stats even without performance data */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="text-sm">API Health</span>
              </div>
              <div className="mt-2">
                {apiHealth?.status === 'healthy' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Cache</span>
              </div>
              <div className="mt-2 text-lg font-bold">
                {cacheStats.size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Connections</span>
              </div>
              <div className="mt-2 text-lg font-bold">
                {connectionStats.activeRequests}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Enhanced Header with Optimization Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time performance monitoring with optimization insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshApiHealth}
            disabled={isRefreshingHealth}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingHealth ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportPerformanceData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => cacheUtils.invalidateAll()}
          >
            <Settings className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Optimization Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-500" />
              API Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {apiHealth?.status === 'healthy' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium capitalize">
                {apiHealth?.status || 'Unknown'}
              </span>
            </div>
            {apiHealth && (
              <div className="text-sm text-gray-500 mt-1">
                {apiHealth.responseTime}ms response
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-500" />
              Cache Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cacheStats.size}
              <span className="text-sm text-gray-400">/{cacheStats.maxSize}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {cacheStats.tags} tags
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="h-4 w-4 mr-2 text-purple-500" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectionStats.activeRequests}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {connectionStats.queuedRequests} queued
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((trends?.improvements?.length || 0) / Math.max(history.length, 1)) * 100) || 'N/A'}
              <span className="text-gray-400">/100</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Based on {history.length} sessions
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Dashboard
        </h2>
        
        <div className="flex space-x-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedTimeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Comparisons */}
      {metricComparisons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Comparisons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricComparisons.map((comparison) => (
              <MetricComparison key={comparison.title} {...comparison} />
            ))}
          </div>
        </div>
      )}

      {/* Performance Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
        <PerformanceTimeline history={history} timeRange={selectedTimeRange} />
      </div>

      {/* Performance Statistics */}
      <PerformanceStats history={history} trends={trends} />
    </div>
  );
}

