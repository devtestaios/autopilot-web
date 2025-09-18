/**
 * AI Autopilot Command Center
 * 
 * This is the main control interface for AI-powered campaign management,
 * combining intelligent sync orchestration with real-time optimization insights.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Activity, 
  Settings, 
  TrendingUp, 
  Shield, 
  Clock,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Bot,
  Target,
  DollarSign
} from 'lucide-react';
import { OptimizationDashboard } from '@/components/OptimizationDashboard';
import { intelligentSyncOrchestrator, type SyncResult, type AutomationConfig, type AIOptimizationResult } from '@/lib/services/intelligentSyncOrchestrator';

interface AutopilotDashboardProps {
  className?: string;
}

export function AutopilotDashboard({ className }: AutopilotDashboardProps) {
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<AIOptimizationResult[]>([]);
  const [isRunningSync, setIsRunningSync] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'insights' | 'automation' | 'settings'>('overview');

  useEffect(() => {
    loadAutomationStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(loadAutomationStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomationStatus = () => {
    const status = intelligentSyncOrchestrator.getAutomationStatus();
    setAutomationStatus(status);
  };

  const handleIntelligentSync = async () => {
    setIsRunningSync(true);
    try {
      const result = await intelligentSyncOrchestrator.performIntelligentSync();
      setSyncResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      loadAutomationStatus();
    } catch (error) {
      console.error('Intelligent sync failed:', error);
    } finally {
      setIsRunningSync(false);
    }
  };

  const handleAutomationToggle = (field: keyof AutomationConfig, value: boolean | number) => {
    intelligentSyncOrchestrator.updateAutomationConfig({ [field]: value });
    loadAutomationStatus();
  };

  const handleEmergencyStop = () => {
    intelligentSyncOrchestrator.emergencyStop();
    loadAutomationStatus();
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-500" />
    );
  };

  const formatDuration = (seconds: number) => {
    return seconds < 60 ? `${seconds.toFixed(1)}s` : `${(seconds / 60).toFixed(1)}m`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">AI Autopilot Command Center</h1>
              <p className="text-blue-100 mt-1">
                Autonomous campaign optimization powered by artificial intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleIntelligentSync}
              disabled={isRunningSync}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 flex items-center space-x-2"
            >
              {isRunningSync ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Run AI Analysis</span>
                </>
              )}
            </button>
            <button
              onClick={handleEmergencyStop}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Emergency Stop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'insights', label: 'AI Insights', icon: Brain },
            { id: 'automation', label: 'Automation', icon: Bot },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && automationStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Automation Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Automation Status</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Analysis</span>
                <div className="flex items-center space-x-2">
                  {automationStatus.config.enableAIAnalysis ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {automationStatus.config.enableAIAnalysis ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Optimization</span>
                <div className="flex items-center space-x-2">
                  {automationStatus.config.enableAutomaticOptimization ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {automationStatus.config.enableAutomaticOptimization ? 'Enabled' : 'Manual Mode'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Confidence Threshold</span>
                <span className="text-sm font-medium">
                  {(automationStatus.config.confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Budget Change Limit</span>
                <span className="text-sm font-medium">
                  {automationStatus.config.budgetChangeLimit}%
                </span>
              </div>
            </div>
          </div>

          {/* Sync Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Sync Performance</span>
            </h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {syncResults.length > 0 ? syncResults[0].campaignsUpdated : 0}
                </div>
                <div className="text-sm text-gray-600">Campaigns Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {syncResults.length > 0 ? syncResults[0].aiInsightsGenerated : 0}
                </div>
                <div className="text-sm text-gray-600">AI Insights Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {syncResults.length > 0 ? formatDuration(syncResults[0].executionTime) : '0s'}
                </div>
                <div className="text-sm text-gray-600">Last Execution Time</div>
              </div>
            </div>
          </div>

          {/* Next Sync */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Next Scheduled Sync</span>
            </h3>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                {automationStatus.nextScheduledSync 
                  ? new Date(automationStatus.nextScheduledSync).toLocaleTimeString()
                  : 'Not scheduled'
                }
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {automationStatus.lastSync 
                  ? `Last sync: ${new Date(automationStatus.lastSync).toLocaleString()}`
                  : 'No previous sync'
                }
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                automationStatus.isRunning 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {automationStatus.isRunning ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {selectedTab === 'insights' && (
        <OptimizationDashboard />
      )}

      {/* Automation Tab */}
      {selectedTab === 'automation' && automationStatus && (
        <div className="space-y-6">
          {/* Automation Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Automation Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">AI Analysis</label>
                    <p className="text-sm text-gray-600">Automatically analyze campaigns for optimization opportunities</p>
                  </div>
                  <button
                    onClick={() => handleAutomationToggle('enableAIAnalysis', !automationStatus.config.enableAIAnalysis)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      automationStatus.config.enableAIAnalysis ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      automationStatus.config.enableAIAnalysis ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Automatic Optimization</label>
                    <p className="text-sm text-gray-600">Apply high-confidence optimizations automatically</p>
                  </div>
                  <button
                    onClick={() => handleAutomationToggle('enableAutomaticOptimization', !automationStatus.config.enableAutomaticOptimization)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      automationStatus.config.enableAutomaticOptimization ? 'bg-green-600' : 'bg-red-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      automationStatus.config.enableAutomaticOptimization ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Confidence Threshold: {(automationStatus.config.confidenceThreshold * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value={automationStatus.config.confidenceThreshold * 100}
                    onChange={(e) => handleAutomationToggle('confidenceThreshold', Number(e.target.value) / 100)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">Minimum confidence level for automatic actions</p>
                </div>

                <div>
                  <label className="block font-medium mb-2">Budget Change Limit: {automationStatus.config.budgetChangeLimit}%</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={automationStatus.config.budgetChangeLimit}
                    onChange={(e) => handleAutomationToggle('budgetChangeLimit', Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum budget change per optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sync Results */}
          {syncResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sync Results</h3>
              <div className="space-y-3">
                {syncResults.slice(0, 5).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.success)}
                      <div>
                        <div className="font-medium">{result.message}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(result.timestamp).toLocaleString()} • {formatDuration(result.executionTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{result.campaignsUpdated} campaigns</div>
                      <div className="text-sm text-gray-600">{result.aiInsightsGenerated} insights</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Performance Thresholds</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Performance Threshold</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={automationStatus?.config.performanceThreshold || 60}
                    onChange={(e) => handleAutomationToggle('performanceThreshold', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <p className="text-sm text-gray-600 mt-1">Campaigns below this score get priority optimization</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Safety Controls</h4>
              <div className="space-y-3">
                <button
                  onClick={handleEmergencyStop}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Emergency Stop All Automation</span>
                </button>
                <p className="text-sm text-gray-600">
                  Immediately halt all automatic optimizations while preserving AI analysis capabilities
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}