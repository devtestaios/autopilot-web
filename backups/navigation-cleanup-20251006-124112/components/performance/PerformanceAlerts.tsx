/**
 * PERFORMANCE ALERTS COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Automated performance monitoring with threshold-based alerts,
 * real-time notifications, and performance degradation detection.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformance, usePerformanceAnalytics } from '@/contexts/PerformanceContext';

// Alert types and configuration
interface PerformanceAlert {
  id: string;
  metric: string;
  type: 'threshold' | 'degradation' | 'improvement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  timestamp: number;
  value: number;
  threshold: number;
  dismissed: boolean;
}

interface AlertThreshold {
  metric: string;
  enabled: boolean;
  warning: number;
  critical: number;
  unit: string;
  description: string;
}

interface PerformanceAlertsProps {
  className?: string;
  maxAlerts?: number;
  enableNotifications?: boolean;
  onAlert?: (alert: PerformanceAlert) => void;
}

// Default alert thresholds for Web Vitals
const DEFAULT_THRESHOLDS: AlertThreshold[] = [
  {
    metric: 'CLS',
    enabled: true,
    warning: 0.1,
    critical: 0.25,
    unit: '',
    description: 'Cumulative Layout Shift - Visual stability'
  },
  {
    metric: 'LCP',
    enabled: true,
    warning: 2500,
    critical: 4000,
    unit: 'ms',
    description: 'Largest Contentful Paint - Loading performance'
  },
  {
    metric: 'INP',
    enabled: true,
    warning: 200,
    critical: 500,
    unit: 'ms',
    description: 'Interaction to Next Paint - Responsiveness'
  },
  {
    metric: 'FCP',
    enabled: true,
    warning: 1800,
    critical: 3000,
    unit: 'ms',
    description: 'First Contentful Paint - Loading start'
  },
  {
    metric: 'TTFB',
    enabled: true,
    warning: 800,
    critical: 1800,
    unit: 'ms',
    description: 'Time to First Byte - Server response'
  }
];

/**
 * Alert configuration component
 * 
 * ✅ PERFORMANCE: Memoized threshold management interface
 */
