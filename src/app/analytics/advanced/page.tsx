'use client';

import React from 'react';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdvancedAnalyticsPage() {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <AdvancedAnalyticsDashboard />
      </div>
    </div>
  );
}