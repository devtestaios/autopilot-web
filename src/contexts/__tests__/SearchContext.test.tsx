import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SearchProvider, useSearchContext } from '../SearchContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Test component to access search context
const TestComponent = ({ onSearchStateChange }: { onSearchStateChange?: (state: any) => void }) => {
  const searchContext = useSearchContext();
  
  React.useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(searchContext);
    }
  }, [searchContext, onSearchStateChange]);

  return (
    <div>
      <div data-testid="campaigns-length">{(searchContext.campaigns || []).length}</div>
      <div data-testid="leads-length">{(searchContext.leads || []).length}</div>
      <div data-testid="templates-length">{(searchContext.templates || []).length}</div>
      <div data-testid="loading">{searchContext.isLoading ? 'loading' : 'idle'}</div>
      <div data-testid="search-history-length">{searchContext.searchHistory.length}</div>
      
      <button 
        data-testid="set-campaigns-button" 
        onClick={() => searchContext.setCampaigns([{ id: '1', name: 'Test Campaign' }])}
      >
        Set Campaigns
      </button>
      
      <button 
        data-testid="set-leads-button" 
        onClick={() => searchContext.setLeads([{ id: '1', name: 'Test Lead' }])}
      >
        Set Leads
      </button>
      
      <button 
        data-testid="set-templates-button" 
        onClick={() => searchContext.setTemplates([{ id: '1', name: 'Test Template' }])}
      >
        Set Templates
      </button>
      
      <button 
        data-testid="add-search-history-button" 
        onClick={() => searchContext.addToSearchHistory('test search')}
      >
        Add Search History
      </button>
      
      <button 
        data-testid="clear-search-history-button" 
        onClick={() => searchContext.clearSearchHistory()}
      >
        Clear Search History
      </button>
    </div>
  );
};

