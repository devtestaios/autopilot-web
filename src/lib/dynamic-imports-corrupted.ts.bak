/**
 * Dynamic Imports Utility - Performance Optimization
 * Centralized dynamic imports for heavy components with consistent loading states
 */

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Standard loading skeletons
const createLoadingSkeleton = (type: 'card' | 'dashboard' | 'analytics' | 'form') => {
  switch (type) {
    case 'card':
      return (
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      );
    
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      );
    
    case 'analytics':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      );
    
    case 'form':
      return (
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      );
    
    default:
      return (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
      );
  }
};

// AI Features - Optimized for heavy AI components
export const AIComponents = {
  AdvancedAnalytics: dynamic(
    () => import('@/components/AdvancedAnalyticsDashboard'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('analytics')
    }
  ),
  
  PredictiveEngine: dynamic(
    () => import('@/components/ai/PredictiveAnalyticsEngine'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
  
  EnhancedInsights: dynamic(
    () => import('@/components/EnhancedAIInsights'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('analytics')
    }
  ),
  
  AIChat: dynamic(
    () => import('@/components/UnifiedAIChat'),
    { 
      ssr: false,
      loading: () => (
        <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading AI Chat...</p>
          </div>
        </div>
      )
    }
  ),
  
  DashboardControl: dynamic(
    () => import('@/components/AIDashboardControl'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
};

// Campaign Features - Heavy campaign management components
export const CampaignComponents = {
  Builder: dynamic(
    () => import('@/components/campaigns/CampaignBuilder'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('form')
    }
  ),
  
  Analytics: dynamic(
    () => import('@/components/campaigns/CampaignAnalytics'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('analytics')
    }
  ),
  
  DetailView: dynamic(
    () => import('@/components/EnhancedCampaignDetailsPage'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
};

// Email Marketing Features - Heavy email components
export const EmailComponents = {
  Composer: dynamic(
    () => import('@/components/email/EmailComposer').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Email Composer Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('form')
    }
  ),
  
  Analytics: dynamic(
    () => import('@/components/email/EmailAnalytics').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Analytics Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('analytics')
    }
  ),
  
  Templates: dynamic(
    () => import('@/components/email/EmailTemplates').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Templates Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
};

// Content Creation Features - Heavy content tools
export const ContentComponents = {
  FeedPlanner: dynamic(
    () => import('@/components/content-suite/FeedGridPlanner'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
  
  AssetManager: dynamic(
    () => import('@/components/content-suite/AssetManager'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
  
  DesignStudio: dynamic(
    () => import('@/components/content-suite/DesignStudio'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('form')
    }
  ),
  
  AIGenerator: dynamic(
    () => import('@/components/content-suite/AIContentGenerator'),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('form')
    }
  ),
};

// Social Media Features - Heavy social components
export const SocialComponents = {
  Composer: dynamic(
    () => import('@/components/social/SocialComposer').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Social Composer Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('form')
    }
  ),
  
  Analytics: dynamic(
    () => import('@/components/social/SocialAnalytics').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Social Analytics Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('analytics')
    }
  ),
  
  Calendar: dynamic(
    () => import('@/components/social/SocialCalendar').catch(() => ({ 
      default: () => <div className="p-4 text-center text-gray-500">Calendar Loading...</div> 
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton('dashboard')
    }
  ),
};

// Utility function for creating custom dynamic imports
export const createDynamicComponent = (
  importPath: string, 
  loadingType: 'card' | 'dashboard' | 'analytics' | 'form' = 'card',
  fallbackText?: string
) => {
  return dynamic(
    () => import(importPath).catch(() => ({ 
      default: () => (
        <div className="p-4 text-center text-gray-500">
          {fallbackText || 'Component Loading...'}
        </div>
      )
    })),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton(loadingType)
    }
  );
};

export default {
  AIComponents,
  CampaignComponents,
  EmailComponents,
  ContentComponents,
  SocialComponents,
  createDynamicComponent,
};