# GitHub Copilot Instructions - Autopilot Marketing Platform

## Project Architecture

This is **Autopilot (PulseBridge.ai)** - an AI-powered marketing optimization platform that autonomously manages ad campaigns across multiple platforms.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, FastAPI (Python), Supabase PostgreSQL  
**Deployment:** Vercel (frontend) + Render (backend)  
**Production URL:** https://pulsebridge.ai  
**Current Status:** Production-ready frontend with premium UI/UX, backend integration in progress

## Critical Architecture Patterns

### 1. File-Based Routing Structure
```
src/app/
├── page.tsx (landing page via CustomLandingPage)
├── dashboard/enhanced.tsx (main app interface)
├── campaigns/, analytics/, alerts/, unified/ (feature modules)
└── layout.tsx (ClientProviders + dual fonts: Orbitron + Exo_2)
```

### 2. Context Provider Pattern
All components wrapped in `ClientProviders` with nested contexts:
```tsx
<ThemeProvider>
  <AuthProvider>
    <SearchProvider>
      <ToastProvider>
        <PageTransition>{children}</PageTransition>
```

### 3. Pulse Bridge Branding System
- **Colors:** `--pulse-blue: #00d4ff`, `--bridge-purple: #7c3aed`, `--energy-magenta: #ec4899`, `--deep-space: #1a1a2e`
- **Fonts:** Orbitron (headers), Exo_2 (body text)
- **Components:** PulseWaveLogo, PremiumButton, PremiumCard with glass morphism
- **Animations:** Pulse waves, scanning effects, gradient shifts

### 4. API Layer Architecture
- **Frontend API:** `src/lib/api.ts` with typed functions
- **Backend:** FastAPI with Pydantic models, `/campaigns`, `/performance`, `/google-ads/*` endpoints
- **Types:** Centralized in `src/types/index.ts` (Campaign, PerformanceSnapshot, etc.)
- **API Base:** `NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com`

## Development Workflow

### Required Commands
```bash
# Frontend development (uses Turbopack)
npm run dev --turbopack

# Testing strategy
npm run test        # Jest unit tests
npm run test:e2e    # Playwright E2E
npm run test:all    # Full test suite

# Backend development (separate repo/scripts)
python main.py      # FastAPI server on :8000
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com

# Backend (Render)
DATABASE_URL=postgresql://...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
```

## Component Conventions

### 1. Enhanced Component Pattern
Most dashboards use "Enhanced" versions (e.g., `dashboard/enhanced.tsx`) that import from base components but add:
- Real-time data fetching
- Advanced interactions
- Premium UI features

### 2. Premium UI Component Architecture
- **Base UI:** `src/components/ui/` (button, card, badge, etc.)
- **Premium UI:** PremiumButton, PremiumCard, PremiumBadge with special styling
- **Feature Components:** Direct in `src/components/` (CampaignCard, DashboardStats)
- **Navigation:** NavigationTabs.tsx with theme toggle and brand integration

### 3. Theme System (CRITICAL)
- **CSS Variables:** Semantic colors that adapt to light/dark theme
- **Components:** Must use `text-foreground`, `text-muted-foreground`, NOT hardcoded colors
- **Contrast:** All text meets WCAG AA standards (4.5:1 minimum)
- **Toggle:** Animated sun/moon button in navigation
- **Persistence:** Theme saved in localStorage

### 4. Brand Design System
```css
/* Core brand colors */
--pulse-blue: #00d4ff
--bridge-purple: #7c3aed  
--energy-magenta: #ec4899
--deep-space: #1a1a2e

/* Typography */
font-orbitron: Orbitron (headers, monospace)
font-exo-2: Exo_2 (body, sans-serif)
```

## Data Flow Patterns

### 1. Campaign Management Flow
```
CampaignForm → api.createCampaign() → FastAPI /campaigns → Supabase campaigns table
CampaignTable ← api.fetchCampaigns() ← FastAPI /campaigns ← Supabase
```

### 2. Google Ads Integration
- **Scripts:** `scripts/development/backend_google_ads_integration.py`
- **Endpoints:** `/google-ads/status`, `/google-ads/campaigns`, `/google-ads/sync`
- **Auth Pattern:** Refresh token → Access token → API calls

### 3. Performance Analytics
```
PerformanceSnapshot (daily data) → performance_snapshots table
Enhanced charts via Recharts in EnhancedPerformanceCharts.tsx
```

## Testing Strategy

- **Unit Tests:** Jest + Testing Library for components
- **E2E Tests:** Playwright for user flows
- **Coverage Threshold:** 70% across all metrics
- **Test Files:** `src/**/*.{test,spec}.{js,jsx,ts,tsx}`

## Common Gotchas

1. **Turbopack:** All build commands use `--turbopack` flag
2. **Theme System:** NEVER use hardcoded colors like `text-gray-600` - use semantic colors `text-foreground`, `text-muted-foreground`
3. **Contrast Requirements:** All text must meet WCAG AA (4.5:1 ratio) - test both light/dark themes
4. **API Base URL:** Production uses `autopilot-api-1.onrender.com`, local uses `:8000`
5. **Google Ads:** Integration requires specific environment variables and OAuth flow
6. **Database:** Supabase with Row Level Security enabled but currently allows all operations
7. **Client Context:** First-time developer project - provide detailed explanations and step-by-step instructions

## Key Integration Points

- **Google Ads API:** `google-ads` Python package, OAuth 2.0 flow
- **Supabase:** Direct SQL schema in documentation files
- **Vercel Deployment:** Auto-deploys from main branch
- **Component Library:** Custom UI system built on Tailwind with consistent design tokens

## When Adding Features

1. **New Routes:** Create in `src/app/` following App Router conventions
2. **New Components:** Add to `src/components/` with TypeScript interfaces
3. **API Integration:** Extend `src/lib/api.ts` with typed functions
4. **Database Changes:** Update schemas in both Supabase and `src/types/`
5. **Testing:** Add tests following existing patterns in `__tests__/` directories