'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationTabs from '@/components/NavigationTabs';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

// AI Agent Integration for Content Suite
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { 
  Sparkles, 
  Calendar, 
  FolderOpen, 
  PenTool, 
  Image, 
  Video, 
  FileText, 
  Users, 
  BarChart3,
  Upload,
  Download,
  Edit3,
  Settings,
  Play,
  Pause,
  Plus,
  Search,
  Grid3X3,
  Layers,
  Palette,
  Type,
  Target,
  Hash,
  Clock,
  Share2,
  Eye,
  Copy,
  Trash2,
  MoreVertical,
  ChevronDown,
  Filter,
  Zap,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Mail
} from 'lucide-react';

// Import Claude AI integration
import { chatWithAI } from '@/lib/ai-api';

// Dynamic imports for Content Suite components
const FeedGridPlanner = dynamic(() => import('@/components/content-suite/FeedGridPlanner').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const AssetManager = dynamic(() => import('@/components/content-suite/AssetManager'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const AdvancedDesignStudio = dynamic(() => import('@/components/content-suite/AdvancedDesignStudio'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-center">
      <PenTool className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-pulse" />
      <p className="text-gray-500">Loading Professional Design Studio...</p>
    </div>
  </div>
});

const AIContentGenerator = dynamic(() => import('@/components/content-suite/AIContentGenerator'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

// AI Agent Control Integration
const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

// Content Types Enum for extensibility
export enum ContentType {
  SOCIAL_POST = 'social-post',
  STORY = 'story',
  REEL = 'reel',
  VIDEO = 'video',
  EMAIL_TEMPLATE = 'email-template',
  BLOG_GRAPHIC = 'blog-graphic',
  PRINT_MATERIAL = 'print-material',
  CAROUSEL = 'carousel',
  ANIMATED_POST = 'animated-post'
}

// Platform Support Enum
export enum Platform {
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  PINTEREST = 'pinterest',
  FACEBOOK = 'facebook',
  YOUTUBE = 'youtube',
  EMAIL = 'email',
  BLOG = 'blog'
}

// Advanced Features Enum
export enum AdvancedFeature {
  AUTO_RESIZE = 'auto-resize',
  BRAND_COMPLIANCE = 'brand-compliance',
  BULK_EDIT = 'bulk-edit',
  VERSION_CONTROL = 'version-control',
  COLLABORATION = 'collaboration',
  A_B_TESTING = 'a-b-testing',
  PERFORMANCE_TRACKING = 'performance-tracking'
}

// SEO Features Enum
export enum SEOFeature {
  SCHEMA_MARKUP = 'schema-markup',
  ALT_TEXT_GENERATION = 'alt-text-generation',
  META_OPTIMIZATION = 'meta-optimization',
  KEYWORD_SUGGESTIONS = 'keyword-suggestions',
  CONTENT_OPTIMIZATION = 'content-optimization',
  LOCAL_SEO = 'local-seo'
}

interface ContentAsset {
  id: string;
  name: string;
  type: ContentType;
  platforms: Platform[];
  url?: string;
  thumbnail?: string;
  dimensions?: { width: number; height: number };
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
  brandCompliant?: boolean;
  seoOptimized?: boolean;
}

interface FeedPost {
  id: string;
  position: { row: number; col: number };
  asset: ContentAsset;
  scheduledDate?: Date;
  caption?: string;
  hashtags?: string[];
  platform: Platform;
  status: 'draft' | 'scheduled' | 'published';
}

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  altText?: string;
  schemaMarkup?: Record<string, any>;
  optimizationScore?: number;
  suggestions?: string[];
}

export default function ContentCreationSuite() {
  const [activeTab, setActiveTab] = useState('feed-planner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(ContentType.SOCIAL_POST);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.INSTAGRAM]);

  // AI Agent Integration for Content Suite
  const { 
    executeAIAction, 
    autonomousMode, 
    generatePageInsights,
    addInsight,
    showNotification 
  } = useUnifiedAI();

  // AI-powered content automation capabilities
  useEffect(() => {
    // Generate AI insights for content suite on load
    generatePageInsights('content-suite', {
      contentType: selectedContentType,
      platforms: selectedPlatforms,
      activeWorkspace: activeTab
    }).then(insights => {
      insights.forEach(insight => addInsight(insight));
    });
  }, [activeTab, selectedContentType, selectedPlatforms, generatePageInsights, addInsight]);

  // AI Agent Actions for Content Suite
  const handleAIContentAutomation = async (action: string) => {
    try {
      await executeAIAction({
        type: 'analysis',
        function: action,
        arguments: {
          contentType: selectedContentType,
          platforms: selectedPlatforms,
          workspace: activeTab
        }
      });
    } catch (error) {
      showNotification('AI Action Failed', `Could not execute ${action}`, 'error');
    }
  };

  const tabConfig = [
    {
      id: 'feed-planner',
      label: 'Feed Planner',
      icon: <Grid3X3 className="w-4 h-4" />,
      description: 'Visual feed planning and scheduling'
    },
    {
      id: 'asset-manager',
      label: 'Asset Manager',
      icon: <FolderOpen className="w-4 h-4" />,
      description: 'Content library and brand assets'
    },
    {
      id: 'design-studio',
      label: 'Design Studio',
      icon: <PenTool className="w-4 h-4" />,
      description: 'Visual content creation and editing'
    },
    {
      id: 'ai-generator',
      label: 'AI Generator',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'AI-powered content creation and SEO'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <AdvancedNavigation 
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Content Creation Suite
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Professional content creation with AI-powered design and SEO optimization
                </p>
              </div>
              
              {/* Content Type & Platform Selector */}
              <div className="flex flex-col sm:flex-row gap-3">
                <ContentTypeSelector 
                  selected={selectedContentType}
                  onChange={setSelectedContentType}
                />
                <PlatformSelector 
                  selected={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                />
              </div>
            </motion.div>
          </div>

          {/* Main Tabs */}
          <div className="space-y-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'feed-planner' && (
                  <FeedPlannerWorkspace 
                    contentType={selectedContentType}
                    platforms={selectedPlatforms}
                  />
                )}

                {activeTab === 'asset-manager' && (
                  <AssetManagerWorkspace 
                    contentType={selectedContentType}
                    platforms={selectedPlatforms}
                  />
                )}

                {activeTab === 'design-studio' && (
                  <DesignStudioWorkspace 
                    contentType={selectedContentType}
                    platforms={selectedPlatforms}
                  />
                )}

                {activeTab === 'ai-generator' && (
                  <AIGeneratorWorkspace 
                    contentType={selectedContentType}
                    platforms={selectedPlatforms}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Type Selector Component
function ContentTypeSelector({ 
  selected, 
  onChange 
}: { 
  selected: ContentType; 
  onChange: (type: ContentType) => void; 
}) {
  const contentTypes = [
    { type: ContentType.SOCIAL_POST, label: 'Social Post', icon: Image },
    { type: ContentType.STORY, label: 'Story', icon: Smartphone },
    { type: ContentType.REEL, label: 'Reel', icon: Video },
    { type: ContentType.CAROUSEL, label: 'Carousel', icon: Layers },
    { type: ContentType.EMAIL_TEMPLATE, label: 'Email', icon: FileText },
    { type: ContentType.BLOG_GRAPHIC, label: 'Blog Graphic', icon: Monitor },
    { type: ContentType.PRINT_MATERIAL, label: 'Print', icon: FileText },
    { type: ContentType.ANIMATED_POST, label: 'Animated', icon: Play }
  ];

  const selectedType = contentTypes.find(ct => ct.type === selected);

  return (
    <div className="relative">
      <Button variant="outline" className="flex items-center gap-2">
        {selectedType && <selectedType.icon className="w-4 h-4" />}
        {selectedType?.label}
        <ChevronDown className="w-4 h-4" />
      </Button>
      {/* Dropdown implementation would go here */}
    </div>
  );
}

// Platform Selector Component
function PlatformSelector({ 
  selected, 
  onChange 
}: { 
  selected: Platform[]; 
  onChange: (platforms: Platform[]) => void; 
}) {
  const platforms = [
    { platform: Platform.INSTAGRAM, label: 'Instagram', color: 'bg-pink-500' },
    { platform: Platform.TIKTOK, label: 'TikTok', color: 'bg-black' },
    { platform: Platform.LINKEDIN, label: 'LinkedIn', color: 'bg-blue-600' },
    { platform: Platform.TWITTER, label: 'Twitter', color: 'bg-sky-500' },
    { platform: Platform.PINTEREST, label: 'Pinterest', color: 'bg-red-600' },
    { platform: Platform.FACEBOOK, label: 'Facebook', color: 'bg-blue-500' },
    { platform: Platform.YOUTUBE, label: 'YouTube', color: 'bg-red-500' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Platforms:</span>
      <div className="flex gap-1">
        {platforms.slice(0, 3).map((platform) => (
          <Badge
            key={platform.platform}
            variant={selected.includes(platform.platform) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              if (selected.includes(platform.platform)) {
                onChange(selected.filter(p => p !== platform.platform));
              } else {
                onChange([...selected, platform.platform]);
              }
            }}
          >
            {platform.label}
          </Badge>
        ))}
        {platforms.length > 3 && (
          <Button variant="outline" size="sm">
            +{platforms.length - 3}
          </Button>
        )}
      </div>
    </div>
  );
}

// Feed Planner Workspace Component
function FeedPlannerWorkspace({ 
  contentType, 
  platforms 
}: { 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  // Import the correct FeedPost type from FeedGridPlanner
  const [feedPosts, setFeedPosts] = useState<any[]>([]);

  // Mock data for initial state
  const mockPosts: any[] = [
    {
      id: 'post-1',
      position: 0,
      imageUrl: '/placeholder-image.jpg',
      caption: 'Exciting product launch coming soon! 🚀',
      hashtags: ['product', 'launch', 'new', 'exciting'],
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      platform: 'instagram',
      status: 'scheduled',
      type: 'image'
    },
    {
      id: 'post-2',
      position: 1,
      imageUrl: '/placeholder-image.jpg',
      caption: 'Behind the scenes content 📸',
      hashtags: ['behindthescenes', 'content', 'creative'],
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      platform: 'instagram',
      status: 'draft',
      type: 'image'
    }
  ];

  return (
    <div className="space-y-6">
      <FeedGridPlanner
        posts={feedPosts.length > 0 ? feedPosts : mockPosts}
        onPostsChange={setFeedPosts}
        className="w-full"
      />
    </div>
  );
}

// Asset Manager Workspace Component
function AssetManagerWorkspace({ 
  contentType, 
  platforms 
}: { 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  // Import the correct types from AssetManager
  const [assets, setAssets] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  // Mock data for initial state
  const mockAssets: any[] = [
    {
      id: 'asset-1',
      name: 'Product Launch Hero Image.jpg',
      type: 'image',
      url: '/placeholder-image.jpg',
      thumbnail: '/placeholder-image.jpg',
      size: 2048000, // 2MB
      dimensions: { width: 1080, height: 1080 },
      mimeType: 'image/jpeg',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      modifiedAt: new Date(),
      tags: ['product', 'launch', 'hero', 'social'],
      folder: 'campaign-assets',
      isFavorite: true,
      brandCompliant: true,
      description: 'Main hero image for product launch campaign'
    },
    {
      id: 'asset-2',
      name: 'Behind The Scenes Video.mp4',
      type: 'video',
      url: '/placeholder-video.mp4',
      thumbnail: '/placeholder-video-thumb.jpg',
      size: 15728640, // 15MB
      dimensions: { width: 1920, height: 1080 },
      mimeType: 'video/mp4',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      modifiedAt: new Date(),
      tags: ['video', 'behind-scenes', 'content'],
      folder: 'video-content',
      isFavorite: false,
      brandCompliant: true,
      description: 'Behind the scenes video content'
    }
  ];

  const mockFolders: any[] = [
    {
      id: 'folder-1',
      name: 'Campaign Assets',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      assetCount: 12,
      color: '#3b82f6'
    },
    {
      id: 'folder-2',
      name: 'Video Content',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assetCount: 8,
      color: '#10b981'
    }
  ];

  return (
    <div className="space-y-6">
      <AssetManager
        assets={assets.length > 0 ? assets : mockAssets}
        folders={folders.length > 0 ? folders : mockFolders}
        onAssetsChange={setAssets}
        onFoldersChange={setFolders}
        className="w-full"
      />
    </div>
  );
}

// Design Studio Workspace Component
function DesignStudioWorkspace({ 
  contentType, 
  platforms 
}: { 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  // Import the correct types from the new AdvancedDesignStudio
  const [templates] = useState<any[]>([]);

  const handleSave = (design: { elements: any[]; template?: any; metadata?: any }) => {
    console.log('Saving professional design:', design);
    // Handle design save logic with enhanced metadata
  };

  const handleExport = (format: 'png' | 'jpg' | 'svg' | 'pdf' | 'webp', quality?: number) => {
    console.log('Exporting as:', format, 'with quality:', quality);
    // Handle export logic with quality options
  };

  return (
    <div className="h-[900px] bg-gray-50 dark:bg-gray-900">
      <AdvancedDesignStudio
        templates={templates}
        onSave={handleSave}
        onExport={handleExport}
        className="w-full h-full"
      />
    </div>
  );
}

// AI Generator Workspace Component
function AIGeneratorWorkspace({ 
  contentType, 
  platforms 
}: { 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  const handleContentGenerated = (content: any) => {
    console.log('Content generated:', content);
    // Handle generated content here
  };

  const handleSaveContent = (content: any) => {
    console.log('Saving content:', content);
    // Handle save logic here
  };

  return (
    <div className="space-y-6">
      <AIContentGenerator
        onContentGenerated={handleContentGenerated}
        onSaveContent={handleSaveContent}
        className="w-full"
      />
    </div>
  );
}

// Placeholder components for the detailed implementations
function FeedGridView({ posts, onPostsChange }: { posts: FeedPost[]; onPostsChange: (posts: FeedPost[]) => void; }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 aspect-square max-w-md mx-auto">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Plan your visual feed by dragging and dropping content
        </p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>
    </div>
  );
}

function FeedCalendarView({ posts, onPostsChange }: { posts: FeedPost[]; onPostsChange: (posts: FeedPost[]) => void; }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">Calendar View</h3>
      <p className="text-gray-400">Schedule and organize your content by date</p>
      <Button className="mt-4" variant="outline">
        <Calendar className="w-4 h-4 mr-2" />
        Coming Soon
      </Button>
    </div>
  );
}

function AssetLibraryView({ 
  assets, 
  onAssetsChange, 
  searchQuery, 
  onSearchChange, 
  selectedTags, 
  onTagsChange 
}: { 
  assets: ContentAsset[]; 
  onAssetsChange: (assets: ContentAsset[]) => void; 
  searchQuery: string; 
  onSearchChange: (query: string) => void; 
  selectedTags: string[]; 
  onTagsChange: (tags: string[]) => void; 
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {/* Asset Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
          <Image className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium">Images</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
          <Video className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-sm font-medium">Videos</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
          <Palette className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-sm font-medium">Brand Assets</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
          <Layers className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-sm font-medium">Templates</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
      </div>
      
      <div className="text-center py-8 text-gray-500">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Asset Library</h3>
        <p className="text-gray-400">Upload and organize your content assets</p>
      </div>
    </div>
  );
}

function DesignCanvasView({ 
  contentType, 
  platforms 
}: { 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-gray-500">
        <PenTool className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Design Studio</h3>
        <p className="text-gray-400 mb-4">Create and edit visual content with professional tools</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Type className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-sm font-medium">Text Editor</div>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Layers className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-sm font-medium">Layers</div>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Palette className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-sm font-medium">Colors</div>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Settings className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-sm font-medium">Effects</div>
          </Card>
        </div>
        
        <Button className="mt-6" variant="outline">
          <PenTool className="w-4 h-4 mr-2" />
          Launch Design Studio
        </Button>
      </div>
    </div>
  );
}

function AIContentGeneratorView({ 
  prompt, 
  onPromptChange, 
  isGenerating, 
  onGenerate, 
  generatedContent, 
  contentType, 
  platforms 
}: { 
  prompt: string; 
  onPromptChange: (prompt: string) => void; 
  isGenerating: boolean; 
  onGenerate: () => void; 
  generatedContent: string; 
  contentType: ContentType; 
  platforms: Platform[]; 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Content Prompt</label>
        <Textarea
          placeholder={`Describe the ${contentType} you want to create for ${platforms.join(', ')}...`}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button 
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Generating with Claude AI...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Content with AI
          </>
        )}
      </Button>
      
      {generatedContent && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Generated Content</label>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SEOEngineView({ 
  seoData, 
  onSeoDataChange, 
  contentType 
}: { 
  seoData: SEOData; 
  onSeoDataChange: (data: SEOData) => void; 
  contentType: ContentType; 
}) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Target className="w-4 h-4" />
        AI-Powered SEO Engine
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">SEO Title</label>
          <Input
            placeholder="AI-generated SEO title..."
            value={seoData.title || ''}
            onChange={(e) => onSeoDataChange({ ...seoData, title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Meta Description</label>
          <Input
            placeholder="AI-generated meta description..."
            value={seoData.description || ''}
            onChange={(e) => onSeoDataChange({ ...seoData, description: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Alt Text</label>
          <Input
            placeholder="AI-generated alt text..."
            value={seoData.altText || ''}
            onChange={(e) => onSeoDataChange({ ...seoData, altText: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Optimization Score</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${seoData.optimizationScore || 0}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {seoData.optimizationScore || 0}%
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Keywords</label>
        <Input
          placeholder="AI-suggested keywords..."
          value={seoData.keywords?.join(', ') || ''}
          onChange={(e) => onSeoDataChange({ 
            ...seoData, 
            keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
          })}
        />
      </div>
      
      {seoData.suggestions && seoData.suggestions.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">AI SEO Suggestions</label>
          <ul className="space-y-1">
            {seoData.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <TrendingUp className="w-3 h-3 mt-0.5 text-blue-500" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <Zap className="w-4 h-4 mr-2" />
          Generate Schema
        </Button>
        <Button size="sm" variant="outline">
          <Globe className="w-4 h-4 mr-2" />
          Analyze SEO
        </Button>
      </div>
    </div>
  );
}