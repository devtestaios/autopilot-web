# MASTER_TERMINAL_ARCHITECTURE.md
# PulseBridge.ai - Master Terminal Architecture
**Implementation Plan for 20-Platform Unified Interface**

---

## 🎯 ARCHITECTURE OVERVIEW

### Current Foundation (Already Built)
```typescript
// Existing infrastructure to build upon:
src/app/dashboard/customizable/     // ✅ Drag-and-drop widgets
src/components/DashboardCustomizer.tsx  // ✅ Widget system
src/components/navigation/UnifiedSidebar.tsx  // ✅ Navigation
src/contexts/WebSocketContext.tsx   // ✅ Real-time data
src/contexts/CacheContext.tsx       // ✅ Intelligent caching
```

### Master Terminal Concept
Three-tier navigation hierarchy:
1. **Master Terminal** - Unified command center (all platforms)
2. **Platform Modules** - Dedicated workspaces (e.g., Social Media)
3. **Task Views** - Specific workflows (e.g., Content Calendar)

---

## 🏗️ IMPLEMENTATION PLAN

### PHASE 1: Master Terminal Foundation

#### Step 1.1: Platform Registry
```typescript
// COPILOT: Create src/config/platformRegistry.ts

export interface PlatformModule {
  id: string;
  name: string;
  icon: string;
  route: string;
  category: 'marketing' | 'business' | 'operations' | 'commerce' | 'analytics' | 'enterprise';
  widgets: WidgetConfig[];
  quickActions: QuickAction[];
  aiCapabilities: string[];
}

export const PLATFORM_REGISTRY: PlatformModule[] = [
  // Platform 1: Marketing Automation (existing)
  {
    id: 'campaigns',
    name: 'Campaign Management',
    icon: 'Target',
    route: '/campaigns',
    category: 'marketing',
    widgets: [
      { type: 'campaign-performance', size: 'large' },
      { type: 'active-campaigns', size: 'medium' },
      { type: 'budget-tracker', size: 'small' }
    ],
    quickActions: [
      { label: 'New Campaign', action: 'create-campaign' },
      { label: 'Optimize All', action: 'optimize-campaigns' }
    ],
    aiCapabilities: ['optimization', 'prediction', 'automation']
  },
  
  // Platform 2: Social Media (to build)
  {
    id: 'social',
    name: 'Social Media',
    icon: 'Share2',
    route: '/social',
    category: 'marketing',
    widgets: [
      { type: 'social-calendar', size: 'large' },
      { type: 'engagement-metrics', size: 'medium' }
    ],
    quickActions: [
      { label: 'Schedule Post', action: 'schedule-post' },
      { label: 'Check Mentions', action: 'view-mentions' }
    ],
    aiCapabilities: ['content-generation', 'sentiment-analysis']
  },
  
  // COPILOT: Add platforms 3-20 following this pattern
];
```

#### Step 1.2: Master Terminal Page
```typescript
// COPILOT: Create src/app/master-terminal/page.tsx

'use client';

import { useState } from 'react';
import { DashboardCustomizer } from '@/components/DashboardCustomizer';
import { PLATFORM_REGISTRY } from '@/config/platformRegistry';
import { getAllPlatformWidgets } from '@/lib/widgetRegistry';

export default function MasterTerminal() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter platforms by category
  const platforms = selectedCategory === 'all' 
    ? PLATFORM_REGISTRY 
    : PLATFORM_REGISTRY.filter(p => p.category === selectedCategory);
  
  return (
    <div className="master-terminal min-h-screen bg-background">
      {/* Header with Platform Switcher */}
      <TerminalHeader 
        categories={['all', 'marketing', 'business', 'operations', 'commerce', 'analytics', 'enterprise']}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Main Dashboard Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Customizable Widget Dashboard */}
        <DashboardCustomizer
          availableWidgets={getAllPlatformWidgets()}
          defaultLayout="master-terminal"
        />
        
        {/* Platform Quick Access Grid */}
        <PlatformGrid platforms={platforms} />
      </div>
    </div>
  );
}
```

#### Step 1.3: Terminal Header Component
```typescript
// COPILOT: Create src/components/master-terminal/TerminalHeader.tsx

interface TerminalHeaderProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TerminalHeader({ categories, selectedCategory, onCategoryChange }: TerminalHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <GlobalSearch />
            <AIAssistant />
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Step 1.4: Platform Grid Component
```typescript
// COPILOT: Create src/components/master-terminal/PlatformGrid.tsx

