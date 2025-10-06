'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Database,
  Zap,
  Server,
  RefreshCw,
  TrendingUp,
  Users,
  Eye,
  Clock
} from 'lucide-react';
import { optimizedAPI, checkOptimizedAPIHealth } from '@/lib/performance/optimizedAPI';
import { useAnalytics } from '@/lib/performance/analyticsManager';
import { dbQuery } from '@/lib/performance/databaseOptimizer';
import { cacheUtils } from '@/lib/performance/apiCache';
import { useSocialMedia } from '@/contexts/SocialMediaContext';

/**
 * PERFORMANCE INTEGRATION EXAMPLE
 * Following PERFORMANCE_OPTIMIZATION_MARKET_READINESS_COMPLETE_OCTOBER_2025.md
 * 
 * Comprehensive example showing integration of:
 * - Optimized API client
 * - Advanced analytics tracking
 * - Database optimization
 * - Cache management
 * - Real-time performance monitoring
 */

interface PerformanceIntegrationExampleProps {
  className?: string;
}

export default function PerformanceIntegrationExample({ className = "" }: PerformanceIntegrationExampleProps) {
  const { accounts, posts, isLoading: socialLoading, createPost } = useSocialMedia();
  const { 
    track, 
    trackFeatureUsage, 
    trackPageView, 
    trackConversion,
    getABTestVariant,
    getDashboardData 
  } = useAnalytics();
  
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Track page view when component mounts
  useEffect(() => {
    trackPageView({
      component: 'PerformanceIntegrationExample',
      feature: 'performance_optimization',
      timestamp: Date.now()
    });
  }, [trackPageView]);

  // Refresh performance data
  const refreshPerformanceData = async () => {
    setIsLoading(true);
    
    try {
      // Check API health with optimized client
      const health = await checkOptimizedAPIHealth();
      setApiHealth(health);
      
      // Get cache statistics
      const cache = cacheUtils.getStats();
      setCacheStats(cache);
      
      // Get analytics dashboard data
      const analytics = getDashboardData();
      setDashboardData(analytics);
      
      // Track the refresh action
      trackFeatureUsage('performance_dashboard', 'data_refreshed', {
        apiHealth: health.status,
        cacheSize: cache.size,
        responseTime: health.responseTime
      });
      
    } catch (error: any) {
      console.error('Failed to refresh performance data:', error);
      track('feature_use', {
        feature: 'performance_dashboard',
        action: 'refresh_failed',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize performance data
  useEffect(() => {
    refreshPerformanceData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Integration Example
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Demonstrating optimized API, analytics, and cache management
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPerformanceData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* API Health */}
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

        {/* Cache Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-500" />
              Cache Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cacheStats?.size || 0}
              <span className="text-sm text-gray-400">/{cacheStats?.maxSize || 1000}</span>
            </div>
            <Progress 
              value={cacheStats ? (cacheStats.size / cacheStats.maxSize) * 100 : 0} 
              className="mt-2 h-2" 
            />
            <div className="text-sm text-gray-500 mt-1">
              {cacheStats?.tags || 0} tags
            </div>
          </CardContent>
        </Card>

        {/* Analytics Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.activeUsers || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {dashboardData?.pageViews || 0} page views
            </div>
          </CardContent>
        </Card>

        {/* Social Media Integration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
              Social Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {accounts.length} accounts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Performance Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="font-medium">Optimized API</div>
              <div className="text-sm text-gray-500">
                Connection pooling & caching active
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="font-medium">Analytics Tracking</div>
              <div className="text-sm text-gray-500">
                User behavior & performance monitoring
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="font-medium">Database Optimization</div>
              <div className="text-sm text-gray-500">
                Query optimization & real-time subscriptions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}