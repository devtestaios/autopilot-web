'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import NavigationTabs from '@/components/NavigationTabs';

// Dynamic import for SSR safety
const CostAlertsDashboard = dynamic(
  () => import('@/components/cost-alerts/CostAlertsDashboard'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default function CostMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <CostAlertsDashboard />
    </div>
  );
}