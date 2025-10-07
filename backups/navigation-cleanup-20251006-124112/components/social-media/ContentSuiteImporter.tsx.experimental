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
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import types from Content Suite - Define simple types for missing imports
interface FeedPost {
  id: string;
  title: string;
  content: string;
  platform?: string;
  scheduledTime?: string;
}

interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

interface ContentSuiteImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: ImportedContent) => void;
  targetPlatforms?: string[];
  className?: string;
}

interface ImportedContent {
  type: 'feed-post' | 'design' | 'asset' | 'bulk-feed';
  content: {
    id: string;
    caption?: string;
    hashtags?: string[];
    imageUrl?: string;
    videoUrl?: string;
    mediaFiles?: File[];
    platforms?: string[];
    scheduledDate?: Date;
    designData?: any;
    assets?: Asset[];
  };
  metadata: {
    originalSource: string;
    adaptedForPlatforms: string[];
    brandCompliant: boolean;
    aiOptimized: boolean;
  };
}

interface FeedGridData {
  posts: FeedPost[];
  selectedPositions: number[];
  totalPosts: number;
}

interface DesignStudioData {
  designs: any[];
  selectedDesign: any | null;
}

interface AssetManagerData {
  assets: Asset[];
  categories: string[];
  selectedAssets: string[];
}

