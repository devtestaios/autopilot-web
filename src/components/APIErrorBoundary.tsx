/**
 * Enhanced Error Boundary System for API Integration
 * Provides graceful degradation and recovery for API failures
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface ErrorInfo {
  componentStack: string;
}

interface APIErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  lastRetry: number;
}

interface APIErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  retryDelay?: number;
  showErrorDetails?: boolean;
}

export class APIErrorBoundary extends Component<APIErrorBoundaryProps, APIErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: APIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastRetry: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<APIErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    });

    // Log error details
    console.error('API Error Boundary caught an error:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (implement as needed)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Implement error logging to your monitoring service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      console.log('Would send to error monitoring service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3, retryDelay = 2000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({
      retryCount: retryCount + 1,
      lastRetry: Date.now()
    });

    // Clear retry timer if exists
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    // Set retry timer with exponential backoff
    this.retryTimer = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    }, retryDelay * Math.pow(2, retryCount));
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastRetry: 0
    });

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback, maxRetries = 3, showErrorDetails = false } = this.props;
      const { error, errorInfo, retryCount } = this.state;

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Determine error type and appropriate message
      const isAPIError = error?.name === 'APIError' || error?.message.includes('fetch');
      const isNetworkError = error?.message.includes('network') || error?.message.includes('Failed to fetch');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <PremiumCard className="max-w-2xl w-full p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isAPIError ? 'API Connection Error' : 'Something went wrong'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isNetworkError 
                  ? 'Unable to connect to our servers. Please check your internet connection.'
                  : isAPIError
                  ? 'There was a problem connecting to our API services.'
                  : 'An unexpected error occurred while loading this page.'
                }
              </p>
            </div>

            {/* Error Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {retryCount < maxRetries && (
                <PremiumButton 
                  onClick={this.handleRetry}
                  variant="default"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry ({maxRetries - retryCount} attempts left)
                </PremiumButton>
              )}
              
              <PremiumButton 
                onClick={this.handleReset}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </PremiumButton>
              
              <PremiumButton 
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </PremiumButton>
            </div>

            {/* Error Details (Development/Debug) */}
            {showErrorDetails && error && (
              <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bug className="h-4 w-4 inline mr-2" />
                  Error Details
                </summary>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-2">
                  <div>
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If the problem persists, please contact support with the error details above.
              </p>
            </div>
          </PremiumCard>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withAPIErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<APIErrorBoundaryProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <APIErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </APIErrorBoundary>
    );
  };
}

// Hook for error reporting
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error reported from ${context || 'unknown context'}:`, error);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Implement your error reporting logic here
    }
  }, []);

  return { reportError };
}

export default APIErrorBoundary;