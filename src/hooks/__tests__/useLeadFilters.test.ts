import { renderHook, act } from '@testing-library/react';
import { useLeadFilters } from '../useLeadFilters';
import type { Lead } from '@/types';

// Mock leads for testing
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    source: 'website',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    source: 'social_media',
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString()
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    source: 'referral',
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString()
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    source: 'website',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString()
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    source: null, // Test null/undefined source
    created_at: new Date('2024-01-12').toISOString(),
    updated_at: new Date('2024-01-12').toISOString()
  }
];

describe('useLeadFilters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-25'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default filters and return all leads', () => {
    const { result } = renderHook(() => useLeadFilters(mockLeads));

    expect(result.current.filters).toEqual({
      source: [],
      dateRange: '',
      scoreRange: '',
      searchTerm: '',
      status: [],
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    expect(result.current.filteredLeads).toHaveLength(5);
    expect(result.current.totalResults).toBe(5);
  });

  it('should sort by created_at desc by default', () => {
    const { result } = renderHook(() => useLeadFilters(mockLeads));

    const sortedIds = result.current.filteredLeads.map(lead => lead.id);
    expect(sortedIds).toEqual(['4', '1', '5', '2', '3']); // newest to oldest
  });

  describe('source filtering', () => {
    it('should filter by single source', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          source: ['website']
        });
      });

      expect(result.current.filteredLeads).toHaveLength(2);
      expect(result.current.filteredLeads.every(lead => lead.source === 'website')).toBe(true);
    });

    it('should filter by multiple sources', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          source: ['website', 'social_media']
        });
      });

      expect(result.current.filteredLeads).toHaveLength(3);
      expect(result.current.filteredLeads.every(lead => 
        ['website', 'social_media'].includes(lead.source || '')
      )).toBe(true);
    });

    it('should filter leads with undefined source as "other"', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          source: ['other']
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1);
      expect(result.current.filteredLeads[0].id).toBe('5'); // Charlie Wilson with undefined source
    });
  });

  describe('status filtering', () => {
    it('should filter by single status', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          status: ['new']
        });
      });

      expect(result.current.filteredLeads).toHaveLength(2);
      expect(result.current.filteredLeads.every(lead => 
        (lead as any).status === 'new'
      )).toBe(true);
    });

    it('should filter by multiple statuses', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          status: ['new', 'contacted']
        });
      });

      expect(result.current.filteredLeads).toHaveLength(4);
      expect(result.current.filteredLeads.every(lead => 
        ['new', 'contacted'].includes((lead as any).status)
      )).toBe(true);
    });
  });

  describe('date range filtering', () => {
    it('should filter by date range 7 days', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '7'
        });
      });

      // Leads created after 2024-01-18 (7 days before 2024-01-25)
      expect(result.current.filteredLeads).toHaveLength(1); // only lead 4 (2024-01-20)
      expect(result.current.filteredLeads[0].id).toBe('4');
    });

    it('should filter by date range 14 days', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '14'
        });
      });

      // Leads created after 2024-01-11 (14 days before 2024-01-25)
      expect(result.current.filteredLeads).toHaveLength(3); // leads 1, 4, 5
      expect(result.current.filteredLeads.map(l => l.id).sort()).toEqual(['1', '4', '5']);
    });

    it('should filter by date range 30 days', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          dateRange: '30'
        });
      });

      // All leads are within 30 days
      expect(result.current.filteredLeads).toHaveLength(5);
    });
  });

  describe('score range filtering', () => {
    it('should filter by high score range', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          scoreRange: 'high'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1); // score >= 8, only John (9)
      expect(result.current.filteredLeads[0].id).toBe('1');
    });

    it('should filter by medium score range', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          scoreRange: 'medium'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(2); // score 5-7, Jane (6) and Charlie (7)
      expect(result.current.filteredLeads.map(l => l.id).sort()).toEqual(['2', '5']);
    });

    it('should filter by low score range', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          scoreRange: 'low'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1); // score 1-4, only Bob (3)
      expect(result.current.filteredLeads[0].id).toBe('3');
    });

    it('should filter by unscored range', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          scoreRange: 'unscored'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1); // score = 0, only Alice (0)
      expect(result.current.filteredLeads[0].id).toBe('4');
    });
  });

  describe('search term filtering', () => {
    it('should filter by name', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'John'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(2); // John Doe and Bob Johnson
      expect(result.current.filteredLeads.map(l => l.id).sort()).toEqual(['1', '3']);
    });

    it('should filter by email', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'alice@'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1);
      expect(result.current.filteredLeads[0].id).toBe('4');
    });

    it('should filter by source', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'referral'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1);
      expect(result.current.filteredLeads[0].id).toBe('3');
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'JANE'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1);
      expect(result.current.filteredLeads[0].id).toBe('2');
    });

    it('should handle partial matches', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          searchTerm: 'example'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(5); // All emails contain 'example'
    });
  });

  describe('sorting', () => {
    it('should sort by name ascending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'name',
          sortOrder: 'asc'
        });
      });

      const names = result.current.filteredLeads.map(lead => lead.name);
      expect(names).toEqual(['Alice Brown', 'Bob Johnson', 'Charlie Wilson', 'Jane Smith', 'John Doe']);
    });

    it('should sort by name descending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'name',
          sortOrder: 'desc'
        });
      });

      const names = result.current.filteredLeads.map(lead => lead.name);
      expect(names).toEqual(['John Doe', 'Jane Smith', 'Charlie Wilson', 'Bob Johnson', 'Alice Brown']);
    });

    it('should sort by email ascending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'email',
          sortOrder: 'asc'
        });
      });

      const emails = result.current.filteredLeads.map(lead => lead.email);
      expect(emails).toEqual(['alice@example.com', 'bob@example.com', 'charlie@example.com', 'jane@example.com', 'john@example.com']);
    });

    it('should sort by source ascending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'source',
          sortOrder: 'asc'
        });
      });

      const sources = result.current.filteredLeads.map(lead => lead.source || '');
      expect(sources).toEqual(['', 'referral', 'social_media', 'website', 'website']);
    });

    it('should sort by score ascending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'score',
          sortOrder: 'asc'
        });
      });

      const scores = result.current.filteredLeads.map(lead => (lead as any).score);
      expect(scores).toEqual([0, 3, 6, 7, 9]);
    });

    it('should sort by score descending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'score',
          sortOrder: 'desc'
        });
      });

      const scores = result.current.filteredLeads.map(lead => (lead as any).score);
      expect(scores).toEqual([9, 7, 6, 3, 0]);
    });

    it('should sort by created_at ascending', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          sortBy: 'created_at',
          sortOrder: 'asc'
        });
      });

      const ids = result.current.filteredLeads.map(lead => lead.id);
      expect(ids).toEqual(['3', '2', '5', '1', '4']); // oldest to newest
    });
  });

  describe('combined filters', () => {
    it('should apply multiple filters together', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          source: ['website'],
          status: ['new'],
          scoreRange: 'high',
          dateRange: '',
          searchTerm: '',
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(1); // Only John Doe matches all criteria
      expect(result.current.filteredLeads[0].id).toBe('1');
    });

    it('should return empty array when no leads match all filters', () => {
      const { result } = renderHook(() => useLeadFilters(mockLeads));

      act(() => {
        result.current.setFilters({
          source: ['website'],
          status: ['qualified'],
          scoreRange: '',
          dateRange: '',
          searchTerm: '',
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
      });

      expect(result.current.filteredLeads).toHaveLength(0);
      expect(result.current.totalResults).toBe(0);
    });
  });

  it('should handle empty leads array', () => {
    const { result } = renderHook(() => useLeadFilters([]));

    expect(result.current.filteredLeads).toHaveLength(0);
    expect(result.current.totalResults).toBe(0);

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        source: ['website']
      });
    });

    expect(result.current.filteredLeads).toHaveLength(0);
    expect(result.current.totalResults).toBe(0);
  });

  it('should update filters correctly', () => {
    const { result } = renderHook(() => useLeadFilters(mockLeads));

    act(() => {
      result.current.setFilters({
        source: ['website'],
        status: ['new'],
        scoreRange: 'high',
        dateRange: '7',
        searchTerm: 'test',
        sortBy: 'name',
        sortOrder: 'asc'
      });
    });

    expect(result.current.filters).toEqual({
      source: ['website'],
      status: ['new'],
      scoreRange: 'high',
      dateRange: '7',
      searchTerm: 'test',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  });
});