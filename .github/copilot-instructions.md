````instructions
# PulseBridge.ai - AI Coding Assistant Instructions

> **🚀 Enterprise Marketing Automation Platform** with AI-autonomous decision making, multi-platform campaign optimization, complete database-driven architecture, and premium pricing structure

## 🎯 **PROJECT OVERVIEW**

**Platform**: AI-powered marketing automation with enterprise business ecosystem features  
**Status**: Production-ready with 115+ routes, 60+ API endpoints, 100% E2E test coverage, 6-tier premium pricing  
**Live URLs**: https://pulsebridge.ai | Backend: https://autopilot-api-1.onrender.com  
**Architecture**: Next.js 15.5.2 + FastAPI + Supabase + Claude AI + Multi-platform APIs  
**Current Date**: October 11, 2025

## 🗂️ **PROJECT STRUCTURE**

**Primary Codebase**: `/Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web/`
- **Frontend**: Next.js 15.5.2 with App Router (`src/app/` structure)
- **Backend**: FastAPI service (`backend/` - 3,393 lines main.py)
- **Database**: Supabase with 64-table enterprise schema
- **AI Integration**: Claude (Anthropic) + OpenAI for autonomous decisions

**Secondary API**: `/Users/grayadkins/Desktop/Autopilot_Repos/autopilot-api/` (backup/alternative service)

## 🎯 **CURRENT STATUS** (October 11, 2025)
**APP ROUTER MIGRATION COMPLETED & PRODUCTION READY**
- ✅ **App Router Structure**: Complete migration from pages to src/app/ directory structure
- ✅ **Route Groups**: Organized with (ai), (auth), (business), (collab) groups 
- ✅ **Build Status**: All routes building successfully with --turbopack optimization
- ✅ **Live Environment**: Production deployments working, local dev server operational
- ✅ **API Integration**: 60+ endpoints connected through comprehensive api.ts client (1,334 lines)
- � **Next Priority**: Complete remaining TypeScript error fixes and restore experimental components

## 💰 **PREVIOUS MAJOR MILESTONE** (October 5, 2025)
**PREMIUM PRICING STRUCTURE COMPLETE - ENTERPRISE SUBSCRIPTION SYSTEM LIVE**
- ✅ **6-Tier Pricing**: Trial ($0) → Solo Professional ($50) → Growth Team ($150) → Professional Agency ($400) → Enterprise ($1,200) → Enterprise Plus ($2,500+)
- ✅ **Universal Trial**: 15-day trial for all user group sizes (1-10+ users)
- ✅ **Database Schema**: Enhanced with subscription tiers and trial management fields
- ✅ **Safe Deployment**: SAFE_PRICING_UPDATE_SCRIPT.sql successfully executed in Supabase
- ✅ **Enterprise API**: Complete subscription management with usage limits and feature gates
- ✅ **Repository**: All pricing structure changes committed and deployed

## 🏗️ **CRITICAL ARCHITECTURE PATTERNS**

### **Provider Hierarchy (MANDATORY)**
All pages wrapped in comprehensive 22-layer provider architecture:
```typescript
// src/components/ClientProviders.tsx - 150+ lines
<ErrorProvider>
  <ThemeProvider>
    <CacheProvider>
      <WebSocketProvider>
        <AuthProvider>
          <TenantProvider>
            <MonitoringProvider>
              <SessionProvider>
                <UserTierProvider>
                <SearchProvider>
                  <UnifiedAIProvider>          // Core AI chat system
                  <AnalyticsProvider>
                    <SocialMediaProvider>      // Connected to database
                    <EmailMarketingProvider>   // Connected to database  
                    <MarketingOptimizationProvider>
                    <BusinessConfigurationProvider>
                    <DashboardCustomizationProvider>
                    <ProjectManagementProvider>
                      <AIProjectAutomationProvider>
                      <CollaborationProvider>  // Connected to database
                        <IntegrationsProvider> // Connected to database
                        <CrossPlatformProvider>
                        <PerformanceProvider>
                          <ABTestProvider>
                            <ToastProvider>
                              <PageTransition>
                                {children}
```

### **App Router Structure**
```
src/app/
├── (ai)/              # AI-focused routes (workflow, automation, analytics)
├── (auth)/            # Authentication flows (login, register, verify)
├── (business)/        # Business management (campaigns, analytics, settings)
├── (collab)/          # Collaboration features (teams, projects)
├── dashboard/         # Main enterprise dashboard
├── email-marketing/   # Email campaign management
├── social-media/      # Social platform management
├── project-management/ # Enterprise project tools
├── layout.tsx         # Root layout with provider hierarchy
└── page.tsx           # Landing page
```

### **Context-Based State Management**
Each business domain has dedicated context with database connectivity:
- `SocialMediaContext.tsx` (728 lines) - Multi-platform social management
- `EmailMarketingContext.tsx` (1000+ lines) - Campaign automation
- `CollaborationContext.tsx` - Real-time team features
- `IntegrationsContext.tsx` - Marketplace & API management

