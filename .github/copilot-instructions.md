# GitHub Copilot Instructions - PulseBridge.ai Marketing Platform

## Project Overview
**PulseBridge.ai** is a production-ready AI-autonomous marketing platform that manages campaigns across Google Ads, Meta, and LinkedIn with complete autonomous decision-making capabilities.

**Production**: https://pulsebridge.ai | **Backend**: https://autopilot-api-1.onrender.com  
**Status**: ✅ **COMPLETE PLATFORM + CRITICAL MAINTENANCE** - All 6 development phases + enhanced visual polish + TypeScript error resolution (September 2025)

## Essential Architecture Knowledge

### Core Technology Stack
- **Frontend**: Next.js 15.5.2 (App Router) + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python) with async/await patterns
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **AI Integration**: Claude/Anthropic (primary) + OpenAI (secondary)
- **State Management**: React Context + Custom hooks pattern
- **UI Components**: Custom design system + Radix UI primitives + Enhanced visual system

### Critical Development Patterns

#### Data Flow Architecture
```typescript
// Always follow this service boundary pattern:
Frontend UI → Context (State) → API Layer → FastAPI Backend → Supabase
           ↘ AI Control Context → Claude API ↗

// Core data entities (src/types/index.ts):
interface Campaign {
  id: string;
  status: 'active' | 'paused' | 'ended'; // REQUIRED enum
  platform: string;
  client_name: string;
  budget?: number;
  spend: number;
  metrics: Record<string, unknown>;
  // ... other fields
}

interface PerformanceSnapshot {
  campaign_id: string;
  date: string; // YYYY-MM-DD format required
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  // ... metrics
}
```

#### AI Control System (CRITICAL)
```typescript
// src/contexts/AIControlContext.tsx - 457 lines, core platform feature
const { aiControl } = useAIControl();
await aiControl.executeAIAction('createCampaign', parameters);
await aiControl.navigateToPage('/campaigns');

// AI modes: autonomous vs supervised decision-making
const { autonomousMode, humanApprovalRequired } = aiControl;
```

#### API Integration Pattern (MANDATORY)
```typescript
// src/lib/api.ts - Always use this error handling pattern
export class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string, public details?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Production API base - NEVER hardcode localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// ALWAYS use cache: 'no-store' for dynamic marketing data
const response = await fetch(`${API_BASE}/campaigns`, { 
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  }
});

// Enhanced fetch with retry logic, timeout, and rate limiting
async function enhancedFetch(url: string, options: RequestInit = {}, retryCount = 0) {
  // Built-in rate limiting, timeout handling, and retry logic
}
```

### Build & Development Workflow

#### Required Commands (CRITICAL)
```bash
# Development - ALWAYS use --turbopack flag for Next.js 15
npm run dev --turbopack

# Production build - MUST pass before deployment
npm run build --turbopack

# Testing - 70% coverage threshold enforced
npm test                # Jest unit tests (12.51% coverage achieved)
npm run test:e2e       # Playwright e2e tests (95%+ success rate)
npm run test:all       # Complete test suite
npm run test:coverage  # Coverage report
npm run test:e2e:ui    # Interactive E2E testing

# Type checking
npx tsc --noEmit --skipLibCheck  # Zero TypeScript errors required
```

#### File Structure Convention
```
src/app/[feature]/
├── page.tsx           # Main feature page
├── enhanced/          # Advanced/premium versions
├── [id]/             # Dynamic routes
└── new/              # Creation flows

src/components/        # Reusable UI components
├── ui/               # Base UI primitives (46 components)
├── analytics/        # Analytics-specific components
├── dashboard/        # Dashboard components
└── providers/        # Context providers

src/contexts/         # Global state management
├── AIControlContext.tsx    # Core AI control (457 lines)
├── ThemeContext.tsx        # Theme management
└── [other contexts]

src/lib/             # Utilities and API integrations
├── api.ts           # Enhanced API client (400 lines)
├── environment.ts   # Environment management
└── utils.ts         # Utility functions

src/types/           # TypeScript definitions (185 lines)
```

### Component Development Patterns

#### Standard Component Pattern
```typescript
'use client'; // Only when client interactivity needed

interface ComponentProps {
  // Always explicit TypeScript props
}

export default function Component({ prop }: ComponentProps) {
  // 1. Hooks first (useContext, useState, etc.)
  const { theme } = useTheme();
  
  // 2. State management
  const [loading, setLoading] = useState(false);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Return JSX with proper error boundaries
}
```

#### Theme System (MANDATORY Support)
```typescript
// ALWAYS support both dark/light themes
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Use muted-foreground for secondary text
className="text-muted-foreground"

// Theme context usage
const { theme, toggleTheme } = useTheme();
```

