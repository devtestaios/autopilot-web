'use client'

import { PageSkeleton, ChartSkeleton, DashboardWidgetSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function PerformanceAnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DashboardWidgetSkeleton key={i} />
                ))}
              </div>

              {/* Main charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>

              {/* Performance table */}
              <div className="mb-8">
                <TableSkeleton rows={6} columns={7} />
              </div>

              {/* Platform breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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