/**
 * AI-Powered Social Media Composer
 * Advanced content creation with multi-platform optimization and AI assistance
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wand2, 
  Image, 
  Calendar, 
  Hash, 
  AtSign, 
  MapPin, 
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Zap,
  BarChart3,
  MessageSquare,
  Heart,
  Share2,
  Send
} from 'lucide-react';
import { useSocialMediaService, AIContentSuggestion, OptimalPostingTime } from '@/services/socialMediaService';
import { SocialMediaAccount, SocialMediaPostInput } from '@/types';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  maxLength: number;
  selected: boolean;
  disabled?: boolean;
}

interface AIPoweredComposerProps {
  accounts: SocialMediaAccount[];
  onPostCreate: (post: SocialMediaPostInput) => Promise<void>;
  onDraftSave: (draft: SocialMediaPostInput) => void;
}

export const AIPoweredComposer: React.FC<AIPoweredComposerProps> = ({
  accounts,
  onPostCreate,
  onDraftSave
}) => {
  const socialMediaService = useSocialMediaService();
  
  // State management
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-500', maxLength: 63206, selected: false },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500', maxLength: 2200, selected: false },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-gray-900', maxLength: 280, selected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600', maxLength: 3000, selected: false },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black', maxLength: 300, selected: false }
  ]);
  
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  
  // AI Features State
  const [aiSuggestions, setAiSuggestions] = useState<AIContentSuggestion[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalPostingTime[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [engagementPrediction, setEngagementPrediction] = useState<number | null>(null);
  
  // Form state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'humorous' | 'inspirational'>('casual');
  const [targetAudience, setTargetAudience] = useState('');

  // Update platform availability based on connected accounts
  useEffect(() => {
    setPlatforms(prev => prev.map(platform => {
      const connectedAccount = accounts.find(acc => 
        acc.platform.toLowerCase() === platform.id && acc.is_connected
      );
      return {
        ...platform,
        // Show availability status and account info
        name: connectedAccount 
          ? `${platform.name} (${connectedAccount.username || connectedAccount.display_name})`
          : `${platform.name} (Not Connected)`,
        // Only allow selection if connected
        disabled: !connectedAccount,
        selected: platform.selected && !!connectedAccount
      };
    }));
  }, [accounts]);

  // Platform selection
  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId && !p.disabled ? { ...p, selected: !p.selected } : p
    ));
  };

  // AI Content Generation
  const generateAIContent = useCallback(async () => {
    if (!topic) return;
    
    setIsGeneratingContent(true);
    try {
      const selectedPlatforms = platforms.filter(p => p.selected).map(p => p.id);
      if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
      }

      const suggestions = await socialMediaService.generateContentSuggestions({
        platform: selectedPlatforms[0], // Use first selected platform for generation
        topic,
        tone,
        target_audience: targetAudience,
        include_hashtags: true,
        content_length: 'medium'
      });

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  }, [topic, tone, targetAudience, platforms, socialMediaService]);

  // Apply AI suggestion
  const applySuggestion = (suggestion: AIContentSuggestion) => {
    setContent(suggestion.content);
    setHashtags(suggestion.hashtags);
    setMentions(suggestion.mentions);
    if (suggestion.optimal_time) {
      const optimalDate = new Date(suggestion.optimal_time);
      setScheduledDate(optimalDate.toISOString().slice(0, 16));
    }
    setEngagementPrediction(suggestion.engagement_prediction);
  };

  // Hashtag management
  const addHashtag = (tag: string) => {
    if (tag && !hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag.startsWith('#') ? tag : `#${tag}`]);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(h => h !== tag));
  };

  // Generate hashtag suggestions
  const generateHashtags = async () => {
    if (!content) return;
    
    try {
      const selectedPlatforms = platforms.filter(p => p.selected);
      if (selectedPlatforms.length === 0) return;

      const suggestions = await socialMediaService.generateHashtagSuggestions(
        content, 
        selectedPlatforms[0].id
      );
      
      // Add unique suggestions
      suggestions.forEach(tag => addHashtag(tag));
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  // Get optimal posting times
  useEffect(() => {
    const loadOptimalTimes = async () => {
      if (accounts.length === 0) return;
      
      try {
        const times = await socialMediaService.getOptimalPostingTimes(accounts[0].id);
        setOptimalTimes(times);
      } catch (error) {
        console.error('Error loading optimal times:', error);
      }
    };

    loadOptimalTimes();
  }, [accounts, socialMediaService]);

  // Analyze content engagement potential
  const analyzeContent = async () => {
    if (!content) return;
    
    setIsAnalyzing(true);
    try {
      const selectedPlatforms = platforms.filter(p => p.selected);
      if (selectedPlatforms.length === 0) return;

      const analysis = await socialMediaService.optimizeContentForPlatform(
        content, 
        selectedPlatforms[0].id
      );
      
      setEngagementPrediction(analysis.engagement_prediction);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle post submission
  const handleSubmit = async (isDraft = false) => {
    const selectedPlatforms = platforms.filter(p => p.selected);
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    const postData: SocialMediaPostInput = {
      content,
      target_accounts: selectedPlatforms.map(p => 
        accounts.find(acc => acc.platform === p.id)?.id || ''
      ).filter(Boolean),
      hashtags,
      mentions,
      scheduled_date: scheduledDate || undefined,
      post_type: mediaFiles.length > 0 ? 'image' : 'text',
      approval_status: isDraft ? 'pending' : 'approved'
    };

    try {
      if (isDraft) {
        onDraftSave(postData);
      } else {
        await onPostCreate(postData);
        // Reset form
        setContent('');
        setHashtags([]);
        setMentions([]);
        setScheduledDate('');
        setLocation('');
        setMediaFiles([]);
        setPlatforms(prev => prev.map(p => ({ ...p, selected: false })));
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  // Character count for selected platforms
  const getCharacterCount = () => {
    const selectedPlatforms = platforms.filter(p => p.selected);
    if (selectedPlatforms.length === 0) return null;
    
    const minLength = Math.min(...selectedPlatforms.map(p => p.maxLength));
    const currentLength = content.length;
    
    return {
      current: currentLength,
      max: minLength,
      isOverLimit: currentLength > minLength
    };
  };

  const charCount = getCharacterCount();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI-Powered Social Media Composer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AI Content Generation Panel */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Content Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <Input
                  placeholder="e.g., product launch, tips, motivation"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tone</label>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Target Audience</label>
                <Input
                  placeholder="e.g., young professionals, parents"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={generateAIContent} 
              disabled={isGeneratingContent || !topic}
              className="w-full"
            >
              {isGeneratingContent ? (
                <>
                  <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Content
                </>
              )}
            </Button>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">AI Suggestions:</h4>
                {aiSuggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="cursor-pointer" onClick={() => applySuggestion(suggestion)}>
                    <Card className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <p className="text-sm mb-2">{suggestion.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {Math.round(suggestion.engagement_prediction * 100)}% engagement
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {suggestion.hashtags.length} hashtags
                        </Badge>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Select Platforms
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                variant={platform.selected ? "default" : "outline"}
                onClick={() => togglePlatform(platform.id)}
                disabled={platform.disabled}
                className={`flex items-center gap-2 ${
                  platform.selected 
                    ? platform.color 
                    : platform.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                }`}
              >
                <span>{platform.icon}</span>
                <span className="text-xs truncate">{platform.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Content</label>
            {charCount && (
              <span className={`text-sm ${charCount.isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount.current}/{charCount.max}
              </span>
            )}
          </div>
          <Textarea
            placeholder="Write your social media post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className={charCount?.isOverLimit ? 'border-red-500' : ''}
          />
          
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={generateHashtags}>
              <Hash className="h-4 w-4 mr-1" />
              Generate Hashtags
            </Button>
            <Button size="sm" variant="outline" onClick={analyzeContent} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <BarChart3 className="h-4 w-4 mr-1 animate-pulse" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-1" />
              )}
              Analyze Engagement
            </Button>
          </div>

          {engagementPrediction !== null && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Predicted engagement: {Math.round(engagementPrediction * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="font-medium mb-2 block flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Upload
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setMediaFiles(prev => [...prev, ...files]);
              }}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Upload images or videos</p>
                  <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
                </div>
              </div>
            </label>
          </div>
          
          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-1">
                            📹
                          </div>
                          <p className="text-xs font-medium truncate">{file.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div>
          <label className="font-medium mb-2 block flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Hashtags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add hashtags..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addHashtag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium mb-2 block flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Post
            </label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="font-medium mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location (Optional)
            </label>
            <Input
              placeholder="Add location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Optimal Times */}
        {optimalTimes.length > 0 && (
          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Optimal Posting Times
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {optimalTimes.slice(0, 4).map((time, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const now = new Date();
                    const optimalDate = new Date(now);
                    optimalDate.setHours(time.hour, 0, 0, 0);
                    if (optimalDate < now) {
                      optimalDate.setDate(optimalDate.getDate() + 1);
                    }
                    setScheduledDate(optimalDate.toISOString().slice(0, 16));
                  }}
                  className="text-xs"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {time.day_of_week} {time.hour}:00
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={() => handleSubmit(true)} variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          
          <Button 
            onClick={() => handleSubmit(false)} 
            className="flex-1"
            disabled={!content.trim() || platforms.filter(p => p.selected).length === 0}
          >
            {scheduledDate ? (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publish Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};