### Backend Integration Patterns

#### FastAPI Backend Structure
```python
# backend/main.py - Production FastAPI server
# Key endpoints pattern:
GET /campaigns              # List with filtering
POST /campaigns             # Create new
GET /campaigns/{id}         # Individual details
POST /api/v1/ai/chat       # AI integration
GET /autonomous/decisions   # AI decision system
```

#### AI Provider Status (September 2025)
- **Claude/Anthropic**: Fully integrated and active (production)
- **ChatGPT/OpenAI**: Integration code present, not enabled (can be activated if needed)
- All AI features currently use Claude for chat, autonomous actions, and analytics

#### Environment Variables (REQUIRED)
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Backend (.env)
ANTHROPIC_API_KEY=your_claude_key
AI_PROVIDER=claude  # Primary AI provider
```

### Testing Standards (ENFORCED)

#### Jest Configuration
```javascript
// jest.config.js - 70% coverage threshold on all metrics
coverageThreshold: {
  global: {
    branches: 70, functions: 70, lines: 70, statements: 70
  }
}

// Excludes: layout.tsx, globals.css
// Mocked: localStorage, matchMedia, IntersectionObserver
```

#### E2E Testing (Playwright)
```typescript
// playwright.config.ts - Multi-browser coverage
projects: ['chromium', 'firefox', 'webkit', 'Mobile Chrome', 'Mobile Safari']

// Current achievement: 95%+ success rate
// Uses data-testid selectors for reliable targeting
// Tests all 46 routes with zero TypeScript errors
```

### Critical Development Rules

1. **Zero TypeScript Errors**: Production builds fail with TS errors
2. **Mobile-First**: Always start mobile, scale up with Tailwind breakpoints
3. **API Error Handling**: Use APIError class and proper error boundaries
4. **Theme Support**: All components must support dark/light themes
5. **Testing**: Minimum 70% coverage required for all new features
6. **AI Integration**: Use AIControlContext for all AI-related functionality

### Enhanced Visual System (Production)

#### Premium UI Components (46 total)
```typescript
// Glassmorphism effects with backdrop-filter
<GlassCard intensity="medium" className="backdrop-blur-xl" />

// Advanced animations with Framer Motion
<EnhancedButton variant="magnetic" className="spring-physics" />

// Progressive blur backgrounds
<BlurBackground type="hero" intensity="strong" />

// Interactive elements with micro-interactions
<InteractiveCard hover="lift" press="scale" />
```

#### Component Naming Convention
- **Base UI**: `src/components/ui/[component].tsx` (Radix primitives)
- **Enhanced**: `src/components/ui/Enhanced[Component].tsx` (Premium versions)
- **Advanced**: `src/components/ui/Advanced[Component].tsx` (Enterprise features)
- **Premium**: `src/components/ui/Premium[Component].tsx` (Pro-tier components)

#### Animation Standards
- **Framer Motion**: Required for all interactive components
- **Spring Physics**: `useSpring` for natural motion
- **Hardware Acceleration**: `transform3d`, `will-change` properties
- **Performance**: 60fps target, GPU-optimized animations

## Advanced ML Analytics (Production-Ready)

- Backend: FastAPI endpoints for predictive modeling, anomaly detection, and real-time performance forecasting
- Engine: `AdvancedAnalyticsEngine` (see `backend/advanced_analytics_engine.py`)
- Endpoints: `/api/v1/analytics/overview`, `/api/v1/analytics/forecast`, `/api/v1/analytics/trends`, `/api/v1/analytics/correlations`, `/api/v1/analytics/insights`
- Features:
  - Predictive metrics (impressions, clicks, conversions, spend, revenue)
  - Confidence scores, trend direction, seasonal/risk factors
  - Cross-platform correlation analysis (Google, Meta, LinkedIn)
  - Performance trend analysis (trend direction, strength, weekly/monthly change, anomaly detection)
  - AI-generated insights and recommendations (impact, priority, estimated impact, effort)
- Status: Fully implemented and production-ready

### Common Integration Points

#### AI Assistant Integration
```typescript
// Global AI available on every page via layout.tsx
<AIFloatingAssistant />

// Platform control chat for campaigns/analytics
<AIControlChat defaultMinimized={true} />
```

#### Real-time Data Updates
```typescript
// Supabase real-time subscriptions for live campaign data
const { data, error } = useSupabaseSubscription('campaigns');
```

This platform prioritizes **functional completeness** with **enterprise-grade reliability** and **comprehensive AI autonomy**.