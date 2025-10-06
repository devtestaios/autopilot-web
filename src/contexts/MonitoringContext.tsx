/**
 * Enterprise Monitoring Provider
 * Integrates error tracking and performance monitoring into the application
 * Part of the Enterprise Infrastructure Phase
 */

'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { monitoring, reportError, reportPerformance, setUserContext, clearUserContext } from '@/lib/monitoring';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface MonitoringContextValue {
  reportError: typeof reportError;
  reportPerformance: typeof reportPerformance;
  setUserContext: typeof setUserContext;
  clearUserContext: typeof clearUserContext;
}

const MonitoringContext = createContext<MonitoringContextValue | null>(null);

interface MonitoringProviderProps {
  children: React.ReactNode;
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  const { user } = useAuth();

  // Set user context when user changes
  useEffect(() => {
    if (user) {
      setUserContext(
        user.id,
        user?.id || undefined,
        user.email || undefined
      );
    } else {
      clearUserContext();
    }
  }, [user]);

  // Set up React error boundary reporting
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Check if this looks like a React error
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('React') || 
        message.includes('Warning') ||
        message.includes('Error')
      )) {
        reportError(new Error(message), {
          type: 'react_error',
          args: args.slice(1)
        });
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const contextValue: MonitoringContextValue = {
    reportError,
    reportPerformance,
    setUserContext,
    clearUserContext
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
}

// Hook to use monitoring context
export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}

// Higher-order component for automatic error reporting
export function withMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) {
  const MonitoredComponent = (props: P) => {
    const { reportError } = useMonitoring();

    return (
      <ErrorBoundary 
        onError={(error, errorInfo) => {
          reportError(error, {
            component: displayName || Component.displayName || Component.name,
            errorInfo
          });
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  MonitoredComponent.displayName = `withMonitoring(${displayName || Component.displayName || Component.name})`;
  return MonitoredComponent;
}

// Simple error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            retry={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      // Default error UI
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            An error occurred while rendering this component. Our team has been notified.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MonitoringProvider;