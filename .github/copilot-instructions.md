# PulseBridge.ai - Comprehensive AI Coding Assistant Instructions

> **🚀 Enterprise Marketing Automation Platform** with AI-autonomous decision making, multi-platform campaign optimization, and complete database-driven architecture

## 🎯 **PROJECT OVERVIEW**

**Platform**: AI-powered marketing automation with enterprise business ecosystem features  
**Status**: Production-ready with 115+ routes, 60+ API endpoints, 100% E2E test coverage  
**Live URLs**: https://pulsebridge.ai | Backend: https://autopilot-api-1.onrender.com  
**Architecture**: Next.js 15.5.2 + FastAPI + Supabase + Claude AI + Multi-platform APIs

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

# Backend development
cd backend && uvicorn main:app --reload --port 8000

# Type validation (zero errors required)
npx tsc --noEmit --skipLibCheck
```

### **Build Requirements**
1. **Zero TypeScript errors** - Builds fail with compilation issues
2. **Turbopack mandatory** - Performance optimization requirement
3. **E2E test data-testid** - Use `data-testid` attributes for reliable selectors
4. **SSR compatibility** - All components must handle server-side rendering

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

// Test patterns
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

## ⚠️ **CRITICAL REQUIREMENTS**

1. **Always use `--turbopack`** for dev and build commands
2. **Zero TypeScript errors** required for production builds  
3. **SSR compatibility** for all components using dynamic imports
4. **Theme support** mandatory for all UI components
5. **data-testid attributes** required for all interactive elements
6. **Provider hierarchy** must be respected when adding new contexts
7. **API error handling** using custom APIError class patterns
8. **Database connectivity** through established context patterns

## 🎯 **DEVELOPMENT PRIORITIES**

When working on this codebase, prioritize:
1. **Database connectivity** - Connect contexts to live API endpoints
2. **E2E test coverage** - Maintain 100% test pass rate
3. **Performance optimization** - Leverage Turbopack and dynamic imports
4. **Type safety** - Maintain zero TypeScript compilation errors
5. **Cross-platform compatibility** - Support all major browsers and devices
