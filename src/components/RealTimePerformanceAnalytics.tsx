'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import { 
  Calendar, TrendingUp, DollarSign, MousePointer, Eye, Target, 
  BarChart3, PieChart as PieChartIcon, Activity, Zap, RefreshCw
} from 'lucide-react';
import { PremiumCard } from './ui/PremiumCard';
import { PremiumButton } from './ui/PremiumButton';
import { fetchCampaigns, fetchCampaignPerformance } from '@/lib/api';
import type { Campaign, PerformanceSnapshot } from '@/types';

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

interface PlatformPerformance {
  platform: string;
  spend: number;
  clicks: number;
  conversions: number;
  campaigns: number;
  roas: number;
}

interface RealTimePerformanceAnalyticsProps {
  campaigns?: Campaign[];
  loading?: boolean;
}

const COLORS = ['#00d4ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function RealTimePerformanceAnalytics({ 
  campaigns: propCampaigns, 
  loading: propLoading 
}: RealTimePerformanceAnalyticsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(propCampaigns || []);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [platformData, setPlatformData] = useState<PlatformPerformance[]>([]);
  const [loading, setLoading] = useState(propLoading ?? true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [refreshing, setRefreshing] = useState(false);

  // Load campaigns and performance data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // If campaigns not provided via props, fetch them
        const campaignsToUse = propCampaigns || await fetchCampaigns();
        setCampaigns(campaignsToUse);
        
        // Generate performance data from campaigns and their metrics
        await generatePerformanceData(campaignsToUse);
        
      } catch (error) {
        console.error('Failed to load performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propCampaigns, timeframe]);

  const generatePerformanceData = async (campaignList: Campaign[]) => {
    // For now, generate synthetic time series data based on campaign metrics
    // In production, this would fetch from performance_snapshots table
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const data: PerformanceData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Aggregate data from all campaigns for this day
      let totalSpend = 0;
      let totalClicks = 0;
      let totalImpressions = 0;
      let totalConversions = 0;

      campaignList.forEach(campaign => {
        const metrics = campaign.metrics || {};
        // Simulate daily variation (in production this would be real daily snapshots)
        const dailyVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of base
        
        totalSpend += (campaign.spend / days) * dailyVariation;
        totalClicks += ((metrics.clicks as number) || 0) / days * dailyVariation;
        totalImpressions += ((metrics.impressions as number) || 0) / days * dailyVariation;
        totalConversions += ((metrics.conversions as number) || 0) / days * dailyVariation;
      });

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const roas = totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0; // Assuming $50 AOV

      data.push({
        date: date.toISOString().split('T')[0],
        spend: Math.round(totalSpend),
        clicks: Math.round(totalClicks),
        impressions: Math.round(totalImpressions),
        conversions: Math.round(totalConversions),
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        roas: Number(roas.toFixed(1))
      });
    }

    setPerformanceData(data);

    // Generate platform performance data
    const platformMap = new Map<string, PlatformPerformance>();
    
    campaignList.forEach(campaign => {
      const platform = campaign.platform;
      const metrics = campaign.metrics || {};
      
      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          spend: 0,
          clicks: 0,
          conversions: 0,
          campaigns: 0,
          roas: 0
        });
      }
      
      const platformData = platformMap.get(platform)!;
      platformData.spend += campaign.spend;
      platformData.clicks += (metrics.clicks as number) || 0;
      platformData.conversions += (metrics.conversions as number) || 0;
      platformData.campaigns += 1;
    });

    // Calculate ROAS for each platform
    const platformArray = Array.from(platformMap.values()).map(platform => ({
      ...platform,
      roas: platform.spend > 0 ? (platform.conversions * 50) / platform.spend : 0
    }));

    setPlatformData(platformArray);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const freshCampaigns = await fetchCampaigns();
      setCampaigns(freshCampaigns);
      await generatePerformanceData(freshCampaigns);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time insights from your campaign data</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Timeframe Selection */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Chart Type Selection */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { type: 'area' as const, icon: Activity },
              { type: 'line' as const, icon: TrendingUp },
              { type: 'bar' as const, icon: BarChart3 }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`p-2 rounded-md transition-colors ${
                  chartType === type
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <PremiumButton
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </PremiumButton>
        </div>
      </motion.div>

      {/* Main Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Campaign Performance Trends
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              Last {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : '90 days'}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'spend' ? formatCurrency(value) : 
                    name === 'roas' ? `${value}x` :
                    name === 'ctr' ? `${value}%` :
                    name === 'cpc' ? formatCurrency(value) :
                    formatNumber(value), 
                    name.toUpperCase()
                  ]}
                />
                <Legend />
                
                {/* Spend bars */}
                <Bar yAxisId="left" dataKey="spend" fill="#00d4ff" name="Spend" opacity={0.7} />
                
                {/* Performance lines */}
                <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#10b981" strokeWidth={3} name="ROAS" />
                <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#ec4899" strokeWidth={2} name="CTR %" />
                
                {/* Conversions area */}
                <Area yAxisId="left" type="monotone" dataKey="conversions" fill="#7c3aed" stroke="#7c3aed" fillOpacity={0.3} name="Conversions" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Platform Performance & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Spend by Platform
              </h3>
              <PieChartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData as any}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="spend"
                    label={({ platform, percent }: any) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Performance Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PremiumCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Key Metrics Summary
            </h3>
            
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{platform.platform}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {platform.campaigns} campaigns
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(platform.spend)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {platform.roas.toFixed(1)}x ROAS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Performance Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            title: 'Total Spend',
            value: formatCurrency(performanceData.reduce((sum, d) => sum + d.spend, 0)),
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20'
          },
          {
            title: 'Total Clicks',
            value: formatNumber(performanceData.reduce((sum, d) => sum + d.clicks, 0)),
            icon: MousePointer,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20'
          },
          {
            title: 'Total Impressions',
            value: formatNumber(performanceData.reduce((sum, d) => sum + d.impressions, 0)),
            icon: Eye,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/20'
          },
          {
            title: 'Total Conversions',
            value: formatNumber(performanceData.reduce((sum, d) => sum + d.conversions, 0)),
            icon: Target,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/20'
          }
        ].map((metric, index) => (
          <PremiumCard key={metric.title} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </PremiumCard>
        ))}
      </motion.div>
    </div>
  );
}