'use client';

import React from 'react';
import { AlertCircle, WifiOff, Server, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  type?: 'network' | 'server' | 'general';
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorFallback({
  title,
  message,
  type = 'general',
  onRetry,
  showRetry = true
}: ErrorFallbackProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="h-12 w-12 text-red-500" />;
      case 'server':
        return <Server className="h-12 w-12 text-red-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'server':
        return 'Server Error';
      default:
        return 'Something went wrong';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'network':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'server':
        return 'The server is currently unavailable. Please try again in a few moments.';
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  };

  return (
    <div className="min-h-[300px] flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title || getDefaultTitle()}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {message || getDefaultMessage()}
        </p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Specific error fallback components
export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback 
      type="network" 
      onRetry={onRetry}
    />
  );
}

export function ServerErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback 
      type="server" 
      onRetry={onRetry}
    />
  );
}

export function LoadingErrorFallback({ 
  resource, 
  onRetry 
}: { 
  resource?: string; 
  onRetry?: () => void; 
}) {
  return (
    <ErrorFallback 
      title={`Failed to load ${resource || 'data'}`}
      message={`Unable to load ${resource || 'the requested data'}. This might be due to a temporary network issue.`}
      type="network"
      onRetry={onRetry}
    />
  );
}