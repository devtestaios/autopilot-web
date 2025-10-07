'use client';

import CustomReportBuilder from '@/components/CustomReportBuilder';
import NavigationTabs from '@/components/NavigationTabs';

export default function ReportBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <CustomReportBuilder />
    </div>
  );
}