export default function ContentSuiteImporter({
  isOpen,
  onClose,
  onImport,
  targetPlatforms = ['instagram'],
  className = ''
}: ContentSuiteImporterProps) {
  const [activeTab, setActiveTab] = useState<'feed-planner' | 'design-studio' | 'asset-manager'>('feed-planner');
  const [feedGridData, setFeedGridData] = useState<FeedGridData>({ posts: [], selectedPositions: [], totalPosts: 0 });
  const [designStudioData, setDesignStudioData] = useState<DesignStudioData>({ designs: [], selectedDesign: null });
  const [assetManagerData, setAssetManagerData] = useState<AssetManagerData>({ assets: [], categories: [], selectedAssets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load content from localStorage (simulating Content Suite data)
  useEffect(() => {
    if (!isOpen) return;

    const loadContentSuiteData = () => {
      try {
        // Load Feed Grid Planner data
        const feedData = localStorage.getItem('feed-grid-planner-posts');
        if (feedData) {
          const posts: FeedPost[] = JSON.parse(feedData);
          setFeedGridData({
            posts: posts.filter(p => p.imageUrl || p.videoUrl || p.caption),
            selectedPositions: [],
            totalPosts: posts.length
          });
        }

        // Load mock Design Studio data
        const mockDesigns = [
          {
            id: 'design-1',
            name: 'Brand Announcement Template',
            type: 'social-post',
            thumbnail: '/api/placeholder/300/300',
            category: 'announcements',
            createdAt: new Date(),
            dimensions: { width: 1080, height: 1080 },
            brandCompliant: true
          },
          {
            id: 'design-2', 
            name: 'Product Showcase Layout',
            type: 'carousel',
            thumbnail: '/api/placeholder/300/300',
            category: 'products',
            createdAt: new Date(),
            dimensions: { width: 1080, height: 1080 },
            brandCompliant: true
          },
          {
            id: 'design-3',
            name: 'Quote Card Design',
            type: 'story',
            thumbnail: '/api/placeholder/300/300', 
            category: 'quotes',
            createdAt: new Date(),
            dimensions: { width: 1080, height: 1920 },
            brandCompliant: true
          }
        ];
        setDesignStudioData({ designs: mockDesigns, selectedDesign: null });

        // Load mock Asset Manager data
        const mockAssets: Asset[] = [
          {
            id: 'asset-1',
            name: 'Company Logo.png',
            type: 'image',
            url: '/api/placeholder/200/200',
            category: 'brand',
            size: 24576,
            createdAt: new Date(),
            tags: ['logo', 'brand', 'identity']
          },
          {
            id: 'asset-2',
            name: 'Product Hero Image.jpg',
            type: 'image', 
            url: '/api/placeholder/400/300',
            category: 'products',
            size: 156432,
            createdAt: new Date(),
            tags: ['product', 'hero', 'marketing']
          },
          {
            id: 'asset-3',
            name: 'Brand Video.mp4',
            type: 'video',
            url: '/api/placeholder/400/300',
            category: 'videos',
            size: 2048576,
            createdAt: new Date(),
            tags: ['video', 'brand', 'promo']
          }
        ];
        setAssetManagerData({ 
          assets: mockAssets, 
          categories: ['all', 'brand', 'products', 'videos'],
          selectedAssets: []
        });
      } catch (error) {
        console.error('Error loading Content Suite data:', error);
        toast.error('Failed to load Content Suite data');
      }
    };

    loadContentSuiteData();
  }, [isOpen]);

  // Handle Feed Grid import
  const handleFeedGridImport = useCallback(async (post: FeedPost) => {
    setIsLoading(true);
    
    try {
      // Simulate platform optimization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const importedContent: ImportedContent = {
        type: 'feed-post',
        content: {
          id: post.id,
          caption: post.caption,
          hashtags: post.hashtags || [],
          imageUrl: post.imageUrl,
          videoUrl: post.videoUrl,
          platforms: targetPlatforms,
          scheduledDate: post.scheduledDate
        },
        metadata: {
          originalSource: 'Feed Grid Planner',
          adaptedForPlatforms: targetPlatforms,
          brandCompliant: true,
          aiOptimized: true
        }
      };

      onImport(importedContent);
      toast.success(`Post imported from Feed Grid Planner position ${post.position + 1}`);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import from Feed Grid Planner');
    } finally {
      setIsLoading(false);
    }
  }, [targetPlatforms, onImport, onClose]);

  // Handle Design Studio import
  const handleDesignImport = useCallback(async (design: any) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const importedContent: ImportedContent = {
        type: 'design',
        content: {
          id: design.id,
          caption: `Check out our latest ${design.category}! 🚀`,
          hashtags: ['design', 'creative', design.category],
          imageUrl: design.thumbnail,
          platforms: targetPlatforms,
          designData: design
        },
        metadata: {
          originalSource: 'Design Studio',
          adaptedForPlatforms: targetPlatforms,
          brandCompliant: design.brandCompliant,
          aiOptimized: true
        }
      };

      onImport(importedContent);
      toast.success(`Design "${design.name}" imported successfully`);
      onClose();
    } catch (error) {
      console.error('Design import error:', error);
      toast.error('Failed to import design');
    } finally {
      setIsLoading(false);
    }
  }, [targetPlatforms, onImport, onClose]);

  // Handle Asset import
  const handleAssetImport = useCallback(async () => {
    if (assetManagerData.selectedAssets.length === 0) {
      toast.error('Please select assets to import');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedAssets = assetManagerData.assets.filter(asset => 
        assetManagerData.selectedAssets.includes(asset.id)
      );

      const importedContent: ImportedContent = {
        type: 'asset',
        content: {
          id: `asset-import-${Date.now()}`,
          caption: 'Check out these amazing assets! ✨',
          hashtags: ['assets', 'content', 'brand'],
          platforms: targetPlatforms,
          assets: selectedAssets
        },
        metadata: {
          originalSource: 'Asset Manager',
          adaptedForPlatforms: targetPlatforms,
          brandCompliant: true,
          aiOptimized: false
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
  }, [assetManagerData.selectedAssets, assetManagerData.assets, targetPlatforms, onImport, onClose]);

  // Bulk import from feed grid
  const handleBulkFeedImport = useCallback(async () => {
    if (feedGridData.selectedPositions.length === 0) {
      toast.error('Please select posts to import');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedPosts = feedGridData.posts.filter(post => 
        feedGridData.selectedPositions.includes(post.position)
      );

      for (const post of selectedPosts) {
        const importedContent: ImportedContent = {
          type: 'bulk-feed',
          content: {
            id: `bulk-${post.id}`,
            caption: post.caption,
            hashtags: post.hashtags || [],
            imageUrl: post.imageUrl,
            videoUrl: post.videoUrl,
            platforms: targetPlatforms
          },
          metadata: {
            originalSource: 'Feed Grid Planner (Bulk)',
            adaptedForPlatforms: targetPlatforms,
            brandCompliant: true,
            aiOptimized: true
          }
        };

        onImport(importedContent);
      }

      toast.success(`${selectedPosts.length} posts imported from Feed Grid Planner`);
      onClose();
    } catch (error) {
      console.error('Bulk import error:', error);
      toast.error('Failed to bulk import posts');
    } finally {
      setIsLoading(false);
    }
  }, [feedGridData.selectedPositions, feedGridData.posts, targetPlatforms, onImport, onClose]);

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
              Select content to import and adapt for {targetPlatforms.join(', ')}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="feed-planner" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Feed Planner
                <Badge variant="outline" className="ml-1">
                  {feedGridData.totalPosts}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="design-studio" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Design Studio
                <Badge variant="outline" className="ml-1">
                  {designStudioData.designs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="asset-manager" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Asset Manager
                <Badge variant="outline" className="ml-1">
                  {assetManagerData.assets.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Feed Grid Planner Tab */}
            <TabsContent value="feed-planner" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Feed Grid Posts
                </h3>
                {feedGridData.selectedPositions.length > 0 && (
                  <Button onClick={handleBulkFeedImport} disabled={isLoading}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import {feedGridData.selectedPositions.length} Selected
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {feedGridData.posts.map((post) => (
                  <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        {post.imageUrl ? (
                          <img 
                            src={post.imageUrl} 
                            alt="Post preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : post.videoUrl ? (
                          <video 
                            src={post.videoUrl}
                            className="w-full h-full object-cover rounded-lg"
                            muted
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
                          <input
                            type="checkbox"
                            checked={feedGridData.selectedPositions.includes(post.position)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFeedGridData(prev => ({
                                  ...prev,
                                  selectedPositions: [...prev.selectedPositions, post.position]
                                }));
                              } else {
                                setFeedGridData(prev => ({
                                  ...prev,
                                  selectedPositions: prev.selectedPositions.filter(p => p !== post.position)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {post.caption && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {post.caption}
                        </p>
                      )}

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {post.hashtags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.hashtags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button 
                        onClick={() => handleFeedGridImport(post)}
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Loading...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Import Post
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {feedGridData.posts.length === 0 && (
                <div className="text-center py-12">
                  <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No posts found in Feed Grid Planner
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Create posts in the Content Suite first
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Design Studio Tab */}
            <TabsContent value="design-studio" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Design Studio Creations
                </h3>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search designs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {designStudioData.designs.map((design) => (
                  <Card key={design.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        <img 
                          src={design.thumbnail} 
                          alt={design.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {design.type}
                          </Badge>
                        </div>

                        {design.brandCompliant && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="default" className="text-xs bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Brand
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

                      <Button 
                        onClick={() => handleDesignImport(design)}
                        className="w-full"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Adapting...</>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Import & Adapt
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Asset Manager Tab */}
            <TabsContent value="asset-manager" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Brand Assets
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    {assetManagerData.categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  
                  {assetManagerData.selectedAssets.length > 0 && (
                    <Button onClick={handleAssetImport} disabled={isLoading}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import {assetManagerData.selectedAssets.length} Assets
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assetManagerData.assets
                  .filter(asset => selectedCategory === 'all' || asset.category === selectedCategory)
                  .map((asset) => (
                  <Card key={asset.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        {asset.type === 'image' ? (
                          <img 
                            src={asset.url} 
                            alt={asset.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <input
                            type="checkbox"
                            checked={assetManagerData.selectedAssets.includes(asset.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAssetManagerData(prev => ({
                                  ...prev,
                                  selectedAssets: [...prev.selectedAssets, asset.id]
                                }));
                              } else {
                                setAssetManagerData(prev => ({
                                  ...prev,
                                  selectedAssets: prev.selectedAssets.filter(id => id !== asset.id)
                                }));
                              }
                            }}
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
                        {asset.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
            Content will be automatically optimized for {targetPlatforms.join(', ')}
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