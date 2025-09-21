# GitHub Copilot Instructions - PulseBridge.ai AI Marketing Platform

## Project Overview
**PulseBridge.ai** is an enterprise-grade AI-autonomous marketing platform managing campaigns across Google Ads, Meta, and LinkedIn with comprehensive AI control and real-time optimization.

**Production**: https://pulsebridge.ai (Custom Domain) | https://autopilot-web-rho.vercel.app (Vercel)  
**Status**: Ferrari-level testing infrastructure with 70+ tests and 90%+ coverage achieved (September 2025)

## Critical Architecture Patterns

### Tech Stack & Build Commands
```bash
# Development (ALWAYS use --turbopack flag)
npm run dev --turbopack    # Next.js 15 dev server
npm run build --turbopack  # Production build (must pass for deployment)
npm test                   # Jest unit tests (70% coverage required)
npm run test:e2e          # Playwright end-to-end tests
npm run test:all          # Complete test suite
```

### Core Data Flow
```
Vercel (Next.js 15 + AI) → FastAPI (backend/) → Supabase (PostgreSQL)
                        ↘ Claude/OpenAI APIs ↗
```

### Provider Hierarchy (CRITICAL ORDER)
```typescript
// src/components/ClientProviders.tsx
ErrorProvider → ThemeProvider → CacheProvider → WebSocketProvider → 
AuthProvider → SearchProvider → AIProvider → AIControlProvider → 
ToastProvider → PageTransition
```

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
- All 37 routes must compile successfully
- Zero TypeScript errors required for deployment
- 70% test coverage minimum (enforced in jest.config.js)
- Must pass `npm run build --turbopack` before deployment

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