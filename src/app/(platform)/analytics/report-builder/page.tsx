'use client';

import CustomReportBuilder from '@/components/CustomReportBuilder';
// NavigationTabs removed - using root layout Navigation instead
export default function ReportBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      <CustomReportBuilder />
    </div>
  );
}