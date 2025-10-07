'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Dynamic imports for heavy dashboard components
const DashboardMetrics = dynamic(() => import('./components/DashboardMetrics'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
});

const PerformanceCharts = dynamic(() => import('./components/PerformanceCharts'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
});

const CampaignTable = dynamic(() => import('./components/CampaignTable'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
});

const RealTimeData = dynamic(() => import('./components/RealTimeData'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-green-200 rounded-full"></div>
        <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default function OptimizedPerformanceDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar 
        defaultCollapsed={sidebarCollapsed} 
        onCollapseChange={setSidebarCollapsed} 
      />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'
      }`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Performance Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Real-time insights and performance analytics
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RealTimeData />
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DashboardMetrics />
            </motion.div>

            {/* Performance Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PerformanceCharts />
            </motion.div>

            {/* Campaign Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CampaignTable />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}