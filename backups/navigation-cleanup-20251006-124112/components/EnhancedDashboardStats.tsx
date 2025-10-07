'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Eye, MousePointer, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Campaign } from '@/types';

interface DashboardStatsProps {
  campaigns: Campaign[];
  loading?: boolean;
}

interface PerformanceMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  averageROAS: number;
  conversionRate: number;
}

interface PlatformStats {
  [key: string]: {
    campaigns: number;
    spend: number;
    conversions: number;
    performance: 'good' | 'warning' | 'poor';
  };
}

export default function EnhancedDashboardStats({ campaigns, loading }: DashboardStatsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    averageCTR: 0,
    averageCPC: 0,
    averageROAS: 0,
    conversionRate: 0
  });

  const [platformStats, setPlatformStats] = useState<PlatformStats>({});

  useEffect(() => {
    if (campaigns.length > 0) {
      calculateMetrics();
      calculatePlatformStats();
    }
  }, [campaigns]);

  const calculateMetrics = () => {
    // Mock performance data - replace with real API data
    const mockMetrics = {
      totalImpressions: campaigns.length * 15000 + Math.floor(Math.random() * 50000),
      totalClicks: campaigns.length * 750 + Math.floor(Math.random() * 2500),
      totalConversions: campaigns.length * 45 + Math.floor(Math.random() * 150),
      averageCTR: 2.1 + Math.random() * 1.5,
      averageCPC: 1.25 + Math.random() * 0.75,
      averageROAS: 3.2 + Math.random() * 1.8,
      conversionRate: 4.5 + Math.random() * 2.0
    };
    setMetrics(mockMetrics);
  };

  const calculatePlatformStats = () => {
    const stats: PlatformStats = {};
    
    campaigns.forEach(campaign => {
      const platform = campaign.platform || 'other';
      if (!stats[platform]) {
        stats[platform] = {
          campaigns: 0,
          spend: 0,
          conversions: 0,
          performance: 'good'
        };
      }
      
      stats[platform].campaigns += 1;
      stats[platform].spend += campaign.spend || 0;
      stats[platform].conversions += Math.floor(Math.random() * 50); // Mock data
      
      // Determine performance based on spend/budget ratio
      const spendRatio = (campaign.spend || 0) / (campaign.budget || 1);
      if (spendRatio > 0.9) stats[platform].performance = 'warning';
      if (spendRatio > 1) stats[platform].performance = 'poor';
    });
    
    setPlatformStats(stats);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Spend</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalSpend)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">12.5% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Conversions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Conversions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatNumber(metrics.totalConversions)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">8.3% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Average ROAS */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avg ROAS</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.averageROAS.toFixed(1)}x</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Target: 3.0x</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Budget Used</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatPercentage(budgetUtilization)}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    budgetUtilization > 90 ? 'bg-red-500' : 
                    budgetUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              {budgetUtilization > 90 ? (
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              ) : (
                <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Impressions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalImpressions)}</p>
            </div>
            <Eye className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalClicks)}</p>
            </div>
            <MousePointer className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* CTR */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average CTR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.averageCTR)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        {/* CPC */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average CPC</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.averageCPC)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Campaigns</span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Campaigns</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Budget</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Remaining Budget</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(totalBudget - totalSpend)}</span>
            </div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {Object.entries(platformStats).map(([platform, stats]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    stats.performance === 'good' ? 'bg-green-500' :
                    stats.performance === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-gray-900 dark:text-white font-medium capitalize">
                    {platform.replace('_', ' ').replace('ads', 'Ads')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stats.campaigns} campaign{stats.campaigns !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {formatCurrency(stats.spend)} spent
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}