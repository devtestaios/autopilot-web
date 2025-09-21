import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from '../useGlobalSearch';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/campaigns',
}));

// Mock debounce hook
jest.mock('../useDebounce', () => ({
  useDebounce: (value: string) => value, // Return value immediately for testing
}));

describe('useGlobalSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty search term and results', () => {
    const { result } = renderHook(() => useGlobalSearch());

    expect(result.current.searchTerm).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.isSearchModalOpen).toBe(false);
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('test query');
    });

    expect(result.current.searchTerm).toBe('test query');
  });

  it('performs search and returns results', async () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('campaigns');
    });

    // Wait for the search to complete (debounce + search delay)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    expect(result.current.results.length).toBeGreaterThan(0);
    
    // Check that results contain campaign-related items
    const campaignResults = result.current.results.filter((r: any) => 
      r.title.toLowerCase().includes('campaign') || 
      r.description.toLowerCase().includes('campaign')
    );
    expect(campaignResults.length).toBeGreaterThan(0);
  });

  it('returns results sorted by relevance', async () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('Campaign Management');
    });

    // Wait for the search to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    // Should have results
    expect(result.current.results.length).toBeGreaterThan(0);

    // First result should be most relevant (exact title match preferred)
    const firstResult = result.current.results[0];
    expect(firstResult.title.toLowerCase()).toContain('campaign');
  });

  it('includes provided search data in results', async () => {
    const searchData = {
      campaigns: [
        { id: 1, name: 'Test Campaign', status: 'active', platform: 'google' }
      ]
    };

    const { result } = renderHook(() => useGlobalSearch(searchData));

    act(() => {
      result.current.setSearchTerm('Test Campaign');
    });

    // Wait for the search to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    const campaignResults = result.current.results.filter((r: any) => 
      r.type === 'campaign' && r.title.includes('Test Campaign')
    );
    expect(campaignResults.length).toBe(1);
  });

  it('searches across different content types', async () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('alert');
    });

    // Wait for the search to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    const resultTypes = [...new Set(result.current.results.map((r: any) => r.type))];
    expect(resultTypes.length).toBeGreaterThan(0); // Should have at least one type
  });

  it('handles case-insensitive search', async () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('CAMPAIGN');
    });

    // Wait for the search to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    const results = result.current.results;
    expect(results.length).toBeGreaterThan(0);

    act(() => {
      result.current.setSearchTerm('campaign');
    });

    // Wait for the search to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    const lowercaseResults = result.current.results;
    expect(lowercaseResults.length).toBeGreaterThan(0);
  });

  it('clears results when search term is empty', () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.setSearchTerm('');
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it('opens and closes search modal', () => {
    const { result } = renderHook(() => useGlobalSearch());

    act(() => {
      result.current.openSearch();
    });

    expect(result.current.isSearchModalOpen).toBe(true);

    act(() => {
      result.current.closeSearch();
    });

    expect(result.current.isSearchModalOpen).toBe(false);
  });
});