'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { optimizedAPI } from '@/lib/performance/optimizedAPI';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
import { realAnalytics, trackingHelpers } from '@/lib/performance/realAnalytics';
import { SocialMediaAccount, SocialMediaPost } from '@/types';
import { useWebSocket } from '@/contexts/WebSocketContext';

// ==================== TYPES ====================

interface SocialMediaState {
  accounts: SocialMediaAccount[];
  posts: SocialMediaPost[];
  isLoading: {
    accounts: boolean;
    posts: boolean;
    creating: boolean;
  };
  errors: {
    accounts?: string;
    posts?: string;
    creating?: string;
  };
}

interface SocialMediaContextType extends SocialMediaState {
  loadAccounts: () => Promise<void>;
  loadPosts: () => Promise<void>;
  createPost: (post: Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  refreshData: () => Promise<void>;
  // Extended properties for enhanced functionality (Golden Compass: Domain 1)
  templates?: any[];
  analytics?: any;
  updatePost?: (id: string, updates: Partial<SocialMediaPost>) => Promise<void>;
  deletePost?: (id: string) => Promise<void>;
  schedulePost?: (post: any, scheduledDate: Date) => Promise<void>;
  connectAccount?: (platform: string, credentials: any) => Promise<void>;
  disconnectAccount?: (accountId: string) => Promise<void>;
  refreshAccountData?: (accountId: string) => Promise<void>;
}

// ==================== INITIAL STATE ====================

const initialState: SocialMediaState = {
  accounts: [],
  posts: [],
  isLoading: {
    accounts: false,
    posts: false,
    creating: false,
  },
  errors: {},
};

// ==================== REDUCER ====================

type SocialMediaAction =
  | { type: 'SET_LOADING'; payload: { key: keyof SocialMediaState['isLoading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof SocialMediaState['errors']; value?: string } }
  | { type: 'SET_ACCOUNTS'; payload: SocialMediaAccount[] }
  | { type: 'SET_POSTS'; payload: SocialMediaPost[] }
  | { type: 'ADD_POST'; payload: SocialMediaPost };

function socialMediaReducer(state: SocialMediaState, action: SocialMediaAction): SocialMediaState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload,
      };
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    default:
      return state;
  }
}

// ==================== CONTEXT ====================

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export function SocialMediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(socialMediaReducer, initialState);
  const { subscribe } = useWebSocket();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ==================== DATA LOADING ====================

  const loadAccounts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'accounts', value: undefined } });

    try {
      // Track feature usage with real analytics
      await trackingHelpers.trackAccountLoad(0); // Will update with actual count
      
      // Use the API client
      const accounts = await optimizedAPI.socialMedia.getAccounts();
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
      
      // Track successful load with real analytics
      await trackingHelpers.trackAccountLoad(accounts.length);
      
      // Also track with simple analytics for local metrics
      simpleAnalytics.trackPerformance('accounts_load_count', accounts.length);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load accounts';
      dispatch({ type: 'SET_ERROR', payload: { 
        key: 'accounts', 
        value: errorMessage
      }});
      
      // Track error with both analytics systems
      await realAnalytics.trackSocialMediaEvent('account_load_error', { error: errorMessage });
      simpleAnalytics.trackError(error, { context: 'load_accounts' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'accounts', value: false } });
    }
  }, []);

  const loadPosts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: true } });
    
    try {
      // Track feature usage
      simpleAnalytics.trackFeatureUsage('social_media', 'posts_loaded');
      
      // For now, create mock posts until API endpoint is implemented
      const mockPosts: SocialMediaPost[] = [
        {
          id: '1',
          content: 'Great marketing campaign results this week!',
          media_urls: [],
          target_accounts: ['account_1'],
          status: 'published',
          post_type: 'text',
          hashtags: ['#marketing', '#results'],
          mentions: [],
          engagement: { likes: 145, shares: 23, comments: 12, reach: 1200, impressions: 1500 },
          platform_post_ids: { instagram: 'ig_post_1' },
          approval_status: 'approved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          content: 'New product launch coming soon 🚀',
          media_urls: [],
          target_accounts: ['account_2'],
          status: 'scheduled',
          post_type: 'text',
          hashtags: ['#product', '#launch'],
          mentions: [],
          scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          engagement: { likes: 0, shares: 0, comments: 0, reach: 0, impressions: 0 },
          platform_post_ids: {},
          approval_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      dispatch({ type: 'SET_POSTS', payload: mockPosts });
      
      // Track performance
      simpleAnalytics.trackPerformance('posts_load_count', mockPosts.length);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load posts';
      dispatch({ type: 'SET_ERROR', payload: { 
        key: 'posts', 
        value: errorMessage
      }});
      simpleAnalytics.trackError(error, { context: 'load_posts' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: false } });
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'creating', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'creating', value: undefined } });

    try {
      // Track feature usage
      simpleAnalytics.trackFeatureUsage('social_media', 'post_created', { 
        post_type: postData.post_type,
        target_accounts: postData.target_accounts.length 
      });
      
      // Create mock post until API endpoint is implemented
      const newPost: SocialMediaPost = {
        ...postData,
        id: `post_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        engagement: { likes: 0, shares: 0, comments: 0, reach: 0, impressions: 0 }
      };
      
      dispatch({ type: 'ADD_POST', payload: newPost });
      
      // Track conversion
      simpleAnalytics.trackConversion('post_created', 1, { 
        post_type: postData.post_type,
        target_accounts: postData.target_accounts.length
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create post';
      dispatch({ type: 'SET_ERROR', payload: { 
        key: 'creating', 
        value: errorMessage
      }});
      simpleAnalytics.trackError(error, { context: 'create_post' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'creating', value: false } });
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([loadAccounts(), loadPosts()]);
  }, [loadAccounts, loadPosts]);

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    // Load initial data
    loadAccounts();
    loadPosts();

    // Track page view
    simpleAnalytics.trackPageView();

    // Set up WebSocket subscription for real-time updates
    const unsubscribe = subscribe('social_media_updates', (data: any) => {
      if (data.type === 'new_post') {
        dispatch({ type: 'ADD_POST', payload: data.post });
      } else if (data.type === 'account_update') {
        loadAccounts(); // Refresh accounts
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [loadAccounts, loadPosts, subscribe]);

  // ==================== CONTEXT VALUE ====================

  const contextValue: SocialMediaContextType = {
    ...state,
    loadAccounts,
    loadPosts,
    createPost,
    refreshData,
    // Extended properties with elegant defaults (Golden Compass: Domain 1 & 4)
    templates: [],
    analytics: null,
    updatePost: async (id: string, updates: Partial<SocialMediaPost>) => {
      console.log('updatePost placeholder implementation', { id, updates });
    },
    deletePost: async (id: string) => {
      console.log('deletePost placeholder implementation', { id });
    },
    schedulePost: async (post: any, scheduledDate: Date) => {
      console.log('schedulePost placeholder implementation', { post, scheduledDate });
    },
    connectAccount: async (platform: string, credentials: any) => {
      console.log('connectAccount placeholder implementation', { platform, credentials });
    },
    disconnectAccount: async (accountId: string) => {
      console.log('disconnectAccount placeholder implementation', { accountId });
    },
    refreshAccountData: async (accountId: string) => {
      console.log('refreshAccountData placeholder implementation', { accountId });
    },
  };

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

export default SocialMediaContext;