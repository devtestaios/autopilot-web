/**
 * Enhanced Social Media Management Platform
 * Full third-party API integration with AI-powered features
 * This is the MAIN social media route - /social redirects here
 * Features: Real-time analytics, AI content generation, Cross-platform posting
 * Architecture: Master Terminal + Enhanced social services + Real-time updates
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Plus, 
  Send, 
  Image, 
  Settings, 
  BarChart3, 
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
  Target,
  Sparkles,
  Bot,
  Activity,
  Globe,
  Hash,
  AtSign,
  CheckCircle,
  AlertCircle,
  Video,
  Link as LinkIcon
} from 'lucide-react';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animationVariants } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// SSR-safe imports using coding dissertation patterns
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

// Enhanced Components
const AIPoweredComposer = dynamic(() => import('@/components/AIPoweredComposer'), { 
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const EnhancedAnalytics = dynamic(() => import('@/components/EnhancedAnalytics'), { 
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

// Import hooks and utilities
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { useSocialMedia } from '@/contexts/SocialMediaContext';
import { useSocialMediaService } from '@/services/socialMediaService';

// Enhanced API Integration
import { 
  fetchSocialMediaAccounts,
  fetchSocialMediaPosts,
  createSocialMediaPost,
  fetchSocialMediaAnalytics
} from '@/lib/api';
import { SocialMediaAccount, SocialMediaPost, SocialMediaPostInput } from '@/types';

export default function EnhancedSocialMediaPlatform() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date().toISOString()
  });

  // Enhanced State Management
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [recentPosts, setRecentPosts] = useState<SocialMediaPost[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Services and Hooks
  const socialMediaService = useSocialMediaService();
  const { 
    overview, 
    posts, 
    quickStats, 
    loading: dataLoading, 
    error: dataError,
    refresh: refreshData 
  } = useSocialMediaData(30000);

  const {
    accounts,
    templates,
    analytics,
    createPost,
    updatePost,
    deletePost,
    schedulePost,
    connectAccount,
    disconnectAccount,
    refreshAccountData
  } = useSocialMedia();

  // Load enhanced data
  useEffect(() => {
    const loadEnhancedData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        // Fetch connected accounts from database
        const accounts = await fetchSocialMediaAccounts();
        setConnectedAccounts(accounts);

        // Fetch recent posts
        const posts = await fetchSocialMediaPosts({ limit: 20 });
        setRecentPosts(posts);

        // Load AI insights if accounts exist
        if (accounts.length > 0) {
          const insights = await socialMediaService.getDashboardMetrics(
            accounts.map(acc => acc.id)
          );
          setAiInsights(insights);
        }
      } catch (error) {
        console.error('Error loading enhanced social media data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnhancedData();
  }, [mounted, socialMediaService]);

  // Handle post creation with AI enhancement
  const handleCreatePost = async (postData: SocialMediaPostInput) => {
    try {
      // Create post in database
      const newPost = await createSocialMediaPost(postData);
      
      // If scheduled, handle scheduling
      if (postData.scheduled_date) {
        await schedulePost(newPost.id, postData.scheduled_date);
      } else {
        // Publish to selected platforms
        const targetPlatforms = postData.target_accounts || [];
        if (targetPlatforms.length > 0) {
          await socialMediaService.publishToPlatforms(postData, targetPlatforms);
        }
      }

      // Refresh data
      refreshData();
      setRecentPosts(prev => [newPost, ...prev]);
      
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  // Handle draft saving
  const handleSaveDraft = (draftData: SocialMediaPostInput) => {
    // Save to local storage or context for later editing
    const drafts = JSON.parse(localStorage.getItem('socialMediaDrafts') || '[]');
    const newDraft = {
      ...draftData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      status: 'draft'
    };
    drafts.push(newDraft);
    localStorage.setItem('socialMediaDrafts', JSON.stringify(drafts));
    
    // Show success message
    console.log('Draft saved successfully');
  };

  // Connect new social media account
  const handleConnectAccount = async (platform: string) => {
    console.log('Connect Account button clicked for platform:', platform);
    
    if (platform === 'instagram') {
      // Use Facebook SDK for Instagram API with Facebook Login (post-Dec 2024)
      // Instagram Basic Display API was deprecated on December 4th, 2024
      if (typeof window !== 'undefined' && window.FB) {
        console.log('Using Facebook SDK for Instagram API with Facebook Login');
        
        window.FB.login(function(response: any) {
          console.log('FB.login response:', response);
          
          if (response.authResponse) {
            console.log('Instagram API OAuth successful!');
            console.log('Access Token:', response.authResponse.accessToken);
            
            // Here you would typically save the access token and redirect to callback
            // For now, let's show success
            alert('Instagram business account connected successfully!');
            
            // You can also call your backend to save the token
            // await saveInstagramToken(response.authResponse.accessToken);
            
          } else {
            console.log('User cancelled Instagram login or did not fully authorize.');
          }
        }, {
          scope: 'pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish',
          return_scopes: true
        });
        
        return;
      } else {
        console.log('Facebook SDK not loaded, falling back to redirect method');
      }
    }
    
    // Fallback for other platforms or if FB SDK not available
    try {
      console.log('Initiating OAuth for platform:', platform);
      console.log('API Base:', process.env.NEXT_PUBLIC_API_BASE);
      
      const authUrl = await socialMediaService.initiateOAuth(platform);
      console.log('Generated auth URL:', authUrl);
      
      // Open OAuth window
      window.open(authUrl, '_blank', 'width=600,height=700');
    } catch (error) {
      console.error('Error connecting account:', error);
      alert(`Error connecting account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Content Container */}
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <MasterTerminalBreadcrumb />
          
          {/* Header with Real-time Status */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                Enhanced Social Media Management
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered social media platform with real-time analytics and cross-platform posting
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={() => handleConnectAccount('instagram')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </div>

          {/* Quick Stats Overview */}
          {quickStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {quickStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <div className={stat.color}>
                          {stat.icon === 'MessageSquare' && <MessageCircle className="h-4 w-4" />}
                          {stat.icon === 'Calendar' && <Calendar className="h-4 w-4" />}
                          {stat.icon === 'Heart' && <Heart className="h-4 w-4" />}
                          {stat.icon === 'Users' && <Users className="h-4 w-4" />}
                          {stat.icon === 'TrendingUp' && <TrendingUp className="h-4 w-4" />}
                          {stat.icon === 'Award' && <Target className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stat.title}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Main Platform Interface */}
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="composer" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Composer
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Accounts
              </TabsTrigger>
            </TabsList>

            {/* Dashboard View */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Posts */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Recent Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentPosts.length > 0 ? (
                        <div className="space-y-4">
                          {recentPosts.slice(0, 5).map((post) => (
                            <div key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                  <Share2 className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {post.engagement?.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {post.engagement?.comments || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Share2 className="h-3 w-3" />
                                      {post.engagement?.shares || 0}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {post.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
                          <Button 
                            onClick={() => setActiveView('composer')} 
                            className="mt-4"
                            size="sm"
                          >
                            Create Your First Post
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Connected Accounts */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Connected Accounts
                        <Badge variant="outline" className="ml-auto">
                          {connectedAccounts.filter(acc => acc.is_connected).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'].map((platform) => {
                          const account = connectedAccounts.find(acc => acc.platform === platform);
                          const isConnected = account?.is_connected || false;
                          
                          return (
                            <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {platform === 'facebook' && '📘'}
                                  {platform === 'instagram' && '📸'}
                                  {platform === 'twitter' && '🐦'}
                                  {platform === 'linkedin' && '💼'}
                                  {platform === 'tiktok' && '🎵'}
                                  {platform === 'youtube' && '📺'}
                                </div>
                                <div>
                                  <div className="font-medium text-sm capitalize">
                                    {platform}
                                  </div>
                                  {account && (
                                    <div className="text-xs text-gray-500">
                                      {account.followers.toLocaleString()} followers
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isConnected ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleConnectAccount(platform)}
                                  >
                                    Connect
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* AI Composer View */}
            <TabsContent value="composer" className="space-y-6">
              <AIPoweredComposer
                accounts={connectedAccounts}
                onPostCreate={handleCreatePost}
                onDraftSave={handleSaveDraft}
              />
            </TabsContent>

            {/* Analytics View */}
            <TabsContent value="analytics" className="space-y-6">
              <EnhancedAnalytics
                accounts={connectedAccounts}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </TabsContent>

            {/* Accounts Management View */}
            <TabsContent value="accounts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'].map((platform) => {
                  const account = connectedAccounts.find(acc => acc.platform === platform);
                  const isConnected = account?.is_connected || false;
                  
                  return (
                    <Card key={platform} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg">
                            {platform === 'facebook' && '📘'}
                            {platform === 'instagram' && '📸'}
                            {platform === 'twitter' && '🐦'}
                            {platform === 'linkedin' && '💼'}
                            {platform === 'tiktok' && '🎵'}
                            {platform === 'youtube' && '📺'}
                          </div>
                          <div>
                            <div className="capitalize font-semibold">{platform}</div>
                            <div className="text-sm text-gray-500 font-normal">
                              {isConnected ? 'Connected' : 'Not Connected'}
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isConnected && account ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Username</span>
                              <span className="text-sm font-medium">@{account.username}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Followers</span>
                              <span className="text-sm font-medium">{account.followers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Status</span>
                              <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                                {account.status}
                              </Badge>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" className="flex-1">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Refresh
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Settings className="h-3 w-3 mr-1" />
                                Settings
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Globe className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 text-sm mb-4">
                              Connect your {platform} account to start posting
                            </p>
                            <Button 
                              onClick={() => handleConnectAccount(platform)}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Control Chat */}
      <AIControlChat />
    </div>
  );
}
