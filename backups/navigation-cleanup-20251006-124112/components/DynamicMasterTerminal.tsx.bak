'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useBusinessConfiguration } from '@/contexts/BusinessConfigurationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NavigationTabs from '@/components/NavigationTabs';

// Dynamic import to prevent hydration issues
const BusinessSetupWizard = dynamic(() => import('@/components/BusinessSetupWizard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading setup wizard...</p>
      </div>
    </div>
  )
});

import { 
  Settings, 
  Plus, 
  BarChart3, 
  Users, 
  Target, 
  Zap,
  Brain,
  Globe,
  Mail,
  ShoppingCart,
  Building,
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Platform icon mapping
const platformIcons: Record<string, any> = {
  'marketing-optimization': Brain,
  'marketing-automation': Target,
  'analytics-intelligence': BarChart3,
  'social-media-platform': MessageSquare,
  'email-marketing': Mail,
  'lead-management': Users,
  'smart-alerts': AlertTriangle,
  'system-status': Activity,
  'platform-setup': Settings,
  'social-media-management': Globe,
  'content-creation-suite': FileText,
  'business-suite': Building,
  'unified-crm-suite': DollarSign,
  'e-commerce-platform': ShoppingCart,
  'project-management': Calendar,
  'customer-support': MessageSquare,
  'inventory-management': BarChart3,
  'financial-management': DollarSign,
  'hr-management': Users,
  'communication-hub': MessageSquare
};

// Platform route mapping
const platformRoutes: Record<string, string> = {
  'marketing-optimization': '/unified',
  'marketing-automation': '/campaigns',
  'analytics-intelligence': '/analytics',
  'social-media-platform': '/social',
  'email-marketing': '/email-marketing',
  'lead-management': '/leads',
  'smart-alerts': '/alerts',
  'system-status': '/status',
  'platform-setup': '/platforms',
  'social-media-management': '/social',
  'content-creation-suite': '/content-suite',
  'business-suite': '/business-suite',
  'unified-crm-suite': '/unified-crm',
  'e-commerce-platform': '/e-commerce',
  'project-management': '/projects',
  'customer-support': '/support',
  'inventory-management': '/inventory',
  'financial-management': '/finance',
  'hr-management': '/hr',
  'communication-hub': '/communication'
};

interface QuickStatsProps {
  profile: any;
}

function QuickStats({ profile }: QuickStatsProps) {
  // Mock data - in real app this would come from APIs
  const stats = [
    {
      label: 'Active Platforms',
      value: profile.selectedPlatforms.length,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Weekly Tasks',
      value: '47',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Automations',
      value: '12',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Growth Rate',
      value: '+23%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface PlatformGridProps {
  platforms: string[];
  onPlatformClick: (platformId: string) => void;
}

function PlatformGrid({ platforms, onPlatformClick }: PlatformGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {platforms.map((platformId) => {
        const IconComponent = platformIcons[platformId] || Building;
        const platformName = platformId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return (
          <motion.div
            key={platformId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-blue-300"
              onClick={() => onPlatformClick(platformId)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{platformName}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="w-full">
                    Open Platform <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

interface RecentActivityProps {
  profile: any;
}

function RecentActivity({ profile }: RecentActivityProps) {
  // Mock recent activity data
  const activities = [
    {
      id: 1,
      type: 'campaign',
      title: 'New campaign "Summer Sale 2025" launched',
      timestamp: '2 hours ago',
      icon: Target,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'automation',
      title: 'Email sequence automation completed',
      timestamp: '4 hours ago',
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'analytics',
      title: 'Weekly performance report generated',
      timestamp: '6 hours ago',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Budget threshold alert resolved',
      timestamp: '8 hours ago',
      icon: AlertTriangle,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <IconComponent className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  profile: any;
}

function QuickActions({ profile }: QuickActionsProps) {
  const actions = [
    {
      id: 'create-campaign',
      title: 'Create Campaign',
      description: 'Launch a new marketing campaign',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check your latest performance metrics',
      icon: BarChart3,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'manage-contacts',
      title: 'Manage Contacts',
      description: 'Update your customer database',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'setup-automation',
      title: 'Setup Automation',
      description: 'Create workflow automation',
      icon: Zap,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={`h-auto p-4 text-left justify-start text-white ${action.color}`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DynamicMasterTerminal() {
  const { 
    currentProfile, 
    isSetupComplete, 
    startSetupWizard,
    getGrowthRecommendations 
  } = useBusinessConfiguration();

  const handlePlatformClick = (platformId: string) => {
    const route = platformRoutes[platformId];
    if (route) {
      window.location.href = route;
    }
  };

  // If no profile is set up, show a setup prompt instead of wizard
  if (!currentProfile || !isSetupComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-16 h-16 mx-auto mb-6">
              <Settings className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard Setup Required
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Complete your business profile setup to access your personalized AI-powered dashboard
            </p>

            <div className="space-y-4">
              <Link href="/onboarding">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Complete Setup
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Takes less than 3 minutes to customize your experience
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show configured dashboard if setup is complete
  if (currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back to {currentProfile.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                Your {currentProfile.type.replace('_', ' ')} command center is ready
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {currentProfile.type.replace('_', ' ')}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {currentProfile.size} team
                </Badge>
                <Badge variant="default">
                  {currentProfile.selectedPlatforms.length} platforms active
                </Badge>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickStats profile={currentProfile} />
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column: Platforms */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Active Platforms
                  </h2>
                  <Button variant="outline" onClick={startSetupWizard}>
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
                
                <PlatformGrid 
                  platforms={currentProfile.selectedPlatforms}
                  onPlatformClick={handlePlatformClick}
                />
              </motion.div>
            </div>

            {/* Right Column: Activity & Actions */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <QuickActions profile={currentProfile} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RecentActivity profile={currentProfile} />
              </motion.div>
            </div>
          </div>

          {/* Growth Recommendations */}
          {getGrowthRecommendations().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    Growth Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getGrowthRecommendations().map((recommendation, index) => (
                      <div key={index} className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Fallback to default view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to PulseBridge.ai
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your universal business command center
          </p>
          <Link href="/onboarding">
            <Button size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}