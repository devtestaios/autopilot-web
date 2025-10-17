import { renderHook, act } from '@testing-library/react';
import { useState, useEffect, useCallback, useMemo } from 'react';

describe('React Hooks Testing', () => {
  describe('Basic Hook Patterns', () => {
    test('useState hook functionality', () => {
      const TestHook = () => {
        const [count, setCount] = useState(0);
        return { count, setCount };
      };

      const { result } = renderHook(() => TestHook());

      expect(result.current.count).toBe(0);

      act(() => {
        result.current.setCount(5);
      });

      expect(result.current.count).toBe(5);
    });

    test('useEffect hook with dependencies', () => {
      const TestHook = (value: number) => {
        const [doubled, setDoubled] = useState(0);

        useEffect(() => {
          setDoubled(value * 2);
        }, [value]);

        return doubled;
      };

      const { result, rerender } = renderHook(
        ({ value }) => TestHook(value),
        { initialProps: { value: 5 } }
      );

      expect(result.current).toBe(10);

      rerender({ value: 8 });

      expect(result.current).toBe(16);
    });

    test('useCallback hook memoization', () => {
      const TestHook = (value: number) => {
        const callback = useCallback(() => {
          return value * 2;
        }, [value]);

        return callback;
      };

      const { result, rerender } = renderHook(
        ({ value }) => TestHook(value),
        { initialProps: { value: 5 } }
      );

      const firstCallback = result.current;

      rerender({ value: 5 }); // Same value
      expect(result.current).toBe(firstCallback); // Should be memoized

      rerender({ value: 10 }); // Different value
      expect(result.current).not.toBe(firstCallback); // Should be new
    });

    test('useMemo hook memoization', () => {
      const TestHook = (items: number[]) => {
        const sum = useMemo(() => {
          return items.reduce((acc, item) => acc + item, 0);
        }, [items]);

        return sum;
      };

      const { result, rerender } = renderHook(
        ({ items }) => TestHook(items),
        { initialProps: { items: [1, 2, 3] } }
      );

      expect(result.current).toBe(6);

      rerender({ items: [1, 2, 3, 4] });
      expect(result.current).toBe(10);
    });
  });

  describe('Custom Hook Patterns', () => {
    test('custom counter hook', () => {
      const useCounter = (initialValue = 0) => {
        const [count, setCount] = useState(initialValue);

        const increment = useCallback(() => setCount(c => c + 1), []);
        const decrement = useCallback(() => setCount(c => c - 1), []);
        const reset = useCallback(() => setCount(initialValue), [initialValue]);

        return { count, increment, decrement, reset };
      };

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

    test('custom toggle hook', () => {
      const useToggle = (initialValue = false) => {
        const [value, setValue] = useState(initialValue);

        const toggle = useCallback(() => setValue(v => !v), []);
        const setTrue = useCallback(() => setValue(true), []);
        const setFalse = useCallback(() => setValue(false), []);

        return { value, toggle, setTrue, setFalse };
      };

      const { result } = renderHook(() => useToggle(false));

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
  });

  describe('Hook Dependency Management', () => {
    test('useEffect cleanup function', () => {
      const cleanup = jest.fn();

      const TestHook = () => {
        useEffect(() => {
          return cleanup;
        }, []);
      };

      const { unmount } = renderHook(() => TestHook());

      expect(cleanup).not.toHaveBeenCalled();

      unmount();

      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    test('useEffect with changing dependencies', () => {
      const effect = jest.fn();

      const TestHook = (dep: number) => {
        useEffect(() => {
          effect(dep);
        }, [dep]);
      };

      const { rerender } = renderHook(
        ({ dep }) => TestHook(dep),
        { initialProps: { dep: 1 } }
      );

      expect(effect).toHaveBeenCalledWith(1);
      expect(effect).toHaveBeenCalledTimes(1);

      rerender({ dep: 1 }); // Same dependency
      expect(effect).toHaveBeenCalledTimes(1); // Should not re-run

      rerender({ dep: 2 }); // Different dependency
      expect(effect).toHaveBeenCalledWith(2);
      expect(effect).toHaveBeenCalledTimes(2); // Should re-run
    });
  });
});