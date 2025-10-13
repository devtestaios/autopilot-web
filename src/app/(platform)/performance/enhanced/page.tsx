/**
 * ENHANCED PERFORMANCE ANALYTICS PAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Comprehensive performance monitoring interface with real-time metrics,
 * advanced analytics, alerts system, and performance optimization insights.
 */

'use client';

import React from 'react';
// NavigationTabs removed - using root layout Navigation instead
import PerformanceDashboard from '@/components/performance/PerformanceDashboard';
import PerformanceAlerts from '@/components/performance/PerformanceAlerts';
import WebVitalsMonitor from '@/components/performance/WebVitalsMonitor';

/**
 * Enhanced Performance Analytics Interface
 * 
 * ✅ PERFORMANCE: Complete performance monitoring with alerts and analytics
 */
export default function EnhancedPerformanceAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Enhanced Performance Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Advanced performance monitoring with real-time alerts, trend analysis, and optimization insights
              </p>
            </div>
            
            {/* Live Performance Indicator */}
            <div className="hidden md:block">
              <WebVitalsMonitor compact showDetails />
            </div>
          </div>
        </div>

        {/* Mobile Performance Indicator */}
        <div className="md:hidden mb-6">
          <WebVitalsMonitor showDetails />
        </div>

        {/* Performance Alerts System */}
        <div className="mb-8">
          <PerformanceAlerts
            enableNotifications={true}
            maxAlerts={20}
            onAlert={(alert) => console.log('Performance alert:', alert)}
          />
        </div>

        {/* Advanced Performance Dashboard */}
        <PerformanceDashboard 
          showAdvanced={true}
          timeRange="24h"
          refreshInterval={30000}
        />
      </div>
    </div>
  );
}