'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Target,
  Calendar,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity,
  Globe,
  Hash,
  AtSign,
  Image as ImageIcon,
  Video,
  FileText,
  Star,
  Bookmark,
  Send,
  PlayCircle,
  StopCircle,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  Info,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface SocialMediaAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  platforms?: string[];
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y';
  className?: string;
}

interface PlatformMetrics {
  platform: string;
  icon: string;
  color: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  saves: number;
  comments: number;
  likes: number;
  growth: {
    followers: number;
    engagement: number;
    reach: number;
  };
  topPosts: PostMetrics[];
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    locations: { country: string; percentage: number }[];
  };
}

interface PostMetrics {
  id: string;
  content: string;
  type: 'image' | 'video' | 'carousel' | 'story' | 'reel';
  platform: string;
  publishedAt: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
    engagement: number;
  };
  mediaUrl?: string;
  thumbnailUrl?: string;
}

interface CompetitorData {
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagement: number;
  postFrequency: number;
  avgLikes: number;
  avgComments: number;
  topContent: string[];
}

interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'warning' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  metric?: string;
  change?: number;
  timestamp: string;
}

const SocialMediaAnalytics: React.FC<SocialMediaAnalyticsProps> = ({
  isOpen,
  onClose,
  platforms = ['instagram', 'tiktok', 'linkedin', 'twitter', 'youtube'],
  timeRange = '30d',
  className = ''
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedPlatforms, setSelectedPlatforms] = useState(platforms);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Mock Data (In production, this would come from APIs)
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([
    {
      platform: 'instagram',
      icon: 'instagram',
      color: '#E4405F',
      followers: 45678,
      engagement: 4.2,
      reach: 123456,
      impressions: 234567,
      clicks: 12345,
      shares: 2345,
      saves: 3456,
      comments: 1234,
      likes: 23456,
      growth: { followers: 12.5, engagement: 8.3, reach: 15.7 },
      topPosts: [],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 25 },
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 20 },
          { range: '45-54', percentage: 15 },
          { range: '55+', percentage: 5 }
        ],
        gender: [
          { type: 'Female', percentage: 60 },
          { type: 'Male', percentage: 38 },
          { type: 'Other', percentage: 2 }
        ],
        locations: [
          { country: 'United States', percentage: 45 },
          { country: 'United Kingdom', percentage: 20 },
          { country: 'Canada', percentage: 15 },
          { country: 'Australia', percentage: 10 },
          { country: 'Other', percentage: 10 }
        ]
      }
    },
    {
      platform: 'tiktok',
      icon: 'tiktok',
      color: '#000000',
      followers: 78901,
      engagement: 6.8,
      reach: 456789,
      impressions: 789012,
      clicks: 34567,
      shares: 8901,
      saves: 5678,
      comments: 4567,
      likes: 67890,
      growth: { followers: 25.3, engagement: 18.7, reach: 32.1 },
      topPosts: [],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 40 },
          { range: '25-34', percentage: 30 },
          { range: '35-44', percentage: 15 },
          { range: '45-54', percentage: 10 },
          { range: '55+', percentage: 5 }
        ],
        gender: [
          { type: 'Female', percentage: 55 },
          { type: 'Male', percentage: 43 },
          { type: 'Other', percentage: 2 }
        ],
        locations: [
          { country: 'United States', percentage: 35 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Germany', percentage: 12 },
          { country: 'France', percentage: 10 },
          { country: 'Other', percentage: 28 }
        ]
      }
    },
    {
      platform: 'linkedin',
      icon: 'linkedin',
      color: '#0077B5',
      followers: 23456,
      engagement: 3.5,
      reach: 89012,
      impressions: 123456,
      clicks: 8901,
      shares: 1234,
      saves: 2345,
      comments: 890,
      likes: 12345,
      growth: { followers: 8.7, engagement: 5.2, reach: 12.4 },
      topPosts: [],
      demographics: {
        ageGroups: [
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 30 },
          { range: '45-54', percentage: 20 },
          { range: '18-24', percentage: 10 },
          { range: '55+', percentage: 5 }
        ],
        gender: [
          { type: 'Male', percentage: 52 },
          { type: 'Female', percentage: 46 },
          { type: 'Other', percentage: 2 }
        ],
        locations: [
          { country: 'United States', percentage: 50 },
          { country: 'United Kingdom', percentage: 20 },
          { country: 'Canada', percentage: 12 },
          { country: 'Germany', percentage: 8 },
          { country: 'Other', percentage: 10 }
        ]
      }
    }
  ]);

  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([
    {
      name: 'Competitor A',
      handle: '@competitor_a',
      platform: 'instagram',
      followers: 67890,
      engagement: 5.2,
      postFrequency: 1.2,
      avgLikes: 3456,
      avgComments: 234,
      topContent: ['Product showcases', 'Behind-the-scenes', 'User testimonials']
    },
    {
      name: 'Industry Leader',
      handle: '@industry_leader',
      platform: 'tiktok',
      followers: 234567,
      engagement: 8.9,
      postFrequency: 2.5,
      avgLikes: 12345,
      avgComments: 890,
      topContent: ['Viral challenges', 'Educational content', 'Trending audio']
    }
  ]);

  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsight[]>([
    {
      id: '1',
      type: 'trend',
      title: 'Instagram Engagement Surge',
      description: 'Your Instagram engagement has increased by 23% this week, driven by video content.',
      impact: 'high',
      action: 'Create more video content',
      metric: 'engagement',
      change: 23,
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'TikTok Optimal Posting Time',
      description: 'Data shows your audience is most active on TikTok between 6-8 PM EST.',
      impact: 'medium',
      action: 'Schedule posts for peak hours',
      metric: 'reach',
      change: 15,
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      type: 'warning',
      title: 'LinkedIn Reach Declining',
      description: 'Your LinkedIn reach has decreased by 12% over the past two weeks.',
      impact: 'medium',
      action: 'Review content strategy',
      metric: 'reach',
      change: -12,
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Follower Milestone Reached',
      description: 'Congratulations! You\'ve reached 50,000 total followers across all platforms.',
      impact: 'high',
      metric: 'followers',
      timestamp: new Date().toISOString()
    }
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Utility Functions
  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  const formatPercentage = useCallback((num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  }, []);

  const getPlatformIcon = useCallback((platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return '📷';
      case 'tiktok': return '🎵';
      case 'linkedin': return '💼';
      case 'twitter': return '🐦';
      case 'youtube': return '📺';
      case 'facebook': return '👤';
      default: return '📱';
    }
  }, []);

  const getInsightIcon = useCallback((type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'opportunity': return <Target className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'achievement': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  }, []);

  // Data Processing
  const aggregatedMetrics = useMemo(() => {
    const totalFollowers = platformMetrics.reduce((sum, platform) => sum + platform.followers, 0);
    const avgEngagement = platformMetrics.reduce((sum, platform) => sum + platform.engagement, 0) / platformMetrics.length;
    const totalReach = platformMetrics.reduce((sum, platform) => sum + platform.reach, 0);
    const totalImpressions = platformMetrics.reduce((sum, platform) => sum + platform.impressions, 0);

    return {
      totalFollowers,
      avgEngagement,
      totalReach,
      totalImpressions,
      totalClicks: platformMetrics.reduce((sum, platform) => sum + platform.clicks, 0),
      totalShares: platformMetrics.reduce((sum, platform) => sum + platform.shares, 0),
      totalLikes: platformMetrics.reduce((sum, platform) => sum + platform.likes, 0),
      totalComments: platformMetrics.reduce((sum, platform) => sum + platform.comments, 0)
    };
  }, [platformMetrics]);

  // Event Handlers
  const handleRefreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Analytics data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh analytics data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Analytics exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [exportFormat]);

  const handlePlatformToggle = useCallback((platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }, []);

  // Auto-refresh Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoRefresh && refreshInterval > 0) {
      interval = setInterval(() => {
        handleRefreshData();
      }, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh, refreshInterval, handleRefreshData]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRefreshData();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose, handleRefreshData]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          variants={itemVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Social Media Analytics
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive performance insights across all platforms
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
                className="min-w-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="min-w-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 m-6 mb-0">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-0">
                      {/* Key Metrics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div variants={itemVariants}>
                          <Card className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Total Followers
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {formatNumber(aggregatedMetrics.totalFollowers)}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  +12.5% vs last month
                                </p>
                              </div>
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                          </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Card className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Avg Engagement Rate
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {aggregatedMetrics.avgEngagement.toFixed(1)}%
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  +8.3% vs last month
                                </p>
                              </div>
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                          </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Card className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Total Reach
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {formatNumber(aggregatedMetrics.totalReach)}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  +15.7% vs last month
                                </p>
                              </div>
                              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                          </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Card className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Total Impressions
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {formatNumber(aggregatedMetrics.totalImpressions)}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  +18.2% vs last month
                                </p>
                              </div>
                              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Platform Performance Overview */}
                      <motion.div variants={itemVariants}>
                        <Card className="p-6">
                          <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center justify-between">
                              <span>Platform Performance</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setComparisonMode(!comparisonMode)}
                              >
                                {comparisonMode ? 'Exit Comparison' : 'Compare Platforms'}
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          
                          <div className="space-y-4">
                            {platformMetrics.map((platform, index) => (
                              <motion.div
                                key={platform.platform}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setExpandedPlatform(
                                  expandedPlatform === platform.platform ? null : platform.platform
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="text-2xl">
                                      {getPlatformIcon(platform.platform)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {platform.platform}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatNumber(platform.followers)} followers
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {platform.engagement.toFixed(1)}% engagement
                                      </p>
                                      <p className={`text-sm flex items-center ${
                                        platform.growth.engagement > 0 
                                          ? 'text-green-600 dark:text-green-400' 
                                          : 'text-red-600 dark:text-red-400'
                                      }`}>
                                        {platform.growth.engagement > 0 ? (
                                          <TrendingUp className="w-3 h-3 mr-1" />
                                        ) : (
                                          <TrendingDown className="w-3 h-3 mr-1" />
                                        )}
                                        {formatPercentage(platform.growth.engagement)}
                                      </p>
                                    </div>
                                    
                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                                      expandedPlatform === platform.platform ? 'rotate-90' : ''
                                    }`} />
                                  </div>
                                </div>
                                
                                <AnimatePresence>
                                  {expandedPlatform === platform.platform && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                    >
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">Reach</p>
                                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(platform.reach)}
                                          </p>
                                          <p className={`text-xs ${
                                            platform.growth.reach > 0 
                                              ? 'text-green-600' 
                                              : 'text-red-600'
                                          }`}>
                                            {formatPercentage(platform.growth.reach)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">Impressions</p>
                                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(platform.impressions)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">Clicks</p>
                                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(platform.clicks)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">Shares</p>
                                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(platform.shares)}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </div>
                        </Card>
                      </motion.div>

                      {/* Recent Insights */}
                      <motion.div variants={itemVariants}>
                        <Card className="p-6">
                          <CardHeader className="px-0 pt-0">
                            <CardTitle>Recent Insights</CardTitle>
                          </CardHeader>
                          
                          <div className="space-y-4">
                            {analyticsInsights.slice(0, 4).map((insight) => (
                              <div
                                key={insight.id}
                                className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  {getInsightIcon(insight.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {insight.title}
                                    </h4>
                                    <Badge variant={
                                      insight.impact === 'high' ? 'destructive' :
                                      insight.impact === 'medium' ? 'default' : 'secondary'
                                    }>
                                      {insight.impact} impact
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {insight.description}
                                  </p>
                                  {insight.action && (
                                    <Button variant="outline" size="sm" className="mt-2">
                                      {insight.action}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    {/* Platforms Tab */}
                    <TabsContent value="platforms" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {platformMetrics.map((platform) => (
                          <motion.div key={platform.platform} variants={itemVariants}>
                            <Card className="p-6">
                              <CardHeader className="px-0 pt-0 pb-4">
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-2xl">
                                      {getPlatformIcon(platform.platform)}
                                    </div>
                                    <div>
                                      <span className="capitalize">{platform.platform}</span>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                        {formatNumber(platform.followers)} followers
                                      </p>
                                    </div>
                                  </div>
                                  <Badge style={{ backgroundColor: platform.color }} className="text-white">
                                    Active
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                      {platform.engagement.toFixed(1)}%
                                    </p>
                                    <Progress 
                                      value={platform.engagement * 10} 
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                                    <p className={`text-2xl font-bold ${
                                      platform.growth.followers > 0 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                      {formatPercentage(platform.growth.followers)}
                                    </p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatNumber(platform.likes)}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Likes</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatNumber(platform.comments)}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Comments</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatNumber(platform.shares)}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Shares</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Content Performance Tab */}
                    <TabsContent value="content" className="space-y-6 mt-0">
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle>Content Performance Analysis</CardTitle>
                          <p className="text-gray-600 dark:text-gray-400">
                            Discover what content resonates most with your audience
                          </p>
                        </CardHeader>
                        
                        <div className="text-center py-12">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Content Analysis Coming Soon
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We're building detailed content performance insights to help you create better posts.
                          </p>
                          <Button variant="outline">
                            Request Early Access
                          </Button>
                        </div>
                      </Card>
                    </TabsContent>

                    {/* Audience Demographics Tab */}
                    <TabsContent value="audience" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {platformMetrics.map((platform) => (
                          <motion.div key={platform.platform} variants={itemVariants}>
                            <Card className="p-6">
                              <CardHeader className="px-0 pt-0 pb-4">
                                <CardTitle className="flex items-center space-x-3">
                                  <span className="text-xl">{getPlatformIcon(platform.platform)}</span>
                                  <span className="capitalize">{platform.platform} Audience</span>
                                </CardTitle>
                              </CardHeader>
                              
                              <Tabs defaultValue="age" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="age">Age</TabsTrigger>
                                  <TabsTrigger value="gender">Gender</TabsTrigger>
                                  <TabsTrigger value="location">Location</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="age" className="space-y-3 mt-4">
                                  {platform.demographics.ageGroups.map((group, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {group.range}
                                      </span>
                                      <div className="flex items-center space-x-3">
                                        <Progress value={group.percentage} className="w-20" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-10">
                                          {group.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </TabsContent>
                                
                                <TabsContent value="gender" className="space-y-3 mt-4">
                                  {platform.demographics.gender.map((group, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {group.type}
                                      </span>
                                      <div className="flex items-center space-x-3">
                                        <Progress value={group.percentage} className="w-20" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-10">
                                          {group.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </TabsContent>
                                
                                <TabsContent value="location" className="space-y-3 mt-4">
                                  {platform.demographics.locations.map((location, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {location.country}
                                      </span>
                                      <div className="flex items-center space-x-3">
                                        <Progress value={location.percentage} className="w-20" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-10">
                                          {location.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </TabsContent>
                              </Tabs>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Competitors Tab */}
                    <TabsContent value="competitors" className="space-y-6 mt-0">
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle>Competitor Analysis</CardTitle>
                          <p className="text-gray-600 dark:text-gray-400">
                            See how you compare to your competitors across platforms
                          </p>
                        </CardHeader>
                        
                        <div className="space-y-4">
                          {competitorData.map((competitor, index) => (
                            <motion.div
                              key={index}
                              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                              variants={itemVariants}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="text-xl">
                                    {getPlatformIcon(competitor.platform)}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                      {competitor.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {competitor.handle} • {formatNumber(competitor.followers)} followers
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline">
                                  {competitor.engagement.toFixed(1)}% engagement
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {competitor.postFrequency}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Posts/day</p>
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatNumber(competitor.avgLikes)}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Likes</p>
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatNumber(competitor.avgComments)}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Comments</p>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Top Content Types:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {competitor.topContent.map((content, contentIndex) => (
                                    <Badge key={contentIndex} variant="secondary">
                                      {content}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </Card>
                    </TabsContent>

                    {/* Insights Tab */}
                    <TabsContent value="insights" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 gap-6">
                        {analyticsInsights.map((insight) => (
                          <motion.div key={insight.id} variants={itemVariants}>
                            <Card className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                  {getInsightIcon(insight.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {insight.title}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant={
                                        insight.impact === 'high' ? 'destructive' :
                                        insight.impact === 'medium' ? 'default' : 'secondary'
                                      }>
                                        {insight.impact} impact
                                      </Badge>
                                      {insight.change && (
                                        <Badge variant={insight.change > 0 ? 'default' : 'destructive'}>
                                          {formatPercentage(insight.change)}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {insight.description}
                                  </p>
                                  {insight.action && (
                                    <div className="flex items-center justify-between">
                                      <Button variant="outline" size="sm">
                                        <Zap className="w-4 h-4 mr-2" />
                                        {insight.action}
                                      </Button>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(insight.timestamp).toLocaleDateString()}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SocialMediaAnalytics;