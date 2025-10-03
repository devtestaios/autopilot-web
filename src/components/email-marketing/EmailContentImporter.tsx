'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Grid3X3, 
  Layers,
  Download,
  Eye,
  Copy,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  X,
  Image as ImageIcon,
  FileText,
  Palette,
  FolderOpen,
  Search,
  Filter,
  Mail,
  Users,
  Target,
  BarChart3,
  Type,
  Settings,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import types from Content Suite
import type { FeedPost, Asset } from '@/types';

interface EmailContentImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: ImportedEmailContent) => void;
  campaignType?: 'newsletter' | 'promotional' | 'transactional' | 'automated';
  className?: string;
}

interface ImportedEmailContent {
  type: 'feed-post' | 'design' | 'asset' | 'bulk-content';
  content: {
    id: string;
    subject?: string;
    preheader?: string;
    htmlContent?: string;
    textContent?: string;
    images?: string[];
    assets?: Asset[];
    designData?: any;
    campaignType?: string;
  };
  metadata: {
    originalSource: string;
    adaptedForEmail: boolean;
    aiOptimized: boolean;
    brandCompliant: boolean;
    responsiveReady: boolean;
  };
}

interface ContentSuiteData {
  feedPosts: FeedPost[];
  designs: any[];
  assets: Asset[];
  contentGenerations: any[];
}

