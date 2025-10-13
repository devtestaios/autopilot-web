'use client'

import { PageSkeleton, TableSkeleton, DashboardWidgetSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function LeadsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation provided by root layout */}
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Lead stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DashboardWidgetSkeleton key={i} />
                ))}
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-28 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Leads table */}
              <TableSkeleton rows={10} columns={6} />

            </PageSkeleton>
          </div>
        </main>
      </div>
    </div>
  )
}