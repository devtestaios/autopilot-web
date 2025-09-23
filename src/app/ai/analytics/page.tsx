'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Zap, 
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  Lightbulb,
  Bot,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import EnhancedAIInsights from '@/components/EnhancedAIInsights';
import PredictiveAnalyticsDashboard from '@/components/PredictiveAnalyticsDashboard';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AIAnalyticsPage = () => {
  const { insights } = useUnifiedAI();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for AI analytics
  const aiPerformanceData = [
    { date: '2024-01-01', accuracy: 94, insights: 12, automations: 8, savings: 1200 },
    { date: '2024-01-02', accuracy: 96, insights: 15, automations: 10, savings: 1850 },
    { date: '2024-01-03', accuracy: 95, insights: 18, automations: 12, savings: 2100 },
    { date: '2024-01-04', accuracy: 97, insights: 22, automations: 15, savings: 2750 },
    { date: '2024-01-05', accuracy: 93, insights: 19, automations: 11, savings: 1950 },
    { date: '2024-01-06', accuracy: 98, insights: 25, automations: 18, savings: 3200 },
    { date: '2024-01-07', accuracy: 96, insights: 21, automations: 14, savings: 2650 }
  ];

  const insightCategoryData = [
    { name: 'Optimization', value: 35, color: '#00D9FF' },
    { name: 'Budget', value: 25, color: '#6366F1' },
    { name: 'Performance', value: 20, color: '#10B981' },
    { name: 'Targeting', value: 15, color: '#F59E0B' },
    { name: 'Creative', value: 5, color: '#EF4444' }
  ];

  const aiActionsData = [
    { category: 'Budget Optimization', actions: 45, success: 42, impact: '+$12,500' },
    { category: 'Bid Adjustments', actions: 32, success: 30, impact: '+15% CTR' },
    { category: 'Audience Targeting', actions: 28, success: 26, impact: '+22% Conv' },
    { category: 'Ad Creative Testing', actions: 19, success: 17, impact: '+8% CTR' },
    { category: 'Keyword Optimization', actions: 24, success: 22, impact: '+$8,200' }
  ];

  const topInsights = [
    {
      id: 1,
      title: 'Campaign Budget Reallocation Opportunity',
      category: 'optimization',
      severity: 'high',
      impact: '+$15,200 potential monthly savings',
      confidence: 94,
      timestamp: '2 hours ago',
      status: 'implemented'
    },
    {
      id: 2,
      title: 'Audience Segment Performance Decline',
      category: 'performance',
      severity: 'medium',
      impact: '25% decrease in conversion rate',
      confidence: 87,
      timestamp: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      title: 'New High-Performing Keywords Detected',
      category: 'optimization',
      severity: 'low',
      impact: '+12% potential traffic increase',
      confidence: 92,
      timestamp: '6 hours ago',
      status: 'reviewed'
    }
  ];

  const stats = [
    {
      label: 'AI Accuracy',
      value: '96.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target
    },
    {
      label: 'Insights Generated',
      value: '142',
      change: '+18',
      trend: 'up',
      icon: Lightbulb
    },
    {
      label: 'Automations Run',
      value: '89',
      change: '+12',
      trend: 'up',
      icon: Bot
    },
    {
      label: 'Cost Savings',
      value: '$28,450',
      change: '+$4,200',
      trend: 'up',
      icon: DollarSign
    }
  ];

  const timeframes = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-600 dark:text-green-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'reviewed': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent">
                    AI Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor AI performance and insights impact
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value}>
                      {tf.label}
                    </option>
                  ))}
                </select>
                <PremiumButton variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </PremiumButton>
                <PremiumButton>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </PremiumButton>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <PremiumCard key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <span className={cn(
                          'text-sm font-medium',
                          stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </PremiumCard>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* AI Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI Performance Trends
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aiPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#00D9FF" 
                        strokeWidth={2}
                        dot={{ fill: '#00D9FF', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Insights Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Insights by Category
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={insightCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {insightCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {insightCategoryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>
          </div>

          {/* AI Actions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Action Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Category
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions Taken
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Success Rate
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiActionsData.map((action, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {action.category}
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                          {action.actions}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-pulse-cyan to-pulse-purple h-2 rounded-full"
                                style={{ width: `${(action.success / action.actions) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.round((action.success / action.actions) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-sm font-medium text-green-600 dark:text-green-400">
                          {action.impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Recent Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent AI Insights
                </h3>
                <PremiumButton variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </PremiumButton>
              </div>
              <div className="space-y-4">
                {topInsights.map((insight) => (
                  <div key={insight.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full font-medium',
                            getSeverityColor(insight.severity)
                          )}>
                            {insight.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {insight.impact}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{insight.timestamp}</span>
                          <span className={getStatusColor(insight.status)}>
                            {insight.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {insight.status === 'implemented' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {insight.status === 'pending' && (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                        {insight.status === 'reviewed' && (
                          <AlertCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </motion.div>

          {/* Enhanced AI Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-8"
          >
            {/* Enhanced AI Insights */}
            <EnhancedAIInsights 
              performanceData={aiPerformanceData}
              showPredictions={true}
              showRecommendations={true}
              className="mt-8"
            />

            {/* Predictive Analytics Dashboard */}
            <PredictiveAnalyticsDashboard 
              timeRange={timeframe}
              className="mt-8"
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;