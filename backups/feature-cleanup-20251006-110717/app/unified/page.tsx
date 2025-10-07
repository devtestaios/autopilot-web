import React from 'react';
import UnifiedPlatformDashboard from '@/components/UnifiedPlatformDashboard';
import NavigationTabs from '@/components/NavigationTabs';

export default function UnifiedPlatformPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <UnifiedPlatformDashboard />
      </div>
    </div>
  );
}