/**
 * Marketing Command Center - Unified Marketing Dashboard
 * Enhanced with mature dashboard architecture from /dashboard
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
  ArrowRight
} from 'lucide-react';

// UPGRADED: Using mature dashboard components
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import existing contexts
import { useMarketingOptimization } from '@/contexts/MarketingOptimizationContext';
import { useSocialMedia } from '@/contexts/SocialMediaContext';
import { useEmailMarketing } from '@/contexts/EmailMarketingContext';

import { MARKETING_PLATFORMS, MARKETING_WORKFLOWS } from '@/config/marketingRegistry';

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
  // Get data from all marketing contexts
  const { campaigns, leads, alerts } = useMarketingOptimization();
  const { posts, accounts } = useSocialMedia();
  const { campaigns: emailCampaigns, contacts } = useEmailMarketing();

  // Calculate unified metrics with comprehensive null checks and safe property access
  const totalBudget = campaigns?.reduce((sum, campaign) => sum + (campaign?.budget || 0), 0) || 0;
  const totalSpend = campaigns?.reduce((sum, campaign) => sum + (campaign?.spend || 0), 0) || 0;
  const totalLeads = leads?.length || 0;
  const activeEmailCampaigns = (Array.isArray(emailCampaigns) ? emailCampaigns.filter(c => c?.status === 'sending' || c?.status === 'scheduled') : []).length || 0;
  const totalSocialPosts = (Array.isArray(posts) ? posts.filter(p => p?.status === 'published') : []).length || 0;
  const avgROAS = campaigns?.reduce((sum, campaign) => sum + (campaign?.metrics?.roas || 0), 0) / (campaigns?.length || 1) || 0;

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
        value={`${(Array.isArray(campaigns) ? campaigns.filter(c => c?.status === 'active') : []).length || 0}`}
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {MARKETING_PLATFORMS.map((platform) => {
        const iconMap = {
          Target,
          Share2,
          Mail,
          PenTool
        };
        
        const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Target;

        return (
          <Link key={platform.id} href={platform.route}>
            <Card className="group hover:shadow-lg hover:border-teal-200 transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                    <IconComponent className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <Badge variant={platform.status === 'production' ? 'default' : 'secondary'}>
                    {platform.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition-colors">
                  {platform.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {platform.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {platform.features.length} features
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
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
            {MARKETING_WORKFLOWS.map((workflow) => (
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* UPGRADED: Using mature dashboard architecture */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* UPGRADED: Advanced navigation with sidebar awareness */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Marketing Command Center
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Unified marketing operations across all channels • AI-Enhanced Dashboard
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue={activeView} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
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
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Unified Campaign View</h3>
              <p className="text-muted-foreground mb-4">View all campaigns across platforms</p>
              <Button>
                <Link href="/campaigns">Go to Campaign Management</Link>
              </Button>
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
        </div>
      </div>
      
      {/* UPGRADED: AI Control Chat with marketing-specific capabilities */}
      <AIControlChat />
    </div>
  );
}