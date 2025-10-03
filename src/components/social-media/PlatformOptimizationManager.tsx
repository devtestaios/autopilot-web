'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  Target,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  AtSign,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  Image as ImageIcon,
  Video,
  Layers,
  Maximize,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface PlatformOptimizationManagerProps {
  platforms: string[];
  content: string;
  hashtags: string[];
  mediaFiles: File[];
  onOptimizationChange: (platformOptimizations: PlatformOptimization[]) => void;
  className?: string;
}

interface PlatformOptimization {
  platform: string;
  settings: {
    // Content Optimization
    maxContentLength: number;
    hashtagStrategy: 'minimal' | 'moderate' | 'aggressive';
    toneAdjustment: 'professional' | 'casual' | 'playful' | 'inspiring';
    
    // Media Optimization
    imageSize: { width: number; height: number };
    videoLength: number; // seconds
    carouselOptimal: boolean;
    
    // Timing Optimization
    bestPostTimes: string[];
    frequencyOptimal: number; // posts per week
    
    // Engagement Optimization
    callToAction: string;
    engagementTactics: string[];
    hashtagCount: number;
    
    // Audience Optimization
    targetAudience: string;
    ageRange: [number, number];
    interests: string[];
  };
  performance: {
    optimizationScore: number;
    expectedReach: number;
    expectedEngagement: number;
    confidenceLevel: number;
  };
  recommendations: {
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    category: string;
  }[];
}

// Platform-specific defaults
const platformDefaults: Record<string, Partial<PlatformOptimization['settings']>> = {
  instagram: {
    maxContentLength: 2200,
    hashtagStrategy: 'aggressive',
    toneAdjustment: 'inspiring',
    imageSize: { width: 1080, height: 1080 },
    videoLength: 60,
    carouselOptimal: true,
    bestPostTimes: ['12:00 PM', '6:00 PM', '8:00 PM'],
    frequencyOptimal: 7,
    hashtagCount: 25,
    targetAudience: 'Visual-focused millennials and Gen Z',
    ageRange: [18, 34] as [number, number],
    interests: ['lifestyle', 'fashion', 'travel', 'food']
  },
  tiktok: {
    maxContentLength: 150,
    hashtagStrategy: 'moderate',
    toneAdjustment: 'playful',
    imageSize: { width: 1080, height: 1920 },
    videoLength: 30,
    carouselOptimal: false,
    bestPostTimes: ['9:00 AM', '12:00 PM', '7:00 PM'],
    frequencyOptimal: 5,
    hashtagCount: 5,
    targetAudience: 'Young, trend-focused audience',
    ageRange: [16, 24] as [number, number],
    interests: ['trends', 'entertainment', 'dance', 'comedy']
  },
  linkedin: {
    maxContentLength: 3000,
    hashtagStrategy: 'minimal',
    toneAdjustment: 'professional',
    imageSize: { width: 1200, height: 627 },
    videoLength: 180,
    carouselOptimal: true,
    bestPostTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
    frequencyOptimal: 3,
    hashtagCount: 5,
    targetAudience: 'Business professionals and decision makers',
    ageRange: [25, 54] as [number, number],
    interests: ['business', 'technology', 'leadership', 'industry news']
  },
  twitter: {
    maxContentLength: 280,
    hashtagStrategy: 'moderate',
    toneAdjustment: 'casual',
    imageSize: { width: 1200, height: 675 },
    videoLength: 140,
    carouselOptimal: false,
    bestPostTimes: ['9:00 AM', '1:00 PM', '3:00 PM'],
    frequencyOptimal: 14,
    hashtagCount: 3,
    targetAudience: 'News-conscious, real-time engaged users',
    ageRange: [25, 49] as [number, number],
    interests: ['news', 'technology', 'politics', 'entertainment']
  },
  youtube: {
    maxContentLength: 5000,
    hashtagStrategy: 'moderate',
    toneAdjustment: 'inspiring',
    imageSize: { width: 1280, height: 720 },
    videoLength: 600,
    carouselOptimal: false,
    bestPostTimes: ['2:00 PM', '4:00 PM', '6:00 PM'],
    frequencyOptimal: 2,
    hashtagCount: 10,
    targetAudience: 'Content consumers and learners',
    ageRange: [18, 49] as [number, number],
    interests: ['education', 'entertainment', 'tutorials', 'reviews']
  },
  pinterest: {
    maxContentLength: 500,
    hashtagStrategy: 'aggressive',
    toneAdjustment: 'inspiring',
    imageSize: { width: 735, height: 1102 },
    videoLength: 15,
    carouselOptimal: false,
    bestPostTimes: ['2:00 PM', '8:00 PM', '11:00 PM'],
    frequencyOptimal: 5,
    hashtagCount: 20,
    targetAudience: 'Inspiration and planning focused users',
    ageRange: [25, 44] as [number, number],
    interests: ['home decor', 'fashion', 'food', 'diy', 'lifestyle']
  }
};

