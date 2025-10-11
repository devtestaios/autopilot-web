'use client'

import { PageSkeleton, ChartSkeleton, DashboardWidgetSkeleton, CampaignCardSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Overview stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DashboardWidgetSkeleton key={i} />
                ))}
              </div>

              {/* Charts section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>

              {/* Recent campaigns */}
              <div className="mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CampaignCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardWidgetSkeleton />
                <DashboardWidgetSkeleton />
                <DashboardWidgetSkeleton />
              </div>

            </PageSkeleton>
          </div>
        </main>
      </div>
    </div>
  )
}