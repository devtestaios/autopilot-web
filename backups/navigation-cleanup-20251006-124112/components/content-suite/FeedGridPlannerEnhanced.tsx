'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter 
} from '@dnd-kit/core';
import { 
  Upload, 
  Calendar, 
  Settings, 
  Sparkles, 
  Grid3X3, 
  List, 
  BarChart3,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  Trash2,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Image as ImageIcon,
  Video,
  Eye,
  Heart,
  MessageCircle,
  Share,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Enhanced Feed Post type with comprehensive properties
export interface FeedPost {
  id: string;
  position: number;
  imageUrl?: string;
  videoUrl?: string;
  mediaFiles?: File[];
  caption: string;
  hashtags: string[];
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'facebook' | 'youtube';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  type: 'image' | 'video' | 'carousel' | 'story';
  scheduledDate?: Date;
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiGenerated?: boolean;
  autoOptimize?: boolean;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagement?: number;
    reach?: number;
    impressions?: number;
  };
}

// Analytics interface
export interface FeedAnalytics {
  totalPosts: number;
  published: number;
  scheduled: number;
  drafts: number;
  failed: number;
  totalEngagement: number;
  avgEngagement: number;
  topPerforming: FeedPost[];
  contentMix: {
    images: number;
    videos: number;
    carousels: number;
    stories: number;
  };
  platformDistribution: Record<string, number>;
  schedulingOptimization: {
    bestTimes: string[];
    bestDays: string[];
    engagementPeaks: Array<{ time: string; engagement: number }>;
  };
}

// Enhanced props interface
export interface FeedGridPlannerProps {
  posts: FeedPost[];
  onPostsChange: (posts: FeedPost[]) => void;
  analytics?: FeedAnalytics;
  className?: string;
  enableAI?: boolean;
  enableScheduling?: boolean;
  enableAnalytics?: boolean;
}

// Platform icon mapping
const PlatformIcons = {
  instagram: Instagram,
  tiktok: Video,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
};

// Status color mapping
const StatusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-yellow-500',
  published: 'bg-green-500',
  failed: 'bg-red-500',
};

