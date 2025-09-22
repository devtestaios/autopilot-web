'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Settings,
  HelpCircle,
  X,
  ChevronUp,
  ChevronDown,
  Brain,
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageAI } from '@/contexts/AIContext';
import AIAssistantChat from './AIAssistantChat';

interface AIFloatingAssistantProps {
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  context?: string;
}

export default function AIFloatingAssistant({ className }: AIFloatingAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const { sendContextualMessage, insights, autoOptimization } = usePageAI(currentPage);

  // Detect current page from URL
  useEffect(() => {
    const path = window.location.pathname;
    const page = path.split('/')[1] || 'dashboard';
    setCurrentPage(page);
  }, []);

  // Generate contextual quick actions based on current page
  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'chat',
        label: 'Ask AI Assistant',
        icon: <MessageSquare className="w-4 h-4" />,
        description: 'Get help with anything',
        action: () => setShowChat(true)
      }
    ];

    switch (currentPage) {
      case 'campaigns':
        return [
          ...baseActions,
          {
            id: 'optimize-campaigns',
            label: 'Optimize Campaigns',
            icon: <Zap className="w-4 h-4" />,
            description: 'AI-powered optimization',
            action: () => sendContextualMessage("Optimize my current campaigns")
          },
          {
            id: 'budget-analysis',
            label: 'Budget Analysis',
            icon: <DollarSign className="w-4 h-4" />,
            description: 'Analyze budget allocation',
            action: () => sendContextualMessage("Analyze my campaign budgets")
          },
          {
            id: 'performance-insights',
            label: 'Performance Insights',
            icon: <TrendingUp className="w-4 h-4" />,
            description: 'Get performance recommendations',
            action: () => sendContextualMessage("Show me campaign performance insights")
          }
        ];

      case 'analytics':
        return [
          ...baseActions,
          {
            id: 'analyze-metrics',
            label: 'Analyze Metrics',
            icon: <BarChart3 className="w-4 h-4" />,
            description: 'Deep dive into analytics',
            action: () => sendContextualMessage("Analyze my current metrics and performance")
          },
          {
            id: 'trend-analysis',
            label: 'Trend Analysis',
            icon: <TrendingUp className="w-4 h-4" />,
            description: 'Identify trends and patterns',
            action: () => sendContextualMessage("What trends do you see in my data?")
          },
          {
            id: 'forecasting',
            label: 'Performance Forecast',
            icon: <Target className="w-4 h-4" />,
            description: 'Predict future performance',
            action: () => sendContextualMessage("Forecast my campaign performance")
          }
        ];

      case 'dashboard':
        return [
          ...baseActions,
          {
            id: 'overview-analysis',
            label: 'Overview Analysis',
            icon: <Brain className="w-4 h-4" />,
            description: 'Analyze overall performance',
            action: () => sendContextualMessage("Give me an overview of my marketing performance")
          },
          {
            id: 'urgent-actions',
            label: 'Urgent Actions',
            icon: <Zap className="w-4 h-4" />,
            description: 'Show critical actions needed',
            action: () => sendContextualMessage("What urgent actions do I need to take?")
          }
        ];

      default:
        return [
          ...baseActions,
          {
            id: 'page-help',
            label: 'Page Help',
            icon: <HelpCircle className="w-4 h-4" />,
            description: 'Get help with this page',
            action: () => sendContextualMessage(`Help me understand the ${currentPage} page`)
          }
        ];
    }
  };

  const quickActions = getQuickActions();
  const urgentInsights = insights.filter(insight => 
    insight.severity === 'critical' || insight.severity === 'high'
  ).length;

  if (showChat) {
    return (
      <AIAssistantChat 
        className={className}
        onToggle={(isOpen) => {
          if (!isOpen) setShowChat(false);
        }}
      />
    );
  }

  return (
    <div className={cn('fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3', 'md:right-4 right-2', className)}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-72 sm:w-72 w-64 overflow-hidden order-1"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-pulse-cyan/10 to-pulse-purple/10 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      AI Assistant
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentPage} • Ready to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-2 mt-3">
                {autoOptimization && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-xs">
                    <Zap className="w-3 h-3" />
                    Auto-Optimize ON
                  </div>
                )}
                {urgentInsights > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-xs">
                    <Brain className="w-3 h-3" />
                    {urgentInsights} Alert{urgentInsights > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-pulse-cyan/10 group-hover:text-pulse-cyan rounded-lg transition-colors">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {action.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Context-specific suggestions */}
              {currentPage === 'campaigns' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Quick Suggestions
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => sendContextualMessage("What campaigns need immediate attention?")}
                      className="w-full text-left text-xs p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400"
                    >
                      "What campaigns need attention?"
                    </button>
                    <button
                      onClick={() => sendContextualMessage("How can I improve my ROAS?")}
                      className="w-full text-left text-xs p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400"
                    >
                      "How can I improve my ROAS?"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-14 h-14 bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group order-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background pulse effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Icon */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {urgentInsights > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {urgentInsights}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}