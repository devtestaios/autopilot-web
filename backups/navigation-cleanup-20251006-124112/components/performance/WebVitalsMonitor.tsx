/**
 * WEB VITALS MONITOR COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Real-time Web Vitals monitoring component with visual feedback
 * and performance insights following Phase 3A optimization patterns.
 */

'use client';

import React from 'react';
import { useWebVitals } from '@/hooks/useWebVitals';

// Component props interface
interface WebVitalsMonitorProps {
  showDetails?: boolean;
  className?: string;
  onMetricUpdate?: (metric: any) => void;
  compact?: boolean;
}

// Performance rating colors for visual feedback
const RATING_COLORS = {
  good: 'text-green-600 bg-green-50 border-green-200',
  'needs-improvement': 'text-yellow-600 bg-yellow-50 border-yellow-200',
  poor: 'text-red-600 bg-red-50 border-red-200'
} as const;

const RATING_INDICATORS = {
  good: '✅',
  'needs-improvement': '⚠️',
  poor: '❌'
} as const;

/**
 * Individual metric display component
 * 
 * ✅ PERFORMANCE: Memoized to prevent unnecessary re-renders
 */
const MetricDisplay = React.memo(({ 
  name, 
  value, 
  rating, 
  threshold,
  compact = false 
}: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: string;
  compact?: boolean;
}) => {
  const colorClass = RATING_COLORS[rating];
  const indicator = RATING_INDICATORS[rating];
  
  // Format value based on metric type
  const formatValue = (metricName: string, val: number): string => {
    if (metricName === 'CLS') {
      return val.toFixed(3);
    }
    return `${Math.round(val)}ms`;
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${colorClass}`}>
        <span className="mr-1">{indicator}</span>
        <span className="font-mono">{name}: {formatValue(name, value)}</span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm flex items-center">
          <span className="mr-1">{indicator}</span>
          {name}
        </h4>
        <span className="font-mono text-sm font-bold">
          {formatValue(name, value)}
        </span>
      </div>
      <div className="text-xs opacity-75">
        {threshold}
      </div>
    </div>
  );
});

MetricDisplay.displayName = 'MetricDisplay';

/**
 * Overall performance rating component
 * 
 * ✅ PERFORMANCE: Simple display component with memoization
 */
const OverallRating = React.memo(({ 
  rating, 
  completedMetrics, 
  totalMetrics 
}: {
  rating: 'good' | 'needs-improvement' | 'poor';
  completedMetrics: number;
  totalMetrics: number;
}) => {
  const colorClass = RATING_COLORS[rating];
  const indicator = RATING_INDICATORS[rating];
  const percentage = Math.round((completedMetrics / totalMetrics) * 100);

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center">
          <span className="mr-2 text-lg">{indicator}</span>
          Overall Performance
        </h3>
        <div className="text-sm font-medium">
          {completedMetrics}/{totalMetrics} metrics
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              rating === 'good' ? 'bg-green-500' :
              rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-mono">{percentage}%</span>
      </div>
    </div>
  );
});

OverallRating.displayName = 'OverallRating';

/**
 * Main Web Vitals Monitor Component
 * 
 * ✅ PERFORMANCE: Optimized with proper hooks and memoization
 */
export default function WebVitalsMonitor({
  showDetails = true,
  className = '',
  onMetricUpdate,
  compact = false
}: WebVitalsMonitorProps) {
  // ✅ PERFORMANCE: Use optimized Web Vitals hook
  const { data, summary, isCollecting } = useWebVitals({
    autoStart: true,
    onMetric: onMetricUpdate
  });

  // Don't render on server side
  if (typeof window === 'undefined') {
    return null;
  }

  // Compact version for minimal display
  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {summary.metrics.map((metric) => (
          <MetricDisplay
            key={metric.name}
            name={metric.name}
            value={metric.value}
            rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}
            threshold={metric.threshold}
            compact
          />
        ))}
        {!isCollecting && (
          <div className="inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium text-gray-500 bg-gray-50 border-gray-200">
            <span className="mr-1">⏸️</span>
            Not collecting
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Collection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Web Vitals Monitor
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isCollecting 
            ? 'text-green-700 bg-green-100' 
            : 'text-gray-700 bg-gray-100'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isCollecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          {isCollecting ? 'Collecting' : 'Idle'}
        </div>
      </div>

      {/* Overall Performance Rating */}
      <OverallRating
        rating={summary.overallRating}
        completedMetrics={summary.completedMetrics}
        totalMetrics={summary.totalMetrics}
      />

      {/* Individual Metrics */}
      {showDetails && summary.metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.metrics.map((metric) => (
            <MetricDisplay
              key={metric.name}
              name={metric.name}
              value={metric.value}
              rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}
              threshold={metric.threshold}
            />
          ))}
        </div>
      )}

      {/* No Metrics Collected State */}
      {summary.metrics.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">
            {isCollecting 
              ? 'Collecting Web Vitals metrics...' 
              : 'Web Vitals collection not active'
            }
          </p>
          <p className="text-xs mt-1">
            Navigate the page to generate performance data
          </p>
        </div>
      )}

      {/* Debug Information (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Debug Info
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono space-y-1">
            <div>Session: {data.sessionId}</div>
            <div>Collection Start: {new Date(data.collectionStartTime).toLocaleTimeString()}</div>
            <div>Page Load Time: {data.pageLoadTime ? `${Math.round(data.pageLoadTime)}ms` : 'N/A'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Floating Web Vitals indicator for minimal monitoring
 * 
 * ✅ PERFORMANCE: Lightweight component for always-visible performance status
 */
export function FloatingWebVitalsIndicator({ className = '' }: { className?: string }) {
  const { summary, isCollecting } = useWebVitals({ autoStart: true });

  if (typeof window === 'undefined') {
    return null;
  }

  const { overallRating, completedMetrics, totalMetrics } = summary;
  const colorClass = RATING_COLORS[overallRating];
  const indicator = RATING_INDICATORS[overallRating];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`px-3 py-2 rounded-full border shadow-lg backdrop-blur-sm ${colorClass} ${
        isCollecting ? 'animate-pulse' : ''
      }`}>
        <div className="flex items-center text-sm font-medium">
          <span className="mr-1">{indicator}</span>
          <span className="font-mono">{completedMetrics}/{totalMetrics}</span>
        </div>
      </div>
    </div>
  );
}