import React, { createContext, useContext, useState, useEffect } from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Simple theme context for testing
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Test component
const ThemeButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="theme-display">Current: {theme}</span>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Toggle
      </button>
    </div>
  );
};

// Custom hooks for testing
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return { value, toggle, setTrue, setFalse };
};

describe('React Patterns - Context and Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Theme Context', () => {
    test('provides theme context value', () => {
      render(
        <ThemeProvider>
          <ThemeButton />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-display')).toHaveTextContent('Current: light');
    });

    test('toggles theme correctly', () => {
      render(
        <ThemeProvider>
          <ThemeButton />
        </ThemeProvider>
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
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<ThemeButton />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleError.mockRestore();
    });
  });

  describe('Custom Hooks', () => {
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
        result.current.reset();
      });
      expect(result.current.count).toBe(5);
    });

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
  });

  describe('Integration Tests', () => {
    test('multiple theme context instances are independent', () => {
      render(
        <div>
          <ThemeProvider>
            <ThemeButton />
          </ThemeProvider>
          <ThemeProvider>
            <ThemeButton />
          </ThemeProvider>
        </div>
      );

      const themeDisplays = screen.getAllByTestId('theme-display');
      const toggleButtons = screen.getAllByTestId('theme-toggle');

      expect(themeDisplays[0]).toHaveTextContent('light');
      expect(themeDisplays[1]).toHaveTextContent('light');

      fireEvent.click(toggleButtons[0]);

      expect(themeDisplays[0]).toHaveTextContent('dark');
      expect(themeDisplays[1]).toHaveTextContent('light');
    });

    test('hooks maintain state independence', () => {
      const { result: counter1 } = renderHook(() => useCounter(0));
      const { result: counter2 } = renderHook(() => useCounter(10));

      expect(counter1.current.count).toBe(0);
      expect(counter2.current.count).toBe(10);

      act(() => {
        counter1.current.increment();
      });

      expect(counter1.current.count).toBe(1);
      expect(counter2.current.count).toBe(10);
    });
  });

  describe('Error Handling', () => {
    test('context error boundaries work correctly', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleError.mockRestore();
    });

    test('hooks handle rapid state updates', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.increment();
        }
      });

      expect(result.current.count).toBe(100);
    });
  });

  describe('Cleanup and Performance', () => {
    test('components unmount cleanly', () => {
      const { unmount } = render(
        <ThemeProvider>
          <ThemeButton />
        </ThemeProvider>
      );
      
      expect(() => unmount()).not.toThrow();
    });

    test('hooks clean up properly', () => {
      const { unmount } = renderHook(() => useCounter());
      
      expect(() => unmount()).not.toThrow();
    });
  });
});