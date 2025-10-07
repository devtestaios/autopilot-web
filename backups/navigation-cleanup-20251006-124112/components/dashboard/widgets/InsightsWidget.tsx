'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import type { DashboardWidget } from '@/components/DashboardCustomizer';

interface InsightsWidgetProps {
  widget: DashboardWidget;
  data: any;
  isEditMode: boolean;
  onSelect: () => void;
}

export default function InsightsWidget({ widget, data, isEditMode, onSelect }: InsightsWidgetProps) {
  // Sample AI insights
  const insights = [
    {
      id: 1,
      type: 'optimization',
      title: 'Budget Reallocation Opportunity',
      description: 'Move $2,400 from LinkedIn to Google Ads for 18% ROAS improvement',
      impact: '+$1,320 revenue',
      confidence: 92,
      icon: Zap,
      color: 'blue'
    },
    {
      id: 2,
      type: 'performance',
      title: 'High-Performing Keywords Detected',
      description: '5 keywords showing 40%+ CTR increase - consider bid increases',
      impact: '+$850 potential',
      confidence: 87,
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Campaign Fatigue Warning',
      description: 'Meta campaign showing declining engagement - refresh creative',
      impact: 'Prevent -15% CTR',
      confidence: 78,
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 4,
      type: 'suggestion',
      title: 'New Audience Opportunity',
      description: 'Similar audience to top performers identified for expansion',
      impact: '+25% reach potential',
      confidence: 83,
      icon: Target,
      color: 'purple'
    }
  ];

  const getInsightColor = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800'
        };
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/20',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const filteredInsights = insights
    .filter(insight => insight.confidence >= (widget.config?.confidenceThreshold || 80))
    .slice(0, widget.config?.maxInsights || 5);

  return (
    <motion.div
      whileHover={{ scale: isEditMode ? 1 : 1.02 }}
      onClick={isEditMode ? onSelect : undefined}
      className={`h-full ${isEditMode ? 'cursor-pointer' : ''}`}
    >
      <PremiumCard className="p-6 h-full">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {widget.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered recommendations to optimize your campaigns
          </p>
        </div>
        
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const Icon = insight.icon;
            const colors = getInsightColor(insight.color);
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {insight.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {insight.impact}
                      </span>
                      
                      <PremiumButton
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${colors.text} hover:${colors.bg}`}
                      >
                        Apply
                      </PremiumButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {filteredInsights.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No insights available with current confidence threshold
            </p>
          </div>
        )}
      </PremiumCard>
    </motion.div>
  );
}