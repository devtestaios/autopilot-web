'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Image, 
  Calendar, 
  Send, 
  Save, 
  Wand2,
  Hash,
  AtSign,
  Link2,
  Zap
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';

interface PlatformConfig {
  id: string;
  name: string;
  enabled: boolean;
  maxLength: number;
  color: string;
}

export default function SocialComposer() {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    { id: 'twitter', name: 'Twitter', enabled: true, maxLength: 280, color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', enabled: true, maxLength: 3000, color: 'bg-blue-600' },
    { id: 'facebook', name: 'Facebook', enabled: false, maxLength: 63206, color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', enabled: false, maxLength: 2200, color: 'bg-pink-600' }
  ]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [useAI, setUseAI] = useState(false);

  const togglePlatform = (platformId: string) => {
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const generateAIContent = async () => {
    // Mock AI content generation
    const aiSuggestions = [
      "🚀 Exciting news! Our latest AI-powered marketing features are now live. See how automation can transform your campaigns. #MarketingAI #PulseBridge",
      "📊 Did you know? Businesses using AI-driven marketing see 37% higher conversion rates. Ready to optimize your strategy? #MarketingTech #AI",
      "💡 Pro tip: The best time to post on LinkedIn is Tuesday-Thursday, 8-10 AM. When do you get the most engagement? #SocialMediaTips #Marketing"
    ];
    
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setContent(randomSuggestion);
  };

  const enabledPlatforms = platforms.filter(p => p.enabled);
  const shortestLimit = Math.min(...enabledPlatforms.map(p => p.maxLength));
  const isOverLimit = content.length > shortestLimit;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Edit3 className="w-8 h-8 mr-3 text-blue-600" />
                Post Composer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create and schedule content across multiple platforms
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Composer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Compose Post</span>
                  <div className="flex items-center justify-between">
                    <span>AI Assist</span>
                    <input 
                      type="checkbox" 
                      checked={useAI} 
                      onChange={(e) => setUseAI(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </CardTitle>
                <CardDescription>
                  Write your content and we'll optimize it for each platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Generation */}
                {useAI && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Wand2 className="w-4 h-4 mr-2 text-purple-600" />
                        AI Content Generator
                      </h4>
                      <Button onClick={generateAIContent} size="sm" variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let AI suggest engaging content based on your industry and audience
                    </p>
                  </div>
                )}

                {/* Content Input */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <textarea
                    id="content"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[120px] p-3 border rounded-lg resize-none bg-background"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`${
                      isOverLimit ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {content.length} / {shortestLimit} characters
                      {isOverLimit && ' (exceeds shortest limit)'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Hash className="w-3 h-3 mr-1" />
                        Hashtags
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AtSign className="w-3 h-3 mr-1" />
                        Mention
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Media</label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8">
                    <div className="text-center">
                      <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Drag and drop images or videos
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="border-t pt-4 mt-4" />
                <div className="space-y-4">
                  <label className="text-base font-medium">Schedule</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium">Date</label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="time" className="text-sm font-medium">Time</label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="immediate" className="rounded" />
                    <label htmlFor="immediate" className="text-sm font-normal">
                      Post immediately
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-4" />
                <div className="flex items-center justify-between">
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Preview
                    </Button>
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      {scheduledDate ? 'Schedule Post' : 'Post Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Selection & Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Platforms</CardTitle>
                <CardDescription>
                  Choose where to publish your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={platform.enabled}
                      onChange={() => togglePlatform(platform.id)}
                      className="rounded"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Character Limits</CardTitle>
                <CardDescription>
                  Stay within platform requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enabledPlatforms.map((platform) => {
                  const percentage = Math.min((content.length / platform.maxLength) * 100, 100);
                  const isOver = content.length > platform.maxLength;
                  
                  return (
                    <div key={platform.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {platform.name}
                        </span>
                        <span className={`text-xs ${
                          isOver ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {content.length}/{platform.maxLength}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            isOver ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Content Preview */}
            {content && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    How your post will appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        P
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">PulseBridge AI</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                          {content || 'Your content will appear here...'}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-gray-500 text-xs">
                          <span>Like</span>
                          <span>Comment</span>
                          <span>Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}