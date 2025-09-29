/**
 * INTELLIGENT ALERTS PAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Professional Dashboard Architecture
 * 
 * Professional interface for AI-powered alert management with smart prioritization,
 * pattern recognition, and predictive alerting capabilities.
 */

import React from 'react';
import NavigationTabs from '@/components/NavigationTabs';
import IntelligentAlertSystem from '@/components/ai/IntelligentAlertSystem';
import WebVitalsMonitor from '@/components/performance/WebVitalsMonitor';

export default function IntelligentAlertsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Web Vitals Monitoring */}
      <WebVitalsMonitor />
      
      {/* Navigation */}
      <NavigationTabs />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Intelligent Alerts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered alert management with smart prioritization and predictive insights
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    🚨
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Smart Prioritization
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Powered
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Real-time
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    🧩
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Smart Clustering
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pattern-Based
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    ML-driven
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    🔮
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Predictive Alerts
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Proactive
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    Future-aware
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    💡
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    AI Insights
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Actionable
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Data-driven
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligent Alert System Component */}
        <IntelligentAlertSystem 
          enablePredictiveAlerts={true}
          enableSmartClustering={true}
          alertRefreshInterval={60000} // 1 minute
          maxDisplayedAlerts={20}
        />

        {/* Additional Information */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Advanced Alert Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Our AI system continuously monitors campaign performance, identifies patterns, 
              and provides intelligent alerts with predictive capabilities to prevent issues before they occur.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Smart Prioritization
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI analyzes severity, confidence, and business impact to prioritize alerts intelligently
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Pattern Recognition
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detect recurring issues and cluster related alerts for efficient management
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Predictive Prevention
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Forecast potential issues and receive alerts before problems impact performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}