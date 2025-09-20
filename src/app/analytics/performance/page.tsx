'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area } from 'recharts';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Mock performance data
const performanceData = [
  { date: 'Sep 01', impressions: 15420, clicks: 892, conversions: 23, spend: 1840, revenue: 4600 },
  { date: 'Sep 02', impressions: 18230, clicks: 1045, conversions: 31, spend: 2150, revenue: 6200 },
  { date: 'Sep 03', impressions: 16890, clicks: 923, conversions: 28, spend: 1950, revenue: 5600 },
  { date: 'Sep 04', impressions: 22100, clicks: 1234, conversions: 42, spend: 2480, revenue: 8400 },
  { date: 'Sep 05', impressions: 19750, clicks: 1156, conversions: 35, spend: 2320, revenue: 7000 },
  { date: 'Sep 06', impressions: 21800, clicks: 1298, conversions: 38, spend: 2600, revenue: 7600 },
  { date: 'Sep 07', impressions: 18900, clicks: 1089, conversions: 29, spend: 2180, revenue: 5800 }
];

const platformData = [
  { name: 'Google Ads', value: 42, spend: 8400, color: '#4285F4' },
  { name: 'Meta', value: 28, spend: 5600, color: '#1877F2' },
  { name: 'LinkedIn', value: 18, spend: 3600, color: '#0A66C2' },
  { name: 'TikTok', value: 12, spend: 2400, color: '#000000' }
];

const campaignPerformance = [
  { campaign: 'Holiday Sale 2025', impressions: 45200, clicks: 2890, ctr: 6.4, conversions: 127, cpa: 18.5, roas: 4.2 },
  { campaign: 'Brand Keywords', impressions: 32100, clicks: 1950, ctr: 6.1, conversions: 89, cpa: 22.1, roas: 3.8 },
  { campaign: 'Product Search', impressions: 28900, clicks: 1456, ctr: 5.0, conversions: 76, cpa: 25.3, roas: 3.2 },
  { campaign: 'Retargeting', impressions: 19500, clicks: 1234, ctr: 6.3, conversions: 95, cpa: 16.8, roas: 4.8 },
  { campaign: 'Video Campaign', impressions: 67800, clicks: 2034, ctr: 3.0, conversions: 54, cpa: 31.2, roas: 2.9 }
];

export default function PerformanceAnalyticsPage() {
  const { theme } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<'impressions' | 'clicks' | 'conversions' | 'spend' | 'revenue'>('impressions');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'impressions': return '#3B82F6';
      case 'clicks': return '#10B981';
      case 'conversions': return '#F59E0B';
      case 'spend': return '#EF4444';
      case 'revenue': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100);
  };

  const totalImpressions = performanceData.reduce((sum, day) => sum + day.impressions, 0);
  const totalClicks = performanceData.reduce((sum, day) => sum + day.clicks, 0);
  const totalConversions = performanceData.reduce((sum, day) => sum + day.conversions, 0);
  const totalSpend = performanceData.reduce((sum, day) => sum + day.spend, 0);
  const totalRevenue = performanceData.reduce((sum, day) => sum + day.revenue, 0);

  const avgCTR = (totalClicks / totalImpressions) * 100;
  const avgCPA = totalSpend / totalConversions;
  const totalROAS = totalRevenue / totalSpend;

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Performance Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Detailed performance metrics and trends analysis
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {[
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                  { id: '90d', label: '90 Days' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedTimeRange(range.id as any)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedTimeRange === range.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Impressions
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalImpressions.toLocaleString()}
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
                  <MousePointer className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+8.3%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Clicks
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalClicks.toLocaleString()}
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
                  <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+15.2%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Conversions
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalConversions}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-sm font-medium">-3.1%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Spend
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalSpend.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+22.8%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Revenue
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toLocaleString()}
              </p>
            </motion.div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Trends
                </h3>
                
                {/* Metric Selector */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {[
                    { id: 'impressions', label: 'Impressions' },
                    { id: 'clicks', label: 'Clicks' },
                    { id: 'conversions', label: 'Conversions' },
                    { id: 'spend', label: 'Spend' },
                    { id: 'revenue', label: 'Revenue' }
                  ].map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id as any)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedMetric === metric.id
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={getMetricColor(selectedMetric)}
                    fill={getMetricColor(selectedMetric)}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution & Campaign Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Spend by Platform
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Key Performance Ratios
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Click-Through Rate (CTR)
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {avgCTR.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(avgCTR * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cost per Acquisition (CPA)
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${avgCPA.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((100 - avgCPA) * 2, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Return on Ad Spend (ROAS)
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {totalROAS.toFixed(2)}x
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(totalROAS * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Performance Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Campaign Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ROAS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {campaignPerformance.map((campaign, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.campaign}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.ctr}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.conversions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.cpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.roas}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}