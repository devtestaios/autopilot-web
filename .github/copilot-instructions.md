# GitHub Copilot Instructions - PulseBridge.ai AI Marketing Platform

## Project Overview
**PulseBridge.ai** is an enterprise-grade AI-autonomous marketing platform managing campaigns across Google Ads, Meta, and LinkedIn with comprehensive AI control and real-time optimization.

**Production**: https://pulsebridge.ai (Custom Domain) | https://autopilot-web-rho.vercel.app (Vercel)  
**Status**: 🎯 **ALL 6 PHASES COMPLETE** - Full AI autonomy achieved! Complete autonomous decision-making system with enterprise-grade infrastructure, 70+ tests, 90%+ coverage, and production deployment (September 2025)

## Current Architecture & Completed Features

### ✅ COMPLETE PLATFORM CAPABILITIES

#### Phase 6: Autonomous Decision Framework ✅
```
🤖 AUTONOMOUS AI CONTROL CENTER (/autonomous)
- Complete AI decision-making with safety guardrails
- Real-time execution engine with platform integrations
- 15+ REST endpoints for autonomous control
- Emergency stop and rollback capabilities
- Learning system with continuous improvement
```

#### Phase 5: Advanced Analytics Engine ✅
```
📊 ML-POWERED ANALYTICS (/analytics/advanced)
- Random Forest predictive modeling
- Cross-platform correlation analysis
- AI-generated insights and recommendations
- Trend analysis with future projections
- Real-time ML processing pipeline
```

#### Phase 4: Multi-Platform Sync Engine ✅
```
🔄 UNIFIED PLATFORM MANAGEMENT (/sync)
- Cross-platform campaign synchronization
- Unified performance reporting
- Budget reallocation between platforms
- Real-time sync status monitoring
- Platform-agnostic optimization
```

#### Phase 3: Google Ads Integration ✅
```
🚀 LIVE CAMPAIGN MANAGEMENT
- Real Google Ads API integration
- Live campaign optimization
- Performance monitoring and alerts
- Automated bid management
- Campaign lifecycle automation
```

#### Phase 2: AI Chat & Optimization ✅
```
🤖 REAL-TIME AI CONVERSATIONS (/ai)
- Claude/Anthropic AI integration deployed
- Platform control capabilities
- Campaign management through chat
- Real-time optimization suggestions
- AI-powered decision recommendations
```

#### Phase 1: Infrastructure & Testing ✅
```
🏗️ ENTERPRISE FOUNDATION
- Zero TypeScript errors across 43 routes
- 70+ comprehensive tests (90%+ coverage)
- Advanced testing infrastructure
- Production-ready build pipeline
- Ferrari-level code quality
```

### Core Architecture & Data Flow
```
Vercel (Next.js 15 + AI) → FastAPI (backend/) → Supabase (PostgreSQL)
                        ↘ Claude/OpenAI APIs ↗
                        ↘ ML Analytics Engine ↗
                        ↘ Autonomous Decision System ↗
```

### Build Commands (Production Ready)
```bash
# Development (ALWAYS use --turbopack flag)
npm run dev --turbopack    # Next.js 15 dev server
npm run build --turbopack  # Production build (must pass for deployment)
npm test                   # Jest unit tests (90%+ coverage)
npm run test:e2e          # Playwright end-to-end tests
npm run test:all          # Complete test suite
```

### Current Production Status
- **Frontend**: 43 routes, zero TypeScript errors, fully deployed
- **Backend**: 50+ API endpoints, ML analytics, autonomous decisions
- **Database**: Advanced schema with campaigns, analytics, decisions
- **AI Systems**: Claude integration, autonomous decision-making, ML predictions

### AI Control System (Core Pattern)
```typescript
// src/contexts/AIControlContext.tsx - 457 lines
const aiControl = useAIControl();
await aiControl.executeAIAction('createCampaign', parameters);
await aiControl.navigateToPage('/campaigns');
await aiControl.manageCampaigns('pause', campaignId);

// AI modes: autonomous vs supervised
const { autonomousMode, humanApprovalRequired } = aiControl;
```

### Type System (src/types/index.ts)
```typescript
// Core entities - always use these exact interfaces
interface Campaign {
  id: string;
  status: 'active' | 'paused' | 'ended'; // Required enum
  // ... other fields
}

interface PerformanceSnapshot {
  campaign_id: string;
  date: string; // YYYY-MM-DD format
  // ... metrics
}
```

