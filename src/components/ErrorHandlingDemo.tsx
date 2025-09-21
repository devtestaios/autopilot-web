'use client';

import React from 'react';
import { useErrorHandler, useApiCall } from '@/hooks/useErrorHandler';
import { AsyncContent, AsyncTable, AsyncChart } from '@/components/ui/AsyncContent';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { fetchCampaigns } from '@/lib/api';

// Example component demonstrating error handling patterns
export function ErrorHandlingDemo() {
  const { handleAsync, error: manualError, clearError } = useErrorHandler({
    showToast: true,
    toastTitle: 'Campaign Error'
  });

  // Example 1: Automatic API call with error handling
  const { data: campaigns, error: apiError, isLoading, refetch } = useApiCall(
    fetchCampaigns,
    { immediate: true }
  );

  // Example 2: Manual error handling
  const handleManualAction = async () => {
    await handleAsync(async () => {
      // Simulate an error or successful operation
      if (Math.random() > 0.5) {
        throw new Error('Random error occurred');
      }
      console.log('Operation successful');
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Error Handling Demo</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This page demonstrates various error handling patterns used throughout the platform.
        </p>
      </div>

      {/* Example 1: Async Content with Loading and Error States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">1. Async Content Pattern</h3>
        <AsyncContent
          loading={isLoading}
          error={apiError}
          onRetry={refetch}
          resourceName="campaigns"
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200">
              ✅ Successfully loaded {campaigns?.length || 0} campaigns
            </p>
          </div>
        </AsyncContent>
      </div>

      {/* Example 2: Async Table Pattern */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">2. Table Loading Pattern</h3>
        <AsyncTable
          loading={isLoading}
          error={apiError}
          onRetry={refetch}
          rowCount={3}
        >
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Campaign Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Platform</th>
                </tr>
              </thead>
              <tbody>
                {campaigns?.slice(0, 3).map((campaign, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{campaign.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{campaign.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AsyncTable>
      </div>

      {/* Example 3: Manual Error Handling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3. Manual Error Handling</h3>
        <div className="flex gap-4">
          <button
            onClick={handleManualAction}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Test Random Error
          </button>
          {manualError && (
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear Error
            </button>
          )}
        </div>
        {manualError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              ❌ {manualError.message}
            </p>
          </div>
        )}
      </div>

      {/* Example 4: Error Fallback Components */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">4. Error Fallback Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Network Error</h4>
            <ErrorFallback 
              type="network" 
              onRetry={() => console.log('Retry network')}
            />
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Server Error</h4>
            <ErrorFallback 
              type="server" 
              onRetry={() => console.log('Retry server')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}