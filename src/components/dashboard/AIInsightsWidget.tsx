'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumBadge } from '@/components/ui/PremiumBadge';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'optimization' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  actionRequired: boolean;
  estimatedImprovement?: string;
  data?: {
    metric?: string;
    current?: number;
    potential?: number;
    timeframe?: string;
  };
  actions?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  tags?: string[];
  createdAt: Date;
}

interface AIInsightsWidgetProps {
  insights: AIInsight[];
  onInsightClick?: (insight: AIInsight) => void;
  onActionClick?: (insight: AIInsight, action: any) => void;
  maxVisible?: number;
  autoRotate?: boolean;
  className?: string;
}

const typeIcons = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  optimization: Zap,
  trend: TrendingDown
};

const typeColors = {
  opportunity: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  optimization: 'text-blue-600 dark:text-blue-400',
  trend: 'text-purple-600 dark:text-purple-400'
};

const typeBgColors = {
  opportunity: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  optimization: 'bg-blue-100 dark:bg-blue-900/30',
  trend: 'bg-purple-100 dark:bg-purple-900/30'
};

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

const impactColors = {
  low: 'text-gray-600 dark:text-gray-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-green-600 dark:text-green-400'
};

export function AIInsightsWidget({
  insights,
  onInsightClick,
  onActionClick,
  maxVisible = 3,
  autoRotate = false,
  className = ''
}: AIInsightsWidgetProps) {
  const [visibleInsights, setVisibleInsights] = useState(insights.slice(0, maxVisible));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVisibleInsights(insights.slice(0, maxVisible));
  }, [insights, maxVisible]);

  useEffect(() => {
    if (!autoRotate || insights.length <= maxVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % Math.ceil(insights.length / maxVisible);
        const start = next * maxVisible;
        const end = start + maxVisible;
        setVisibleInsights(insights.slice(start, end));
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, insights.length, maxVisible]);

  const formatConfidence = (confidence: number) => {
    return `${confidence}% confidence`;
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <PremiumCard variant="glassmorphism" className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
          <PremiumBadge variant="info" className="text-xs">
            {insights.length} insights
          </PremiumBadge>
        </div>

        <div className="flex items-center space-x-2">
          {insights.length > maxVisible && (
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(insights.length / maxVisible) }).map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => {
                    setCurrentIndex(i);
                    const start = i * maxVisible;
                    const end = start + maxVisible;
                    setVisibleInsights(insights.slice(start, end));
                  }}
                />
              ))}
            </div>
          )}

          <PremiumButton size="sm" variant="ghost">
            <Eye className="w-4 h-4" />
          </PremiumButton>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {visibleInsights.map((insight, index) => {
            const TypeIcon = typeIcons[insight.type];
            
            return (
              <motion.div
                key={`${insight.id}-${currentIndex}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => onInsightClick?.(insight)}
              >
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${typeBgColors[insight.type]} flex-shrink-0`}>
                      <TypeIcon className={`w-4 h-4 ${typeColors[insight.type]}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {insight.title}
                        </h4>
                        
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <PremiumBadge
                            variant="info"
                            className={`text-xs ${priorityColors[insight.priority]}`}
                          >
                            {insight.priority}
                          </PremiumBadge>
                          
                          {insight.actionRequired && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {insight.description}
                      </p>

                      {/* Metrics */}
                      {insight.data && (
                        <div className="flex items-center space-x-4 mb-3 text-xs">
                          {insight.data.current !== undefined && insight.data.potential !== undefined && (
                            <div className="flex items-center space-x-1">
                              <Target className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                Current: {insight.data.current}
                              </span>
                              <ArrowRight className="w-3 h-3 text-gray-500" />
                              <span className={impactColors[insight.impact]}>
                                Potential: {insight.data.potential}
                              </span>
                            </div>
                          )}
                          
                          {insight.estimatedImprovement && (
                            <div className={`font-medium ${impactColors[insight.impact]}`}>
                              {insight.estimatedImprovement}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {insight.tags && insight.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          {insight.tags.slice(0, 3).map((tag, i) => (
                            <PremiumBadge key={i} variant="default" className="text-xs">
                              {tag}
                            </PremiumBadge>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3" />
                          <span>{formatConfidence(insight.confidence)}</span>
                          <span>•</span>
                          <span>{getTimeSince(insight.createdAt)}</span>
                        </div>

                        {/* Actions */}
                        {insight.actions && insight.actions.length > 0 && (
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {insight.actions.slice(0, 2).map((action, i) => (
                              <PremiumButton
                                key={i}
                                size="sm"
                                variant={action.variant || 'secondary'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onActionClick?.(insight, action);
                                  action.action();
                                }}
                              >
                                {action.label}
                              </PremiumButton>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {insights.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No insights available at the moment.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Our AI is analyzing your campaigns...
          </p>
        </div>
      )}
    </PremiumCard>
  );
}

export default AIInsightsWidget;