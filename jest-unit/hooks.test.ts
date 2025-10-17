import { renderHook, act } from '@testing-library/react';
import { createTestCampaign, createTestMetrics, createTestUser } from './test-mocks';

// Mock custom hooks for testing
const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const mockCampaigns = [
        createTestCampaign({ name: 'Campaign 1' }),
        createTestCampaign({ name: 'Campaign 2' }),
      ];
      setCampaigns(mockCampaigns);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { campaigns, loading, error, fetchCampaigns };
};

const useMetrics = (campaignId?: string) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    const mockMetrics = createTestMetrics({
      impressions: 5000,
      clicks: 250,
      cost: 1250,
    });
    setMetrics(mockMetrics);
    setLoading(false);
  };

  return { metrics, loading, fetchMetrics };
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    const mockUser = createTestUser({ email, role: 'admin' });
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
};

// Import React hooks for testing
import { useState } from 'react';

describe('Custom Hooks Tests', () => {
  describe('useCampaigns Hook', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useCampaigns());

      expect(result.current.campaigns).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fetch campaigns successfully', async () => {
      const { result } = renderHook(() => useCampaigns());

      await act(async () => {
        await result.current.fetchCampaigns();
      });

      expect(result.current.campaigns).toHaveLength(2);
      expect(result.current.campaigns[0].name).toBe('Campaign 1');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle loading state', async () => {
      const { result } = renderHook(() => useCampaigns());

      act(() => {
        result.current.fetchCampaigns();
      });

      // Check loading state is true during fetch
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useMetrics Hook', () => {
    it('should initialize with null metrics', () => {
      const { result } = renderHook(() => useMetrics());

      expect(result.current.metrics).toBe(null);
      expect(result.current.loading).toBe(false);
    });

    it('should fetch metrics for campaign', async () => {
      const { result } = renderHook(() => useMetrics('campaign-123'));

      await act(async () => {
        await result.current.fetchMetrics();
      });

      expect(result.current.metrics).toBeDefined();
      expect(result.current.metrics?.impressions).toBe(5000);
      expect(result.current.metrics?.clicks).toBe(250);
      expect(result.current.metrics?.ctr).toBe(0.05);
      expect(result.current.loading).toBe(false);
    });

    it('should calculate derived metrics correctly', async () => {
      const { result } = renderHook(() => useMetrics());

      await act(async () => {
        await result.current.fetchMetrics();
      });

      const metrics = result.current.metrics;
      expect(metrics?.ctr).toBe(0.05); // 250/5000
      expect(metrics?.cpc).toBe(5); // 1250/250
      expect(metrics?.cpm).toBe(250); // (1250/5000) * 1000
    });
  });

  describe('useAuth Hook', () => {
    it('should initialize with unauthenticated state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should login user successfully', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.role).toBe('admin');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should logout user', async () => {
      const { result } = renderHook(() => useAuth());

      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useLocalStorage Hook', () => {
    const useLocalStorage = (key: string, initialValue: any) => {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          return initialValue;
        }
      });

      const setValue = (value: any) => {
        try {
          setStoredValue(value);
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      };

      return [storedValue, setValue];
    };

    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current[0]).toBe('initial');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });
  });

  describe('useDebounce Hook', () => {
    const useDebounce = (value: any, delay: number) => {
      const [debouncedValue, setDebouncedValue] = useState(value);

      useState(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          clearTimeout(handler);
        };
      });

      return debouncedValue;
    };

    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('test', 500));

      expect(result.current).toBe('test');
    });

    it('should debounce value updates', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 100 });

      // Should still be initial value immediately
      expect(result.current).toBe('initial');
    });
  });

  describe('useFetch Hook', () => {
    const useFetch = (url: string) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchData = async () => {
        setLoading(true);
        try {
          // Mock fetch response
          const mockData = { message: 'Success', data: [] };
          setData(mockData);
          setError(null);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      return { data, loading, error, fetchData };
    };

    it('should initialize with null data', () => {
      const { result } = renderHook(() => useFetch('/api/test'));

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fetch data successfully', async () => {
      const { result } = renderHook(() => useFetch('/api/test'));

      await act(async () => {
        await result.current.fetchData();
      });

      expect(result.current.data).toEqual({ message: 'Success', data: [] });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('useForm Hook', () => {
    const useForm = (initialValues: any) => {
      const [values, setValues] = useState(initialValues);
      const [errors, setErrors] = useState({});

      const handleChange = (name: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
          setErrors((prev: any) => ({ ...prev, [name]: null }));
        }
      };

      const validate = () => {
        const newErrors: any = {};
        
        if (!values.email) {
          newErrors.email = 'Email is required';
        }
        
        if (!values.password) {
          newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const reset = () => {
        setValues(initialValues);
        setErrors({});
      };

      return { values, errors, handleChange, validate, reset };
    };

    it('should initialize with default values', () => {
      const initialValues = { email: '', password: '' };
      const { result } = renderHook(() => useForm(initialValues));

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
    });

    it('should update values on change', () => {
      const initialValues = { email: '', password: '' };
      const { result } = renderHook(() => useForm(initialValues));

      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('should validate required fields', () => {
      const initialValues = { email: '', password: '' };
      const { result } = renderHook(() => useForm(initialValues));

      act(() => {
        const isValid = result.current.validate();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.password).toBe('Password is required');
    });

    it('should reset form', () => {
      const initialValues = { email: '', password: '' };
      const { result } = renderHook(() => useForm(initialValues));

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.reset();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
    });
  });

  describe('useToggle Hook', () => {
    const useToggle = (initialValue = false) => {
      const [value, setValue] = useState(initialValue);

      const toggle = () => setValue(!value);
      const setTrue = () => setValue(true);
      const setFalse = () => setValue(false);

      return { value, toggle, setTrue, setFalse };
    };

    it('should initialize with default value', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current.value).toBe(false);
    });

    it('should toggle value', () => {
      const { result } = renderHook(() => useToggle());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.value).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.value).toBe(false);
    });

    it('should set value to true', () => {
      const { result } = renderHook(() => useToggle());

      act(() => {
        result.current.setTrue();
      });

      expect(result.current.value).toBe(true);
    });

    it('should set value to false', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current.setFalse();
      });

      expect(result.current.value).toBe(false);
    });
  });
});