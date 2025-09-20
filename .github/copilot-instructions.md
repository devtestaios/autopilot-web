# GitHub Copilot Instructions - Autopilot AI Marketing Platform

## Project Overview
**Autopilot** is an AI-powered marketing automation platform that manages ad campaigns across multiple platforms (Google Ads, Meta), analyzes performance, optimizes spend, and provides strategic recommendations with minimal human intervention. This is a **Next.js 15 frontend** deployed on **Vercel** with a **FastAPI backend** deployed on **Render**.

## Client Context & Development Approach
- **Client**: Full-service marketing and advertising agency
- **Goal**: Automate entire marketing process with AI (currently manual ad management)
- **Developer Level**: First-time developer - provide detailed step-by-step instructions
- **Communication Style**: Assume no prior coding knowledge, explain every step clearly

## Architecture Pattern

### Full-Stack Structure
```
Vercel (Next.js UI) → Render (FastAPI) → Supabase (PostgreSQL)
```

### Current System Status
#### ✅ BACKEND (FastAPI) - FULLY FUNCTIONAL
- FastAPI server with CORS configured for Vercel
- Supabase integration working properly
- Lead management system (GET/POST /leads)
- KPI endpoints (/kpi/summary, /kpi/daily)
- Health checks and environment validation

#### ✅ FRONTEND - FUNCTIONAL
- Next.js 15 deployed on Vercel with App Router
- Basic lead management interface working
- API integration confirmed working
- Theme toggle and accessibility optimized

#### ✅ DATABASE - FUNCTIONAL
- Supabase project configured with `leads` table
- RLS policies working, basic CRUD operations confirmed

### Key Technology Decisions
- **Next.js 15** with App Router (not Pages Router)
- **TypeScript** throughout with strict type safety
- **Tailwind CSS** + **Radix UI** for component styling
- **Context-based state management** (Theme, Auth, Search) 
- **Recharts** for data visualization
- **Turbopack** for faster builds (`npm run dev --turbopack`)

## Core Data Architecture

### Type System (`src/types/index.ts`)
All data flows through strongly-typed interfaces:
- `Campaign` - Core marketing campaign entity
- `PerformanceSnapshot` - Time-series performance data
- `Lead` - Customer lead information
- `DashboardOverview` - Aggregated metrics

### API Integration (`src/lib/api.ts`)
Centralized API client with standardized patterns:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
// Always use cache: 'no-store' for dynamic data
// Include proper error handling with response.json().catch()
```

## Component Architecture

### Provider Hierarchy (`src/components/ClientProviders.tsx`)
```tsx
ThemeProvider → AuthProvider → SearchProvider → ToastProvider → PageTransition
```

### Page Structure Convention
```
src/app/[feature]/
├── page.tsx              # Main page component
├── enhanced/             # Enhanced versions
├── [id]/page.tsx        # Dynamic routes
└── new/page.tsx         # Creation flows
```

### Component Patterns
- **Server Components**: Default for pages unless client interactivity needed
- **Client Components**: Explicitly marked with `'use client'` for state/events
- **Compound Components**: Table + Filters + Actions grouped logically
- **Context Consumers**: Use custom hooks (`useTheme`, `useSearchContext`)
- **Responsive Sidebar Pattern**: Collapsible sidebar with callback communication to navbar
- **State Communication**: Parent component manages shared state, passes callbacks to children

## Critical Development Patterns

### Theme System
```tsx
// Always support both light/dark themes
className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
// Theme persists to localStorage, respects system preference
```

#### ✅ THEME STATUS (Completed)
**Recent Work Completed:**
- ✅ Removed misplaced "PULSE BRIDGE" text from landing page hero section
- ✅ Updated toolbar backgrounds: black in dark mode, white in light mode
- ✅ Improved text contrast: darker text colors in light mode for better readability
- ✅ Fixed navbar components: SimplifiedNavbar, LandingNavbar, main Navbar
- ✅ **Responsive Sidebar & Navbar Implementation**: Advanced settings sidebar with collapsible functionality

**Navigation Components:**
- `LandingNavbar.tsx` - Landing page navbar with explicit theme colors
- `SimplifiedNavbar.tsx` - Dashboard/internal pages navbar  
- `Navbar.tsx` - Main application navbar component
- `UnifiedSidebar.tsx` - Advanced settings sidebar with collapse/expand functionality
- `AdvancedNavigation.tsx` - Top navigation bar responsive to sidebar state

#### 🚀 SIDEBAR & NAVIGATION SYSTEM (Completed)
**Key Features Implemented:**
- ✅ **Advanced Settings Sidebar**: Collapsible left sidebar (220px expanded, 56px collapsed)
- ✅ **Responsive Top Navbar**: Dynamically adjusts width based on sidebar state
- ✅ **Smooth Animations**: Framer Motion transitions for professional UX
- ✅ **State Communication**: Callback system between sidebar and navbar components
- ✅ **Mobile Responsive**: Overlay behavior on mobile, fixed positioning on desktop

**Technical Implementation:**
- **Component Communication**: `onCollapseChange` callback prop pattern
- **Responsive Classes**: Conditional Tailwind classes (`max-w-none lg:ml-14` vs `max-w-7xl lg:ml-0`)
- **State Management**: React useState with callback props for cross-component coordination
- **Animation System**: `sidebarVariants` with Framer Motion for smooth transitions

**Theme Integration:**
- ✅ **Dark Mode**: Functioning excellently across all components
- ✅ **Light Mode**: Professional styling with proper contrast
- ✅ **Theme Toggle**: Persistent localStorage with system preference detection

### Data Fetching Strategy
```typescript
// Use custom hooks for data management
const { filters, filteredCampaigns, totalResults } = useCampaignFilters(campaigns);
// Combine filtering, search, and pagination in one hook
```

### Error Handling Pattern
```typescript
try {
  const data = await fetchCampaigns();
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
  setError(errorMessage);
}
```

## Backend Integration Requirements

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com  # Backend URL
NEXT_PUBLIC_SUPABASE_URL=...                              # Database
NEXT_PUBLIC_SUPABASE_ANON_KEY=...                         # Database auth
```

