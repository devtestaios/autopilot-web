'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Share2, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Heart,
  BarChart3,
  Plus,
  Settings,
  Eye,
  Edit,
  Clock,
  Send,
  Target,
  Filter,
  Search,
  LayoutDashboard,
  Zap,
  RefreshCw
} from 'lucide-react';

// Dynamic imports for SSR safety
import dynamic from 'next/dynamic';
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => <div className="fixed right-4 bottom-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg animate-pulse" />
});

const MasterTerminalBreadcrumb = dynamic(() => import('@/components/MasterTerminalBreadcrumb'), {
  ssr: false,
  loading: () => <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// UI Components
const Badge = dynamic(() => import('@/components/ui/badge').then(mod => ({ default: mod.Badge })), {
  ssr: false,
  loading: () => <span className="inline-block h-5 w-12 bg-gray-200 rounded animate-pulse" />
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false,
  loading: () => <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
});

const Card = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.Card })), {
  ssr: false,
  loading: () => <div className="bg-white dark:bg-gray-900 rounded-lg shadow animate-pulse" />
});

const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardHeader })), {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse" />
});

const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardTitle })), {
  ssr: false,
  loading: () => <div className="h-5 bg-gray-200 rounded animate-pulse" />
});

const CardContent = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.CardContent })), {
  ssr: false,
  loading: () => <div className="px-6 pb-6 animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

import MasterTerminalBreadcrumb from '@/components/MasterTerminalBreadcrumb';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary, DashboardErrorFallback } from '@/components/ErrorBoundary';

// Social Media Platform interfaces and types
interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  username: string;
  displayName: string;
  avatar?: string;
  isConnected: boolean;
  followers: number;
  status: 'active' | 'expired' | 'limited';
}

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaUrls?: string[];
  hashtags: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
}

interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  platforms: string[];
  usage: number;
}

function SocialMediaDashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Social Media Calendar state
  const [activeTab, setActiveTab] = useState<'calendar' | 'posts' | 'analytics' | 'templates'>('calendar');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time social media data with 30-second refresh
  const { 
    overview, 
    posts, 
    quickStats, 
    loading, 
    error, 
    refresh, 
    isStale, 
    lastUpdated 
  } = useSocialMediaData(30000);

  // Mock data for additional features until backend is extended
  const mockAccounts: SocialMediaAccount[] = [
    { id: '1', platform: 'facebook', username: 'pulsebridge', displayName: 'PulseBridge AI', isConnected: true, followers: 5420, status: 'active' },
    { id: '2', platform: 'instagram', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 8930, status: 'active' },
    { id: '3', platform: 'twitter', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 12400, status: 'active' },
    { id: '4', platform: 'linkedin', username: 'pulsebridge-ai', displayName: 'PulseBridge AI', isConnected: true, followers: 3200, status: 'active' },
    { id: '5', platform: 'tiktok', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: false, followers: 0, status: 'expired' },
    { id: '6', platform: 'youtube', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 1840, status: 'active' }
  ];

  const mockScheduledPosts: ScheduledPost[] = [
    {
      id: '1',
      content: 'Exciting news! Our new AI-powered campaign optimizer is launching next week. Get ready for unprecedented marketing performance! 🚀',
      platforms: ['facebook', 'linkedin', 'twitter'],
      scheduledDate: '2025-09-30T14:00:00Z',
      status: 'scheduled',
      hashtags: ['#AI', '#Marketing', '#Innovation'],
      engagement: { likes: 0, shares: 0, comments: 0, reach: 0 }
    },
    {
      id: '2',
      content: 'Behind the scenes: How our team uses AI to optimize ad spend across multiple platforms simultaneously.',
      platforms: ['instagram', 'facebook'],
      scheduledDate: '2025-09-29T18:00:00Z',
      status: 'scheduled',
      hashtags: ['#BehindTheScenes', '#AI', '#AdOptimization'],
      engagement: { likes: 0, shares: 0, comments: 0, reach: 0 }
    },
    {
      id: '3',
      content: 'Check out our latest blog post on marketing automation trends for 2025!',
      platforms: ['linkedin', 'twitter'],
      scheduledDate: '2025-09-28T10:00:00Z',
      status: 'published',
      hashtags: ['#MarketingAutomation', '#2025Trends'],
      engagement: { likes: 45, shares: 12, comments: 8, reach: 1250 }
    }
  ];

  const accounts = mockAccounts;
  const scheduledPosts = mockScheduledPosts;

  // Navigation functions following Master Terminal architecture
  const navigateToCalendar = () => setActiveTab('calendar');
  const navigateToComposer = () => router.push('/social/composer');
  const navigateToAnalytics = () => setActiveTab('analytics');
  const navigateToSettings = () => router.push('/social/settings');
  const navigateToMasterTerminal = () => router.push('/dashboard');
  
  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      showToast('Social media data refreshed successfully', 'success');
    } catch (error) {
      showToast('Failed to refresh data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter posts based on search and platform selection
  const filteredPosts = useMemo(() => {
    if (!scheduledPosts) return [];
    
    let filtered = scheduledPosts;
    
    // Filter by platform
    if (!selectedPlatforms.includes('all')) {
      filtered = filtered.filter(post => 
        post.platforms.some(platform => selectedPlatforms.includes(platform))
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [scheduledPosts, selectedPlatforms, searchQuery]);

  // Connected platforms for easy access
  const connectedPlatforms = useMemo(() => {
    return accounts?.filter(account => account.isConnected) || [];
  }, [accounts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Share2 className="w-8 h-8 mr-3 text-blue-600" />
                Social Media Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Unified social media management across all major platforms
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                NEW PLATFORM
              </Badge>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalPosts || 0}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.engagementRate || 0}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.8% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.followers?.toLocaleString() || 0}</div>
              <div className="flex items-center mt-1">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+234 new followers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.impressions?.toLocaleString() || 0}</div>
              <div className="flex items-center mt-1">
                <BarChart3 className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">+18% reach</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Posts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Top Performing Posts
                </CardTitle>
                <CardDescription>
                  Your best-performing content this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics?.topPerforming.map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="capitalize">{post.platform}</span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {post.shares}
                        </span>
                        <span className="text-green-600">{post.engagement}% engagement</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Posts & Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Content Pipeline
                </CardTitle>
                <CardDescription>
                  Recent and scheduled posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics?.recentPosts.map((post) => {
                  const statusColor = {
                    published: 'text-green-600 bg-green-100',
                    scheduled: 'text-blue-600 bg-blue-100',
                    draft: 'text-gray-600 bg-gray-100'
                  }[post.status] || 'text-gray-600 bg-gray-100';

                  return (
                    <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {post.platform.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`text-xs ${statusColor}`}>
                              {post.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500 capitalize">{post.platform}</span>
                          </div>
                          {post.scheduledFor && (
                            <span className="text-xs text-gray-500">
                              {new Date(post.scheduledFor).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Streamline your social media workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="w-6 h-6" />
                  <span>Schedule Post</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Check Mentions</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}