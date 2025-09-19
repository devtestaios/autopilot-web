# Autopilot Marketing Platform - AI Coding Guidelines

## Project Overview
This is "Autopilot" - an AI-powered marketing optimization platform built with Next.js 15 (App Router) that manages ad campaigns across multiple platforms (Google Ads, Meta, etc.). The frontend connects to a FastAPI backend deployed on Render with Supabase PostgreSQL database.

## Architecture & Key Patterns

### Full-Stack Architecture
```
Vercel (Next.js Frontend) → Render (FastAPI Backend) → Supabase (PostgreSQL)
```

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python) with Supabase integration
- **Key API Endpoint**: `NEXT_PUBLIC_API_URL` → `https://autopilot-api-1.onrender.com`

### Directory Structure Conventions
```
src/app/           # Next.js App Router pages (each folder = route)
├── campaigns/     # Campaign management interface
├── dashboard/     # Main analytics dashboard
├── unified/       # Multi-platform unified views
├── platforms/     # Platform setup/configuration
└── [feature]/     # Feature-specific pages

src/components/    # Reusable React components
├── *Dashboard.tsx # Dashboard variants (Unified, Autopilot, etc.)
├── *Form.tsx      # Form components with validation
├── Navigation*.tsx# Navigation components
└── ui/            # Base UI components (shadcn/ui style)

src/lib/api.ts     # Centralized API calls to FastAPI backend
src/types/         # TypeScript type definitions
src/contexts/      # React Context providers
```

### Data Flow Patterns

#### API Integration Pattern
All backend communication goes through `src/lib/api.ts`:
```typescript
// Standard pattern for all API calls
export async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${API_BASE}/campaigns`, {
    cache: 'no-store' // Disable caching for real-time data
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch campaigns: ${response.status}`);
  }
  return response.json();
}
```

#### State Management Pattern
- Use React Context for global state (`SearchContext`, `ClientProviders`)
- Local state with hooks for page-specific data
- Custom hooks in `src/hooks/` for reusable logic (e.g., `useCampaignFilters`)

#### Component Patterns
- Client components marked with `'use client'` (most interactive components)
- Navigation uses `usePathname()` for active state highlighting
- Forms follow the pattern: `[Entity]Form.tsx` with TypeScript validation
- Tables follow the pattern: `[Entity]Table.tsx` with filtering/sorting

### Development Workflow

#### Essential Commands
```bash
# Development (uses Turbopack for faster builds)
npm run dev

# Testing
npm run test           # Jest unit tests
npm run test:watch     # Watch mode
npm run test:e2e       # Playwright E2E tests
npm run test:all       # Run all tests

# Build & Deploy
npm run build          # Production build with Turbopack
npm run start          # Production server
```

#### Environment Variables Required
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### UI/UX Conventions

#### Design System
- **Primary Colors**: Pulse cyan (`text-pulse-cyan`, `border-pulse-cyan`)
- **Typography**: Orbitron (headings), Exo 2 (body) via Google Fonts
- **Dark Mode**: Full support with `dark:` classes throughout
- **Icons**: Lucide React icons consistently used

#### Navigation Pattern
- `NavigationTabs.tsx` provides consistent top navigation
- Mobile-responsive with hamburger menu
- Active states use cyan accent color
- Route structure directly maps to navigation items

#### Component Architecture
- Components prefixed by feature area (e.g., `CampaignTable`, `EnhancedCampaignForm`)
- Dashboard components follow `*Dashboard.tsx` naming
- Form components include validation and error handling
- Chart components use Recharts library

### Key Business Logic

#### Campaign Management
- Campaigns have `platform` field (google_ads, meta, linkedin, etc.)
- Status workflow: `active` → `paused` → `ended`
- Performance tracking via `PerformanceSnapshot` with daily metrics
- Budget vs. spend monitoring built into UI

#### Multi-Platform Integration
- Platform-agnostic campaign interface
- Metrics stored as JSONB for flexibility
- Google Ads integration scripts in `scripts/development/`

### Testing Standards

#### Jest Configuration
- Coverage thresholds: 70% across branches, functions, lines, statements
- Excludes layout files and CSS from coverage
- Tests located in `src/**/__tests__/` or `*.test.ts` files
- Environment: jsdom for React component testing

### Performance Considerations

#### Next.js Optimizations
- Turbopack enabled for dev and build
- Static export disabled for SSR compatibility
- Font optimization with `next/font`
- Image optimization built-in

#### API Patterns
- `cache: 'no-store'` for real-time marketing data
- Error boundaries for graceful API failure handling
- Loading states consistently implemented

### Development Anti-Patterns to Avoid

- **Don't** mix server and client components without clear `'use client'` boundaries
- **Don't** hardcode API URLs (use `NEXT_PUBLIC_API_URL` environment variable)
- **Don't** bypass the centralized `api.ts` for backend calls
- **Don't** ignore TypeScript errors (build configured to ignore for deployment, but fix locally)
- **Don't** create new navigation patterns (use existing `NavigationTabs`)

### Quick Start for New Features

1. **Define types** in `src/types/index.ts`
2. **Add API functions** in `src/lib/api.ts`
3. **Create page** in appropriate `src/app/[feature]/` directory
4. **Build components** in `src/components/`
5. **Add navigation** to `NavigationTabs.tsx` if needed
6. **Write tests** following existing patterns