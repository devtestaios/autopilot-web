import { describe, it, expect } from '@jest/globals';
import { useDebounce } from '@/hooks/useDebounce';
import { renderHook, act } from '@testing-library/react';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should still be initial (not debounced yet)
    expect(result.current).toBe('initial');

    // Fast-forward time by 499ms (just before debounce delay)
    act(() => {
      jest.advanceTimersByTime(499);
    });
    
    expect(result.current).toBe('initial');

    // Fast-forward past the debounce delay
    act(() => {
      jest.advanceTimersByTime(1);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first', delay: 500 });
    
    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe('initial');

    // Second update before first debounce completes
    rerender({ value: 'second', delay: 500 });
    
    // Advance time by the remaining time of first update
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Should still be initial because timer was reset
    expect(result.current).toBe('initial');

    // Advance by full delay from second update
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe('second');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });
    
    // Should not update after 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    // Should update after full 1000ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });
    
    // With zero delay, should update immediately after next tick
    act(() => {
      jest.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('updated');
  });
});