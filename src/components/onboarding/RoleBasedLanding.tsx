'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Crown, 
  Briefcase, 
  Users,
  TrendingUp,
  Zap,
  Shield,
  Target,
  Star,
  ChevronRight,
  Sparkles,
  BarChart3,
  Mail,
  Share2,
  Globe,
  Settings
} from 'lucide-react';
import { BusinessType, BusinessSize } from '@/contexts/BusinessConfigurationContext';

interface RoleBasedRoute {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryAction: {
    label: string;
    url: string;
  };
  quickActions: Array<{
    label: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  features: string[];
  estimatedSetupTime: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  businessTypes: BusinessType[];
  businessSizes: BusinessSize[];
  isRecommended?: boolean;
  isPremium?: boolean;
}

interface RoleBasedLandingProps {
  businessType?: BusinessType;
  businessSize?: BusinessSize;
  userGoals?: string[];
  onRouteSelect?: (route: RoleBasedRoute) => void;
  className?: string;
}

const roleBasedRoutes: RoleBasedRoute[] = [
  {
    id: 'solo-entrepreneur-hub',
    title: 'Solo Entrepreneur Hub',
    description: 'Everything you need to manage your business single-handedly with AI assistance',
    icon: Crown,
    primaryAction: {
      label: 'Start Solo Journey',
      url: '/dashboard?mode=solo'
    },
    quickActions: [
      { label: 'Quick Campaign', url: '/campaigns/new?template=solo', icon: Target },
      { label: 'Auto-Schedule Posts', url: '/social-media?quick=true', icon: Share2 },
      { label: 'Performance Overview', url: '/analytics/solo-dashboard', icon: BarChart3 }
    ],
    features: [
      'AI-powered content creation',
      'Automated posting schedules',
      'Simple analytics dashboard',
      'One-click campaign setup'
    ],
    estimatedSetupTime: '10 minutes',
    difficultyLevel: 'beginner',
    businessTypes: ['solo_entrepreneur'],
    businessSizes: ['solo'],
    isRecommended: true
  },
  {
    id: 'startup-growth-center',
    title: 'Startup Growth Center',
    description: 'Accelerate your startup growth with advanced marketing automation and team collaboration',
    icon: TrendingUp,
    primaryAction: {
      label: 'Launch Growth Strategy',
      url: '/dashboard?mode=startup'
    },
    quickActions: [
      { label: 'Growth Campaigns', url: '/campaigns/startup-templates', icon: Target },
      { label: 'Team Collaboration', url: '/collaboration/startup', icon: Users },
      { label: 'Investor Metrics', url: '/analytics/investor-dashboard', icon: BarChart3 }
    ],
    features: [
      'Startup-specific templates',
      'Investor-ready analytics',
      'Team collaboration tools',
      'Growth hacking features'
    ],
    estimatedSetupTime: '25 minutes',
    difficultyLevel: 'intermediate',
    businessTypes: ['startup'],
    businessSizes: ['micro', 'small'],
    isRecommended: true
  },
  {
    id: 'agency-command-center',
    title: 'Agency Command Center',
    description: 'Manage multiple clients with advanced project management and white-label solutions',
    icon: Briefcase,
    primaryAction: {
      label: 'Access Agency Tools',
      url: '/dashboard?mode=agency'
    },
    quickActions: [
      { label: 'Client Management', url: '/project-management/clients', icon: Users },
      { label: 'White-label Reports', url: '/reports/white-label', icon: BarChart3 },
      { label: 'Team Assignments', url: '/collaboration/agency', icon: Target }
    ],
    features: [
      'Multi-client management',
      'White-label reporting',
      'Advanced team tools',
      'Client portal access'
    ],
    estimatedSetupTime: '45 minutes',
    difficultyLevel: 'advanced',
    businessTypes: ['agency'],
    businessSizes: ['small', 'medium', 'large'],
    isPremium: true
  },
  {
    id: 'enterprise-operations',
    title: 'Enterprise Operations',
    description: 'Full-scale marketing operations with advanced security, compliance, and integration capabilities',
    icon: Shield,
    primaryAction: {
      label: 'Enter Enterprise Suite',
      url: '/dashboard?mode=enterprise'
    },
    quickActions: [
      { label: 'Security Center', url: '/settings/security', icon: Shield },
      { label: 'API Management', url: '/integrations/enterprise', icon: Globe },
      { label: 'Compliance Dashboard', url: '/compliance/overview', icon: Settings }
    ],
    features: [
      'Enterprise security',
      'Advanced integrations',
      'Compliance management',
      'Custom workflows'
    ],
    estimatedSetupTime: '60 minutes',
    difficultyLevel: 'advanced',
    businessTypes: ['medium_business'],
    businessSizes: ['large', 'enterprise'],
    isPremium: true
  },
  {
    id: 'small-business-suite',
    title: 'Small Business Suite',
    description: 'Perfect balance of features and simplicity for growing local businesses',
    icon: Users,
    primaryAction: {
      label: 'Start Business Growth',
      url: '/dashboard?mode=small-business'
    },
    quickActions: [
      { label: 'Local Marketing', url: '/campaigns/local', icon: Target },
      { label: 'Customer Management', url: '/crm/simple', icon: Users },
      { label: 'ROI Tracking', url: '/analytics/roi', icon: BarChart3 }
    ],
    features: [
      'Local marketing tools',
      'Simple CRM integration',
      'ROI-focused analytics',
      'Community features'
    ],
    estimatedSetupTime: '20 minutes',
    difficultyLevel: 'beginner',
    businessTypes: ['small_business', 'growing_business'],
    businessSizes: ['micro', 'small', 'medium']
  },
  {
    id: 'automation-powerhouse',
    title: 'AI Automation Powerhouse',
    description: 'Advanced AI-driven automation for businesses ready to scale with minimal manual intervention',
    icon: Zap,
    primaryAction: {
      label: 'Enable AI Automation',
      url: '/automation/setup'
    },
    quickActions: [
      { label: 'Smart Workflows', url: '/automation/workflows', icon: Zap },
      { label: 'AI Optimization', url: '/ai/optimization', icon: Sparkles },
      { label: 'Predictive Analytics', url: '/analytics/predictive', icon: BarChart3 }
    ],
    features: [
      'Fully automated campaigns',
      'Predictive optimization',
      'Smart budget allocation',
      'AI-driven insights'
    ],
    estimatedSetupTime: '35 minutes',
    difficultyLevel: 'advanced',
    businessTypes: ['growing_business', 'medium_business', 'agency'],
    businessSizes: ['medium', 'large', 'enterprise'],
    isPremium: true
  }
];

export default function RoleBasedLanding({
  businessType,
  businessSize,
  userGoals = [],
  onRouteSelect,
  className = ""
}: RoleBasedLandingProps) {
  const [selectedRoute, setSelectedRoute] = useState<RoleBasedRoute | null>(null);
  const [filteredRoutes, setFilteredRoutes] = useState<RoleBasedRoute[]>([]);

  // Filter routes based on business profile
  useEffect(() => {
    let filtered = roleBasedRoutes;

    if (businessType) {
      filtered = filtered.filter(route => 
        route.businessTypes.includes(businessType)
      );
    }

    if (businessSize) {
      filtered = filtered.filter(route => 
        route.businessSizes.includes(businessSize)
      );
    }

    // Sort by recommendation and difficulty
    filtered.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficultyLevel] - difficultyOrder[b.difficultyLevel];
    });