export default function EmailContentImporter({
  isOpen,
  onClose,
  onImport,
  campaignType = 'newsletter',
  className = ''
}: EmailContentImporterProps) {
  const [activeTab, setActiveTab] = useState<'feed-planner' | 'design-studio' | 'asset-manager' | 'ai-content'>('feed-planner');
  const [contentSuiteData, setContentSuiteData] = useState<ContentSuiteData>({
    feedPosts: [],
    designs: [],
    assets: [],
    contentGenerations: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load content from localStorage (simulating Content Suite data)
  useEffect(() => {
    if (!isOpen) return;

    const loadContentSuiteData = () => {
      try {
        // Load Feed Grid Planner data
        const feedData = localStorage.getItem('feed-grid-planner-posts');
        const feedPosts = feedData ? JSON.parse(feedData) : [];

        // Load mock Design Studio data with email-specific designs
        const emailDesigns = [
          {
            id: 'email-design-1',
            name: 'Newsletter Template - Modern',
            type: 'email-template',
            thumbnail: '/api/placeholder/400/300',
            category: 'newsletters',
            createdAt: new Date(),
            dimensions: { width: 600, height: 800 },
            brandCompliant: true,
            responsive: true,
            htmlContent: '<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"><h1>Newsletter Header</h1><p>Your content here...</p></div>'
          },
          {
            id: 'email-design-2', 
            name: 'Product Announcement Email',
            type: 'promotional',
            thumbnail: '/api/placeholder/400/300',
            category: 'promotional',
            createdAt: new Date(),
            dimensions: { width: 600, height: 1000 },
            brandCompliant: true,
            responsive: true,
            htmlContent: '<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"><h1>New Product Launch!</h1><p>Introducing our latest innovation...</p></div>'
          },
          {
            id: 'email-design-3',
            name: 'Welcome Email Series Template',
            type: 'automated',
            thumbnail: '/api/placeholder/400/300', 
            category: 'automation',
            createdAt: new Date(),
            dimensions: { width: 600, height: 600 },
            brandCompliant: true,
            responsive: true,
            htmlContent: '<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"><h1>Welcome to Our Community!</h1><p>Thank you for joining us...</p></div>'
          }
        ];

        // Load mock Asset Manager data
        const emailAssets: Asset[] = [
          {
            id: 'email-asset-1',
            name: 'Email Header Logo.png',
            type: 'image',
            url: '/api/placeholder/300/100',
            category: 'brand',
            size: 15432,
            createdAt: new Date(),
            tags: ['logo', 'brand', 'header', 'email']
          },
          {
            id: 'email-asset-2',
            name: 'Newsletter Banner.jpg',
            type: 'image', 
            url: '/api/placeholder/600/200',
            category: 'banners',
            size: 89654,
            createdAt: new Date(),
            tags: ['banner', 'newsletter', 'header']
          },
          {
            id: 'email-asset-3',
            name: 'Product Hero Image.jpg',
            type: 'image',
            url: '/api/placeholder/400/300',
            category: 'products',
            size: 156432,
            createdAt: new Date(),
            tags: ['product', 'hero', 'marketing', 'email']
          },
          {
            id: 'email-asset-4',
            name: 'Email Footer Logo.png',
            type: 'image',
            url: '/api/placeholder/200/80',
            category: 'brand',
            size: 12876,
            createdAt: new Date(),
            tags: ['logo', 'footer', 'brand', 'email']
          }
        ];

        // Load mock AI-generated content
        const aiContentGenerations = [
          {
            id: 'ai-content-1',
            title: 'Weekly Newsletter Content',
            type: 'newsletter',
            subject: 'Your Weekly Update: Industry Insights & Company News',
            preheader: 'Stay informed with the latest trends and updates',
            content: 'This week has been filled with exciting developments in our industry. Here are the key highlights you need to know...',
            createdAt: new Date(),
            tone: 'professional',
            wordCount: 350,
            readabilityScore: 8.5
          },
          {
            id: 'ai-content-2',
            title: 'Product Launch Announcement',
            type: 'promotional',
            subject: '🚀 Introducing Our Game-Changing New Product!',
            preheader: 'Be among the first to experience innovation',
            content: 'We are thrilled to announce the launch of our revolutionary new product that will transform how you work...',
            createdAt: new Date(),
            tone: 'exciting',
            wordCount: 280,
            readabilityScore: 9.2
          },
          {
            id: 'ai-content-3',
            title: 'Customer Success Story',
            type: 'newsletter',
            subject: 'How [Customer Name] Achieved 300% Growth',
            preheader: 'Real results from real customers',
            content: 'Meet Sarah from TechCorp, who transformed her business using our platform. Her journey is truly inspiring...',
            createdAt: new Date(),
            tone: 'inspiring',
            wordCount: 420,
            readabilityScore: 8.8
          }
        ];

        setContentSuiteData({
          feedPosts: feedPosts.filter((p: FeedPost) => p.imageUrl || p.videoUrl || p.caption),
          designs: emailDesigns,
          assets: emailAssets,
          contentGenerations: aiContentGenerations
        });
      } catch (error) {
        console.error('Error loading Content Suite data:', error);
        toast.error('Failed to load Content Suite data');
      }
    };

    loadContentSuiteData();
  }, [isOpen]);

  // Handle Feed Grid import for email
  const handleFeedGridImport = useCallback(async (post: FeedPost) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert social media post to email content
      const emailSubject = post.caption ? 
        post.caption.split('\n')[0].substring(0, 50) + '...' : 
        'Newsletter Update';
      
      const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">${emailSubject}</h1>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Content Image" style="width: 100%; height: auto; margin-bottom: 20px; border-radius: 8px;" />` : ''}
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${post.caption || 'Your content here...'}</p>
          ${post.hashtags ? `<p style="color: #999; font-size: 14px;">Topics: ${post.hashtags.map(tag => `#${tag}`).join(' ')}</p>` : ''}
        </div>
      `;
      
      const importedContent: ImportedEmailContent = {
        type: 'feed-post',
        content: {
          id: post.id,
          subject: emailSubject,
          preheader: post.caption ? post.caption.substring(0, 100) + '...' : '',
          htmlContent,
          textContent: post.caption || '',
          images: post.imageUrl ? [post.imageUrl] : [],
          campaignType
        },
        metadata: {
          originalSource: 'Feed Grid Planner',
          adaptedForEmail: true,
          aiOptimized: false,
          brandCompliant: true,
          responsiveReady: true
        }
      };

      onImport(importedContent);
      toast.success(`Content imported from Feed Grid Planner position ${post.position + 1}`);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import from Feed Grid Planner');
    } finally {
      setIsLoading(false);
    }
  }, [campaignType, onImport, onClose]);

  // Handle Design Studio import
  const handleDesignImport = useCallback(async (design: any) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const importedContent: ImportedEmailContent = {
        type: 'design',
        content: {
          id: design.id,
          subject: `${design.name} - Email Campaign`,
          preheader: `Professional email template: ${design.name}`,
          htmlContent: design.htmlContent,
          designData: design,
          campaignType
        },
        metadata: {
          originalSource: 'Design Studio',
          adaptedForEmail: true,
          aiOptimized: false,
          brandCompliant: design.brandCompliant,
          responsiveReady: design.responsive
        }
      };

      onImport(importedContent);
      toast.success(`Email template "${design.name}" imported successfully`);
      onClose();
    } catch (error) {
      console.error('Design import error:', error);
      toast.error('Failed to import email template');
    } finally {
      setIsLoading(false);
    }
  }, [campaignType, onImport, onClose]);

  // Handle Asset import for email
  const handleAssetImport = useCallback(async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select assets to import');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedAssets = contentSuiteData.assets.filter(asset => 
        selectedItems.includes(asset.id)
      );

      // Create HTML content with imported assets
      const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">Email Campaign with Brand Assets</h1>
          ${selectedAssets.map(asset => `
            <div style="margin-bottom: 20px;">
              <img src="${asset.url}" alt="${asset.name}" style="width: 100%; height: auto; border-radius: 8px;" />
              <p style="color: #666; font-size: 14px; margin-top: 8px;">${asset.name}</p>
            </div>
          `).join('')}
          <p style="color: #666; line-height: 1.6;">Your email content with integrated brand assets.</p>
        </div>
      `;

      const importedContent: ImportedEmailContent = {
        type: 'asset',
        content: {
          id: `asset-import-${Date.now()}`,
          subject: 'Email Campaign with Brand Assets',
          preheader: 'Professional email with integrated brand assets',
          htmlContent,
          assets: selectedAssets,
          campaignType
        },
        metadata: {
          originalSource: 'Asset Manager',
          adaptedForEmail: true,
          aiOptimized: false,
          brandCompliant: true,
          responsiveReady: true
        }
      };

      onImport(importedContent);
      toast.success(`${selectedAssets.length} assets imported successfully`);
      onClose();
    } catch (error) {
      console.error('Asset import error:', error);
      toast.error('Failed to import assets');
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems, contentSuiteData.assets, campaignType, onImport, onClose]);

  // Handle AI Content import
  const handleAIContentImport = useCallback(async (aiContent: any) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">${aiContent.title}</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${aiContent.content}</p>
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px;">Generated with AI • ${aiContent.tone} tone • ${aiContent.wordCount} words</p>
          </div>
        </div>
      `;

      const importedContent: ImportedEmailContent = {
        type: 'bulk-content',
        content: {
          id: aiContent.id,
          subject: aiContent.subject,
          preheader: aiContent.preheader,
          htmlContent,
          textContent: aiContent.content,
          campaignType: aiContent.type
        },
        metadata: {
          originalSource: 'AI Content Generator',
          adaptedForEmail: true,
          aiOptimized: true,
          brandCompliant: true,
          responsiveReady: true
        }
      };

      onImport(importedContent);
      toast.success(`AI-generated content "${aiContent.title}" imported successfully`);
      onClose();
    } catch (error) {
      console.error('AI content import error:', error);
      toast.error('Failed to import AI content');
    } finally {
      setIsLoading(false);
    }
  }, [onImport, onClose]);

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

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
        className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Import from Content Suite
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select content to import and adapt for email campaigns
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="feed-planner" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Feed Planner
                <Badge variant="secondary" className="ml-1">
                  {contentSuiteData.feedPosts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="design-studio" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Email Templates
                <Badge variant="secondary" className="ml-1">
                  {contentSuiteData.designs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="asset-manager" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Brand Assets
                <Badge variant="secondary" className="ml-1">
                  {contentSuiteData.assets.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="ai-content" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Content
                <Badge variant="secondary" className="ml-1">
                  {contentSuiteData.contentGenerations.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Feed Grid Planner Tab */}
            <TabsContent value="feed-planner" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Social Media Posts → Email Content
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convert social media posts to email-ready content
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentSuiteData.feedPosts.map((post) => (
                  <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        {post.imageUrl ? (
                          <img 
                            src={post.imageUrl} 
                            alt="Post preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            Position {post.position + 1}
                          </Badge>
                        </div>

                        <div className="absolute top-2 right-2">
                          <Badge className="text-xs bg-blue-600 text-white">
                            <Mail className="w-3 h-3 mr-1" />
                            Email Ready
                          </Badge>
                        </div>
                      </div>

                      {post.caption && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {post.caption}
                        </p>
                      )}

                      <div className="text-xs text-gray-500 mb-3">
                        <p>Subject: {post.caption?.split('\n')[0].substring(0, 40)}...</p>
                      </div>

                      <Button 
                        onClick={() => handleFeedGridImport(post)}
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Converting...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Convert to Email
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contentSuiteData.feedPosts.length === 0 && (
                <div className="text-center py-12">
                  <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No posts found in Feed Grid Planner
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Email Templates Tab */}
            <TabsContent value="design-studio" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Email Template Library
                </h3>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentSuiteData.designs.map((design) => (
                  <Card key={design.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-[4/3] mb-3">
                        <img 
                          src={design.thumbnail} 
                          alt={design.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {design.type}
                          </Badge>
                        </div>

                        {design.responsive && (
                          <div className="absolute top-2 right-2">
                            <Badge className="text-xs bg-green-600 text-white">
                              <Settings className="w-3 h-3 mr-1" />
                              Responsive
                            </Badge>
                          </div>
                        )}
                      </div>

                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {design.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {design.dimensions.width} × {design.dimensions.height}px
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {design.brandCompliant && (
                          <Badge className="text-xs bg-purple-100 text-purple-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Brand Compliant
                          </Badge>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleDesignImport(design)}
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Importing...</>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Import Template
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Brand Assets Tab */}
            <TabsContent value="asset-manager" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Email Brand Assets
                </h3>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button onClick={handleAssetImport} disabled={isLoading}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import {selectedItems.length} Assets
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contentSuiteData.assets.map((asset) => (
                  <Card key={asset.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        <img 
                          src={asset.url} 
                          alt={asset.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        
                        <div className="absolute top-2 right-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(asset.id)}
                            onChange={() => toggleItemSelection(asset.id)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm truncate">
                        {asset.name}
                      </h4>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {(asset.size / 1024).toFixed(1)} KB
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {asset.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI Content Tab */}
            <TabsContent value="ai-content" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  AI-Generated Email Content
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready-to-use email content generated by AI
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentSuiteData.contentGenerations.map((content) => (
                  <Card key={content.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {content.title}
                          </h4>
                          <Badge className="text-xs capitalize bg-blue-100 text-blue-700">
                            {content.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-gray-500">AI Generated</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Subject Line:</p>
                          <p className="text-sm text-gray-900 dark:text-white">{content.subject}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {content.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <span>Tone: {content.tone}</span>
                        <span>{content.wordCount} words</span>
                        <span>Score: {content.readabilityScore}/10</span>
                      </div>

                      <Button 
                        onClick={() => handleAIContentImport(content)}
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Importing...</>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Import AI Content
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Content will be automatically optimized for email campaigns
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}