'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Target, TrendingUp, DollarSign, BarChart3, Users, Zap, 
  Activity, Clock, AlertCircle, ChevronRight, ExternalLink,
  Layers, Globe, Rocket, Shield, Brain, Lightbulb, Sparkles,
  Crown, MousePointer, Eye, Heart, Star, ArrowUpRight,
  Compass, Palette, Wand2, Gem, Flame, Zap as ZapIcon
} from 'lucide-react';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animationVariants } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

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

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Core state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  // Phase 1 Visual Polish state
  const [hoveredKPI, setHoveredKPI] = useState<string | null>(null);
  const [hoveredSuite, setHoveredSuite] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeParticles, setActiveParticles] = useState(false);
  
  // Advanced scroll animations for Phase 1
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -5]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const springConfig = { damping: 25, stiffness: 300 };
  const headerSpring = useSpring(headerY, springConfig);
  
  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
        
        {/* Enhanced Header with Glassmorphism */}
        <motion.div
          style={{ y: headerSpring, opacity: headerOpacity }}
          className={visualEffects.glassmorphism.card}
        >
          <Header 
            sticky={true} 
            background="blur" 
            className="border-none"
          >
            <Flex justify="between" align="center" className="w-full">
              <div>
                <h1 className={`${visualEffects.typography.display.title} ${visualEffects.gradients.text.primary}`}>
                  Enterprise Command Center
                </h1>
                <p className={visualEffects.typography.enhanced.subtitle}>
                  Unified business ecosystem management
                </p>
              </div>
              <Badge variant="success" size="lg" dot>
                All Systems Operational
              </Badge>
            </Flex>
          </Header>
        </motion.div>
        
        <Container size="xl" padding="lg" center className="space-y-8">
          {/* Enhanced KPI Overview with Premium Design */}
          <Section size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className={visualEffects.typography.enhanced.title}>
                Enterprise Performance Metrics
              </h2>
              <p className={visualEffects.typography.enhanced.body}>
                Real-time business intelligence and key performance indicators
              </p>
            </motion.div>

            <CardGrid minCardWidth={280} gap="lg">
              {enterpriseKPIs.map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredKPI(kpi.title)}
                  onHoverEnd={() => setHoveredKPI(null)}
                >
                  <Card
                    variant="glassmorphism"
                    interactive={true}
                    className={`p-6 group ${hoveredKPI === kpi.title ? visualEffects.shadows.colored.blue : ''}`}
                  >
                    <Flex justify="between" align="start" className="mb-4">
                      <Stack space="xs">
                        <p className={`${visualEffects.typography.enhanced.caption} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                          {kpi.title}
                        </p>
                        <motion.p 
                          className={`${visualEffects.typography.display.subtitle} ${visualEffects.gradients.text.primary}`}
                          animate={{ scale: hoveredKPI === kpi.title ? 1.05 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {kpi.value}
                        </motion.p>
                      </Stack>
                      
                      <motion.div 
                        className={`p-3 rounded-xl ${kpi.bgColor} group-hover:scale-110 transition-transform duration-200`}
                        whileHover={{ rotate: 5 }}
                      >
                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                      </motion.div>
                    </Flex>
                    
                    <Flex align="center" gap="sm">
                      <Badge 
                        variant={kpi.changeType === 'positive' ? 'success' : kpi.changeType === 'negative' ? 'error' : 'default'}
                        size="sm"
                      >
                        {kpi.change}
                      </Badge>
                      <span className={visualEffects.typography.enhanced.caption}>
                        vs last month
                      </span>
                    </Flex>
                  </Card>
                </motion.div>
              ))}
            </CardGrid>
          </Section>

          {/* Enhanced Platform Suites with Premium Design */}
          <Section size="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <Flex justify="between" align="center">
                <Stack space="xs">
                  <h2 className={visualEffects.typography.enhanced.title}>
                    Enterprise Platform Suites
                  </h2>
                  <p className={visualEffects.typography.enhanced.body}>
                    Integrated business ecosystems for complete operational control
                  </p>
                </Stack>
                <Button 
                  variant="ghost" 
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  className={visualEffects.typography.interactive.link}
                >
                  View All Platforms
                </Button>
              </Flex>

              <Grid cols={3} gap="lg" responsive>
                {platformSuites.map((suite, index) => (
                  <motion.div
                    key={suite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setHoveredSuite(suite.id)}
                    onHoverEnd={() => setHoveredSuite(null)}
                  >
                    <Card
                      variant="glassmorphism"
                      interactive
                      className={`p-6 h-full ${suite.bgGradient} group ${
                        hoveredSuite === suite.id ? visualEffects.shadows.glow.lg : ''
                      }`}
                    >
                      <Flex justify="between" align="start" className="mb-6">
                        <Stack space="xs">
                          <h3 className={`${visualEffects.typography.enhanced.title} group-hover:${visualEffects.gradients.text.primary} transition-all`}>
                            {suite.name}
                          </h3>
                          <p className={visualEffects.typography.enhanced.body}>
                            {suite.description}
                          </p>
                        </Stack>
                        <motion.div 
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${suite.color} ${visualEffects.shadows.glow.sm}`}
                          animate={{ 
                            scale: hoveredSuite === suite.id ? 1.2 : 1,
                            rotate: hoveredSuite === suite.id ? 180 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </Flex>

                      <Stack space="sm" className="mb-6">
                        {suite.platforms.map((platform, platformIndex) => (
                          <motion.div 
                            key={platform.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + platformIndex * 0.05 }}
                            className={`${visualEffects.glassmorphism.light.background} ${visualEffects.glassmorphism.light.backdrop} rounded-lg p-3 border border-white/20`}
                          >
                            <Flex justify="between" align="center">
                              <Flex align="center" gap="sm">
                                <platform.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className={visualEffects.typography.enhanced.subtitle}>
                                  {platform.name}
                                </span>
                              </Flex>
                              <Flex align="center" gap="sm">
                                <Badge 
                                  variant={platform.status === 'active' ? 'success' : 'default'}
                                  size="sm"
                                  dot
                                >
                                  {platform.status}
                                </Badge>
                              </Flex>
                            </Flex>
                            
                            {platform.metrics && (
                              <Flex gap="lg" className="mt-2">
                                {platform.metrics.map((metric, metricIndex) => (
                                  <div key={metricIndex} className="flex-1">
                                    <p className={visualEffects.typography.enhanced.caption}>
                                      {metric.label}
                                    </p>
                                    <Flex align="center" gap="xs">
                                      <span className={`${visualEffects.typography.enhanced.subtitle} font-semibold`}>
                                        {metric.value}
                                      </span>
                                      <TrendingUp className={`w-3 h-3 ${
                                        metric.trend === 'up' ? 'text-green-500' : 
                                        metric.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                                      }`} />
                                    </Flex>
                                  </div>
                                ))}
                              </Flex>
                            )}
                          </motion.div>
                        ))}
                      </Stack>

                      <Button 
                        variant="primary"
                        size="md"
                        gradient
                        className="w-full group-hover:shadow-lg transition-all"
                        rightIcon={<ExternalLink className="w-4 h-4" />}
                        onClick={() => router.push(`/${suite.id}`)}
                      >
                        Open Suite
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </Grid>
            </motion.div>
          </Section>

          {/* Intelligent Dashboard Core */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <IntelligentDashboardCore />
          </motion.div>

          {/* Enhanced Quick Actions with Premium Design */}
          <Section size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <Stack space="xs">
                <h2 className={visualEffects.typography.enhanced.title}>
                  AI-Powered Quick Actions
                </h2>
                <p className={visualEffects.typography.enhanced.body}>
                  Intelligent automation and optimization tools for instant productivity
                </p>
              </Stack>

              <CardGrid minCardWidth={250} gap="md">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    variants={animations.variants.cardHover}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Card
                      variant="glassmorphism"
                      interactive
                      className={`p-5 text-left h-full group ${getCategoryColor(action.category)} cursor-pointer`}
                      onClick={action.action}
                    >
                      <Flex justify="between" align="start" className="mb-4">
                        <motion.div
                          className="p-3 rounded-xl bg-white/20 dark:bg-gray-800/30"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <action.icon className="w-6 h-6" />
                        </motion.div>
                        <Flex align="center" gap="xs">
                          <Badge 
                            variant={action.impact === 'high' ? 'error' : action.impact === 'medium' ? 'warning' : 'default'}
                            size="sm"
                          >
                            {action.impact.toUpperCase()}
                          </Badge>
                        </Flex>
                      </Flex>
                      
                      <Stack space="xs" className="mb-4">
                        <h3 className={`${visualEffects.typography.enhanced.subtitle} font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                          {action.title}
                        </h3>
                        <p className={`${visualEffects.typography.enhanced.caption} group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors`}>
                          {action.description}
                        </p>
                      </Stack>
                      
                      <Flex justify="between" align="center">
                        <Badge variant="default" size="sm" outline>
                          ~{action.estimatedTime}
                        </Badge>
                        <motion.div
                          animate={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </Flex>
                    </Card>
                  </motion.div>
                ))}
              </CardGrid>
            </motion.div>
          </Section>

          {/* Enhanced System Status with Premium Design */}
          <Section size="md" background="gradient">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card
                variant="glassmorphism"
                className="p-8 border-teal-200 dark:border-teal-800"
              >
                <Flex justify="between" align="center" className="mb-8">
                  <Flex align="center" gap="sm">
                    <motion.div 
                      className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/30"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </motion.div>
                    <Stack space="xs">
                      <h2 className={visualEffects.typography.enhanced.title}>
                        Enterprise System Status
                      </h2>
                      <p className={visualEffects.typography.enhanced.caption}>
                        All systems operational • Last updated: {systemStatus.lastUpdated.toLocaleTimeString()}
                      </p>
                    </Stack>
                  </Flex>
                  <Flex align="center" gap="sm">
                    <motion.div 
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Badge variant="success" size="sm">
                      Live
                    </Badge>
                  </Flex>
                </Flex>
                
                <Grid cols={4} gap="lg" responsive>
                  {[
                    { label: 'Uptime', value: systemStatus.uptime, color: 'text-green-600 dark:text-green-400' },
                    { label: 'Response', value: systemStatus.response, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Routes', value: systemStatus.routes, color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Status', value: systemStatus.status, color: 'text-orange-600 dark:text-orange-400' }
                  ].map((metric, index) => (
                    <motion.div 
                      key={metric.label} 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div 
                        className={`text-3xl font-bold ${metric.color} mb-2`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 100,
                          delay: index * 0.1 
                        }}
                      >
                        {metric.value}
                      </motion.div>
                      <p className={visualEffects.typography.enhanced.caption}>
                        {metric.label}
                      </p>
                    </motion.div>
                  ))}
                </Grid>
              </Card>
            </motion.div>
          </Section>

        </Container>
      </div>

      {/* Enhanced AI Control Chat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AIControlChat defaultMinimized={true} />
      </motion.div>

      {/* Enhanced Onboarding Welcome Banner */}
      <AnimatePresence>
        {showWelcomeBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <OnboardingWelcomeBanner onDismiss={handleWelcomeBannerDismiss} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