    setFilteredRoutes(filtered);

    // Auto-select the recommended route
    const recommended = filtered.find(route => route.isRecommended);
    if (recommended && !selectedRoute) {
      setSelectedRoute(recommended);
    }
  }, [businessType, businessSize, selectedRoute]);

  const handleRouteSelect = (route: RoleBasedRoute) => {
    setSelectedRoute(route);
    onRouteSelect?.(route);
  };

  const getBusinessTypeLabel = (type?: BusinessType): string => {
    const labels: { [key in BusinessType]: string } = {
      solo_entrepreneur: 'Solo Entrepreneur',
      freelancer: 'Freelancer',
      startup: 'Startup',
      small_business: 'Small Business',
      growing_business: 'Growing Business',
      medium_business: 'Medium Business',
      large_business: 'Large Business',
      enterprise: 'Enterprise',
      agency: 'Agency',
      consultant: 'Consultant'
    };
    return type ? labels[type] : 'Business';
  };

  const getBusinessSizeLabel = (size?: BusinessSize): string => {
    const labels: { [key in BusinessSize]: string } = {
      solo: 'Solo (1 person)',
      micro: 'Micro (2-9 people)',
      small: 'Small (10-49 people)',
      medium: 'Medium (50-249 people)',
      large: 'Large (250-999 people)',
      enterprise: 'Enterprise (1000+ people)'
    };
    return size ? labels[size] : 'Any Size';
  };

  if (filteredRoutes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Complete your business profile</h3>
          <p className="text-sm">We'll show you personalized landing options once you provide your business details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {getBusinessTypeLabel(businessType)}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Based on your profile ({getBusinessSizeLabel(businessSize)}), we've customized your experience 
          to help you achieve your goals faster. Choose your starting point below.
        </p>
        
        {userGoals.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-500">Your goals:</span>
            {userGoals.slice(0, 3).map((goal, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {goal}
              </Badge>
            ))}
            {userGoals.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{userGoals.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRoutes.map((route, index) => {
            const Icon = route.icon;
            const isSelected = selectedRoute?.id === route.id;
            
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div
                  className={`h-full cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg' 
                      : 'hover:shadow-lg'
                  } ${route.isRecommended ? 'border-green-200 dark:border-green-800' : ''}`}
                  onClick={() => handleRouteSelect(route)}
                >
                  <Card className="h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${
                          route.isRecommended 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            route.isRecommended 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div className="flex flex-col space-y-1">
                          {route.isRecommended && (
                            <Badge className="w-fit bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          {route.isPremium && (
                            <Badge className="w-fit bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline"
                        className={
                          route.difficultyLevel === 'beginner' ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-400' :
                          route.difficultyLevel === 'intermediate' ? 'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400' :
                          'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                        }
                      >
                        {route.difficultyLevel}
                      </Badge>
                    </div>
                    
                    <div>
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {route.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {route.description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Key Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {route.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Setup Time */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="font-medium">Setup time:</span>
                      <span className="ml-2">{route.estimatedSetupTime}</span>
                    </div>

                    {/* Quick Actions */}
                    {route.quickActions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {route.quickActions.map((action, idx) => {
                            const ActionIcon = action.icon;
                            return (
                              <button
                                key={idx}
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  window.location.href = action.url;
                                }}
                                className="flex items-center justify-between p-2 text-sm text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  {ActionIcon && <ActionIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                                  <span className="text-gray-700 dark:text-gray-200">{action.label}</span>
                                </div>
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Primary Action */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        window.location.href = route.primaryAction.url;
                      }}
                    >
                      {route.primaryAction.label}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Route Summary */}
      {selectedRoute && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ready to get started with {selectedRoute.title}?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This path is specifically designed for {getBusinessTypeLabel(businessType)} businesses 
              and will take approximately {selectedRoute.estimatedSetupTime} to set up.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = selectedRoute.primaryAction.url}
              >
                {selectedRoute.primaryAction.label}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setSelectedRoute(null)}
              >
                Choose Different Path
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}