'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Video, 
  Copy, 
  Trash2, 
  Eye, 
  Edit3,
  Hash,
  Share2,
  MoreVertical,
  Instagram,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Types
export interface FeedPost {
  id: string;
  position: number; // 0-8 for 3x3 grid
  imageUrl?: string;
  caption?: string;
  hashtags?: string[];
  scheduledDate?: Date;
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
  status: 'draft' | 'scheduled' | 'published';
  type: 'image' | 'video' | 'carousel' | 'story' | 'reel';
}

export interface FeedGridPlannerProps {
  posts: FeedPost[];
  onPostsChange: (posts: FeedPost[]) => void;
  className?: string;
}

// Draggable Post Component
function DraggablePost({ post, isOverlay = false }: { post: FeedPost; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeIcon = () => {
    switch (post.type) {
      case 'video': return <Video className="w-3 h-3" />;
      case 'carousel': return <Copy className="w-3 h-3" />;
      case 'story': return <ImageIcon className="w-3 h-3" />;
      case 'reel': return <Video className="w-3 h-3" />;
      default: return <ImageIcon className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (post.status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed 
        border-gray-300 dark:border-gray-600 cursor-pointer group hover:border-blue-500 
        transition-all duration-200 overflow-hidden
        ${isDragging ? 'z-50' : ''}
        ${isOverlay ? 'rotate-3 shadow-xl' : ''}
      `}
    >
      {post.imageUrl ? (
        <>
          <img 
            src={post.imageUrl} 
            alt={post.caption || 'Post content'} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                <Eye className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-blue-500 transition-colors">
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-xs text-center">Add Content</span>
        </div>
      )}
      
      {/* Status indicators */}
      <div className="absolute top-2 left-2 flex gap-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <div className="bg-white dark:bg-gray-800 rounded p-0.5">
          {getTypeIcon()}
        </div>
      </div>
      
      {/* Platform indicator */}
      <div className="absolute top-2 right-2">
        <Instagram className="w-3 h-3 text-pink-500" />
      </div>
      
      {/* Schedule indicator */}
      {post.scheduledDate && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
          {new Date(post.scheduledDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

// Empty Grid Slot Component
function EmptySlot({ position }: { position: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${position}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed 
        border-gray-300 dark:border-gray-600 flex items-center justify-center
        transition-all duration-200 group cursor-pointer
        ${isOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:border-blue-400'}
      `}
    >
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors text-center">
        <Plus className="w-6 h-6 mx-auto mb-1" />
        <span className="text-xs">Drop Here</span>
      </div>
    </div>
  );
}

// Main Feed Grid Planner Component
export default function FeedGridPlanner({ posts, onPostsChange, className = '' }: FeedGridPlannerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showPostEditor, setShowPostEditor] = useState(false);

  // Create a 3x3 grid with posts positioned by their position property
  const gridPosts = useMemo(() => {
    const grid: (FeedPost | null)[] = new Array(9).fill(null);
    posts.forEach(post => {
      if (post.position >= 0 && post.position < 9) {
        grid[post.position] = post;
      }
    });
    return grid;
  }, [posts]);

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
          ? { ...post, position: newPosition }
          : post
      );
      onPostsChange(updatedPosts);
    }
    // Handle swapping posts
    else if (activeId !== overId) {
      const activePost = posts.find(p => p.id === activeId);
      const overPost = posts.find(p => p.id === overId);
      
      if (activePost && overPost) {
        const updatedPosts = posts.map(post => {
          if (post.id === activeId) {
            return { ...post, position: overPost.position };
          }
          if (post.id === overId) {
            return { ...post, position: activePost.position };
          }
          return post;
        });
        onPostsChange(updatedPosts);
      }
    }

    setActiveId(null);
  }, [posts, onPostsChange]);

  const createNewPost = useCallback((position: number) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      position,
      platform: 'instagram',
      status: 'draft',
      type: 'image',
      caption: '',
      hashtags: []
    };
    
    onPostsChange([...posts, newPost]);
    setSelectedPost(newPost);
    setShowPostEditor(true);
  }, [posts, onPostsChange]);

  const activePost = activeId ? posts.find(p => p.id === activeId) : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Feed Preview</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Instagram className="w-3 h-3" />
            Instagram
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Feed Grid */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <SortableContext items={posts.map(p => p.id)}>
            {gridPosts.map((post, index) => (
              <div key={index}>
                {post ? (
                  <DraggablePost post={post} />
                ) : (
                  <div onClick={() => createNewPost(index)}>
                    <EmptySlot position={index} />
                  </div>
                )}
              </div>
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activePost && <DraggablePost post={activePost} isOverlay />}
        </DragOverlay>
      </DndContext>

      {/* Grid Analytics */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{posts.filter(p => p.status === 'published').length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Published</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-600">{posts.filter(p => p.status === 'scheduled').length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Scheduled</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-600">{posts.filter(p => p.status === 'draft').length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Drafts</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
        <Button variant="outline" size="sm">
          <Video className="w-4 h-4 mr-2" />
          Add Video
        </Button>
        <Button variant="outline" size="sm">
          <Hash className="w-4 h-4 mr-2" />
          Add Story
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Bulk Schedule
        </Button>
      </div>

      {/* Post Editor Modal */}
      <AnimatePresence>
        {showPostEditor && selectedPost && (
          <PostEditor
            post={selectedPost}
            onSave={(updatedPost) => {
              const updatedPosts = posts.map(p => 
                p.id === updatedPost.id ? updatedPost : p
              );
              onPostsChange(updatedPosts);
              setShowPostEditor(false);
              setSelectedPost(null);
            }}
            onClose={() => {
              setShowPostEditor(false);
              setSelectedPost(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Post Editor Modal Component
function PostEditor({ 
  post, 
  onSave, 
  onClose 
}: { 
  post: FeedPost; 
  onSave: (post: FeedPost) => void; 
  onClose: () => void; 
}) {
  const [editedPost, setEditedPost] = useState(post);

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
          <h3 className="text-lg font-semibold">Edit Post</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image/Video</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              {editedPost.imageUrl ? (
                <img src={editedPost.imageUrl} alt="Post" className="w-full h-32 object-cover rounded" />
              ) : (
                <div className="text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Click to upload media</p>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption</label>
            <Textarea
              value={editedPost.caption || ''}
              onChange={(e) => setEditedPost({ ...editedPost, caption: e.target.value })}
              placeholder="Write your caption..."
              rows={3}
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium mb-2">Hashtags</label>
            <Input
              value={editedPost.hashtags?.join(' ') || ''}
              onChange={(e) => setEditedPost({ 
                ...editedPost, 
                hashtags: e.target.value.split(' ').filter(tag => tag.trim()) 
              })}
              placeholder="#hashtag #example"
            />
          </div>

          {/* Schedule Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Schedule Date</label>
            <Input
              type="datetime-local"
              value={editedPost.scheduledDate ? new Date(editedPost.scheduledDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => setEditedPost({ 
                ...editedPost, 
                scheduledDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => onSave(editedPost)}
              className="flex-1"
            >
              Save Post
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}