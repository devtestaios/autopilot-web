'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorId: string) => void;
  showDetails?: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error('[ErrorBoundary] Caught error:', error);
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;
    
    console.error('[ErrorBoundary] Error details:', {
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo.componentStack,
      errorId
    });

    // Report to error tracking service
    if (onError) {
      onError(error, errorId);
    }

    // Log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent, showDetails = false } = this.props;
      const { error, errorId } = this.state;

      // Use custom fallback if provided
      if (FallbackComponent && error) {
        return <FallbackComponent error={error} reset={this.handleReset} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page or return to the dashboard.
            </p>

            {showDetails && error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Error Details:
                </h3>
                <code className="text-xs text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </code>
                {errorId && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Error ID: {errorId}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
              
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorId?: string) => {
    console.error('[useErrorHandler] Error caught:', error);
    
    // Could integrate with error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      // errorTrackingService.captureException(error, { errorId });
    }
  };

  return { handleError };
};

// Dashboard-specific error fallback
export const DashboardErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ 
  error, 
  reset 
}) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard Error
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The dashboard encountered an error while loading. This could be due to a network issue or temporary service disruption.
      </p>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Technical Details:
        </h3>
        <code className="text-xs text-red-600 dark:text-red-400 break-all">
          {error.message}
        </code>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retry Dashboard
        </button>
        
        <Link
          href="/"
          className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;