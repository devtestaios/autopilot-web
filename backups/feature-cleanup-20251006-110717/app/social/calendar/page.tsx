'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';

interface CalendarPost {
  id: number;
  title: string;
  platform: string;
  status: 'scheduled' | 'published' | 'draft';
  date: string;
  time: string;
}

export default function SocialCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Mock calendar data
  const calendarPosts: CalendarPost[] = [
    {
      id: 1,
      title: 'New product announcement',
      platform: 'linkedin',
      status: 'scheduled',
      date: '2025-09-28',
      time: '10:00'
    },
    {
      id: 2,
      title: 'Behind the scenes video',
      platform: 'instagram',
      status: 'scheduled',
      date: '2025-09-28',
      time: '14:30'
    },
    {
      id: 3,
      title: 'Industry insights thread',
      platform: 'twitter',
      status: 'draft',
      date: '2025-09-29',
      time: '09:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-blue-600';
      case 'instagram': return 'bg-pink-600';
      case 'twitter': return 'bg-sky-500';
      case 'facebook': return 'bg-blue-700';
      default: return 'bg-gray-600';
    }
  };

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
                <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                Content Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Plan, schedule, and manage your social media content
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'month'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'week'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Week
                </button>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Today
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>September 2025</CardTitle>
                <CardDescription>
                  Click on a date to view or schedule posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid - Simplified for demo */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6; // Adjust for month start
                    const isCurrentMonth = day > 0 && day <= 30;
                    const hasPost = [27, 28, 29].includes(day);
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors ${
                          isCurrentMonth
                            ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                        }`}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              day === 27 ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                            }`}>
                              {day}
                            </div>
                            {hasPost && (
                              <div className="space-y-1">
                                <div className="w-full h-1 bg-blue-500 rounded"></div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                  {day === 27 && 'Product launch'}
                                  {day === 28 && 'Video content'}
                                  {day === 29 && 'Industry insights'}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scheduled Posts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
                <CardDescription>
                  Upcoming content across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {calendarPosts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h4>
                      <Button variant="ghost" size="sm" className="ml-2 p-1 h-auto">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {post.platform}
                        </span>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(post.status)}`}>
                          {post.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {post.date} at {post.time}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}