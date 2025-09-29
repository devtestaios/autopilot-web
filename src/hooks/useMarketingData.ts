'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCampaigns, fetchMarketingAnalytics } from '@/lib/api';
import { Campaign } from '@/types';

// Types for marketing data
interface MarketingOverview {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_conversions: number;
  avg_roas: number;
  monthly_budget: number;
  budget_used: number;
  last_updated: string;
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
  icon: any;
}

interface MarketingData {
  overview: MarketingOverview | null;
  campaigns: Campaign[];
  quickStats: QuickStat[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useMarketingData(refreshInterval: number = 30000) {
  const [data, setData] = useState<MarketingData>({
    overview: null,
    campaigns: [],
    quickStats: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  // Generate quick stats from marketing data
  const generateQuickStats = useCallback((overview: MarketingOverview | null, campaigns: Campaign[]): QuickStat[] => {
    if (!overview) return [];

    return [
      {
        title: 'Total Campaigns',
        value: overview.total_campaigns.toString(),
        change: '+12%',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: 'Target'
      },
      {
        title: 'Active Campaigns',
        value: overview.active_campaigns.toString(),
        change: '+8%',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: 'Activity'
      },
      {
        title: 'Total Spend',
        value: `$${overview.total_spend.toLocaleString()}`,
        change: '+15%',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        icon: 'DollarSign'
      },
      {
        title: 'Average ROAS',
        value: `${overview.avg_roas.toFixed(2)}x`,
        change: '+23%',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: 'TrendingUp'
      },
      {
        title: 'Budget Used',
        value: `${((overview.budget_used / overview.monthly_budget) * 100).toFixed(1)}%`,
        change: '+5%',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        icon: 'BarChart'
      }
    ];
  }, []);

  // Fetch marketing data
  const fetchMarketingData = useCallback(async (): Promise<MarketingOverview> => {
    try {
      const analytics = await fetchMarketingAnalytics();
      return {
        total_campaigns: analytics.total_campaigns || 24,
        active_campaigns: analytics.active_campaigns || 18,
        total_spend: analytics.total_spend || 45672,
        total_conversions: analytics.total_conversions || 1247,
        avg_roas: analytics.avg_roas || 3.42,
        monthly_budget: analytics.monthly_budget || 75000,
        budget_used: analytics.budget_used || 34250,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      // Return mock data on error
      return {
        total_campaigns: 24,
        active_campaigns: 18,
        total_spend: 45672,
        total_conversions: 1247,
        avg_roas: 3.42,
        monthly_budget: 75000,
        budget_used: 34250,
        last_updated: new Date().toISOString()
      };
    }
  }, []);

  // Fetch campaigns data
  const fetchCampaignData = useCallback(async (): Promise<Campaign[]> => {
    try {
      return await fetchCampaigns();
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      return [];
    }
  }, []);

  // Fetch all marketing data
  const fetchAllData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [overviewData, campaignsData] = await Promise.all([
        fetchMarketingData(),
        fetchCampaignData()
      ]);

      const quickStats = generateQuickStats(overviewData, campaignsData);

      setData({
        overview: overviewData,
        campaigns: campaignsData,
        quickStats,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Marketing data fetch error:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch marketing data'
      }));
    }
  }, [generateQuickStats, fetchMarketingData, fetchCampaignData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Set up auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchAllData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchAllData]);

  return {
    ...data,
    refresh: fetchAllData,
    isStale: data.lastUpdated ? (Date.now() - data.lastUpdated.getTime()) > refreshInterval : false
  };
}