### **SSR Safety (CRITICAL)**
```typescript
// ALWAYS use dynamic imports for client components
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./Component'), {
  ssr: false,
  loading: () => <div className="animate-pulse">Loading...</div>
});

// Browser API protection
if (typeof window !== 'undefined') {
  // Client-side only code
}
```

## 🔧 **API ARCHITECTURE**

### **Frontend API Client**
`src/lib/api.ts` (1,334 lines) - Comprehensive REST client:
```typescript
const API_BASE = 'https://autopilot-api-1.onrender.com';

// Error handling with custom APIError class
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Database API categories (60+ endpoints):
// - Social Media: 20+ endpoints (Instagram, TikTok, LinkedIn, etc.)
// - Email Marketing: 15+ endpoints (campaigns, subscribers, templates)
// - Collaboration: 20+ endpoints (team management, real-time features)
// - Integrations: 18+ endpoints (marketplace, API keys, analytics)
```

### **Backend Architecture**  
`backend/main.py` (3,393 lines) - FastAPI with modular design:
```python
# Import specialized routers
from ai_endpoints import ai_router
from optimization_endpoints import router as optimization_router
from sync_endpoints import router as sync_router
from analytics_endpoints import router as analytics_router
from autonomous_decision_endpoints import router as autonomous_router

# Supabase integration with fallback patterns
SUPABASE_AVAILABLE = True if SUPABASE_URL and SUPABASE_KEY else False
```

## ⚡ **DEVELOPMENT WORKFLOW**

### **Essential Commands**
```bash
# Development (REQUIRED --turbopack flag)
npm run dev --turbopack

# Production build (validate before commits)
npm run build --turbopack

# Testing suite
npm run test:e2e      # Playwright E2E (100% pass rate)
npm test              # Jest unit tests (12.51% coverage)
npm run test:all      # Full test suite

# Backend development (Primary location: backend/)
cd backend && uvicorn main:app --reload --port 8000

# Type validation
npx tsc --noEmit --skipLibCheck

# Quick API testing
./test-apis.sh        # Comprehensive API endpoint testing script
```

### **Development Workflow Patterns**
1. **App Router First**: All new pages use `src/app/` structure with route groups
2. **Provider Integration**: All pages must be wrapped in ClientProviders hierarchy  
3. **API Client Usage**: Use established `src/lib/api.ts` patterns (1,334 lines) for backend calls
4. **TypeScript Safety**: Maintain zero-error builds, isolate problematic code in .experimental files
5. **Turbopack Requirement**: Always use `--turbopack` flag for optimal performance

## 🎨 **UI/UX PATTERNS**

### **Theme System (Universal)**
```typescript
// Component theme support (mandatory)
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Theme context usage
const { theme, toggleTheme } = useTheme();
```

### **Navigation Architecture**
```typescript
// App Router navigation patterns
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Standard page layout with navigation
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page content with theme support */}
      </div>
    </div>
  );
}
```

### **Component Organization**
```
src/components/
├── content-suite/        # Advanced design tools (AdvancedDesignStudio.tsx)
├── social-media/         # Platform-specific components
├── email-marketing/      # Campaign management UI
├── project-management/   # Enterprise project tools
├── ui/                   # Reusable UI components (Radix-based)
├── providers/            # Error boundaries and context providers
└── ClientProviders.tsx   # Master provider chain (22 providers)
```

### **Backend Integration Patterns**
```typescript
// API client usage (src/lib/api.ts - 1,334 lines)
import { apiClient, APIError } from '@/lib/api';

// Standard error handling pattern
try {
  const campaigns = await apiClient.social.getCampaigns();
  setCampaigns(campaigns);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
  setError('Failed to load campaigns');
}
```

## 🧪 **TESTING ARCHITECTURE**

### **Testing Architecture (Playwright)**
```typescript
// playwright.config.ts - Multi-browser testing
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
]

// Test patterns - ALWAYS use data-testid
await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
await expect(page.locator('[data-testid="kpi-grid"]')).toBeVisible();
```

### **Unit Testing (Jest)**
```javascript
// jest.config.js - React Testing Library integration
testEnvironment: 'jsdom',
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/e2e/']
```

### **Critical Testing Patterns**
- **E2E Success Rate**: Maintain 100% pass rate across all browsers
- **Test Commands**: `npm run test:e2e`, `npm run test:e2e:ui`, `npm run test:all`
- **Selector Strategy**: Always use `data-testid` attributes for reliable element targeting
- **Coverage**: Current unit test coverage 12.51%, E2E coverage 100%

## 🔐 **INTEGRATION PATTERNS**

### **AI Integration**
- **Claude/Anthropic**: Primary AI provider (`@anthropic-ai/sdk`)
- **AI Chat System**: `UnifiedAIProvider` with context-aware conversations
- **AI Endpoints**: `/api/ai/chat` with platform control capabilities

