# GitHub Copilot Instructions - PulseBridge.ai Marketing Platform

## Project Overview
**PulseBridge.ai** is an enterprise-grade AI marketing automation platform that manages campaigns across Google Ads, Meta, and LinkedIn with autonomous decision-making capabilities.

**Stack**: Next.js 15.5.2 + FastAPI + Supabase + Claude AI  
**Status**: ✅ Production-deployed with ongoing maintenance (September 2025)  
**URLs**: https://pulsebridge.ai (frontend) | https://autopilot-api-1.onrender.com (backend)

## Architecture at a Glance
```
Frontend (Next.js 15.5.2) ←→ FastAPI Backend ←→ Supabase PostgreSQL
     ↓                           ↓                    ↓
Client Providers Stack     AI Orchestration    Real-time subscriptions
(9 nested contexts)       (Claude + OpenAI)         (campaigns, leads)
```

## Critical Development Patterns

### **Context Provider Hierarchy** (src/components/ClientProviders.tsx)
All pages wrapped in 9 nested providers - **never break this chain**:
```tsx
<ErrorProvider>
  <ThemeProvider>
    <CacheProvider>
      <WebSocketProvider>
        <AuthProvider>
          <SearchProvider>
            <UnifiedAIProvider> {/* 724-line AI orchestration core */}
              <AnalyticsProvider>
                <ABTestProvider>
                  <ToastProvider>
```

### **Build System** (CRITICAL for Next.js 15.5.2)
```bash
# Always use --turbopack flag
npm run dev --turbopack
npm run build --turbopack

# Quality gate commands
./check-problems.sh          # Project health diagnostics  
npx tsc --noEmit --skipLibCheck  # Zero TS errors required
npm run test:e2e            # 95%+ success rate maintained
```

### **Hydration Safety Protocol** (MANDATORY for SSR)
```typescript
// Always use dynamic imports for client-only components
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
});

// For hydration issues, use suppressHydrationWarning
<div suppressHydrationWarning>
  {/* Client-side content */}
</div>
```

### **API Integration Pattern** (src/lib/api.ts)
```typescript
// Enhanced fetch with retry, timeout, and rate limiting
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Always use cache: 'no-store' for marketing data
const response = await fetch(`${API_BASE}/campaigns`, {
  cache: 'no-store',
  headers: { 'Content-Type': 'application/json' }
});
```

### **AI System Integration**
```typescript
// Access 724-line AI orchestration system
const { aiControl, sendMessage, executeAIAction } = useUnifiedAI();
await executeAIAction('createCampaign', parameters);
```

## Component Development Standards

### **Page Structure Template**
```typescript
import NavigationTabs from '@/components/NavigationTabs';

export default function PageComponent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs /> {/* MANDATORY on all major pages */}
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </div>
  );
}
```

### **Theme System Compliance**
```typescript
// Always support both dark/light themes
const { theme } = useTheme();
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### **Component Naming Conventions**
- **Base UI**: `src/components/ui/[component].tsx` (Radix primitives)
- **Enhanced**: `src/components/ui/Enhanced[Component].tsx` (Premium versions)
- **Advanced**: `src/components/ui/Advanced[Component].tsx` (Enterprise features)

## Data Layer Patterns

### **Core Entity Types** (src/types/index.ts)
```typescript
interface Campaign {
  id: string;
  status: 'active' | 'paused' | 'ended';  // REQUIRED enum values
  platform: string;
  client_name: string;
  budget?: number;
  spend: number;
  metrics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

### **Database Integration**
- **Supabase**: Real-time subscriptions for live campaign data
- **RLS Policies**: Row-level security enabled on all tables
- **Performance**: Always use indexed queries for analytics

## Quality Assurance

### **Testing Standards**
```bash
# Jest: 70% coverage threshold enforced
npm test                
npm run test:coverage   

# Playwright: 95%+ success rate on 5 browsers
npm run test:e2e        
npm run test:e2e:ui     # Interactive debugging
```

### **Performance Requirements**
- **Bundle Size**: Monitor with build analysis, keep chunks < 50KB
- **Animations**: 60fps target with hardware acceleration
- **Page Loads**: < 1.5s First Contentful Paint goal

## Deployment & Environment

### **Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Backend
ANTHROPIC_API_KEY=your_claude_key  # Primary AI provider
```

### **File Structure**
```
src/
├── app/[feature]/            # Next.js App Router pages
│   ├── page.tsx             # Main feature page
│   ├── enhanced/            # Premium versions
│   └── [id]/               # Dynamic routes
├── components/              # 80+ React components
│   ├── ui/                 # 46 base components
│   └── providers/          # Context providers
├── contexts/               # 9 global contexts
├── lib/                   # Utils & API client (400 lines)
└── types/                 # TypeScript definitions (185 lines)
```

## Common Pitfalls & Solutions

### **Known Issues**
- **TypeScript**: Zero compilation errors enforced - builds fail otherwise
- **Hydration**: Use dynamic imports and `suppressHydrationWarning` for client-only code
- **ESLint**: Currently 41+ warnings - safe to ignore, working on cleanup
- **Theme**: Always test both dark/light modes when modifying UI

### **Debugging Tools**
```bash
./check-problems.sh          # Health diagnostics
npm run build --turbopack    # Build validation  
npx tsc --noEmit --skipLibCheck  # Type checking
```

This platform prioritizes **autonomous AI marketing operations** with **enterprise-grade reliability** and **comprehensive testing coverage**.