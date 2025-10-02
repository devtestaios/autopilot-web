/**
 * Enhanced Social Media Service
 * Provides comprehensive third-party API integration and AI-powered features
 * for social media platform management
 * 
 * Features:
 * - Multi-platform OAuth authentication
 * - Real-time posting and scheduling
 * - AI-powered content generation
 * - Advanced analytics and sentiment analysis
 * - Automated engagement monitoring
 * - Competitor analysis
 */

import { 
  SocialMediaAccount, 
  SocialMediaPost, 
  SocialMediaComment,
  SocialMediaAccountInput,
  SocialMediaPostInput
} from '@/types';

export interface ThirdPartyPlatformConfig {
  platform: string;
  appId: string;
  appSecret: string;
  redirectUri: string;
  scope: string[];
  apiVersion?: string;
}

export interface AIContentSuggestion {
  id: string;
  content: string;
  hashtags: string[];
  mentions: string[];
  media_suggestions: string[];
  optimal_time: string;
  engagement_prediction: number;
  sentiment_score: number;
  platform_optimized: boolean;
  target_audience: string[];
  generated_at: string;
}

export interface CompetitorAnalysis {
  competitor_id: string;
  competitor_name: string;
  platform: string;
  followers_count: number;
  posting_frequency: number;
  avg_engagement_rate: number;
  top_hashtags: string[];
  content_themes: string[];
  posting_times: string[];
  growth_rate: number;
  analyzed_at: string;
}

export interface SentimentAnalysis {
  post_id: string;
  overall_sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // -1 to 1
  emotions: {
    joy: number;
    anger: number;
    sadness: number;
    fear: number;
    surprise: number;
  };
  keywords: string[];
  topics: string[];
  language: string;
  analyzed_at: string;
}

export interface OptimalPostingTime {
  platform: string;
  day_of_week: string;
  hour: number;
  engagement_potential: number;
  audience_size: number;
  competition_level: 'low' | 'medium' | 'high';
  recommended: boolean;
}

export interface SocialMediaInsights {
  account_id: string;
  platform: string;
  insights: {
    followers_growth: number;
    engagement_rate: number;
    reach: number;
    impressions: number;
    profile_views: number;
    website_clicks: number;
    top_performing_content: string[];
    audience_demographics: {
      age_groups: Record<string, number>;
      gender: Record<string, number>;
      locations: Record<string, number>;
      interests: string[];
    };
  };
  period: {
    start_date: string;
    end_date: string;
  };
  generated_at: string;
}

export class EnhancedSocialMediaService {
  private apiBase: string;
  private platforms: ThirdPartyPlatformConfig[];

  constructor(apiBase: string = process.env.NEXT_PUBLIC_API_BASE || 'https://autopilot-api-1.onrender.com') {
    this.apiBase = apiBase;
    this.platforms = this.initializePlatformConfigs();
  }

  private initializePlatformConfigs(): ThirdPartyPlatformConfig[] {
    // SSR-safe platform configuration
    const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return process.env.NEXT_PUBLIC_BASE_URL || 'https://pulsebridge.ai';
    };

