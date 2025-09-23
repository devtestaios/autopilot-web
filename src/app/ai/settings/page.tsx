'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Settings, 
  Zap, 
  Shield, 
  Bell, 
  BarChart3,
  Target,
  DollarSign,
  Lightbulb,
  Bot,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import UnifiedSidebar from '@/components/UnifiedSidebar';

const AISettingsPage = () => {
  const { 
    capabilities, 
    autoOptimization, 
    insightNotifications, 
    smartSuggestions,
    toggleCapability,
    updateSettings 
  } = useUnifiedAI();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('capabilities');

  const tabs = [
    { id: 'capabilities', label: 'AI Capabilities', icon: Brain },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Privacy & Security', icon: Shield }
  ];

  const categoryIcons = {
    optimization: Zap,
    analytics: BarChart3,
    automation: Bot,
    insights: Lightbulb,
    control: Settings
  };

  const handleCapabilityToggle = (capabilityId: string) => {
    toggleCapability(capabilityId);
  };

  const handleSettingUpdate = (key: string, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const renderCapabilities = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Capabilities
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enable or disable specific AI features based on your preferences and business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((capability) => {
          const CategoryIcon = categoryIcons[capability.category];
          return (
            <PremiumCard key={capability.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    'p-2 rounded-lg',
                    capability.enabled 
                      ? 'bg-pulse-cyan/10 text-pulse-cyan' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  )}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {capability.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {capability.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        capability.category === 'optimization' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                        capability.category === 'analytics' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                        capability.category === 'automation' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                        capability.category === 'insights' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      )}>
                        {capability.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCapabilityToggle(capability.id)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2',
                    capability.enabled ? 'bg-pulse-cyan' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <span className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    capability.enabled ? 'translate-x-6' : 'translate-x-1'
                  )} />
                </button>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Automation Settings
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Configure AI automation features and safety limits.
        </p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                autoOptimization ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              )}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Auto-Optimization
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically optimize campaigns based on AI recommendations
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingUpdate('autoOptimization', !autoOptimization)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2',
                autoOptimization ? 'bg-pulse-cyan' : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              <span className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                autoOptimization ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
          </div>
          {autoOptimization && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Safety Limits Active</p>
                  <p className="mt-1">Maximum 20% budget changes per day. All changes logged and reversible.</p>
                </div>
              </div>
            </div>
          )}
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                smartSuggestions ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              )}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Smart Suggestions
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show AI-powered suggestions throughout the platform
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingUpdate('smartSuggestions', !smartSuggestions)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2',
                smartSuggestions ? 'bg-pulse-cyan' : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              <span className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                smartSuggestions ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
          </div>
        </PremiumCard>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Notifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Configure when and how AI sends you insights and alerts.
        </p>
      </div>

      <PremiumCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              insightNotifications ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            )}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Insight Notifications
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive notifications when AI discovers important insights
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSettingUpdate('insightNotifications', !insightNotifications)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2',
              insightNotifications ? 'bg-pulse-cyan' : 'bg-gray-200 dark:bg-gray-700'
            )}
          >
            <span className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              insightNotifications ? 'translate-x-6' : 'translate-x-1'
            )} />
          </button>
        </div>
      </PremiumCard>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Privacy & Security
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          AI data handling and privacy settings.
        </p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Data Privacy
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• All data processing happens securely on our servers</li>
                <li>• Campaign data is never shared with third parties</li>
                <li>• AI models are trained on anonymized, aggregated data</li>
                <li>• You maintain full control over your data</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                AI Model Information
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>Our AI uses advanced machine learning models to analyze your marketing data and provide insights.</p>
                <div className="flex items-center gap-2 mt-3">
                  <PremiumButton variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Learn More
                  </PremiumButton>
                </div>
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent">
                  AI Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure AI capabilities and automation preferences
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === tab.id
                          ? 'border-pulse-cyan text-pulse-cyan'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'capabilities' && renderCapabilities()}
            {activeTab === 'automation' && renderAutomation()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'security' && renderSecurity()}
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Settings are automatically saved
            </div>
            <div className="flex gap-3">
              <PremiumButton variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </PremiumButton>
              <PremiumButton>
                <Save className="w-4 h-4 mr-2" />
                Export Settings
              </PremiumButton>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AISettingsPage;