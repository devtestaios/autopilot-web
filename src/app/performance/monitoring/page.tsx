/**
 * PERFORMANCE MONITORING PAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Comprehensive performance monitoring interface with real-time alerts,
 * system health monitoring, trend analysis, and automated performance optimization.
 */

'use client';

import React from 'react';
import NavigationTabs from '@/components/NavigationTabs';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import WebVitalsMonitor from '@/components/performance/WebVitalsMonitor';

/**
 * Performance Monitoring Dashboard
 * 
 * ✅ PERFORMANCE: Complete monitoring solution with alerts and health indicators
 */
export default function PerformanceMonitoringPage() {
  const handlePerformanceIssue = (issue: any) => {
    // Could integrate with external monitoring services
    console.log('Performance issue detected:', issue);
    
    // Example: Send to analytics
    // analytics.track('performance_issue', {
    //   metric: issue.metric,
    //   severity: issue.severity,
    //   type: issue.type
    // });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Performance Monitoring
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time performance monitoring with automated alerts and system health indicators
              </p>
            </div>
            
            {/* Live Performance Status */}
            <div className="hidden md:block">
              <WebVitalsMonitor compact />
            </div>
          </div>
        </div>

        {/* Mobile Performance Status */}
        <div className="md:hidden mb-6">
          <WebVitalsMonitor />
        </div>

        {/* Comprehensive Performance Monitor */}
        <PerformanceMonitor
          enableAutoMonitoring={true}
          monitoringInterval={30000}
          enableSystemHealth={true}
          onPerformanceIssue={handlePerformanceIssue}
        />
      </div>
    </div>
  );
}