'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, MousePointer } from 'lucide-react';
import { useAsyncOperation } from '@/hooks/useErrorHandler';
import { AsyncContent } from '@/components/ui/AsyncContent';
import { fetchAnalyticsPerformance } from '@/lib/api';
import AIInsights from '@/components/AIInsights';
import type { AnalyticsPerformanceResponse } from '@/types';

export default function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const { data, error, isLoading, execute } = useAsyncOperation<AnalyticsPerformanceResponse | null>(
    async () => {
      const timeRangeObj = { start: timeRange, end: timeRange };
      const result = await fetchAnalyticsPerformance(timeRangeObj);
      return result;
    },
    [timeRange]
  );

  useEffect(() => {
    execute();
  }, [timeRange, execute]);

  // Mock data for demonstration (replace with real API data)
  const performanceData = data || {
    overview: {
      totalImpressions: 2847593,
      totalClicks: 58472,
      totalConversions: 1243,
      totalSpend: 45672.34,
      avgCtr: 2.05,
      avgCpc: 0.78,
      avgCpa: 36.74,
      roas: 4.2
    },
    dailyMetrics: [
      { date: '2025-09-01', impressions: 95847, clicks: 1924, conversions: 42, spend: 1542.67, ctr: 2.01, cpc: 0.80, cpa: 36.73, roas: 4.1 },
      { date: '2025-09-02', impressions: 98234, clicks: 2156, conversions: 48, spend: 1687.32, ctr: 2.19, cpc: 0.78, cpa: 35.15, roas: 4.3 },
      { date: '2025-09-03', impressions: 102456, clicks: 2089, conversions: 45, spend: 1634.21, ctr: 2.04, cpc: 0.78, cpa: 36.32, roas: 4.2 },
      { date: '2025-09-04', impressions: 89765, clicks: 1834, conversions: 39, spend: 1423.45, ctr: 2.04, cpc: 0.78, cpa: 36.50, roas: 4.0 },
      { date: '2025-09-05', impressions: 94532, clicks: 1987, conversions: 43, spend: 1556.78, ctr: 2.10, cpc: 0.78, cpa: 36.20, roas: 4.3 }
    ],
    platformBreakdown: [
      { platform: 'Google Ads', impressions: 1687459, clicks: 34523, conversions: 743, spend: 27123.45, color: '#4285f4' },
      { platform: 'Meta Ads', impressions: 892145, clicks: 18934, conversions: 402, spend: 14789.23, color: '#1877f2' },
      { platform: 'LinkedIn', impressions: 267989, clicks: 5015, conversions: 98, spend: 3759.66, color: '#0077b5' }
    ]
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  const formatNumber = (value: number) => value.toLocaleString('en-US');

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }: any) => {
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percentage' ? formatPercentage(value) : 
                          formatNumber(value);
    
    const isPositive = change > 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formattedValue}</p>
          </div>
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      </div>
    );
  };

  return (
    <AsyncContent
      loading={isLoading}
      error={error}
      onRetry={execute}
      resourceName="performance analytics"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive performance insights across all campaigns and platforms
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="all">All Metrics</option>
              <option value="impressions">Impressions</option>
              <option value="clicks">Clicks</option>
              <option value="conversions">Conversions</option>
              <option value="spend">Spend</option>
            </select>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Impressions"
            value={performanceData.overview.totalImpressions}
            change={8.2}
            icon={Users}
          />
          <MetricCard
            title="Total Clicks"
            value={performanceData.overview.totalClicks}
            change={12.5}
            icon={MousePointer}
          />
          <MetricCard
            title="Total Conversions"
            value={performanceData.overview.totalConversions}
            change={15.3}
            icon={Target}
          />
          <MetricCard
            title="Total Spend"
            value={performanceData.overview.totalSpend}
            change={-3.8}
            icon={DollarSign}
            format="currency"
          />
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Performance Trends</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                Impressions
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Clicks
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Conversions
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData.dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                formatter={(value: any, name: string) => [
                  name === 'impressions' ? formatNumber(value) : 
                  name === 'spend' ? formatCurrency(value) : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Platform Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData.platformBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => [formatNumber(value), 'Clicks']} />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Spend Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spend Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={performanceData.platformBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="spend"
                  label={({ platform, spend }: any) => `${platform}: ${formatCurrency(Number(spend))}`}
                >
                  {performanceData.platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatCurrency(value), 'Spend']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Key Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Metric</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Current</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Previous</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">Click-through Rate (CTR)</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{formatPercentage(performanceData.overview.avgCtr)}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">1.89%</td>
                  <td className="py-3 px-4 text-right text-green-600">+8.5%</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">Cost per Click (CPC)</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{formatCurrency(performanceData.overview.avgCpc)}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">$0.82</td>
                  <td className="py-3 px-4 text-right text-green-600">-4.9%</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">Cost per Acquisition (CPA)</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{formatCurrency(performanceData.overview.avgCpa)}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">$42.15</td>
                  <td className="py-3 px-4 text-right text-green-600">-12.8%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">Return on Ad Spend (ROAS)</td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{performanceData.overview.roas.toFixed(1)}x</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">3.8x</td>
                  <td className="py-3 px-4 text-right text-green-600">+10.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI-Powered Insights Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Performance Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smart recommendations based on your performance data
              </p>
            </div>
          </div>
          <AIInsights 
            page="performance-analytics" 
            data={performanceData}
            className="mt-4"
          />
        </div>
      </div>
    </AsyncContent>
  );
}
