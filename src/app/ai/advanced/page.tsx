'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Network,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe
} from 'lucide-react';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import AIMonitoringDashboard from '@/components/AIMonitoringDashboard';
import AdvancedAIChat from '@/components/AdvancedAIChat';

type AIView = 'overview' | 'autonomous' | 'monitoring' | 'optimization' | 'chat';

interface PlatformStatus {
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  campaigns: number;
  spend_today: number;
  performance: 'excellent' | 'good' | 'needs_attention' | 'critical';
}

interface AIDecision {
  id: string;
  type: 'budget_adjustment' | 'campaign_pause' | 'bid_optimization' | 'targeting_update';
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  estimated_improvement: string;
}

export default function AdvancedAIControlCenter() {
  const [currentView, setCurrentView] = useState<AIView>('overview');
  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>([
    { platform: 'Google Ads', status: 'connected', campaigns: 12, spend_today: 2847.50, performance: 'excellent' },
    { platform: 'Meta Ads', status: 'connected', campaigns: 8, spend_today: 1923.25, performance: 'good' },
    { platform: 'LinkedIn', status: 'disconnected', campaigns: 0, spend_today: 0, performance: 'needs_attention' }
  ]);
  
  const [aiDecisions, setAIDecisions] = useState<AIDecision[]>([
    {
      id: '1',
      type: 'budget_adjustment',
      description: 'Increase budget for Campaign "Black Friday Sale" by $500/day based on 340% ROAS',
      impact: 'high',
      confidence: 94,
      timestamp: new Date(),
      status: 'pending',
      estimated_improvement: '+$1,700 revenue/day'
    },
    {
      id: '2',
      type: 'bid_optimization',
      description: 'Optimize CPC bids for "Holiday Keywords" - reduce by 15% while maintaining position',
      impact: 'medium',
      confidence: 87,
      timestamp: new Date(Date.now() - 300000),
      status: 'executed',
      estimated_improvement: '-$230 daily spend'
    },
    {
      id: '3',
      type: 'campaign_pause',
      description: 'Pause underperforming "Summer Collection" campaign - CPA exceeded target by 180%',
      impact: 'high',
      confidence: 91,
      timestamp: new Date(Date.now() - 600000),
      status: 'approved',
      estimated_improvement: '-$890 daily waste'
    }
  ]);
  
  const {
    aiStatus,
    autonomousMode,
    pendingActions,
    actionHistory,
    capabilities,
    toggleAutonomousMode,
    executeAIAction
  } = useUnifiedAI();

  const handleApproveDecision = async (decisionId: string) => {
    const decision = aiDecisions.find(d => d.id === decisionId);
    if (!decision) return;

    try {
      await executeAIAction({
        type: 'optimization',
        function: decision.type,
        arguments: { decision_id: decisionId, description: decision.description }
      });

      setAIDecisions(prev => prev.map(d => 
        d.id === decisionId ? { ...d, status: 'approved' } : d
      ));
    } catch (error) {
      console.error('Failed to approve decision:', error);
    }
  };

  const handleRejectDecision = (decisionId: string) => {
    setAIDecisions(prev => prev.map(d => 
      d.id === decisionId ? { ...d, status: 'rejected' } : d
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'good': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTotalSpend = () => platformStatuses.reduce((sum, p) => sum + p.spend_today, 0);
  const getTotalCampaigns = () => platformStatuses.reduce((sum, p) => sum + p.campaigns, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Control Center
                </h1>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                aiStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                aiStatus === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {aiStatus.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAutonomousMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autonomousMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {autonomousMode ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span>{autonomousMode ? 'Autonomous' : 'Supervised'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'autonomous', label: 'Autonomous Control', icon: Bot },
              { id: 'monitoring', label: 'Platform Monitoring', icon: Activity },
              { id: 'optimization', label: 'AI Optimization', icon: Zap },
              { id: 'chat', label: 'AI Assistant', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as AIView)}
                className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Status</p>
                      <p className={`text-2xl font-bold ${getStatusColor(aiStatus)}`}>
                        {aiStatus.charAt(0).toUpperCase() + aiStatus.slice(1)}
                      </p>
                    </div>
                    <Cpu className={`h-8 w-8 ${getStatusColor(aiStatus)}`} />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Campaigns</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{getTotalCampaigns()}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Spend</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${getTotalSpend().toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Decisions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {aiDecisions.filter(d => d.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Platform Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Platform Status</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {platformStatuses.map((platform) => (
                      <div key={platform.platform} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">{platform.platform}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(platform.performance)}`}>
                            {platform.performance.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={`text-sm font-medium ${getStatusColor(platform.status)}`}>
                              {platform.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Campaigns:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{platform.campaigns}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Today's Spend:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ${platform.spend_today.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent AI Decisions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent AI Decisions</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {aiDecisions.slice(0, 3).map((decision) => (
                      <div key={decision.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                decision.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                decision.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {decision.impact} impact
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {decision.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white mb-2">{decision.description}</p>
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                              {decision.estimated_improvement}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {decision.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveDecision(decision.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectDecision(decision.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {decision.status !== 'pending' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                decision.status === 'approved' || decision.status === 'executed' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {decision.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'autonomous' && (
            <motion.div
              key="autonomous"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Autonomous Control Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Autonomous Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow AI to make decisions without approval</p>
                    </div>
                    <button
                      onClick={toggleAutonomousMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autonomousMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autonomousMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {capabilities.map((capability) => (
                    <div key={capability.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{capability.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{capability.description}</p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          capability.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            capability.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AIMonitoringDashboard />
            </motion.div>
          )}

          {currentView === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Optimization Engine</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <h4 className="font-medium text-green-800 dark:text-green-400">Auto Budget Optimization</h4>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        AI continuously monitors campaign performance and adjusts budgets to maximize ROAS
                      </p>
                    </div>
                    <div className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <h4 className="font-medium text-blue-800 dark:text-blue-400">Bid Management</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Real-time bid adjustments based on conversion probability and competitive landscape
                      </p>
                    </div>
                    <div className="p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Performance Monitoring</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Automatic pause of underperforming campaigns and ads to prevent budget waste
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Optimizations</h3>
                  <div className="space-y-3">
                    {aiDecisions.slice(0, 5).map((decision) => (
                      <div key={decision.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {decision.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {decision.estimated_improvement}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          decision.status === 'executed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          decision.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          decision.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {decision.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdvancedAIChat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}