'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictiveInsight {
  id: string;
  type: 'performance_forecast' | 'budget_optimization' | 'audience_expansion' | 'seasonal_trend' | 'competitive_alert';
  title: string;
  description: string;
  prediction: {
    metric: string;
    current_value: number;
    predicted_value: number;
    confidence: number; // 0-100
    timeframe: string;
    change_percentage: number;
  };
  recommendations: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'easy' | 'moderate' | 'complex';
    expected_improvement: string;
  }[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'budget' | 'targeting' | 'creative' | 'timing';
  timestamp: Date;
  auto_actionable: boolean;
}

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'budget_reallocation' | 'bid_adjustment' | 'audience_optimization' | 'ad_creative' | 'timing';
  impact_score: number; // 1-10
  confidence: number; // 0-100
  estimated_improvement: {
    metric: string;
    percentage: number;
    value: number;
  };
  actions: {
    label: string;
    action: () => Promise<void>;
    approval_required: boolean;
  }[];
  data_source: string[];
  created_at: Date;
}

interface EnhancedAIInsightsProps {
  campaignData?: any;
  performanceData?: any;
  className?: string;
  showPredictions?: boolean;
  showRecommendations?: boolean;
  autoExecute?: boolean;
}

const EnhancedAIInsights: React.FC<EnhancedAIInsightsProps> = ({
  campaignData,
  performanceData,
  className,
  showPredictions = true,
  showRecommendations = true,
  autoExecute = false
}) => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['predictions']));

  // Generate predictive insights based on performance data
  const generatePredictiveInsights = useMemo(() => {
    if (!performanceData) return [];

    const insights: PredictiveInsight[] = [
      {
        id: 'performance-forecast-1',
        type: 'performance_forecast',
        title: 'Campaign Performance Trajectory',
        description: 'Based on current trends, your campaign performance will continue to improve',
        prediction: {
          metric: 'Conversion Rate',
          current_value: 3.2,
          predicted_value: 4.1,
          confidence: 87,
          timeframe: 'Next 14 days',
          change_percentage: 28.1
        },
        recommendations: [
          {
            action: 'Increase budget for top-performing ad groups by 25%',
            impact: 'high',
            effort: 'easy',
            expected_improvement: '+18% more conversions'
          },
          {
            action: 'Expand audience targeting to similar demographics',
            impact: 'medium',
            effort: 'moderate',
            expected_improvement: '+12% reach expansion'
          }
        ],
        priority: 'high',
        category: 'performance',
        timestamp: new Date(),
        auto_actionable: true
      },
      {
        id: 'budget-optimization-1',
        type: 'budget_optimization',
        title: 'Budget Reallocation Opportunity',
        description: 'AI detected inefficient budget distribution across campaigns',
        prediction: {
          metric: 'Cost per Acquisition',
          current_value: 45.67,
          predicted_value: 32.89,
          confidence: 92,
          timeframe: 'Immediate',
          change_percentage: -28.0
        },
        recommendations: [
          {
            action: 'Reallocate $2,500 from Campaign B to Campaign A',
            impact: 'high',
            effort: 'easy',
            expected_improvement: '28% CPA reduction'
          },
          {
            action: 'Pause underperforming keywords in Campaign C',
            impact: 'medium',
            effort: 'easy',
            expected_improvement: '15% waste reduction'
          }
        ],
        priority: 'critical',
        category: 'budget',
        timestamp: new Date(),
        auto_actionable: true
      },
      {
        id: 'seasonal-trend-1',
        type: 'seasonal_trend',
        title: 'Seasonal Performance Pattern Detected',
        description: 'Historical data indicates 35% performance increase during upcoming period',
        prediction: {
          metric: 'Click-Through Rate',
          current_value: 2.4,
          predicted_value: 3.2,
          confidence: 78,
          timeframe: 'Next 7 days',
          change_percentage: 33.3
        },
        recommendations: [
          {
            action: 'Increase daily budgets by 40% for optimal capture',
            impact: 'high',
            effort: 'easy',
            expected_improvement: '+45% impression share'
          },
          {
            action: 'Launch seasonal ad variations',
            impact: 'medium',
            effort: 'moderate',
            expected_improvement: '+22% engagement'
          }
        ],
        priority: 'high',
        category: 'timing',
        timestamp: new Date(),
        auto_actionable: false
      }
    ];

    return insights;
  }, [performanceData]);

  // Generate smart recommendations
  const generateSmartRecommendations = useMemo(() => {
    const recommendations: SmartRecommendation[] = [
      {
        id: 'rec-1',
        title: 'Optimize Ad Schedule for Peak Performance',
        description: 'AI analysis shows 67% better conversion rates between 2-6 PM on weekdays',
        type: 'timing',
        impact_score: 8.5,
        confidence: 94,
        estimated_improvement: {
          metric: 'Conversion Rate',
          percentage: 23,
          value: 1.2
        },
        actions: [
          {
            label: 'Apply Recommended Schedule',
            action: async () => {
              // Implementation for schedule optimization
              console.log('Applying optimized ad schedule...');
            },
            approval_required: false
          },
          {
            label: 'Test Schedule Gradually',
            action: async () => {
              // Implementation for gradual testing
              console.log('Starting gradual schedule test...');
            },
            approval_required: true
          }
        ],
        data_source: ['Historical Performance', 'Time-of-Day Analysis', 'Conversion Patterns'],
        created_at: new Date()
      },
      {
        id: 'rec-2',
        title: 'Audience Expansion Strategy',
        description: 'Identified high-value lookalike audiences with 78% similarity to your best converters',
        type: 'audience_optimization',
        impact_score: 9.2,
        confidence: 89,
        estimated_improvement: {
          metric: 'Reach',
          percentage: 156,
          value: 45000
        },
        actions: [
          {
            label: 'Create Lookalike Audiences',
            action: async () => {
              console.log('Creating lookalike audiences...');
            },
            approval_required: false
          },
          {
            label: 'Launch Test Campaign',
            action: async () => {
              console.log('Launching test campaign...');
            },
            approval_required: true
          }
        ],
        data_source: ['Customer Data', 'Conversion Tracking', 'Behavioral Analysis'],
        created_at: new Date()
      }
    ];

    return recommendations;
  }, [campaignData]);

  useEffect(() => {
    setInsights(generatePredictiveInsights);
    setRecommendations(generateSmartRecommendations);
  }, [generatePredictiveInsights, generateSmartRecommendations]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enhanced AI Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Predictive analytics and smart recommendations powered by AI
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Active</span>
          </div>
        </div>
      </div>

      {/* Predictive Insights Section */}
      {showPredictions && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => toggleSection('predictions')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Predictive Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insights.length} AI-powered predictions available
                </p>
              </div>
            </div>
            {expandedSections.has('predictions') ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has('predictions') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 space-y-4">
                  {insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(insight.priority))}>
                              {insight.priority}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {insight.category}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {insight.description}
                          </p>

                          {/* Prediction Details */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {insight.prediction.current_value}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Predicted</p>
                                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                  {insight.prediction.predicted_value}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Change</p>
                                <div className="flex items-center space-x-1">
                                  {insight.prediction.change_percentage > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className={cn(
                                    'text-lg font-semibold',
                                    insight.prediction.change_percentage > 0 ? 'text-green-600' : 'text-red-600'
                                  )}>
                                    {insight.prediction.change_percentage > 0 ? '+' : ''}{insight.prediction.change_percentage}%
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                                <div className="flex items-center space-x-2">
                                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                      style={{ width: `${insight.prediction.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {insight.prediction.confidence}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Recommended Actions:
                            </h5>
                            {insight.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white mb-1">
                                    {rec.action}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs">
                                    <span className={cn('font-medium', getImpactColor(rec.impact))}>
                                      {rec.impact} impact
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      {rec.effort} effort
                                    </span>
                                    <span className="text-purple-600 dark:text-purple-400">
                                      {rec.expected_improvement}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {insight.auto_actionable && (
                          <button className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium">
                            Auto-Apply
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Smart Recommendations Section */}
      {showRecommendations && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Smart Recommendations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recommendations.length} AI-generated optimization suggestions
                </p>
              </div>
            </div>
            {expandedSections.has('recommendations') ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has('recommendations') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 space-y-4">
                  {recommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-pink-300 dark:hover:border-pink-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Impact Score:
                              </span>
                              <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                                {rec.impact_score}/10
                              </span>
                            </div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Confidence:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {rec.confidence}%
                              </span>
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {rec.description}
                          </p>

                          {/* Expected Improvement */}
                          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-4">
                              <Target className="h-5 w-5 text-pink-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Expected Improvement in {rec.estimated_improvement.metric}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                                    +{rec.estimated_improvement.percentage}%
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    ({rec.estimated_improvement.value.toLocaleString()})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-3">
                            {rec.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className={cn(
                                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                  action.approval_required
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                                )}
                              >
                                {action.label}
                                {action.approval_required && (
                                  <Info className="inline-block w-3 h-3 ml-1" />
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Data Sources */}
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Based on analysis of:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.data_source.map((source, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EnhancedAIInsights;