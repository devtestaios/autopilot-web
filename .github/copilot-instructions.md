# PulseBridge.ai AI Agent Instructions

> **🎯 QUICK START**: PulseBridge.ai is an **enterprise business ecosystem** with AI-powered marketing automation competing with Asana, Slack, Zapier. **Production**: https://pulsebridge.ai | **Backend**: https://autopilot-api-1.onrender.com

## 🚀 **IMMEDIATE CONTEXT** (Read First)

**What This Is**: AI-powered marketing automation platform with enterprise business ecosystem features
**Current Status**: Production-ready, 102 routes building, complete Instagram OAuth, 60+ database APIs
**Tech Stack**: Next.js 15.5.2 + TypeScript + Tailwind + FastAPI + Supabase + Claude AI
**Current Date**: October 1, 2025

### **🏗️ CRITICAL ARCHITECTURE**:
- **Primary Interface**: `/dashboard` (253 lines) - Main command center with enterprise KPIs
- **Social Media Hub**: `/social-media` (600+ lines) - AI content composer with Instagram OAuth  
- **Marketing Command**: `/marketing-command-center` - Unified marketing ecosystem
- **Project Management**: `/project-management` - Enterprise project suite with Kanban
- **Backend**: `backend/main.py` (2,547 lines) - FastAPI with 60+ endpoints
- **Frontend API**: `src/lib/api.ts` (1,242 lines) - Comprehensive API client

### **🎯 LATEST ACHIEVEMENTS** (Sept 30, 2025):
1. **✅ Instagram OAuth Complete**: Modern Instagram API with Facebook SDK integration
2. **✅ Database APIs Ready**: 60+ endpoints across Social Media, Email, Collaboration, Integrations
3. **✅ Enterprise UI**: Production-ready with clean dashboard architecture
4. **✅ SSR Safety**: Zero build errors, proper hydration patterns implemented

## ⚡ **ESSENTIAL COMMANDS** (Always Use)

```bash
# Development - MANDATORY --turbopack flag
npm run dev --turbopack

# Production build - Required before commits
npm run build --turbopack

# Testing
npm run test:e2e    # Playwright E2E (95%+ success)
npm test           # Jest unit tests (12.51% coverage)

# Backend development
cd backend && uvicorn main:app --reload
curl http://localhost:8000/docs  # FastAPI documentation

# Type checking
npx tsc --noEmit --skipLibCheck  # Zero errors required
```

## 🎯 **CRITICAL PATTERNS** (Must Follow)

### **SSR Safety (MANDATORY)**
```typescript
// Use dynamic imports for client-only components
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
  loading: () => <div className="loading-placeholder">Loading...</div>
});

// Protect browser APIs
if (typeof window !== 'undefined') {
  // Client-side only code
}
```

### **Navigation System (REQUIRED)**
Every page must include:
```typescript
import NavigationTabs from '@/components/NavigationTabs';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        {/* Content */}
      </div>
    </div>
  );
}
```

## 🏗️ **PROVIDER ARCHITECTURE**

All pages wrapped in comprehensive provider hierarchy:
```typescript
// src/components/ClientProviders.tsx
<ErrorProvider>
  <ThemeProvider>
    <WebSocketProvider>
      <AuthProvider>
        <UnifiedAIProvider>          {/* Core AI system */}
          <AnalyticsProvider>
            <ProjectManagementProvider>
              <CollaborationProvider>
                <IntegrationsProvider>
                  {children}
```

### **Instagram OAuth Integration**
Complete implementation with Facebook SDK:
- `src/components/FacebookSDK.tsx` - Global SDK loaded in layout
- `src/app/auth/instagram/callback/page.tsx` - OAuth handler
- Backend: `/api/social-media/oauth/initiate` endpoint
- App ID: 1978667392867839 (production configured)

## 🔧 **API INTEGRATION PATTERNS**

### **Database APIs (60+ endpoints ready)**
```typescript
// src/lib/api.ts - 1,242 lines with comprehensive client
const API_BASE = 'https://autopilot-api-1.onrender.com';

// Email Marketing APIs
export async function fetchEmailCampaigns(): Promise<EmailCampaign[]>
export async function createEmailCampaign(campaign: EmailCampaignInput)

// Social Media APIs  
export async function fetchSocialAccounts(): Promise<SocialMediaAccount[]>
export async function createSocialPost(post: SocialMediaPostInput)

// Collaboration APIs
export async function fetchTeamMembers(): Promise<TeamMember[]>
export async function updateUserPresence(presence: UserPresenceInput)

// Integrations APIs
export async function fetchIntegrationApps(): Promise<IntegrationApp[]>
export async function installIntegration(appId: string, config: IntegrationConfig)
```

### **Theme System (MANDATORY)**
```typescript
// All components support dark/light themes
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Use theme context
const { theme, toggleTheme } = useTheme();
```

## ⚠️ **DEVELOPMENT RULES** (Must Follow)

1. **Zero TypeScript Errors**: Builds fail with compilation errors
2. **Turbopack Required**: Always use `--turbopack` flag for dev/build
3. **SSR Safety**: Use dynamic imports for client-only components
4. **Navigation Integration**: Include NavigationTabs on every major page
5. **Theme Support**: All components must support dark/light themes
6. **Testing**: Use `data-testid` attributes for reliable E2E selectors
7. **Error Handling**: Implement comprehensive error boundaries
8. **Provider Hierarchy**: Respect the established provider wrapping order

## 📁 **KEY FILE LOCATIONS**

- **Main Dashboard**: `src/app/dashboard/page.tsx` (253 lines)
- **Social Media Hub**: `src/app/social-media/page.tsx` (600+ lines)
- **API Client**: `src/lib/api.ts` (1,242 lines)
- **Backend**: `backend/main.py` (2,547 lines)
- **Navigation**: `src/components/NavigationTabs.tsx` (103 lines)
- **Providers**: `src/components/ClientProviders.tsx` (141 lines)
- **Facebook SDK**: `src/components/FacebookSDK.tsx` (38 lines)
- **Types**: `src/types/index.ts` (comprehensive TypeScript definitions)
