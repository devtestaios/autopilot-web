/**
 * Meta Business API Hook for PulseBridge AI
 * Validated credentials: September 24, 2025
 * Status: ✅ WORKING - Full API access confirmed
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Types
interface MetaAccount {
  name: string;
  id: string;
  currency: string;
  account_status: number;
}

interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  objective: string;
  daily_budget?: number;
  lifetime_budget?: number;
  created_time: string;
  updated_time?: string;
}

interface MetaInsights {
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  reach?: number;
  spend?: number;
  actions?: any[];
  action_values?: any[];
}

interface MetaStatus {
  connected: boolean;
  account_name?: string;
  account_id?: string;
  currency?: string;
  error?: string;
}

interface MetaAccountSummary {
  account_name: string;
  account_id: string;
  currency: string;
  total_campaigns: number;
  active_campaigns: number;
  paused_campaigns: number;
  total_spend: number;
  account_balance: number;
  campaigns: MetaCampaign[];
  last_updated: string;
}

// Custom Hook
export function useMetaBusinessAPI() {
  const [status, setStatus] = useState<MetaStatus>({ connected: false });
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [accountSummary, setAccountSummary] = useState<MetaAccountSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Meta API Status
  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meta-ads/status`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStatus(data.status);
      
      if (data.status.connected) {
        toast.success(`✅ Meta connected: ${data.status.account_name}`);
      } else {
        toast.error(`❌ Meta connection failed: ${data.status.error}`);
      }
      
      return data.status;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to check Meta status';
      setError(errorMsg);
      setStatus({ connected: false, error: errorMsg });
      toast.error(`Meta API Error: ${errorMsg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Campaigns
  const fetchCampaigns = useCallback(async (limit: number = 25) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meta-ads/campaigns?limit=${limit}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
      
      toast.success(`✅ Loaded ${data.campaigns?.length || 0} Meta campaigns`);
      return data.campaigns;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch Meta campaigns';
      setError(errorMsg);
      toast.error(`Meta Campaigns Error: ${errorMsg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Campaign Performance
  const fetchCampaignInsights = useCallback(async (campaignId: string, days: number = 7) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meta-ads/campaigns/${campaignId}/performance?days=${days}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      toast.success(`✅ Loaded performance data for campaign ${campaignId}`);
      return data.performance;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch campaign insights';
      setError(errorMsg);
      toast.error(`Campaign Insights Error: ${errorMsg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Account Summary
  const fetchAccountSummary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meta-ads/performance`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAccountSummary(data.account_summary);
      
      toast.success(`✅ Account summary loaded for ${data.account_summary?.account_name}`);
      return data.account_summary;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch account summary';
      setError(errorMsg);
      toast.error(`Account Summary Error: ${errorMsg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Campaign
  const createCampaign = useCallback(async (campaignData: {
    name: string;
    objective: string;
    status?: string;
    daily_budget?: number;
    lifetime_budget?: number;
  }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meta-ads/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Refresh campaigns list
      await fetchCampaigns();
      
      toast.success(`✅ Campaign "${campaignData.name}" created successfully`);
      return data.campaign;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create campaign';
      setError(errorMsg);
      toast.error(`Create Campaign Error: ${errorMsg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCampaigns]);

  // Initialize on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    // State
    status,
    campaigns,
    accountSummary,
    loading,
    error,
    
    // Actions
    checkStatus,
    fetchCampaigns,
    fetchCampaignInsights,
    fetchAccountSummary,
    createCampaign,
    
    // Computed
    isConnected: status.connected,
    accountName: status.account_name || 'pulsebridge.ai',
    campaignCount: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
  };
}

// Utility functions
export const MetaUtils = {
  formatBudget: (budget: number | undefined, currency: string = 'USD') => {
    if (!budget) return 'Not set';
    // Meta stores budget in cents
    const dollars = budget / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(dollars);
  },

  formatSpend: (spend: number | undefined, currency: string = 'USD') => {
    if (!spend) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(spend);
  },

  getCampaignStatusColor: (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'PAUSED':
        return 'text-yellow-600 bg-yellow-100';
      case 'DELETED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  getObjectiveDisplay: (objective: string) => {
    const objectives = {
      'LINK_CLICKS': 'Link Clicks',
      'CONVERSIONS': 'Conversions',
      'REACH': 'Reach',
      'BRAND_AWARENESS': 'Brand Awareness',
      'LEAD_GENERATION': 'Lead Generation',
      'MESSAGES': 'Messages',
      'VIDEO_VIEWS': 'Video Views',
      'IMPRESSIONS': 'Impressions'
    };
    return objectives[objective as keyof typeof objectives] || objective;
  }
};

export default useMetaBusinessAPI;