'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Target,
  MessageSquare,
  Mail,
  Calendar,
  LayoutDashboard,
  Search,
  Filter,
  Sparkles,
  Clock
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
import { ErrorBoundary, DashboardErrorFallback } from '@/components/ErrorBoundary';

// MASTER TERMINAL: Platform registry integration
import { EXISTING_PLATFORMS, PLANNED_PLATFORMS, PLATFORM_CATEGORIES, PlatformModule } from '@/config/platformRegistry';
import { FEATURE_FLAGS, isFeatureEnabled } from '@/config/featureFlags';

function DashboardPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // MASTER TERMINAL: Platform filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time dashboard data with 30-second refresh
  const { quickStats, overview, campaigns, loading, error, refresh, isStale, lastUpdated } = useDashboardData(30000);

  // Cross-platform navigation functions
  const navigateToMarketing = () => router.push('/marketing');
  const navigateToSocialMedia = () => router.push('/social-media');
  const navigateToEmailMarketing = () => router.push('/email-marketing');
  const navigateToCollaboration = () => router.push('/collaboration');
  const navigateToIntegrations = () => router.push('/integrations');
  const navigateToAnalytics = () => router.push('/analytics');
  const navigateToAICenter = () => router.push('/ai-center');

  // MASTER TERMINAL: Platform filtering logic
  const availablePlatforms = useMemo(() => {
    let platforms = [...EXISTING_PLATFORMS];
    
    // Add development platforms if their feature flags are enabled
    const enabledPlannedPlatforms = PLANNED_PLATFORMS.filter(platform => 
      isFeatureEnabled('masterTerminal') && 
      (platform.status === 'development' ? 
        isFeatureEnabled(platform.id.replace('-', '') as any) : 
        false)
    );
    
    platforms = [...platforms, ...enabledPlannedPlatforms];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      platforms = platforms.filter(platform => platform.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      platforms = platforms.filter(platform =>
        platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return platforms;
  }, [selectedCategory, searchQuery]);
  const navigateToCampaigns = () => router.push('/campaigns');
  const navigateToNewCampaign = () => router.push('/campaigns/new');

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

  // Error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Dashboard Unavailable
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to load dashboard data. Please check your connection and try again.
          </p>
          
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 w-full"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Retrying...' : 'Try Again'}
          </button>
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
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Master Terminal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Unified command center for all platform operations • AI-Enhanced Dashboard
                </p>
              </div>
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
                    <span className="font-medium text-gray-900 dark:text-white">{overview?.total_campaigns || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Spend</span>
                    <span className="font-medium text-gray-900 dark:text-white">${(overview?.total_spend || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg ROAS</span>
                    <span className="font-medium text-gray-900 dark:text-white">{(overview?.avg_roas || 0).toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active Campaigns</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{overview?.active_campaigns || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MASTER TERMINAL: Cross-Platform Control Center */}
          <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Master Terminal Control Center
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Access all platforms with AI-enhanced dashboards and unified control
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Marketing Command Center */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-orange-200 dark:border-orange-800"
                onClick={navigateToMarketing}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Marketing Hub</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unified campaigns</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    AI Enhanced
                  </span>
                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Social Media Dashboard */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-pink-200 dark:border-pink-800"
                onClick={navigateToSocialMedia}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Social Media</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Multi-platform</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-full">
                    AI Enhanced
                  </span>
                  <button className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Email Marketing Platform */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                onClick={navigateToEmailMarketing}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email Marketing</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Campaign automation</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    AI Enhanced
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Collaboration Hub */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-green-200 dark:border-green-800"
                onClick={navigateToCollaboration}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Real-time workspace</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    Ready for Connection
                  </span>
                  <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Integrations Marketplace */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-purple-200 dark:border-purple-800"
                onClick={navigateToIntegrations}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Integrations</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">App marketplace</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    Ready for Connection
                  </span>
                  <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Master Terminal Analytics */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-teal-200 dark:border-teal-800"
                onClick={navigateToAnalytics}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Cross-Platform Analytics</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unified insights</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full">
                    AI Powered
                  </span>
                  <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Master Terminal Quick Actions */}
            <div className="mt-6 pt-6 border-t border-teal-200 dark:border-teal-800">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={navigateToAICenter}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI Control Center
                </button>
                <button
                  onClick={navigateToAnalytics}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Unified Analytics
                </button>
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh All Data
                </button>
              </div>
            </div>
          </div>

          {/* MASTER TERMINAL: Platform Control Center */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-t-4 border-teal-500">
            {/* Master Terminal Navigation Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="font-medium text-teal-600 dark:text-teal-400">Master Terminal</span>
              <span className="mx-2">›</span>
              <span>Platform Registry</span>
              <span className="mx-2">›</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {selectedCategory === 'all' ? 'All Platforms' : PLATFORM_CATEGORIES[selectedCategory as keyof typeof PLATFORM_CATEGORIES]}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <LayoutDashboard className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Platform Control Registry
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {availablePlatforms.length} platforms available • Hierarchical Navigation • Central Command
                  </p>
                </div>
              </div>
              
              {/* Master Terminal Badge */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full border border-teal-300 dark:border-teal-700">
                <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                  Master Terminal
                </span>
              </div>
            </div>

            {/* Category Filter & Search */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Master Terminal Quick Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full mb-4">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${ 
                      selectedCategory === 'all'
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <LayoutDashboard className="w-5 h-5 mb-1" />
                      <span>All Platforms</span>
                      <span className="text-xs opacity-75">({EXISTING_PLATFORMS.length})</span>
                    </div>
                  </button>
                  {Object.entries(PLATFORM_CATEGORIES).map(([categoryId, categoryName]) => {
                    const count = EXISTING_PLATFORMS.filter(p => p.category === categoryId).length;
                    const IconComponent = categoryId === 'marketing' ? Target : 
                                         categoryId === 'business' ? Users :
                                         categoryId === 'analytics' ? BarChart3 :
                                         categoryId === 'ai' ? Zap :
                                         categoryId === 'integrations' ? RefreshCw : Settings;
                    return (
                      <button
                        key={categoryId}
                        onClick={() => setSelectedCategory(categoryId)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedCategory === categoryId
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <IconComponent className="w-5 h-5 mb-1" />
                          <span className="line-clamp-1">{categoryName}</span>
                          <span className="text-xs opacity-75">({count})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative min-w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Platform Grid - Master Terminal Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availablePlatforms.map((platform: PlatformModule, index: number) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={platform.route} className="block">
                    <div className={`
                      relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer
                      ${platform.status === 'active' 
                        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl hover:scale-105' 
                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-60'
                      }
                    `}>
                      {/* Platform Status & Hierarchy Indicator */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {platform.status === 'active' && (
                          <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                        )}
                        {platform.status === 'development' && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            <Zap className="w-3 h-3" />
                            DEV
                          </div>
                        )}
                        {platform.status === 'planning' && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            SOON
                          </div>
                        )}
                        {/* Hierarchy Level Badge */}
                        <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full opacity-30 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      
                      {/* Platform Content */}
                      <div className="mb-4">
                        {/* Platform Header */}
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md">
                            {platform.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {platform.name}
                            </h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                              {PLATFORM_CATEGORIES[platform.category as keyof typeof PLATFORM_CATEGORIES]}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {platform.description}
                        </p>
                        
                        {/* Master Terminal Navigation Hierarchy */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                          <span className="text-teal-600 dark:text-teal-400">Master Terminal</span> 
                          <span className="mx-1">›</span>
                          <span>{PLATFORM_CATEGORIES[platform.category as keyof typeof PLATFORM_CATEGORIES]}</span>
                          <span className="mx-1">›</span>
                          <span className="text-gray-900 dark:text-white">{platform.name}</span>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {platform.features.slice(0, 3).map((feature: string) => (
                            <span 
                              key={feature}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium"
                            >
                              {feature.replace('-', ' ')}
                            </span>
                          ))}
                          {platform.features.length > 3 && (
                            <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md text-xs font-medium">
                              +{platform.features.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        {/* Quick Actions & Capabilities */}
                        {platform.status === 'active' && (platform.quickActions.length > 0 || platform.aiCapabilities.length > 0) && (
                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              {platform.quickActions.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3 text-teal-500" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {platform.quickActions.length} quick actions
                                  </span>
                                </div>
                              )}
                              {platform.aiCapabilities.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-purple-500" />
                                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">AI Enhanced</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {availablePlatforms.length === 0 && (
              <div className="text-center py-16">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No platforms found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {/* Development Notice */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🚀 Platform Roadmap
              </h3>
              <p className="text-blue-700 dark:text-blue-200 mb-4">
                Building toward 20 integrated platforms. Currently {EXISTING_PLATFORMS.length} platforms are active 
                with {PLANNED_PLATFORMS.length} more in development.
              </p>
              <div className="flex flex-wrap gap-2">
                {PLANNED_PLATFORMS.slice(0, 6).map(platform => (
                  <span 
                    key={platform.id}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {platform.name} - {platform.status}
                  </span>
                ))}
                {PLANNED_PLATFORMS.length > 6 && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    +{PLANNED_PLATFORMS.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Control Chat - RESTORED */}
      <AIControlChat />
    </div>
  );
}

// Main export with Error Boundary
export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <DashboardPageContent />
    </ErrorBoundary>
  );
}
