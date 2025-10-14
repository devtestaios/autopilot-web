'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, MessageSquare, Heart, Share2 } from 'lucide-react';

export default function SocialOverviewPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platformStats = [
    {
      platform: 'Instagram',
      followers: '45.2K',
      engagement: '4.8%',
      reach: '120K',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      platform: 'Twitter',
      followers: '28.7K',
      engagement: '3.2%',
      reach: '89K',
      color: 'bg-gradient-to-r from-blue-400 to-blue-600'
    },
    {
      platform: 'LinkedIn',
      followers: '15.3K',
      engagement: '5.1%',
      reach: '67K',
      color: 'bg-gradient-to-r from-blue-600 to-blue-800'
    },
    {
      platform: 'TikTok',
      followers: '92.1K',
      engagement: '7.3%',
      reach: '340K',
      color: 'bg-gradient-to-r from-gray-800 to-gray-900'
    }
  ];

  const recentPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Check out our latest AI-powered marketing insights! 🚀',
      engagement: { likes: 234, comments: 45, shares: 12 },
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'New automation features now live! Streamline your workflow today.',
      engagement: { likes: 89, comments: 23, shares: 34 },
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      content: 'How AI is transforming modern business operations - insights from our team',
      engagement: { likes: 156, comments: 67, shares: 45 },
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 data-testid="social-overview-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Social Media Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your social media performance across all platforms
          </p>
        </div>

        {/* Platform Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat) => (
            <motion.div
              key={stat.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className={`h-2 ${stat.color}`}></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {stat.platform}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Followers</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.followers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                    <span className="text-lg font-bold text-green-600">{stat.engagement}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reach</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.reach}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance Trends
            </h2>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Performance chart will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Posts
          </h2>
          
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {post.platform}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.timestamp}
                  </span>
                </div>
                
                <p className="text-gray-900 dark:text-white mb-3">
                  {post.content}
                </p>
                
                <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.engagement.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.engagement.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.engagement.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}