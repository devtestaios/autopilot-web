'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// SSR-safe imports using social-media pattern
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

const MasterTerminalBreadcrumb = dynamic(() => import('@/components/MasterTerminalBreadcrumb'), {
  ssr: false,
  loading: () => <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

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
  { name: 'Marketing', value: 35, color: '#3B82F6', growth: 12.3 },
  { name: 'Sales', value: 28, color: '#10B981', growth: 8.7 },
  { name: 'Product', value: 20, color: '#F59E0B', growth: -2.1 },
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
    change: 7.2,
    trend: 'up' as const,
    target: '10,000',
    progress: 84,
    icon: <Users className="w-5 h-5" />,
    color: 'blue'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.24%',
    change: -0.8,
    trend: 'down' as const,
    target: '3.5%',
    progress: 93,
    icon: <Target className="w-5 h-5" />,
    color: 'purple'
  },
  {
    id: 'efficiency',
    title: 'Operational Efficiency',
    value: '94.7%',
    change: 2.1,
    trend: 'up' as const,
    target: '95%',
    progress: 99,
    icon: <Activity className="w-5 h-5" />,
    color: 'orange'
  }
];

const generateInsights = () => [
  {
    id: 1,
    type: 'opportunity',
    title: 'Revenue Growth Opportunity',
    description: 'Marketing campaigns showing 15% higher ROI than historical average. Consider increasing budget allocation.',
    impact: 'High',
    urgency: 'Medium',
    category: 'Revenue'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Conversion Rate Decline',
    description: 'Website conversion rate has decreased by 0.8% this week. Check landing page performance.',
    impact: 'Medium',
    urgency: 'High',
    category: 'Performance'
  },
  {
    id: 3,
    type: 'success',
    title: 'User Engagement Peak',
    description: 'Daily active users reached all-time high with 25% increase in session duration.',
    impact: 'High',
    urgency: 'Low',
    category: 'Engagement'
  },
  {
    id: 4,
    type: 'trend',
    title: 'Seasonal Pattern Identified',
    description: 'Revenue shows consistent 20% uplift during weekends. Optimize weekend campaigns.',
    impact: 'Medium',
    urgency: 'Medium',
    category: 'Trends'
  }
];

// MAIN BUSINESS INTELLIGENCE DASHBOARD
// ============================================================================

export default function BusinessIntelligencePlatform() {
  // Sidebar state management for unified layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Advanced Navigation */}
      <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
      
      {/* Main Content with dynamic margins */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      } pt-16`}>
        {/* Master Terminal Breadcrumb */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-6 py-4">
            <MasterTerminalBreadcrumb />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Business Intelligence Content */}
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
                      AI-powered insights and analytics dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Time Range Selector */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {['7d', '30d', '90d'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedTimeRange(range)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedTimeRange === range
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {range.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi) => (
                <motion.div
                  key={kpi.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      kpi.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      kpi.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                      kpi.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
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
                        {Math.abs(kpi.change)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {kpi.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Target: {kpi.target}</span>
                      <span>{kpi.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          kpi.color === 'green' ? 'bg-green-500' :
                          kpi.color === 'blue' ? 'bg-blue-500' :
                          kpi.color === 'purple' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${kpi.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Time Series Chart */}
              <motion.div
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Revenue Trends
                  </h3>
                  <div className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="revenue">Revenue</option>
                      <option value="users">Users</option>
                      <option value="conversion">Conversion</option>
                    </select>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Interactive Chart Coming Soon</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {timeSeriesData.length} data points loaded
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Category Breakdown
                  </h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {category.value}%
                        </div>
                        <div className={`text-xs ${
                          category.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {category.growth > 0 ? '+' : ''}{category.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Powered Insights
                  </h3>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {insight.title}
                          </h4>
                          <div className="flex space-x-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              insight.impact === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                              insight.impact === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            }`}>
                              {insight.impact}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {insight.category}
                          </span>
                          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            Take Action
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    icon: <BarChart3 className="w-6 h-6" />, 
                    label: 'Generate Report',
                    color: 'blue'
                  },
                  { 
                    icon: <Calendar className="w-6 h-6" />, 
                    label: 'Schedule Analysis',
                    color: 'green'
                  },
                  { 
                    icon: <Target className="w-6 h-6" />, 
                    label: 'Set Goals',
                    color: 'purple'
                  },
                  { 
                    icon: <Brain className="w-6 h-6" />, 
                    label: 'AI Recommendations',
                    color: 'orange'
                  }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:shadow-md ${
                      action.color === 'blue' ? 'border-blue-300 dark:border-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' :
                      action.color === 'green' ? 'border-green-300 dark:border-green-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' :
                      action.color === 'purple' ? 'border-purple-300 dark:border-purple-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20' :
                      'border-orange-300 dark:border-orange-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    }`}
                  >
                    <div className={`flex flex-col items-center space-y-2 ${
                      action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      action.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
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
      
      {/* AI Control Chat - Fixed positioning outside content flow */}
      <AIControlChat />
    </div>
  );
}