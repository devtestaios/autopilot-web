'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  fetchIntegrationApps,
  fetchUserIntegrations,
  fetchIntegrationsOverview
} from '@/lib/api';
import { realAnalytics, trackingHelpers } from '@/lib/performance/realAnalytics';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
import type { 
  IntegrationApp as APIIntegrationApp,
  UserIntegration
} from '@/types';

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface IntegrationApp {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'productivity' | 'analytics' | 'design' | 'development' | 'marketing' | 'finance' | 'hr' | 'sales' | 'other';
  subcategory?: string;
  icon: string;
  coverImage?: string;
  developer: {
    name: string;
    website: string;
    email: string;
    verified: boolean;
  };
  pricing: {
    model: 'free' | 'freemium' | 'paid' | 'subscription';
    price?: number;
    currency?: string;
    billingCycle?: 'monthly' | 'yearly' | 'one-time';
  };
  features: string[];
  permissions: string[];
  rating: {
    average: number;
    count: number;
    distribution: { [key: number]: number };
  };
  compatibility: {
    platforms: string[];
    minVersion: string;
    maxVersion?: string;
  };
  status: 'active' | 'deprecated' | 'beta' | 'coming-soon';
  version: string;
  releaseDate: Date;
  lastUpdated: Date;
  downloadCount: number;
  isInstalled: boolean;
  isEnabled: boolean;
  configurable: boolean;
  webhookSupport: boolean;
  apiEndpoints?: string[];
  documentation?: string;
  supportUrl?: string;
  tags: string[];
}

export interface InstalledIntegration {
  appId: string;
  installedAt: Date;
  version: string;
  isEnabled: boolean;
  configuration: Record<string, any>;
  apiKeys?: Record<string, string>;
  webhookUrls?: string[];
  customFields?: Record<string, any>;
  lastSync?: Date;
  syncStatus: 'active' | 'error' | 'paused';
  errorMessage?: string;
  usage: {
    apiCalls: number;
    lastUsed: Date;
    monthlyLimit?: number;
  };
}

export interface IntegrationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  featured: boolean;
}

