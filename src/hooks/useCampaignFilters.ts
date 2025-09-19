'use client';

import { useState, useMemo } from 'react';
import type { Campaign } from '@/types';

export interface CampaignFilters {
  platform: string[];
  status: string[];
  budgetRange: string;
  dateRange: string;
  searchTerm: string;
}

const defaultFilters: CampaignFilters = {
  platform: [],
  status: [],
  budgetRange: '',
  dateRange: '',
  searchTerm: ''
};

export function useCampaignFilters(campaigns: Campaign[]) {
  const [filters, setFilters] = useState<CampaignFilters>(defaultFilters);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Platform filter
      if (filters.platform.length > 0 && !filters.platform.includes(campaign.platform)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(campaign.status)) {
        return false;
      }

      // Budget range filter
      if (filters.budgetRange) {
        const budget = campaign.budget || 0;
        switch (filters.budgetRange) {
          case '0-1000':
            if (budget >= 1000) return false;
            break;
          case '1000-5000':
            if (budget < 1000 || budget >= 5000) return false;
            break;
          case '5000-10000':
            if (budget < 5000 || budget >= 10000) return false;
            break;
          case '10000-50000':
            if (budget < 10000 || budget >= 50000) return false;
            break;
          case '50000+':
            if (budget < 50000) return false;
            break;
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const campaignDate = new Date(campaign.created_at);
        const now = new Date();
        const daysAgo = parseInt(filters.dateRange);
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        if (campaignDate < cutoffDate) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          campaign.name,
          campaign.client_name,
          campaign.platform,
          campaign.status
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchLower)) return false;
      }

      return true;
    });
  }, [campaigns, filters]);

  return {
    filters,
    setFilters,
    filteredCampaigns,
    totalResults: filteredCampaigns.length
  };
}