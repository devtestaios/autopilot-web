'use client';

import { useState, useMemo } from 'react';
import type { Lead } from '@/types';

export interface LeadFilters {
  source: string[];
  dateRange: string;
  scoreRange: string;
  searchTerm: string;
  status: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const defaultFilters: LeadFilters = {
  source: [],
  dateRange: '',
  scoreRange: '',
  searchTerm: '',
  status: [],
  sortBy: 'created_at',
  sortOrder: 'desc'
};

export function useLeadFilters(leads: Lead[]) {
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);

  const filteredLeads = useMemo(() => {
    let filtered = leads.filter((lead) => {
      // Source filter
      if (filters.source.length > 0 && !filters.source.includes(lead.source || 'other')) {
        return false;
      }

      // Status filter (assuming leads have a status field)
      if (filters.status.length > 0) {
        const leadStatus = (lead as any).status || 'new';
        if (!filters.status.includes(leadStatus)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        const daysAgo = parseInt(filters.dateRange);
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        if (leadDate < cutoffDate) return false;
      }

      // Score range filter (assuming leads have a score field)
      if (filters.scoreRange) {
        const score = (lead as any).score || 0;
        switch (filters.scoreRange) {
          case 'high':
            if (score < 8) return false;
            break;
          case 'medium':
            if (score < 5 || score >= 8) return false;
            break;
          case 'low':
            if (score < 1 || score >= 5) return false;
            break;
          case 'unscored':
            if (score > 0) return false;
            break;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          lead.name || '',
          lead.email,
          lead.source || '',
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchLower)) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'source':
          aValue = a.source || '';
          bValue = b.source || '';
          break;
        case 'score':
          aValue = (a as any).score || 0;
          bValue = (b as any).score || 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (aValue < bValue) {
        return filters.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return filters.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [leads, filters]);

  return {
    filters,
    setFilters,
    filteredLeads,
    totalResults: filteredLeads.length
  };
}