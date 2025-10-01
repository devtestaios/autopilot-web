'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart,
  Activity,
  DollarSign,
  Users,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown
} from 'lucide-react';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateTimeSeriesData = (days: number = 30) => {
  const data = [];
  const baseValue = 100;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue + Math.random() * 50 + Math.sin(i / 5) * 20),
      revenue: Math.floor(5000 + Math.random() * 2000 + Math.sin(i / 3) * 1000),
      users: Math.floor(250 + Math.random() * 100 + Math.cos(i / 4) * 50),
      conversion: (2.5 + Math.random() * 1.5 + Math.sin(i / 6) * 0.5).toFixed(2)
    });
  }
  
  return data;
};

const generateCategoryData = () => [
  { name: 'Marketing', value: 35, color: '#3B82F6', growth: 12.5 },
  { name: 'Sales', value: 28, color: '#10B981', growth: 8.3 },
  { name: 'Development', value: 20, color: '#F59E0B', growth: -2.1 },
  { name: 'Support', value: 12, color: '#EF4444', growth: 5.7 },
  { name: 'Other', value: 5, color: '#8B5CF6', growth: 0.8 }
];

const generateKPIData = () => [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$124,580',
    change: 12.5,
    trend: 'up' as const,
    target: '$150,000',
    progress: 83,
    icon: <DollarSign className="w-5 h-5" />,
    color: 'green'
  },
  {
    id: 'users',
    title: 'Active Users',
    value: '8,429',
    change: -2.3,
    trend: 'down' as const,
    target: '10,000',
    progress: 84,
    icon: <Users className="w-5 h-5" />,
    color: 'blue'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.2%',
    change: 0.8,
    trend: 'up' as const,
    target: '4.0%',
    progress: 80,
    icon: <Target className="w-5 h-5" />,
    color: 'purple'
  },
  {
    id: 'satisfaction',
    title: 'Customer Satisfaction',
    value: '4.7/5',
    change: 0.0,
    trend: 'neutral' as const,
    target: '4.8/5',
    progress: 98,
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'yellow'
  }
];

const generateInsights = () => [
  {
    id: 'insight_1',
    type: 'opportunity' as const,
    title: 'Marketing Campaign Performance',
    description: 'Social media campaigns are showing 34% higher engagement than email campaigns this month.',
    impact: 'high' as const,
    confidence: 92,
    recommendation: 'Consider reallocating 15% of email marketing budget to social media campaigns.',
    timeframe: 'Next 2 weeks'
  },
  {
    id: 'insight_2',
    type: 'warning' as const,
    title: 'User Retention Decline',
    description: 'New user retention has dropped 8% compared to last month, particularly in the 18-25 age group.',
    impact: 'medium' as const,
    confidence: 87,
    recommendation: 'Implement targeted onboarding improvements and personalized content for younger users.',
    timeframe: 'Within 1 week'
  },
  {
    id: 'insight_3',
    type: 'success' as const,
    title: 'Product Feature Adoption',
    description: 'The new dashboard feature has achieved 76% adoption rate among active users, exceeding our 60% target.',
    impact: 'high' as const,
    confidence: 96,
    recommendation: 'Document success factors and apply similar strategies to upcoming feature releases.',
    timeframe: 'Ongoing'
  },
  {
    id: 'insight_4',
    type: 'trend' as const,
    title: 'Seasonal Usage Pattern',
    description: 'Platform usage shows consistent 15% increase during weekends, suggesting personal project usage growth.',
    impact: 'medium' as const,
    confidence: 89,
    recommendation: 'Optimize weekend server capacity and consider weekend-specific feature promotions.',
    timeframe: 'Next month'
  }
];

// ============================================================================
// MINI CHART COMPONENTS
// ============================================================================

function MiniLineChart({ data, color = '#3B82F6' }: { data: any[]; color?: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-24 h-12">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
        />
      </svg>
    </div>
  );
}

function MiniBarChart({ data, color = '#3B82F6' }: { data: any[]; color?: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end space-x-1 w-24 h-12">
      {data.slice(-8).map((d, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{
            height: `${(d.value / maxValue) * 100}%`,
            backgroundColor: color,
            opacity: 0.7 + (i / 8) * 0.3
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN BUSINESS INTELLIGENCE DASHBOARD
// ============================================================================

export default function BusinessIntelligencePlatform() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showFilters, setShowFilters] = useState(false);

  // Generate mock data
  const timeSeriesData = useMemo(() => generateTimeSeriesData(
    selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90
  ), [selectedTimeRange]);
  
  const categoryData = generateCategoryData();
  const kpiData = generateKPIData();
  const insights = generateInsights();

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Business Intelligence
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Advanced analytics and AI-powered insights for data-driven decisions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  kpi.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  kpi.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  kpi.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {kpi.icon}
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                    kpi.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {kpi.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Target: {kpi.target}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{kpi.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      kpi.color === 'green' ? 'bg-green-500' :
                      kpi.color === 'blue' ? 'bg-blue-500' :
                      kpi.color === 'purple' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${kpi.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <MiniLineChart 
                  data={timeSeriesData.slice(-7)} 
                  color={
                    kpi.color === 'green' ? '#10B981' :
                    kpi.color === 'blue' ? '#3B82F6' :
                    kpi.color === 'purple' ? '#8B5CF6' :
                    '#F59E0B'
                  }
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Performance Trends
                  </h3>
                </div>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="users">Users</option>
                  <option value="conversion">Conversion Rate</option>
                </select>
              </div>

              {/* Chart Placeholder - In a real app, you'd use a charting library */}
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Interactive chart would be rendered here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Showing {timeSeriesData.length} data points for {selectedMetric}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Category Distribution
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.value}%
                        </div>
                        <div className={`text-xs flex items-center space-x-1 ${
                          category.growth > 0 ? 'text-green-600 dark:text-green-400' : 
                          category.growth < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {getTrendIcon(category.growth > 0 ? 'up' : category.growth < 0 ? 'down' : 'neutral')}
                          <span>{category.growth > 0 ? '+' : ''}{category.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-purple-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Insights
                </h3>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                  {insights.length} active
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'opportunity' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500' :
                      insight.type === 'warning' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' :
                      insight.type === 'success' ? 'bg-green-50 dark:bg-green-950/20 border-green-500' :
                      'bg-purple-50 dark:bg-purple-950/20 border-purple-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {insight.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            insight.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {insight.impact}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-500">Confidence</span>
                            <span className="font-medium text-gray-900 dark:text-white">{insight.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Recommendation:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {insight.recommendation}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {insight.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Generate Report', icon: <BarChart3 className="w-4 h-4" />, color: 'blue' },
                  { label: 'Schedule Analysis', icon: <Calendar className="w-4 h-4" />, color: 'green' },
                  { label: 'Set Alert', icon: <AlertCircle className="w-4 h-4" />, color: 'yellow' },
                  { label: 'Export Data', icon: <Download className="w-4 h-4" />, color: 'purple' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      action.color === 'blue' ? 'hover:bg-blue-50 dark:hover:bg-blue-950/20' :
                      action.color === 'green' ? 'hover:bg-green-50 dark:hover:bg-green-950/20' :
                      action.color === 'yellow' ? 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20' :
                      'hover:bg-purple-50 dark:hover:bg-purple-950/20'
                    }`}
                  >
                    <div className={`p-2 rounded ${
                      action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      action.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      action.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    }`}>
                      {action.icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}