'use client';

import React from 'react';
import MultiPlatformSyncDashboard from '@/components/MultiPlatformSyncDashboard';
import { useTheme } from '@/contexts/ThemeContext';

export default function SyncManagementPage() {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <MultiPlatformSyncDashboard />
      </div>
    </div>
  );
}