### **Social Media APIs**
- **Instagram**: Modern Instagram API with Facebook SDK integration
- **Facebook SDK**: Global component loaded in layout (`FacebookSDK.tsx`)
- **OAuth Flow**: Complete implementation with business permissions

### **Database Integration (Supabase)**
- **Schema**: 64 tables with comprehensive relationships
- **RLS Policies**: Row-level security enabled across all tables
- **Real-time**: WebSocket connections for live collaboration features
- **Safe Deployment**: Use SAFE_PRICING_UPDATE_SCRIPT.sql patterns for production updates
- **Security**: All deployment scripts include conflict resolution and rollback safety

## 🔐 **DATABASE DEPLOYMENT PATTERNS**

### **Safe Deployment Strategy**
```sql
-- Pattern from SAFE_PRICING_UPDATE_SCRIPT.sql
DO $$ 
BEGIN
  -- Check if constraint exists before dropping
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'constraint_name' 
             AND table_name = 'table_name') THEN
    ALTER TABLE table_name DROP CONSTRAINT constraint_name;
  END IF;
  
  -- Add new constraint
  ALTER TABLE table_name ADD CONSTRAINT new_constraint_name CHECK (...);
END $$;
```

### **Environment Variable Patterns**
```bash
# Backend (.env on Render)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_claude_key

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
```

## 📁 **CRITICAL FILE LOCATIONS**

**Core Architecture:**
- `src/app/layout.tsx` - Root layout with 22-provider hierarchy
- `src/components/ClientProviders.tsx` - Master provider chain (150+ lines)
- `src/lib/api.ts` - Complete API client with rate limiting and error handling (1,334 lines)
- `backend/main.py` - FastAPI server with 60+ endpoints (3,393 lines)

**App Router Structure:**
- `src/app/(ai)/` - AI workflow and automation routes
- `src/app/(auth)/` - Authentication and user management
- `src/app/(business)/` - Campaign management and analytics
- `src/app/(collab)/` - Team collaboration features
- `src/app/dashboard/page.tsx` - Main enterprise dashboard
- `src/app/social-media/page.tsx` - Social media management hub
- `src/app/email-marketing/page.tsx` - Campaign automation center
- `src/app/project-management/page.tsx` - Enterprise project suite

**Context Architecture:**
- `src/contexts/UnifiedAIContext.tsx` - AI chat and automation system
- `src/contexts/SocialMediaContext.tsx` - Multi-platform social management (728 lines)
- `src/contexts/EmailMarketingContext.tsx` - Campaign automation (1000+ lines)
- `src/contexts/CollaborationContext.tsx` - Real-time team features
- `src/contexts/IntegrationsContext.tsx` - Marketplace & API management

**Backend Modules:**
- `backend/autonomous_decision_framework.py` - AI decision-making (33,876 lines)
- `backend/advanced_analytics_engine.py` - ML analytics (35,781 lines)
- `backend/ai_chat_service.py` - AI conversation handling (13,276 lines)

## ⚠️ **CRITICAL REQUIREMENTS**

1. **Always use `--turbopack`** for dev and build commands
2. **App Router compliance** - Use `src/app/` structure with route groups
3. **Provider integration** - All pages must be wrapped in ClientProviders hierarchy
4. **SSR compatibility** for all components using dynamic imports when needed
5. **Theme support** mandatory for all UI components (`dark:` classes)
6. **data-testid attributes** required for all interactive elements
7. **API error handling** using established APIError class patterns
8. **Context-based state** - Use appropriate context providers for data management
9. **Safe deployments** using DO $$ blocks for schema changes
10. **Rate limiting awareness** - API client includes built-in rate limiting (100 req/min)

## 🎯 **IMMEDIATE DEVELOPMENT PRIORITIES**

When working on this codebase, focus on:

### **High Priority:**
1. **TypeScript error resolution** - Address remaining build warnings systematically
2. **Context-API integration** - Connect remaining contexts to live backend endpoints
3. **Component restoration** - Re-enable experimental components after dependency fixes
4. **Performance optimization** - Leverage established patterns in api.ts for efficient data loading

### **Architecture Priorities:**
1. **Route group organization** - Maintain clean (ai), (auth), (business), (collab) separation
2. **Provider hierarchy maintenance** - Keep 22-layer provider structure stable
3. **API client expansion** - Add new endpoints following established patterns in api.ts
4. **Testing coverage** - Maintain 100% E2E test pass rate, expand unit test coverage

### **Integration Patterns:**
```typescript
// New page creation pattern
export default function NewPage() {
  // Always use established context patterns
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div data-testid="page-container" className="container mx-auto px-4 py-8">
        {/* Page content with theme support */}
      </div>
    </div>
  );
}

// API integration pattern
const handleDataFetch = async () => {
  try {
    const data = await apiClient.endpoint.getData();
    setData(data);
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`API Error ${error.status}: ${error.message}`);
    }
    setError('Failed to load data');
  }
};
```
