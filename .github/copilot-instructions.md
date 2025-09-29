# PulseBridge.ai Copilot Instructions

> **Archived Documentation**: See `.github/copilot-instructions-ARCHIVED-SEPT-28-2025.md` for complete historical details (600+ lines)

**PulseBridge.ai**: Enterprise AI marketing platform with autonomous campaign management across Google Ads, Meta, and LinkedIn.
- **Production**: https://pulsebridge.ai | **Backend**: https://autopilot-api-1.onrender.com
- **Status**: 97/97 routes building, zero TypeScript errors, production-ready foundation

## 🏗️ Architecture Essentials

**Tech Stack**: Next.js 15.5.2 + TypeScript + Tailwind + FastAPI + Supabase + Claude AI

**Critical Files**:
- `src/components/ClientProviders.tsx` - 15+ nested context providers (the "brain")
- `src/contexts/UnifiedAIContext.tsx` - 733-line AI orchestration system
- `src/types/index.ts` - Core data structures (Campaign, PerformanceSnapshot, Lead)
- `src/lib/api.ts` - Enhanced API client with retry/rate limiting (400 lines)

## ⚡ Development Commands (MANDATORY)

```bash
# Development - ALWAYS use --turbopack for Next.js 15.5.2
npm run dev --turbopack

# Production build - MUST pass before commits
npm run build --turbopack

# Testing suite
npm run test:e2e    # Playwright E2E (95%+ success rate)
npm test           # Jest unit tests (12.51% coverage)

# Type checking
npx tsc --noEmit --skipLibCheck  # Zero errors required
```

## 🎯 Critical Patterns

### Provider Architecture
All pages are wrapped in comprehensive provider hierarchy:
```typescript
<ErrorProvider>
  <ThemeProvider>
    <WebSocketProvider>
      <AuthProvider>
        <UnifiedAIProvider> {/* Core AI system */}
          <AnalyticsProvider>
            <ProjectManagementProvider>
              <AIProjectAutomationProvider>
                <CollaborationProvider>
                  <IntegrationsProvider>
                    {children}
```

### Navigation System (MANDATORY)
Every major page requires:
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

### Hydration Safety (CRITICAL)
```typescript
// Use dynamic imports for client-only components
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./ClientComponent'), { 
  ssr: false,
  loading: () => <div className="loading-placeholder">Loading...</div>
});

// For hydration-sensitive content
<div suppressHydrationWarning>
  {/* Client-side only content */}
</div>
```

### Data Types & API Integration
```typescript
// Core entities from src/types/index.ts
interface Campaign {
  id: string;
  status: 'active' | 'paused' | 'ended';
  platform: string;
  client_name: string;
  spend: number;
  metrics: Record<string, unknown>;
}

// API integration pattern from src/lib/api.ts
const API_BASE = 'https://autopilot-api-1.onrender.com';
const response = await fetch(`${API_BASE}/campaigns`, { 
  cache: 'no-store' // MANDATORY for marketing data
});
```

### Theme System (MANDATORY)
```typescript
// All components support dark/light themes
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Use theme context
const { theme, toggleTheme } = useTheme();
```

## 🧪 Testing Standards

- **E2E**: Playwright tests across 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome/Safari)
- **Unit**: Jest with 70% coverage threshold enforced
- **Selectors**: Use `data-testid` attributes for reliable targeting
- **TypeScript**: Zero compilation errors required for builds

## 🚀 Recent Achievements (Sept 28, 2025)

- ✅ **Console Errors Eliminated**: Complete ThemeContext rewrite
- ✅ **Build System Stable**: 97/97 routes building with Turbopack
- ✅ **UX Transformation**: Professional landing → onboarding → dashboard flow
- ✅ **AI Database Schema**: 8 tables with performance scoring & predictive analytics

## 🎨 Strategic Expansions

4 major business ecosystem components:
1. **AI Project Automation** (`src/contexts/AIProjectAutomationContext.tsx` - 583 lines)
2. **Real-Time Collaboration** (`src/contexts/CollaborationContext.tsx` - 650 lines)
3. **Integrations Marketplace** (`src/contexts/IntegrationsContext.tsx` - 750 lines)
4. **Business Intelligence** (`src/app/business-intelligence/page.tsx` - 500 lines)

## ⚠️ Development Rules

1. **Zero TypeScript Errors**: Builds fail with TS errors
2. **Turbopack Required**: Always use `--turbopack` flag
3. **Mobile-First**: Design mobile, scale up with Tailwind
4. **Error Boundaries**: Comprehensive crash prevention
5. **AI Integration**: Use `useUnifiedAI()` for AI functionality

> **Full Details**: See archived instructions for complete architecture documentation
