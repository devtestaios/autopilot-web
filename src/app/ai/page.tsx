'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Shield, 
  Activity, 
  Settings,
  BarChart3,
  TrendingUp,
  Play,
  Pause,
  Eye,
  MessageSquare,
  Brain,
  Cpu,
  Network
} from 'lucide-react';
import AIDashboardControl from '@/components/AIDashboardControl';
import AIControlChat from '@/components/AIControlChat';
import { useAIControl } from '@/contexts/AIControlContext';

type AIView = 'overview' | 'dashboard' | 'chat' | 'settings';

export default function AIPage() {
  const [currentView, setCurrentView] = useState<AIView>('overview');
  
  const {
    aiStatus,
    autonomousMode,
    pendingActions,
    actionHistory,
    capabilities,
    toggleAutonomousMode
  } = useAIControl();

  const stats = [
    {
      label: 'AI Status',
      value: aiStatus.charAt(0).toUpperCase() + aiStatus.slice(1),
      icon: Activity,
      color: aiStatus === 'active' ? 'text-green-600' : 
             aiStatus === 'processing' ? 'text-yellow-600' : 
             aiStatus === 'error' ? 'text-red-600' : 'text-gray-600'
    },
    {
      label: 'Actions Completed',
      value: actionHistory.filter(a => a.status === 'completed').length.toString(),
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      label: 'Pending Actions',
      value: pendingActions.length.toString(),
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      label: 'Mode',
      value: autonomousMode ? 'Autonomous' : 'Supervised',
      icon: autonomousMode ? Bot : Eye,
      color: autonomousMode ? 'text-purple-600' : 'text-indigo-600'
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AIDashboardControl />;
      case 'chat':
        return (
          <div className="h-screen flex items-center justify-center">
            <AIControlChat defaultMinimized={false} />
          </div>
        );
      case 'settings':
        return <AISettingsPanel />;
      default:
        return <AIOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Control Center
                </h1>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div className={`w-2 h-2 rounded-full ${
                  aiStatus === 'active' ? 'bg-green-400 animate-pulse' :
                  aiStatus === 'processing' ? 'bg-yellow-400 animate-pulse' :
                  aiStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {aiStatus}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAutonomousMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autonomousMode 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {autonomousMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{autonomousMode ? 'Autonomous' : 'Supervised'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'dashboard', label: 'AI Dashboard', icon: BarChart3 },
              { id: 'chat', label: 'AI Chat', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as AIView)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}

function AIOverview() {
  const { capabilities, actionHistory, pendingActions } = useAIControl();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Capabilities */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            AI Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((capability) => (
              <motion.div
                key={capability.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {capability.name}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    capability.enabled 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {capability.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {capability.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {capability.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">AI Actions</h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {actionHistory.slice(-10).reverse().map((action) => (
                <div key={action.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    action.status === 'completed' ? 'bg-green-400' :
                    action.status === 'failed' ? 'bg-red-400' :
                    action.status === 'executing' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {action.function.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {action.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {actionHistory.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No AI actions yet
                </p>
              )}
            </div>
          </div>

          {/* Pending Actions */}
          {pendingActions.length > 0 && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 p-4">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Pending Approval ({pendingActions.length})
              </h3>
              <div className="space-y-2">
                {pendingActions.map((action) => (
                  <div key={action.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                    {action.function}: Waiting for human approval
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AISettingsPanel() {
  const { 
    capabilities, 
    autonomousMode, 
    grantAIPermission, 
    revokeAIPermission,
    toggleAutonomousMode 
  } = useAIControl();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        AI Control Settings
      </h2>
      
      <div className="space-y-8">
        {/* Global Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Global AI Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Autonomous Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow AI to execute actions without human approval (with safety limits)
                </p>
              </div>
              <button
                onClick={toggleAutonomousMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  autonomousMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autonomousMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Capability Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Capabilities
          </h3>
          
          <div className="space-y-4">
            {capabilities.map((capability) => (
              <div key={capability.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {capability.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {capability.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {capability.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    capability.enabled ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {capability.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => {
                      capability.permissions.forEach(permission => {
                        if (capability.enabled) {
                          revokeAIPermission(permission);
                        } else {
                          grantAIPermission(permission);
                        }
                      });
                    }}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      capability.enabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {capability.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}