### API Endpoints Expected
- `GET /campaigns` - Campaign list with filtering
- `POST /campaigns` - Create new campaign
- `GET /campaigns/{id}/performance` - Time-series data
- `GET /dashboard/overview` - Summary statistics
- `GET /google-ads/status` - Google Ads integration status

### Development Workflow Specifics
- **Always test locally first**: Use `npm run dev --turbopack` for frontend
- **Use feature branches**: Create branches for major changes
- **Deploy incrementally**: Deploy small working changes, don't wait for perfection
- **Cost optimization**: Keep costs low during prototyping
- **Build with mock data first**: Create UI with sample data, then connect real APIs

### Build Commands
```bash
npm run dev --turbopack # Development with Turbopack (faster)
npm run build          # Production build (must pass)
npm run test           # Jest unit tests
npm run test:e2e       # Playwright end-to-end tests
npm run test:all       # Complete test suite
```

### Environment Variables Required
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Key Files to Modify
- **New Features**: Start with `src/types/index.ts` for data types
- **API Changes**: Update `src/lib/api.ts` first
- **UI Components**: Use existing patterns in `src/components/`
- **Pages**: Follow App Router conventions in `src/app/`

### Mobile-First Responsive Design
```tsx
// Always start with mobile, then scale up
className="w-full md:w-auto lg:flex-1"
// Use Radix UI for complex interactions (modals, selects, etc.)
```

### Testing Approach
- **Unit Tests**: Focus on component logic and data transformations
- **E2E Tests**: Test complete user workflows across pages  
- **Coverage Target**: 70% minimum (enforced in jest.config.js)

## Google Ads Integration Specifics

### Backend Connection
The platform integrates with Google Ads API through the FastAPI backend using:
- OAuth 2.0 authentication flow
- Real-time campaign synchronization
- Automated performance data collection

### Required Environment Variables (Backend)
```bash
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
```

### Frontend Integration Points
- `src/components/GoogleAdsIntegration.tsx` - Connection status
- Google Ads data flows through standard Campaign types
- Sync operations trigger from UI but execute on backend

## Current Development Phase

### IMMEDIATE NEXT STEPS (Post-Sidebar Implementation)
1. **AI Chat Integration**: Implement Claude AI chat feature in dashboard
2. **Navigation System**: Make all navigation tabs work with proper routing
3. **Search & Filters**: Global search functionality across campaigns/leads
4. **Action Buttons**: Make "Create Campaign", "View All Campaigns" functional
5. **Backend Integration**: Connect all frontend to existing backend APIs
6. **Interactive Features**: Working charts with real performance data

### Available Backend Endpoints
- `/leads` - Lead management (already working)
- `/campaigns` - Campaign management (needs frontend connection)
- `/dashboard/overview` - Dashboard data (needs frontend connection)
- `/kpi/summary` - Performance metrics (needs frontend connection)
- `/google-ads/status` - Google Ads connection status

## Code Quality Standards

### TypeScript Usage
- No `any` types - use proper interfaces
- Prefer type inference over explicit typing where clear
- Use union types for status fields: `'active' | 'paused' | 'ended'`

### Component Structure
```tsx
'use client'; // Only when needed

interface ComponentProps {
  // Explicit prop types
}

export default function Component({ prop }: ComponentProps) {
  // Hooks first, then state, then effects
  // Return JSX with proper TypeScript
}
```

### Communication Guidelines for Development
- **Explain every step clearly**: Target audience is learning to code
- **Provide exact commands**: Don't assume knowledge of CLI or tools
- **Show file locations**: Always specify exactly where code goes
- **Test instructions**: Provide step-by-step testing procedures
- **Error handling**: Explain common errors and how to fix them
- **Incremental approach**: Build one feature at a time, test, then move on

This platform prioritizes **functional completeness** over perfect code during rapid development phases. Focus on working features first, then optimize.
