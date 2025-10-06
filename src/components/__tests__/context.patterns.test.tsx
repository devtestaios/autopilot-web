import React, { createContext, useContext, useState, useEffect } from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock theme context and hooks (common patterns in the app)
interface MockThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MockThemeContext = createContext<MockThemeContextType | undefined>(undefined);

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <MockThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </MockThemeContext.Provider>
  );
};

const useMockTheme = () => {
  const context = useContext(MockThemeContext);
  if (context === undefined) {
    throw new Error('useMockTheme must be used within a MockThemeProvider');
  }
  return context;
};

// Custom hooks testing patterns
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return { value, toggle, setTrue, setFalse };
};

const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  const setValue = (value: number) => setCount(value);
  
  return { count, increment, decrement, reset, setValue };
};

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock fetch implementation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (url.includes('error')) {
        throw new Error('API Error');
      }
      
      const mockData = { id: 1, name: 'Test Data' } as T;
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

// Component testing patterns
const TestButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} data-testid="test-button">
    {children}
  </button>
);

const ThemeToggleComponent: React.FC = () => {
  const { theme, toggleTheme } = useMockTheme();
  
  return (
    <div data-testid="theme-component">
      <span data-testid="theme-display">Current theme: {theme}</span>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Toggle Theme
      </button>
    </div>
  );
};

const CounterComponent: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div data-testid="counter-component">
      <span data-testid="count-display">{count}</span>
      <button onClick={increment} data-testid="increment">+</button>
      <button onClick={decrement} data-testid="decrement">-</button>
      <button onClick={reset} data-testid="reset">Reset</button>
    </div>
  );
};

describe('Context and Hooks Testing Patterns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Theme Context Testing', () => {
    test('provides theme context value', () => {
      render(
        <MockThemeProvider>
          <ThemeToggleComponent />
        </MockThemeProvider>
      );

      expect(screen.getByTestId('theme-display')).toHaveTextContent('Current theme: light');
    });

    test('toggles theme on button click', () => {
      render(
        <MockThemeProvider>
          <ThemeToggleComponent />
        </MockThemeProvider>
      );

      const toggleButton = screen.getByTestId('theme-toggle');
      const themeDisplay = screen.getByTestId('theme-display');

      expect(themeDisplay).toHaveTextContent('light');
      
      fireEvent.click(toggleButton);
      expect(themeDisplay).toHaveTextContent('dark');
      
      fireEvent.click(toggleButton);
      expect(themeDisplay).toHaveTextContent('light');
    });

    test('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<ThemeToggleComponent />);
      }).toThrow('useMockTheme must be used within a MockThemeProvider');
      
      consoleError.mockRestore();
    });

    test('persists theme to localStorage', () => {
      render(
        <MockThemeProvider>
          <ThemeToggleComponent />
        </MockThemeProvider>
      );

      fireEvent.click(screen.getByTestId('theme-toggle'));
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('Custom Hooks Testing', () => {
    test('useToggle hook functionality', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current.value).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.value).toBe(true);

      act(() => {
        result.current.setFalse();
      });
      expect(result.current.value).toBe(false);

      act(() => {
        result.current.setTrue();
      });
      expect(result.current.value).toBe(true);
    });

    test('useToggle with initial value', () => {
      const { result } = renderHook(() => useToggle(true));

      expect(result.current.value).toBe(true);
    });

    test('useCounter hook functionality', () => {
      const { result } = renderHook(() => useCounter(5));

      expect(result.current.count).toBe(5);

      act(() => {
        result.current.increment();
      });
      expect(result.current.count).toBe(6);

      act(() => {
        result.current.decrement();
      });
      expect(result.current.count).toBe(5);

      act(() => {
        result.current.setValue(10);
      });
      expect(result.current.count).toBe(10);

      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(5);
    });

    test('useLocalStorage hook functionality', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify('stored value'));
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('stored value');

      act(() => {
        result.current[1]('new value');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
    });

    test('useLocalStorage with function setValue', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('counter', JSON.stringify(1));
    });

    test('useApi hook success case', async () => {
      const { result } = renderHook(() => useApi<{ id: number; name: string }>('/api/test'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ id: 1, name: 'Test Data' });
      expect(result.current.error).toBe(null);
    });

    test('useApi hook error case', async () => {
      const { result } = renderHook(() => useApi('/api/error'));

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe('API Error');
    });

    test('useApi refetch functionality', async () => {
      const { result } = renderHook(() => useApi('/api/test'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.data).not.toBe(null);

      act(() => {
        result.current.refetch();
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('Component Integration Tests', () => {
    test('counter component functionality', () => {
      render(<CounterComponent />);

      const countDisplay = screen.getByTestId('count-display');
      const incrementButton = screen.getByTestId('increment');
      const decrementButton = screen.getByTestId('decrement');
      const resetButton = screen.getByTestId('reset');

      expect(countDisplay).toHaveTextContent('0');

      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('1');

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('3');

      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('2');

      fireEvent.click(resetButton);
      expect(countDisplay).toHaveTextContent('0');
    });

    test('multiple component instances are independent', () => {
      render(
        <div>
          <CounterComponent />
          <CounterComponent />
        </div>
      );

      const counters = screen.getAllByTestId('count-display');
      const incrementButtons = screen.getAllByTestId('increment');

      expect(counters[0]).toHaveTextContent('0');
      expect(counters[1]).toHaveTextContent('0');

      fireEvent.click(incrementButtons[0]);

      expect(counters[0]).toHaveTextContent('1');
      expect(counters[1]).toHaveTextContent('0');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useLocalStorage('test', 'value'));

      act(() => {
        result.current[1]('new value');
      });

      expect(consoleError).toHaveBeenCalledWith('Error saving to localStorage:', expect.any(Error));
      
      consoleError.mockRestore();
    });

    test('handles malformed localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() => useLocalStorage('test', 'default'));

      expect(result.current[0]).toBe('default');
    });

    test('handles rapid state updates', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.increment();
        }
      });

      expect(result.current.count).toBe(100);
    });
  });

  describe('Performance and Cleanup', () => {
    test('components clean up properly', () => {
      const { unmount } = render(<CounterComponent />);
      
      expect(() => unmount()).not.toThrow();
    });

    test('context providers clean up properly', () => {
      // Clear localStorage mock errors for this test
      localStorageMock.setItem.mockClear();
      
      const { unmount } = render(
        <MockThemeProvider>
          <div>Test content</div>
        </MockThemeProvider>
      );
      
      expect(() => unmount()).not.toThrow();
    });
  });
});