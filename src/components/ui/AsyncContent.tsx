'use client';

import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { ErrorFallback, LoadingErrorFallback } from '../ui/ErrorFallback';

interface AsyncContentProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onRetry?: () => void;
  loadingHeight?: string;
  resourceName?: string;
}

export function AsyncContent({
  loading,
  error,
  children,
  fallback,
  errorFallback,
  onRetry,
  loadingHeight = '400px',
  resourceName
}: AsyncContentProps) {
  if (loading) {
    return fallback || (
      <div style={{ minHeight: loadingHeight }}>
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return errorFallback || (
      <LoadingErrorFallback 
        resource={resourceName}
        onRetry={onRetry}
      />
    );
  }

  return <>{children}</>;
}

// Specific async content components for common use cases
export function AsyncTable({
  loading,
  error,
  children,
  onRetry,
  rowCount = 5
}: {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  onRetry?: () => void;
  rowCount?: number;
}) {
  return (
    <AsyncContent
      loading={loading}
      error={error}
      onRetry={onRetry}
      resourceName="table data"
      fallback={
        <div className="space-y-3">
          {Array.from({ length: rowCount }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      }
    >
      {children}
    </AsyncContent>
  );
}

export function AsyncChart({
  loading,
  error,
  children,
  onRetry
}: {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <AsyncContent
      loading={loading}
      error={error}
      onRetry={onRetry}
      resourceName="chart data"
      loadingHeight="300px"
      fallback={
        <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      }
    >
      {children}
    </AsyncContent>
  );
}

export function AsyncCard({
  loading,
  error,
  children,
  onRetry
}: {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <AsyncContent
      loading={loading}
      error={error}
      onRetry={onRetry}
      resourceName="card data"
      loadingHeight="200px"
      fallback={
        <div className="p-6 border rounded-lg">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      }
    >
      {children}
    </AsyncContent>
  );
}