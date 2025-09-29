'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Plus, 
  Send, 
  Image, 
  Settings, 
  BarChart, 
  ChevronRight,
  RefreshCw,
  LayoutDashboard,
  Zap
} from 'lucide-react';

// Dynamic imports for SSR safety
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

// Import hooks and utilities
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { useToast } from '@/components/ui/Toast';

// Types for social media calendar
interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  username: string;
  displayName: string;
  isConnected: boolean;
  followers: number;
  status: 'active' | 'inactive' | 'expired';
}

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  hashtags: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
}

export default function SocialMediaCalendar() {
  const router = useRouter();
  const { showToast } = useToast();
  
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

  // State for social media calendar
  const [selectedView, setSelectedView] = useState<'calendar' | 'list' | 'analytics'>('calendar');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Mock data for social media accounts and scheduled posts
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

  // Handle data refresh
  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
      showToast({
        type: 'success',
        title: 'Social media data refreshed successfully'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to refresh data'
      });
    }
  }, [refresh, showToast]);

  // Master Terminal navigation
  const breadcrumbCustomPath = [
    { label: 'Master Terminal', href: '/dashboard' },
    { label: 'Marketing Platforms', href: '/dashboard#marketing' },
    { label: 'Social Media Calendar', href: '/social' }
  ];

  // Calculate metrics from real data combined with mock data
  const totalPosts = (overview?.total_posts || 0) + scheduledPosts.length;
  const totalEngagement = overview?.total_engagement || 0;
  const totalFollowers = accounts.reduce((sum, account) => sum + account.followers, 0);
  const engagementRate = overview?.avg_engagement_rate || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Master Terminal Sidebar */}
      <UnifiedSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        {/* Advanced Navigation */}
        <AdvancedNavigation />
        
        {/* Master Terminal Breadcrumb */}
        <div className="px-6 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <MasterTerminalBreadcrumb customPath={breadcrumbCustomPath} />
        </div>

        {/* Social Media Calendar Header */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Social Media Calendar
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Schedule and manage posts across all your social media platforms
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className={`h-2 w-2 rounded-full ${isStale ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <span>
                  {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}
                </span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsCreatingPost(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +{scheduledPosts.filter(p => p.status === 'scheduled').length} scheduled
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{engagementRate.toFixed(1)}%</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+2.3% from last week</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Followers</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalFollowers.toLocaleString()}</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+{Math.floor(totalFollowers * 0.05)} this month</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engagement</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEngagement.toLocaleString()}</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% this week</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Connected Accounts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Accounts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage your social media connections
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          account.isConnected ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {account.platform}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Posts */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Posts</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Upcoming and recent social media posts
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedView('calendar')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedView === 'calendar' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedView('list')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedView === 'list' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {scheduledPosts.map((post) => {
                      const statusColor = {
                        published: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
                        scheduled: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
                        draft: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
                        publishing: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
                        failed: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
                      }[post.status];

                      return (
                        <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(post.scheduledDate).toLocaleString()}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                              {post.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {post.platforms.map((platform) => (
                                <span key={platform} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs capitalize">
                                  {platform}
                                </span>
                              ))}
                            </div>
                            
                            {post.status === 'published' && (
                              <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                                <span>{post.engagement.likes} likes</span>
                                <span>{post.engagement.shares} shares</span>
                                <span>{post.engagement.comments} comments</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Control Chat */}
      <AIControlChat />
    </div>
  );
}