const AlertConfiguration = React.memo(({ 
  thresholds, 
  onThresholdUpdate 
}: {
  thresholds: AlertThreshold[];
  onThresholdUpdate: (thresholds: AlertThreshold[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThresholdChange = useCallback((
    metricIndex: number, 
    field: keyof AlertThreshold, 
    value: any
  ) => {
    const updated = [...thresholds];
    updated[metricIndex] = { ...updated[metricIndex], [field]: value };
    onThresholdUpdate(updated);
  }, [thresholds, onThresholdUpdate]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Alert Configuration
          </h3>
          <span className="text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {thresholds.map((threshold, index) => (
            <div key={threshold.metric} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900 dark:text-white">
                    {threshold.metric}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {threshold.description}
                  </p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={threshold.enabled}
                    onChange={(e) => handleThresholdChange(index, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Enabled</span>
                </label>
              </div>

              {threshold.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Warning Threshold
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="number"
                        value={threshold.warning}
                        onChange={(e) => handleThresholdChange(index, 'warning', Number(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        step={threshold.metric === 'CLS' ? 0.01 : 50}
                      />
                      <span className="ml-2 text-sm text-gray-500 flex items-center">
                        {threshold.unit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Critical Threshold
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="number"
                        value={threshold.critical}
                        onChange={(e) => handleThresholdChange(index, 'critical', Number(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        step={threshold.metric === 'CLS' ? 0.01 : 50}
                      />
                      <span className="ml-2 text-sm text-gray-500 flex items-center">
                        {threshold.unit}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onThresholdUpdate(DEFAULT_THRESHOLDS)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

AlertConfiguration.displayName = 'AlertConfiguration';

/**
 * Individual alert display component
 * 
 * ✅ PERFORMANCE: Optimized alert rendering with actions
 */
const AlertCard = React.memo(({ 
  alert, 
  onDismiss, 
  onView 
}: {
  alert: PerformanceAlert;
  onDismiss: (id: string) => void;
  onView: (alert: PerformanceAlert) => void;
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '📊';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
            <span className="font-medium uppercase text-xs tracking-wider">
              {alert.severity} - {alert.metric}
            </span>
            <span className="text-xs opacity-75">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <p className="font-medium mb-1">{alert.message}</p>
          
          {alert.recommendation && (
            <p className="text-sm opacity-90 mb-2">
              💡 {alert.recommendation}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-xs opacity-75">
            <span>Value: {alert.value.toFixed(alert.metric === 'CLS' ? 3 : 0)}</span>
            <span>Threshold: {alert.threshold.toFixed(alert.metric === 'CLS' ? 3 : 0)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(alert)}
            className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-all"
          >
            View
          </button>
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-all"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
});

AlertCard.displayName = 'AlertCard';

/**
 * Main Performance Alerts Component
 * 
 * ✅ PERFORMANCE: Comprehensive alert monitoring system
 */
export default function PerformanceAlerts({
  className = '',
  maxAlerts = 20,
  enableNotifications = true,
  onAlert
}: PerformanceAlertsProps) {
  const { current } = usePerformance();
  const { history } = usePerformanceAnalytics();
  
  // State management
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [thresholds, setThresholds] = useState<AlertThreshold[]>(DEFAULT_THRESHOLDS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Request notification permission
  useEffect(() => {
    if (enableNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationsEnabled(permission === 'granted');
        });
      } else {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    }
  }, [enableNotifications]);

  // Alert generation logic
  const checkForAlerts = useCallback((metrics: any) => {
    const newAlerts: PerformanceAlert[] = [];
    const timestamp = Date.now();

    thresholds.forEach(threshold => {
      if (!threshold.enabled) return;

      const metric = metrics[threshold.metric];
      if (!metric || metric.value === -1) return;

      const value = metric.value;
      let alertSeverity: 'low' | 'medium' | 'high' | 'critical' | null = null;
      let alertMessage = '';
      let recommendation = '';

      // Check critical threshold
      if (value >= threshold.critical) {
        alertSeverity = 'critical';
        alertMessage = `${threshold.metric} is critically poor (${value.toFixed(threshold.metric === 'CLS' ? 3 : 0)}${threshold.unit})`;
        recommendation = getRecommendation(threshold.metric, 'critical');
      }
      // Check warning threshold  
      else if (value >= threshold.warning) {
        alertSeverity = 'high';
        alertMessage = `${threshold.metric} needs improvement (${value.toFixed(threshold.metric === 'CLS' ? 3 : 0)}${threshold.unit})`;
        recommendation = getRecommendation(threshold.metric, 'warning');
      }

      if (alertSeverity) {
        const alertId = `${threshold.metric}-${alertSeverity}-${timestamp}`;
        
        // Check if we already have this alert recently (avoid spam)
        const recentAlert = alerts.find(alert => 
          alert.metric === threshold.metric && 
          alert.severity === alertSeverity &&
          timestamp - alert.timestamp < 60000 // 1 minute cooldown
        );

        if (!recentAlert) {
          newAlerts.push({
            id: alertId,
            metric: threshold.metric,
            type: 'threshold',
            severity: alertSeverity,
            message: alertMessage,
            recommendation,
            timestamp,
            value,
            threshold: alertSeverity === 'critical' ? threshold.critical : threshold.warning,
            dismissed: false
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const combined = [...newAlerts, ...prev].slice(0, maxAlerts);
        
        // Send notifications for critical alerts
        if (notificationsEnabled) {
          newAlerts.forEach(alert => {
            if (alert.severity === 'critical') {
              new Notification(`Performance Alert: ${alert.metric}`, {
                body: alert.message,
                icon: '/favicon.ico',
                tag: alert.id
              });
            }
          });
        }

        // Call external alert handler
        newAlerts.forEach(alert => onAlert?.(alert));

        return combined;
      });
    }
  }, [thresholds, alerts, maxAlerts, notificationsEnabled, onAlert]);

  // Monitor current performance
  useEffect(() => {
    if (current && Object.keys(current).length > 0) {
      checkForAlerts(current);
    }
  }, [current, checkForAlerts]);

  // Alert management functions
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const viewAlert = useCallback((alert: PerformanceAlert) => {
    // Could open modal or navigate to detailed view
    console.log('Viewing alert:', alert);
  }, []);

  // Filter active alerts
  const activeAlerts = useMemo(() => 
    alerts.filter(alert => !alert.dismissed).slice(0, 10)
  , [alerts]);

  const dismissedCount = alerts.filter(alert => alert.dismissed).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert Configuration */}
      <AlertConfiguration 
        thresholds={thresholds}
        onThresholdUpdate={setThresholds}
      />

      {/* Alert Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            Performance Alerts ({activeAlerts.length})
          </h3>
          
          <div className="flex items-center space-x-4">
            {notificationsEnabled && (
              <span className="text-sm text-green-600 dark:text-green-400">
                🔔 Notifications Enabled
              </span>
            )}
            
            {activeAlerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 ? (
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={dismissAlert}
                onView={viewAlert}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-600 dark:text-green-400 font-medium">
              All performance metrics within thresholds!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              No active alerts at this time
            </p>
          </div>
        )}

        {/* Dismissed Alerts Summary */}
        {dismissedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dismissedCount} alert{dismissedCount !== 1 ? 's' : ''} dismissed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get performance improvement recommendations
 */
function getRecommendation(metric: string, severity: 'warning' | 'critical'): string {
  const recommendations = {
    CLS: {
      warning: 'Optimize images with explicit dimensions, avoid inserting content above existing content',
      critical: 'Immediately review layout shifts - preload fonts, reserve space for dynamic content'
    },
    LCP: {
      warning: 'Optimize images, improve server response time, eliminate render-blocking resources',
      critical: 'Critical loading performance - optimize critical path, use CDN, reduce payload sizes'
    },
    INP: {
      warning: 'Optimize JavaScript execution, reduce main thread work, debounce user inputs',
      critical: 'Severe responsiveness issues - audit expensive JavaScript, break up long tasks'
    },
    FCP: {
      warning: 'Reduce server response time, eliminate render-blocking resources, optimize fonts',
      critical: 'Critical rendering delay - optimize critical rendering path, reduce resource sizes'
    },
    TTFB: {
      warning: 'Optimize server performance, use CDN, reduce database queries',
      critical: 'Severe server performance issues - audit backend performance, optimize database'
    }
  };

  return recommendations[metric as keyof typeof recommendations]?.[severity] || 'Review performance optimization strategies';
}