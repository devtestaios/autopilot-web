'use client';

import { useState, useCallback } from 'react';

export interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  showToast?: boolean;
  toastTitle?: string;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    setError(errorObj);
    
    if (options.showToast !== false) {
      // Show browser notification or console log for now
      console.error('Error:', options.toastTitle || 'Error', errorObj.message);
    }
    
    options.onError?.(errorObj);
    
    // Log to console for debugging
    console.error('Error handled:', errorObj);
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingState = true
  ): Promise<T | null> => {
    try {
      if (loadingState) setIsLoading(true);
      clearError();
      
      const result = await asyncFn();
      return result;
    } catch (error) {
      handleError(error as Error);
      return null;
    } finally {
      if (loadingState) setIsLoading(false);
    }
  }, [handleError, clearError]);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        handleError(new Error('Network error. Please check your connection and try again.'));
      } else if (error.message.includes('500')) {
        handleError(new Error('Server error. Please try again in a few moments.'));
      } else if (error.message.includes('404')) {
        handleError(new Error('The requested resource was not found.'));
      } else {
        handleError(error);
      }
    } else {
      handleError(new Error('An unexpected error occurred.'));
    }
  }, [handleError]);

  return {
    error,
    isLoading,
    handleError,
    handleAsync,
    handleApiError,
    clearError
  };
}

// Specific hooks for common error scenarios
export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const { error, isLoading, handleAsync } = useErrorHandler();

  const execute = useCallback(async () => {
    const result = await handleAsync(asyncFn);
    if (result !== null) {
      setData(result);
    }
  }, [handleAsync, ...dependencies]);

  return {
    data,
    error,
    isLoading,
    execute,
    refetch: execute
  };
}

export function useApiCall<T>(
  apiCall: () => Promise<T>,
  options: { immediate?: boolean; dependencies?: any[] } = {}
) {
  const { immediate = false, dependencies = [] } = options;
  const operation = useAsyncOperation(apiCall, dependencies);

  // Auto-execute on mount if immediate is true
  useState(() => {
    if (immediate) {
      operation.execute();
    }
  });

  return operation;
}