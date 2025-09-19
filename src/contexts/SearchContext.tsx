'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextData {
  campaigns: any[];
  leads: any[];
  setCampaigns: (campaigns: any[]) => void;
  setLeads: (leads: any[]) => void;
}

const SearchContext = createContext<SearchContextData | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  return (
    <SearchContext.Provider value={{
      campaigns,
      leads,
      setCampaigns,
      setLeads
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