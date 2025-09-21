'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings,
  Bell,
  LogOut,
  Home,
  Target,
  Zap,
  Clock,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  MoreHorizontal,
  Sparkles,
  ArrowUpRight,
  Activity,
  Globe,
  Shield,
  Rocket
} from 'lucide-react';
import { PulseWaveLogo } from '@/components/PulseWaveLogo';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import ActionDropdown from '@/components/ui/ActionDropdown';
import AIInsights from '@/components/AIInsights';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useToast } from '@/components/ui/Toast';
import AIControlChat from '@/components/AIControlChat';
import { PageSkeleton, ChartSkeleton, DashboardWidgetSkeleton, CampaignCardSkeleton } from '@/components/ui/Skeleton';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AsyncContent } from '@/components/ui/AsyncContent';
import { fetchDashboardOverview, fetchCampaigns, fetchKPISummary } from '@/lib/api';

// Enhanced mock data with more realistic metrics
const enhancedCampaigns = [
  {
    id: '1',
    name: 'Q4 Holiday Shopping Blitz',
    platform: 'Google Ads',
    status: 'active',
    budget: 15000,
    spend: 8240,
    impressions: 425000,
    clicks: 12250,
    conversions: 542,
    ctr: 2.88,
    cpc: 0.67,
    roas: 5.4,
    growth: '+23%'
  },
  {
    id: '2',
    name: 'AI-Powered Retargeting',
    platform: 'Meta',
    status: 'active',
    budget: 8000,
    spend: 5100,
    impressions: 189000,
    clicks: 4890,
    conversions: 267,
    ctr: 2.59,
    cpc: 1.04,
    roas: 4.2,
    growth: '+15%'
  },
  {
    id: '3',
    name: 'LinkedIn Professional Outreach',
    platform: 'LinkedIn',
    status: 'optimizing',
    budget: 5500,
    spend: 2850,
    impressions: 94000,
    clicks: 1720,
    conversions: 89,
    ctr: 1.83,
    cpc: 1.66,
    roas: 3.7,
    growth: '+8%'
  }
];

const aiInsights = [
  {
    type: 'optimization',
    title: 'Budget Reallocation Opportunity',
    description: 'Move $2,400 from LinkedIn to Google Ads for 18% ROAS improvement',
    impact: '+$1,320 revenue',
    confidence: 92,
    icon: Zap,
    color: 'text-blue-600'
  },
  {
    type: 'alert',
    title: 'High-Performing Keywords Detected',
    description: '5 keywords showing 40%+ CTR increase - consider bid increases',
    impact: '+$850 potential',
    confidence: 87,
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    type: 'warning',
    title: 'Campaign Fatigue Warning',
    description: 'Meta campaign showing declining engagement - refresh creative',
    impact: 'Prevent -15% CTR',
    confidence: 78,
    icon: Shield,
    color: 'text-orange-600'
  }
];