describe('SearchContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock to clean state
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.removeItem.mockImplementation(() => {});
    mockLocalStorage.clear.mockImplementation(() => {});
  });

  describe('Provider Initialization', () => {
    it('should provide search context with default state', async () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Check initial state
      expect(screen.getByTestId('campaigns-length')).toHaveTextContent('0');
      expect(screen.getByTestId('leads-length')).toHaveTextContent('0');
      expect(screen.getByTestId('templates-length')).toHaveTextContent('0');
      expect(screen.getByTestId('search-history-length')).toHaveTextContent('0');
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // Wait for loading to complete (increased timeout for mock data loading)
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      }, { timeout: 5000 });

      // Check that all button functions are available
      expect(screen.getByTestId('set-campaigns-button')).toBeInTheDocument();
      expect(screen.getByTestId('set-leads-button')).toBeInTheDocument();
      expect(screen.getByTestId('set-templates-button')).toBeInTheDocument();
      expect(screen.getByTestId('add-search-history-button')).toBeInTheDocument();
      expect(screen.getByTestId('clear-search-history-button')).toBeInTheDocument();
    });

    it('should load mock data on initialization', async () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Wait for loading to complete and mock data to be loaded
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      }, { timeout: 3000 });

      // Should have mock campaigns
      expect(parseInt(screen.getByTestId('campaigns-length').textContent || '0')).toBeGreaterThan(0);
      // Should have mock leads
      expect(parseInt(screen.getByTestId('leads-length').textContent || '0')).toBeGreaterThan(0);
      // Should have mock templates
      expect(parseInt(screen.getByTestId('templates-length').textContent || '0')).toBeGreaterThan(0);
    });

    it('should load saved search history from localStorage on mount', () => {
      const savedHistory = ['search 1', 'search 2'];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedHistory));
      
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('2');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('autopilot-search-history');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Should fall back to empty search history
      expect(screen.getByTestId('search-history-length')).toHaveTextContent('0');
    });

    it('should handle missing localStorage gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      expect(() => {
        render(
          <SearchProvider>
            <TestComponent />
          </SearchProvider>
        );
      }).not.toThrow();

      // Should work with empty search history
      expect(screen.getByTestId('search-history-length')).toHaveTextContent('0');
    });
  });

  describe('Data Management', () => {
    it('should update campaigns data', () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      const setCampaignsButton = screen.getByTestId('set-campaigns-button');
      act(() => {
        fireEvent.click(setCampaignsButton);
      });

      expect(screen.getByTestId('campaigns-length')).toHaveTextContent('1');
    });

    it('should update leads data', () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      const setLeadsButton = screen.getByTestId('set-leads-button');
      act(() => {
        fireEvent.click(setLeadsButton);
      });

      expect(screen.getByTestId('leads-length')).toHaveTextContent('1');
    });

    it('should update templates data', () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      const setTemplatesButton = screen.getByTestId('set-templates-button');
      act(() => {
        fireEvent.click(setTemplatesButton);
      });

      expect(screen.getByTestId('templates-length')).toHaveTextContent('1');
    });

    it('should handle empty data arrays', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      act(() => {
        searchState.setCampaigns([]);
        searchState.setLeads([]);
        searchState.setTemplates([]);
      });

      expect(screen.getByTestId('campaigns-length')).toHaveTextContent('0');
      expect(screen.getByTestId('leads-length')).toHaveTextContent('0');
      expect(screen.getByTestId('templates-length')).toHaveTextContent('0');
    });
  });

  describe('Search History Management', () => {
    it('should add search terms to history', () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      const addHistoryButton = screen.getByTestId('add-search-history-button');
      act(() => {
        fireEvent.click(addHistoryButton);
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('1');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'autopilot-search-history',
        JSON.stringify(['test search'])
      );
    });

    it('should clear search history', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['old search']));
      
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Should start with saved history
      expect(screen.getByTestId('search-history-length')).toHaveTextContent('1');

      const clearHistoryButton = screen.getByTestId('clear-search-history-button');
      act(() => {
        fireEvent.click(clearHistoryButton);
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('0');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('autopilot-search-history');
    });

    it('should prevent duplicate search terms', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      act(() => {
        searchState.addToSearchHistory('test search');
        searchState.addToSearchHistory('test search'); // Duplicate
        searchState.addToSearchHistory('another search');
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('2');
    });

    it('should limit search history to 10 items', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      // Add 12 search terms
      act(() => {
        for (let i = 1; i <= 12; i++) {
          searchState.addToSearchHistory(`search ${i}`);
        }
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('10');
    });

    it('should handle empty search terms gracefully', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      act(() => {
        searchState.addToSearchHistory('');
        searchState.addToSearchHistory('   '); // Whitespace only
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('0');
    });
  });

  describe('Loading State', () => {
    it('should eventually show loading state as false', async () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      }, { timeout: 3000 });
    });

    it('should manage loading state through provider lifecycle', async () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('idle');
      }, { timeout: 3000 });
    });
  });

  describe('Hook Usage', () => {
    it('should throw error when useSearchContext is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      const TestComponentOutsideProvider = () => {
        useSearchContext();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow('useSearchContext must be used within a SearchProvider');

      console.error = originalError;
    });

    it('should provide all required context values', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      // Check all required properties exist
      expect(searchState).toHaveProperty('campaigns');
      expect(searchState).toHaveProperty('leads');
      expect(searchState).toHaveProperty('templates');
      expect(searchState).toHaveProperty('isLoading');
      expect(searchState).toHaveProperty('searchHistory');
      expect(searchState).toHaveProperty('setCampaigns');
      expect(searchState).toHaveProperty('setLeads');
      expect(searchState).toHaveProperty('setTemplates');
      expect(searchState).toHaveProperty('addToSearchHistory');
      expect(searchState).toHaveProperty('clearSearchHistory');
    });
  });

  describe('LocalStorage Integration', () => {
    it('should save search history to localStorage', () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      const addHistoryButton = screen.getByTestId('add-search-history-button');
      act(() => {
        fireEvent.click(addHistoryButton);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'autopilot-search-history',
        expect.stringContaining('test search')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      // Set up localStorage to throw error after component mounts
      let shouldThrow = false;
      mockLocalStorage.setItem.mockImplementation(() => {
        if (shouldThrow) {
          throw new Error('localStorage full');
        }
      });

      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>
      );

      // Now make localStorage throw errors
      shouldThrow = true;

      // Should not throw error when localStorage fails
      expect(() => {
        const addHistoryButton = screen.getByTestId('add-search-history-button');
        act(() => {
          fireEvent.click(addHistoryButton);
        });
      }).not.toThrow();
    });

    it('should recover from localStorage errors during initialization', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(
          <SearchProvider>
            <TestComponent />
          </SearchProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid data updates', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      // Perform multiple rapid updates
      act(() => {
        searchState.setCampaigns([{ id: '1' }]);
        searchState.setLeads([{ id: '1' }, { id: '2' }]);
        searchState.setTemplates([{ id: '1' }, { id: '2' }, { id: '3' }]);
      });

      expect(screen.getByTestId('campaigns-length')).toHaveTextContent('1');
      expect(screen.getByTestId('leads-length')).toHaveTextContent('2');
      expect(screen.getByTestId('templates-length')).toHaveTextContent('3');
    });

    it('should handle concurrent search history operations', () => {
      // Set up clean localStorage for this test
      mockLocalStorage.setItem.mockImplementation(() => {});
      
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      // Perform concurrent operations
      act(() => {
        searchState.addToSearchHistory('search 1');
        searchState.addToSearchHistory('search 2');
        searchState.addToSearchHistory('search 3');
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('3');
    });

    it('should handle special characters in search history', () => {
      // Set up clean localStorage for this test
      mockLocalStorage.setItem.mockImplementation(() => {});
      
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      const specialQuery = 'test @#$%^&*()_+-=[]{}|;:,.<>?';
      
      act(() => {
        searchState.addToSearchHistory(specialQuery);
      });

      expect(screen.getByTestId('search-history-length')).toHaveTextContent('1');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'autopilot-search-history',
        expect.stringContaining(specialQuery)
      );
    });

    it('should handle null and undefined data gracefully', () => {
      let searchState: any;
      
      render(
        <SearchProvider>
          <TestComponent onSearchStateChange={(state) => searchState = state} />
        </SearchProvider>
      );

      // Should handle invalid data by falling back to empty arrays
      expect(() => {
        act(() => {
          searchState.setCampaigns(null);
          searchState.setLeads(undefined);
        });
      }).not.toThrow();

      // Should display 0 for null/undefined arrays (graceful fallback)
      expect(screen.getByTestId('campaigns-length')).toHaveTextContent('0');
      expect(screen.getByTestId('leads-length')).toHaveTextContent('0');
    });
  });
});