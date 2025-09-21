'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ExternalLink,
  Zap,
  Target,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  actionable: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
  timestamp: Date;
}

interface AIInsightsProps {
  page: string;
  data?: any;
  className?: string;
  compact?: boolean;
  maxInsights?: number;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800'
  },
  medium: {
    icon: Lightbulb,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  low: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800'
  }
};

const categoryIcons = {
  performance: TrendingUp,
  budget: DollarSign,
  optimization: Zap,
  analytics: BarChart3,
  targeting: Target,
  general: Lightbulb
};

export default function AIInsights({ 
  page, 
  data, 
  className, 
  compact = false, 
  maxInsights = 5 
}: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate mock insights when component mounts - safer approach
  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Generate mock insights based on page
        const mockInsights = generateMockInsights(page, data);
        setInsights(mockInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
        setError('Unable to load AI insights');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, [page, data]);

  // Generate mock insights function
  const generateMockInsights = (page: string, data?: any): AIInsight[] => {
    const baseInsights = [
      {
        id: '1',
        title: 'Campaign Performance Optimization',
        description: 'Your Google Ads campaign could benefit from keyword refinement',
        severity: 'medium' as const,
        category: 'optimization',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '2', 
        title: 'Budget Allocation Improvement',
        description: 'Consider redistributing 15% of budget to higher-performing campaigns',
        severity: 'high' as const,
        category: 'budget',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: '3',
        title: 'Performance Trending Up',
        description: 'Your campaigns show 23% improvement over last week',
        severity: 'low' as const,
        category: 'performance',
        actionable: false,
        timestamp: new Date()
      }
    ];

    // Customize based on page
    if (page === 'dashboard') {
      return baseInsights;
    } else if (page === 'campaigns') {
      return baseInsights.filter(insight => insight.category === 'optimization');
    } else if (page === 'analytics') {
      return baseInsights.filter(insight => insight.category === 'performance');
    }

    return baseInsights.slice(0, 2);
  };

  const dismissInsight = (insightId: string) => {
    setDismissedInsights(prev => [...prev, insightId]);
  };

  const activeInsights = insights
    .filter(insight => !dismissedInsights.includes(insight.id))
    .slice(0, maxInsights);

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-pulse-cyan/10 to-pulse-purple/10 rounded-lg border border-pulse-cyan/20">
            <Brain className="w-4 h-4 text-pulse-cyan animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI analyzing...
            </span>
          </div>
        )}
        
        {activeInsights.map((insight) => {
          const config = severityConfig[insight.severity];
          const CategoryIcon = categoryIcons[insight.category as keyof typeof categoryIcons] || Lightbulb;
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                config.bg,
                config.border
              )}
            >
              <CategoryIcon className={cn('w-4 h-4 flex-shrink-0', config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {insight.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {insight.description}
                </p>
              </div>
              {insight.actionable && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Insights
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {page} • {activeInsights.length} insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-pulse-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">
                AI analyzing your data...
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {activeInsights.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No insights available yet. AI is learning from your data.
              </p>
            </motion.div>
          )}

          {activeInsights.map((insight, index) => {
            const config = severityConfig[insight.severity];
            const CategoryIcon = categoryIcons[insight.category as keyof typeof categoryIcons] || Lightbulb;
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border mb-3 last:mb-0',
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <CategoryIcon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.color)} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissInsight(insight.id)}
                        className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Insight Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="capitalize">{insight.severity} priority</span>
                      <span>•</span>
                      <span className="capitalize">{insight.category}</span>
                      <span>•</span>
                      <span>{insight.timestamp.toLocaleTimeString()}</span>
                    </div>

                    {/* Actions */}
                    {insight.actionable && insight.actions && (
                      <div className="flex flex-wrap gap-2">
                        {insight.actions.map((action: { label: string; action: () => void }, actionIndex: number) => (
                          <button
                            key={actionIndex}
                            onClick={action.action}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            {action.label}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Quick Actions */}
        {activeInsights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Quick Actions
              </span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-pulse-cyan/10 text-pulse-cyan border border-pulse-cyan/20 rounded-md hover:bg-pulse-cyan/20 transition-colors">
                  <Zap className="w-3 h-3" />
                  Auto-Fix All
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <BarChart3 className="w-3 h-3" />
                  Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}