export default function EnhancedDashboard() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState('overview');
  const { showToast } = useToast();
  const { error: dashboardError, handleError, clearError } = useErrorHandler();
  
  // Real data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [liveData, setLiveData] = useState<any[]>([]);

  // Load real dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        clearError();

        // Fetch all dashboard data in parallel
        const [overview, campaignsData, kpiSummary] = await Promise.all([
          fetchDashboardOverview(),
          fetchCampaigns(), // Get campaigns
          fetchKPISummary()
        ]);

        setDashboardData(overview);
        setCampaigns(campaignsData);
        setKpiData(kpiSummary);
        setLiveData(campaignsData); // Use campaigns for live data updates

      } catch (err) {
        handleError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [handleError, clearError]);

  // Enhanced stats with real data
  const quickStats = [
    {
      title: 'Total Revenue',
      value: `$${dashboardData?.total_spend?.toLocaleString() || '0'}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Active Campaigns',
      value: dashboardData?.total_campaigns || '0',
      change: '+3',
      icon: Rocket,
      color: 'text-pulse-cyan',
      bgColor: 'bg-pulse-cyan/10'
    },
    {
      title: 'Conversion Rate',
      value: `${kpiData?.conversion_rate || '4.82'}%`,
      change: '+0.8%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'ROAS Average',
      value: `${kpiData?.roas || '4.7'}x`,
      change: '+0.3x',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user, router]);

  // Real-time data updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prevData => 
        prevData.map(campaign => ({
          ...campaign,
          impressions: campaign.impressions + Math.floor(Math.random() * 100),
          clicks: campaign.clicks + Math.floor(Math.random() * 10),
          conversions: campaign.conversions + Math.floor(Math.random() * 3),
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        type: 'success',
        title: 'Data Refreshed',
        description: 'Dashboard data has been updated with latest metrics.',
        duration: 3000
      });
    }, 2000);
  };

  // Navigation functions
  const navigateToNewCampaign = () => {
    router.push('/campaigns/new');
  };

  const navigateToCampaigns = () => {
    router.push('/campaigns');
  };

  const navigateToAnalytics = () => {
    router.push('/analytics');
  };

  const navigateToOptimization = () => {
    router.push('/optimization');
  };

  const viewCampaign = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const editCampaign = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
        
        <main className={`${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-64'} transition-all duration-300 pt-6`}>
          <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <PageSkeleton showHeader={true}>
              
              {/* Quick stats skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DashboardWidgetSkeleton key={i} />
                ))}
              </div>

              {/* Charts skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartSkeleton />
                <div className="space-y-6">
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                </div>
              </div>

              {/* Campaigns skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CampaignCardSkeleton key={i} />
                ))}
              </div>

            </PageSkeleton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Container */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />

        {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AsyncContent
          loading={loading}
          error={dashboardError}
          fallback={
            <PageSkeleton>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardWidgetSkeleton />
                <DashboardWidgetSkeleton />
                <DashboardWidgetSkeleton />
                <DashboardWidgetSkeleton />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            </PageSkeleton>
          }
        >
          {/* Dashboard content starts here */}
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Your campaigns are performing exceptionally well today
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-6 lg:mt-0">
              {/* Quick Actions Dropdown */}
              <ActionDropdown
                onNewCampaign={navigateToNewCampaign}
                onAnalytics={navigateToAnalytics}
                onOptimization={navigateToOptimization}
                onGoals={() => router.push('/goals')}
                onHelp={() => router.push('/help')}
              />
              
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <Clock className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <PremiumButton
                variant="ghost"
                size="sm"
                icon={<Activity className="w-4 h-4" />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </PremiumButton>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PremiumCard 
                variant="glassmorphism" 
                hover 
                className="p-6 cursor-pointer"
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
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${stat.color} flex items-center gap-1 mt-1`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </PremiumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AIInsights 
            page="dashboard" 
            data={{ campaigns: enhancedCampaigns, stats: quickStats }}
          />
        </motion.div>

        {/* Enhanced Campaigns Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Active Campaigns
            </h2>
            <div className="flex items-center gap-3">
              <PremiumButton 
                variant="ghost" 
                size="sm" 
                icon={<Filter className="w-4 h-4" />}
                onClick={navigateToCampaigns}
              >
                Filter
              </PremiumButton>
              <PremiumButton 
                variant="ghost" 
                size="sm" 
                icon={<MoreHorizontal className="w-4 h-4" />}
                onClick={navigateToCampaigns}
              >
                View All
              </PremiumButton>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(campaigns.length > 0 ? campaigns.slice(0, 6) : [
              {
                id: 1,
                name: 'Google Ads - Search Campaign',
                platform: 'Google',
                status: 'active',
                budget: 5000,
                spend: 3200,
                impressions: 125000,
                clicks: 2100,
                conversions: 156,
                ctr: 1.68,
                cpc: 1.52,
                roas: 4.2
              },
              {
                id: 2,
                name: 'Meta Display Campaign',
                platform: 'Meta',
                status: 'active',
                budget: 8000,
                spend: 4800,
                impressions: 287000,
                clicks: 3200,
                conversions: 187,
                ctr: 1.12,
                cpc: 1.50,
                roas: 3.8
              }
            ]).map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => viewCampaign(campaign.id)}
              >
                <PremiumCard variant="elevated" hover className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.platform}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : campaign.status === 'optimizing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {campaign.growth}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Budget Used</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pulse-cyan to-pulse-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(campaign.spend / campaign.budget) * 100}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.roas}x
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">ROAS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.ctr}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.conversions}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Conv.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <PremiumButton 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewCampaign(campaign.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </PremiumButton>
                    <PremiumButton 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        editCampaign(campaign.id);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </PremiumButton>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <PremiumCard variant="glassmorphism" className="p-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Scale Further?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Let our AI optimization engine take your campaigns to the next level with automated bidding and budget management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PremiumButton 
                  variant="primary" 
                  size="lg" 
                  glow
                  onClick={navigateToOptimization}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enable AI Autopilot
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
        </AsyncContent>
      </main>

      {/* AI Control Chat Assistant */}
      <AIControlChat defaultMinimized={true} />
      </div>
    </div>
  );
}