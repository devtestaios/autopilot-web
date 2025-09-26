'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Activity, 
  Plus, 
  BarChart3,
  Eye,
  RefreshCw,
  Zap,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useDashboardData } from '@/hooks/useDashboardData';

import UnifiedSidebar from '@/components/UnifiedSidebar';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import AIControlChat from '@/components/AIControlChat';

// Enhanced Dashboard Components
import EnhancedMetricCard from '@/components/dashboard/EnhancedMetricCard';
import RealTimeWidget from '@/components/dashboard/RealTimeWidget';
import AIInsightsWidget from '@/components/dashboard/AIInsightsWidget';

export default function EnhancedDashboardV2() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time dashboard data with 30-second refresh
  const { quickStats, overview, campaigns, loading, error, refresh, isStale, lastUpdated } = useDashboardData(30000);

  const navigateToNewCampaign = () => router.push('/campaigns/new');
  const navigateToAnalytics = () => router.push('/analytics');
  const navigateToCampaigns = () => router.push('/campaigns');

  // Sample real-time metrics for the RealTimeWidget
  const realTimeMetrics = [
    {
      id: 'ctr',
      name: 'Click-Through Rate',
      value: 3.4,
      change: 12.5,
      trend: 'up' as const,
      status: 'healthy' as const,
      lastUpdated: new Date(),
      target: 3.0,
      unit: '%'
    },
    {
      id: 'cpc',
      name: 'Cost Per Click',
      value: 0.68,
      change: -8.3,
      trend: 'down' as const,
      status: 'healthy' as const,
      lastUpdated: new Date(),
      target: 0.80,
      unit: '$'
    },
    {
      id: 'roas',
      name: 'Return on Ad Spend',
      value: 4.2,
      change: 15.7,
      trend: 'up' as const,
      status: 'healthy' as const,
      lastUpdated: new Date(),
      target: 3.5,
      unit: 'x'
    }
  ];

  // Sample AI insights
  const aiInsights = [
    {
      id: '1',
      title: 'Optimize Google Ads Budget Allocation',
      description: 'Your Search campaigns are showing 23% higher ROAS than Display. Consider reallocating $2,500 for maximum impact.',
      type: 'opportunity' as const,
      priority: 'high' as const,
      impact: 'high' as const,
      confidence: 94,
      actionRequired: true,
      estimatedImprovement: '+$8,400 revenue',
      data: {
        metric: 'ROAS',
        current: 3.2,
        potential: 4.1,
        timeframe: '30 days'
      },
      actions: [
        {
          label: 'Auto-Optimize',
          action: () => console.log('Auto-optimize clicked'),
          variant: 'primary' as const
        },
        {
          label: 'Review',
          action: () => console.log('Review clicked')
        }
      ],
      tags: ['Google Ads', 'Budget', 'Optimization'],
      createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: '2',
      title: 'Meta Audience Expansion Opportunity',
      description: 'Lookalike audiences based on your top 5% customers show 31% lower CPA. Expand to capture similar high-value users.',
      type: 'optimization' as const,
      priority: 'medium' as const,
      impact: 'medium' as const,
      confidence: 87,
      actionRequired: false,
      estimatedImprovement: '+156 conversions',
      data: {
        metric: 'CPA',
        current: 42,
        potential: 29,
        timeframe: '14 days'
      },
      actions: [
        {
          label: 'Create Audience',
          action: () => console.log('Create audience clicked'),
          variant: 'primary' as const
        }
      ],
      tags: ['Meta', 'Audience', 'CPA'],
      createdAt: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
    },
    {
      id: '3',
      title: 'Seasonal Trend Alert',
      description: 'Holiday shopping season is approaching. Historical data shows 45% increase in conversion rates for similar businesses.',
      type: 'trend' as const,
      priority: 'medium' as const,
      impact: 'high' as const,
      confidence: 91,
      actionRequired: true,
      estimatedImprovement: '+45% conversions',
      actions: [
        {
          label: 'Prepare Campaigns',
          action: () => console.log('Prepare campaigns clicked'),
          variant: 'primary' as const
        }
      ],
      tags: ['Seasonal', 'Planning', 'Trends'],
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    }
  ];

  const handleRefreshRealTime = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (showToast) {
      showToast({
        type: 'success',
        title: 'Real-time data refreshed'
      });
    }
  };

  const handleInsightClick = (insight: any) => {
    console.log('Insight clicked:', insight);
    // Navigate to detailed insight view or open modal
  };

  const handleActionClick = (insight: any, action: any) => {
    console.log('Action clicked:', action.label, 'for insight:', insight.title);
    if (showToast) {
      showToast({
        type: 'info',
        title: `${action.label} initiated for: ${insight.title}`
      });
    }
  };

  // Generate sparkline data for metric cards
  const generateSparklineData = () => {
    return Array.from({ length: 10 }, () => Math.random() * 100 + 50);
  };

  // Enhanced metric cards data
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
      sparklineData: generateSparklineData(),
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
      sparklineData: generateSparklineData(),
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
      sparklineData: generateSparklineData(),
      subtitle: 'AI-optimized performance'
    },
    {
      title: 'Total Impressions',
      value: '2.4M',
      change: 18.9,
      changeLabel: 'reach expansion',
      icon: Eye,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      onClick: navigateToAnalytics,
      sparklineData: generateSparklineData(),
      subtitle: 'Cross-platform visibility'
    }
  ];

  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refresh(),
        handleRefreshRealTime()
      ]);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'All dashboard data refreshed successfully'
        });
      }
    } catch (error) {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Failed to refresh some data'
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <main className="p-6 space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered insights and real-time performance optimization
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <PremiumButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                onClick={refreshAllData}
                disabled={isRefreshing}
              >
                Refresh All
              </PremiumButton>
              
              <PremiumButton
                onClick={navigateToNewCampaign}
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                New Campaign
              </PremiumButton>
              
              {lastUpdated && (
                <span className={`text-xs ${isStale ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </motion.div>

          {/* Enhanced Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {enhancedMetrics.map((metric, index) => (
              <EnhancedMetricCard
                key={metric.title}
                {...metric}
                loading={loading}
                showSparkline={true}
              />
            ))}
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts and Performance */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Overview Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PremiumCard variant="glassmorphism" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Performance Overview
                    </h3>
                    <div className="flex items-center space-x-2">
                      <PremiumButton variant="outline" size="sm" onClick={navigateToAnalytics}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Details
                      </PremiumButton>
                    </div>
                  </div>
                  
                  <div className="text-center py-12" data-testid="dashboard-chart">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Advanced performance charts will appear here
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Connected to real-time campaign data
                    </p>
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Real-Time Performance Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RealTimeWidget
                  title="Real-Time Performance"
                  metrics={realTimeMetrics}
                  refreshInterval={30000}
                  onRefresh={handleRefreshRealTime}
                />
              </motion.div>
            </div>

            {/* Right Column - AI Insights and Quick Actions */}
            <div className="space-y-6">
              {/* AI Insights Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AIInsightsWidget
                  insights={aiInsights}
                  onInsightClick={handleInsightClick}
                  onActionClick={handleActionClick}
                  maxVisible={3}
                  autoRotate={true}
                />
              </motion.div>

              {/* Quick Actions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PremiumCard variant="glassmorphism" className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quick Actions
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <PremiumButton
                      onClick={navigateToNewCampaign}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Create New Campaign
                    </PremiumButton>
                    
                    <PremiumButton
                      onClick={navigateToAnalytics}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      icon={<BarChart3 className="h-4 w-4" />}
                    >
                      Advanced Analytics
                    </PremiumButton>
                    
                    <PremiumButton
                      onClick={() => router.push('/ai-center')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      icon={<Brain className="h-4 w-4" />}
                    >
                      AI Optimization Center
                    </PremiumButton>
                  </div>
                </PremiumCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <AIControlChat defaultMinimized={true} />
    </div>
  );
}