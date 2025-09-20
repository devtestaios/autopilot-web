'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SearchContextData {
  campaigns: any[];
  leads: any[];
  templates: any[];
  isLoading: boolean;
  searchHistory: string[];
  setCampaigns: (campaigns: any[]) => void;
  setLeads: (leads: any[]) => void;
  setTemplates: (templates: any[]) => void;
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
}

const SearchContext = createContext<SearchContextData | undefined>(undefined);

// Mock data for comprehensive search functionality
const mockCampaigns = [
  {
    id: '1',
    name: 'Q4 Holiday Shopping Blitz',
    platform: 'Google Ads',
    status: 'active',
    budget: 15000,
    spend: 8240,
    description: 'High-performance holiday campaign targeting gift shoppers'
  },
  {
    id: '2',
    name: 'AI-Powered Retargeting',
    platform: 'Meta',
    status: 'active',
    budget: 8000,
    spend: 5100,
    description: 'Smart retargeting campaign using AI optimization'
  },
  {
    id: '3',
    name: 'LinkedIn Professional Outreach',
    platform: 'LinkedIn',
    status: 'optimizing',
    budget: 5500,
    spend: 2850,
    description: 'B2B lead generation for professional services'
  },
  {
    id: '4',
    name: 'Summer Sale Promotion',
    platform: 'TikTok',
    status: 'paused',
    budget: 3000,
    spend: 2100,
    description: 'Seasonal promotion targeting younger demographics'
  }
];

const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    source: 'Google Ads',
    created_at: '2024-12-15',
    status: 'new'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    source: 'LinkedIn',
    created_at: '2024-12-14',
    status: 'contacted'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@startup.io',
    source: 'Meta',
    created_at: '2024-12-13',
    status: 'qualified'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@enterprise.com',
    source: 'Direct',
    created_at: '2024-12-12',
    status: 'converted'
  }
];

const mockTemplates = [
  {
    id: '1',
    name: 'Holiday Sale Campaign',
    description: 'Proven template for seasonal sales with high conversion rates',
    category: 'E-commerce',
    platform: 'Google Ads',
    rating: 4.8,
    uses: 1247
  },
  {
    id: '2',
    name: 'B2B Lead Generation',
    description: 'Comprehensive template for B2B lead acquisition',
    category: 'B2B',
    platform: 'LinkedIn',
    rating: 4.6,
    uses: 892
  },
  {
    id: '3',
    name: 'Brand Awareness Video',
    description: 'Video-first campaign template for brand awareness',
    category: 'Branding',
    platform: 'Meta',
    rating: 4.4,
    uses: 1567
  },
  {
    id: '4',
    name: 'Local Service Business',
    description: 'Location-based template for service businesses',
    category: 'Local',
    platform: 'Google Ads',
    rating: 4.7,
    uses: 743
  }
];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLeads(mockLeads);
      setTemplates(mockTemplates);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('autopilot-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  const addToSearchHistory = (term: string) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(item => item !== term)].slice(0, 10);
      localStorage.setItem('autopilot-search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('autopilot-search-history');
  };

  return (
    <SearchContext.Provider value={{
      campaigns,
      leads,
      templates,
      isLoading,
      searchHistory,
      setCampaigns,
      setLeads,
      setTemplates,
      addToSearchHistory,
      clearSearchHistory
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}