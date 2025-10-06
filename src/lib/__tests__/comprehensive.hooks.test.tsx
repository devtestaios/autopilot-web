/**
 * React Hooks and Context Comprehensive Testing Suite
 * Testing custom hooks and context providers
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { render, renderHook, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('React Hooks and Context - Comprehensive Coverage', () => {
  
  describe('Custom Hook Testing', () => {
    // Test custom hooks for common patterns
    test('useLocalStorage hook', () => {
      const useLocalStorage = <T>(key: string, initialValue: T) => {
        const [storedValue, setStoredValue] = useState<T>(() => {
          try {
            if (typeof window === 'undefined') return initialValue;
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
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
          } catch (error) {
            console.error(error);
          }
        };

        return [storedValue, setValue] as const;
      };

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      expect(result.current[0]).toBe('initial');
      
      act(() => {
        result.current[1]('updated');
      });
      
      expect(result.current[0]).toBe('updated');
    });

    test('useDebounce hook', () => {
      const useDebounce = <T>(value: T, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
          const handler = setTimeout(() => {
            setDebouncedValue(value);
          }, delay);

          return () => {
            clearTimeout(handler);
          };
        }, [value, delay]);

        return debouncedValue;
      };

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial'); // Still initial due to debounce

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('updated');
    });

    test('useApi hook for data fetching', () => {
      const useApi = <T>(url: string) => {
        const [data, setData] = useState<T | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              setError(null);
              // Mock fetch
              const response = await fetch(url);
              if (!response.ok) throw new Error('Failed to fetch');
              const result = await response.json();
              setData(result);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
              setLoading(false);
            }
          };

          fetchData();
        }, [url]);

        return { data, loading, error };
      };

      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
      });

      const { result } = renderHook(() => useApi<{id: number, name: string}>('/api/test'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for async operation
      act(() => {
        jest.runAllTimers();
      });
    });

    test('useToggle hook', () => {
      const useToggle = (initialValue = false) => {
        const [value, setValue] = useState(initialValue);
        
        const toggle = () => setValue(prev => !prev);
        const setTrue = () => setValue(true);
        const setFalse = () => setValue(false);
        
        return [value, { toggle, setTrue, setFalse }] as const;
      };

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

    test('useArray hook for array operations', () => {
      const useArray = <T>(initialArray: T[] = []) => {
        const [array, setArray] = useState(initialArray);

        const push = (element: T) => setArray(prev => [...prev, element]);
        const remove = (index: number) => setArray(prev => prev.filter((_, i) => i !== index));
        const clear = () => setArray([]);
        const update = (index: number, element: T) => 
          setArray(prev => prev.map((item, i) => i === index ? element : item));

        return {
          array,
          set: setArray,
          push,
          remove,
          clear,
          update
        };
      };

      const { result } = renderHook(() => useArray([1, 2, 3]));
      
      expect(result.current.array).toEqual([1, 2, 3]);
      
      act(() => {
        result.current.push(4);
      });
      
      expect(result.current.array).toEqual([1, 2, 3, 4]);
      
      act(() => {
        result.current.remove(1);
      });
      
      expect(result.current.array).toEqual([1, 3, 4]);
      
      act(() => {
        result.current.update(0, 10);
      });
      
      expect(result.current.array).toEqual([10, 3, 4]);
      
      act(() => {
        result.current.clear();
      });
      
      expect(result.current.array).toEqual([]);
    });
  });

  describe('Context Provider Testing', () => {
    // Test context providers
    test('Theme context provider', () => {
      interface ThemeContextType {
        theme: 'light' | 'dark';
        toggleTheme: () => void;
      }

      const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

      const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
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
        if (!context) {
          throw new Error('useTheme must be used within ThemeProvider');
        }
        return context;
      };

      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme} data-testid="toggle">Toggle</button>
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

    test('Auth context provider', () => {
      interface User {
        id: string;
        name: string;
        email: string;
      }

      interface AuthContextType {
        user: User | null;
        login: (user: User) => void;
        logout: () => void;
        isAuthenticated: boolean;
      }

      const AuthContext = createContext<AuthContextType | undefined>(undefined);

      const AuthProvider = ({ children }: { children: React.ReactNode }) => {
        const [user, setUser] = useState<User | null>(null);
        
        const login = (userData: User) => setUser(userData);
        const logout = () => setUser(null);
        const isAuthenticated = user !== null;

        return (
          <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
          </AuthContext.Provider>
        );
      };

      const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
          throw new Error('useAuth must be used within AuthProvider');
        }
        return context;
      };

      const TestComponent = () => {
        const { user, login, logout, isAuthenticated } = useAuth();
        
        return (
          <div>
            <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</span>
            <span data-testid="user-name">{user?.name || 'No user'}</span>
            <button 
              onClick={() => login({ id: '1', name: 'John', email: 'john@example.com' })}
              data-testid="login"
            >
              Login
            </button>
            <button onClick={logout} data-testid="logout">Logout</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
      
      act(() => {
        screen.getByTestId('login').click();
      });
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('John');
      
      act(() => {
        screen.getByTestId('logout').click();
      });
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
    });

    test('Shopping cart context provider', () => {
      interface CartItem {
        id: string;
        name: string;
        price: number;
        quantity: number;
      }

      interface CartContextType {
        items: CartItem[];
        addItem: (item: Omit<CartItem, 'quantity'>) => void;
        removeItem: (id: string) => void;
        updateQuantity: (id: string, quantity: number) => void;
        clearCart: () => void;
        totalItems: number;
        totalPrice: number;
      }

      const CartContext = createContext<CartContextType | undefined>(undefined);

      const CartProvider = ({ children }: { children: React.ReactNode }) => {
        const [items, setItems] = useState<CartItem[]>([]);

        const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
          setItems(prev => {
            const existingItem = prev.find(item => item.id === newItem.id);
            if (existingItem) {
              return prev.map(item =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
            }
            return [...prev, { ...newItem, quantity: 1 }];
          });
        };

        const removeItem = (id: string) => {
          setItems(prev => prev.filter(item => item.id !== id));
        };

        const updateQuantity = (id: string, quantity: number) => {
          if (quantity <= 0) {
            removeItem(id);
            return;
          }
          setItems(prev =>
            prev.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          );
        };

        const clearCart = () => setItems([]);

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return (
          <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
          }}>
            {children}
          </CartContext.Provider>
        );
      };

      const useCart = () => {
        const context = useContext(CartContext);
        if (!context) {
          throw new Error('useCart must be used within CartProvider');
        }
        return context;
      };

      const TestComponent = () => {
        const { items, addItem, removeItem, totalItems, totalPrice } = useCart();
        
        return (
          <div>
            <span data-testid="total-items">{totalItems}</span>
            <span data-testid="total-price">${totalPrice.toFixed(2)}</span>
            <div data-testid="items-count">{items.length}</div>
            <button 
              onClick={() => addItem({ id: '1', name: 'Test Item', price: 10.99 })}
              data-testid="add-item"
            >
              Add Item
            </button>
            <button 
              onClick={() => removeItem('1')}
              data-testid="remove-item"
            >
              Remove Item
            </button>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('$0.00');
      
      act(() => {
        screen.getByTestId('add-item').click();
      });
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('$10.99');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      
      act(() => {
        screen.getByTestId('add-item').click(); // Add same item again
      });
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('$21.98');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1'); // Still one unique item
      
      act(() => {
        screen.getByTestId('remove-item').click();
      });
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  describe('Hook Integration Testing', () => {
    test('multiple hooks working together', () => {
      const useCounter = (initialValue = 0) => {
        const [count, setCount] = useState(initialValue);
        const increment = () => setCount(prev => prev + 1);
        const decrement = () => setCount(prev => prev - 1);
        const reset = () => setCount(initialValue);
        return { count, increment, decrement, reset };
      };

      const useTimer = (initialTime = 0) => {
        const [time, setTime] = useState(initialTime);
        const [isRunning, setIsRunning] = useState(false);

        useEffect(() => {
          let interval: NodeJS.Timeout;
          if (isRunning) {
            interval = setInterval(() => {
              setTime(time => time + 1);
            }, 1000);
          }
          return () => clearInterval(interval);
        }, [isRunning]);

        const start = () => setIsRunning(true);
        const stop = () => setIsRunning(false);
        const reset = () => {
          setTime(initialTime);
          setIsRunning(false);
        };

        return { time, isRunning, start, stop, reset };
      };

      const TestComponent = () => {
        const counter = useCounter(10);
        const timer = useTimer();

        return (
          <div>
            <span data-testid="count">{counter.count}</span>
            <span data-testid="time">{timer.time}</span>
            <span data-testid="running">{timer.isRunning ? 'running' : 'stopped'}</span>
            <button onClick={counter.increment} data-testid="increment">+</button>
            <button onClick={counter.decrement} data-testid="decrement">-</button>
            <button onClick={timer.start} data-testid="start-timer">Start</button>
            <button onClick={timer.stop} data-testid="stop-timer">Stop</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('count')).toHaveTextContent('10');
      expect(screen.getByTestId('time')).toHaveTextContent('0');
      expect(screen.getByTestId('running')).toHaveTextContent('stopped');

      act(() => {
        screen.getByTestId('increment').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('11');

      act(() => {
        screen.getByTestId('start-timer').click();
      });

      expect(screen.getByTestId('running')).toHaveTextContent('running');
    });

    test('context with hooks integration', () => {
      interface AppState {
        notifications: string[];
        addNotification: (message: string) => void;
        removeNotification: (index: number) => void;
        clearNotifications: () => void;
      }

      const AppContext = createContext<AppState | undefined>(undefined);

      const AppProvider = ({ children }: { children: React.ReactNode }) => {
        const { array: notifications, push, remove, clear } = {
          array: [] as string[],
          push: (item: string) => {},
          remove: (index: number) => {},
          clear: () => {}
        };

        // Mock the array hook functionality
        const [notificationsList, setNotificationsList] = useState<string[]>([]);
        
        const addNotification = (message: string) => {
          setNotificationsList(prev => [...prev, message]);
        };
        
        const removeNotification = (index: number) => {
          setNotificationsList(prev => prev.filter((_, i) => i !== index));
        };
        
        const clearNotifications = () => {
          setNotificationsList([]);
        };

        return (
          <AppContext.Provider value={{
            notifications: notificationsList,
            addNotification,
            removeNotification,
            clearNotifications
          }}>
            {children}
          </AppContext.Provider>
        );
      };

      const useApp = () => {
        const context = useContext(AppContext);
        if (!context) throw new Error('useApp must be used within AppProvider');
        return context;
      };

      const TestComponent = () => {
        const { notifications, addNotification, removeNotification, clearNotifications } = useApp();

        return (
          <div>
            <span data-testid="notification-count">{notifications.length}</span>
            <div data-testid="notifications">
              {notifications.map((notification, index) => (
                <div key={index} data-testid={`notification-${index}`}>
                  {notification}
                </div>
              ))}
            </div>
            <button 
              onClick={() => addNotification('Test notification')}
              data-testid="add-notification"
            >
              Add
            </button>
            <button 
              onClick={() => removeNotification(0)}
              data-testid="remove-first"
            >
              Remove First
            </button>
            <button 
              onClick={clearNotifications}
              data-testid="clear-all"
            >
              Clear All
            </button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');

      act(() => {
        screen.getByTestId('add-notification').click();
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
      expect(screen.getByTestId('notification-0')).toHaveTextContent('Test notification');

      act(() => {
        screen.getByTestId('add-notification').click();
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('2');

      act(() => {
        screen.getByTestId('remove-first').click();
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

      act(() => {
        screen.getByTestId('clear-all').click();
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });
  });

  describe('Error Boundary Testing', () => {
    test('error boundary catches and displays errors', () => {
      class ErrorBoundary extends React.Component<
        { children: React.ReactNode; fallback?: React.ReactNode },
        { hasError: boolean }
      > {
        constructor(props: any) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        render() {
          if (this.state.hasError) {
            return this.props.fallback || <div data-testid="error-fallback">Something went wrong!</div>;
          }

          return this.props.children;
        }
      }

      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      const SafeComponent = () => <div data-testid="safe-content">Safe content</div>;

      // Test error case
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

      // Test normal case
      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('safe-content')).toBeInTheDocument();
    });
  });
});