export interface IntegrationReview {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

// ============================================================================
// INTEGRATIONS CONTEXT
// ============================================================================

interface IntegrationsContextValue {
  // ========== APP DISCOVERY ==========
  availableApps: IntegrationApp[];
  featuredApps: IntegrationApp[];
  categories: IntegrationCategory[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'popular' | 'recent' | 'rating' | 'name';
  
  // ========== SEARCH & FILTERING ==========
  searchApps: (query: string) => void;
  filterByCategory: (categoryId: string) => void;
  setSortBy: (sort: 'popular' | 'recent' | 'rating' | 'name') => void;
  getFilteredApps: () => IntegrationApp[];
  
  // ========== INSTALLATION MANAGEMENT ==========
  installedApps: InstalledIntegration[];
  installApp: (appId: string) => Promise<boolean>;
  uninstallApp: (appId: string) => Promise<boolean>;
  enableApp: (appId: string) => Promise<boolean>;
  disableApp: (appId: string) => Promise<boolean>;
  updateApp: (appId: string) => Promise<boolean>;
  
  // ========== CONFIGURATION ==========
  configureApp: (appId: string, config: Record<string, any>) => Promise<boolean>;
  getAppConfiguration: (appId: string) => Record<string, any> | null;
  testConnection: (appId: string) => Promise<boolean>;
  syncApp: (appId: string) => Promise<boolean>;
  
  // ========== REVIEWS & RATINGS ==========
  reviews: IntegrationReview[];
  addReview: (appId: string, review: Omit<IntegrationReview, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => Promise<void>;
  getAppReviews: (appId: string) => IntegrationReview[];
  
  // ========== USAGE ANALYTICS ==========
  getUsageStats: (appId?: string) => {
    totalApiCalls: number;
    activeIntegrations: number;
    monthlyUsage: number;
    topApps: { appId: string; name: string; usage: number }[];
  };
  
  // ========== DEVELOPER TOOLS ==========
  createCustomIntegration: (config: Partial<IntegrationApp>) => Promise<string>;
  publishApp: (appId: string) => Promise<boolean>;
  getWebhookLogs: (appId: string) => any[];
  
  // ========== STATE ==========
  isLoading: boolean;
  error: string | null;
  refreshApps: () => Promise<void>;
}

const IntegrationsContext = createContext<IntegrationsContextValue | undefined>(undefined);

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

const generateMockApps = (): IntegrationApp[] => {
  const categories = [
    'communication', 'productivity', 'analytics', 'design', 'development', 
    'marketing', 'finance', 'hr', 'sales'
  ];
  
  const sampleApps = [
    {
      name: 'Slack Integration',
      description: 'Connect your workspace with Slack for seamless team communication and project updates.',
      category: 'communication' as const,
      icon: '💬',
      developer: { name: 'Slack Technologies', website: 'https://slack.com', email: 'api@slack.com', verified: true },
      features: ['Real-time notifications', 'Channel integration', 'Bot commands', 'File sharing'],
      permissions: ['channels:read', 'chat:write', 'files:read'],
      tags: ['team', 'chat', 'notifications', 'messaging']
    },
    {
      name: 'Google Analytics',
      description: 'Track and analyze your website traffic, user behavior, and conversion metrics.',
      category: 'analytics' as const,
      icon: '📊',
      developer: { name: 'Google LLC', website: 'https://analytics.google.com', email: 'support@google.com', verified: true },
      features: ['Traffic analysis', 'Conversion tracking', 'Custom reports', 'Real-time data'],
      permissions: ['analytics:read', 'reports:generate'],
      tags: ['analytics', 'tracking', 'reports', 'google']
    },
    {
      name: 'Figma Design Sync',
      description: 'Sync design assets and prototypes directly from Figma into your projects.',
      category: 'design' as const,
      icon: '🎨',
      developer: { name: 'Figma Inc.', website: 'https://figma.com', email: 'api@figma.com', verified: true },
      features: ['Asset sync', 'Prototype embedding', 'Version control', 'Team collaboration'],
      permissions: ['designs:read', 'projects:write'],
      tags: ['design', 'prototyping', 'assets', 'collaboration']
    },
    {
      name: 'GitHub Actions',
      description: 'Automate your development workflow with GitHub Actions integration.',
      category: 'development' as const,
      icon: '🔧',
      developer: { name: 'GitHub Inc.', website: 'https://github.com', email: 'support@github.com', verified: true },
      features: ['CI/CD automation', 'Code deployment', 'Issue tracking', 'Pull request integration'],
      permissions: ['repos:read', 'actions:write', 'issues:read'],
      tags: ['development', 'automation', 'cicd', 'git']
    },
    {
      name: 'Mailchimp Marketing',
      description: 'Integrate your email marketing campaigns with automated workflows.',
      category: 'marketing' as const,
      icon: '📧',
      developer: { name: 'Mailchimp', website: 'https://mailchimp.com', email: 'api@mailchimp.com', verified: true },
      features: ['Email automation', 'Audience segmentation', 'Campaign analytics', 'A/B testing'],
      permissions: ['campaigns:read', 'audiences:write', 'reports:read'],
      tags: ['email', 'marketing', 'automation', 'campaigns']
    },
    {
      name: 'Stripe Payments',
      description: 'Process payments and manage subscriptions with Stripe integration.',
      category: 'finance' as const,
      icon: '💳',
      developer: { name: 'Stripe Inc.', website: 'https://stripe.com', email: 'support@stripe.com', verified: true },
      features: ['Payment processing', 'Subscription management', 'Invoice generation', 'Analytics'],
      permissions: ['payments:write', 'customers:read', 'invoices:write'],
      tags: ['payments', 'finance', 'subscriptions', 'billing']
    },
    {
      name: 'Notion Database',
      description: 'Sync and manage your Notion databases with project data.',
      category: 'productivity' as const,
      icon: '📝',
      developer: { name: 'Notion Labs', website: 'https://notion.so', email: 'api@notion.so', verified: true },
      features: ['Database sync', 'Content management', 'Templates', 'Collaboration'],
      permissions: ['databases:read', 'pages:write'],
      tags: ['productivity', 'database', 'content', 'organization']
    },
    {
      name: 'Zapier Workflows',
      description: 'Connect with 5000+ apps through Zapier\'s automation platform.',
      category: 'productivity' as const,
      icon: '⚡',
      developer: { name: 'Zapier Inc.', website: 'https://zapier.com', email: 'support@zapier.com', verified: true },
      features: ['Multi-app workflows', 'Trigger automation', 'Data transformation', 'Error handling'],
      permissions: ['workflows:write', 'triggers:read'],
      tags: ['automation', 'workflows', 'integration', 'productivity']
    }
  ];

  return sampleApps.map((app, index) => ({
    id: `app_${index + 1}`,
    ...app,
    subcategory: app.category,
    coverImage: `https://picsum.photos/400/200?random=${index}`,
    pricing: {
      model: ['free', 'freemium', 'paid'][Math.floor(Math.random() * 3)] as any,
      price: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 5 : undefined,
      currency: 'USD',
      billingCycle: 'monthly' as const
    },
    rating: {
      average: 3.5 + Math.random() * 1.5,
      count: Math.floor(Math.random() * 1000) + 50,
      distribution: {
        5: Math.floor(Math.random() * 300) + 100,
        4: Math.floor(Math.random() * 200) + 80,
        3: Math.floor(Math.random() * 100) + 30,
        2: Math.floor(Math.random() * 50) + 10,
        1: Math.floor(Math.random() * 20) + 5
      }
    },
    compatibility: {
      platforms: ['web', 'mobile'],
      minVersion: '1.0.0'
    },
    status: 'active' as const,
    version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    downloadCount: Math.floor(Math.random() * 50000) + 1000,
    isInstalled: Math.random() > 0.7,
    isEnabled: Math.random() > 0.3,
    configurable: true,
    webhookSupport: Math.random() > 0.5,
    apiEndpoints: [`/api/integrations/${app.name.toLowerCase().replace(/\s+/g, '-')}`],
    documentation: `https://docs.example.com/${app.name.toLowerCase().replace(/\s+/g, '-')}`,
    supportUrl: `https://support.example.com/${app.name.toLowerCase().replace(/\s+/g, '-')}`
  }));
};

const generateCategories = (apps: IntegrationApp[]): IntegrationCategory[] => {
  const categoryData = {
    communication: { name: 'Communication', icon: '💬', color: 'blue' },
    productivity: { name: 'Productivity', icon: '⚡', color: 'green' },
    analytics: { name: 'Analytics', icon: '📊', color: 'purple' },
    design: { name: 'Design', icon: '🎨', color: 'pink' },
    development: { name: 'Development', icon: '🔧', color: 'orange' },
    marketing: { name: 'Marketing', icon: '📧', color: 'red' },
    finance: { name: 'Finance', icon: '💳', color: 'yellow' },
    hr: { name: 'HR & People', icon: '👥', color: 'indigo' },
    sales: { name: 'Sales & CRM', icon: '💼', color: 'cyan' }
  };

  return Object.entries(categoryData).map(([id, data]) => ({
    id,
    ...data,
    description: `Powerful ${data.name.toLowerCase()} tools and integrations`,
    count: apps.filter(app => app.category === id).length,
    featured: Math.random() > 0.6
  }));
};

// ============================================================================
// INTEGRATIONS PROVIDER
// ============================================================================

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  // ========== STATE ==========
  const [availableApps, setAvailableApps] = useState<IntegrationApp[]>([]);
  const [installedApps, setInstalledApps] = useState<InstalledIntegration[]>([]);
  const [reviews, setReviews] = useState<IntegrationReview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'name'>('popular');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== INITIAL DATA LOADING ==========
  useEffect(() => {
    // Helper function to map API categories to context categories
    const mapApiCategoryToContextCategory = (apiCategory: string): IntegrationApp['category'] => {
      const categoryMap: Record<string, IntegrationApp['category']> = {
        'Analytics': 'analytics',
        'Email Marketing': 'marketing',
        'Communication': 'communication',
        'Social Media': 'marketing',
        'Productivity': 'productivity',
        'Design': 'design',
        'Development': 'development',
        'Finance': 'finance',
        'HR': 'hr',
        'Sales': 'sales'
      };
      return categoryMap[apiCategory] || 'other';
    };

    // Helper function to get default icons for categories
    const getDefaultIconForCategory = (category: string): string => {
      const iconMap: Record<string, string> = {
        'Analytics': '📊',
        'Email Marketing': '📧',
        'Communication': '💬',
        'Social Media': '📱',
        'Productivity': '⚡',
        'Design': '🎨',
        'Development': '💻',
        'Finance': '💰',
        'HR': '👥',
        'Sales': '📈'
      };
      return iconMap[category] || '🔧';
    };

    const convertApiAppToContextApp = (apiApp: any): IntegrationApp => ({
      id: apiApp.id,
      name: apiApp.name,
      description: apiApp.description,
      category: mapApiCategoryToContextCategory(apiApp.category),
      subcategory: undefined,
      icon: apiApp.logo_url || getDefaultIconForCategory(apiApp.category),
      coverImage: undefined,
      developer: {
        name: apiApp.name, // Use app name as developer name for now
        website: apiApp.website_url || '#',
        email: 'support@pulsebridge.ai',
        verified: apiApp.status === 'active'
      },
      pricing: {
        model: apiApp.pricing_model as any,
        price: apiApp.base_price || 0,
        currency: 'USD',
        billingCycle: 'monthly' as const
      },
      features: apiApp.features || [],
      permissions: [],
      rating: {
        average: apiApp.rating || 4.2,
        count: Math.floor(Math.random() * 100) + 10,
        distribution: { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
      },
      compatibility: {
        platforms: ['web'],
        minVersion: '1.0.0'
      },
      status: apiApp.status === 'active' ? 'active' : 'deprecated',
      version: '1.0.0',
      releaseDate: new Date(apiApp.created_at),
      lastUpdated: new Date(apiApp.created_at),
      downloadCount: apiApp.install_count || 0,
      isInstalled: false,
      isEnabled: false,
      configurable: true,
      webhookSupport: false,
      apiEndpoints: apiApp.api_documentation_url || '',
      documentation: apiApp.api_documentation_url || '',
      supportUrl: apiApp.website_url || '',
      tags: [apiApp.category?.toLowerCase()].filter(Boolean)
    });

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [apps, userIntegrations] = await Promise.all([
          fetchIntegrationApps({ limit: 100 }),
          fetchUserIntegrations({ limit: 50 }).catch(error => {
            console.warn('Failed to fetch user integrations:', error);
            return [];
          }),
        ]);

        // ✅ DATABASE CONNECTED: Always use real API data
        const apiAppsArray = Array.isArray(apps) ? apps : (apps?.apps || []);
        const contextApps = apiAppsArray.map(convertApiAppToContextApp);
        
        console.log('✅ IntegrationsContext: Loaded', contextApps.length, 'apps from database');
        setAvailableApps(contextApps);
        
        // Convert user integrations to installed apps format
        const installedIntegrations = userIntegrations.map((integration: any) => ({
          id: integration.id,
          appId: integration.app_id,
          installDate: new Date(integration.created_at),
          status: integration.status || 'active',
          configuration: integration.configuration || {},
          permissions: integration.permissions || [],
          usage: {
            apiCalls: integration.api_calls_count || 0,
            lastUsed: integration.last_used ? new Date(integration.last_used) : null,
            dataTransferred: integration.data_transferred || 0
          }
        }));
        setInstalledApps(installedIntegrations);
        
      } catch (error) {
        console.error('Failed to load integrations data:', error);
        setError('Failed to load integrations data: ' + (error as Error).message);
        // Keep empty array instead of mock data for pure database connectivity
        setAvailableApps([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Run once on mount

  // ========== COMPUTED VALUES ==========
  const categories = generateCategories(availableApps);
  const featuredApps = availableApps.filter(app => app.rating.average >= 4.5).slice(0, 6);

  // ========== SEARCH & FILTERING ==========
  const searchApps = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filterByCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const getFilteredApps = useCallback(() => {
    let filtered = [...availableApps];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'rating':
          return b.rating.average - a.rating.average;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableApps, searchQuery, selectedCategory, sortBy]);

  // ========== INSTALLATION MANAGEMENT ==========
  const installApp = useCallback(async (appId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Track installation start
    trackingHelpers.trackIntegrationInstall(appId, app?.category || 'unknown');

    try {
      const app = availableApps.find(a => a.id === appId);
      if (!app) throw new Error('App not found');

      // Send analytics to backend
      await realAnalytics.sendEvent({
        eventType: 'integration_install',
        properties: {
          app_id: appId,
          app_name: app.name,
          app_category: app.category,
          app_developer: app.developer.name,
          installation_source: 'marketplace'
        }
      });

      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newInstallation: InstalledIntegration = {
        appId,
        installedAt: new Date(),
        version: app.version,
        isEnabled: true,
        configuration: {},
        syncStatus: 'active',
        usage: {
          apiCalls: 0,
          lastUsed: new Date()
        }
      };

      setInstalledApps(prev => [...prev, newInstallation]);
      setAvailableApps(prev => prev.map(a => 
        a.id === appId ? { ...a, isInstalled: true, isEnabled: true } : a
      ));

      // Track successful installation
      trackingHelpers.trackIntegrationInstall(app.name, app.category);

      // Track locally for immediate feedback
      simpleAnalytics.track('feature_use', {
        feature: 'integration_install',
        appId,
        appName: app.name,
        category: app.category
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Installation failed';
      setError(errorMessage);

      // Track installation failure
      trackingHelpers.trackIntegrationError(appId, 'install_failed');

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [availableApps]);

  const uninstallApp = useCallback(async (appId: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Track uninstallation start
    const app = availableApps.find(a => a.id === appId);
    trackingHelpers.trackIntegrationError(appId, 'uninstall_request');

    try {
      const app = availableApps.find(a => a.id === appId);
      
      // Send analytics to backend
      await realAnalytics.sendEvent({
        eventType: 'integration_uninstall',
        properties: {
          app_id: appId,
          app_name: app?.name || 'Unknown',
          uninstall_reason: 'user_request'
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInstalledApps(prev => prev.filter(a => a.appId !== appId));
      setAvailableApps(prev => prev.map(a => 
        a.id === appId ? { ...a, isInstalled: false, isEnabled: false } : a
      ));

      // Track successful uninstallation
      trackingHelpers.trackIntegrationError(appId, 'uninstall_success');

      // Track locally
      simpleAnalytics.track('feature_use', {
        feature: 'integration_uninstall',
        appId,
        appName: app?.name || 'Unknown'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uninstallation failed';
      setError(errorMessage);

      // Track uninstallation failure
      trackingHelpers.trackIntegrationError(appId, 'uninstall_failed');

      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enableApp = useCallback(async (appId: string): Promise<boolean> => {
    try {
      setInstalledApps(prev => prev.map(a => 
        a.appId === appId ? { ...a, isEnabled: true } : a
      ));
      setAvailableApps(prev => prev.map(a => 
        a.id === appId ? { ...a, isEnabled: true } : a
      ));
      return true;
    } catch (err) {
      setError('Failed to enable app');
      return false;
    }
  }, []);

  const disableApp = useCallback(async (appId: string): Promise<boolean> => {
    try {
      setInstalledApps(prev => prev.map(a => 
        a.appId === appId ? { ...a, isEnabled: false } : a
      ));
      setAvailableApps(prev => prev.map(a => 
        a.id === appId ? { ...a, isEnabled: false } : a
      ));
      return true;
    } catch (err) {
      setError('Failed to disable app');
      return false;
    }
  }, []);

  // ========== PLACEHOLDER IMPLEMENTATIONS ==========
  const updateApp = useCallback(async (appId: string): Promise<boolean> => {
    // TODO: Implement app update logic
    return true;
  }, []);

  const configureApp = useCallback(async (appId: string, config: Record<string, any>): Promise<boolean> => {
    setInstalledApps(prev => prev.map(a => 
      a.appId === appId ? { ...a, configuration: { ...a.configuration, ...config } } : a
    ));
    return true;
  }, []);

  const getAppConfiguration = useCallback((appId: string): Record<string, any> | null => {
    const installed = installedApps.find(a => a.appId === appId);
    return installed?.configuration || null;
  }, [installedApps]);

  const testConnection = useCallback(async (appId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.2; // 80% success rate
  }, []);

  const syncApp = useCallback(async (appId: string): Promise<boolean> => {
    setInstalledApps(prev => prev.map(a => 
      a.appId === appId ? { ...a, lastSync: new Date(), syncStatus: 'active' } : a
    ));
    return true;
  }, []);

  const addReview = useCallback(async (appId: string, review: Omit<IntegrationReview, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>): Promise<void> => {
    const newReview: IntegrationReview = {
      ...review,
      id: `review_${Date.now()}`,
      appId,
      userId: 'current_user',
      userName: 'Current User',
      userAvatar: 'https://picsum.photos/40/40',
      createdAt: new Date()
    };
    setReviews(prev => [...prev, newReview]);
  }, []);

  const getAppReviews = useCallback((appId: string) => {
    return reviews.filter(r => r.appId === appId);
  }, [reviews]);

  const getUsageStats = useCallback((appId?: string) => {
    const stats = {
      totalApiCalls: installedApps.reduce((sum, app) => sum + app.usage.apiCalls, 0),
      activeIntegrations: installedApps.filter(app => app.isEnabled).length,
      monthlyUsage: Math.floor(Math.random() * 10000) + 1000,
      topApps: installedApps
        .sort((a, b) => b.usage.apiCalls - a.usage.apiCalls)
        .slice(0, 5)
        .map(app => {
          const appInfo = availableApps.find(a => a.id === app.appId);
          return {
            appId: app.appId,
            name: appInfo?.name || 'Unknown',
            usage: app.usage.apiCalls
          };
        })
    };
    
    return stats;
  }, [installedApps, availableApps]);

  const refreshApps = useCallback(async () => {
    const convertApiAppToContextApp = (apiApp: APIIntegrationApp): IntegrationApp => ({
      id: apiApp.id,
      name: apiApp.name,
      description: apiApp.description,
      category: apiApp.category.toLowerCase() as any,
      subcategory: undefined,
      icon: apiApp.icon || '🔧',
      coverImage: undefined,
      developer: {
        name: apiApp.developer,
        website: apiApp.documentation_url || '#',
        email: 'support@' + apiApp.developer.toLowerCase().replace(/\s+/g, '') + '.com',
        verified: apiApp.featured || false
      },
      pricing: {
        model: apiApp.price > 0 ? 'paid' as const : 'free' as const,
        price: apiApp.price,
        currency: 'USD',
        billingCycle: 'monthly' as const
      },
      features: [],
      permissions: apiApp.permissions || [],
      rating: {
        average: apiApp.rating || 4.0,
        count: apiApp.review_count || 0,
        distribution: { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
      },
      compatibility: {
        platforms: ['web'],
        minVersion: '1.0.0'
      },
      status: apiApp.status as any,
      version: apiApp.version,
      releaseDate: new Date(apiApp.created_at),
      lastUpdated: new Date(apiApp.updated_at),
      downloadCount: apiApp.install_count || 0,
      isInstalled: false,
      isEnabled: false,
      configurable: true,
      webhookSupport: !!apiApp.webhook_url,
      apiEndpoints: apiApp.api_endpoints,
      documentation: apiApp.documentation_url,
      supportUrl: apiApp.support_url,
      tags: apiApp.tags || []
    });

    setIsLoading(true);
    setError(null);
    try {
      const [apps, userIntegrations] = await Promise.all([
        fetchIntegrationApps({ limit: 100 }),
        fetchUserIntegrations({ limit: 50 }).catch(() => [])
      ]);
      
      // Convert API apps to context format
      const contextApps = Array.isArray(apps) && apps.length > 0 && apps[0].id 
        ? apps.map(convertApiAppToContextApp)
        : generateMockApps(); // Fallback to mock if API data is incomplete
      
      setAvailableApps(contextApps);
      // setInstalledApps(userIntegrations); // If needed
    } catch (err) {
      console.error('Failed to refresh integration apps:', err);
      setError('Failed to refresh apps');
      // Keep current data, don't fallback to mock on refresh
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========== CONTEXT VALUE ==========
  const contextValue: IntegrationsContextValue = {
    // App discovery
    availableApps,
    featuredApps,
    categories,
    searchQuery,
    selectedCategory,
    sortBy,
    
    // Search & filtering
    searchApps,
    filterByCategory,
    setSortBy,
    getFilteredApps,
    
    // Installation management
    installedApps,
    installApp,
    uninstallApp,
    enableApp,
    disableApp,
    updateApp,
    
    // Configuration
    configureApp,
    getAppConfiguration,
    testConnection,
    syncApp,
    
    // Reviews & ratings
    reviews,
    addReview,
    getAppReviews,
    
    // Usage analytics
    getUsageStats,
    
    // Developer tools
    createCustomIntegration: async () => 'custom_app_id',
    publishApp: async () => true,
    getWebhookLogs: () => [],
    
    // State
    isLoading,
    error,
    refreshApps
  };

  return (
    <IntegrationsContext.Provider value={contextValue}>
      {children}
    </IntegrationsContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useIntegrations() {
  const context = useContext(IntegrationsContext);
  if (context === undefined) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
}