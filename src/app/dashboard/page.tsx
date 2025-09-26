'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  RefreshCw,
  Plus,
  Eye,
  Zap,
  Target
} from 'lucide-react';

// Dynamic imports for SSR safety
import dynamic from 'next/dynamic';
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/DashboardStats';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time dashboard data with 30-second refresh
  const { quickStats, overview, campaigns, loading, error, refresh, isStale, lastUpdated } = useDashboardData(30000);

  // Navigation functions
  const navigateToAnalytics = () => router.push('/analytics');
  const navigateToCampaigns = () => router.push('/campaigns');
  const navigateToNewCampaign = () => router.push('/campaigns/new');
  const navigateToAICenter = () => router.push('/ai-center');

  // Manual refresh functionality
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      await refresh();
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Data refreshed successfully',
          description: 'All dashboard data has been updated'
        });
      }
    } catch (error) {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Refresh failed',
          description: 'Unable to refresh dashboard data'
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Icon mapping for quick stats
  const iconMap = {
    DollarSign: DollarSign,
    Target: Target,
    TrendingUp: TrendingUp,
    Users: Users
  } as const;

  if (loading && !quickStats.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Unified Sidebar - RESTORED */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
      }`}>
        {/* Advanced Navigation - RESTORED */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.email || 'Demo User'}! Here's your campaign overview.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              {/* Data Freshness Indicator */}
              {lastUpdated && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Activity className="w-4 h-4 mr-1" />
                  <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
                  {isStale && (
                    <span className="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs">
                      Stale
                    </span>
                  )}
                </div>
              )}
              
              {/* Refresh Button */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh dashboard data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              {/* New Campaign Button */}
              <button
                onClick={navigateToNewCampaign}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <div className="text-red-600 dark:text-red-400">
                <p className="font-semibold mb-1">Dashboard Error</p>
                <p className="text-sm">Error loading dashboard data: {error}</p>
                <p className="text-sm mt-2">Using cached data where available.</p>
              </div>
            </div>
          )}

          {/* Enhanced Metrics Grid - RESTORED with real data */}
          {quickStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || DollarSign;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={stat.title.includes('Campaign') ? navigateToCampaigns : navigateToAnalytics}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className={`w-4 h-4 mr-1 ${stat.color}`} />
                      <span className={`font-medium ${stat.color}`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* DashboardStats Component - ENHANCED INTEGRATION */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Campaign Performance Overview
              </h2>
              <button
                onClick={navigateToAnalytics}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                View Advanced Analytics
              </button>
            </div>
            <DashboardStats campaigns={campaigns} loading={loading} />
          </div>

          {/* Quick Actions Grid - RESTORED & ENHANCED */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaign Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Campaign Management
                </h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={navigateToNewCampaign}
                  className="w-full flex items-center p-3 text-left bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
                  <span className="font-medium text-teal-700 dark:text-teal-300">Create New Campaign</span>
                </button>
                <button
                  onClick={navigateToCampaigns}
                  className="w-full flex items-center p-3 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">View All Campaigns</span>
                </button>
              </div>
            </div>

            {/* Analytics & Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics & Insights
                </h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={navigateToAnalytics}
                  className="w-full flex items-center p-3 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">Advanced Analytics</span>
                </button>
                <button
                  onClick={navigateToAICenter}
                  className="w-full flex items-center p-3 text-left bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                >
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3" />
                  <span className="font-medium text-amber-700 dark:text-amber-300">AI Center</span>
                </button>
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Status
                </h3>
              </div>
              {overview && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Campaigns</span>
                    <span className="font-medium text-gray-900 dark:text-white">{overview.total_campaigns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Spend</span>
                    <span className="font-medium text-gray-900 dark:text-white">${overview.total_spend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg ROAS</span>
                    <span className="font-medium text-gray-900 dark:text-white">{overview.avg_roas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active Campaigns</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{overview.active_campaigns}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* AI Control Chat - RESTORED */}
      <AIControlChat />
    </div>
  );
}
