/**
 * Social Media Posts API
 * Handles CRUD operations for social media posts
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock posts data (in production, this would come from database)
const mockPosts: any[] = [
  {
    id: 'post-001',
    content: '🚀 Excited to announce our latest product launch! Revolutionary features that will transform how you work. #Innovation #ProductLaunch #TechNews',
    mediaUrls: ['https://via.placeholder.com/600x400'],
    platforms: ['sm-001', 'sm-002', 'sm-003'],
    scheduledDate: null,
    publishedDate: new Date('2025-01-25T14:30:00Z'),
    status: 'published',
    engagement: {
      likes: 342,
      shares: 89,
      comments: 47,
      reach: 15420,
      impressions: 23680
    },
    hashtags: ['Innovation', 'ProductLaunch', 'TechNews'],
    mentions: [],
    createdAt: new Date('2025-01-25T14:00:00Z'),
    updatedAt: new Date('2025-01-25T14:30:00Z')
  },
  {
    id: 'post-002',
    content: '💡 Monday Motivation: Success is not final, failure is not fatal. It\'s the courage to continue that counts. What\'s motivating you this week?',
    mediaUrls: [],
    platforms: ['sm-001', 'sm-003'],
    scheduledDate: new Date('2025-01-27T09:00:00Z'),
    publishedDate: null,
    status: 'scheduled',
    engagement: {
      likes: 0,
      shares: 0,
      comments: 0,
      reach: 0,
      impressions: 0
    },
    hashtags: ['MondayMotivation', 'Success', 'Inspiration'],
    mentions: [],
    createdAt: new Date('2025-01-26T16:00:00Z'),
    updatedAt: new Date('2025-01-26T16:00:00Z')
  },
  {
    id: 'post-003',
    content: 'Working on something amazing... 🎨✨ Can\'t wait to share what we\'ve been building! #ComingSoon #BehindTheScenes',
    mediaUrls: ['https://via.placeholder.com/600x400'],
    platforms: ['sm-002'],
    scheduledDate: null,
    publishedDate: null,
    status: 'draft',
    engagement: {
      likes: 0,
      shares: 0,
      comments: 0,
      reach: 0,
      impressions: 0
    },
    hashtags: ['ComingSoon', 'BehindTheScenes'],
    mentions: [],
    createdAt: new Date('2025-01-26T11:00:00Z'),
    updatedAt: new Date('2025-01-26T11:00:00Z')
  }
];

// GET /api/social-media/posts - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let filteredPosts = [...mockPosts];
    
    // Filter by status if provided
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }
    
    // Filter by platform if provided
    if (platform) {
      filteredPosts = filteredPosts.filter(post => 
        post.platforms.includes(platform)
      );
    }
    
    // Apply limit
    filteredPosts = filteredPosts.slice(0, limit);
    
    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(filteredPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/social-media/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();
    
    // Validate required fields
    if (!postData.content || !postData.platforms || postData.platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and at least one platform are required' },
        { status: 400 }
      );
    }
    
    // Create new post
    const newPost = {
      id: `post-${Date.now()}`,
      content: postData.content,
      mediaUrls: postData.mediaUrls || [],
      platforms: postData.platforms,
      scheduledDate: postData.scheduledDate ? new Date(postData.scheduledDate) : null,
      publishedDate: null,
      status: postData.scheduledDate ? 'scheduled' : 'draft',
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        reach: 0,
        impressions: 0
      },
      hashtags: extractHashtags(postData.content),
      mentions: extractMentions(postData.content),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In production, this would save to database
    mockPosts.push(newPost);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// Helper functions
function extractHashtags(content: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(content)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags;
}

function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}