    return [
      {
        platform: 'facebook',
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        appSecret: process.env.FACEBOOK_APP_SECRET || '',
        redirectUri: `${getBaseUrl()}/auth/facebook/callback`,
        scope: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list', 'instagram_basic', 'instagram_content_publish'],
        apiVersion: 'v18.0'
      },
      {
        platform: 'instagram',
        appId: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || '',
        appSecret: process.env.INSTAGRAM_APP_SECRET || '',
        redirectUri: `${getBaseUrl()}/auth/instagram/callback`,
        scope: ['instagram_basic', 'instagram_content_publish'],
        apiVersion: 'v18.0'
      },
      {
        platform: 'twitter',
        appId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '',
        appSecret: process.env.TWITTER_CLIENT_SECRET || '',
        redirectUri: `${getBaseUrl()}/auth/twitter/callback`,
        scope: ['tweet.read', 'tweet.write', 'users.read', 'follows.read', 'offline.access'],
        apiVersion: '2'
      },
      {
        platform: 'linkedin',
        appId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
        appSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirectUri: `${getBaseUrl()}/auth/linkedin/callback`,
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social', 'r_organization_social'],
      },
      {
        platform: 'tiktok',
        appId: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '',
        appSecret: process.env.TIKTOK_CLIENT_SECRET || '',
        redirectUri: `${getBaseUrl()}/auth/tiktok/callback`,
        scope: ['user.info.basic', 'video.publish', 'video.list'],
      }
    ];
  }

  // OAuth Authentication Methods
  async initiateOAuth(platform: string): Promise<string> {
    const config = this.platforms.find(p => p.platform === platform);
    if (!config) {
      throw new Error(`Platform ${platform} not supported`);
    }

    const response = await fetch(`${this.apiBase}/api/social-media/oauth/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, config })
    });

    const data = await response.json();
    return data.auth_url;
  }

  async completeOAuth(platform: string, code: string, state?: string): Promise<SocialMediaAccount> {
    const response = await fetch(`${this.apiBase}/api/social-media/oauth/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, code, state })
    });

    return await response.json();
  }

  async refreshAccessToken(accountId: string): Promise<SocialMediaAccount> {
    const response = await fetch(`${this.apiBase}/api/social-media/accounts/${accountId}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    return await response.json();
  }

  // AI-Powered Content Generation (Updated to use real Claude API)
  async generateContentSuggestions(options: {
    platform: string;
    topic?: string;
    tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
    target_audience?: string;
    include_hashtags?: boolean;
    content_length?: 'short' | 'medium' | 'long';
  }): Promise<AIContentSuggestion[]> {
    try {
      // Use the real backend AI endpoint
      const response = await fetch(`${this.apiBase}/api/social-media/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: options.platform,
          prompt: options.topic || 'Create engaging social media content',
          tone: options.tone || 'casual',
          content_type: 'post',
          target_audience: options.target_audience || 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert the response to match the expected format
      return [{
        id: Date.now().toString(),
        content: data.content,
        hashtags: data.hashtags || [],
        mentions: [],
        optimal_time: data.optimal_time,
        engagement_prediction: data.engagement_prediction || 0.75,
        platform: options.platform
      }];
    } catch (error) {
      console.error('Error generating AI content:', error);
      // Fallback to mock data if API fails
      return [{
        id: Date.now().toString(),
        content: `🌟 ${options.topic || 'Amazing content'} for ${options.platform}! What do you think? 💭`,
        hashtags: ['#content', '#social', `#${options.platform}`],
        mentions: [],
        optimal_time: { day: 'Tuesday', hour: 11, timezone: 'EST' },
        engagement_prediction: 0.75,
        platform: options.platform
      }];
    }
  }

  async optimizeContentForPlatform(content: string, platform: string): Promise<{
    optimized_content: string;
    hashtags: string[];
    optimal_length: number;
    engagement_prediction: number;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/api/social-media/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          prompt: `Optimize this content for ${platform}: ${content}`,
          tone: 'casual',
          content_type: 'post'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        optimized_content: data.content,
        hashtags: data.hashtags || [],
        optimal_length: data.content.length,
        engagement_prediction: data.engagement_prediction || 0.75
      };
    } catch (error) {
      console.error('Error optimizing content:', error);
      // Fallback
      return {
        optimized_content: content,
        hashtags: [`#${platform}`, '#content'],
        optimal_length: content.length,
        engagement_prediction: 0.75
      };
    }
  }

  async generateHashtagSuggestions(content: string, platform: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiBase}/api/social-media/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          prompt: `Generate hashtags for this ${platform} content: ${content}`,
          tone: 'casual',
          content_type: 'hashtags'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.hashtags || [`#${platform}`, '#content', '#social'];
    } catch (error) {
      console.error('Error generating hashtags:', error);
      // Fallback hashtags
      return [`#${platform}`, '#content', '#social'];
    }
  }

  // Advanced Analytics
  async analyzeSentiment(postId: string): Promise<SentimentAnalysis> {
    const response = await fetch(`${this.apiBase}/api/social-media/analytics/sentiment/${postId}`);
    return await response.json();
  }

  async getOptimalPostingTimes(accountId: string, platform?: string): Promise<OptimalPostingTime[]> {
    const params = platform ? `?platform=${platform}` : '';
    const response = await fetch(`${this.apiBase}/api/social-media/analytics/optimal-times/${accountId}${params}`);
    const data = await response.json();
    return data.optimal_times || [];
  }

  async getAccountInsights(accountId: string, period: { start_date: string; end_date: string }): Promise<SocialMediaInsights> {
    const response = await fetch(`${this.apiBase}/api/social-media/analytics/insights/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(period)
    });

    return await response.json();
  }

  async performCompetitorAnalysis(competitor_handles: string[], platform: string): Promise<CompetitorAnalysis[]> {
    const response = await fetch(`${this.apiBase}/api/social-media/analytics/competitor-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitor_handles, platform })
    });

    const data = await response.json();
    return data.analyses || [];
  }

  // Real Platform Publishing
  async publishToPlatforms(postData: any, targetAccountIds: string[]): Promise<{
    success: boolean;
    results: Record<string, any>;
    published_count: number;
    total_targets: number;
  }> {
    try {
      // First create the post in the database
      const createResponse = await fetch(`${this.apiBase}/api/social-media/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          target_accounts: targetAccountIds,
          status: 'publishing'
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create post: ${createResponse.status}`);
      }

      const createdPost = await createResponse.json();
      const postId = createdPost.id;

      // Then attempt to publish it
      const publishResponse = await fetch(`${this.apiBase}/api/social-media/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!publishResponse.ok) {
        throw new Error(`Failed to publish post: ${publishResponse.status}`);
      }

      const publishResult = await publishResponse.json();
      
      return {
        success: publishResult.published_to > 0,
        results: publishResult.results,
        published_count: publishResult.published_to,
        total_targets: publishResult.total_targets
      };

    } catch (error) {
      console.error('Error publishing to platforms:', error);
      throw error;
    }
  }

  async publishExistingPost(postId: string): Promise<{
    success: boolean;
    results: Record<string, any>;
    published_count: number;
    total_targets: number;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/api/social-media/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to publish post: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.published_to > 0,
        results: result.results,
        published_count: result.published_to,
        total_targets: result.total_targets
      };

    } catch (error) {
      console.error('Error publishing existing post:', error);
      throw error;
    }
  }

  // Automated Engagement
  async setupAutoEngagement(accountId: string, settings: {
    auto_like: boolean;
    auto_comment: boolean;
    auto_follow: boolean;
    target_hashtags: string[];
    engagement_rate_limit: number;
    response_templates: string[];
    sentiment_threshold: number;
  }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.apiBase}/api/social-media/automation/engagement/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });

    return await response.json();
  }

  async monitorMentions(accountId: string, keywords: string[]): Promise<{
    mentions: Array<{
      id: string;
      platform: string;
      author: string;
      content: string;
      sentiment: string;
      created_at: string;
      engagement: number;
    }>;
  }> {
    const response = await fetch(`${this.apiBase}/api/social-media/monitoring/mentions/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords })
    });

    return await response.json();
  }

  // Cross-Platform Publishing
  async publishToPlatforms(post: SocialMediaPostInput, targetPlatforms: string[]): Promise<{
    success: string[];
    failed: Array<{ platform: string; error: string }>;
    post_ids: Record<string, string>;
  }> {
    const response = await fetch(`${this.apiBase}/api/social-media/publishing/cross-platform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post, target_platforms: targetPlatforms })
    });

    return await response.json();
  }

  async schedulePost(post: SocialMediaPostInput, scheduledDate: string): Promise<SocialMediaPost> {
    const response = await fetch(`${this.apiBase}/api/social-media/scheduling/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, scheduled_date: scheduledDate })
    });

    return await response.json();
  }

  // Real-time Features
  async subscribeToRealTimeUpdates(accountId: string, callback: (update: any) => void): Promise<WebSocket | null> {
    // SSR-safe WebSocket creation
    if (typeof window === 'undefined') {
      console.warn('WebSocket not available in SSR environment');
      return null;
    }

    const wsUrl = `${this.apiBase.replace('http', 'ws')}/api/social-media/realtime/${accountId}`;
    
    try {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const update = JSON.parse(event.data);
        callback(update);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return null;
    }
  }

  async getDashboardMetrics(accountIds: string[]): Promise<{
    total_posts: number;
    total_engagement: number;
    total_followers: number;
    avg_engagement_rate: number;
    top_performing_post: SocialMediaPost;
    growth_metrics: {
      followers_growth: number;
      engagement_growth: number;
      content_performance: number;
    };
    platform_breakdown: Array<{
      platform: string;
      posts: number;
      engagement: number;
      followers: number;
    }>;
  }> {
    const response = await fetch(`${this.apiBase}/api/social-media/dashboard/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_ids: accountIds })
    });

    return await response.json();
  }
}

// Export singleton instance
export const socialMediaService = new EnhancedSocialMediaService();

// Export hook for easy usage in components
export function useSocialMediaService() {
  return socialMediaService;
}