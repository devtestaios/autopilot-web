'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  Type, 
  Video, 
  Hash, 
  Target, 
  Zap,
  Brain,
  Upload,
  Download,
  Copy,
  Save,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Settings,
  Palette,
  Users,
  TrendingUp,
  Calendar,
  Globe,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// Types
export type ContentType = 'post' | 'caption' | 'hashtags' | 'image' | 'video' | 'story' | 'carousel';
export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'youtube' | 'pinterest';
export type Tone = 'professional' | 'casual' | 'funny' | 'inspiring' | 'educational' | 'promotional';
export type Industry = 'business' | 'fitness' | 'food' | 'travel' | 'tech' | 'fashion' | 'health' | 'education';

export interface GeneratedContent {
  id: string;
  type: ContentType;
  platform: Platform;
  title?: string;
  content: string;
  hashtags?: string[];
  imagePrompt?: string;
  videoPrompt?: string;
  metadata: {
    tone: Tone;
    industry: Industry;
    wordCount: number;
    readingTime: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    engagementScore: number;
  };
  variations: string[];
  createdAt: Date;
}

export interface AIContentGeneratorProps {
  onContentGenerated: (content: GeneratedContent) => void;
  onSaveContent: (content: GeneratedContent) => void;
  className?: string;
}

// Content Type Templates
const contentTemplates = {
  post: {
    prompts: [
      "Create an engaging social media post about {{topic}}",
      "Write a compelling post that drives engagement on {{topic}}",
      "Generate a creative post for {{platform}} about {{topic}}"
    ],
    maxLength: 2200,
    includeHashtags: true
  },
  caption: {
    prompts: [
      "Write a captivating caption for {{topic}}",
      "Create an Instagram caption that tells a story about {{topic}}",
      "Generate a caption that encourages comments about {{topic}}"
    ],
    maxLength: 2200,
    includeHashtags: true
  },
  hashtags: {
    prompts: [
      "Generate relevant hashtags for {{topic}} on {{platform}}",
      "Create a mix of popular and niche hashtags for {{topic}}",
      "Suggest trending hashtags for {{topic}} content"
    ],
    maxLength: 500,
    includeHashtags: false
  },
  image: {
    prompts: [
      "Create a detailed image prompt for {{topic}}",
      "Generate a visual description for {{topic}} content",
      "Design an image prompt that captures {{topic}}"
    ],
    maxLength: 1000,
    includeHashtags: false
  },
  story: {
    prompts: [
      "Create engaging story content about {{topic}}",
      "Write interactive story content for {{topic}}",
      "Generate story slides about {{topic}}"
    ],
    maxLength: 500,
    includeHashtags: true
  }
};

// Industry Keywords
const industryKeywords = {
  business: ['entrepreneur', 'growth', 'strategy', 'success', 'leadership', 'innovation'],
  fitness: ['workout', 'health', 'nutrition', 'strength', 'wellness', 'training'],
  food: ['recipe', 'cooking', 'delicious', 'nutrition', 'cuisine', 'ingredients'],
  travel: ['adventure', 'explore', 'destination', 'journey', 'culture', 'wanderlust'],
  tech: ['innovation', 'digital', 'technology', 'future', 'AI', 'development'],
  fashion: ['style', 'trends', 'outfit', 'designer', 'fashion', 'accessories'],
  health: ['wellness', 'medical', 'healthcare', 'prevention', 'treatment', 'lifestyle'],
  education: ['learning', 'knowledge', 'skills', 'education', 'teaching', 'development']
};

// Generation Progress Component
function GenerationProgress({ 
  isGenerating, 
  progress, 
  currentStep 
}: {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
}) {
  if (!isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        <div>
          <h4 className="font-medium">Generating Content...</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{currentStep}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
    </motion.div>
  );
}

