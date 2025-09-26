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

// Mock search data
const mockSearchData = {
  campaigns: [
    {
      id: '1',
      name: 'Test Campaign',
      platform: 'google_ads',
      status: 'active',
      budget: 1000
    },
    {
      id: '2', 
      name: 'Facebook Campaign',
      platform: 'meta',
      status: 'paused',
      budget: 500
    }
  ],
  leads: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      source: 'website',
      created_at: '2024-01-15'
    }
  ]
};

describe('useGlobalSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty search term and results', () => {
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.isSearchModalOpen).toBe(false);
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

    act(() => {
      result.current.setSearchTerm('test query');
    });

    expect(result.current.searchTerm).toBe('test query');
  });

  it('performs search and returns results', async () => {
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

    act(() => {
      result.current.setSearchTerm('campaign');
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
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

    act(() => {
      result.current.setSearchTerm('campaign');
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
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

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
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

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
    const { result } = renderHook(() => useGlobalSearch(mockSearchData));

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

  describe('Keyboard Shortcuts', () => {
    it('opens search modal with Cmd+K on Mac', () => {
      const { result } = renderHook(() => useGlobalSearch());

      expect(result.current.isSearchModalOpen).toBe(false);

      // Simulate Cmd+K keydown event
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        bubbles: true
      });

      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
        writable: true
      });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(result.current.isSearchModalOpen).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('opens search modal with Ctrl+K on Windows/Linux', () => {
      const { result } = renderHook(() => useGlobalSearch());

      expect(result.current.isSearchModalOpen).toBe(false);

      // Simulate Ctrl+K keydown event
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: false,
        ctrlKey: true,
        bubbles: true
      });

      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
        writable: true
      });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(result.current.isSearchModalOpen).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('ignores other key combinations', () => {
      const { result } = renderHook(() => useGlobalSearch());

      expect(result.current.isSearchModalOpen).toBe(false);

      // Simulate other key combinations that should be ignored
      const events = [
        new KeyboardEvent('keydown', { key: 'j', metaKey: true }),
        new KeyboardEvent('keydown', { key: 'k', shiftKey: true }),
        new KeyboardEvent('keydown', { key: 'k' }), // no modifier
      ];

      events.forEach(event => {
        act(() => {
          document.dispatchEvent(event);
        });
      });

      expect(result.current.isSearchModalOpen).toBe(false);
    });

    it('cleans up event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = renderHook(() => useGlobalSearch());
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });
});