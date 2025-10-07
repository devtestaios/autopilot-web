/**
 * PREDICTIVE ANALYTICS PAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Professional Dashboard Architecture
 * 
 * Professional interface for ML-powered campaign forecasting, budget optimization,
 * and A/B test predictions with comprehensive predictive capabilities.
 */

import React from 'react';
import NavigationTabs from '@/components/NavigationTabs';
import PredictiveCampaignAnalytics from '@/components/ai/PredictiveCampaignAnalytics';
import WebVitalsMonitor from '@/components/performance/WebVitalsMonitor';

export default function PredictiveAnalyticsPage() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Predictive Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                ML-powered campaign forecasting and optimization recommendations
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    🎯
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Campaign Forecasts
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Real-time ML
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    💰
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Budget Optimization
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Smart
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    AI-powered
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    🧪
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    A/B Test Predictions
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Predictive
                  </div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400">
                    ML-driven
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Analytics Component */}
        <PredictiveCampaignAnalytics 
          enableRealTimeForecasting={true}
          forecastingInterval={300000} // 5 minutes
        />

        {/* Additional Information */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Advanced Predictive Capabilities
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Our ML engine analyzes historical performance, seasonal trends, competitive landscape, 
              and market conditions to provide accurate forecasts and actionable optimization recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Performance Forecasting
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Predict impressions, clicks, conversions, and revenue with confidence intervals
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Smart Budget Allocation
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered budget recommendations based on ROAS and growth potential
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Test Outcome Prediction
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Forecast A/B test results before running experiments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}