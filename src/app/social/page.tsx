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
  Zap,
  Share2,
  Eye,
  MessageCircle,
  Heart,
  Filter,
  Search,
  Target
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

// ============================================================================
// MODULAR VIEW COMPONENTS
// ============================================================================

// Calendar View Component - Content Scheduling Interface
function CalendarView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Calendar</h2>
        <p className="text-gray-600 dark:text-gray-400">Schedule and manage posts across all your social media platforms</p>
      </div>
      
      {/* Calendar Content - Implementing the original calendar functionality */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Posts</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+3 this week</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published Today</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+2 from yesterday</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Engagement</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">4.2%</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+0.8% this week</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Platforms Active</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">All connected</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Share2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Grid - Placeholder for future calendar implementation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Calendar View Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-400">Interactive calendar for content scheduling will be available soon.</p>
        </div>
      </div>
    </div>
  );
}

// Accounts View Component - Platform Management Interface  
function AccountsView() {
  const mockAccounts = [
    { id: '1', platform: 'facebook', username: 'pulsebridge', displayName: 'PulseBridge AI', isConnected: true, followers: 5420, status: 'active' },
    { id: '2', platform: 'instagram', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 8930, status: 'active' },
    { id: '3', platform: 'twitter', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 12400, status: 'active' },
    { id: '4', platform: 'linkedin', username: 'pulsebridge-ai', displayName: 'PulseBridge AI', isConnected: true, followers: 3200, status: 'active' },
    { id: '5', platform: 'tiktok', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: false, followers: 0, status: 'expired' },
    { id: '6', platform: 'youtube', username: 'pulsebridgeai', displayName: 'PulseBridge AI', isConnected: true, followers: 1840, status: 'active' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connected Accounts</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your social media connections and platform settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAccounts.map((account) => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  account.isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {account.platform}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                account.status === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {account.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Username:</span> @{account.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Followers:</span> {account.followers.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                {account.isConnected ? 'Manage' : 'Connect'}
              </button>
              <button className="px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add New Platform */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect New Platform</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add more social media accounts to expand your reach</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Add Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics View Component - Performance Analytics Interface
function AnalyticsView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track performance across all your social media platforms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reach</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">45.2K</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% this month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">3.8K</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8.3% this week</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">892</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+15.2% this week</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">+5.7%</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Above average</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Chart coming soon</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composer View Component - Content Creation Interface
function ComposerView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Composer</h2>
        <p className="text-gray-600 dark:text-gray-400">Create and schedule posts across multiple platforms</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Platforms
            </label>
            <div className="flex flex-wrap gap-3">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'].map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Post Content
            </label>
            <textarea 
              rows={6}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What's on your mind? Share your thoughts with your audience..."
            />
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>0/280 characters</span>
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                ✨ AI Enhance
              </button>
            </div>
          </div>
          
          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Media
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Drag & drop images or click to upload</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                Choose Files
              </button>
            </div>
          </div>
          
          {/* Scheduling */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Date
              </label>
              <input 
                type="date"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Time
              </label>
              <input 
                type="time"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Schedule Post
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Publish Now
            </button>
            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function SocialMediaPlatform() {
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

  // Unified state management for modular views
  const [activeView, setActiveView] = useState<'calendar' | 'accounts' | 'analytics' | 'composer'>('calendar');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

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
    { label: 'Social Media Management', href: '/social' }
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

        {/* Social Media Management Header */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Social Media Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete social media calendar, account management, and analytics platform
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

        {/* Modular View Navigation */}
        <div className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {[
              { key: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> },
              { key: 'accounts', label: 'Accounts', icon: <Users className="h-4 w-4" /> },
              { key: 'analytics', label: 'Analytics', icon: <BarChart className="h-4 w-4" /> },
              { key: 'composer', label: 'Composer', icon: <Plus className="h-4 w-4" /> }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === view.key
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {view.icon}
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Active View */}
        <div className="flex-1 overflow-auto">
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'accounts' && <AccountsView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'composer' && <ComposerView />}
        </div>
      </div>

      {/* AI Control Chat */}
      <AIControlChat />
    </div>
  );
}