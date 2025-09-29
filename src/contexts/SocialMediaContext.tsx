/**
 * Social Media Platform Context
 * Enterprise-grade state management for social media operations
 * Features: Multi-platform posting, content scheduling, engagement tracking
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';

// ==================== TYPE DEFINITIONS ====================

export interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  username: string;
  displayName: string;
  avatar?: string;
  isConnected: boolean;
  followers: number;
  lastSync: Date;
  accessToken?: string;
  refreshToken?: string;
  permissions: string[];
  status: 'active' | 'expired' | 'limited' | 'suspended';
}

export interface SocialMediaPost {
  id: string;
  content: string;
  mediaUrls: string[];
  platforms: string[]; // Platform IDs to post to
  scheduledDate?: Date;
  publishedDate?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'deleted';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
    impressions: number;
  };
  hashtags: string[];
  mentions: string[];
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  mediaPlaceholders: number;
  variables: string[]; // Dynamic content variables like {brand}, {date}
  recommendedPlatforms: string[];
  tags: string[];
  usage: number;
  rating: number;
  createdAt: Date;
}

export interface SocialMediaAnalytics {
  accountId: string;
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    totalFollowers: number;
    followerGrowth: number;
    totalEngagement: number;
    engagementRate: number;
    totalReach: number;
    totalImpressions: number;
    topPost: SocialMediaPost;
    avgPostsPerDay: number;
    bestPostingTime: string;
    audienceDemographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
  };
  trends: {
    hashtags: Array<{tag: string; usage: number; growth: number}>;
    mentions: Array<{user: string; count: number; sentiment: 'positive' | 'negative' | 'neutral'}>;
    engagementByTime: Array<{hour: number; engagement: number}>;
  };
  competitors: Array<{
    name: string;
    username: string;
    followers: number;
    engagement: number;
    growth: number;
  }>;
}

export interface SocialMediaState {
  // Account Management
  accounts: SocialMediaAccount[];
  selectedAccount: SocialMediaAccount | null;
  
  // Content Management  
  posts: SocialMediaPost[];
  drafts: SocialMediaPost[];
  scheduledPosts: SocialMediaPost[];
  templates: ContentTemplate[];
  
  // Analytics
  analytics: Record<string, SocialMediaAnalytics>;
  
  // UI State
  loading: {
    accounts: boolean;
    posts: boolean;
    publishing: boolean;
    analytics: boolean;
  };
  
  // Errors
  errors: {
    accounts?: string;
    posts?: string;
    publishing?: string;
    analytics?: string;
  };
  
  // Features
  features: {
    aiContentGeneration: boolean;
    autoScheduling: boolean;
    competitorTracking: boolean;
    influencerDiscovery: boolean;
  };
}

// ==================== ACTION TYPES ====================

type SocialMediaAction =
  | { type: 'SET_LOADING'; payload: { key: keyof SocialMediaState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof SocialMediaState['errors']; value: string | undefined } }
  | { type: 'SET_ACCOUNTS'; payload: SocialMediaAccount[] }
  | { type: 'ADD_ACCOUNT'; payload: SocialMediaAccount }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<SocialMediaAccount> } }
  | { type: 'REMOVE_ACCOUNT'; payload: string }
  | { type: 'SELECT_ACCOUNT'; payload: SocialMediaAccount | null }
  | { type: 'SET_POSTS'; payload: SocialMediaPost[] }
  | { type: 'ADD_POST'; payload: SocialMediaPost }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<SocialMediaPost> } }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: ContentTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: ContentTemplate }
  | { type: 'SET_ANALYTICS'; payload: { accountId: string; analytics: SocialMediaAnalytics } }
  | { type: 'UPDATE_FEATURES'; payload: Partial<SocialMediaState['features']> }
  | { type: 'RESET_STATE' };

// ==================== REDUCER ====================

const initialState: SocialMediaState = {
  accounts: [],
  selectedAccount: null,
  posts: [],
  drafts: [],
  scheduledPosts: [],
  templates: [],
  analytics: {},
  loading: {
    accounts: false,
    posts: false,
    publishing: false,
    analytics: false,
  },
  errors: {},
  features: {
    aiContentGeneration: true,
    autoScheduling: true,
    competitorTracking: true,
    influencerDiscovery: false,
  },
};

function socialMediaReducer(state: SocialMediaState, action: SocialMediaAction): SocialMediaState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };

    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };

    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };

    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.id
            ? { ...account, ...action.payload.updates }
            : account
        ),
      };

    case 'REMOVE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter((account) => account.id !== action.payload),
        selectedAccount: 
          state.selectedAccount?.id === action.payload ? null : state.selectedAccount,
      };

    case 'SELECT_ACCOUNT':
      return { ...state, selectedAccount: action.payload };

    case 'SET_POSTS':
      return { 
        ...state, 
        posts: action.payload,
        drafts: action.payload.filter(p => p.status === 'draft'),
        scheduledPosts: action.payload.filter(p => p.status === 'scheduled'),
      };

    case 'ADD_POST':
      const newPosts = [...state.posts, action.payload];
      return {
        ...state,
        posts: newPosts,
        drafts: newPosts.filter(p => p.status === 'draft'),
        scheduledPosts: newPosts.filter(p => p.status === 'scheduled'),
      };

    case 'UPDATE_POST':
      const updatedPosts = state.posts.map((post) =>
        post.id === action.payload.id
          ? { ...post, ...action.payload.updates }
          : post
      );
      return {
        ...state,
        posts: updatedPosts,
        drafts: updatedPosts.filter(p => p.status === 'draft'),
        scheduledPosts: updatedPosts.filter(p => p.status === 'scheduled'),
      };

    case 'DELETE_POST':
      const filteredPosts = state.posts.filter((post) => post.id !== action.payload);
      return {
        ...state,
        posts: filteredPosts,
        drafts: filteredPosts.filter(p => p.status === 'draft'),
        scheduledPosts: filteredPosts.filter(p => p.status === 'scheduled'),
      };

    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };

    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };

    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          [action.payload.accountId]: action.payload.analytics,
        },
      };

    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: { ...state.features, ...action.payload },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ==================== CONTEXT ====================

interface SocialMediaContextType extends SocialMediaState {
  // Account Management
  connectAccount: (platform: string, credentials: any) => Promise<void>;
  disconnectAccount: (accountId: string) => Promise<void>;
  refreshAccount: (accountId: string) => Promise<void>;
  selectAccount: (account: SocialMediaAccount | null) => void;
  
  // Content Management
  createPost: (postData: Omit<SocialMediaPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (postId: string, updates: Partial<SocialMediaPost>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  publishPost: (postId: string) => Promise<void>;
  schedulePost: (postId: string, scheduledDate: Date) => Promise<void>;
  
  // Template Management
  createTemplate: (templateData: Omit<ContentTemplate, 'id' | 'usage' | 'rating' | 'createdAt'>) => Promise<void>;
  useTemplate: (templateId: string, variables?: Record<string, string>) => SocialMediaPost;
  
  // Analytics
  fetchAnalytics: (accountId: string, timeframe: SocialMediaAnalytics['timeframe']) => Promise<void>;
  
  // AI Features
  generateContent: (prompt: string, platform: string) => Promise<string>;
  optimizePostTime: (content: string, platforms: string[]) => Promise<Date>;
  
  // Real-time Updates
  subscribeToUpdates: () => void;
}

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export function SocialMediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(socialMediaReducer, initialState);
  const { subscribe } = useWebSocket();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ==================== ACCOUNT MANAGEMENT ====================

  const connectAccount = useCallback(async (platform: string, credentials: any) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'accounts', value: undefined } });

    try {
      const response = await fetch('/api/social-media/accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, credentials }),
      });

      if (!response.ok) {
        throw new Error(`Failed to connect ${platform} account`);
      }

      const newAccount: SocialMediaAccount = await response.json();
      dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
      
// TODO: Fix toast integration
      // // toast(`${platform} account connected successfully`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect account';
      dispatch({ type: 'SET_ERROR', payload: { key: 'accounts', value: message } });
      // toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: false } });
    }
  }, []);

  const disconnectAccount = useCallback(async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-media/accounts/${accountId}/disconnect`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      dispatch({ type: 'REMOVE_ACCOUNT', payload: accountId });
      // toast('Account disconnected successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect account';
      // toast(message, 'error');
    }
  }, []);

  const refreshAccount = useCallback(async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-media/accounts/${accountId}/refresh`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh account');
      }

      const updatedAccount = await response.json();
      dispatch({ 
        type: 'UPDATE_ACCOUNT', 
        payload: { id: accountId, updates: updatedAccount } 
      });
    } catch (error) {
      console.error('Failed to refresh account:', error);
    }
  }, []);

  const selectAccount = useCallback((account: SocialMediaAccount | null) => {
    dispatch({ type: 'SELECT_ACCOUNT', payload: account });
  }, []);

  // ==================== CONTENT MANAGEMENT ====================

  const createPost = useCallback(async (postData: Omit<SocialMediaPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: true } });

    try {
      const response = await fetch('/api/social-media/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost: SocialMediaPost = await response.json();
      dispatch({ type: 'ADD_POST', payload: newPost });
      
      // toast('Post created successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      // toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: false } });
    }
  }, []);

  const publishPost = useCallback(async (postId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'publishing', value: true } });

    try {
      const response = await fetch(`/api/social-media/posts/${postId}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      dispatch({ 
        type: 'UPDATE_POST', 
        payload: { 
          id: postId, 
          updates: { status: 'published', publishedDate: new Date() } 
        } 
      });
      
      // toast('Post published successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish post';
      // toast(message, 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'publishing', value: false } });
    }
  }, []);

  // ==================== AI FEATURES ====================

  const generateContent = useCallback(async (prompt: string, platform: string): Promise<string> => {
    try {
      const response = await fetch('/api/social-media/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const { content } = await response.json();
      return content;
    } catch (error) {
      console.error('AI content generation failed:', error);
      throw error;
    }
  }, []);

  // ==================== REAL-TIME UPDATES ====================

  const subscribeToUpdates = useCallback(() => {
    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    const unsubscribeFn = subscribe('social-media', (data) => {
      switch (data.type) {
        case 'account_updated':
          dispatch({ 
            type: 'UPDATE_ACCOUNT', 
            payload: { id: data.accountId, updates: data.updates } 
          });
          break;
        case 'post_engagement_updated':
          dispatch({ 
            type: 'UPDATE_POST', 
            payload: { id: data.postId, updates: { engagement: data.engagement } } 
          });
          break;
        default:
          break;
      }
    });
    
    unsubscribeRef.current = unsubscribeFn;
  }, [subscribe]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: true } });
        
        // ✅ ENHANCED: Fetch data individually with proper error handling
        const fetchEndpoint = async (url: string, fallback: any[] = []) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              return await response.json();
            } else {
              console.warn(`API endpoint ${url} returned ${response.status}, using fallback data`);
              return fallback;
            }
          } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
            return fallback;
          }
        };

        const [accounts, templates] = await Promise.all([
          fetchEndpoint('/api/social-media/accounts', []),
          fetchEndpoint('/api/social-media/templates', []),
        ]);

        dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Set fallback data to prevent undefined state
        dispatch({ type: 'SET_ACCOUNTS', payload: [] });
        dispatch({ type: 'SET_TEMPLATES', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: false } });
      }
    };

    loadInitialData();
    subscribeToUpdates();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [subscribeToUpdates]);

  // ==================== MEMOIZED CONTEXT VALUE ====================

  const contextValue = useMemo(() => ({
    ...state,
    connectAccount,
    disconnectAccount,
    refreshAccount,
    selectAccount,
    createPost,
    updatePost: async (postId: string, updates: Partial<SocialMediaPost>) => {
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates } });
    },
    deletePost: async (postId: string) => {
      dispatch({ type: 'DELETE_POST', payload: postId });
    },
    publishPost,
    schedulePost: async (postId: string, scheduledDate: Date) => {
      dispatch({ 
        type: 'UPDATE_POST', 
        payload: { id: postId, updates: { scheduledDate, status: 'scheduled' } } 
      });
    },
    createTemplate: async (templateData: Omit<ContentTemplate, 'id' | 'usage' | 'rating' | 'createdAt'>) => {
      // Implementation would go here
    },
    useTemplate: (templateId: string, variables?: Record<string, string>): SocialMediaPost => {
      // Implementation would return a new post based on template
      return {} as SocialMediaPost;
    },
    fetchAnalytics: async (accountId: string, timeframe: SocialMediaAnalytics['timeframe']) => {
      // Implementation would go here
    },
    generateContent,
    optimizePostTime: async (content: string, platforms: string[]): Promise<Date> => {
      // AI-powered optimal posting time
      return new Date();
    },
    subscribeToUpdates,
  }), [state, connectAccount, disconnectAccount, refreshAccount, selectAccount, createPost, publishPost, generateContent, subscribeToUpdates]);

  return (
    <SocialMediaContext.Provider value={contextValue}>
      {children}
    </SocialMediaContext.Provider>
  );
}

// ==================== HOOK ====================

export function useSocialMedia() {
  const context = useContext(SocialMediaContext);
  if (context === undefined) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
}