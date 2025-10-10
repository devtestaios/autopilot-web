'use client';

import React, { useState, useEffect, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import UniversalPageWrapper from '@/components/ui/UniversalPageWrapper';
import {
  Target, TrendingUp, DollarSign, BarChart3, Users, Zap,
  Activity, Clock, AlertCircle, ChevronRight, ExternalLink,
  Globe, Rocket, Shield, Brain, Play, Settings,
  MessageSquare, Calendar, FileText, PieChart, LayoutDashboard
} from 'lucide-react';

const OnboardingWelcomeBanner = dynamic(() => import('@/components/onboarding/OnboardingWelcomeBanner'), {
  ssr: false,
  loading: () => null
});

// Simple types
interface EnterpriseKPI {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface PlatformSuite {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'coming_soon' | 'beta';
  features: string[];
  kpi: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  };
  subPlatforms: SubPlatform[];
}

interface SubPlatform {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'beta' | 'coming_soon';
  kpi?: {
    label: string;
    value: string;
  };
}

// Performance-optimized KPI Card Component
const KPICard = memo(({ kpi }: { kpi: EnterpriseKPI }) => (
  <div className="card-standard kpi-card">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
      </div>
      <span className={`kpi-change ${
        kpi.changeType === 'positive' ? 'text-green-600' :
        kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {kpi.change}
      </span>
    </div>
    <h3 className="kpi-value">
      {kpi.value}
    </h3>
    <p className="kpi-label">
      {kpi.title}
    </p>
  </div>
));

KPICard.displayName = 'KPICard';

// Performance-optimized Platform Suite Card Component
const PlatformSuiteCard = memo(({ suite, onClick }: { suite: PlatformSuite; onClick: () => void }) => (
  <div
    className="card-standard cursor-pointer group"
    onClick={onClick}
  >
    {/* Suite Header */}
    <div className="card-header">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-105 transition-transform duration-200">
          <suite.icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="card-title group-hover:text-blue-600 transition-colors">
            {suite.title}
          </h3>
          <p className="card-description">
            {suite.description}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
          suite.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          suite.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {suite.status.replace('_', ' ')}
        </span>
        <div className="mt-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {suite.kpi.value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {suite.kpi.label}
          </div>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="flex flex-wrap gap-2 mb-6">
      {suite.features.map((feature) => (
        <span key={feature} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
          {feature}
        </span>
      ))}
    </div>

    {/* Access Button */}
    <div className="flex items-center justify-between">
      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
        <span className="text-sm font-medium">Access Platform</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {suite.subPlatforms.length} sub-platforms
      </div>
    </div>
  </div>
));

PlatformSuiteCard.displayName = 'PlatformSuiteCard';

// Performance-optimized Sub-Platform Card Component
const SubPlatformCard = memo(({ subPlatform, onClick }: { subPlatform: SubPlatform; onClick: () => void }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-200 dark:border-gray-700"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-200">
        <subPlatform.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        subPlatform.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
        subPlatform.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      }`}>
        {subPlatform.status.replace('_', ' ')}
      </span>
    </div>

    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
      {subPlatform.title}
    </h4>
    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
      {subPlatform.description}
    </p>

    {subPlatform.kpi && (
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{subPlatform.kpi.label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{subPlatform.kpi.value}</span>
      </div>
    )}

    <div className="flex items-center mt-2 text-blue-600 group-hover:text-blue-700 transition-colors">
      <span className="text-xs font-medium">Launch</span>
      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
));

SubPlatformCard.displayName = 'SubPlatformCard';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Simple state management
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Check for onboarding completion
  useEffect(() => {
    const onboardingComplete = searchParams?.get('onboarding') === 'complete';
    const welcomeParam = searchParams?.get('welcome') === 'true';
    const onboardingCompleteFlag = localStorage.getItem('onboardingComplete') === 'true';
    const welcomeDismissed = localStorage.getItem('onboardingWelcomeDismissed') === 'true';

    if ((onboardingComplete || welcomeParam || onboardingCompleteFlag) && !welcomeDismissed) {
      setShowWelcomeBanner(true);
    }
  }, [searchParams]);

  const handleWelcomeBannerDismiss = () => {
    setShowWelcomeBanner(false);
  };

  // Simple KPI data
  const enterpriseKPIs: EnterpriseKPI[] = [
    {
      title: 'Total Revenue',
      value: '$487,320',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Campaigns',
      value: '24',
      change: '+12.5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Total Leads',
      value: '1,847',
      change: '+8.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-emerald-600'
    }
  ];

  // Platform suites data - Secondary Level (Large Cards)
  const platformSuites: PlatformSuite[] = [
    {
      id: 'marketing',
      title: 'Marketing Command Center',
      description: 'Unified marketing automation and optimization across all channels',
      icon: Target,
      href: '/marketing',
      status: 'active',
      features: ['Multi-Channel Campaigns', 'AI Optimization', 'Real-time Analytics', 'Lead Management'],
      kpi: {
        label: 'Active Campaigns',
        value: '24',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'social-media',
          title: 'Social Media',
          description: 'Multi-platform social media management',
          icon: Users,
          href: '/social-media',
          status: 'active',
          kpi: { label: 'Posts Today', value: '12' }
        },
        {
          id: 'email-marketing',
          title: 'Email Marketing',
          description: 'Advanced email automation',
          icon: MessageSquare,
          href: '/email-marketing',
          status: 'active',
          kpi: { label: 'Open Rate', value: '24.5%' }
        },
        {
          id: 'content-creation',
          title: 'Content Studio',
          description: 'AI-powered content creation',
          icon: FileText,
          href: '/content-suite',
          status: 'beta',
          kpi: { label: 'Generated', value: '156' }
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Real-time team coordination and project management',
      icon: Users,
      href: '/collaboration',
      status: 'active',
      features: ['Live Presence', 'Activity Feeds', 'Smart Notifications', 'Team Analytics'],
      kpi: {
        label: 'Active Members',
        value: '47',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'project-management',
          title: 'Project Management',
          description: 'Enterprise project tracking',
          icon: Activity,
          href: '/project-management',
          status: 'active',
          kpi: { label: 'Active Projects', value: '12' }
        },
        {
          id: 'team-chat',
          title: 'Team Communication',
          description: 'Real-time team messaging',
          icon: MessageSquare,
          href: '/team-collaboration',
          status: 'beta',
          kpi: { label: 'Messages', value: '1.2k' }
        },
        {
          id: 'calendar',
          title: 'Unified Calendar',
          description: 'Cross-platform scheduling',
          icon: Calendar,
          href: '/scheduler',
          status: 'coming_soon'
        }
      ]
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence',
      description: 'Advanced analytics and business insights',
      icon: BarChart3,
      href: '/business-intelligence',
      status: 'active',
      features: ['Real-time Dashboards', 'Predictive Analytics', 'Custom Reports', 'AI Insights'],
      kpi: {
        label: 'Data Points',
        value: '2.4M',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'analytics',
          title: 'Performance Analytics',
          description: 'Comprehensive performance tracking',
          icon: TrendingUp,
          href: '/analytics',
          status: 'active',
          kpi: { label: 'Metrics', value: '45' }
        },
        {
          id: 'reports',
          title: 'Custom Reports',
          description: 'Automated report generation',
          icon: FileText,
          href: '/reports',
          status: 'active',
          kpi: { label: 'Reports', value: '28' }
        },
        {
          id: 'insights',
          title: 'AI Insights',
          description: 'AI-powered business insights',
          icon: Brain,
          href: '/ai',
          status: 'beta',
          kpi: { label: 'Insights', value: '15' }
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations Marketplace',
      description: 'Universal app marketplace with 100+ business integrations',
      icon: Globe,
      href: '/integrations',
      status: 'active',
      features: ['100+ Apps', 'Revenue Tracking', 'API Management', 'Custom Workflows'],
      kpi: {
        label: 'Connected Apps',
        value: '23',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'api-management',
          title: 'API Management',
          description: 'Centralized API control',
          icon: Settings,
          href: '/platforms',
          status: 'active',
          kpi: { label: 'APIs', value: '18' }
        },
        {
          id: 'workflows',
          title: 'Automation Workflows',
          description: 'Custom business automation',
          icon: Zap,
          href: '/workflow-automation',
          status: 'beta',
          kpi: { label: 'Workflows', value: '8' }
        },
        {
          id: 'marketplace',
          title: 'App Marketplace',
          description: 'Discover new integrations',
          icon: Globe,
          href: '/integrations',
          status: 'active',
          kpi: { label: 'Available', value: '100+' }
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="page-title">Master Terminal</h1>
            <p className="page-subtitle">Unified command center for your enterprise business ecosystem</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              All Systems Operational
            </span>
            <button
              onClick={() => router.push('/dashboard/enhanced')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Customize Layout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <OnboardingWelcomeBanner onDismiss={handleWelcomeBannerDismiss} />
      )}

      {/* KPI Cards - Performance Optimized Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="kpi-grid">
        {enterpriseKPIs.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Secondary Platform Suites - Large Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Platform Suites
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {platformSuites.map((suite) => (
            <PlatformSuiteCard
              key={suite.id}
              suite={suite}
              onClick={() => router.push(suite.href)}
            />
          ))}
        </div>
      </div>

      {/* Tertiary Sub-Platforms - Rows of 3 */}
      {platformSuites.map((suite) => (
        <div key={`${suite.id}-sub`} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {suite.title} - Sub-Platforms
            </h3>
            <button
              onClick={() => router.push(suite.href)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suite.subPlatforms.map((subPlatform) => (
              <SubPlatformCard
                key={subPlatform.id}
                subPlatform={subPlatform}
                onClick={() => router.push(subPlatform.href)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
