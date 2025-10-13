/**
 * AI PERFORMANCE ADVISOR PAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - AI Enhancement Protocol
 * 
 * Intelligent performance optimization dashboard powered by AI analysis,
 * providing automated recommendations and performance insights.
 */

'use client';

import React, { useState } from 'react';
// NavigationTabs removed - using root layout Navigation instead
import AIPerformanceAdvisor from '@/components/ai/AIPerformanceAdvisor';
import WebVitalsMonitor from '@/components/performance/WebVitalsMonitor';

/**
 * AI Performance Advisor Dashboard
 * 
 * ✅ PERFORMANCE: AI-powered performance optimization interface
 */
export default function AIPerformanceAdvisorPage() {
  const [advisorSettings, setAdvisorSettings] = useState({
    enableAutoAnalysis: true,
    analysisInterval: 60000, // 1 minute
    enableNotifications: true
  });

  const [insightStats, setInsightStats] = useState({
    totalInsights: 0,
    criticalIssues: 0,
    optimizationsImplemented: 0
  });

  const handleInsightGenerated = (insight: any) => {
    setInsightStats(prev => ({
      ...prev,
      totalInsights: prev.totalInsights + 1,
      criticalIssues: insight.priority === 'critical' ? prev.criticalIssues + 1 : prev.criticalIssues
    }));

    // Could integrate with external analytics
    console.log('New AI insight generated:', insight);
  };

  const handleSettingsChange = (key: string, value: any) => {
    setAdvisorSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                🤖 AI Performance Advisor
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  Phase 4A
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Intelligent performance optimization with AI-powered recommendations and automated insights
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

        {/* AI Advisor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total AI Insights</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{insightStats.totalInsights}</p>
              </div>
              <div className="text-3xl">🧠</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{insightStats.criticalIssues}</p>
              </div>
              <div className="text-3xl">🚨</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Optimizations</p>
                <p className="text-2xl font-bold text-green-600">{insightStats.optimizationsImplemented}</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>
        </div>

        {/* AI Advisor Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Advisor Configuration
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize how the AI analyzes and reports performance insights
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Auto Analysis Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Automatic Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable continuous AI analysis of performance data
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={advisorSettings.enableAutoAnalysis}
                  onChange={(e) => handleSettingsChange('enableAutoAnalysis', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  {advisorSettings.enableAutoAnalysis ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Analysis Interval */}
            {advisorSettings.enableAutoAnalysis && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Analysis Frequency
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How often the AI should analyze performance data
                  </p>
                </div>
                <select
                  value={advisorSettings.analysisInterval}
                  onChange={(e) => handleSettingsChange('analysisInterval', Number(e.target.value))}
                  className="rounded border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                  <option value={600000}>10 minutes</option>
                </select>
              </div>
            )}

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Smart Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications for critical AI insights
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={advisorSettings.enableNotifications}
                  onChange={(e) => handleSettingsChange('enableNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  {advisorSettings.enableNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Main AI Performance Advisor */}
        <AIPerformanceAdvisor
          enableAutoAnalysis={advisorSettings.enableAutoAnalysis}
          analysisInterval={advisorSettings.analysisInterval}
          onInsightGenerated={handleInsightGenerated}
        />

        {/* AI Capabilities Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            🚀 AI Performance Intelligence Capabilities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">🎯 Smart Analysis</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Intelligent performance scoring with AI grading</li>
                <li>• Automated trend detection and regression analysis</li>
                <li>• Context-aware optimization recommendations</li>
                <li>• Predictive performance issue identification</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">⚡ Optimization Engine</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Priority-based issue classification</li>
                <li>• Impact vs effort analysis for recommendations</li>
                <li>• Achievement recognition and progress tracking</li>
                <li>• Personalized optimization roadmaps</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>🧠 AI Intelligence:</strong> This system uses advanced algorithms to analyze your performance data, 
              identify patterns, predict issues, and provide intelligent recommendations tailored to your specific 
              performance profile and optimization goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}