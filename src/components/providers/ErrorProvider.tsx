'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ErrorFallback } from '../ui/ErrorFallback';

interface ErrorProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ErrorContext = createContext<{
  reportError: (error: Error) => void;
}>({
  reportError: () => {}
});

export function ErrorProvider({ children, fallback, onError }: ErrorProviderProps) {
  const reportError = (error: Error) => {
    console.error('Error reported:', error);
    // Here you could send to error reporting service
    // like Sentry, LogRocket, etc.
  };

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    reportError(error);
    onError?.(error, errorInfo);
  };

  return (
    <ErrorContext.Provider value={{ reportError }}>
      <ErrorBoundary 
        fallback={fallback || <ErrorFallback />} 
        onError={handleError}
      >
        {children}
      </ErrorBoundary>
    </ErrorContext.Provider>
  );
}

export function useErrorReporting() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorReporting must be used within an ErrorProvider');
  }
  return context;
}