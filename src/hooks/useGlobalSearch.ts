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

export function useGlobalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Mock search data - replace with real API calls
  const mockData: SearchResult[] = useMemo(() => [
    {
      id: '1',
      type: 'campaign',
      title: 'Summer Sale Campaign',
      description: 'Google Ads campaign running until August',
      url: '/campaigns/1',
      metadata: { platform: 'google-ads', status: 'active' }
    },
    {
      id: '2',
      type: 'campaign',
      title: 'Meta Brand Awareness',
      description: 'Facebook and Instagram brand awareness campaign',
      url: '/campaigns/2',
      metadata: { platform: 'meta', status: 'active' }
    },
    {
      id: '3',
      type: 'lead',
      title: 'john.doe@example.com',
      description: 'Lead from Summer Sale campaign',
      url: '/leads?search=john.doe@example.com',
      metadata: { source: 'google-ads', quality: 'high' }
    },
    {
      id: '4',
      type: 'page',
      title: 'Campaign Management',
      description: 'Manage and monitor your marketing campaigns',
      url: '/campaigns',
    },
    {
      id: '5',
      type: 'page',
      title: 'Lead Management',
      description: 'Track and manage campaign leads',
      url: '/leads',
    },
    {
      id: '6',
      type: 'alert',
      title: 'Budget Alert',
      description: 'Campaign budget utilization at 85%',
      url: '/alerts',
      metadata: { severity: 'warning' }
    }
  ], []);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    const searchTimeout = setTimeout(() => {
      const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(searchTimeout);
  }, [debouncedSearchTerm, mockData]);

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    results,
    hasResults: results.length > 0,
    showResults: debouncedSearchTerm.trim().length > 0
  };
}