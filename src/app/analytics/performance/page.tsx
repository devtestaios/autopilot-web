'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, MousePointer, BarChart3, Filter, Calendar, Download } from 'lucide-react';
import { useAsyncOperation } from '@/hooks/useErrorHandler';
import { AsyncContent } from '@/components/ui/AsyncContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAnalyticsPerformance } from '@/lib/api';
import AIInsights from '@/components/AIInsights';
import NavigationTabs from '@/components/NavigationTabs';
import { 
  InteractiveLineChart, 
  InteractiveBarChart, 
  InteractivePieChart, 
  PerformanceHeatmap 
} from '@/components/DataVisualization';
import type { AnalyticsPerformanceResponse } from '@/types';

export default function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
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

  // Enhanced mock data for new visualizations
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
      { date: '2025-09-01', value: 1542.67 },
      { date: '2025-09-02', value: 1687.32 },
      { date: '2025-09-03', value: 1634.21 },
      { date: '2025-09-04', value: 1423.45 },
      { date: '2025-09-05', value: 1556.78 },
      { date: '2025-09-06', value: 1789.23 },
      { date: '2025-09-07', value: 1923.45 }
    ],
    platformData: [
      { label: 'Google Ads', value: 27123.45, color: '#4285f4', trend: 12.5 },
      { label: 'Meta Ads', value: 14789.23, color: '#1877f2', trend: -3.2 },
      { label: 'LinkedIn', value: 3759.66, color: '#0077b5', trend: 8.7 }
    ],
    heatmapData: [
      { x: 'Monday', y: 'Morning', value: 4.2 },
      { x: 'Monday', y: 'Afternoon', value: 3.8 },
      { x: 'Monday', y: 'Evening', value: 2.1 },
      { x: 'Tuesday', y: 'Morning', value: 4.5 },
      { x: 'Tuesday', y: 'Afternoon', value: 4.1 },
      { x: 'Tuesday', y: 'Evening', value: 2.8 },
      { x: 'Wednesday', y: 'Morning', value: 3.9 },
      { x: 'Wednesday', y: 'Afternoon', value: 3.6 },
      { x: 'Wednesday', y: 'Evening', value: 2.3 }
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
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-400">{title}</p>
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
            <span className="text-sm text-gray-700 dark:text-gray-500 ml-1">vs last period</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Performance Analytics
              </h1>
              <p className="text-gray-800 dark:text-gray-400 mt-1">
                Detailed performance metrics and interactive visualizations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Spend"
              value={performanceData.overview.totalSpend}
              change={8.5}
              icon={DollarSign}
              format="currency"
            />
            <MetricCard
              title="Total Conversions"
              value={performanceData.overview.totalConversions}
              change={12.3}
              icon={Target}
              format="number"
            />
            <MetricCard
              title="Click-Through Rate"
              value={performanceData.overview.avgCtr}
              change={-2.1}
              icon={MousePointer}
              format="percentage"
            />
            <MetricCard
              title="ROAS"
              value={performanceData.overview.roas}
              change={15.7}
              icon={TrendingUp}
              format="number"
            />
          </div>

          {/* Interactive Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveLineChart
              data={'dailyMetrics' in performanceData ? performanceData.dailyMetrics : []}
              title="Daily Spend Trend"
              currency={true}
              showForecast={true}
            />
            
            <InteractivePieChart
              data={'platformData' in performanceData ? performanceData.platformData : []}
              title="Platform Performance Distribution"
              donut={true}
            />
          </div>

          {/* Platform Performance Bar Chart */}
          <InteractiveBarChart
            data={'platformData' in performanceData ? performanceData.platformData : []}
            title="Platform Spend Comparison"
          />

          {/* Performance Heatmap */}
          <PerformanceHeatmap
            data={'heatmapData' in performanceData ? performanceData.heatmapData : []}
            title="Performance by Day & Time"
            xLabels={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
            yLabels={['Morning', 'Afternoon', 'Evening']}
          />

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                AI Performance Insights
              </CardTitle>
              <CardDescription>
                Automated insights and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIInsights page="performance-analytics" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
