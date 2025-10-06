import React, { useState, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';

// Simple utility hooks that we can test reliably
const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return [value, { toggle, setTrue, setFalse }];
};

const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

// Simple context for testing
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

describe('Simplified React Hooks and Context Testing', () => {
  // Mock localStorage for testing
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
  });

  describe('Custom Hook Testing', () => {
    test('useLocalStorage hook', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      expect(result.current[0]).toBe('initial');
      
      act(() => {
        result.current[1]('updated');
      });
      
      expect(result.current[0]).toBe('updated');
      expect(localStorageMock.getItem('test-key')).toBe('"updated"');
    });

    test('useToggle hook', () => {
      const { result } = renderHook(() => useToggle(false));
      
      expect(result.current[0]).toBe(false);
      
      act(() => {
        result.current[1].toggle();
      });
      
      expect(result.current[0]).toBe(true);
      
      act(() => {
        result.current[1].setFalse();
      });
      
      expect(result.current[0]).toBe(false);
      
      act(() => {
        result.current[1].setTrue();
      });
      
      expect(result.current[0]).toBe(true);
    });

    test('useCounter hook', () => {
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
        result.current.reset();
      });
      
      expect(result.current.count).toBe(5);
    });
  });

  describe('Context Provider Testing', () => {
    test('ThemeProvider functionality', () => {
      const TestComponent = () => {
        const { theme, toggleTheme } = React.useContext(ThemeContext);
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button data-testid="toggle" onClick={toggleTheme}>
              Toggle Theme
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      
      act(() => {
        screen.getByTestId('toggle').click();
      });
      
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('State Management Patterns', () => {
    test('Multiple state updates', () => {
      const { result } = renderHook(() => {
        const [count, setCount] = useState(0);
        const [name, setName] = useState('');
        const [active, setActive] = useState(false);
        
        return {
          count, setCount,
          name, setName,
          active, setActive
        };
      });
      
      expect(result.current.count).toBe(0);
      expect(result.current.name).toBe('');
      expect(result.current.active).toBe(false);
      
      act(() => {
        result.current.setCount(10);
        result.current.setName('test');
        result.current.setActive(true);
      });
      
      expect(result.current.count).toBe(10);
      expect(result.current.name).toBe('test');
      expect(result.current.active).toBe(true);
    });

    test('Derived state calculations', () => {
      const { result } = renderHook(() => {
        const [items, setItems] = useState<string[]>([]);
        const count = items.length;
        const isEmpty = count === 0;
        const hasItems = count > 0;
        
        return {
          items, setItems,
          count, isEmpty, hasItems
        };
      });
      
      expect(result.current.count).toBe(0);
      expect(result.current.isEmpty).toBe(true);
      expect(result.current.hasItems).toBe(false);
      
      act(() => {
        result.current.setItems(['item1', 'item2']);
      });
      
      expect(result.current.count).toBe(2);
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.hasItems).toBe(true);
    });
  });

  describe('Effect Hook Patterns', () => {
    test('useEffect with cleanup', () => {
      let cleanupCalled = false;
      
      const { unmount } = renderHook(() => {
        useEffect(() => {
          return () => {
            cleanupCalled = true;
          };
        }, []);
      });
      
      expect(cleanupCalled).toBe(false);
      
      unmount();
      
      expect(cleanupCalled).toBe(true);
    });

    test('useEffect with dependencies', () => {
      let effectCallCount = 0;
      
      const { rerender } = renderHook(
        ({ value }) => {
          useEffect(() => {
            effectCallCount++;
          }, [value]);
        },
        { initialProps: { value: 'initial' } }
      );
      
      expect(effectCallCount).toBe(1);
      
      // Same value, effect shouldn't run again
      rerender({ value: 'initial' });
      expect(effectCallCount).toBe(1);
      
      // Different value, effect should run
      rerender({ value: 'updated' });
      expect(effectCallCount).toBe(2);
    });
  });
});