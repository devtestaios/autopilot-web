'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    reset: () => void;
    errorId?: string;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  level?: 'page' | 'component' | 'widget';
}

class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || `error_${Date.now()}`;
    
    // Log error with context
    console.error('Enhanced Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString()
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, or custom analytics
      // analytics.track('error_boundary_triggered', { errorId, error: error.message });
    }

    this.setState({
      error,
      errorInfo,
      errorId
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            reset={this.handleReset}
            errorId={this.state.errorId}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={this.handleReset}
          errorId={this.state.errorId}
          level={this.props.level}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  reset: () => void;
  errorId?: string;
  level?: 'page' | 'component' | 'widget';
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  reset,
  errorId,
  level = 'component'
}) => {
  const getErrorTitle = () => {
    switch (level) {
      case 'page': return 'Page Error';
      case 'widget': return 'Widget Error';
      default: return 'Something went wrong';
    }
  };

  const getErrorMessage = () => {
    if (error?.message?.includes('ChunkLoadError')) {
      return 'Failed to load application resources. This usually happens after an update.';
    }
    if (error?.message?.includes('Network')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    return error?.message || 'An unexpected error occurred';
  };

  const getErrorActions = () => {
    const actions = [
      {
        label: 'Try Again',
        action: reset,
        icon: RefreshCw,
        variant: 'primary' as const
      }
    ];

    if (level === 'page') {
      actions.push({
        label: 'Go Home',
        action: () => window.location.href = '/',
        icon: Home,
        variant: 'secondary' as const
      });
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      actions.push({
        label: 'Go Back',
        action: () => window.history.back(),
        icon: ArrowLeft,
        variant: 'secondary' as const
      });
    }

    return actions;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center justify-center p-8 
        ${level === 'page' ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : 'min-h-64'}
      `}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
        >
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {getErrorTitle()}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {getErrorMessage()}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
              <div className="mb-2">
                <strong>Error ID:</strong> {errorId}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {getErrorActions().map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={action.action}
              className={`
                flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${action.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>

        {errorId && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Error ID: {errorId}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Specialized Error Boundaries for different use cases

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="page">
    {children}
  </EnhancedErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="component">
    {children}
  </EnhancedErrorBoundary>
);

export const WidgetErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="widget">
    {children}
  </EnhancedErrorBoundary>
);

// Hook for manual error reporting
export const useErrorHandler = () => {
  const reportError = (error: Error, context?: string) => {
    const errorId = `manual_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    console.error('Manual error report:', {
      error: error.message,
      stack: error.stack,
      context,
      errorId,
      timestamp: new Date().toISOString()
    });

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('manual_error_report', { errorId, error: error.message, context });
    }

    return errorId;
  };

  return { reportError };
};

export default EnhancedErrorBoundary;