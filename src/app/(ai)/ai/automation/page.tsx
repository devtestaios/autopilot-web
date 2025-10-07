'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  Activity, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  RefreshCw,
  Shield,
  Eye,
  Bell
} from 'lucide-react';

export default function AIAutomationDashboard() {
  const [automationStatus, setAutomationStatus] = useState('active');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);

  useEffect(() => {
    // Mock recent AI activities
    setRecentActivities([
      {
        id: 1,
        timestamp: '2 minutes ago',
        action: 'Budget Optimization',
        description: 'Increased Google Ads Campaign A budget by 15% due to strong performance',
        impact: '+18% conversions',
        status: 'completed',
        confidence: 94
      },
      {
        id: 2,
        timestamp: '12 minutes ago',
        action: 'Bid Adjustment',
        description: 'Lowered CPC bids for 3 underperforming keywords in Meta Campaign B',
        impact: '-8% cost per click',
        status: 'completed',
        confidence: 87
      },
      {
        id: 3,
        timestamp: '28 minutes ago',
        action: 'Keyword Optimization',
        description: 'Added 5 high-performing negative keywords to reduce wasted spend',
        impact: '-12% irrelevant traffic',
        status: 'completed',
        confidence: 91
      },
      {
        id: 4,
        timestamp: '45 minutes ago',
        action: 'Schedule Adjustment',
        description: 'Modified ad schedule for LinkedIn Campaign C based on conversion patterns',
        impact: '+23% click-through rate',
        status: 'completed',
        confidence: 89
      },
      {
        id: 5,
        timestamp: '1 hour ago',
        action: 'Audience Expansion',
        description: 'Expanded lookalike audience for top-performing campaign segments',
        impact: '+156% reach',
        status: 'pending_review',
        confidence: 76
      }
    ]);

    // Mock automation rules
    setAutomationRules([
      {
        id: 1,
        name: 'Budget Optimization',
        description: 'Automatically adjust budgets based on performance',
        enabled: true,
        frequency: 'Real-time',
        conditions: 'ROAS > 4.0 and CPA < $50',
        actions: 'Increase budget by 10-25%',
        confidence_threshold: 85
      },
      {
        id: 2,
        name: 'Bid Management',
        description: 'Optimize keyword bids for better ROI',
        enabled: true,
        frequency: 'Hourly',
        conditions: 'CTR < 2% or CPC > target',
        actions: 'Adjust bids ±15%',
        confidence_threshold: 80
      },
      {
        id: 3,
        name: 'Negative Keywords',
        description: 'Add negative keywords to reduce waste',
        enabled: true,
        frequency: 'Daily',
        conditions: 'Low CTR + High impressions',
        actions: 'Add negative keywords',
        confidence_threshold: 90
      },
      {
        id: 4,
        name: 'Creative Rotation',
        description: 'Pause underperforming ad creatives',
        enabled: false,
        frequency: 'Weekly',
        conditions: 'CTR < 1.5% for 7+ days',
        actions: 'Pause and suggest new creative',
        confidence_threshold: 95
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending_review': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending_review': return Clock;
      case 'failed': return AlertTriangle;
      default: return Activity;
    }
  };

  const toggleAutomationRule = (ruleId: number) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Automation Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and control intelligent campaign automation
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${automationStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {automationStatus === 'active' ? 'AI Active' : 'AI Paused'}
              </span>
            </div>
            <button
              onClick={() => setAutomationStatus(automationStatus === 'active' ? 'paused' : 'active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                automationStatus === 'active'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
              }`}
            >
              {automationStatus === 'active' ? (
                <>
                  <Pause className="h-4 w-4 mr-2 inline-block" />
                  Pause AI
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2 inline-block" />
                  Resume AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Actions Today</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">47</p>
            <p className="text-sm text-green-600 dark:text-green-400">+12 from yesterday</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Success Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">94.2%</p>
            <p className="text-sm text-green-600 dark:text-green-400">+2.1% this week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-900 dark:text-white">Cost Savings</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$8,420</p>
            <p className="text-sm text-green-600 dark:text-green-400">This month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-gray-900 dark:text-white">Avg Confidence</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">87%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">High reliability</p>
          </div>
        </div>

        {/* Recent AI Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent AI Activities
            </h2>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const StatusIcon = getStatusIcon(activity.status);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <StatusIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {activity.impact}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Automation Rules
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add New Rule
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automationRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {rule.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rule.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAutomationRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rule.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                    <span className="text-gray-900 dark:text-white">{rule.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Conditions:</span>
                    <span className="text-gray-900 dark:text-white">{rule.conditions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Actions:</span>
                    <span className="text-gray-900 dark:text-white">{rule.actions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Min Confidence:</span>
                    <span className="text-gray-900 dark:text-white">{rule.confidence_threshold}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      rule.enabled 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </span>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                      Configure
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}