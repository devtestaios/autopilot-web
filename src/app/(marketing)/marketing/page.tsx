/**
 * Marketing Command Center - Enhanced Unified Marketing Dashboard
 * Comprehensive marketing operations hub with real-time analytics and AI insights
 * Integrates with Content Creation Suite for seamless workflow
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import UniversalPageWrapper from '@/components/ui/UniversalPageWrapper';
import { themeClasses, marketingThemeClasses, cn } from '@/lib/theme-utils';
import {
  Target,
  Share2,
  Mail,
  PenTool,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  Zap,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
  Eye,
  Clock,
  Globe,
  MousePointer,
  ShoppingCart,
  Filter,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Edit3,
  Copy,
  Trash2,
  MoreVertical,
  Search,
  Bell,
  Layers,
  Megaphone,
  LineChart,
  PieChart,
  Smartphone,
  Monitor,
  Tablet,
  Instagram,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

// Enhanced components
import dynamic from 'next/dynamic';

const CampaignDashboard = dynamic(() => import('@/components/marketing/CampaignDashboard'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Campaign Dashboard...</div>
});

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

// Mock data and state management for development
const mockMarketingData = {
  overview: {
    totalBudget: 50000,
    totalSpend: 32500,
    totalLeads: 1247,
    totalConversions: 342,
    avgROAS: 4.2,
    avgCTR: 2.8,
    avgCPC: 1.45,
    avgCPM: 8.90
  },
  campaigns: [
    {
      id: 'campaign-1',
      name: 'Q4 Product Launch',
      platform: 'Google Ads',
      status: 'active',
      budget: 15000,
      spend: 12300,
      impressions: 145000,
      clicks: 4060,
      conversions: 142,
      revenue: 28400,
      roas: 4.6
    },
    {
      id: 'campaign-2', 
      name: 'Social Media Awareness',
      platform: 'Meta',
      status: 'active',
      budget: 8000,
      spend: 6200,
      impressions: 89000,
      clicks: 2134,
      conversions: 67,
      revenue: 13400,
      roas: 3.8
    }
  ],
  quickStats: {
    activeInstagramPosts: 24,
    scheduledPosts: 8,
    totalEmailSubscribers: 12547,
    activeEmailCampaigns: 3,
    socialEngagement: 8.4,
    emailOpenRate: 24.7
  }
};

// Fallback hooks if real ones aren't available
const useMarketingOptimization = () => ({
  campaigns: mockMarketingData.campaigns,
  leads: Array.from({ length: mockMarketingData.overview.totalLeads }, (_, i) => ({ id: i })),
  alerts: []
});

const useSocialMedia = () => ({
  posts: Array.from({ length: mockMarketingData.quickStats.activeInstagramPosts }, (_, i) => ({ 
    id: i, 
    status: 'published' 
  })),
  accounts: []
});

const useEmailMarketing = () => ({
  campaigns: Array.from({ length: mockMarketingData.quickStats.activeEmailCampaigns }, (_, i) => ({ 
    id: i, 
    status: 'sending' 
  })),
  contacts: Array.from({ length: mockMarketingData.quickStats.totalEmailSubscribers }, (_, i) => ({ id: i }))
});

const useMarketingData = (refreshInterval?: number) => ({
  overview: mockMarketingData.overview,
  campaigns: mockMarketingData.campaigns,
  quickStats: mockMarketingData.quickStats,
  loading: false,
  error: null,
  refresh: async () => {},
  isStale: false,
  lastUpdated: new Date()
});

const useToast = () => ({
  showToast: (options: any) => console.log('Toast:', options)
});

// ==================== UNIFIED KPI COMPONENTS ====================

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

function KPICard({ title, value, change, icon, trend = 'neutral', description }: KPICardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${trendColor} flex items-center`}>
            {change}
            {description && <span className="text-muted-foreground ml-2">{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function UnifiedKPIDashboard() {
  // Get data from marketing optimization context for compatibility
  const { campaigns: contextCampaigns, leads, alerts } = useMarketingOptimization();
  const { posts, accounts } = useSocialMedia();
  const { campaigns: emailCampaigns, contacts } = useEmailMarketing();

  // PHASE 2A: Use real-time marketing data from the hook (passed down from parent)
  // This will be enhanced to use quickStats directly once we refactor to pass props
  const totalBudget = contextCampaigns?.reduce((sum, campaign) => sum + (campaign?.budget || 0), 0) || 0;
  const totalSpend = contextCampaigns?.reduce((sum, campaign) => sum + (campaign?.spend || 0), 0) || 0;
  const totalLeads = leads?.length || 0;
  const activeEmailCampaigns = (Array.isArray(emailCampaigns) ? emailCampaigns.filter(c => c?.status === 'sending' || c?.status === 'scheduled') : []).length || 0;
  const totalSocialPosts = (Array.isArray(posts) ? posts.filter(p => p?.status === 'published') : []).length || 0;
  const avgROAS = contextCampaigns?.reduce((sum, campaign) => sum + (campaign?.roas || 0), 0) / (contextCampaigns?.length || 1) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Total Ad Spend"
        value={`$${totalSpend.toLocaleString()}`}
        change="+12.3%"
        trend="up"
        icon={<DollarSign className="w-4 h-4" />}
        description="vs last month"
      />
      <KPICard
        title="Total Leads"
        value={totalLeads.toLocaleString()}
        change="+8.2%"
        trend="up"
        icon={<Users className="w-4 h-4" />}
        description="across all channels"
      />
      <KPICard
        title="Average ROAS"
        value={`${avgROAS.toFixed(2)}x`}
        change="+0.3x"
        trend="up"
        icon={<TrendingUp className="w-4 h-4" />}
        description="return on ad spend"
      />
      <KPICard
        title="Active Campaigns"
        value={`${(Array.isArray(contextCampaigns) ? contextCampaigns.filter(c => c?.status === 'active') : []).length || 0}`}
        change="3 new"
        trend="up"
        icon={<Activity className="w-4 h-4" />}
        description="campaigns running"
      />
    </div>
  );
}

// ==================== PLATFORM NAVIGATION ====================

function PlatformNavigationGrid() {
  const platforms = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: 'Search, Display, and YouTube advertising campaigns',
      icon: Target,
      route: '/campaigns',
      status: 'production',
      features: ['Search Ads', 'Display Network', 'YouTube Ads', 'Shopping Ads']
    },
    {
      id: 'meta',
      name: 'Meta Advertising',
      description: 'Facebook and Instagram advertising platform',
      icon: Share2,
      route: '/social-media',
      status: 'production',
      features: ['Facebook Ads', 'Instagram Ads', 'Messenger Ads', 'Audience Network']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Ads',
      description: 'Professional B2B advertising and lead generation',
      icon: Users,
      route: '/campaigns',
      status: 'production',
      features: ['Sponsored Content', 'Message Ads', 'Lead Gen Forms', 'Dynamic Ads']
    },
    {
      id: 'content-suite',
      name: 'Content Creation Suite',
      description: '🎨 NEW! AI-powered content creation with Planoly + Canva features',
      icon: Sparkles,
      route: '/content-suite',
      status: 'production',
      features: ['Feed Planner', 'Asset Manager', 'Design Studio', 'AI Generator'],
      isNew: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {platforms.map((platform) => {
        const IconComponent = platform.icon;
        const isContentSuite = platform.id === 'content-suite';

        return (
          <Link key={platform.id} href={platform.route}>
            <Card className={cn(
              marketingThemeClasses.platformCardHover,
              isContentSuite 
                ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:border-purple-300' 
                : ''
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isContentSuite
                      ? 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50'
                      : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50'
                  )}>
                    <IconComponent className={cn(
                      "w-6 h-6",
                      isContentSuite 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    )} />
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.isNew && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        NEW!
                      </Badge>
                    )}
                    <Badge variant={platform.status === 'production' ? 'default' : 'secondary'}>
                      {platform.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className={cn(themeClasses.textPrimary, "font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors")}>
                  {platform.name}
                </h3>
                <p className={cn(themeClasses.textMuted, "text-sm mb-3 line-clamp-2")}>
                  {platform.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={cn(themeClasses.textMuted, "text-xs")}>
                    {platform.features.length} features
                  </span>
                  <ArrowRight className={cn(themeClasses.textMuted, "w-4 h-4 group-hover:text-blue-600 group-hover:translate-x-1 transition-all")} />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

// ==================== CROSS-CHANNEL INSIGHTS ====================

function CrossChannelInsights() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Channel Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Paid Advertising</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">$12,450</div>
                <div className="text-xs text-green-600">+15.2%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Share2 className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Social Media</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">2.3K engagements</div>
                <div className="text-xs text-green-600">+8.7%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Email Marketing</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">24.3% open rate</div>
                <div className="text-xs text-green-600">+2.1%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Marketing Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'content-creation', name: 'Content Creation', icon: PenTool, description: 'Design and create marketing content', path: '/content-suite', platforms: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter'] },
              { id: 'campaign-management', name: 'Campaign Management', icon: Target, description: 'Manage advertising campaigns', path: '/campaigns', platforms: ['Google Ads', 'Meta', 'LinkedIn'] },
              { id: 'analytics-reports', name: 'Analytics & Reports', icon: BarChart3, description: 'View performance analytics', path: '/analytics', platforms: ['All Platforms'] },
              { id: 'social-media-hub', name: 'Social Media Hub', icon: Share2, description: 'Manage social media presence', path: '/social-media', platforms: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter'] },
              { id: 'email-marketing', name: 'Email Marketing', icon: Mail, description: 'Email campaigns and automation', path: '/email-marketing', platforms: ['Email Platforms'] },
              { id: 'lead-management', name: 'Lead Management', icon: Users, description: 'Track and nurture leads', path: '/leads', platforms: ['CRM Systems'] }
            ].map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">{workflow.name}</div>
                  <div className="text-xs text-muted-foreground">{workflow.platforms.length} platforms</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function MarketingCommandCenter() {
  const [activeView, setActiveView] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // PHASE 2A: Real-time marketing data with 30-second refresh
  const { overview, campaigns, quickStats, loading, error, refresh, isStale, lastUpdated } = useMarketingData(30000);
  const { showToast } = useToast();

  // Manual refresh functionality
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      await refresh();
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Marketing data refreshed',
          description: 'All marketing data has been updated'
        });
      }
    } catch (error) {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Refresh failed',
          description: 'Unable to refresh marketing data'
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <UniversalPageWrapper
      title="Marketing Command Center"
      subtitle="Unified marketing operations across all channels • AI-Enhanced Dashboard"
      containerSize="full"
      showBreadcrumb={false}
      showAIChat={true}
      visualMode="standard"
      statusBadge={{
        variant: isStale ? 'warning' : 'success',
        text: lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...',
        dot: true
      }}
      headerActions={
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <Activity className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      }
      enablePageAnimations={true}
      background="default"
    >
      {/* Navigation Tabs */}
      <Tabs defaultValue={activeView} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Unified KPI Dashboard */}
          <UnifiedKPIDashboard />

          {/* Platform Navigation Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Marketing Platforms</h2>
            <PlatformNavigationGrid />
          </div>

          {/* Cross-Channel Insights */}
          <CrossChannelInsights />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignDashboard
            onCampaignCreate={() => {
              console.log('Creating new campaign...');
              // Handle campaign creation
            }}
            onCampaignUpdate={(campaignId, updates) => {
              console.log('Updating campaign:', campaignId, updates);
              // Handle campaign updates
            }}
          />
        </TabsContent>

        <TabsContent value="advertising">
          {/* 🎯 ADVERTISING COMMAND CENTER INTEGRATION */}
          <div className="space-y-6">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Advertising Command Center
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Cross-platform advertising orchestration with AI-powered optimization
              </p>
            </div>

            {/* Embedded Unified Platform Dashboard */}
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Campaign Management</h3>
              <p className="text-gray-500 dark:text-gray-400">Unified platform dashboard coming soon</p>
              <Button className="mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Cross-Channel Analytics</h3>
            <p className="text-muted-foreground mb-4">Comprehensive marketing performance</p>
            <Button>
              <Link href="/analytics">Go to Analytics Dashboard</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Marketing Automation</h3>
            <p className="text-muted-foreground mb-4">Automated workflows and sequences</p>
            <Button>Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>
    </UniversalPageWrapper>
  );
}