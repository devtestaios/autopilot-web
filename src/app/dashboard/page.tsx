'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, DollarSign, BarChart3, Users } from 'lucide-react';

// Dynamic imports for SSR safety (following dissertation patterns)
const MasterTerminalCore = dynamic(() => import('@/components/dashboard/MasterTerminalCore'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  )
});

const IntelligentDashboardCore = dynamic(() => import('@/components/dashboard/IntelligentDashboardCore'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  )
});

// Enterprise KPI Dashboard Component
interface EnterpriseKPI {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [selectedSuite, setSelectedSuite] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  
  // Enterprise KPIs - Real-time business metrics
  const [enterpriseKPIs, setEnterpriseKPIs] = useState<EnterpriseKPI[]>([
    {
      title: 'Total Revenue',
      value: '$487,320',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Active Campaigns',
      value: '24',
      change: '+12.5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Conversion Rate',
      value: '4.7%',
      change: '+2.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Team Members',
      value: '1,247',
      change: '+8.4%',
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ]);

  // Handle suite selection
  const handleSuiteChange = (suiteId: string) => {
    setSelectedSuite(suiteId);
    
    // Analytics tracking for business intelligence
    if (typeof window !== 'undefined') {
      console.log(`Suite selected: ${suiteId}`);
    }
  };

  // Handle platform access
  const handlePlatformAccess = (platformId: string) => {
    // Route to specific platform based on platformId
    const routeMap: Record<string, string> = {
      'social-media': '/social-media',
      'email-marketing': '/email-marketing',
      'project-management': '/project-management',
      'marketing-command-center': '/marketing-command-center'
    };

    const route = routeMap[platformId];
    if (route) {
      router.push(route);
    }
  };

  // Real-time KPI updates (simulated - would connect to real analytics)
  useEffect(() => {
    const updateKPIs = () => {
      setEnterpriseKPIs(prev => prev.map(kpi => ({
        ...kpi,
        // Simulate real-time updates
        value: kpi.title === 'Total Revenue' 
          ? `$${(Math.random() * 50000 + 450000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          : kpi.value
      })));
    };

    const interval = setInterval(updateKPIs, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enterprise KPI Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseKPIs.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className={`w-4 h-4 mr-1 ${kpi.color}`} />
                  <span className={`font-medium ${kpi.color}`}>
                    {kpi.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Intelligent Business Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <IntelligentDashboardCore />
        </motion.div>

        {/* Master Terminal Core */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MasterTerminalCore
            selectedSuite={selectedSuite}
            viewMode={viewMode}
            onSuiteChange={handleSuiteChange}
            onPlatformAccess={handlePlatformAccess}
          />
        </motion.div>
      </div>
    </div>
  );
}
