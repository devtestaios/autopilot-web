'use client'

import { PageSkeleton, ChartSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationTabs />
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Report filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Report charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>

              {/* Data table */}
              <TableSkeleton rows={12} columns={8} />

            </PageSkeleton>
          </div>
        </main>
      </div>
    </div>
  )
}