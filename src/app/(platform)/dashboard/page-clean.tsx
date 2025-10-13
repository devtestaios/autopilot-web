'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Target, TrendingUp, DollarSign, BarChart3, Users, Zap, 
  Activity, Clock, AlertCircle, ChevronRight, ExternalLink,
  Globe, Rocket, Shield, Brain
} from 'lucide-react';

// Simple imports - no complex design system
// NavigationTabs removed - using root layout Navigation instead
const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

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
}

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

  // Platform suites data
  const platformSuites: PlatformSuite[] = [
    {
      id: 'marketing',
      title: 'Marketing Command Center',
      description: 'Unified marketing automation and optimization across all channels',
      icon: Target,
      href: '/marketing-command-center',
      status: 'active',
      features: ['Social Media', 'Email Marketing', 'Content Creation', 'Analytics']
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Real-time team coordination and project management',
      icon: Users,
      href: '/collaboration',
      status: 'active',
      features: ['Live Presence', 'Activity Feeds', 'Smart Notifications', 'Team Analytics']
    },
    {
      id: 'integrations',
      title: 'Integrations Marketplace',
      description: 'Universal app marketplace with 100+ business integrations',
      icon: Globe,
      href: '/integrations',
      status: 'active',
      features: ['100+ Apps', 'Revenue Tracking', 'API Management', 'Custom Workflows']
    },
    {
      id: 'projects',
      title: 'Project Management',
      description: 'Enterprise project tracking with AI automation',
      icon: Activity,
      href: '/project-management',
      status: 'active',
      features: ['Kanban Boards', 'Analytics', 'Team Tracking', 'Resource Management']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Navigation */}
      {/* Navigation provided by root layout */}
      
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <OnboardingWelcomeBanner onDismiss={handleWelcomeBannerDismiss} />
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Master Terminal Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unified command center for your business ecosystem
          </p>
        </div>

        {/* KPI Cards - Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {enterpriseKPIs.map((kpi) => (
            <div key={kpi.title} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <span className={`text-sm font-medium ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 
                  kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {kpi.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {kpi.title}
              </p>
            </div>
          ))}
        </div>

        {/* Platform Suites - Simple Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Suites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformSuites.map((suite) => (
              <div 
                key={suite.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(suite.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                    <suite.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    suite.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    suite.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {suite.status.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {suite.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {suite.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {suite.features.map((feature) => (
                    <span key={feature} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center mt-4 text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">Access Platform</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Control Chat */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
          </div>
          <AIControlChat />
        </div>
      </div>
    </div>
  );
}