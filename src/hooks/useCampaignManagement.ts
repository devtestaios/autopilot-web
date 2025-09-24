'use client';

import { useState, useEffect } from 'react';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from '@/lib/api';
import type { Campaign } from '@/types';

export interface CampaignFilters {
  status?: 'active' | 'paused' | 'ended' | 'all';
  platform?: string;
  client?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CampaignFormData {
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  status: 'active' | 'paused' | 'ended';
  metrics?: Record<string, unknown>;
}

interface CampaignManagementState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  filters: CampaignFilters;
  selectedCampaigns: string[];
  lastUpdated: Date | null;
}

export function useCampaignManagement() {
  const [state, setState] = useState<CampaignManagementState>({
    campaigns: [],
    loading: true,
    error: null,
    filters: { status: 'all' },
    selectedCampaigns: [],
    lastUpdated: null
  });

  // Load campaigns
  const loadCampaigns = async (filters?: CampaignFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const campaigns = await fetchCampaigns();
      let filteredCampaigns = campaigns;

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        filteredCampaigns = filteredCampaigns.filter(c => c.status === filters.status);
      }
      
      if (filters?.platform) {
        filteredCampaigns = filteredCampaigns.filter(c => 
          c.platform.toLowerCase().includes(filters.platform!.toLowerCase())
        );
      }
      
      if (filters?.client) {
        filteredCampaigns = filteredCampaigns.filter(c => 
          c.client_name.toLowerCase().includes(filters.client!.toLowerCase())
        );
      }
      
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.client_name.toLowerCase().includes(searchTerm) ||
          c.platform.toLowerCase().includes(searchTerm)
        );
      }

      setState(prev => ({
        ...prev,
        campaigns: filteredCampaigns,
        loading: false,
        filters: filters || prev.filters,
        lastUpdated: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load campaigns'
      }));
    }
  };

  // Create new campaign
  const createNewCampaign = async (data: CampaignFormData): Promise<Campaign> => {
    try {
      const newCampaign = await createCampaign(data);
      await loadCampaigns(state.filters); // Refresh list
      return newCampaign;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create campaign');
    }
  };

  // Update existing campaign
  const updateExistingCampaign = async (id: string, data: CampaignFormData): Promise<Campaign> => {
    try {
      const updatedCampaign = await updateCampaign(id, data);
      await loadCampaigns(state.filters); // Refresh list
      return updatedCampaign;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update campaign');
    }
  };

  // Delete campaign
  const removeCampaign = async (id: string): Promise<void> => {
    try {
      await deleteCampaign(id);
      await loadCampaigns(state.filters); // Refresh list
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete campaign');
    }
  };

  // Bulk operations
  const bulkUpdateCampaigns = async (
    campaignIds: string[], 
    updates: Partial<CampaignFormData>
  ): Promise<void> => {
    const promises = campaignIds.map(id => {
      const campaign = state.campaigns.find(c => c.id === id);
      if (!campaign) throw new Error(`Campaign ${id} not found`);
      
      return updateCampaign(id, {
        ...campaign,
        ...updates
      } as CampaignFormData);
    });

    try {
      await Promise.all(promises);
      await loadCampaigns(state.filters); // Refresh list
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to bulk update campaigns');
    }
  };

  const bulkDeleteCampaigns = async (campaignIds: string[]): Promise<void> => {
    const promises = campaignIds.map(id => deleteCampaign(id));

    try {
      await Promise.all(promises);
      await loadCampaigns(state.filters); // Refresh list
      setState(prev => ({ ...prev, selectedCampaigns: [] }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to bulk delete campaigns');
    }
  };

  // Selection management
  const toggleCampaignSelection = (campaignId: string) => {
    setState(prev => ({
      ...prev,
      selectedCampaigns: prev.selectedCampaigns.includes(campaignId)
        ? prev.selectedCampaigns.filter(id => id !== campaignId)
        : [...prev.selectedCampaigns, campaignId]
    }));
  };

  const selectAllCampaigns = () => {
    setState(prev => ({
      ...prev,
      selectedCampaigns: prev.campaigns.map(c => c.id)
    }));
  };

  const clearSelection = () => {
    setState(prev => ({ ...prev, selectedCampaigns: [] }));
  };

  // Apply filters
  const applyFilters = (filters: CampaignFilters) => {
    loadCampaigns(filters);
  };

  // Clear filters
  const clearFilters = () => {
    const defaultFilters = { status: 'all' as const };
    loadCampaigns(defaultFilters);
  };

  // Get campaign statistics
  const getStatistics = () => {
    const stats = {
      total: state.campaigns.length,
      active: state.campaigns.filter(c => c.status === 'active').length,
      paused: state.campaigns.filter(c => c.status === 'paused').length,
      ended: state.campaigns.filter(c => c.status === 'ended').length,
      totalSpend: state.campaigns.reduce((sum, c) => sum + (c.spend || 0), 0),
      totalBudget: state.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
      platforms: [...new Set(state.campaigns.map(c => c.platform))],
      clients: [...new Set(state.campaigns.map(c => c.client_name))]
    };
    
    return stats;
  };

  // Auto-refresh campaigns
  const startAutoRefresh = (intervalMs: number = 30000) => {
    const interval = setInterval(() => {
      if (!state.loading) {
        loadCampaigns(state.filters);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  };

  // Initial load
  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    // State
    campaigns: state.campaigns,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    selectedCampaigns: state.selectedCampaigns,
    lastUpdated: state.lastUpdated,
    
    // Actions
    loadCampaigns,
    createNewCampaign,
    updateExistingCampaign,
    removeCampaign,
    
    // Bulk operations
    bulkUpdateCampaigns,
    bulkDeleteCampaigns,
    
    // Selection
    toggleCampaignSelection,
    selectAllCampaigns,
    clearSelection,
    
    // Filters
    applyFilters,
    clearFilters,
    
    // Utilities
    getStatistics,
    startAutoRefresh
  };
}

// Campaign status utilities
export const CAMPAIGN_STATUSES = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'paused', label: 'Paused', color: 'text-yellow-600' },
  { value: 'ended', label: 'Ended', color: 'text-red-600' }
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { value: 'meta', label: 'Meta (Facebook)', icon: '📘' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'youtube', label: 'YouTube', icon: '📺' }
] as const;

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status: string): string => {
  const statusConfig = CAMPAIGN_STATUSES.find(s => s.value === status);
  return statusConfig?.color || 'text-gray-600';
};

export const getPlatformIcon = (platform: string): string => {
  const platformConfig = PLATFORM_OPTIONS.find(p => p.value === platform);
  return platformConfig?.icon || '📊';
};