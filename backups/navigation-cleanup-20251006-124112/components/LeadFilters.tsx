'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, Star, Calendar, Mail, User } from 'lucide-react';
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

interface LeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  totalResults: number;
  leads: Lead[];
}

const SOURCES = [
  { value: 'web', label: 'Website' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'ads', label: 'Paid Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' }
];

const DATE_RANGES = [
  { value: '', label: 'All Time' },
  { value: '1', label: 'Today' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 3 months' },
  { value: '365', label: 'Last year' }
];

const SCORE_RANGES = [
  { value: '', label: 'Any Score' },
  { value: 'high', label: 'High Quality (8-10)' },
  { value: 'medium', label: 'Medium Quality (5-7)' },
  { value: 'low', label: 'Low Quality (1-4)' },
  { value: 'unscored', label: 'Unscored' }
];

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' }
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'source', label: 'Source' },
  { value: 'score', label: 'Quality Score' }
];

export function LeadFiltersComponent({ filters, onFiltersChange, totalResults, leads }: LeadFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (key: keyof LeadFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleSource = (source: string) => {
    const newSources = filters.source.includes(source)
      ? filters.source.filter(s => s !== source)
      : [...filters.source, source];
    updateFilters('source', newSources);
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilters('status', newStatuses);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      source: [],
      dateRange: '',
      scoreRange: '',
      searchTerm: '',
      status: [],
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.source.length > 0 || 
                          filters.status.length > 0 || 
                          filters.dateRange || 
                          filters.scoreRange || 
                          filters.searchTerm ||
                          filters.sortBy !== 'created_at' ||
                          filters.sortOrder !== 'desc';

  // Get stats for the current filtered results
  const todayLeads = leads.filter(lead => {
    const today = new Date();
    const leadDate = new Date(lead.created_at);
    return leadDate.toDateString() === today.toDateString();
  }).length;

  const sources = Array.from(new Set(leads.map(lead => lead.source || 'unknown')));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Lead Filters</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {isExpanded ? 'Less' : 'More'} filters
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {totalResults} lead{totalResults !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {todayLeads} today
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Quick Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search leads by name, email, or source..."
          value={filters.searchTerm}
          onChange={(e) => updateFilters('searchTerm', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Basic Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Source
          </label>
          <div className="space-y-2">
            {SOURCES.slice(0, isExpanded ? SOURCES.length : 3).map((source) => (
              <label key={source.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.source.includes(source.value)}
                  onChange={() => toggleSource(source.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{source.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilters('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {DATE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality Score
          </label>
          <select
            value={filters.scoreRange}
            onChange={(e) => updateFilters('scoreRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SCORE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => updateFilters('sortOrder', e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters (when expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Advanced Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Status
              </label>
              <div className="space-y-2">
                {STATUSES.map((status) => (
                  <label key={status.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={() => toggleStatus(status.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lead Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Quality
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Hot leads</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Qualified leads</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Needs follow-up</span>
                </label>
              </div>
            </div>

            {/* Campaign Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign
              </label>
              <input
                type="text"
                placeholder="Filter by campaign name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {filters.source.map((source) => (
              <span
                key={`source-${source}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                Source: {SOURCES.find(s => s.value === source)?.label}
                <button
                  onClick={() => toggleSource(source)}
                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.status.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
              >
                Status: {STATUSES.find(s => s.value === status)?.label}
                <button
                  onClick={() => toggleStatus(status)}
                  className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                Date: {DATE_RANGES.find(d => d.value === filters.dateRange)?.label}
                <button
                  onClick={() => updateFilters('dateRange', '')}
                  className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.scoreRange && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                Score: {SCORE_RANGES.find(s => s.value === filters.scoreRange)?.label}
                <button
                  onClick={() => updateFilters('scoreRange', '')}
                  className="text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                Search: {filters.searchTerm}
                <button
                  onClick={() => updateFilters('searchTerm', '')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}