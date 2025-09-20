'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Target,
  Brain,
  DollarSign,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Types for AI optimization
interface OptimizationRecommendation {
  id: string;
  type: 'budget' | 'bidding' | 'keywords' | 'audience' | 'creative' | 'scheduling';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  estimatedImprovement: {
    metric: string;
    value: number;
    direction: 'increase' | 'decrease';
  };
  campaignId?: string;
  campaignName?: string;
  status: 'pending' | 'applied' | 'rejected' | 'testing';
  createdAt: string;
}

interface OptimizationMetrics {
  totalRecommendations: number;
  appliedRecommendations: number;
  averageImprovement: number;
  estimatedSavings: number;
  performanceBoost: number;
  optimizationScore: number;
}

// Mock data for AI optimization
const mockRecommendations: OptimizationRecommendation[] = [
  {
    id: '1',
    type: 'budget',
    title: 'Increase Budget for High-Performing Campaign',
    description: 'Campaign "Holiday Sale 2025" is limited by budget and showing strong ROAS of 4.2x. Increasing budget by 25% could generate additional $2,400 in revenue.',
    impact: 'high',
    confidence: 92,
    estimatedImprovement: {
      metric: 'Revenue',
      value: 18,
      direction: 'increase'
    },
    campaignId: 'camp_1',
    campaignName: 'Holiday Sale 2025',
    status: 'pending',
    createdAt: '2025-09-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'bidding',
    title: 'Switch to Target CPA Bidding',
    description: 'Manual CPC bidding is underperforming. Switch to Target CPA at $45 based on historical conversion data to improve efficiency.',
    impact: 'high',
    confidence: 88,
    estimatedImprovement: {
      metric: 'Cost per Acquisition',
      value: 23,
      direction: 'decrease'
    },
    campaignId: 'camp_2',
    campaignName: 'Brand Keywords',
    status: 'pending',
    createdAt: '2025-09-20T09:15:00Z'
  },
  {
    id: '3',
    type: 'keywords',
    title: 'Add Negative Keywords',
    description: 'Detected irrelevant search terms causing low CTR. Adding 12 negative keywords could improve CTR by 15% and reduce wasted spend.',
    impact: 'medium',
    confidence: 76,
    estimatedImprovement: {
      metric: 'Click-through Rate',
      value: 15,
      direction: 'increase'
    },
    campaignId: 'camp_3',
    campaignName: 'Product Search',
    status: 'applied',
    createdAt: '2025-09-19T16:45:00Z'
  },
  {
    id: '4',
    type: 'scheduling',
    title: 'Optimize Ad Schedule',
    description: 'Performance data shows 40% higher conversion rates between 2-6 PM on weekdays. Increase bids during these hours.',
    impact: 'medium',
    confidence: 84,
    estimatedImprovement: {
      metric: 'Conversion Rate',
      value: 12,
      direction: 'increase'
    },
    campaignId: 'camp_1',
    campaignName: 'Holiday Sale 2025',
    status: 'testing',
    createdAt: '2025-09-19T14:20:00Z'
  },
  {
    id: '5',
    type: 'audience',
    title: 'Expand Lookalike Audience',
    description: 'Current lookalike audience is too narrow. Expanding to 3% similarity could increase reach by 180% while maintaining quality.',
    impact: 'low',
    confidence: 68,
    estimatedImprovement: {
      metric: 'Reach',
      value: 180,
      direction: 'increase'
    },
    campaignId: 'camp_4',
    campaignName: 'Retargeting Campaign',
    status: 'pending',
    createdAt: '2025-09-19T11:00:00Z'
  }
];

const mockMetrics: OptimizationMetrics = {
  totalRecommendations: 23,
  appliedRecommendations: 15,
  averageImprovement: 24.5,
  estimatedSavings: 8400,
  performanceBoost: 31.2,
  optimizationScore: 87
};

export default function OptimizationPage() {
  const { theme } = useTheme();
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>(mockRecommendations);
  const [metrics, setMetrics] = useState<OptimizationMetrics>(mockMetrics);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'applied' | 'testing'>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'applied': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'testing': return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget': return <DollarSign className="w-5 h-5" />;
      case 'bidding': return <Target className="w-5 h-5" />;
      case 'keywords': return <Eye className="w-5 h-5" />;
      case 'audience': return <Users className="w-5 h-5" />;
      case 'creative': return <Lightbulb className="w-5 h-5" />;
      case 'scheduling': return <BarChart3 className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const filteredRecommendations = selectedFilter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.status === selectedFilter);

  const applyRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, status: 'applied' } : rec
    ));
  };

  const rejectRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, status: 'rejected' } : rec
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
      }`}>
        <NavigationTabs />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Optimizer
                </h1>
                <span className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800">
                  Beta
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered campaign optimization recommendations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh Analysis
              </button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics.optimizationScore}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Optimization Score
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400">
                +5 points this week
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  +{metrics.averageImprovement}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Avg. Improvement
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400">
                From applied recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${metrics.estimatedSavings.toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Estimated Savings
              </h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                From pending recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {metrics.appliedRecommendations}/{metrics.totalRecommendations}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Applied
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Recommendations this month
              </p>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { id: 'all', label: 'All Recommendations' },
              { id: 'pending', label: 'Pending' },
              { id: 'applied', label: 'Applied' },
              { id: 'testing', label: 'Testing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFilter === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getTypeIcon(recommendation.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {recommendation.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(recommendation.impact)}`}>
                              {recommendation.impact} impact
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(recommendation.status)}`}>
                              {recommendation.status}
                            </span>
                          </div>
                          
                          {recommendation.campaignName && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                              Campaign: {recommendation.campaignName}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
                            {recommendation.estimatedImprovement.direction === 'increase' ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-green-600" />
                            )}
                            {recommendation.estimatedImprovement.value}%
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {recommendation.estimatedImprovement.metric}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {recommendation.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Confidence: </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {recommendation.confidence}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Type: </span>
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {recommendation.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Created: </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(recommendation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {recommendation.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => rejectRecommendation(recommendation.id)}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => applyRecommendation(recommendation.id)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recommendations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFilter === 'all' 
                  ? 'AI is analyzing your campaigns. Check back soon for optimization suggestions.'
                  : `No ${selectedFilter} recommendations at the moment.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}