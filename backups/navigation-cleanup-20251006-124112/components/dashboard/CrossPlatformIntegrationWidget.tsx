'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, ArrowRightLeft, Zap, Brain, Target, Users, 
  Clock, CheckCircle, GitBranch, Network, Workflow,
  ExternalLink, ChevronRight, Layers, TrendingUp
} from 'lucide-react';
import { useCrossPlatform } from '@/contexts/CrossPlatformContext';

interface CrossPlatformFeatureProps {
  title: string;
  description: string;
  platforms: string[];
  status: 'active' | 'syncing' | 'pending';
  lastSync?: Date;
  suggestions?: number;
  onActivate?: () => void;
}

// Cross-Platform Feature Widget
function CrossPlatformFeatureWidget({ 
  title, 
  description, 
  platforms, 
  status, 
  lastSync, 
  suggestions = 0,
  onActivate 
}: CrossPlatformFeatureProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'syncing': return 'text-blue-600 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <ArrowRightLeft className="w-4 h-4 animate-pulse" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className="text-xs font-medium">{status.toUpperCase()}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>

      {/* Connected Platforms */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">Platforms:</span>
        <div className="flex gap-1">
          {platforms.map((platform, index) => (
            <React.Fragment key={platform}>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {platform}
              </span>
              {index < platforms.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          {lastSync && (
            <span>
              Last sync: {Math.round((Date.now() - lastSync.getTime()) / 60000)}m ago
            </span>
          )}
          {suggestions > 0 && (
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              {suggestions} AI suggestions
            </span>
          )}
        </div>
        {onActivate && status === 'pending' && (
          <button
            onClick={onActivate}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Activate
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Cross-Platform Insights Widget
function CrossPlatformInsights() {
  const { memory, getContextualSuggestions } = useCrossPlatform();
  
  const insights = [
    {
      type: 'optimization',
      title: 'Social → Email Sync Opportunity',
      description: 'High-performing social posts can boost email engagement by 34%',
      confidence: 0.87,
      platforms: ['Social Media', 'Email Marketing'],
      action: 'Create email campaign from viral post'
    },
    {
      type: 'automation',
      title: 'Project Milestone Integration',
      description: 'Sync project deadlines with marketing campaign schedules',
      confidence: 0.92,
      platforms: ['Project Management', 'Marketing'],
      action: 'Enable automated milestone sync'
    },
    {
      type: 'analytics',
      title: 'Cross-Platform ROI Analysis',
      description: 'Combined platform data shows 23% improvement opportunity',
      confidence: 0.78,
      platforms: ['Analytics', 'All Platforms'],
      action: 'View unified analytics dashboard'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cross-Platform Insights
        </h3>
        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {insight.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {Math.round(insight.confidence * 100)}%
                </span>
                <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {insight.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
                  >
                    {platform}
                  </span>
                ))}
              </div>
              <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                {insight.action}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Active Workflows Summary
function ActiveWorkflowsSummary() {
  const workflows = [
    {
      name: 'Social → Email',
      platforms: 2,
      lastRun: '5m ago',
      status: 'active',
      success: 94
    },
    {
      name: 'Project → Marketing',
      platforms: 3,
      lastRun: '12m ago', 
      status: 'active',
      success: 98
    },
    {
      name: 'Analytics → Optimization',
      platforms: 4,
      lastRun: '1h ago',
      status: 'pending',
      success: 87
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Active Workflows
        </h3>
        <Workflow className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>

      <div className="space-y-2">
        {workflows.map((workflow, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                workflow.status === 'active' 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-yellow-500'
              }`}></div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {workflow.name}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {workflow.platforms} platforms • {workflow.lastRun}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {workflow.success}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                success
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Main Cross-Platform Integration Component for existing pages
export default function CrossPlatformIntegrationWidget() {
  const { memory, triggerCrossPlatformAction } = useCrossPlatform();

  const crossPlatformFeatures = [
    {
      title: 'Social Media → Email Marketing',
      description: 'Automatically create email campaigns from high-performing social posts',
      platforms: ['Social Media', 'Email Marketing'],
      status: 'active' as const,
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      suggestions: 3
    },
    {
      title: 'Project Management → Marketing',
      description: 'Sync project milestones with marketing campaign schedules',
      platforms: ['Project Management', 'Marketing Command Center'],
      status: 'syncing' as const,
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      suggestions: 1
    },
    {
      title: 'Analytics → All Platforms',
      description: 'Share performance insights across all connected platforms',
      platforms: ['Analytics', 'All Platforms'],
      status: 'pending' as const,
      suggestions: 5,
      onActivate: () => triggerCrossPlatformAction('analytics-sync', {})
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cross-Platform Integration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Symbiotic ecosystem with shared context and workflows
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Cross-Platform Sync Active
          </span>
        </div>
      </div>

      {/* Cross-Platform Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {crossPlatformFeatures.map((feature, index) => (
          <CrossPlatformFeatureWidget key={index} {...feature} />
        ))}
      </div>

      {/* Insights and Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrossPlatformInsights />
        <ActiveWorkflowsSummary />
      </div>
    </div>
  );
}