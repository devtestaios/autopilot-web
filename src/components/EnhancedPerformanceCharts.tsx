'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, MousePointer, Eye, Target } from 'lucide-react';

interface PerformanceData {
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
}

interface EnhancedPerformanceChartsProps {
  data?: PerformanceData[];
  loading?: boolean;
}

// Generate mock performance data
const generateMockData = (): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseSpend = 500 + Math.random() * 300;
    const impressions = Math.floor(10000 + Math.random() * 5000);
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
    const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.03));
    const ctr = (clicks / impressions) * 100;
    const cpc = baseSpend / clicks;
    const roas = (conversions * 50) / baseSpend; // Assuming $50 per conversion
    
    data.push({
      date: date.toISOString().split('T')[0],
      spend: baseSpend,
      clicks,
      impressions,
      conversions,
      ctr,
      cpc,
      roas
    });
  }
  
  return data;
};

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function EnhancedPerformanceCharts({ data, loading }: EnhancedPerformanceChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'spend' | 'performance' | 'conversions'>('spend');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  
  const chartData = data || generateMockData();

  // Prepare platform breakdown data (mock)
  const platformData = [
    { name: 'Google Ads', value: 45, spend: 15000, color: '#4285f4' },
    { name: 'Meta Ads', value: 30, spend: 10000, color: '#1877f2' },
    { name: 'LinkedIn Ads', value: 15, spend: 5000, color: '#0a66c2' },
    { name: 'TikTok Ads', value: 10, spend: 3000, color: '#000000' }
  ];

  const formatCurrency = (value: number) => `$${value.toFixed(0)}`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {
                entry.dataKey === 'spend' || entry.dataKey === 'cpc' ? formatCurrency(entry.value) :
                entry.dataKey === 'ctr' || entry.dataKey === 'roas' ? `${entry.value.toFixed(2)}${entry.dataKey === 'ctr' ? '%' : 'x'}` :
                formatNumber(entry.value)
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3 animate-pulse"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const containerProps = {
      width: '100%',
      height: 350
    };

    const chartProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const ChartComponent = chartType === 'line' ? LineChart : chartType === 'bar' ? BarChart : AreaChart;

    return (
      <ResponsiveContainer {...containerProps}>
        <ChartComponent {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedMetric === 'spend' && (
            <>
              {chartType === 'line' && <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} dot={false} />}
              {chartType === 'bar' && <Bar dataKey="spend" fill="#ef4444" />}
              {chartType === 'area' && <Area type="monotone" dataKey="spend" stroke="#ef4444" fill="#ef444420" />}
            </>
          )}
          
          {selectedMetric === 'performance' && (
            <>
              {chartType === 'line' && (
                <>
                  <Line type="monotone" dataKey="ctr" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cpc" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="roas" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </>
              )}
              {chartType === 'bar' && (
                <>
                  <Bar dataKey="ctr" fill="#3b82f6" />
                  <Bar dataKey="cpc" fill="#10b981" />
                  <Bar dataKey="roas" fill="#f59e0b" />
                </>
              )}
              {chartType === 'area' && (
                <>
                  <Area type="monotone" dataKey="ctr" stackId="1" stroke="#3b82f6" fill="#3b82f620" />
                  <Area type="monotone" dataKey="cpc" stackId="1" stroke="#10b981" fill="#10b98120" />
                  <Area type="monotone" dataKey="roas" stackId="1" stroke="#f59e0b" fill="#f59e0b20" />
                </>
              )}
            </>
          )}
          
          {selectedMetric === 'conversions' && (
            <>
              {chartType === 'line' && (
                <>
                  <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={false} />
                </>
              )}
              {chartType === 'bar' && (
                <>
                  <Bar dataKey="impressions" fill="#8b5cf6" />
                  <Bar dataKey="clicks" fill="#3b82f6" />
                  <Bar dataKey="conversions" fill="#10b981" />
                </>
              )}
              {chartType === 'area' && (
                <>
                  <Area type="monotone" dataKey="impressions" stackId="1" stroke="#8b5cf6" fill="#8b5cf620" />
                  <Area type="monotone" dataKey="clicks" stackId="1" stroke="#3b82f6" fill="#3b82f620" />
                  <Area type="monotone" dataKey="conversions" stackId="1" stroke="#10b981" fill="#10b98120" />
                </>
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Metric Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Metrics</label>
            <div className="flex gap-2">
              {[
                { key: 'spend', label: 'Spend', icon: DollarSign },
                { key: 'performance', label: 'Performance', icon: TrendingUp },
                { key: 'conversions', label: 'Funnel', icon: Target }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === key 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chart Type</label>
            <div className="flex gap-2">
              {[
                { key: 'line', label: 'Line' },
                { key: 'bar', label: 'Bar' },
                { key: 'area', label: 'Area' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setChartType(key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chartType === key 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="w-full">
          {renderChart()}
        </div>
      </div>

      {/* Platform Distribution and Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spend by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}%`, 
                  name === 'value' ? 'Share' : name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-green-800 dark:text-green-300 font-medium">Best Performing Day</span>
              </div>
              <span className="text-green-700 dark:text-green-400 font-semibold">Yesterday</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-300 font-medium">Highest CTR</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">3.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-purple-800 dark:text-purple-300 font-medium">Conversion Rate</span>
              </div>
              <span className="text-purple-700 dark:text-purple-400 font-semibold">6.8%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 dark:text-orange-300 font-medium">Avg ROAS</span>
              </div>
              <span className="text-orange-700 dark:text-orange-400 font-semibold">4.2x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}