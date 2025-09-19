'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchResult {
  id: string;
  type: 'campaign' | 'lead' | 'alert' | 'page';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
}

interface SearchData {
  campaigns?: any[];
  leads?: any[];
}

export function useGlobalSearch(searchData?: SearchData) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Combine mock data with real data
  const allSearchableContent: SearchResult[] = useMemo(() => {
    const content: SearchResult[] = [];

    // Add static pages
    content.push(
      {
        id: 'page-campaigns',
        type: 'page',
        title: 'Campaign Management',
        description: 'Manage and monitor your marketing campaigns',
        url: '/campaigns',
      },
      {
        id: 'page-leads',
        type: 'page',
        title: 'Lead Management',
        description: 'Track and manage campaign leads',
        url: '/leads',
      },
      {
        id: 'page-analytics',
        type: 'page',
        title: 'Analytics Dashboard',
        description: 'View campaign performance and analytics',
        url: '/analytics',
      },
      {
        id: 'page-alerts',
        type: 'page',
        title: 'Alerts & Notifications',
        description: 'Monitor campaign alerts and notifications',
        url: '/alerts',
      },
      {
        id: 'page-status',
        type: 'page',
        title: 'System Status',
        description: 'Check system and integration status',
        url: '/status',
      },
      {
        id: 'page-unified',
        type: 'page',
        title: 'Unified Dashboard',
        description: 'Comprehensive overview of all metrics',
        url: '/unified',
      },
      {
        id: 'page-platforms',
        type: 'page',
        title: 'Platform Management',
        description: 'Manage connected advertising platforms',
        url: '/platforms',
      }
    );

    // Add campaigns if provided
    if (searchData?.campaigns) {
      searchData.campaigns.forEach(campaign => {
        content.push({
          id: `campaign-${campaign.id}`,
          type: 'campaign',
          title: campaign.name,
          description: `${campaign.platform} campaign - ${campaign.status}`,
          url: `/campaigns/${campaign.id}`,
          metadata: { 
            platform: campaign.platform, 
            status: campaign.status,
            budget: campaign.budget
          }
        });
      });
    }

    // Add leads if provided
    if (searchData?.leads) {
      searchData.leads.forEach(lead => {
        content.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: lead.name || lead.email,
          description: `Lead from ${lead.source || 'unknown'} source`,
          url: `/leads?search=${encodeURIComponent(lead.email)}`,
          metadata: { 
            source: lead.source, 
            email: lead.email,
            created_at: lead.created_at
          }
        });
      });
    }

    // Add some mock alerts for demo
    content.push(
      {
        id: 'alert-budget',
        type: 'alert',
        title: 'Budget Alert',
        description: 'Campaign budget utilization at 85%',
        url: '/alerts',
        metadata: { severity: 'warning' }
      },
      {
        id: 'alert-performance',
        type: 'alert',
        title: 'Performance Alert',
        description: 'CTR below threshold for Summer Sale campaign',
        url: '/alerts',
        metadata: { severity: 'info' }
      }
    );

    return content;
  }, [searchData]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    const searchTimeout = setTimeout(() => {
      const filteredResults = allSearchableContent.filter(item =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (item.metadata && Object.values(item.metadata).some(value => 
          String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ))
      );
      
      // Sort results by relevance (exact matches first, then partial matches)
      filteredResults.sort((a, b) => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const aExact = a.title.toLowerCase().includes(searchLower) ? 1 : 0;
        const bExact = b.title.toLowerCase().includes(searchLower) ? 1 : 0;
        
        if (aExact !== bExact) return bExact - aExact;
        
        // Then sort by type priority (pages, campaigns, leads, alerts)
        const typePriority = { page: 4, campaign: 3, lead: 2, alert: 1 };
        return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
      });
      
      setResults(filteredResults.slice(0, 8)); // Limit to 8 results
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(searchTimeout);
  }, [debouncedSearchTerm, allSearchableContent]);

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    results,
    hasResults: results.length > 0,
    showResults: debouncedSearchTerm.trim().length > 0
  };
}