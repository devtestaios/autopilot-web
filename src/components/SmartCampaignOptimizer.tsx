'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Settings, 
  Brain, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Lightbulb,
  Clock,
  ChevronRight,
  Bot,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Campaign } from '@/types';

interface OptimizationAction {
  id: string;
  title: string;
  description: string;
  type: 'budget' | 'bidding' | 'targeting' | 'creative' | 'scheduling';
  impact: {
    metric: string;
    estimated_change: number;
    confidence: number;
  };
  automation_ready: boolean;
  requires_approval: boolean;
  estimated_time: string;
  risk_level: 'low' | 'medium' | 'high';
  data_sources: string[];
  action: () => Promise<void>;
}

interface SmartCampaignOptimizerProps {
  campaignId?: string;
  campaigns?: Campaign[];
  campaignData?: any;
  className?: string;
}

const SmartCampaignOptimizer: React.FC<SmartCampaignOptimizerProps> = ({
  campaignId,
  campaigns,
  campaignData,
  className
}) => {
  const [optimizations, setOptimizations] = useState<OptimizationAction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useState(true);
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());

  // Generate optimization recommendations
  useEffect(() => {
    const generateOptimizations = () => {
      const actions: OptimizationAction[] = [
        {
          id: 'budget-reallocation-1',
          title: 'Reallocate Budget to Top Performers',
          description: 'Move $1,500 budget from underperforming ad groups to top 3 converting ad groups',
          type: 'budget',
          impact: {
            metric: 'Conversions',
            estimated_change: 23.5,
            confidence: 94
          },
          automation_ready: true,
          requires_approval: false,
          estimated_time: '5 minutes',
          risk_level: 'low',
          data_sources: ['30-day performance data', 'Conversion tracking', 'Ad group analysis'],
          action: async () => {
            // Implementation for budget reallocation
            console.log('Executing budget reallocation...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        },
        {
          id: 'bid-optimization-1',
          title: 'Optimize Bid Strategy',
          description: 'Switch to Target CPA bidding with enhanced CPC for better conversion optimization',
          type: 'bidding',
          impact: {
            metric: 'Cost per Acquisition',
            estimated_change: -18.2,
            confidence: 87
          },
          automation_ready: true,
          requires_approval: true,
          estimated_time: '10 minutes',
          risk_level: 'medium',
          data_sources: ['Historical CPA data', 'Bidding performance', 'Conversion patterns'],
          action: async () => {
            console.log('Executing bid optimization...');
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        },
        {
          id: 'audience-expansion-1',
          title: 'Expand High-Value Audiences',
          description: 'Add 3 similar audience segments based on your best converting customers',
          type: 'targeting',
          impact: {
            metric: 'Reach',
            estimated_change: 45.7,
            confidence: 82
          },
          automation_ready: false,
          requires_approval: true,
          estimated_time: '15 minutes',
          risk_level: 'medium',
          data_sources: ['Customer data', 'Lookalike modeling', 'Conversion analysis'],
          action: async () => {
            console.log('Executing audience expansion...');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        },
        {
          id: 'schedule-optimization-1',
          title: 'Optimize Ad Schedule',
          description: 'Adjust ad schedule based on peak conversion times (2-6 PM weekdays)',
          type: 'scheduling',
          impact: {
            metric: 'Click-Through Rate',
            estimated_change: 31.4,
            confidence: 91
          },
          automation_ready: true,
          requires_approval: false,
          estimated_time: '3 minutes',
          risk_level: 'low',
          data_sources: ['Time-of-day analysis', 'Day-of-week patterns', 'Conversion timing'],
          action: async () => {
            console.log('Executing schedule optimization...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        },
        {
          id: 'creative-refresh-1',
          title: 'Creative Performance Enhancement',
          description: 'Replace 2 underperforming ad creatives with AI-generated variations',
          type: 'creative',
          impact: {
            metric: 'Click-Through Rate',
            estimated_change: 28.9,
            confidence: 79
          },
          automation_ready: false,
          requires_approval: true,
          estimated_time: '25 minutes',
          risk_level: 'high',
          data_sources: ['Creative performance data', 'A/B test results', 'Engagement metrics'],
          action: async () => {
            console.log('Executing creative refresh...');
            await new Promise(resolve => setTimeout(resolve, 6000));
          }
        }
      ];

      setOptimizations(actions);
    };

    generateOptimizations();
  }, [campaignData]);

  const executeOptimization = async (optimization: OptimizationAction) => {
    setExecutingActions(prev => new Set(prev).add(optimization.id));
    
    try {
      await optimization.action();
      // Show success notification
      console.log(`Successfully executed: ${optimization.title}`);
    } catch (error) {
      console.error(`Failed to execute: ${optimization.title}`, error);
    } finally {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(optimization.id);
        return newSet;
      });
    }
  };

  const analyzeNewOptimizations = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget': return DollarSign;
      case 'bidding': return Target;
      case 'targeting': return Bot;
      case 'creative': return Sparkles;
      case 'scheduling': return Clock;
      default: return Settings;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget': return 'text-green-500';
      case 'bidding': return 'text-blue-500';
      case 'targeting': return 'text-purple-500';
      case 'creative': return 'text-pink-500';
      case 'scheduling': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Campaign Optimizer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered optimization recommendations and automation
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-Optimization</span>
            <button
              onClick={() => setAutoOptimizationEnabled(!autoOptimizationEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoOptimizationEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoOptimizationEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          <button
            onClick={analyzeNewOptimizations}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', isAnalyzing && 'animate-spin')} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Optimization Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Available Actions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{optimizations.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">optimization opportunities</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Potential Impact</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+$4,200</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">estimated monthly savings</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-Ready</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {optimizations.filter(o => o.automation_ready).length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">can auto-execute</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Confidence</span>
          </div>
          <p className="text-2xl font-bold text-pink-600">
            {Math.round(optimizations.reduce((acc, o) => acc + o.impact.confidence, 0) / optimizations.length)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">average confidence</p>
        </div>
      </div>

      {/* Optimization Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommended Optimizations
        </h3>
        
        {optimizations.map((optimization, index) => {
          const TypeIcon = getTypeIcon(optimization.type);
          const isExecuting = executingActions.has(optimization.id);
          
          return (
            <motion.div
              key={optimization.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-700')}>
                      <TypeIcon className={cn('h-5 w-5', getTypeColor(optimization.type))} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {optimization.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRiskColor(optimization.risk_level))}>
                          {optimization.risk_level} risk
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {optimization.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          • Est. {optimization.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {optimization.description}
                  </p>

                  {/* Impact Prediction */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Expected Impact on {optimization.impact.metric}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {optimization.impact.estimated_change > 0 ? '+' : ''}{optimization.impact.estimated_change}%
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            confidence: {optimization.impact.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${optimization.impact.confidence}, 100`}
                            className="text-blue-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {optimization.impact.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Based on analysis of:</p>
                    <div className="flex flex-wrap gap-1">
                      {optimization.data_sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-6">
                  {optimization.automation_ready && !optimization.requires_approval && (
                    <button
                      onClick={() => executeOptimization(optimization)}
                      disabled={isExecuting}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Auto-Apply</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {optimization.requires_approval && (
                    <button
                      onClick={() => executeOptimization(optimization)}
                      disabled={isExecuting}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Apply with Approval</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {!optimization.automation_ready && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                      <Settings className="h-4 w-4" />
                      <span>Manual Setup</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartCampaignOptimizer;