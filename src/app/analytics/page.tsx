'use client';

import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import NavigationTabs from '@/components/NavigationTabs';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <AdvancedAnalyticsDashboard />
      </div>
    </div>
  );
}