// Content Preview Component
function ContentPreview({ 
  content, 
  onSave, 
  onRegenerate, 
  onCopy 
}: {
  content: GeneratedContent;
  onSave: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
}) {
  const [selectedVariation, setSelectedVariation] = useState(0);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Generated Content
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)} for {content.platform}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Main Content */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {content.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Suggested Hashtags</h4>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Variations */}
        {content.variations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Alternative Versions</h4>
            <div className="space-y-2">
              {content.variations.map((variation, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedVariation === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVariation(index)}
                >
                  <p className="text-sm">{variation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium mb-3">Content Analysis</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{content.metadata.wordCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{content.metadata.readingTime}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Read Time</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getSentimentColor(content.metadata.sentiment)}`}>
                {content.metadata.sentiment.charAt(0).toUpperCase() + content.metadata.sentiment.slice(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Sentiment</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getEngagementColor(content.metadata.engagementScore)}`}>
                {content.metadata.engagementScore}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main AI Content Generator Component
export default function AIContentGenerator({ 
  onContentGenerated, 
  onSaveContent, 
  className = '' 
}: AIContentGeneratorProps) {
  const [contentType, setContentType] = useState<ContentType>('post');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [industry, setIndustry] = useState<Industry>('business');
  const [tone, setTone] = useState<Tone>('professional');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [creativity, setCreativity] = useState([70]);
  const [length, setLength] = useState([50]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  // Mock AI content generation
  const generateContent = useCallback(async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedContent(null);

    const steps = [
      'Analyzing topic and context...',
      'Applying tone and style preferences...',
      'Generating primary content...',
      'Creating variations...',
      'Analyzing content quality...',
      'Finalizing content...'
    ];

    // Simulate AI generation process
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setGenerationProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate mock content
    const mockContent: GeneratedContent = {
      id: `content-${Date.now()}`,
      type: contentType,
      platform,
      title: contentType === 'post' ? `Engaging ${platform} post about ${topic}` : undefined,
      content: `🚀 Ready to transform your ${topic} game? Here's what industry leaders don't want you to know...

${topic} isn't just a trend - it's the future of ${industry}. When done right, it can:

✅ Boost your engagement by 300%
✅ Build authentic connections with your audience  
✅ Drive real business results

The secret? It's all about understanding your audience and delivering value consistently.

What's your biggest challenge with ${topic}? Drop a comment below and let's solve it together! 👇

#${topic.replace(/\s+/g, '')} #${industry} #Success #Growth #Entrepreneur`,
      hashtags: [
        topic.replace(/\s+/g, '').toLowerCase(),
        industry,
        'success',
        'growth',
        'entrepreneur',
        'business',
        'motivation',
        'inspiration',
        'tips',
        'strategy'
      ],
      metadata: {
        tone,
        industry,
        wordCount: 142,
        readingTime: '30 sec',
        sentiment: 'positive',
        engagementScore: Math.floor(Math.random() * 30) + 70
      },
      variations: [
        `🎯 The ${topic} strategy that's changing everything...

Most people get ${topic} wrong. They focus on tactics instead of strategy.

Here's what actually works:
→ Start with your why
→ Know your audience deeply  
→ Create consistent value
→ Measure what matters

Ready to level up? Comment "YES" for my free ${topic} guide! 📈`,
        
        `💡 Quick ${topic} tip that took me from zero to hero:

Stop trying to be perfect. Start being consistent.

Your audience doesn't need perfection - they need authenticity. Share your journey, your struggles, your wins.

That's how you build real connections.

What's one lesson ${topic} taught you? Share below! ⬇️`
      ],
      createdAt: new Date()
    };

    setGeneratedContent(mockContent);
    setIsGenerating(false);
    onContentGenerated(mockContent);
  }, [topic, contentType, platform, industry, tone, onContentGenerated]);

  const handleSaveContent = useCallback(() => {
    if (generatedContent) {
      onSaveContent(generatedContent);
    }
  }, [generatedContent, onSaveContent]);

  const handleCopyContent = useCallback(() => {
    if (generatedContent) {
      const textToCopy = `${generatedContent.content}\n\n${generatedContent.hashtags?.map(tag => `#${tag}`).join(' ') || ''}`;
      navigator.clipboard.writeText(textToCopy);
    }
  }, [generatedContent]);

  const handleRegenerateContent = useCallback(() => {
    generateContent();
  }, [generateContent]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-purple-500" />
          AI Content Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create engaging content with the power of AI in seconds
        </p>
      </div>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Content Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Type & Platform */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="post">Social Media Post</option>
                <option value="caption">Image Caption</option>
                <option value="hashtags">Hashtag Research</option>
                <option value="story">Story Content</option>
                <option value="image">Image Prompt</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="pinterest">Pinterest</option>
              </select>
            </div>
          </div>

          {/* Industry & Tone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as Industry)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="business">Business</option>
                <option value="fitness">Fitness</option>
                <option value="food">Food & Cooking</option>
                <option value="travel">Travel</option>
                <option value="tech">Technology</option>
                <option value="fashion">Fashion</option>
                <option value="health">Health & Wellness</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="funny">Funny</option>
                <option value="inspiring">Inspiring</option>
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm font-medium block mb-2">Topic or Subject</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Digital marketing strategies, Healthy meal prep, Travel photography..."
              className="w-full"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="text-sm font-medium block mb-2">Keywords (optional)</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., SEO, social media, engagement, growth..."
              className="w-full"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-gray-500">Suggested for {industry}:</span>
              {industryKeywords[industry].map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setKeywords(keywords ? `${keywords}, ${keyword}` : keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Creativity Level: {creativity[0]}%
              </label>
              <Slider
                value={creativity}
                onValueChange={setCreativity}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Content Length: {length[0]}%
              </label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Short</span>
                <span>Medium</span>
                <span>Long</span>
              </div>
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium block mb-2">Custom Instructions (optional)</label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add any specific instructions for the AI..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={!topic.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      <GenerationProgress
        isGenerating={isGenerating}
        progress={generationProgress}
        currentStep={currentStep}
      />

      {/* Generated Content */}
      {generatedContent && (
        <ContentPreview
          content={generatedContent}
          onSave={handleSaveContent}
          onRegenerate={handleRegenerateContent}
          onCopy={handleCopyContent}
        />
      )}
    </div>
  );
}