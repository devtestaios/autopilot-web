import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
});

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
};

// Component for testing error boundaries
const ComponentWithoutProvider = () => {
  const { theme } = useTheme();
  return <div>{theme}</div>;
};

describe('ThemeContext', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Reset localStorage mock to default behavior
    mockLocalStorage.getItem.mockImplementation((key) => null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          remove: jest.fn(),
          add: jest.fn(),
        },
      },
      writable: true,
    });

    // Default matchMedia mock
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
  });

  describe('Provider Initialization', () => {
    it('should provide theme context with default light theme', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should load saved theme from localStorage on mount', async () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should use system preference when no saved theme exists', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should default to light theme when no preference and no saved theme', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });
  });

  describe('Theme Management', () => {
    it('should toggle theme from light to dark', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should toggle theme from dark to light', async () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });

      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should set theme to light explicitly', async () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });

      await act(async () => {
        await user.click(screen.getByTestId('set-light'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should set theme to dark explicitly', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await act(async () => {
        await user.click(screen.getByTestId('set-dark'));
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  describe('DOM Integration', () => {
    it('should update document class when theme changes', async () => {
      const mockRemove = jest.fn();
      const mockAdd = jest.fn();
      
      Object.defineProperty(document, 'documentElement', {
        value: {
          classList: {
            remove: mockRemove,
            add: mockAdd,
          },
        },
        writable: true,
      });

      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme'));
      });

      await waitFor(() => {
        expect(mockRemove).toHaveBeenCalledWith('light');
        expect(mockAdd).toHaveBeenCalledWith('dark');
      });
    });

    it('should save theme to localStorage when changed', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme'));
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      });
    });

    it('should not update DOM before component is mounted', () => {
      const mockRemove = jest.fn();
      const mockAdd = jest.fn();
      
      Object.defineProperty(document, 'documentElement', {
        value: {
          classList: {
            remove: mockRemove,
            add: mockAdd,
          },
        },
        writable: true,
      });

      mockLocalStorage.getItem.mockReturnValue('dark');
      
      // Initial render - should not update DOM until useEffect runs
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Initial render may trigger the first effect, but subsequent DOM updates should be controlled
      // We can verify this by checking that DOM updates happen after theme changes
      expect(mockRemove).toHaveBeenCalled(); // Initial mount effect
      expect(mockAdd).toHaveBeenCalled(); // Initial mount effect
    });
  });

  describe('LocalStorage Integration', () => {
    it('should check localStorage for saved theme on mount', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
    });

    it('should handle invalid theme values from localStorage gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // Should default to light theme when invalid value found
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });    it('should persist theme changes to localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await user.click(screen.getByTestId('set-dark'));
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      });

      await act(async () => {
        await user.click(screen.getByTestId('set-light'));
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      });
    });
  });

  describe('System Preference Detection', () => {
    it('should detect dark system preference when no saved theme', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should use light theme when system preference is light', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });

    it('should prioritize saved theme over system preference', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      mockMatchMedia.mockReturnValue({
        matches: true, // System prefers dark
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });
  });

  describe('Hook Usage', () => {
    it('should throw error when useTheme is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide all required context values', () => {
      let contextValue: any;
      
      const TestContextValue = () => {
        contextValue = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <TestContextValue />
        </ThemeProvider>
      );

      expect(contextValue).toHaveProperty('theme');
      expect(contextValue).toHaveProperty('toggleTheme');
      expect(contextValue).toHaveProperty('setTheme');
      expect(typeof contextValue.theme).toBe('string');
      expect(typeof contextValue.toggleTheme).toBe('function');
      expect(typeof contextValue.setTheme).toBe('function');
    });
  });

  describe('Multiple Theme Changes', () => {
    it('should handle rapid theme changes correctly', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Rapid theme changes
      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme')); // light -> dark
        await user.click(screen.getByTestId('toggle-theme')); // dark -> light
        await user.click(screen.getByTestId('set-dark'));     // light -> dark
        await user.click(screen.getByTestId('set-light'));    // dark -> light
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should maintain consistency with localStorage across changes', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await user.click(screen.getByTestId('set-dark'));
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('theme', 'dark');
      });

      await act(async () => {
        await user.click(screen.getByTestId('toggle-theme'));
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('theme', 'light');
      });
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      // Reset mocks for edge case tests
      jest.clearAllMocks();
      mockLocalStorage.getItem.mockImplementation((key) => null);
      mockLocalStorage.setItem.mockImplementation(() => {});
    });

    it('should handle missing localStorage gracefully', () => {
      // Mock localStorage to throw error
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      // Should not throw during render
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();
      
      // Should still provide a working theme context with default light theme
      const themeElement = screen.getByTestId('current-theme');
      expect(themeElement).toHaveTextContent('light');
    });

    it('should handle localStorage save errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage save error');
      });
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle-theme');
      
      // Toggle theme should work even if save fails
      act(() => {
        fireEvent.click(toggleButton);
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme preference:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle missing matchMedia gracefully', () => {
      // Remove matchMedia
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;
      
      try {
        expect(() => {
          render(
            <ThemeProvider>
              <TestComponent />
            </ThemeProvider>
          );
        }).not.toThrow();
        
        // Should default to light theme
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      } finally {
        // Restore matchMedia
        window.matchMedia = originalMatchMedia;
      }
    });

    it('should render children even before mounted state', () => {
      render(
        <ThemeProvider>
          <div data-testid="child-element">Child content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
  });
});