const platformIcons = {
  instagram: '📸',
  tiktok: '🎵',
  linkedin: '💼',
  twitter: '🐦',
  youtube: '📺',
  pinterest: '📌'
};

const platformColors = {
  instagram: 'from-purple-500 to-pink-500',
  tiktok: 'from-black to-gray-800',
  linkedin: 'from-blue-600 to-blue-700',
  twitter: 'from-blue-400 to-blue-500',
  youtube: 'from-red-600 to-red-700',
  pinterest: 'from-red-500 to-red-600'
};

export default function PlatformOptimizationManager({
  platforms,
  content,
  hashtags,
  mediaFiles,
  onOptimizationChange,
  className = ''
}: PlatformOptimizationManagerProps) {
  const [platformOptimizations, setPlatformOptimizations] = useState<PlatformOptimization[]>([]);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0] || 'instagram');
  const [autoOptimize, setAutoOptimize] = useState(true);

  // Initialize platform optimizations
  useEffect(() => {
    const initializeOptimizations = () => {
      const optimizations: PlatformOptimization[] = platforms.map(platform => {
        const defaults = platformDefaults[platform] || platformDefaults.instagram;
        
        return {
          platform,
          settings: {
            maxContentLength: defaults.maxContentLength || 2200,
            hashtagStrategy: defaults.hashtagStrategy || 'moderate',
            toneAdjustment: defaults.toneAdjustment || 'casual',
            imageSize: defaults.imageSize || { width: 1080, height: 1080 },
            videoLength: defaults.videoLength || 60,
            carouselOptimal: defaults.carouselOptimal || false,
            bestPostTimes: defaults.bestPostTimes || ['12:00 PM'],
            frequencyOptimal: defaults.frequencyOptimal || 5,
            callToAction: generateCallToAction(platform),
            engagementTactics: generateEngagementTactics(platform),
            hashtagCount: defaults.hashtagCount || 10,
            targetAudience: defaults.targetAudience || 'General audience',
            ageRange: defaults.ageRange || [18, 65],
            interests: defaults.interests || ['general']
          },
          performance: {
            optimizationScore: calculateOptimizationScore(platform, content, hashtags, mediaFiles),
            expectedReach: Math.floor(Math.random() * 10000) + 1000,
            expectedEngagement: Math.floor(Math.random() * 500) + 50,
            confidenceLevel: Math.floor(Math.random() * 30) + 70
          },
          recommendations: generateRecommendations(platform, content, hashtags, mediaFiles)
        };
      });

      setPlatformOptimizations(optimizations);
      onOptimizationChange(optimizations);
    };

    if (platforms.length > 0) {
      initializeOptimizations();
    }
  }, [platforms, content, hashtags, mediaFiles, onOptimizationChange]);

  // Generate platform-specific call to action
  const generateCallToAction = (platform: string): string => {
    const ctas = {
      instagram: 'Double tap if you agree! 💫',
      tiktok: 'Comment your thoughts below! ⬇️',
      linkedin: 'What are your thoughts on this? Share in the comments.',
      twitter: 'Retweet if you found this helpful!',
      youtube: 'Like and subscribe for more content!',
      pinterest: 'Save this pin for later inspiration! 📌'
    };
    return ctas[platform as keyof typeof ctas] || 'Let us know what you think!';
  };

  // Generate platform-specific engagement tactics
  const generateEngagementTactics = (platform: string): string[] => {
    const tactics = {
      instagram: ['Stories polls', 'Ask questions', 'User-generated content', 'Behind-the-scenes'],
      tiktok: ['Trending sounds', 'Challenges', 'Duets', 'Quick tutorials'],
      linkedin: ['Industry insights', 'Professional tips', 'Case studies', 'Thought leadership'],
      twitter: ['Threads', 'Polls', 'Real-time commentary', 'Industry news'],
      youtube: ['Detailed tutorials', 'Series content', 'Community posts', 'Live streams'],
      pinterest: ['Seasonal content', 'How-to guides', 'Inspiration boards', 'Step-by-step pins']
    };
    return tactics[platform as keyof typeof tactics] || ['Engaging content', 'Ask questions'];
  };

  // Calculate optimization score
  const calculateOptimizationScore = (platform: string, content: string, hashtags: string[], mediaFiles: File[]): number => {
    let score = 0;
    const defaults = platformDefaults[platform];

    // Content length score
    if (content.length > 0 && content.length <= (defaults?.maxContentLength || 2200)) {
      score += 25;
    }

    // Hashtag score
    const optimalHashtags = defaults?.hashtagCount || 10;
    if (hashtags.length >= Math.floor(optimalHashtags * 0.5) && hashtags.length <= optimalHashtags) {
      score += 25;
    }

    // Media score
    if (mediaFiles.length > 0) {
      score += 25;
    }

    // Platform-specific bonus
    if (platform === 'instagram' && mediaFiles.length > 1) score += 10; // Carousel bonus
    if (platform === 'linkedin' && content.length > 500) score += 10; // Professional content bonus
    if (platform === 'tiktok' && mediaFiles.some(f => f.type.startsWith('video'))) score += 15; // Video bonus

    return Math.min(score, 100);
  };

  // Generate recommendations
  const generateRecommendations = (platform: string, content: string, hashtags: string[], mediaFiles: File[]) => {
    const recommendations = [];
    const defaults = platformDefaults[platform];

    // Content recommendations
    if (content.length > (defaults?.maxContentLength || 2200)) {
      recommendations.push({
        title: 'Content Too Long',
        description: `Consider shortening your content to ${defaults?.maxContentLength} characters or less for optimal ${platform} performance.`,
        impact: 'high' as const,
        category: 'Content'
      });
    }

    // Hashtag recommendations
    if (hashtags.length < (defaults?.hashtagCount || 10) / 2) {
      recommendations.push({
        title: 'Add More Hashtags',
        description: `${platform} performs better with ${defaults?.hashtagCount} hashtags. Consider adding more relevant tags.`,
        impact: 'medium' as const,
        category: 'Hashtags'
      });
    }

    // Media recommendations
    if (mediaFiles.length === 0) {
      recommendations.push({
        title: 'Add Visual Content',
        description: `Posts with images or videos get ${platform === 'instagram' ? '2.3x' : '1.5x'} more engagement on ${platform}.`,
        impact: 'high' as const,
        category: 'Media'
      });
    }

    // Platform-specific recommendations
    if (platform === 'instagram' && mediaFiles.length === 1) {
      recommendations.push({
        title: 'Consider Carousel Post',
        description: 'Carousel posts on Instagram typically get 1.4x more reach and engagement.',
        impact: 'medium' as const,
        category: 'Format'
      });
    }

    if (platform === 'linkedin' && !content.includes('?')) {
      recommendations.push({
        title: 'Add Question for Engagement',
        description: 'Posts with questions get 50% more comments on LinkedIn.',
        impact: 'medium' as const,
        category: 'Engagement'
      });
    }

    if (platform === 'tiktok' && !mediaFiles.some(f => f.type.startsWith('video'))) {
      recommendations.push({
        title: 'Video Content Recommended',
        description: 'TikTok is primarily a video platform. Consider adding video content.',
        impact: 'high' as const,
        category: 'Media'
      });
    }

    return recommendations;
  };

  // Toggle platform expansion
  const togglePlatformExpansion = (platform: string) => {
    setExpandedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Update platform setting
  const updatePlatformSetting = (platform: string, key: string, value: any) => {
    setPlatformOptimizations(prev => {
      const updated = prev.map(opt => {
        if (opt.platform === platform) {
          return {
            ...opt,
            settings: {
              ...opt.settings,
              [key]: value
            },
            performance: {
              ...opt.performance,
              optimizationScore: calculateOptimizationScore(platform, content, hashtags, mediaFiles)
            }
          };
        }
        return opt;
      });
      onOptimizationChange(updated);
      return updated;
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Platform Optimization
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Optimize content for each platform's unique audience and algorithm
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-optimize</span>
            <Switch 
              checked={autoOptimize} 
              onCheckedChange={setAutoOptimize}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Recalculate all optimizations
              const updated = platformOptimizations.map(opt => ({
                ...opt,
                performance: {
                  ...opt.performance,
                  optimizationScore: calculateOptimizationScore(opt.platform, content, hashtags, mediaFiles)
                },
                recommendations: generateRecommendations(opt.platform, content, hashtags, mediaFiles)
              }));
              setPlatformOptimizations(updated);
              onOptimizationChange(updated);
              toast.success('Platform optimizations refreshed');
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformOptimizations.map((optimization) => (
          <Card 
            key={optimization.platform} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPlatform === optimization.platform ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedPlatform(optimization.platform)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platformColors[optimization.platform as keyof typeof platformColors]} flex items-center justify-center text-white text-sm`}>
                    {platformIcons[optimization.platform as keyof typeof platformIcons]}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{optimization.platform}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {optimization.settings.targetAudience}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlatformExpansion(optimization.platform);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedPlatforms.includes(optimization.platform) ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Optimization Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Optimization Score</span>
                  <span className="text-sm font-medium">
                    {optimization.performance.optimizationScore}%
                  </span>
                </div>
                <Progress value={optimization.performance.optimizationScore} className="h-2" />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    {optimization.performance.expectedReach.toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Expected Reach</p>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <p className="font-medium text-green-700 dark:text-green-300">
                    {optimization.performance.expectedEngagement.toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Engagement</p>
                </div>
              </div>

              {/* Top Recommendation */}
              {optimization.recommendations.length > 0 && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span className="font-medium">{optimization.recommendations[0].title}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {optimization.recommendations[0].description}
                  </p>
                </div>
              )}
            </CardContent>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedPlatforms.includes(optimization.platform) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="pt-4 space-y-4">
                    {/* Detailed Settings */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Platform Settings
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Max Content Length</span>
                          <p className="font-medium">{optimization.settings.maxContentLength} chars</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Optimal Hashtags</span>
                          <p className="font-medium">{optimization.settings.hashtagCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Tone</span>
                          <p className="font-medium capitalize">{optimization.settings.toneAdjustment}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Post Frequency</span>
                          <p className="font-medium">{optimization.settings.frequencyOptimal}/week</p>
                        </div>
                      </div>
                    </div>

                    {/* Best Posting Times */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Best Posting Times
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {optimization.settings.bestPostTimes.map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* All Recommendations */}
                    {optimization.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {optimization.recommendations.map((rec, index) => (
                            <div key={index} className="p-2 border rounded text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{rec.title}</span>
                                <Badge 
                                  variant="outline" 
                                  className={getImpactColor(rec.impact)}
                                >
                                  {rec.impact}
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">
                                {rec.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Detailed Platform Configuration */}
      {selectedPlatform && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">
                {platformIcons[selectedPlatform as keyof typeof platformIcons]}
              </span>
              <span className="capitalize">{selectedPlatform} Optimization</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="timing">Timing</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-6">
                {platformOptimizations
                  .filter(opt => opt.platform === selectedPlatform)
                  .map(optimization => (
                  <div key={optimization.platform} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Content Tone
                        </label>
                        <select
                          value={optimization.settings.toneAdjustment}
                          onChange={(e) => updatePlatformSetting(selectedPlatform, 'toneAdjustment', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="playful">Playful</option>
                          <option value="inspiring">Inspiring</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Hashtag Strategy
                        </label>
                        <select
                          value={optimization.settings.hashtagStrategy}
                          onChange={(e) => updatePlatformSetting(selectedPlatform, 'hashtagStrategy', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        >
                          <option value="minimal">Minimal (1-5)</option>
                          <option value="moderate">Moderate (6-15)</option>
                          <option value="aggressive">Aggressive (16-30)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Maximum Content Length: {optimization.settings.maxContentLength} characters
                      </label>
                      <Slider
                        value={[optimization.settings.maxContentLength]}
                        onValueChange={([value]) => updatePlatformSetting(selectedPlatform, 'maxContentLength', value)}
                        max={5000}
                        min={50}
                        step={50}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Call to Action
                      </label>
                      <input
                        type="text"
                        value={optimization.settings.callToAction}
                        onChange={(e) => updatePlatformSetting(selectedPlatform, 'callToAction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="Enter call to action..."
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="media" className="space-y-4 mt-6">
                {platformOptimizations
                  .filter(opt => opt.platform === selectedPlatform)
                  .map(optimization => (
                  <div key={optimization.platform} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Optimal Image Size
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={optimization.settings.imageSize.width}
                            onChange={(e) => updatePlatformSetting(selectedPlatform, 'imageSize', {
                              ...optimization.settings.imageSize,
                              width: parseInt(e.target.value) || 1080
                            })}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            placeholder="Width"
                          />
                          <span className="text-gray-500">×</span>
                          <input
                            type="number"
                            value={optimization.settings.imageSize.height}
                            onChange={(e) => updatePlatformSetting(selectedPlatform, 'imageSize', {
                              ...optimization.settings.imageSize,
                              height: parseInt(e.target.value) || 1080
                            })}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            placeholder="Height"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Optimal Video Length: {optimization.settings.videoLength}s
                        </label>
                        <Slider
                          value={[optimization.settings.videoLength]}
                          onValueChange={([value]) => updatePlatformSetting(selectedPlatform, 'videoLength', value)}
                          max={600}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Carousel Optimization</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enable carousel posts for better engagement
                        </p>
                      </div>
                      <Switch
                        checked={optimization.settings.carouselOptimal}
                        onCheckedChange={(checked) => updatePlatformSetting(selectedPlatform, 'carouselOptimal', checked)}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="timing" className="space-y-4 mt-6">
                {platformOptimizations
                  .filter(opt => opt.platform === selectedPlatform)
                  .map(optimization => (
                  <div key={optimization.platform} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Optimal Posting Frequency: {optimization.settings.frequencyOptimal} posts/week
                      </label>
                      <Slider
                        value={[optimization.settings.frequencyOptimal]}
                        onValueChange={([value]) => updatePlatformSetting(selectedPlatform, 'frequencyOptimal', value)}
                        max={21}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Best Posting Times
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['9:00 AM', '12:00 PM', '1:00 PM', '3:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map(time => (
                          <button
                            key={time}
                            onClick={() => {
                              const currentTimes = optimization.settings.bestPostTimes;
                              const newTimes = currentTimes.includes(time)
                                ? currentTimes.filter(t => t !== time)
                                : [...currentTimes, time];
                              updatePlatformSetting(selectedPlatform, 'bestPostTimes', newTimes);
                            }}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                              optimization.settings.bestPostTimes.includes(time)
                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="audience" className="space-y-4 mt-6">
                {platformOptimizations
                  .filter(opt => opt.platform === selectedPlatform)
                  .map(optimization => (
                  <div key={optimization.platform} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Target Audience Description
                      </label>
                      <textarea
                        value={optimization.settings.targetAudience}
                        onChange={(e) => updatePlatformSetting(selectedPlatform, 'targetAudience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 min-h-20"
                        placeholder="Describe your target audience..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Age Range: {optimization.settings.ageRange[0]} - {optimization.settings.ageRange[1]} years
                      </label>
                      <div className="px-3">
                        <Slider
                          value={optimization.settings.ageRange}
                          onValueChange={(value) => updatePlatformSetting(selectedPlatform, 'ageRange', value)}
                          max={80}
                          min={13}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Interest Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {optimization.settings.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer">
                            {interest}
                            <button
                              onClick={() => {
                                const newInterests = optimization.settings.interests.filter((_, i) => i !== index);
                                updatePlatformSetting(selectedPlatform, 'interests', newInterests);
                              }}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        <button
                          onClick={() => {
                            const newInterest = prompt('Add interest category:');
                            if (newInterest) {
                              updatePlatformSetting(selectedPlatform, 'interests', [...optimization.settings.interests, newInterest]);
                            }
                          }}
                          className="px-2 py-1 text-xs border border-dashed border-gray-300 rounded-md hover:border-gray-400"
                        >
                          + Add Interest
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}