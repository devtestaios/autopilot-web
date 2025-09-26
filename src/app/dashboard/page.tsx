'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  Activity,
  Zap,
  Target,
  RefreshCw,
  Settings,
  Sparkles
} from 'lucide-react';

// Dynamic imports for components with client-side dependencies
import dynamic from 'next/dynamic';
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/components/ui/Toast';

// Enhanced components - dynamically imported to avoid disrupting base functionality
const EnhancedMetricCard = dynamic(() => import('@/components/dashboard/EnhancedMetricCard'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
});

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(() => {
    // Check if user has previously enabled enhanced mode
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-enhanced') === 'true';
    }
    return false;
  });

  // Real-time dashboard data with 30-second refresh
  const { quickStats, overview, campaigns, loading, error, refresh, isStale, lastUpdated } = useDashboardData(30000);

  // Icon mapping for quick stats
  const iconMap = {
    DollarSign: DollarSign,
    Target: Target,
    TrendingUp: TrendingUp,
    Users: Users
  } as const;

  const navigateToAnalytics = () => {
    router.push('/analytics');
  };

  const navigateToCampaigns = () => {
    router.push('/campaigns');
  };

  const toggleEnhancedMode = () => {
    const newMode = !enhancedMode;
    setEnhancedMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-enhanced', newMode.toString());
    }
    
    // Show feedback to user
    if (showToast) {
      showToast({
        type: 'success',
        title: `${newMode ? 'Enhanced' : 'Standard'} dashboard activated`,
        description: newMode 
          ? 'Enjoy improved visualizations and interactions!' 
          : 'Switched back to standard dashboard view.'
      });
    }
  };

  // Enhanced metrics data (only used when enhanced mode is enabled)
  const enhancedMetrics = [
    {
      title: 'Total Revenue',
      value: '$847,291',
      change: 15.3,
      changeLabel: 'vs last month',
      icon: DollarSign,
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      onClick: navigateToAnalytics,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 100 + 50),
      subtitle: 'Across all platforms'
    },
    {
      title: 'Active Campaigns',
      value: 24,
      change: 12.5,
      changeLabel: '+3 this week',
      icon: Target,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      onClick: navigateToCampaigns,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 100 + 50),
      subtitle: 'Google, Meta, LinkedIn'
    },
    {
      title: 'Conversion Rate',
      value: '12.4%',
      change: 8.7,
      changeLabel: 'optimization impact',
      icon: TrendingUp,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      onClick: navigateToAnalytics,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 100 + 50),
      subtitle: 'AI-optimized performance'
    },
    {
      title: 'Total Impressions',
      value: '2.4M',
      change: 18.9,
      changeLabel: 'reach expansion',
      icon: Activity,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      onClick: navigateToAnalytics,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 100 + 50),
      subtitle: 'Cross-platform visibility'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'
        }`}>
          <div className="p-6 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered campaign optimization and performance insights
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                {/* Enhanced Mode Toggle */}
                <PremiumButton
                  variant={enhancedMode ? "primary" : "outline"}
                  size="sm"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={toggleEnhancedMode}
                  title={enhancedMode ? "Switch to Standard View" : "Enable Enhanced Dashboard"}
                >
                  {enhancedMode ? 'Enhanced' : 'Standard'}
                </PremiumButton>
                
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                  onClick={refresh}
                  disabled={loading}
                >
                  Refresh
                </PremiumButton>
                {lastUpdated && (
                  <span className={`text-xs ${isStale ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Enhanced Mode Discovery Banner - Only shown once */}
            {!enhancedMode && typeof window !== 'undefined' && !localStorage.getItem('dashboard-enhanced-seen') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <PremiumCard className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          ✨ Try the Enhanced Dashboard
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Interactive metrics, sparklines, and advanced visualizations await!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PremiumButton
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          toggleEnhancedMode();
                          localStorage.setItem('dashboard-enhanced-seen', 'true');
                        }}
                      >
                        Try Enhanced
                      </PremiumButton>
                      <PremiumButton
                        size="sm"
                        variant="ghost"
                        onClick={() => localStorage.setItem('dashboard-enhanced-seen', 'true')}
                      >
                        Dismiss
                      </PremiumButton>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            )}

            {/* Quick Stats Grid - Conditional Rendering */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {error ? (
                <div className="col-span-full">
                  <PremiumCard className="p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">
                      Error loading dashboard data: {error}
                    </p>
                    <PremiumButton onClick={refresh} className="mt-4">
                      Retry
                    </PremiumButton>
                  </PremiumCard>
                </div>
              ) : enhancedMode ? (
                // Enhanced Metrics (when enhanced mode is enabled)
                enhancedMetrics.map((metric, index) => (
                  <EnhancedMetricCard
                    key={metric.title}
                    {...metric}
                    loading={loading}
                    showSparkline={true}
                  />
                ))
              ) : (
                // Standard Metrics (original functionality preserved)
                quickStats.map((stat, index) => {
                  const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                  return (
                    <motion.div
                      key={stat.title}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                    <PremiumCard 
                      variant="glassmorphism" 
                      hover 
                      className="p-6 cursor-pointer"
                      data-testid="metric-card"
                      onClick={() => {
                        if (stat.title.includes('Revenue')) {
                          navigateToAnalytics();
                        } else if (stat.title.includes('Campaigns')) {
                          navigateToCampaigns();
                        } else {
                          navigateToAnalytics();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {loading ? '...' : stat.value}
                          </p>
                          <p className={`text-sm font-medium ${stat.color} flex items-center gap-1 mt-1`}>
                            <ArrowUpRight className="w-3 h-3" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <IconComponent className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </PremiumCard>
                  </motion.div>
                  );
                })
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              {/* Placeholder chart for testing */}
              <div data-testid="dashboard-chart" role="img" aria-label="Dashboard Chart" className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Dashboard Chart</span>
              </div>
              
              <PremiumCard variant="glassmorphism" className="p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Optimize Your Campaigns?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Let our AI optimization engine take your campaigns to the next level.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <PremiumButton 
                      variant="primary" 
                      size="lg" 
                      glow
                      onClick={navigateToCampaigns}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      View Campaigns
                    </PremiumButton>
                    <PremiumButton 
                      variant="outline" 
                      size="lg"
                      onClick={navigateToAnalytics}
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Analytics
                    </PremiumButton>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}