# PulseBridge.ai - AI Coding Assistant Instructions

> **🚀 Enterprise Marketing Automation Platform** with AI-autonomous decision making, multi-platform campaign optimization, complete database-driven architecture, and premium pricing structure

## 🎯 **PROJECT OVERVIEW**

**Platform**: AI-powered marketing automation with enterprise business ecosystem features  
**Status**: Production-ready with 115+ routes, 60+ API endpoints, 100% E2E test coverage, 6-tier premium pricing  
**Live URLs**: https://pulsebridge.ai | Backend: https://autopilot-api-1.onrender.com  
**Architecture**: Next.js 15.5.2 + FastAPI + Supabase + Claude AI + Multi-platform APIs

## 🗂️ **PROJECT STRUCTURE**

This codebase has dual backend locations:
- `/Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web/backend/` - Primary FastAPI backend (3,393 lines)
- `/Users/grayadkins/Desktop/Autopilot_Repos/autopilot-api/app/` - Secondary API backend

Always work with the primary backend unless specifically directed to the autopilot-api folder.

## 💰 **LATEST UPDATE** (October 5, 2025)
**PREMIUM PRICING STRUCTURE COMPLETE - ENTERPRISE SUBSCRIPTION SYSTEM LIVE**
- ✅ **6-Tier Pricing**: Trial ($0) → Solo Professional ($50) → Growth Team ($150) → Professional Agency ($400) → Enterprise ($1,200) → Enterprise Plus ($2,500+)
- ✅ **Universal Trial**: 15-day trial for all user group sizes (1-10+ users)
- ✅ **Database Schema**: Enhanced with subscription tiers and trial management fields
- ✅ **Safe Deployment**: SAFE_PRICING_UPDATE_SCRIPT.sql successfully executed in Supabase
- ✅ **Enterprise API**: Complete subscription management with usage limits and feature gates
- ✅ **Repository**: All pricing structure changes committed and deployed

## 🏗️ **CRITICAL ARCHITECTURE PATTERNS**

### **Provider Hierarchy (MANDATORY)**
All pages wrapped in comprehensive provider architecture:
```typescript
// src/components/ClientProviders.tsx - 141 lines
<ErrorProvider>
  <ThemeProvider>
    <WebSocketProvider>
      <AuthProvider>
        <UnifiedAIProvider>          // Core AI chat system
          <AnalyticsProvider>
            <SocialMediaProvider>    // Connected to database
            <EmailMarketingProvider> // Connected to database  
            <CollaborationProvider>  // Connected to database
            <IntegrationsProvider>   // Connected to database
              {children}
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

# Backend development (Primary location)
cd backend && uvicorn main:app --reload --port 8000

# Type validation (zero errors required)
npx tsc --noEmit --skipLibCheck
```

### **Build Requirements**
1. **Zero TypeScript errors** - Builds fail with compilation issues
2. **Turbopack mandatory** - Performance optimization requirement (--turbopack flag)
3. **E2E test data-testid** - Use `data-testid` attributes for reliable selectors
4. **SSR compatibility** - All components must handle server-side rendering
5. **Dynamic imports** - Use `dynamic()` for client-only components

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
// Required on all major pages
import NavigationTabs from '@/components/NavigationTabs';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
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
└── providers/            # Error boundaries and context providers
```

## 🧪 **TESTING ARCHITECTURE**

### **E2E Testing (Playwright)**
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
- `src/app/layout.tsx` - Root layout with provider hierarchy
- `src/components/ClientProviders.tsx` - Context provider chain
- `src/lib/api.ts` - Complete API client (1,334 lines)
- `backend/main.py` - FastAPI server (3,393 lines)

**Business Domains:**
- `src/app/dashboard/page.tsx` - Main enterprise dashboard
- `src/app/social-media/page.tsx` - Social media management hub
- `src/app/email-marketing/page.tsx` - Campaign automation center
- `src/app/project-management/page.tsx` - Enterprise project suite

**Advanced Features:**
- `src/components/content-suite/AdvancedDesignStudio.tsx` - Professional design tools
- `src/contexts/UnifiedAIContext.tsx` - AI chat and automation
- `src/components/FacebookSDK.tsx` - Global Facebook SDK integration

**Enterprise Pricing System:**
- `src/lib/enterpriseAPI.ts` - Complete subscription management system
- `SAFE_PRICING_UPDATE_SCRIPT.sql` - Production database deployment script
- 6-tier pricing structure with trial management and feature gates

## ⚠️ **CRITICAL REQUIREMENTS**

1. **Always use `--turbopack`** for dev and build commands
2. **Zero TypeScript errors** required for production builds  
3. **SSR compatibility** for all components using dynamic imports
4. **Theme support** mandatory for all UI components
5. **data-testid attributes** required for all interactive elements
6. **Provider hierarchy** must be respected when adding new contexts
7. **API error handling** using custom APIError class patterns
8. **Database connectivity** through established context patterns
9. **Safe deployments** using DO $$ blocks for schema changes
10. **Dual backend awareness** - specify which backend when unclear

## 🎯 **DEVELOPMENT PRIORITIES**

When working on this codebase, prioritize:
1. **Frontend pricing page integration** - Implement new 6-tier pricing structure display
2. **Payment processor integration** - Connect Stripe or similar for subscription management
3. **Context-database connectivity** - Connect EmailMarketingContext, CollaborationContext, IntegrationsContext to live API endpoints
4. **E2E test coverage** - Maintain 100% test pass rate
5. **Performance optimization** - Leverage Turbopack and dynamic imports
6. **Type safety** - Maintain zero TypeScript compilation errors
7. **Cross-platform compatibility** - Support all major browsers and devices

## 📝 **IMMEDIATE IMPLEMENTATION PRIORITIES**

### **Ready for Immediate Connection** (Est. 1-2 hours):
1. **EmailMarketingContext** → Email Marketing APIs (15+ endpoints)
2. **CollaborationContext** → Collaboration APIs (20+ endpoints)  
3. **IntegrationsContext** → Integrations APIs (18+ endpoints)

### **Implementation Pattern**:
```typescript
// Replace mock data loading:
useEffect(() => {
  setEmailCampaigns(mockData);
}, []);

// With real API calls:
useEffect(() => {
  fetchEmailCampaigns()
    .then(setEmailCampaigns)
    .catch(console.error);
}, []);
```
