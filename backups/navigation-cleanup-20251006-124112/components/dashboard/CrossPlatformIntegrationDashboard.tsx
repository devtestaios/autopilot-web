'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, ArrowRightLeft, Zap, Brain, Target, TrendingUp, 
  Users, Clock, CheckCircle, AlertCircle, PlayCircle, 
  Pause, RotateCcw, ExternalLink, ChevronRight, Layers,
  GitBranch, Network, Workflow
} from 'lucide-react';
import { useCrossPlatform } from '@/contexts/CrossPlatformContext';

// Cross-Platform Integration Status Component
function PlatformIntegrationStatus() {
  const { memory, getSharedContext } = useCrossPlatform();
  const [integrationHealth, setIntegrationHealth] = useState({
    overall: 95,
    dataSync: 98,
    workflows: 92,
    contextSharing: 97
  });

  const platformConnections = [
    {
      id: 'social-media-email',
      source: 'Social Media',
      target: 'Email Marketing',
      status: 'active',
      dataFlow: 'bidirectional',
      lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      syncCount: 47,
      performance: 96
    },
    {
      id: 'email-analytics',
      source: 'Email Marketing',
      target: 'Analytics',
      status: 'active',
      dataFlow: 'unidirectional',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      syncCount: 23,
      performance: 94
    },
    {
      id: 'project-social',
      source: 'Project Management',
      target: 'Social Media',
      status: 'active',
      dataFlow: 'bidirectional',
      lastSync: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      syncCount: 12,
      performance: 99
    },
    {
      id: 'marketing-analytics',
      source: 'Marketing Command Center',
      target: 'Analytics',
      status: 'syncing',
      dataFlow: 'bidirectional',
      lastSync: new Date(),
      syncCount: 156,
      performance: 98
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'syncing': return 'text-blue-600 dark:text-blue-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'paused': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RotateCcw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform Integration Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time cross-platform data synchronization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {integrationHealth.overall}% Healthy
          </span>
        </div>
      </div>

      {/* Integration Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Data Sync', value: integrationHealth.dataSync, icon: Share2 },
          { label: 'Workflows', value: integrationHealth.workflows, icon: Workflow },
          { label: 'Context Sharing', value: integrationHealth.contextSharing, icon: Brain },
          { label: 'Overall Health', value: integrationHealth.overall, icon: Target }
        ].map((metric) => (
          <div key={metric.label} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <metric.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {metric.value}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Platform Connections */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Active Connections
        </h4>
        {platformConnections.map((connection) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`${getStatusColor(connection.status)}`}>
                {getStatusIcon(connection.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {connection.source}
                </span>
                <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {connection.target}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="text-center">
                <div className="font-medium">{connection.syncCount}</div>
                <div>syncs</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{connection.performance}%</div>
                <div>success</div>
              </div>
              <div className="text-center">
                <div className="font-medium">
                  {Math.round((Date.now() - connection.lastSync.getTime()) / 60000)}m
                </div>
                <div>ago</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Shared Context Viewer Component
function SharedContextViewer() {
  const { memory, getSharedContext } = useCrossPlatform();
  const [selectedPlatform, setSelectedPlatform] = useState('social-media');
  const [sharedContext, setSharedContext] = useState<any>(null);

  const platforms = [
    { id: 'social-media', name: 'Social Media', icon: Users },
    { id: 'email-marketing', name: 'Email Marketing', icon: Target },
    { id: 'project-management', name: 'Project Management', icon: Layers },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  useEffect(() => {
    const context = getSharedContext(selectedPlatform);
    setSharedContext(context);
  }, [selectedPlatform, getSharedContext]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Shared Context Memory
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cross-platform context and memory sharing
          </p>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedPlatform === platform.id
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <platform.icon className="w-4 h-4" />
            {platform.name}
          </button>
        ))}
      </div>

      {/* Context Information */}
      {sharedContext && (
        <div className="space-y-4">
          {/* Current Project */}
          {sharedContext.currentProject && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-300">
                  Current Project
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  sharedContext.currentProject.priority === 'high' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {sharedContext.currentProject.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                {sharedContext.currentProject.name}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                {sharedContext.currentProject.description}
              </p>
            </div>
          )}

          {/* Relevant Goals */}
          {sharedContext.relevantGoals.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-300 mb-3">
                Relevant Goals ({sharedContext.relevantGoals.length})
              </h4>
              <div className="space-y-2">
                {sharedContext.relevantGoals.slice(0, 3).map((goal: any) => (
                  <div key={goal.id} className="flex items-center justify-between">
                    <span className="text-green-800 dark:text-green-200 text-sm">
                      {goal.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 dark:bg-green-800 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.currentProgress / goal.target.value) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {Math.round((goal.currentProgress / goal.target.value) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contextual Suggestions */}
          {sharedContext.suggestedActions.length > 0 && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-3">
                AI Suggestions ({sharedContext.suggestedActions.length})
              </h4>
              <div className="space-y-3">
                {sharedContext.suggestedActions.slice(0, 2).map((suggestion: any) => (
                  <div key={suggestion.id} className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
                        {suggestion.title}
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 text-xs">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-purple-500">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-purple-500">•</span>
                        <span className="text-xs text-purple-500">
                          {suggestion.impact.toUpperCase()} impact
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Assets */}
          {sharedContext.sharedAssets.length > 0 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-3">
                Shared Assets ({sharedContext.sharedAssets.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sharedContext.sharedAssets.slice(0, 4).map((asset: any) => (
                  <div key={asset.id} className="flex items-center gap-2 p-2 bg-orange-100 dark:bg-orange-800/30 rounded">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-800 dark:text-orange-200 text-xs truncate">
                      {asset.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Cross-Platform Workflows Component
function CrossPlatformWorkflows() {
  const { memory, triggerCrossPlatformAction } = useCrossPlatform();
  const [activeWorkflows, setActiveWorkflows] = useState([
    {
      id: 'workflow-001',
      name: 'Social → Email Amplification',
      description: 'Automatically create email campaigns for high-performing social posts',
      platforms: ['social-media', 'email-marketing'],
      status: 'active',
      progress: 75,
      lastRun: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      successRate: 94,
      triggers: 5,
      automationLevel: 'smart'
    },
    {
      id: 'workflow-002',
      name: 'Project → Campaign Sync',
      description: 'Sync project milestones with marketing campaign schedules',
      platforms: ['project-management', 'marketing-command-center'],
      status: 'active',
      progress: 100,
      lastRun: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      successRate: 98,
      triggers: 12,
      automationLevel: 'full'
    },
    {
      id: 'workflow-003',
      name: 'Performance → Optimization',
      description: 'Auto-optimize campaigns based on analytics insights',
      platforms: ['analytics', 'marketing-command-center', 'social-media'],
      status: 'paused',
      progress: 45,
      lastRun: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
      successRate: 87,
      triggers: 3,
      automationLevel: 'assisted'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getAutomationColor = (level: string) => {
    switch (level) {
      case 'full': return 'text-green-600 dark:text-green-400';
      case 'smart': return 'text-blue-600 dark:text-blue-400';
      case 'assisted': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Workflow className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cross-Platform Workflows
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automated workflows spanning multiple platforms
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
          Create Workflow
        </button>
      </div>

      <div className="space-y-4">
        {activeWorkflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {workflow.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status.toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium ${getAutomationColor(workflow.automationLevel)}`}>
                    {workflow.automationLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {workflow.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Platforms: {workflow.platforms.length}</span>
                  <span>Success Rate: {workflow.successRate}%</span>
                  <span>Triggers: {workflow.triggers}</span>
                  <span>Last Run: {Math.round((Date.now() - workflow.lastRun.getTime()) / 60000)}m ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => triggerCrossPlatformAction(workflow.id, { manual: true })}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${workflow.progress}%` }}
              ></div>
            </div>

            {/* Platform Chain */}
            <div className="flex items-center gap-2">
              {workflow.platforms.map((platform, index) => (
                <React.Fragment key={platform}>
                  <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                    {platform.replace('-', ' ')}
                  </div>
                  {index < workflow.platforms.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Main Cross-Platform Integration Dashboard
export default function CrossPlatformIntegrationDashboard() {
  const { memory, isLoading } = useCrossPlatform();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cross-Platform Integration
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Symbiotic ecosystem with shared context and automated workflows
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Cross-Platform Sync Active
          </span>
        </div>
      </div>

      {/* Integration Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformIntegrationStatus />
        <SharedContextViewer />
      </div>

      <CrossPlatformWorkflows />
    </div>
  );
}