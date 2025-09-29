/**
 * PERFORMANCE MONITOR COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Comprehensive performance monitoring with real-time alerts,
 * system health indicators, and automated monitoring capabilities.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformance, usePerformanceAnalytics } from '@/contexts/PerformanceContext';
import PerformanceAlerts from './PerformanceAlerts';

// Performance monitor configuration
interface PerformanceMonitorProps {
  className?: string;
  enableAutoMonitoring?: boolean;
  monitoringInterval?: number;
  enableSystemHealth?: boolean;
  onPerformanceIssue?: (issue: PerformanceIssue) => void;
}

interface PerformanceIssue {
  type: 'degradation' | 'improvement' | 'anomaly';
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  value: number;
  baseline: number;
  recommendation: string;
}

interface SystemHealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description: string;
  lastUpdate: number;
}

/**
 * System health indicator component
 * 
 * ✅ PERFORMANCE: Real-time system health monitoring
 */
const SystemHealthIndicator = React.memo(({ 
  enableSystemHealth 
}: { 
  enableSystemHealth: boolean 
}) => {
  const [healthMetrics, setHealthMetrics] = useState<SystemHealthMetric[]>([]);

  // Collect system health metrics
  useEffect(() => {
    if (!enableSystemHealth) return;

    const collectHealthMetrics = () => {
      const metrics: SystemHealthMetric[] = [];
      const now = Date.now();

      // Memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        const usage = (usedMB / totalMB) * 100;

        metrics.push({
          name: 'Memory Usage',
          status: usage > 80 ? 'critical' : usage > 60 ? 'warning' : 'healthy',
          value: `${usedMB}MB / ${totalMB}MB (${usage.toFixed(1)}%)`,
          description: 'JavaScript heap memory usage',
          lastUpdate: now
        });
      }

      // Connection quality
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        
        metrics.push({
          name: 'Network',
          status: effectiveType === 'slow-2g' || effectiveType === '2g' ? 'warning' : 'healthy',
          value: effectiveType.toUpperCase(),
          description: 'Network connection quality',
          lastUpdate: now
        });
      }

      // Page visibility
      metrics.push({
        name: 'Page Visibility',
        status: document.hidden ? 'warning' : 'healthy',
        value: document.hidden ? 'Hidden' : 'Visible',
        description: 'Current page visibility state',
        lastUpdate: now
      });

      // Performance observer support
      const hasPerformanceObserver = 'PerformanceObserver' in window;
      metrics.push({
        name: 'Performance API',
        status: hasPerformanceObserver ? 'healthy' : 'warning',
        value: hasPerformanceObserver ? 'Supported' : 'Limited',
        description: 'Performance monitoring capability',
        lastUpdate: now
      });

      setHealthMetrics(metrics);
    };

    collectHealthMetrics();
    const interval = setInterval(collectHealthMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [enableSystemHealth]);

  if (!enableSystemHealth || healthMetrics.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '📊';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
        System Health Monitor
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthMetrics.map(metric => (
          <div key={metric.name} className={`p-3 rounded-lg border ${getStatusColor(metric.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{metric.name}</span>
              <span className="text-lg">{getStatusIcon(metric.status)}</span>
            </div>
            <div className="text-sm font-mono mb-1">{metric.value}</div>
            <div className="text-xs opacity-75">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

SystemHealthIndicator.displayName = 'SystemHealthIndicator';

/**
 * Performance trend indicator
 * 
 * ✅ ANALYTICS: Visual trend analysis with automated insights
 */
const PerformanceTrendIndicator = React.memo(({ 
  history,
  onPerformanceIssue 
}: { 
  history: any[];
  onPerformanceIssue?: (issue: PerformanceIssue) => void;
}) => {
  const trendAnalysis = useMemo(() => {
    if (!history || history.length < 3) {
      return { trends: {}, issues: [] };
    }

    const trends: Record<string, any> = {};
    const issues: PerformanceIssue[] = [];
    const metrics = ['CLS', 'LCP', 'INP', 'FCP', 'TTFB'];

    metrics.forEach(metricName => {
      const values = history
        .slice(0, 10) // Last 10 measurements
        .map(h => h.webVitals[metricName]?.value)
        .filter(v => v !== undefined && v !== -1);

      if (values.length >= 3) {
        const recent = values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
        const baseline = values.slice(3).reduce((a, b) => a + b, 0) / (values.length - 3);
        const change = ((recent - baseline) / baseline) * 100;

        trends[metricName] = {
          recent,
          baseline,
          change,
          direction: Math.abs(change) < 5 ? 'stable' : change > 0 ? 'worse' : 'better',
          samples: values.length
        };

        // Detect significant degradation
        if (change > 20) { // 20% worse
          issues.push({
            type: 'degradation',
            metric: metricName,
            severity: change > 50 ? 'critical' : change > 35 ? 'high' : 'medium',
            description: `${metricName} has degraded by ${change.toFixed(1)}% recently`,
            timestamp: Date.now(),
            value: recent,
            baseline,
            recommendation: getTrendRecommendation(metricName, 'degradation')
          });
        }
        // Detect significant improvement
        else if (change < -20) { // 20% better
          issues.push({
            type: 'improvement',
            metric: metricName,
            severity: 'low',
            description: `${metricName} has improved by ${Math.abs(change).toFixed(1)}% recently`,
            timestamp: Date.now(),
            value: recent,
            baseline,
            recommendation: getTrendRecommendation(metricName, 'improvement')
          });
        }
      }
    });

    return { trends, issues };
  }, [history]);

  // Report issues to parent component
  useEffect(() => {
    if (trendAnalysis.issues.length > 0 && onPerformanceIssue) {
      trendAnalysis.issues.forEach(issue => onPerformanceIssue(issue));
    }
  }, [trendAnalysis.issues, onPerformanceIssue]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'better': return '📈';
      case 'worse': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'better': return 'text-green-600';
      case 'worse': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (Object.keys(trendAnalysis.trends).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-600 dark:text-gray-400">
          Collecting trend data...
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Need at least 3 performance measurements
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
        Performance Trends
      </h3>
      
      <div className="space-y-3">
        {Object.entries(trendAnalysis.trends).map(([metric, trend]: [string, any]) => (
          <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium">{metric}</span>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {trend.samples} samples analyzed
              </div>
            </div>
            
            <div className="text-right">
              <div className={`flex items-center space-x-2 ${getTrendColor(trend.direction)}`}>
                <span>{getTrendIcon(trend.direction)}</span>
                <span className="font-mono font-medium">
                  {Math.abs(trend.change).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {trend.direction}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Issues */}
      {trendAnalysis.issues.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Trend Analysis ({trendAnalysis.issues.length} insights)
          </h4>
          
          <div className="space-y-2">
            {trendAnalysis.issues.slice(0, 3).map((issue, index) => (
              <div key={index} className={`p-3 rounded-lg text-sm ${
                issue.type === 'improvement' ? 'bg-green-50 text-green-800 border border-green-200' :
                issue.severity === 'critical' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}>
                <div className="font-medium">{issue.description}</div>
                <div className="text-xs mt-1 opacity-75">{issue.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceTrendIndicator.displayName = 'PerformanceTrendIndicator';

/**
 * Main Performance Monitor Component
 * 
 * ✅ PERFORMANCE: Comprehensive monitoring with alerts and health indicators
 */
export default function PerformanceMonitor({
  className = '',
  enableAutoMonitoring = true,
  monitoringInterval = 30000,
  enableSystemHealth = true,
  onPerformanceIssue
}: PerformanceMonitorProps) {
  const { current } = usePerformance();
  const { history, hasData } = usePerformanceAnalytics();
  const [isMonitoring, setIsMonitoring] = useState(enableAutoMonitoring);
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  // Auto-monitoring logic
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setLastCheck(Date.now());
      // Monitoring heartbeat - the performance system is already collecting data
      // This just updates our monitoring timestamp
    }, monitoringInterval);

    return () => clearInterval(interval);
  }, [isMonitoring, monitoringInterval]);

  const handlePerformanceIssue = useCallback((issue: PerformanceIssue) => {
    console.log('Performance issue detected:', issue);
    onPerformanceIssue?.(issue);
  }, [onPerformanceIssue]);

  const monitoringStatus = useMemo(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheck;
    
    if (!isMonitoring) {
      return { status: 'stopped', message: 'Monitoring disabled' };
    } else if (timeSinceLastCheck > monitoringInterval * 2) {
      return { status: 'warning', message: 'Monitoring may be delayed' };
    } else {
      return { status: 'active', message: 'Real-time monitoring active' };
    }
  }, [isMonitoring, lastCheck, monitoringInterval]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Monitoring Status Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance Monitor
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time performance monitoring and alerting system
            </p>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              monitoringStatus.status === 'active' ? 'bg-green-100 text-green-800' :
              monitoringStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                monitoringStatus.status === 'active' ? 'bg-green-500 animate-pulse' :
                monitoringStatus.status === 'warning' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              {monitoringStatus.message}
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`mt-2 px-3 py-1 text-xs rounded transition-colors ${
                isMonitoring 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isMonitoring ? 'Stop' : 'Start'} Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* System Health Indicator */}
      {enableSystemHealth && (
        <SystemHealthIndicator enableSystemHealth={enableSystemHealth} />
      )}

      {/* Performance Trends */}
      {hasData && (
        <PerformanceTrendIndicator 
          history={history}
          onPerformanceIssue={handlePerformanceIssue}
        />
      )}

      {/* Performance Alerts */}
      <PerformanceAlerts
        enableNotifications={isMonitoring}
        onAlert={(alert) => console.log('Alert generated:', alert)}
      />

      {/* No Data State */}
      {!hasData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-4xl mb-4">⏱️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Waiting for Performance Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Navigate through the application to start collecting performance metrics
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Get trend-based recommendations
 */
function getTrendRecommendation(metric: string, type: 'degradation' | 'improvement'): string {
  const recommendations = {
    degradation: {
      CLS: 'Review recent layout changes and ensure proper image/content sizing',
      LCP: 'Check for resource loading issues or server performance degradation',
      INP: 'Audit recent JavaScript changes for performance impact',
      FCP: 'Verify critical resource loading and server response times',
      TTFB: 'Monitor server performance and database query optimization'
    },
    improvement: {
      CLS: 'Great! Layout stability improvements detected',
      LCP: 'Excellent! Loading performance has improved',
      INP: 'Good! User interaction responsiveness has improved',
      FCP: 'Nice! Initial rendering has become faster',
      TTFB: 'Excellent! Server response times have improved'
    }
  };

  return recommendations[type][metric as keyof typeof recommendations[typeof type]] || 
         `Monitor ${metric} for continued ${type === 'degradation' ? 'issues' : 'improvements'}`;
}