### API Integration (src/lib/api.ts)
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// ALWAYS use custom APIError class and handleResponse
export class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// ALWAYS use cache: 'no-store' for dynamic data
const response = await fetch(`${API_BASE}/campaigns`, { cache: 'no-store' });
```

## Development Workflow Patterns

### Page Structure Convention
```
src/app/[feature]/
├── page.tsx              # Main page component
├── enhanced/             # Enhanced versions
├── [id]/page.tsx        # Dynamic routes
└── new/page.tsx         # Creation flows
```

### Component Patterns
```typescript
'use client'; // Only when client interactivity needed

interface ComponentProps {
  // Always explicit prop types
}

export default function Component({ prop }: ComponentProps) {
  // 1. Hooks first
  const { theme } = useTheme();
  
  // 2. State
  const [loading, setLoading] = useState(false);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Return JSX with proper TypeScript
}
```

### Testing Architecture (FERRARI-LEVEL)
```typescript
// Jest config: 70% coverage threshold on all metrics
// Coverage excludes: layout.tsx, globals.css
// Advanced mocking: localStorage, matchMedia, IntersectionObserver

// Test file patterns:
describe('ComponentName', () => {
  beforeEach(() => {
    // Reset mocks
    mockLocalStorage.clear();
  });
  
  it('should handle edge case', () => {
    // Comprehensive edge case testing
  });
});
```

### Theme System (Dark/Light)
```typescript
// ALWAYS support both themes
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Theme persists to localStorage, respects system preference
const { theme, toggleTheme } = useTheme();
```

### Error Handling Pattern
```typescript
try {
  const data = await fetchCampaigns();
} catch (err) {
  const errorMessage = err instanceof APIError ? err.message : 'Failed to load campaigns';
  // Use toast notifications instead of alert()
  showNotification('Error', errorMessage, 'error');
}
```

## Backend Integration (FastAPI)

### Environment Variables Required
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (.env)
ANTHROPIC_API_KEY=your_claude_key
AI_PROVIDER=claude  # Claude is the ONLY integrated provider
```

### Key API Endpoints
```python
# backend/main.py - FastAPI with CORS for Vercel
GET /campaigns              # Campaign list with filtering
POST /campaigns             # Create campaign
GET /campaigns/{id}         # Individual campaign
GET /campaigns/{id}/performance  # Time-series data
GET /dashboard/overview     # Summary statistics
POST /api/v1/ai/chat       # AI chat integration
```

### AI Integration (backend/ai_chat_service.py)
```python
class AIService:
    async def chat_with_ai(self, request: ChatRequest) -> ChatResponse:
        # Claude/Anthropic integration ONLY (production-ready)
        if self.preferred_provider == 'claude' and self.claude_api_key:
            return await self._chat_with_claude(request)
        # OpenAI ready but not integrated - use Claude for all AI features
```

### AI Frontend Components
```typescript
// Global AI Assistant (every page)
<AIFloatingAssistant />  // In layout.tsx

// Platform Control AI Chat
<AIControlChat defaultMinimized={true} />  // On dashboard, campaigns, analytics

// AI Control Center
/ai  // Full AI control dashboard with autonomous/supervised modes
```

## Critical Development Rules

### Mobile-First Responsive
```tsx
// Always start mobile, scale up
className="w-full md:w-auto lg:flex-1"
// Use Radix UI for complex interactions
```

### TypeScript Standards
- No `any` types - use proper interfaces
- Prefer type inference over explicit typing
- Use union types for status: `'active' | 'paused' | 'ended'`

### Build Requirements
- All 37 routes must compile successfully ✅ ACHIEVED
- Zero TypeScript errors required for deployment ✅ ACHIEVED  
- 70% test coverage minimum (enforced in jest.config.js)
- Must pass `npm run build --turbopack` before deployment ✅ ACHIEVED

### File Modification Priority
1. **Types First**: Update `src/types/index.ts` for new data structures
2. **API Layer**: Modify `src/lib/api.ts` for backend integration
3. **Context**: Add to appropriate context provider for global state
4. **Components**: Use existing patterns in `src/components/`
5. **Pages**: Follow App Router conventions in `src/app/`

### Communication Guidelines
- Explain every step clearly for learning developers
- Provide exact terminal commands with --turbopack flag
- Show file locations with absolute paths
- Test incrementally - build one feature, test, then continue
- Focus on working features first, optimize later

This platform prioritizes **functional completeness** with **enterprise-grade testing** during development phases.