// Draggable Post Component with Enhanced UI
function DraggablePost({ 
  post, 
  isDragging = false, 
  onSelect, 
  isSelected = false,
  showBulkActions = false 
}: { 
  post: FeedPost; 
  isDragging?: boolean;
  onSelect?: (post: FeedPost) => void;
  isSelected?: boolean;
  showBulkActions?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: post.id,
  });

  const PlatformIcon = PlatformIcons[post.platform];

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative aspect-square bg-white dark:bg-gray-800 border-2 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-105 shadow-2xl' : 'hover:shadow-lg'}
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}
        transition-all duration-200
      `}
      onClick={() => onSelect?.(post)}
    >
      {/* Bulk Selection Checkbox */}
      {showBulkActions && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => e.stopPropagation()}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      )}

      {/* Platform Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-black bg-opacity-50 rounded-full p-1">
          <PlatformIcon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Media Content */}
      <div className="w-full h-full">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.caption || 'Post image'} 
            className="w-full h-full object-cover"
          />
        ) : post.videoUrl ? (
          <video 
            src={post.videoUrl} 
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Post Information Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className={`w-2 h-2 rounded-full ${StatusColors[post.status]}`}></div>
          {post.aiGenerated && (
            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              AI
            </div>
          )}
        </div>

        {/* Caption Preview */}
        {post.caption && (
          <p className="text-white text-xs line-clamp-2 mb-2">
            {post.caption}
          </p>
        )}

        {/* Metrics */}
        {post.metrics && (
          <div className="flex items-center space-x-3 text-white text-xs">
            {post.metrics.views && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.metrics.views}</span>
              </div>
            )}
            {post.metrics.likes && (
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{post.metrics.likes}</span>
              </div>
            )}
            {post.metrics.comments && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{post.metrics.comments}</span>
              </div>
            )}
          </div>
        )}

        {/* Scheduled Date */}
        {post.status === 'scheduled' && post.scheduledDate && (
          <div className="text-white text-xs mt-1">
            {new Date(post.scheduledDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

// Grid Slot Component
function GridSlot({ 
  position, 
  post, 
  onCreatePost, 
  onSelectPost,
  onToggleSelect,
  isSelected,
  showBulkActions 
}: {
  position: number;
  post: FeedPost | null;
  onCreatePost: (position: number) => void;
  onSelectPost: (post: FeedPost) => void;
  onToggleSelect: (postId: string) => void;
  isSelected: boolean;
  showBulkActions: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${position}`,
  });

  if (post) {
    return (
      <div ref={setNodeRef}>
        <DraggablePost 
          post={post} 
          onSelect={onSelectPost}
          isSelected={isSelected}
          showBulkActions={showBulkActions}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
        ${isOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
        hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
      `}
      onClick={() => onCreatePost(position)}
    >
      <div className="text-center text-gray-400">
        <Upload className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm">Add Post</p>
      </div>
    </div>
  );
}

// Post Editor Modal Component
function PostEditorModal({ 
  post, 
  onSave, 
  onClose,
  enableScheduling = true,
  platforms = ['instagram']
}: { 
  post: FeedPost; 
  onSave: (post: FeedPost) => void; 
  onClose: () => void;
  enableScheduling?: boolean;
  platforms?: string[];
}) {
  const [editedPost, setEditedPost] = useState<FeedPost>(post);

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
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Post</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Media Preview */}
          {(editedPost.imageUrl || editedPost.videoUrl) && (
            <div className="relative">
              {editedPost.imageUrl && (
                <img 
                  src={editedPost.imageUrl} 
                  alt="Post preview" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              {editedPost.videoUrl && (
                <video 
                  src={editedPost.videoUrl} 
                  className="w-full h-40 object-cover rounded-lg"
                  controls
                />
              )}
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Caption</label>
            <Textarea
              value={editedPost.caption}
              onChange={(e) => setEditedPost({ ...editedPost, caption: e.target.value })}
              placeholder="Write your caption..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Hashtags</label>
            <Input
              value={editedPost.hashtags.join(' #')}
              onChange={(e) => {
                const hashtags = e.target.value.split('#').map(tag => tag.trim()).filter(Boolean);
                setEditedPost({ ...editedPost, hashtags });
              }}
              placeholder="#hashtag1 #hashtag2"
              className="w-full"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Platform</label>
            <select
              value={editedPost.platform}
              onChange={(e) => setEditedPost({ 
                ...editedPost, 
                platform: e.target.value as FeedPost['platform'] 
              })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={editedPost.status}
              onChange={(e) => setEditedPost({ 
                ...editedPost, 
                status: e.target.value as FeedPost['status']
              })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Schedule Date */}
          {enableScheduling && editedPost.status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Schedule Date</label>
              <Input
                type="datetime-local"
                value={editedPost.scheduledDate ? new Date(editedPost.scheduledDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setEditedPost({ 
                  ...editedPost, 
                  scheduledDate: e.target.value ? new Date(e.target.value) : undefined
                })}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-2 mt-6">
          <Button
            onClick={() => onSave({ ...editedPost, updatedAt: new Date() })}
            className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced Main Feed Grid Planner Component
export default function FeedGridPlanner({ 
  posts, 
  onPostsChange, 
  analytics,
  className = '',
  enableAI = true,
  enableScheduling = true,
  enableAnalytics = true 
}: FeedGridPlannerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<FeedPost['platform']>('instagram');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | FeedPost['status']>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a 3x3 grid with posts positioned by their position property
  const gridPosts = useMemo(() => {
    const grid: (FeedPost | null)[] = new Array(9).fill(null);
    const filteredPosts = posts.filter(post => 
      filterStatus === 'all' || post.status === filterStatus
    );
    
    filteredPosts.forEach(post => {
      if (post.position >= 0 && post.position < 9) {
        grid[post.position] = post;
      }
    });
    return grid;
  }, [posts, filterStatus]);

  // Analytics calculations
  const computedAnalytics = useMemo((): FeedAnalytics => {
    if (analytics) return analytics;
    
    const published = posts.filter(p => p.status === 'published');
    const totalEngagement = published.reduce((sum, post) => 
      sum + (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0), 0
    );
    
    return {
      totalPosts: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      scheduled: posts.filter(p => p.status === 'scheduled').length,
      drafts: posts.filter(p => p.status === 'draft').length,
      failed: posts.filter(p => p.status === 'failed').length,
      totalEngagement,
      avgEngagement: published.length > 0 ? totalEngagement / published.length : 0,
      topPerforming: published.sort((a, b) => 
        ((b.metrics?.engagement || 0) - (a.metrics?.engagement || 0))
      ).slice(0, 3),
      contentMix: {
        images: posts.filter(p => p.type === 'image').length,
        videos: posts.filter(p => p.type === 'video').length,
        carousels: posts.filter(p => p.type === 'carousel').length,
        stories: posts.filter(p => p.type === 'story').length,
      },
      platformDistribution: posts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      schedulingOptimization: {
        bestTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        engagementPeaks: [
          { time: '9:00 AM', engagement: 85 },
          { time: '12:00 PM', engagement: 92 },
          { time: '6:00 PM', engagement: 78 }
        ]
      }
    };
  }, [posts, analytics]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on empty slot
    if (overId.startsWith('slot-')) {
      const newPosition = parseInt(overId.replace('slot-', ''));
      const updatedPosts = posts.map(post => 
        post.id === activeId 
          ? { ...post, position: newPosition, updatedAt: new Date() }
          : post
      );
      onPostsChange(updatedPosts);
      toast.success('Post moved successfully');
    }
    // Handle swapping posts
    else if (activeId !== overId) {
      const activePost = posts.find(p => p.id === activeId);
      const overPost = posts.find(p => p.id === overId);
      
      if (activePost && overPost) {
        const updatedPosts = posts.map(post => {
          if (post.id === activeId) {
            return { ...post, position: overPost.position, updatedAt: new Date() };
          }
          if (post.id === overId) {
            return { ...post, position: activePost.position, updatedAt: new Date() };
          }
          return post;
        });
        onPostsChange(updatedPosts);
        toast.success('Posts swapped successfully');
      }
    }

    setActiveId(null);
  }, [posts, onPostsChange]);

  const createNewPost = useCallback((position: number) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      position,
      platform: selectedPlatform,
      status: 'draft',
      type: 'image',
      caption: '',
      hashtags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      autoOptimize: true
    };
    
    onPostsChange([...posts, newPost]);
    setSelectedPost(newPost);
    setShowPostEditor(true);
  }, [posts, onPostsChange, selectedPlatform]);

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList, position?: number) => {
    setIsUploading(true);
    
    try {
      const file = files[0];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload only images or videos');
        return;
      }

      // Create object URL for preview
      const mediaUrl = URL.createObjectURL(file);
      
      const newPost: FeedPost = {
        id: `post-${Date.now()}`,
        position: position ?? posts.length,
        [isVideo ? 'videoUrl' : 'imageUrl']: mediaUrl,
        mediaFiles: [file],
        platform: selectedPlatform,
        status: 'draft',
        type: isVideo ? 'video' : 'image',
        caption: '',
        hashtags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        autoOptimize: true
      };
      
      onPostsChange([...posts, newPost]);
      setSelectedPost(newPost);
      setShowPostEditor(true);
      
      toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [posts, onPostsChange, selectedPlatform]);

  // Bulk actions
  const handleBulkSchedule = useCallback(() => {
    const selectedPostObjects = posts.filter(p => selectedPosts.includes(p.id));
    if (selectedPostObjects.length === 0) {
      toast.error('Please select posts to schedule');
      return;
    }
    
    // Open bulk scheduling modal (would implement this)
    toast.info(`Scheduling ${selectedPostObjects.length} posts...`);
    setShowBulkActions(false);
  }, [posts, selectedPosts]);

  const handleBulkDelete = useCallback(() => {
    const updatedPosts = posts.filter(p => !selectedPosts.includes(p.id));
    onPostsChange(updatedPosts);
    setSelectedPosts([]);
    toast.success(`${selectedPosts.length} posts deleted`);
  }, [posts, selectedPosts, onPostsChange]);

  const generateAIContent = useCallback(async () => {
    if (!enableAI) return;
    
    toast.info('AI is generating content suggestions...');
    
    // Simulate AI generation
    setTimeout(() => {
      const aiPost: FeedPost = {
        id: `ai-post-${Date.now()}`,
        position: posts.length,
        caption: '🚀 Exciting updates coming your way! Stay tuned for something amazing. #innovation #exciting #comingsoon',
        hashtags: ['innovation', 'exciting', 'comingsoon', 'updates'],
        platform: selectedPlatform,
        status: 'draft',
        type: 'image',
        aiGenerated: true,
        autoOptimize: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onPostsChange([...posts, aiPost]);
      toast.success('AI content generated!');
    }, 2000);
  }, [posts, onPostsChange, selectedPlatform, enableAI]);

  const activePost = activeId ? posts.find(p => p.id === activeId) : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />

      {/* Grid Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Feed Grid Planner
          </h2>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as FeedPost['platform'])}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Posts</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>

          {enableAnalytics && (
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                showAnalytics 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          )}

          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
              showBulkActions 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Bulk Actions</span>
          </button>

          {enableAI && (
            <button
              onClick={generateAIContent}
              className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md flex items-center space-x-1 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Generate</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-1"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && enableAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Posts</h3>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{computedAnalytics.totalPosts}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</h3>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{computedAnalytics.published}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled</h3>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{computedAnalytics.scheduled}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Engagement</h3>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{computedAnalytics.avgEngagement.toFixed(1)}</p>
          </div>
        </motion.div>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bulk Actions ({selectedPosts.length} selected)
              </h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedPosts(posts.map(p => p.id))}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedPosts([])}
                  className="text-sm text-gray-500 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkSchedule}
                disabled={selectedPosts.length === 0}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center space-x-1"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              
              <button
                onClick={handleBulkDelete}
                disabled={selectedPosts.length === 0}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3x3 Feed Grid */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          {gridPosts.map((post, index) => (
            <GridSlot 
              key={`slot-${index}`} 
              position={index} 
              post={post}
              onCreatePost={createNewPost}
              onSelectPost={(post) => {
                setSelectedPost(post);
                setShowPostEditor(true);
              }}
              onToggleSelect={(postId) => {
                setSelectedPosts(prev => 
                  prev.includes(postId) 
                    ? prev.filter(id => id !== postId)
                    : [...prev, postId]
                );
              }}
              isSelected={post ? selectedPosts.includes(post.id) : false}
              showBulkActions={showBulkActions}
            />
          ))}
        </div>

        <DragOverlay>
          {activePost && <DraggablePost post={activePost} isDragging />}
        </DragOverlay>
      </DndContext>

      {/* Post Editor Modal */}
      <AnimatePresence>
        {showPostEditor && selectedPost && (
          <PostEditorModal
            post={selectedPost}
            onSave={(updatedPost) => {
              const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
              onPostsChange(updatedPosts);
              setShowPostEditor(false);
              setSelectedPost(null);
              toast.success('Post updated successfully!');
            }}
            onClose={() => {
              setShowPostEditor(false);
              setSelectedPost(null);
            }}
            enableScheduling={enableScheduling}
            platforms={[selectedPlatform]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}