interface PlatformGridProps {
  platforms: PlatformModule[];
}

export function PlatformGrid({ platforms }: PlatformGridProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Platform Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map(platform => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: PlatformModule }) {
  const Icon = icons[platform.icon];
  
  return (
    <Link href={platform.route}>
      <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
        <Icon className="w-10 h-10 mb-4 text-primary" />
        <h3 className="font-semibold mb-2">{platform.name}</h3>
        <p className="text-sm text-muted-foreground">
          {platform.quickActions.length} quick actions
        </p>
      </div>
    </Link>
  );
}
```

### PHASE 2: Enhanced Navigation

#### Step 2.1: Update Sidebar with Categories
```typescript
// COPILOT: Update src/components/navigation/UnifiedSidebar.tsx

const NAVIGATION_STRUCTURE = {
  'Master Terminal': {
    icon: 'LayoutDashboard',
    route: '/master-terminal',
    badge: 'NEW'
  },
  'Marketing Suite': {
    icon: 'Megaphone',
    expanded: true,
    platforms: [
      { name: 'Campaigns', route: '/campaigns', icon: 'Target' },
      { name: 'Social Media', route: '/social', icon: 'Share2', badge: 'NEW' },
      { name: 'Email Marketing', route: '/email', icon: 'Mail', badge: 'NEW' },
      { name: 'Content Hub', route: '/content', icon: 'FileText', badge: 'NEW' }
    ]
  },
  'Business Suite': {
    icon: 'Briefcase',
    expanded: false,
    platforms: [
      { name: 'CRM', route: '/crm', icon: 'Users', badge: 'COMING SOON' },
      { name: 'Sales', route: '/sales', icon: 'TrendingUp', badge: 'COMING SOON' },
      { name: 'Finance', route: '/finance', icon: 'DollarSign', badge: 'COMING SOON' }
    ]
  },
  // COPILOT: Add remaining categories
};

export function UnifiedSidebar({ onCollapseChange }: UnifiedSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Marketing Suite']);
  
  return (
    <aside className="sidebar">
      {Object.entries(NAVIGATION_STRUCTURE).map(([section, config]) => (
        <NavigationSection
          key={section}
          title={section}
          config={config}
          expanded={expandedSections.includes(section)}
          onToggle={() => toggleSection(section)}
        />
      ))}
    </aside>
  );
}
```

#### Step 2.2: Enhanced Breadcrumbs
```typescript
// COPILOT: Update src/components/ui/Breadcrumb.tsx

export function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-muted-foreground">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// COPILOT: Implement breadcrumb generation
function generateBreadcrumbs(pathname: string) {
  // Master Terminal → Marketing Suite → Social Media → Content Calendar
  const paths = pathname.split('/').filter(Boolean);
  
  return paths.map((path, index) => ({
    label: formatLabel(path),
    href: index < paths.length - 1 ? `/${paths.slice(0, index + 1).join('/')}` : null
  }));
}
```

### PHASE 3: Widget System Enhancement

#### Step 3.1: Universal Widget Registry
```typescript
// COPILOT: Create src/lib/widgetRegistry.ts

import { PLATFORM_REGISTRY } from '@/config/platformRegistry';

export interface Widget {
  id: string;
  platformId: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  defaultSize: 'small' | 'medium' | 'large';
  dataSource: string;
}

export function getAllPlatformWidgets(): Widget[] {
  const widgets: Widget[] = [];
  
  PLATFORM_REGISTRY.forEach(platform => {
    platform.widgets.forEach(widget => {
      widgets.push({
        id: `${platform.id}-${widget.type}`,
        platformId: platform.id,
        type: widget.type,
        title: formatWidgetTitle(widget.type),
        component: getWidgetComponent(platform.id, widget.type),
        defaultSize: widget.size,
        dataSource: `/api/v1/${platform.id}/widgets/${widget.type}`
      });
    });
  });
  
  return widgets;
}

// COPILOT: Implement dynamic widget loading
function getWidgetComponent(platformId: string, widgetType: string) {
  return lazy(() => import(`@/components/${platformId}/widgets/${widgetType}`));
}
```

#### Step 3.2: Universal Widget Component
```typescript
// COPILOT: Create src/components/widgets/UniversalWidget.tsx

interface UniversalWidgetProps {
  widget: Widget;
  config?: WidgetConfig;
}

