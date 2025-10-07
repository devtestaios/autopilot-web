'use client'

import { PageSkeleton, CampaignCardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import NavigationTabs from '@/components/NavigationTabs'
import UnifiedSidebar from '@/components/UnifiedSidebar'

export default function CampaignsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="flex">
        <UnifiedSidebar />
        <main className="flex-1 lg:ml-64 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageSkeleton showHeader={true}>
              
              {/* Filters and actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex gap-3">
                    <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Campaign cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CampaignCardSkeleton key={i} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

            </PageSkeleton>
          </div>
        </main>
      </div>
    </div>
  )
}