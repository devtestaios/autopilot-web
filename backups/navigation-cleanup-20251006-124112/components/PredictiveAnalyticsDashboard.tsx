'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Calendar, 
  Target, 
  DollarSign, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedChart } from '@/components/OptimizedChart';

// Dynamic imports for Recharts components to reduce bundle size
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { 
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading chart...</span></div>
});
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });

// Import problematic components normally due to TypeScript issues
import { ReferenceLine, ReferenceArea } from 'recharts';

interface PredictionDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  confidence_lower: number;
  confidence_upper: number;
  is_forecast: boolean;
}

interface MetricForecast {
  metric: string;
  current_value: number;
  predicted_value: number;
  confidence: number;
  change_percentage: number;
  timeframe: string;
  factors: {
    name: string;
    impact: number;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
}

interface PredictiveAnalyticsDashboardProps {
  campaignId?: string;
  timeRange?: string;
  className?: string;
}

const PredictiveAnalyticsDashboard: React.FC<PredictiveAnalyticsDashboardProps> = ({
  campaignId,
  timeRange = '30d',
  className
}) => {
  const [selectedMetric, setSelectedMetric] = useState('conversions');
  const [predictionHorizon, setPredictionHorizon] = useState('14d');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock predictive data - in real implementation, this would come from AI backend
  const predictiveData = useMemo(() => {
    const baseData = [];
    const today = new Date();
    
    // Historical data (past 30 days)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const trend = Math.sin(i * 0.1) * 10 + 50 + Math.random() * 20;
      
      baseData.push({
        date: date.toISOString().split('T')[0],
        actual: i === 0 ? undefined : Math.max(0, trend),
        predicted: trend,
        confidence_lower: Math.max(0, trend - 15),
        confidence_upper: trend + 15,
        is_forecast: false
      });
    }

    // Forecast data (next 14 days)
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const trend = Math.sin((30 + i) * 0.1) * 12 + 55 + i * 1.5; // Slight upward trend
      
      baseData.push({
        date: date.toISOString().split('T')[0],
        actual: undefined,
        predicted: trend,
        confidence_lower: Math.max(0, trend - 20),
        confidence_upper: trend + 20,
        is_forecast: true
      });
    }

    return baseData;
  }, [selectedMetric, predictionHorizon]);

  const metricForecasts: MetricForecast[] = useMemo(() => [
    {
      metric: 'Conversions',
      current_value: 1247,
      predicted_value: 1589,
      confidence: 87,
      change_percentage: 27.4,
      timeframe: 'Next 14 days',
      factors: [
        { name: 'Seasonal Trends', impact: 35, trend: 'positive' },
        { name: 'Market Competition', impact: -12, trend: 'negative' },
        { name: 'Ad Quality Score', impact: 23, trend: 'positive' },
        { name: 'Audience Expansion', impact: 18, trend: 'positive' }
      ]
    },
    {
      metric: 'Cost per Acquisition',
      current_value: 42.67,
      predicted_value: 35.21,
      confidence: 92,
      change_percentage: -17.5,
      timeframe: 'Next 14 days',
      factors: [
        { name: 'Budget Optimization', impact: -25, trend: 'positive' },
        { name: 'Keyword Performance', impact: -15, trend: 'positive' },
        { name: 'Landing Page CVR', impact: 8, trend: 'positive' },
        { name: 'Market Saturation', impact: 12, trend: 'negative' }
      ]
    },
    {
      metric: 'Click-Through Rate',
      current_value: 3.24,
      predicted_value: 4.12,
      confidence: 78,
      change_percentage: 27.2,
      timeframe: 'Next 14 days',
      factors: [
        { name: 'Ad Creative Updates', impact: 42, trend: 'positive' },
        { name: 'Audience Relevance', impact: 28, trend: 'positive' },
        { name: 'Market Fatigue', impact: -15, trend: 'negative' },
        { name: 'Seasonal Interest', impact: 22, trend: 'positive' }
      ]
    },
    {
      metric: 'Return on Ad Spend',
      current_value: 4.2,
      predicted_value: 5.8,
      confidence: 84,
      change_percentage: 38.1,
      timeframe: 'Next 14 days',
      factors: [
        { name: 'Product Demand', impact: 45, trend: 'positive' },
        { name: 'Price Optimization', impact: 25, trend: 'positive' },
        { name: 'Competition Pressure', impact: -18, trend: 'negative' },
        { name: 'Market Expansion', impact: 32, trend: 'positive' }
      ]
    }
  ], []);

  const refreshPredictions = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isForecast = data.is_forecast;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {data.actual !== undefined && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Actual: <span className="font-semibold text-blue-600">{data.actual.toFixed(1)}</span>
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isForecast ? 'Predicted' : 'Model'}: <span className="font-semibold text-purple-600">{data.predicted.toFixed(1)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Range: {data.confidence_lower.toFixed(1)} - {data.confidence_upper.toFixed(1)}
          </p>
          {isForecast && (
            <div className="mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-700 dark:text-purple-300">
              AI Forecast
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Predictive Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered forecasting and trend analysis
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={refreshPredictions}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Metric
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="conversions">Conversions</option>
            <option value="cpa">Cost per Acquisition</option>
            <option value="ctr">Click-Through Rate</option>
            <option value="roas">Return on Ad Spend</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Forecast Horizon
          </label>
          <select
            value={predictionHorizon}
            onChange={(e) => setPredictionHorizon(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">7 Days</option>
            <option value="14d">14 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>
      </div>

      {/* Metric Forecasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricForecasts.map((forecast, index) => (
          <motion.div
            key={forecast.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {forecast.metric}
              </h3>
              <div className="flex items-center space-x-1">
                {forecast.change_percentage > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className={cn(
                  'text-sm font-semibold',
                  forecast.change_percentage > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {forecast.change_percentage > 0 ? '+' : ''}{forecast.change_percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {forecast.current_value.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Predicted ({forecast.timeframe})</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {forecast.predicted_value.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Confidence</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${forecast.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {forecast.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Factors */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Factors:
              </p>
              <div className="space-y-1">
                {forecast.factors.slice(0, 2).map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{factor.name}</span>
                    <span className={cn(
                      'font-medium',
                      factor.trend === 'positive' ? 'text-green-600' : factor.trend === 'negative' ? 'text-red-600' : 'text-gray-600'
                    )}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Predictive Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Predictive Trend Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Historical performance with AI-powered forecasting
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Actual</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Predicted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Range</span>
            </div>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictiveData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Confidence bands */}
              <Area
                dataKey="confidence_upper"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={0.3}
              />
              <Area
                dataKey="confidence_lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
              />
              
              {/* Actual data line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                connectNulls={false}
              />
              
              {/* Predicted data line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
              />
              
              {/* Reference line for today */}
              <ReferenceLine 
                x={new Date().toISOString().split('T')[0]} 
                stroke="#ef4444" 
                strokeDasharray="2 2"
                label={{ value: "Today", position: "top" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Analysis Summary
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                • <strong>Overall Trend:</strong> Strong upward trajectory detected with 87% confidence. Performance is expected to improve by 27.4% over the next 14 days.
              </p>
              <p>
                • <strong>Key Driver:</strong> Seasonal trends and audience expansion are the primary growth factors, contributing +35% and +18% impact respectively.
              </p>
              <p>
                • <strong>Risk Factor:</strong> Market competition showing -12% impact. Recommend increasing budget allocation to maintain competitive advantage.
              </p>
              <p>
                • <strong>Recommendation:</strong> Optimal time to scale campaigns. Consider increasing budgets by 25-40% to capitalize on predicted performance gains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;