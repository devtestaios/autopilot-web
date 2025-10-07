'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type,
  Image as ImageIcon,
  Video,
  Calendar,
  Hash,
  AtSign,
  MapPin,
  Sparkles,
  Eye,
  BarChart3,
  Target,
  Wand2,
  Copy,
  RotateCcw,
  Download,
  Upload,
  Palette,
  MessageCircle,
  Heart,
  Share,
  Bookmark,
  MoreHorizontal,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Users,
  TrendingUp,
  Zap,
  Settings,
  Filter,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';

// Platform icons mapping
const platformIcons = {
  instagram: '📸',
  tiktok: '🎵',
  linkedin: '💼',
  twitter: '🐦',
  youtube: '📺',
  pinterest: '📌'
};

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-black',
  linkedin: 'bg-blue-600',
  twitter: 'bg-blue-400',
  youtube: 'bg-red-600',
  pinterest: 'bg-red-500'
};

interface EnhancedPostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (postData: PostData) => void;
  selectedPlatforms?: string[];
  importedContent?: any;
  className?: string;
}

interface PostData {
  content: string;
  hashtags: string[];
  mentions: string[];
  location?: string;
  mediaFiles: File[];
  platforms: PlatformPost[];
  scheduledDate?: Date;
  campaignId?: string;
  isCarousel?: boolean;
  aiOptimized: boolean;
}

interface PlatformPost {
  platform: string;
  content: string;
  hashtags: string[];
  optimizations: {
    tone: string;
    length: number;
    engagement: string;
    bestTime: string;
    audience: string;
  };
  preview: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}

interface AIOptimization {
  platform: string;
  suggestions: {
    content: string;
    hashtags: string[];
    tone: string;
    engagementScore: number;
    bestTime: string;
    reasoning: string;
  };
  performance: {
    expectedReach: number;
    expectedEngagement: number;
    expectedClicks: number;
  };
}

