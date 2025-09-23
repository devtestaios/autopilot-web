import { renderHook, act } from '@testing-library/react';
import { useCampaignFilters } from '../useCampaignFilters';
import type { Campaign } from '@/types';

// Mock campaigns for testing
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Google Campaign 1',
    platform: 'google_ads',
    client_name: 'Client A',
    status: 'active',
    budget: 500,
    spend: 200,
    metrics: {},
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    name: 'Meta Campaign 2',
    platform: 'meta',
    client_name: 'Client B',
    status: 'paused',
    budget: 2000,
    spend: 800,
    metrics: {},
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString()
  },
  {
    id: '3',
    name: 'LinkedIn Campaign 3',
    platform: 'linkedin',
    client_name: 'Client C',
    status: 'active',
    budget: 8000,
    spend: 3000,
    metrics: {},
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString()
  },
  {
    id: '4',
    name: 'High Budget Campaign',
    platform: 'google_ads',
    client_name: 'Client D',
    status: 'ended',
    budget: 75000,
    spend: 50000,
    metrics: {},
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString()
  },
  {
    id: '5',
    name: 'No Budget Campaign',
    platform: 'meta',
    client_name: 'Client E',
    status: 'active',
    budget: undefined,
    spend: 0,
    metrics: {},
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString()
  }
];

describe('useCampaignFilters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-25'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default filters and return all campaigns', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    expect(result.current.filters).toEqual({
      platform: [],
      status: [],
      budgetRange: '',
      dateRange: '',
      searchTerm: ''
    });
    expect(result.current.filteredCampaigns).toHaveLength(5);
    expect(result.current.totalResults).toBe(5);
  });

  it('should filter by platform', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        platform: ['google_ads']
      });
    });

    expect(result.current.filteredCampaigns).toHaveLength(2);
    expect(result.current.filteredCampaigns.every(c => c.platform === 'google_ads')).toBe(true);
    expect(result.current.totalResults).toBe(2);
  });

  it('should filter by multiple platforms', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        platform: ['google_ads', 'meta']
      });
    });

    expect(result.current.filteredCampaigns).toHaveLength(4); // 2 google_ads + 2 meta campaigns
    expect(result.current.filteredCampaigns.every(c => 
      ['google_ads', 'meta'].includes(c.platform)
    )).toBe(true);
  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        status: ['active']
      });
    });

    expect(result.current.filteredCampaigns).toHaveLength(3);
    expect(result.current.filteredCampaigns.every(c => c.status === 'active')).toBe(true);
  });

  it('should filter by multiple statuses', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        status: ['active', 'paused']
      });
    });

    expect(result.current.filteredCampaigns).toHaveLength(4);
    expect(result.current.filteredCampaigns.every(c => 
      ['active', 'paused'].includes(c.status)
    )).toBe(true);
  });

  describe('budget range filtering', () => {
    it('should filter by budget range 0-1000', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          budgetRange: '0-1000'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(2); // budget 500 and undefined (0)
      expect(result.current.filteredCampaigns.every(c => 
        (c.budget || 0) < 1000
      )).toBe(true);
    });

    it('should filter by budget range 1000-5000', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          budgetRange: '1000-5000'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1); // budget 2000
      expect(result.current.filteredCampaigns[0].budget).toBe(2000);
    });

    it('should filter by budget range 5000-10000', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          budgetRange: '5000-10000'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1); // budget 8000
      expect(result.current.filteredCampaigns[0].budget).toBe(8000);
    });

    it('should filter by budget range 10000-50000', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          budgetRange: '10000-50000'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(0); // no campaigns in this range
    });

    it('should filter by budget range 50000+', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          budgetRange: '50000+'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1); // budget 75000
      expect(result.current.filteredCampaigns[0].budget).toBe(75000);
    });
  });

  describe('date range filtering', () => {
    it('should filter by date range 7 days', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '7'
        });
      });

      // Campaigns created after 2024-01-18 (7 days before 2024-01-25)
      expect(result.current.filteredCampaigns).toHaveLength(1); // only campaign 5 (2024-01-20)
      expect(result.current.filteredCampaigns[0].id).toBe('5');
    });

    it('should filter by date range 14 days', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '14'
        });
      });

      // Campaigns created after 2024-01-11 (14 days before 2024-01-25)
      expect(result.current.filteredCampaigns).toHaveLength(2); // campaigns 1 and 5
      expect(result.current.filteredCampaigns.map(c => c.id).sort()).toEqual(['1', '5']);
    });

    it('should filter by date range 30 days', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '30'
        });
      });

      // All campaigns are within 30 days
      expect(result.current.filteredCampaigns).toHaveLength(5);
    });
  });

  describe('search term filtering', () => {
    it('should filter by campaign name', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'Google Campaign 1'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('Google Campaign 1');
    });

    it('should filter by client name', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'Client B'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].client_name).toBe('Client B');
    });

    it('should filter by platform name', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'linkedin'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].platform).toBe('linkedin');
    });

    it('should filter by status', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'paused'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].status).toBe('paused');
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'CLIENT B'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(1);
      expect(result.current.filteredCampaigns[0].name).toBe('Meta Campaign 2');
    });

    it('should handle partial matches', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'Budget'
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(2); // 'High Budget Campaign' and 'No Budget Campaign'
    });
  });

  describe('combined filters', () => {
    it('should apply multiple filters together', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          platform: ['google_ads', 'meta'],
          status: ['active'],
          budgetRange: '0-1000',
          dateRange: '',
          searchTerm: ''
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(2); // campaigns 1 and 5
      expect(result.current.filteredCampaigns.every(c => 
        ['google_ads', 'meta'].includes(c.platform) && 
        c.status === 'active' && 
        (c.budget || 0) < 1000
      )).toBe(true);
    });

    it('should return empty array when no campaigns match all filters', () => {
      const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

      act(() => {
        result.current.setFilters({
          platform: ['linkedin'],
          status: ['paused'],
          budgetRange: '',
          dateRange: '',
          searchTerm: ''
        });
      });

      expect(result.current.filteredCampaigns).toHaveLength(0);
      expect(result.current.totalResults).toBe(0);
    });
  });

  it('should handle empty campaigns array', () => {
    const { result } = renderHook(() => useCampaignFilters([]));

    expect(result.current.filteredCampaigns).toHaveLength(0);
    expect(result.current.totalResults).toBe(0);

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        platform: ['google_ads']
      });
    });

    expect(result.current.filteredCampaigns).toHaveLength(0);
    expect(result.current.totalResults).toBe(0);
  });

  it('should update filters correctly', () => {
    const { result } = renderHook(() => useCampaignFilters(mockCampaigns));

    act(() => {
      result.current.setFilters({
        platform: ['google_ads'],
        status: ['active'],
        budgetRange: '1000-5000',
        dateRange: '7',
        searchTerm: 'test'
      });
    });

    expect(result.current.filters).toEqual({
      platform: ['google_ads'],
      status: ['active'],
      budgetRange: '1000-5000',
      dateRange: '7',
      searchTerm: 'test'
    });
  });
});