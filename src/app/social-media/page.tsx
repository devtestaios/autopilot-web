'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Filter,
  Search,
  Settings,
  Zap,
  Target,
  Eye,
  BarChart3
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

import { useSocialMedia } from '@/contexts/SocialMediaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';

// Lazy load heavy components - using placeholders for missing components
const PostComposer = React.lazy(() => Promise.resolve({ default: () => <div>Post Composer - Coming Soon</div> }));
const AnalyticsDashboard = React.lazy(() => Promise.resolve({ default: () => <div>Analytics Dashboard - Coming Soon</div> }));
const ContentCalendar = React.lazy(() => Promise.resolve({ default: () => <div>Content Calendar - Coming Soon</div> }));
const AccountManager = React.lazy(() => Promise.resolve({ default: () => <div>Account Manager - Coming Soon</div> }));

interface PlatformIconProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const platformColors = {
    facebook: 'text-blue-600',
    instagram: 'text-pink-600', 
    twitter: 'text-blue-400',
    linkedin: 'text-blue-700',
    tiktok: 'text-black dark:text-white'
  };

  return (
    <div className={`${sizeClasses[size]} ${platformColors[platform as keyof typeof platformColors]} rounded-full bg-gray-100 dark:bg-gray-800 p-1`}>
      {/* Platform-specific icons would go here */}
      <div className="w-full h-full rounded-full bg-current opacity-80" />
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => {
  const { theme } = useTheme();
  
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };

  const trendIcon = {
    up: <TrendingUp className="w-3 h-3" />,
    down: <TrendingUp className="w-3 h-3 rotate-180" />,
    stable: <div className="w-3 h-3 bg-gray-400 rounded-full" />
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${trendColor[trend]}`}>
              {trendIcon[trend]}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, onClick, disabled = false }) => (
  <motion.div
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
  >
    <Card className={`cursor-pointer transition-all duration-200 ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg text-teal-600 dark:text-teal-400">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function SocialMediaPlatform() {
  const {
    accounts,
    selectedAccount,
    posts,
    scheduledPosts,
    loading,
    errors,
    features,
    selectAccount
  } = useSocialMedia();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate metrics from current data
  const metrics = useMemo(() => {
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published');
    const totalEngagement = publishedPosts.reduce((sum, post) => 
      sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
    );
    const avgEngagement = publishedPosts.length > 0 ? totalEngagement / publishedPosts.length : 0;

    return {
      followers: { value: totalFollowers, change: 12.5, trend: 'up' as const },
      posts: { value: totalPosts, change: 8.3, trend: 'up' as const },
      engagement: { value: Math.round(avgEngagement), change: 15.7, trend: 'up' as const },
      reach: { value: '2.4M', change: 22.1, trend: 'up' as const }
    };
  }, [accounts, posts]);

  const connectedPlatforms = useMemo(() => 
    accounts.filter(acc => acc.isConnected), [accounts]
  );

  const upcomingPosts = useMemo(() =>
    scheduledPosts
      .filter(post => post.scheduledDate && post.scheduledDate > new Date())
      .sort((a, b) => (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0))
      .slice(0, 5), [scheduledPosts]
  );

  if (loading.accounts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* UPGRADED: Using mature dashboard architecture */}
        <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
        
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
          <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
          
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* UPGRADED: Using mature dashboard architecture */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Social Media Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage all your social media accounts • AI-Enhanced Dashboard
                  </p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
              {features.aiContentGeneration && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-300 dark:border-purple-700">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    AI Powered
                  </span>
                </div>
              )}
              
              <Button 
                onClick={() => setShowComposer(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Followers"
            value={metrics.followers.value.toLocaleString()}
            change={metrics.followers.change}
            trend={metrics.followers.trend}
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Posts"
            value={metrics.posts.value}
            change={metrics.posts.change}
            trend={metrics.posts.trend}
            icon={<MessageCircle className="w-5 h-5" />}
          />
          <MetricCard
            title="Avg Engagement"
            value={metrics.engagement.value}
            change={metrics.engagement.change}
            trend={metrics.engagement.trend}
            icon={<Heart className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Reach"
            value={metrics.reach.value}
            change={metrics.reach.change}
            trend={metrics.reach.trend}
            icon={<Eye className="w-5 h-5" />}
          />
        </div>

        {/* Connected Platforms */}
        {connectedPlatforms.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Connected Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {connectedPlatforms.map((account) => (
                  <motion.div
                    key={account.id}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedAccount?.id === account.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => selectAccount(account)}
                  >
                    <PlatformIcon platform={account.platform} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {account.displayName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {account.followers.toLocaleString()} followers
                      </p>
                    </div>
                    <Badge 
                      variant={account.status === 'active' ? 'default' : 'secondary'}
                      className="ml-auto"
                    >
                      {account.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="accounts" className="hidden lg:flex">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickAction
                      title="AI Content Generator"
                      description="Generate engaging content with AI"
                      icon={<Zap className="w-5 h-5" />}
                      onClick={() => {/* Implement AI content generator */}}
                      disabled={!features.aiContentGeneration}
                    />
                    <QuickAction
                      title="Schedule Posts"
                      description="Plan your content calendar"
                      icon={<Calendar className="w-5 h-5" />}
                      onClick={() => setActiveTab('calendar')}
                    />
                    <QuickAction
                      title="Audience Insights"
                      description="Analyze your audience"
                      icon={<Target className="w-5 h-5" />}
                      onClick={() => setActiveTab('analytics')}
                    />
                    <QuickAction
                      title="Performance Report"
                      description="Generate comprehensive reports"
                      icon={<BarChart3 className="w-5 h-5" />}
                      onClick={() => setActiveTab('analytics')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingPosts.length > 0 ? (
                      upcomingPosts.map((post) => (
                        <div key={post.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {post.content}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {post.scheduledDate?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                        No upcoming posts scheduled
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {/* Post management interface would go here */}
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Post Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced post management interface coming soon
                </p>
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {/* Content calendar would go here */}
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Content Calendar
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive content calendar coming soon
                </p>
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {/* Analytics dashboard would go here */}
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive analytics dashboard coming soon
                </p>
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {/* Account management would go here */}
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Account Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Social media account management coming soon
                </p>
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Composer Modal */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComposer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Post
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowComposer(false)}
                >
                  Close
                </Button>
              </div>
              
              <Suspense fallback={<LoadingSpinner />}>
                {/* Post composer component would go here */}
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced post composer coming soon
                  </p>
                </div>
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      
      {/* UPGRADED: AI Control Chat with social media-specific capabilities */}
      <AIControlChat />
    </div>
  );
}