export function UniversalWidget({ widget, config }: UniversalWidgetProps) {
  const { data, isLoading, error } = useWidgetData(widget.dataSource);
  
  const WidgetComponent = widget.component;
  
  if (isLoading) return <WidgetSkeleton size={widget.defaultSize} />;
  if (error) return <WidgetError error={error} />;
  
  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3>{widget.title}</h3>
        <WidgetMenu widget={widget} />
      </div>
      <WidgetComponent data={data} config={config} />
    </div>
  );
}

// COPILOT: Implement widget data fetching hook
function useWidgetData(dataSource: string) {
  return useSWR(dataSource, fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: true
  });
}
```

### PHASE 4: Data Integration Layer

#### Step 4.1: Unified Data Context
```typescript
// COPILOT: Create src/contexts/UnifiedDataContext.tsx

export const UnifiedDataProvider = ({ children }: { children: React.ReactNode }) => {
  // Aggregate data from all platform contexts
  const campaigns = useCampaigns();
  const social = useSocial();
  const email = useEmail();
  const crm = useCRM();
  // COPILOT: Add all platform contexts
  
  const value = {
    campaigns,
    social,
    email,
    crm,
    // COPILOT: Include all platform data
  };
  
  return (
    <UnifiedDataContext.Provider value={value}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

// Hook for cross-platform data access
export function useUnifiedData() {
  return useContext(UnifiedDataContext);
}
```

#### Step 4.2: Cross-Platform Actions
```typescript
// COPILOT: Create src/lib/crossPlatformActions.ts

export async function createCrossPlatformCampaign(data: CampaignData) {
  const { platforms, content, budget } = data;
  
  const results = await Promise.all(
    platforms.map(async (platform) => {
      switch (platform) {
        case 'ads':
          return createAdCampaign({ content, budget });
        case 'social':
          return createSocialCampaign({ content });
        case 'email':
          return createEmailCampaign({ content });
        default:
          throw new Error(`Unknown platform: ${platform}`);
      }
    })
  );
  
  return {
    success: true,
    campaigns: results
  };
}
```

---

## 🔒 SAFETY IMPLEMENTATION

### Feature Flags
```typescript
// COPILOT: Create src/config/featureFlags.ts

export const FEATURE_FLAGS = {
  masterTerminal: process.env.NEXT_PUBLIC_ENABLE_MASTER_TERMINAL === 'true',
  social: process.env.NEXT_PUBLIC_ENABLE_SOCIAL === 'true',
  email: process.env.NEXT_PUBLIC_ENABLE_EMAIL === 'true',
  crm: process.env.NEXT_PUBLIC_ENABLE_CRM === 'true',
  // COPILOT: Add flags for all platforms
};

// Usage in components
export function ConditionalFeature({ feature, children }: { feature: keyof typeof FEATURE_FLAGS, children: React.ReactNode }) {
  if (!FEATURE_FLAGS[feature]) return null;
  return <>{children}</>;
}
```

### Route Protection
```typescript
// COPILOT: Create src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect existing routes - never modify
  if (LEGACY_ROUTES.includes(path)) {
    return NextResponse.next();
  }
  
  // Check feature flags for new platforms
  if (path.startsWith('/social') && !FEATURE_FLAGS.social) {
    return NextResponse.redirect(new URL('/master-terminal', request.url));
  }
  
  return NextResponse.next();
}
```

---

## 📋 COPILOT IMPLEMENTATION CHECKLIST

### Step-by-Step Implementation Guide

#### Week 1: Foundation Setup

**Day 1-2: Platform Registry**
- [ ] Create `src/config/platformRegistry.ts`
- [ ] Define all 20 platform configurations
- [ ] Add platform icons and routes
- [ ] Define widget types for each platform
- [ ] Add quick actions configuration

**Day 3-4: Master Terminal Page**
- [ ] Create `src/app/master-terminal/page.tsx`
- [ ] Build TerminalHeader component
- [ ] Create PlatformGrid component
- [ ] Implement category filtering
- [ ] Add responsive layout

**Day 5: Widget Registry**
- [ ] Create `src/lib/widgetRegistry.ts`
- [ ] Implement `getAllPlatformWidgets()`
- [ ] Build dynamic widget loader
- [ ] Add widget data fetching hooks

#### Week 2: Navigation Enhancement

**Day 1-2: Sidebar Updates**
- [ ] Update `src/components/navigation/UnifiedSidebar.tsx`
- [ ] Add platform categories
- [ ] Implement expandable sections
- [ ] Add "NEW" and "COMING SOON" badges
- [ ] Test navigation flow

**Day 3-4: Breadcrumb System**
- [ ] Update `src/components/ui/Breadcrumb.tsx`
- [ ] Implement hierarchical breadcrumbs
- [ ] Add platform context awareness
- [ ] Test with all routes

**Day 5: Global Search Enhancement**
- [ ] Update `src/components/ui/GlobalSearch.tsx`
- [ ] Add multi-platform search
- [ ] Implement search result categorization
- [ ] Add keyboard shortcuts (Cmd+K)

#### Week 3: First New Platform (Social Media)

**Day 1: Database Setup**
```bash
# Run in Supabase SQL Editor
-- Create social media schema
CREATE SCHEMA social_media;

-- Create tables (from roadmap)
CREATE TABLE social_media.accounts (...);
CREATE TABLE social_media.posts (...);
CREATE TABLE social_media.mentions (...);

-- Set up RLS policies
ALTER TABLE social_media.posts ENABLE ROW LEVEL SECURITY;
```

**Day 2-3: Backend API**
- [ ] Create `backend/social/endpoints.py`
- [ ] Implement CRUD operations
- [ ] Add to main FastAPI router
- [ ] Test endpoints with Postman/Thunder Client

**Day 4-5: Frontend Implementation**
- [ ] Create `src/app/social/page.tsx`
- [ ] Build social media dashboard
- [ ] Create `src/app/social/calendar/page.tsx`
- [ ] Create `src/app/social/composer/page.tsx`
- [ ] Add components to widget registry

#### Week 4: Integration & Testing

**Day 1-2: Widget Integration**
- [ ] Create social media widgets
- [ ] Add to Master Terminal
- [ ] Test drag-and-drop
- [ ] Verify data loading

**Day 3-4: Cross-Platform Features**
- [ ] Implement UnifiedDataContext
- [ ] Add cross-platform actions
- [ ] Test data synchronization
- [ ] Verify real-time updates

**Day 5: Documentation & Deployment**
- [ ] Update README.md
- [ ] Document new routes
- [ ] Deploy to staging
- [ ] Run E2E tests

---

## 🛠️ DEVELOPMENT COMMANDS

### Setup Commands
```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev --turbopack

# Run type checking
npm run type-check

# Run tests
npm run test

# Build for production
npm run build --turbopack
```

### Database Commands
```bash
# Run migrations
npx supabase db push

# Reset database (development only)
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Git Workflow
```bash
# Create feature branch for new platform
git checkout -b feature/social-media-platform

# Commit changes
git add .
git commit -m "feat: add social media platform foundation"

# Push to remote
git push origin feature/social-media-platform

# Merge to main (after testing)
git checkout main
git merge feature/social-media-platform
```

---

## 🎨 COMPONENT TEMPLATES

### Platform Dashboard Template
```typescript
// COPILOT: Use this template for all platform dashboards
// src/app/[platform]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable } from '@/components/ui/DataTable';
import { Chart } from '@/components/ui/Chart';

export default function [Platform]Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/v1/[platform]/dashboard');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="[platform]-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">[Platform] Dashboard</h1>
        <p className="text-muted-foreground">Manage your [platform] operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Metric 1" value={data?.metric1} />
        <MetricCard title="Metric 2" value={data?.metric2} />
        <MetricCard title="Metric 3" value={data?.metric3} />
        <MetricCard title="Metric 4" value={data?.metric4} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart data={data?.chartData} />
        <DataTable data={data?.tableData} />
      </div>
    </div>
  );
}
```

### Platform Context Template
```typescript
// COPILOT: Use this template for platform contexts
// src/contexts/[Platform]Context.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface [Platform]ContextValue {
  data: any;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  create: (item: any) => Promise<void>;
  update: (id: string, item: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

const [Platform]Context = createContext<[Platform]ContextValue | undefined>(undefined);

export function [Platform]Provider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/[platform]');
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (item: any) => {
    const response = await fetch('/api/v1/[platform]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await refresh();
  };

  const update = async (id: string, item: any) => {
    const response = await fetch(`/api/v1/[platform]/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await refresh();
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/v1/[platform]/${id}`, { method: 'DELETE' });
    await refresh();
  };

  return (
    <[Platform]Context.Provider value={{ 
      data, 
      loading, 
      error, 
      refresh, 
      create, 
      update, 
      delete: deleteItem 
    }}>
      {children}
    </[Platform]Context.Provider>
  );
}

export function use[Platform]() {
  const context = useContext([Platform]Context);
  if (!context) {
    throw new Error('use[Platform] must be used within [Platform]Provider');
  }
  return context;
}
```

### Widget Component Template
```typescript
// COPILOT: Use this template for platform widgets
// src/components/[platform]/widgets/[WidgetName].tsx

import { useMemo } from 'react';

interface [Widget]Props {
  data: any;
  config?: WidgetConfig;
}

export function [Widget]({ data, config }: [Widget]Props) {
  const processedData = useMemo(() => {
    // Process data for display
    return data;
  }, [data]);

  return (
    <div className="widget-[name]">
      <div className="widget-content">
        {/* Widget content here */}
      </div>
    </div>
  );
}
```

---

## 🔍 TESTING STRATEGY

### Unit Tests Template
```typescript
// COPILOT: Create tests for each platform
// src/app/[platform]/__tests__/page.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import [Platform]Dashboard from '../page';

describe('[Platform] Dashboard', () => {
  it('renders dashboard metrics', async () => {
    render(<[Platform]Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Metric 1')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    render(<[Platform]Dashboard />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock API error
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    
    render(<[Platform]Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
// Test cross-platform functionality
describe('Master Terminal Integration', () => {
  it('displays widgets from all platforms', async () => {
    render(<MasterTerminal />);
    
    await waitFor(() => {
      expect(screen.getByText('Campaign Performance')).toBeInTheDocument();
      expect(screen.getByText('Social Engagement')).toBeInTheDocument();
      expect(screen.getByText('Email Opens')).toBeInTheDocument();
    });
  });

  it('navigates to platform dashboards', async () => {
    render(<MasterTerminal />);
    
    const socialCard = screen.getByText('Social Media');
    fireEvent.click(socialCard);
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/social');
    });
  });
});
```

---

## 📚 DOCUMENTATION REQUIREMENTS

### For Each Platform
- [ ] Create `src/app/[platform]/README.md`
- [ ] Document all routes
- [ ] List available widgets
- [ ] Describe API endpoints
- [ ] Add usage examples

### API Documentation
```typescript
/**
 * Social Media Platform API
 * 
 * Base URL: /api/v1/social
 * 
 * Endpoints:
 * - GET    /posts           - List all posts
 * - POST   /posts           - Create new post
 * - GET    /posts/{id}      - Get single post
 * - PUT    /posts/{id}      - Update post
 * - DELETE /posts/{id}      - Delete post
 * - GET    /analytics       - Get analytics data
 * - GET    /mentions        - Get brand mentions
 */
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No console errors
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Feature flags set correctly

### Deployment Steps
```bash
# 1. Build production bundle
npm run build

# 2. Run production tests
npm run test:e2e

# 3. Deploy to Vercel
vercel deploy --prod

# 4. Run database migrations
npm run db:migrate:prod

# 5. Verify deployment
curl https://pulsebridge.ai/api/health
```

### Post-Deployment
- [ ] Verify all routes accessible
- [ ] Test Master Terminal
- [ ] Check widget loading
- [ ] Monitor error logs
- [ ] Verify database connections
- [ ] Test API endpoints

---

## ⚠️ CRITICAL SAFETY RULES

### DO NOT:
❌ Modify existing routes (`/dashboard`, `/campaigns`, `/analytics`)
❌ Change existing database tables
❌ Alter current component APIs without versioning
❌ Deploy without feature flags
❌ Skip testing on new platforms

### DO:
✅ Create new routes in parallel
✅ Use isolated database schemas
✅ Add feature flags for all new features
✅ Test thoroughly before enabling
✅ Document all changes
✅ Use TypeScript strictly
✅ Follow existing patterns
✅ Maintain backward compatibility

---

## 🎯 SUCCESS METRICS

### Technical Metrics
- [ ] Zero TypeScript errors
- [ ] 70%+ test coverage
- [ ] <3s page load times
- [ ] 99.9% uptime
- [ ] Zero breaking changes

### User Experience Metrics
- [ ] Single sign-on working
- [ ] Smooth navigation
- [ ] Real-time data updates
- [ ] Mobile responsive
- [ ] Accessible (WCAG 2.1 AA)

### Business Metrics
- [ ] All 20 platforms functional
- [ ] Cross-platform features working
- [ ] AI integration operational
- [ ] White-label ready
- [ ] API access available

---

**This architecture ensures safe, systematic implementation of all 20 platforms without disrupting the existing excellent PulseBridge.ai foundation.**