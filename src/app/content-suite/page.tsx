'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationTabs from '@/components/NavigationTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Calendar, 
  Mail, 
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
  Search
} from 'lucide-react';

export default function ContentCreationSuite() {
  const [activeTab, setActiveTab] = useState('generator');

  const tabConfig = [
    {
      id: 'generator',
      label: 'AI Generator',
      icon: <Sparkles className="w-4 h-4" />,
      component: AIContentGenerator
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: <Users className="w-4 h-4" />,
      component: SocialMediaManager
    },
    {
      id: 'email',
      label: 'Email Marketing',
      icon: <Mail className="w-4 h-4" />,
      component: EmailMarketingManager
    },
    {
      id: 'library',
      label: 'Content Library',
      icon: <FolderOpen className="w-4 h-4" />,
      component: ContentLibraryManager
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Content Creation Suite
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered content creation with Social Media Management, Email Marketing, and comprehensive content tools
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// AI Content Generator Component
function AIContentGenerator() {
  const [contentType, setContentType] = useState('social-post');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = [
    { id: 'social-post', label: 'Social Media Post', icon: Users },
    { id: 'blog-post', label: 'Blog Post', icon: FileText },
    { id: 'email', label: 'Email Content', icon: Mail },
    { id: 'product-desc', label: 'Product Description', icon: Edit3 }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`Generated ${contentType} content based on: "${prompt}"\n\nThis is a sample AI-generated content that would be created based on your prompt. In a real implementation, this would connect to AI services like GPT-4 or Claude to generate high-quality content tailored to your specifications.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    contentType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="w-4 h-4 mb-2" />
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the content you want to generate..."
              className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>

          {generatedContent && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Generated Content</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Social Media Manager Component
function SocialMediaManager() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Post */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule and manage your social media posts across platforms
            </p>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Scheduled Post
            </Button>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Social Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track engagement and performance across platforms
            </p>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            No posts yet. Create your first social media post!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Email Marketing Manager Component
function EmailMarketingManager() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Campaign */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create and manage email marketing campaigns
            </p>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </CardContent>
        </Card>

        {/* Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your email subscriber lists
            </p>
            <Button variant="outline" className="w-full">
              Manage Lists
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            No campaigns yet. Create your first email campaign!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Content Library Manager Component
function ContentLibraryManager() {
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button>
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Image className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium">Images</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4">
          <Video className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-sm font-medium">Videos</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4">
          <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-sm font-medium">Documents</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
        
        <Card className="text-center p-4">
          <PenTool className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-sm font-medium">Templates</div>
          <div className="text-xs text-gray-500">0 items</div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search content..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            Your content library is empty. Upload some content to get started!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}