'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Share2, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Heart,
  BarChart3,
  Plus,
  Settings
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';

interface SocialMetrics {
  totalPosts: number;
  engagementRate: number;
  followers: number;
  impressions: number;
  topPerforming: any[];
  recentPosts: any[];
}

export default function SocialMediaDashboard() {
  const [metrics, setMetrics] = useState<SocialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    // Simulate API call with mock data
    const loadData = async () => {
      try {
        // Mock data for demonstration
        const mockMetrics: SocialMetrics = {
          totalPosts: 127,
          engagementRate: 4.2,
          followers: 15200,
          impressions: 45600,
          topPerforming: [
            { id: 1, content: 'Check out our latest campaign results!', platform: 'linkedin', engagement: 89, likes: 45, shares: 12 },
            { id: 2, content: 'Behind the scenes of PulseBridge AI', platform: 'instagram', engagement: 76, likes: 38, shares: 8 },
            { id: 3, content: 'Marketing automation tips for 2024', platform: 'twitter', engagement: 65, likes: 32, shares: 15 }
          ],
          recentPosts: [
            { id: 4, content: 'New features coming to PulseBridge!', platform: 'facebook', status: 'published', scheduledFor: '2025-09-27T10:00:00Z' },
            { id: 5, content: 'AI-powered marketing insights', platform: 'linkedin', status: 'scheduled', scheduledFor: '2025-09-28T14:00:00Z' },
            { id: 6, content: 'Join our webinar next week', platform: 'twitter', status: 'draft', scheduledFor: null }
          ]
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error loading social media data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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