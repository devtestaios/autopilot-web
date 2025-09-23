import { renderHook, act } from '@testing-library/react';
import { useErrorHandler, useAsyncOperation, useApiCall } from '../useErrorHandler';

describe('useErrorHandler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should initialize with no error and not loading', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  describe('handleError', () => {
    it('should handle Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(result.current.error).toBe(error);
      expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Error', 'Test error');
      expect(consoleSpy).toHaveBeenCalledWith('Error handled:', error);
    });

    it('should handle string errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('String error');
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('String error');
      expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Error', 'String error');
    });

    it('should call onError callback when provided', () => {
      const onError = jest.fn();
      const { result } = renderHook(() => useErrorHandler({ onError }));
      const error = new Error('Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should use custom toast title', () => {
      const { result } = renderHook(() => useErrorHandler({ toastTitle: 'Custom Title' }));

      act(() => {
        result.current.handleError('Test error');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Custom Title', 'Test error');
    });

    it('should not show toast when showToast is false', () => {
      const { result } = renderHook(() => useErrorHandler({ showToast: false }));

      act(() => {
        result.current.handleError('Test error');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error handled:', expect.any(Error));
      expect(consoleSpy).not.toHaveBeenCalledWith('Error:', expect.any(String), expect.any(String));
    });
  });

  describe('clearError', () => {
    it('should clear the error', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('Test error');
      });
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('handleAsync', () => {
    it('should handle successful async operations', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const asyncFn = jest.fn().mockResolvedValue('success');

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.handleAsync(asyncFn);
      });

      expect(returnValue).toBe('success');
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(asyncFn).toHaveBeenCalled();
    });

    it('should handle failed async operations', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.handleAsync(asyncFn);
      });

      expect(returnValue).toBeNull();
      expect(result.current.error).toBe(error);
      expect(result.current.isLoading).toBe(false);
    });

    it('should manage loading state by default', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const asyncFn = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('success'), 10))
      );

      let promise: Promise<any>;
      act(() => {
        promise = result.current.handleAsync(asyncFn);
      });

      // Check loading state in the next tick
      await act(async () => {
        expect(result.current.isLoading).toBe(true);
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should not manage loading state when loadingState is false', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const asyncFn = jest.fn().mockResolvedValue('success');

      await act(async () => {
        await result.current.handleAsync(asyncFn, false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should clear previous errors before execution', async () => {
      const { result } = renderHook(() => useErrorHandler());

      // Set an initial error
      act(() => {
        result.current.handleError('Initial error');
      });
      expect(result.current.error).not.toBeNull();

      // Run successful async operation
      const asyncFn = jest.fn().mockResolvedValue('success');
      await act(async () => {
        await result.current.handleAsync(asyncFn);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      const networkError = new Error('fetch failed');

      act(() => {
        result.current.handleApiError(networkError);
      });

      expect(result.current.error?.message).toBe('Network error. Please check your connection and try again.');
    });

    it('should handle 500 errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      const serverError = new Error('500 Internal Server Error');

      act(() => {
        result.current.handleApiError(serverError);
      });

      expect(result.current.error?.message).toBe('Server error. Please try again in a few moments.');
    });

    it('should handle 404 errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      const notFoundError = new Error('404 Not Found');

      act(() => {
        result.current.handleApiError(notFoundError);
      });

      expect(result.current.error?.message).toBe('The requested resource was not found.');
    });

    it('should handle other Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());
      const customError = new Error('Custom error');

      act(() => {
        result.current.handleApiError(customError);
      });

      expect(result.current.error).toBe(customError);
    });

    it('should handle non-Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError('String error');
      });

      expect(result.current.error?.message).toBe('An unexpected error occurred.');
    });

    it('should handle null/undefined', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(null);
      });

      expect(result.current.error?.message).toBe('An unexpected error occurred.');
    });
  });
});

describe('useAsyncOperation', () => {
  it('should initialize with null data', () => {
    const asyncFn = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncOperation(asyncFn));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should execute async operation and set data', async () => {
    const asyncFn = jest.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsyncOperation(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('test data');
    expect(result.current.error).toBeNull();
    expect(asyncFn).toHaveBeenCalled();
  });

  it('should handle errors without setting data', async () => {
    const error = new Error('Async error');
    const asyncFn = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsyncOperation(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
  });

  it('should have refetch as alias for execute', async () => {
    const asyncFn = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncOperation(asyncFn));

    expect(result.current.refetch).toBe(result.current.execute);
  });

  it('should recreate execute function when dependencies change', () => {
    const asyncFn = jest.fn().mockResolvedValue('data');
    const { result, rerender } = renderHook(
      ({ deps }) => useAsyncOperation(asyncFn, deps),
      { initialProps: { deps: [1] } }
    );

    const firstExecute = result.current.execute;

    rerender({ deps: [2] });

    const secondExecute = result.current.execute;

    expect(firstExecute).not.toBe(secondExecute);
  });
});

describe('useApiCall', () => {
  it('should initialize with null data and not execute immediately by default', () => {
    const apiCall = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useApiCall(apiCall));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(apiCall).not.toHaveBeenCalled();
  });

  it('should execute immediately when immediate is true', async () => {
    const apiCall = jest.fn().mockResolvedValue('immediate data');
    
    await act(async () => {
      renderHook(() => useApiCall(apiCall, { immediate: true }));
    });

    expect(apiCall).toHaveBeenCalled();
  });

  it('should pass dependencies to useAsyncOperation', () => {
    const apiCall = jest.fn().mockResolvedValue('data');
    const dependencies = [1, 2, 3];
    
    const { result, rerender } = renderHook(
      ({ deps }) => useApiCall(apiCall, { dependencies: deps }),
      { initialProps: { deps: dependencies } }
    );

    const firstExecute = result.current.execute;

    rerender({ deps: [4, 5, 6] });

    const secondExecute = result.current.execute;

    expect(firstExecute).not.toBe(secondExecute);
  });

  it('should handle options defaults', () => {
    const apiCall = jest.fn().mockResolvedValue('data');
    
    // Should not throw with no options
    const { result } = renderHook(() => useApiCall(apiCall));
    
    expect(result.current.execute).toBeDefined();
    expect(apiCall).not.toHaveBeenCalled();
  });

  it('should handle empty dependencies array', () => {
    const apiCall = jest.fn().mockResolvedValue('data');
    
    const { result } = renderHook(() => useApiCall(apiCall, { dependencies: [] }));
    
    expect(result.current.execute).toBeDefined();
  });
});