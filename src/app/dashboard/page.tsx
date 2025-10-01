'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Target, TrendingUp, DollarSign, BarChart3, Users, Zap, 
  Activity, Clock, AlertCircle, ChevronRight, ExternalLink,
  Layers, Globe, Rocket, Shield, Brain, Lightbulb
} from 'lucide-react';

// Dynamic imports for SSR safety (following dissertation patterns)
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => null
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => null
});

const IntelligentDashboardCore = dynamic(() => import('@/components/dashboard/IntelligentDashboardCore'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  )
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

const OnboardingWelcomeBanner = dynamic(() => import('@/components/onboarding/OnboardingWelcomeBanner'), {
  ssr: false,
  loading: () => null
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

interface PlatformSuite {
  id: string;
  name: string;
  description: string;
  platforms: Array<{
    name: string;
    status: 'active' | 'inactive' | 'maintenance';
    route: string;
    icon: React.ComponentType<any>;
    metrics?: {
      label: string;
      value: string;
      trend: 'up' | 'down' | 'stable';
    }[];
  }>;
  color: string;
  bgGradient: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: 'create' | 'optimize' | 'analyze' | 'automate';
  estimatedTime: string;
  impact: 'high' | 'medium' | 'low';
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Check for onboarding completion
  useEffect(() => {
    const onboardingComplete = searchParams?.get('onboarding') === 'complete';
    const welcomeParam = searchParams?.get('welcome') === 'true';
    const onboardingCompleteFlag = localStorage.getItem('onboardingComplete') === 'true';
    const welcomeDismissed = localStorage.getItem('onboardingWelcomeDismissed') === 'true';

    // Show welcome banner if onboarding just completed and not previously dismissed
    if ((onboardingComplete || welcomeParam || onboardingCompleteFlag) && !welcomeDismissed) {
      setShowWelcomeBanner(true);
    }
  }, [searchParams]);

  const handleWelcomeBannerDismiss = () => {
    setShowWelcomeBanner(false);
  };
  
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

  // Platform Suites Configuration
  const [platformSuites] = useState<PlatformSuite[]>([
    {
      id: 'marketing-suite',
      name: 'Marketing Suite',
      description: 'Comprehensive marketing automation and analytics',
      platforms: [
        {
          name: 'Social Media',
          status: 'active',
          route: '/social-media',
          icon: Users,
          metrics: [
            { label: 'Accounts', value: '6', trend: 'up' },
            { label: 'Posts Today', value: '12', trend: 'up' }
          ]
        },
        {
          name: 'Email Marketing',
          status: 'active',
          route: '/email-marketing',
          icon: BarChart3,
          metrics: [
            { label: 'Campaigns', value: '8', trend: 'up' },
            { label: 'Open Rate', value: '24.5%', trend: 'up' }
          ]
        },
        {
          name: 'Marketing Command Center',
          status: 'active',
          route: '/marketing-command-center',
          icon: Zap,
          metrics: [
            { label: 'ROI', value: '285%', trend: 'up' },
            { label: 'Conversions', value: '156', trend: 'up' }
          ]
        }
      ],
      color: 'from-pink-500 to-purple-500',
      bgGradient: 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20'
    },
    {
      id: 'operations-suite',
      name: 'Operations Suite',
      description: 'Project management and team collaboration',
      platforms: [
        {
          name: 'Project Management',
          status: 'active',
          route: '/project-management',
          icon: Layers,
          metrics: [
            { label: 'Projects', value: '15', trend: 'up' },
            { label: 'Completion', value: '94%', trend: 'stable' }
          ]
        },
        {
          name: 'Team Collaboration',
          status: 'active',
          route: '/collaboration',
          icon: Users,
          metrics: [
            { label: 'Active Users', value: '12', trend: 'up' },
            { label: 'Tasks', value: '45', trend: 'up' }
          ]
        }
      ],
      color: 'from-green-500 to-blue-500',
      bgGradient: 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20'
    },
    {
      id: 'analytics-suite',
      name: 'Analytics Suite',
      description: 'Business intelligence and performance insights',
      platforms: [
        {
          name: 'Business Intelligence',
          status: 'active',
          route: '/business-intelligence',
          icon: BarChart3,
          metrics: [
            { label: 'Reports', value: '28', trend: 'up' },
            { label: 'Insights', value: '7', trend: 'up' }
          ]
        },
        {
          name: 'Performance Analytics',
          status: 'active',
          route: '/analytics',
          icon: TrendingUp,
          metrics: [
            { label: 'KPIs', value: '15', trend: 'stable' },
            { label: 'Accuracy', value: '97%', trend: 'up' }
          ]
        }
      ],
      color: 'from-blue-500 to-indigo-500',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    }
  ]);

  // Quick Actions
  const [quickActions] = useState<QuickAction[]>([
    {
      id: 'create-campaign',
      title: 'Create New Campaign',
      description: 'Launch a multi-platform marketing campaign',
      icon: Rocket,
      action: () => router.push('/campaigns/new'),
      category: 'create',
      estimatedTime: '5 min',
      impact: 'high'
    },
    {
      id: 'optimize-performance',
      title: 'Optimize Performance',
      description: 'AI-powered performance optimization suggestions',
      icon: Brain,
      action: () => console.log('Optimize performance'),
      category: 'optimize',
      estimatedTime: '2 min',
      impact: 'high'
    },
    {
      id: 'analyze-trends',
      title: 'Analyze Trends',
      description: 'Generate comprehensive analytics report',
      icon: BarChart3,
      action: () => router.push('/analytics'),
      category: 'analyze',
      estimatedTime: '3 min',
      impact: 'medium'
    },
    {
      id: 'automate-workflow',
      title: 'Setup Automation',
      description: 'Create automated workflows and triggers',
      icon: Zap,
      action: () => router.push('/automation'),
      category: 'automate',
      estimatedTime: '10 min',
      impact: 'high'
    }
  ]);

  // System Status Monitoring
  const [systemStatus, setSystemStatus] = useState({
    uptime: '99.9%',
    response: '245ms',
    routes: '105',
    status: 'Operational',
    lastUpdated: new Date()
  });

  // Real-time KPI updates
  useEffect(() => {
    const updateKPIs = () => {
      setEnterpriseKPIs(prev => prev.map(kpi => ({
        ...kpi,
        value: kpi.title === 'Total Revenue' 
          ? `$${(Math.random() * 50000 + 450000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          : kpi.value
      })));
    };

    const interval = setInterval(updateKPIs, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: QuickAction['category']) => {
    switch (category) {
      case 'create': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'optimize': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'analyze': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'automate': return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    }
  };

  const getImpactBadge = (impact: QuickAction['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Enterprise KPI Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {enterpriseKPIs.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
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
          </motion.div>

          {/* Platform Suites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Platform Suites
              </h2>
              <button className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                View All Platforms →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {platformSuites.map((suite, index) => (
                <motion.div
                  key={suite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${suite.bgGradient} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {suite.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suite.description}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${suite.color}`}></div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {suite.platforms.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <platform.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {platform.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            platform.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-xs text-gray-500 capitalize">
                            {platform.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => router.push(`/${suite.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium">Open Suite</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Intelligent Dashboard Core */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <IntelligentDashboardCore />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={action.action}
                  className={`p-4 rounded-xl border-2 text-left hover:shadow-md transition-all ${getCategoryColor(action.category)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <action.icon className="w-6 h-6" />
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactBadge(action.impact)}`}>
                        {action.impact.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-80 mb-2">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">~{action.estimatedTime}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Enterprise System Status
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    All systems operational • Last updated: {systemStatus.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Uptime', value: systemStatus.uptime, color: 'text-green-600 dark:text-green-400' },
                { label: 'Response', value: systemStatus.response, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Routes', value: systemStatus.routes, color: 'text-purple-600 dark:text-purple-400' },
                { label: 'Status', value: systemStatus.status, color: 'text-orange-600 dark:text-orange-400' }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <motion.div 
                    className={`text-2xl font-bold ${metric.color}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Control Chat - Bottom Right */}
      <AIControlChat defaultMinimized={true} />

      {/* Onboarding Welcome Banner */}
      {showWelcomeBanner && (
        <OnboardingWelcomeBanner onDismiss={handleWelcomeBannerDismiss} />
      )}
    </div>
  );
}

const CrossPlatformIntegrationDashboard = dynamic(() => import('@/components/dashboard/CrossPlatformIntegrationDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

interface PlatformSuite {
  id: string;
  name: string;
  description: string;
  platforms: Array<{
    name: string;
    status: 'active' | 'inactive' | 'maintenance';
    route: string;
    icon: React.ComponentType<any>;
    metrics?: {
      label: string;
      value: string;
      trend: 'up' | 'down' | 'stable';
    }[];
  }>;
  color: string;
  bgGradient: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: 'create' | 'optimize' | 'analyze' | 'automate';
  estimatedTime: string;
  impact: 'high' | 'medium' | 'low';
}