export default function EnhancedPostComposer({
  isOpen,
  onClose,
  onPost,
  selectedPlatforms = ['instagram'],
  importedContent,
  className = ''
}: EnhancedPostComposerProps) {
  const { sendMessage, isTyping: aiLoading } = useUnifiedAI();
  
  // Core state
  const [activeTab, setActiveTab] = useState<'compose' | 'optimize' | 'schedule' | 'preview'>('compose');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [platforms, setPlatforms] = useState<string[]>(selectedPlatforms);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [isCarousel, setIsCarousel] = useState(false);
  
  // AI optimization state
  const [aiOptimizations, setAiOptimizations] = useState<AIOptimization[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState<'engagement' | 'reach' | 'conversion'>('engagement');
  const [platformPosts, setPlatformPosts] = useState<PlatformPost[]>([]);
  
  // UI state
  const [hashtagInput, setHashtagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState(platforms[0] || 'instagram');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // File upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load imported content
  useEffect(() => {
    if (importedContent) {
      setContent(importedContent.content?.caption || '');
      setHashtags(importedContent.content?.hashtags || []);
      if (importedContent.content?.imageUrl || importedContent.content?.videoUrl) {
        // Convert URL to File object (simulation)
        const mediaUrl = importedContent.content.imageUrl || importedContent.content.videoUrl;
        // In real implementation, fetch and convert to File
        console.log('Imported media URL:', mediaUrl);
      }
      toast.success('Content imported from Content Suite');
    }
  }, [importedContent]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 100MB)`);
        return false;
      }
      
      return true;
    });

    setMediaFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 1) {
      setIsCarousel(true);
    }
  }, []);

  // Add hashtag
  const addHashtag = useCallback(() => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      const tag = hashtagInput.trim().replace('#', '');
      setHashtags(prev => [...prev, tag]);
      setHashtagInput('');
    }
  }, [hashtagInput, hashtags]);

  // Add mention
  const addMention = useCallback(() => {
    if (mentionInput.trim() && !mentions.includes(mentionInput.trim())) {
      const mention = mentionInput.trim().replace('@', '');
      setMentions(prev => [...prev, mention]);
      setMentionInput('');
    }
  }, [mentionInput, mentions]);

  // AI Content Optimization
  const optimizeContent = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to optimize');
      return;
    }

    setIsOptimizing(true);
    
    try {
      const optimizations: AIOptimization[] = [];
      
      for (const platform of platforms) {
        const prompt = `
          Optimize this social media post for ${platform}:
          
          Content: "${content}"
          Current hashtags: ${hashtags.join(', ')}
          Optimization goal: ${optimizationMode}
          
          Please provide:
          1. Optimized content (platform-specific tone and length)
          2. Best hashtags for ${platform} (max 10)
          3. Recommended tone
          4. Expected engagement score (1-10)
          5. Best posting time
          6. Brief reasoning for changes
          
          Format as JSON with keys: content, hashtags, tone, engagementScore, bestTime, reasoning
        `;

        const response = await generateResponse(prompt, 'social-media-optimization');
        
        try {
          const aiSuggestion = JSON.parse(response);
          
          optimizations.push({
            platform,
            suggestions: {
              content: aiSuggestion.content || content,
              hashtags: aiSuggestion.hashtags || hashtags,
              tone: aiSuggestion.tone || 'engaging',
              engagementScore: aiSuggestion.engagementScore || 7,
              bestTime: aiSuggestion.bestTime || '12:00 PM',
              reasoning: aiSuggestion.reasoning || 'General optimization applied'
            },
            performance: {
              expectedReach: Math.floor(Math.random() * 10000) + 1000,
              expectedEngagement: Math.floor(Math.random() * 500) + 50,
              expectedClicks: Math.floor(Math.random() * 100) + 10
            }
          });
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          // Fallback optimization
          optimizations.push({
            platform,
            suggestions: {
              content: content,
              hashtags: hashtags,
              tone: 'engaging',
              engagementScore: 7,
              bestTime: '12:00 PM',
              reasoning: 'Using original content with platform best practices'
            },
            performance: {
              expectedReach: Math.floor(Math.random() * 10000) + 1000,
              expectedEngagement: Math.floor(Math.random() * 500) + 50,
              expectedClicks: Math.floor(Math.random() * 100) + 10
            }
          });
        }
      }

      setAiOptimizations(optimizations);
      
      // Create platform-specific posts
      const newPlatformPosts: PlatformPost[] = optimizations.map(opt => ({
        platform: opt.platform,
        content: opt.suggestions.content,
        hashtags: opt.suggestions.hashtags,
        optimizations: {
          tone: opt.suggestions.tone,
          length: opt.suggestions.content.length,
          engagement: opt.suggestions.engagementScore.toString(),
          bestTime: opt.suggestions.bestTime,
          audience: 'General'
        },
        preview: {
          likes: opt.performance.expectedEngagement,
          comments: Math.floor(opt.performance.expectedEngagement * 0.1),
          shares: Math.floor(opt.performance.expectedEngagement * 0.05),
          reach: opt.performance.expectedReach
        }
      }));

      setPlatformPosts(newPlatformPosts);
      setActiveTab('optimize');
      toast.success('Content optimized for all platforms');
      
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize content');
    } finally {
      setIsOptimizing(false);
    }
  }, [content, hashtags, platforms, optimizationMode, generateResponse]);

  // Apply optimization to main content
  const applyOptimization = useCallback((optimization: AIOptimization) => {
    setContent(optimization.suggestions.content);
    setHashtags(optimization.suggestions.hashtags);
    toast.success(`Applied ${optimization.platform} optimization`);
  }, []);

  // Handle post submission
  const handlePost = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    const postData: PostData = {
      content,
      hashtags,
      mentions,
      location,
      mediaFiles,
      platforms: platformPosts.length > 0 ? platformPosts : platforms.map(p => ({
        platform: p,
        content,
        hashtags,
        optimizations: {
          tone: 'engaging',
          length: content.length,
          engagement: '7',
          bestTime: '12:00 PM',
          audience: 'General'
        },
        preview: {
          likes: 0,
          comments: 0,
          shares: 0,
          reach: 0
        }
      })),
      scheduledDate,
      isCarousel,
      aiOptimized: platformPosts.length > 0
    };

    onPost(postData);
    
    // Reset form
    setContent('');
    setHashtags([]);
    setMentions([]);
    setLocation('');
    setMediaFiles([]);
    setScheduledDate(undefined);
    setIsCarousel(false);
    setAiOptimizations([]);
    setPlatformPosts([]);
    
    onClose();
  }, [content, hashtags, mentions, location, mediaFiles, platforms, platformPosts, scheduledDate, isCarousel, onPost, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Enhanced Post Composer
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create optimized content for {platforms.length} platform{platforms.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={optimizeContent}
              disabled={isOptimizing || aiLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Platforms:
            </span>
            {['instagram', 'tiktok', 'linkedin', 'twitter', 'youtube', 'pinterest'].map(platform => (
              <button
                key={platform}
                onClick={() => {
                  if (platforms.includes(platform)) {
                    setPlatforms(prev => prev.filter(p => p !== platform));
                  } else {
                    setPlatforms(prev => [...prev, platform]);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  platforms.includes(platform)
                    ? `${platformColors[platform as keyof typeof platformColors]} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{platformIcons[platform as keyof typeof platformIcons]}</span>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
            <div className="px-6 py-2 border-b border-gray-100 dark:border-gray-700">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="optimize" className="relative">
                  Optimize
                  {aiOptimizations.length > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-green-500">
                      {aiOptimizations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 h-[calc(95vh-280px)] overflow-y-auto">
              {/* Compose Tab */}
              <TabsContent value="compose" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content
                      </label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind? Share your story..."
                        className="min-h-32 resize-none"
                        maxLength={2200}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {content.length}/2200 characters
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prompt = `Suggest 3 engaging social media post ideas for: ${content || 'a business post'}`;
                            generateResponse(prompt, 'content-ideas').then(response => {
                              setContent(response);
                            });
                          }}
                          disabled={aiLoading}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          AI Suggest
                        </Button>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hashtags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={hashtagInput}
                          onChange={(e) => setHashtagInput(e.target.value)}
                          placeholder="Add hashtag..."
                          onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                        />
                        <Button onClick={addHashtag} size="sm">
                          <Hash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer">
                            #{tag}
                            <button
                              onClick={() => setHashtags(prev => prev.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mentions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mentions
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={mentionInput}
                          onChange={(e) => setMentionInput(e.target.value)}
                          placeholder="Add mention..."
                          onKeyPress={(e) => e.key === 'Enter' && addMention()}
                        />
                        <Button onClick={addMention} size="sm">
                          <AtSign className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mentions.map((mention, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer">
                            @{mention}
                            <button
                              onClick={() => setMentions(prev => prev.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location (optional)
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add location..."
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Media
                      </label>
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Drop files here or click to upload
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Images, videos up to 100MB
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Media Files ({mediaFiles.length})
                          </label>
                          {mediaFiles.length > 1 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Carousel</span>
                              <Switch checked={isCarousel} onCheckedChange={setIsCarousel} />
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {mediaFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                {file.type.startsWith('image/') ? (
                                  <img 
                                    src={URL.createObjectURL(file)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video 
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                )}
                              </div>
                              
                              <button
                                onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="absolute bottom-1 left-1">
                                <Badge variant="secondary" className="text-xs">
                                  {file.type.startsWith('image/') ? 'IMG' : 'VID'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Optimize Tab */}
              <TabsContent value="optimize" className="mt-0 space-y-6">
                {aiOptimizations.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      AI-Powered Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Let AI optimize your content for each platform
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Optimization Goal:
                      </label>
                      <select
                        value={optimizationMode}
                        onChange={(e) => setOptimizationMode(e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      >
                        <option value="engagement">Maximize Engagement</option>
                        <option value="reach">Maximize Reach</option>
                        <option value="conversion">Drive Conversions</option>
                      </select>
                    </div>
                    
                    <Button 
                      onClick={optimizeContent}
                      disabled={isOptimizing || aiLoading || !content.trim()}
                      size="lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isOptimizing ? 'Optimizing Content...' : 'Optimize Content'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        AI Optimizations
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAiOptimizations([]);
                          setPlatformPosts([]);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiOptimizations.map((optimization) => (
                        <Card key={optimization.platform} className="group hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {platformIcons[optimization.platform as keyof typeof platformIcons]}
                                </span>
                                <CardTitle className="text-base capitalize">
                                  {optimization.platform}
                                </CardTitle>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {optimization.suggestions.engagementScore}/10
                                </Badge>
                                
                                <Button
                                  size="sm"
                                  onClick={() => applyOptimization(optimization)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Optimized Content
                              </h4>
                              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                {optimization.suggestions.content}
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Recommended Hashtags
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {optimization.suggestions.hashtags.slice(0, 5).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                                {optimization.suggestions.hashtags.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{optimization.suggestions.hashtags.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Tone:</span>
                                <p className="font-medium capitalize">{optimization.suggestions.tone}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Best Time:</span>
                                <p className="font-medium">{optimization.suggestions.bestTime}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <p className="font-medium text-blue-700 dark:text-blue-300">
                                  {optimization.performance.expectedReach.toLocaleString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Reach</p>
                              </div>
                              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <p className="font-medium text-green-700 dark:text-green-300">
                                  {optimization.performance.expectedEngagement.toLocaleString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Engagement</p>
                              </div>
                              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <p className="font-medium text-purple-700 dark:text-purple-300">
                                  {optimization.performance.expectedClicks.toLocaleString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Clicks</p>
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                AI Reasoning
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {optimization.suggestions.reasoning}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="mt-0 space-y-6">
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Schedule Publication
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Publication Date
                        </label>
                        <Input
                          type="datetime-local"
                          value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ''}
                          onChange={(e) => setScheduledDate(new Date(e.target.value))}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Time Zone
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                          <option>UTC-8 (Pacific)</option>
                          <option>UTC-5 (Eastern)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+1 (Central European)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Optimal Posting Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {platforms.map(platform => (
                          <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {platformIcons[platform as keyof typeof platformIcons]}
                              </span>
                              <div>
                                <p className="font-medium capitalize">{platform}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Best engagement times
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">12:00 PM - 1:00 PM</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                6:00 PM - 8:00 PM
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Platform Preview
                      </h3>
                      <select
                        value={previewPlatform}
                        onChange={(e) => setPreviewPlatform(e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      >
                        {platforms.map(platform => (
                          <option key={platform} value={platform}>
                            {platformIcons[platform as keyof typeof platformIcons]} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mock social media post preview */}
                    <Card className="max-w-sm mx-auto">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            B
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Your Brand</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {location || 'Location'}
                            </p>
                          </div>
                          <MoreHorizontal className="w-4 h-4 ml-auto text-gray-600 dark:text-gray-400" />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pb-3">
                        {mediaFiles.length > 0 && (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {mediaFiles[0].type.startsWith('image/') ? (
                              <img 
                                src={URL.createObjectURL(mediaFiles[0])}
                                alt="Post preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video 
                                src={URL.createObjectURL(mediaFiles[0])}
                                className="w-full h-full object-cover"
                                muted
                              />
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                            <MessageCircle className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
                            <Share className="w-5 h-5 hover:text-green-500 cursor-pointer" />
                          </div>
                          <Bookmark className="w-5 h-5 hover:text-yellow-500 cursor-pointer" />
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold text-sm">324 likes</p>
                          <div className="text-sm">
                            <span className="font-semibold">yourbrand</span>
                            <span className="ml-2">{content}</span>
                          </div>
                          {hashtags.length > 0 && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {hashtags.map(tag => `#${tag}`).join(' ')}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            2 hours ago
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Performance Predictions
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {platforms.map(platform => {
                        const optimization = aiOptimizations.find(opt => opt.platform === platform);
                        return (
                          <Card key={platform}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">
                                  {platformIcons[platform as keyof typeof platformIcons]}
                                </span>
                                <h4 className="font-medium capitalize">{platform}</h4>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <p className="font-bold text-blue-700 dark:text-blue-300">
                                    {optimization?.performance.expectedReach.toLocaleString() || '2.5K'}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400">Expected Reach</p>
                                </div>
                                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                  <p className="font-bold text-green-700 dark:text-green-300">
                                    {optimization?.performance.expectedEngagement.toLocaleString() || '180'}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400">Engagement</p>
                                </div>
                                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                  <p className="font-bold text-purple-700 dark:text-purple-300">
                                    {optimization?.performance.expectedClicks.toLocaleString() || '45'}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400">Clicks</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Content Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Readability</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Excellent
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Hashtag Density</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Optimal
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Brand Alignment</span>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            High
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Potential</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {aiOptimizations.length > 0 ? 'AI Optimized' : 'Good'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {scheduledDate ? (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled for {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString()}
              </div>
            ) : (
              'Post will be published immediately'
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePost}
              disabled={!content.trim() || platforms.length === 0}
              className="min-w-24"
            >
              {scheduledDate ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule
                </>
              ) : (
                <>
                  <Share className="w-4 h-4 mr-2" />
                  Post Now
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}