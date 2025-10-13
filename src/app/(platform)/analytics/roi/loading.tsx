'use client'

import { PageSkeleton, ChartSkeleton, DashboardWidgetSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function ROIAnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <DashboardWidgetSkeleton key={i} />
                ))}
              </div>

              {/* ROI charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>

              {/* Campaign ROI breakdown */}
              <div className="mb-8">
                <TableSkeleton rows={8} columns={6} />
              </div>

              {/* Revenue analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
                <DashboardWidgetSkeleton />
              </div>

            </PageSkeleton>
          </div>
        </main>
      </div>
    </div>
  )
}