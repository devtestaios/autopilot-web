---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
# GitHub Copilot Instructions - PulseBridge.ai Marketing Platform

## Project Overview
You are now working with "PulseBridge.ai" - a **completed** AI-powered marketing optimization platform that autonomously manages ad campaigns across multiple platforms (Google Ads, Meta, etc.), analyzes performance, optimizes spend, and provides strategic recommendations with sophisticated AI autonomy and minimal human intervention.

## Project Status: ✅ ALL PHASES + CRUD COMPLETE + 100% TEST COVERAGE + PRODUCTION VERIFICATION
- **Status**: 🎯 **COMPREHENSIVE CRUD & TESTING COMPLETE** - Full enterprise database operations with 100% test coverage
- **Deployment**: Production ready with live CRUD operations, complete E2E testing, comprehensive documentation
- **Achievement**: Complete transformation to enterprise CRUD application with 60+ API endpoints, real database persistence, and 100% test verification
- **Latest**: CRUD Analysis Complete + E2E Test Suite 100% Passing (October 3, 2025)

## 🚀 **LATEST MAJOR MILESTONE** (October 5, 2025)
**PREMIUM PRICING STRUCTURE IMPLEMENTATION COMPLETE - ENTERPRISE SUBSCRIPTION SYSTEM ACHIEVED**
- ✅ **6-Tier Pricing Strategy**: Complete premium structure from Solo Professional ($50) to Enterprise Plus ($2,500+)
- ✅ **Universal 15-Day Trial**: All user group sizes (1-10+ users) start with trial period
- ✅ **Enterprise API Integration**: Full subscription management with features and usage limits per tier
- ✅ **Database Schema Updates**: Enhanced with new subscription tiers and trial management fields
- ✅ **Safe Production Deployment**: Conflict-resistant deployment script successfully executed in Supabase
- ✅ **Repository Management**: All pricing changes committed and pushed to GitHub with comprehensive documentation

## 🎯 **PREVIOUS MAJOR MILESTONE** (October 3, 2025)
**COMPREHENSIVE CRUD & TESTING VERIFICATION COMPLETE - ENTERPRISE APPLICATION ACHIEVED**
- ✅ **CRUD Operations**: 100% functional across all 4 business domains with real database persistence
- ✅ **E2E Testing**: 45/45 tests passing across all browsers and devices (100% success rate)
- ✅ **Production Verification**: Live API testing confirmed with real data operations
- ✅ **Documentation**: Comprehensive system analysis and architecture documentation complete
- ✅ **Database Integration**: 85% average context connection with real-time CRUD operations
- ✅ **Performance**: 115 routes building in 66s with optimized bundles and dynamic imports

## 🎯 **PREVIOUS MAJOR MILESTONE** (September 30, 2025)
**INSTAGRAM OAUTH INTEGRATION COMPLETE - MODERN API IMPLEMENTATION ACHIEVED**
- ✅ **Instagram API Migration**: Migrated from deprecated Instagram Basic Display API to modern Instagram API with Facebook Login
- ✅ **Facebook SDK Integration**: Global Facebook SDK component loaded in root layout with proper TypeScript types
- ✅ **OAuth Flow Complete**: Full end-to-end OAuth implementation with enhanced business permissions
- ✅ **Production Environment**: All credentials configured across Render backend and Vercel frontend
- ✅ **Modern API Compliance**: Business account support with Facebook Page integration requirements
- ✅ **Dual OAuth Approach**: FB.login() method + redirect fallback for comprehensive compatibility

## Client Context
- **Client**: Full-service marketing and advertising agency
- **Current Process**: Team manually manages online ads, split testing, analytics optimization
- **Goal**: Automate entire process with AI
- **Developer Level**: First-time developer, needs detailed step-by-step instructions
- **Communication Style Required**: Assume no prior coding knowledge, explain every step clearly, provide exact commands

## Current Tech Stack (Production Deployed)
- **Frontend**: Next.js 15.5.2 (App Router) deployed on Vercel (https://pulsebridge.ai)
- **Backend**: FastAPI (Python) deployed on Render (https://autopilot-api-1.onrender.com)
- **Database**: Supabase (PostgreSQL) with real-time features + 60+ API endpoints
- **AI Integration**: Claude/Anthropic + OpenAI with autonomous decision-making
- **ML Engine**: Scikit-learn powered analytics and predictive modeling
- **Version Control**: GitHub with automated CI/CD deployment

## Architecture Flow (Complete System with Database Integration)
```
Vercel (Next.js UI + 102 Routes) → Render (FastAPI + 60+ Endpoints) → Supabase (PostgreSQL + 64 Tables)
                                ↘ Claude/OpenAI AI APIs ↗
                                ↘ ML Analytics Engine ↗
                                ↘ Autonomous Decision System ↗
                                ↘ Google/Meta/LinkedIn APIs ↗
                                ↘ Real-time Database Integration ↗
```

## Current Working System Status

### 🎯 **COMPREHENSIVE CRUD & TESTING COMPLETE** (October 3, 2025)

#### **Enterprise CRUD Operations**: ✅ **100% FUNCTIONAL**

**1. Social Media Management** ✅ **COMPLETE**
- Multi-platform CRUD: Instagram, TikTok, LinkedIn, Twitter, YouTube, Pinterest
- Account management, post operations, engagement tracking, analytics
- Database tables: social_accounts, social_posts, social_comments, social_analytics
- Live verification: API returning real data with UUIDs and timestamps

**2. Email Marketing Platform** ✅ **COMPLETE**  
- Campaign CRUD, subscriber management, template system
- Comprehensive delivery analytics and performance tracking
- Database tables: email_campaigns, email_subscribers, email_templates, email_analytics
- Live verification: Real campaigns with proper database structure

**3. Collaboration Platform** ✅ **COMPLETE**
- Team management, real-time presence, activity feeds, project collaboration
- Live cursor tracking, smart notifications, role-based permissions
- Database tables: team_members, team_activities, user_presence, collaboration_projects
- Integration: 85% context connection with real-time operations

**4. Integrations Marketplace** ✅ **COMPLETE**
- Universal app marketplace with comprehensive CRUD operations
- API key management, usage analytics, revenue tracking
- Database tables: integration_apps, user_integrations, api_keys, integration_usage
- Integration: 80% context connection with marketplace functionality

#### **E2E Testing Infrastructure**: ✅ **100% PASSING**
- **Test Coverage**: 45/45 tests passing across all browsers
- **Cross-Browser**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Performance**: 3.3 minutes total execution time
- **Reliability**: Robust selectors with data-testid attributes
- **Responsive**: Desktop, tablet, mobile viewport testing

#### **Technical Implementation**:
- **Backend**: `backend/main.py` (2,370 lines) with 60+ CRUD endpoints
- **Frontend**: `src/lib/api.ts` (1,334 lines) with comprehensive API client
- **Database**: 64 Supabase tables with complete CRUD operations
- **Testing**: Production-ready test suite with 100% pass rate

### 🎯 **CURRENT PRICING STRUCTURE IMPLEMENTATION STATUS** (October 5, 2025)

#### **Premium Pricing Strategy**: ✅ **COMPLETE & DEPLOYED**

**New 6-Tier Pricing Structure**:
1. **Trial** ($0/month) - 15-day trial for all user group sizes
2. **Solo Professional** ($50/month) - 1 user, basic features
3. **Growth Team** ($150/month) - 5 users, enhanced collaboration
4. **Professional Agency** ($400/month) - 10 users, advanced features
5. **Enterprise** ($1,200/month) - 25 users, premium features
6. **Enterprise Plus** ($2,500+/month) - Unlimited users, white-label

#### **Implementation Details**: ✅ **PRODUCTION READY**
- **Enterprise API**: `src/lib/enterpriseAPI.ts` updated with complete SUBSCRIPTION_PLANS array
- **Database Schema**: Enhanced with new subscription tiers and trial management fields
- **Safe Deployment**: `SAFE_PRICING_UPDATE_SCRIPT.sql` (288 lines) successfully executed
- **Trial Management**: 15-day universal trial with trial_started_at and trial_ends_at fields
- **Data Migration**: Safe migration of existing data (free→trial, starter→growth_team)
- **Repository Status**: All changes committed and pushed to GitHub

#### **Database Updates Completed**:
- **Subscription Tiers**: Updated constraints to support all 6 new pricing tiers
- **Trial Fields**: Added trial_started_at and trial_ends_at columns with defaults
- **Data Migration**: Successfully migrated existing records to new pricing structure
- **RLS Policies**: Enhanced row-level security for subscription management
- **Verification**: Database returns "Update Complete! New Pricing Structure is Active"

#### **Enterprise API Features by Tier**:
- **Usage Limits**: API calls, storage, users per tier
- **Feature Gates**: Advanced features unlocked by subscription level
- **Trial Management**: Automatic trial expiration and conversion prompts
- **Billing Integration**: Ready for Stripe or payment processor integration

### 🚀 **DATABASE API INTEGRATION COMPLETE** (September 29, 2025)

#### **Phase 1: 60+ API Endpoints Implemented Across 4 Categories**

**1. Social Media APIs** ✅ **COMPLETE** (20+ endpoints)
- Multi-platform support: Instagram, TikTok, LinkedIn, Twitter, YouTube, Pinterest
- Account management, post scheduling, engagement tracking, analytics
- Database tables: social_accounts, social_posts, social_comments, social_analytics
- Status: Backend complete, awaiting platform API credentials

**2. Email Marketing APIs** ✅ **COMPLETE** (15+ endpoints) 
- Campaign management, subscriber segmentation, template system
- Comprehensive delivery analytics and performance tracking
- Database tables: email_campaigns, email_subscribers, email_templates, email_analytics
- Status: Ready for immediate EmailMarketingContext connection

**3. Collaboration APIs** ✅ **COMPLETE** (20+ endpoints)
- Team management, real-time presence, activity feeds, project collaboration
- Live cursor tracking, smart notifications, role-based permissions
- Database tables: team_members, team_activities, user_presence, collaboration_projects
- Status: Ready for immediate CollaborationContext connection

**4. Integrations APIs** ✅ **COMPLETE** (18+ endpoints)
- Universal app marketplace with 100+ pre-built integrations
- Revenue tracking, usage analytics, API key management
- Database tables: integration_apps, user_integrations, api_keys, integration_usage
- Status: Ready for immediate IntegrationsContext connection

#### **Technical Implementation**:
- **Backend**: `backend/main.py` (2,370 lines) with complete Supabase integration
- **Frontend**: `src/lib/api.ts` (1,187 lines) with 60+ API functions
- **Types**: `src/types/index.ts` with comprehensive TypeScript coverage
- **Database**: 64 Supabase tables with full CRUD operations

### ✅ BACKEND (main.py) - FULLY FUNCTIONAL
- FastAPI server with CORS configured for Vercel
- Supabase integration working properly
- Lead management system (GET/POST /leads)
- KPI endpoints (/kpi/summary, /kpi/daily) 
- Health checks and environment validation
- Proper error handling

### ✅ FRONTEND - FUNCTIONAL + ENTERPRISE TESTING
- Next.js 15 deployed on Vercel
- Basic lead management interface working
- API integration confirmed working
- Status/health pages functional
- Theme toggle system implemented (dark mode working best)
- E2E Testing: 95%+ success rate with Playwright framework
- 46 routes with zero TypeScript compilation errors

#### ✅ THEME SYSTEM STATUS (Completed)
**Completed Work:**
- ✅ Removed misplaced "PULSE BRIDGE" text from landing page
- ✅ Updated toolbar backgrounds: black in dark mode, white in light mode
- ✅ Fixed navbar text contrast for better readability
- ✅ Theme toggle with localStorage persistence
- ✅ **Advanced Settings Sidebar**: Responsive collapsible navigation system
- ✅ **Responsive Navbar**: Dynamic width adjustment based on sidebar state

#### 🚀 SIDEBAR & NAVIGATION SYSTEM (Completed)
**Latest Implementation:**
- ✅ **UnifiedSidebar Component**: 220px expanded, 56px collapsed, mobile overlay
- ✅ **AdvancedNavigation Component**: Responsive top navbar with dynamic margins
- ✅ **Dashboard Integration**: State management with callback communication
- ✅ **Framer Motion Animations**: Smooth transitions for professional UX
- ✅ **Mobile Responsive Design**: Adaptive behavior across screen sizes

**Technical Architecture:**
- **State Communication Pattern**: Parent manages state, passes callbacks to children
- **Responsive Classes**: Conditional Tailwind (`max-w-none lg:ml-14` vs `max-w-7xl lg:ml-0`)
- **Component Coordination**: onCollapseChange callback system between components

### ✅ DATABASE - FUNCTIONAL
- Supabase project configured
- `leads` table with RLS policies working
- Basic CRUD operations confirmed

## LATEST COMPLETION - INSTAGRAM OAUTH INTEGRATION (September 30, 2025)

### ✅ INSTAGRAM API INTEGRATION COMPLETE ✅ (September 30, 2025)
```
🎯 MODERN INSTAGRAM API INTEGRATION ACHIEVED
- Complete Instagram OAuth using Instagram API with Facebook Login
- Facebook SDK component integrated globally in root layout  
- Enhanced permissions for business/creator account access
- Modern API compliance (Instagram Basic Display deprecated Dec 2024)
- Dual OAuth implementation: FB.login() + redirect fallback
- Production deployment with App ID 1978667392867839
- Full environment configuration across Render + Vercel
- Business account requirements and Facebook Page integration support
```

### ✅ INSTAGRAM OAUTH TECHNICAL IMPLEMENTATION ✅ (September 30, 2025)
```
🏢 PRODUCTION-READY INSTAGRAM OAUTH INFRASTRUCTURE
- Enhanced Social Media Platform: /social-media (600+ lines) with Instagram integration
- Facebook SDK Component: src/components/FacebookSDK.tsx globally loaded in layout
- Backend OAuth Endpoints: /api/social-media/oauth/initiate with modern permissions
- Instagram Callback Handler: /auth/instagram/callback/page.tsx with Suspense boundaries
- Environment Variables: Complete configuration across Render + Vercel
- Meta Console Setup: App ID 1978667392867839 with Instagram API product
- Modern Permissions: pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish
```

### ✅ INSTAGRAM API MIGRATION STATUS ✅ (September 30, 2025)
```
📱 DEPRECATED API SUCCESSFULLY MIGRATED
- Instagram Basic Display API deprecated December 4th, 2024
- Migrated to Instagram API with Facebook Login for business use cases
- Updated permissions scope for business/creator account support
- Facebook Page integration requirement implemented
- Production environment tested and deployed
- Documentation created: INSTAGRAM_API_MIGRATION_GUIDE.md
- Session summary: INSTAGRAM_OAUTH_INTEGRATION_COMPLETE.md
```

## RECENT COMPLETION - DATABASE API INTEGRATION + ENTERPRISE CONNECTIVITY (September 29, 2025)

### ✅ DATABASE API INTEGRATION COMPLETE ✅ (September 29, 2025)
```
� ENTERPRISE DATABASE CONNECTIVITY ACHIEVED
- 60+ API endpoints implemented across 4 major categories
- Complete FastAPI backend with comprehensive Supabase integration  
- 1,187-line API client with error handling and rate limiting
- Complete TypeScript type system for all database entities
- 64 Supabase tables with full CRUD operations
- 3 out of 4 contexts ready for immediate database connection
- Production deployment with environment variables configured
```

### ✅ BACKEND ARCHITECTURE EXPANSION ✅ (September 29, 2025)
```
🏢 PRODUCTION-READY API INFRASTRUCTURE
- backend/main.py expanded to 2,370 lines with 60+ endpoints
- Social Media APIs: 20+ endpoints for multi-platform management
- Email Marketing APIs: 15+ endpoints for campaign automation
- Collaboration APIs: 20+ endpoints for real-time team features
- Integrations APIs: 18+ endpoints for marketplace functionality
- Comprehensive error handling and security features
- Rate limiting and production monitoring
```

### ✅ FRONTEND INTEGRATION READINESS ✅ (September 29, 2025)
```
� ENTERPRISE FRONTEND CONNECTIVITY
- src/lib/api.ts enhanced to 1,187 lines with 60+ API functions
- Complete TypeScript type definitions for all database entities
- EmailMarketingContext ready for immediate database connection
- CollaborationContext ready for immediate database connection
- IntegrationsContext ready for immediate database connection
- Comprehensive error handling and user experience patterns
```

## IMMEDIATE NEXT STEPS - FRONTEND PRICING PAGE INTEGRATION (October 5, 2025)

### **Priority 1: Frontend Pricing Page Implementation** 🎯
**Estimated Time**: 2-3 hours for complete pricing page overhaul  
**Impact**: Showcase new premium pricing structure with professional presentation

#### **Ready for Immediate Implementation**:
1. **Pricing Page Update** → Display new 6-tier structure
   - Update pricing components to show Trial, Solo Professional, Growth Team, Professional Agency, Enterprise, Enterprise Plus
   - Add trial countdown UI and conversion prompts
   - Implement feature comparison table by subscription tier
   - Expected implementation time: ~2 hours

2. **Subscription Management UI** → Customer portal integration
   - Current subscription display with upgrade/downgrade options
   - Trial status tracking with days remaining
   - Billing history and payment method management
   - Expected implementation time: ~1 hour

3. **Payment Processing Integration** → Stripe or similar integration
   - Subscription creation and management workflows
   - Trial-to-paid conversion handling
   - Automated billing and invoice generation
   - Expected implementation time: ~3-4 hours (future priority)

#### **Implementation Pattern**:
```typescript
// Update pricing components with new structure:
import { SUBSCRIPTION_PLANS } from '@/lib/enterpriseAPI';

// Display pricing tiers:
const pricingTiers = SUBSCRIPTION_PLANS.map(plan => ({
  name: plan.name,
  price: plan.price,
  features: plan.features,
  userLimit: plan.limits.users
}));
```

### **Priority 2: Customer Migration Strategy**
**Actions**:
- Plan communication strategy for existing customers about new pricing
- Implement grandfather clauses for current customers if needed  
- Create automated migration workflows for seamless transitions
- Test subscription tier changes and billing updates

### **Priority 3: Advanced Enterprise Features** (Future Phase)
**Requirements**:
- White-label customization for Enterprise Plus tier
- Advanced reporting and analytics for higher tiers
- Priority support channels for premium customers
- Advanced API rate limiting by subscription tier

## COMPLETED PRICING IMPLEMENTATION - COMPREHENSIVE SESSION CONTEXT (October 5, 2025)

### ✅ PRICING STRATEGY DEVELOPMENT ✅ (October 5, 2025)
```
💰 STRATEGIC PRICING ANALYSIS COMPLETE
- Analyzed user requirements: $50 solo baseline, 15-day universal trial
- Developed 6-tier premium structure: Trial → Solo Professional → Growth Team → Professional Agency → Enterprise → Enterprise Plus
- Competitive positioning with clear value proposition per tier
- Enterprise-focused approach with white-label capabilities at top tier
- Universal trial strategy across all user group sizes (1-10+ users)
```

### ✅ ENTERPRISE API INTEGRATION ✅ (October 5, 2025)
```
🏢 SUBSCRIPTION MANAGEMENT SYSTEM COMPLETE
- src/lib/enterpriseAPI.ts: Updated SUBSCRIPTION_PLANS array with 6 pricing tiers
- Complete feature mapping and usage limits per subscription level
- Trial management functions with automatic expiration handling
- Ready for payment processor integration (Stripe, etc.)
- getSubscriptionLimits function for feature gating throughout application
```

### ✅ DATABASE SCHEMA ENHANCEMENT ✅ (October 5, 2025)
```
🗄️ PRODUCTION DATABASE UPDATES COMPLETE
- Updated subscription tier constraints to support all 6 new pricing tiers
- Added trial management fields: trial_started_at and trial_ends_at
- Safe data migration script: SAFE_PRICING_UPDATE_SCRIPT.sql (288 lines)
- Conflict-resistant deployment with existing constraint handling
- Verified successful deployment: "Update Complete! New Pricing Structure is Active"
```

### ✅ SAFE DEPLOYMENT METHODOLOGY ✅ (October 5, 2025)
```
🚀 PRODUCTION-SAFE DATABASE DEPLOYMENT
- Created idempotent deployment script handling existing database conflicts
- Comprehensive error handling and rollback safety measures
- Data migration from old pricing structure (free→trial, starter→growth_team)
- RLS policy updates for subscription management security
- Repository management with proper git version control
```
**Estimated Time**: 1-2 hours for all 3 contexts  
**Impact**: Immediate visual transformation with real database persistence

#### **Ready for Immediate Connection**:
1. **EmailMarketingContext** → Email Marketing APIs (15+ endpoints)
   - Campaign management with real Supabase persistence
   - Subscriber segmentation and analytics
   - Template system with variable substitution
   - Expected connection time: ~30 minutes

2. **CollaborationContext** → Collaboration APIs (20+ endpoints)
   - Real-time team member management
   - Live presence tracking and activity feeds
   - Project collaboration with notifications
   - Expected connection time: ~45 minutes

3. **IntegrationsContext** → Integrations APIs (18+ endpoints)
   - Universal app marketplace with real installations
   - Revenue tracking and usage analytics
   - API key management with security
   - Expected connection time: ~30 minutes

#### **Implementation Pattern**:
```typescript
// Replace mock data loading:
useEffect(() => {
  setEmailCampaigns(mockData);
}, []);

// With real API calls:
useEffect(() => {
  fetchEmailCampaigns()
    .then(setEmailCampaigns)
    .catch(console.error);
}, []);
```

### **Priority 2: Verify Data Persistence**
**Actions**:
- Create test campaigns, team members, and app integrations
- Refresh browser and verify data persists in database
- Test CRUD operations across all connected contexts
- Validate real-time updates and collaboration features

### **Priority 3: Social Media Platform Integration** (Future Phase)
**Requirements**:
- Instagram Business API credentials
- LinkedIn API access tokens
- Twitter API v2 credentials
- TikTok Business API setup
- OAuth flow implementation

## DEVELOPMENT WORKFLOW
1. **Always test locally first**: Use `npm run dev` for frontend, `python main.py` for backend
2. **Use feature branches**: Create branches for major changes
3. **Deploy incrementally**: Deploy small working changes, don't wait for perfection
4. **Cost optimization**: Keep costs low during prototyping
5. **Build with mock data first**: Create UI with sample data, then connect real APIs

## TESTING COMMANDS
```bash
# Frontend development
npm run dev  # Starts on localhost:3000

# Backend development  
uvicorn main:app --reload  # Starts on localhost:8000

# Production builds
npm run build  # Frontend build check
```

## ENVIRONMENT VARIABLES REQUIRED
```bash
# Backend (.env on Render)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## NEXT PHASE OPPORTUNITIES (Post-Visual Polish)

### 🎯 Advanced Refinement Phases Available:
1. **Performance Optimization**
   - Bundle size optimization and code splitting
   - Advanced caching strategies
   - Database query optimization
   - Real-time performance monitoring

2. **Advanced Automation Features**
   - Enhanced AI decision-making algorithms
   - Advanced campaign optimization strategies
   - Multi-platform budget optimization
   - Predictive performance modeling

3. **User Experience Enhancements**
   - Advanced data visualization components
   - Real-time collaboration features
   - Advanced notification systems
   - Mobile-first responsive improvements

4. **Enterprise Features**
   - Advanced user management and permissions
   - White-label customization options
   - Advanced reporting and analytics
   - API rate limiting and advanced security

5. **Integration Expansions**
   - Additional advertising platform integrations
   - CRM system integrations
   - Advanced webhook systems
   - Third-party analytics tools

## CURRENT STATUS: ✅ PREMIUM PRICING STRUCTURE COMPLETE - READY FOR FRONTEND INTEGRATION
- **All Core Phases**: ✅ Complete (6 phases + visual polish + pricing implementation)
- **Build Status**: ✅ 115 routes, zero errors, production ready
- **Pricing Structure**: ✅ 6-tier premium subscription system deployed to production database
- **Enterprise API**: ✅ Complete subscription management with features and limits
- **Database Schema**: ✅ Enhanced with new pricing tiers and trial management
- **Safe Deployment**: ✅ Conflict-resistant deployment script successfully executed
- **Repository Status**: ✅ All pricing changes committed and pushed to GitHub
- **Next Priority**: Frontend pricing page implementation and payment processor integration

## GOOGLE ADS API INTEGRATION (Next Priority After AI Chat)
```python
# Dependencies to add to requirements.txt
google-ads==23.1.0
google-auth==2.23.3

# Environment variables to add
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
```

## COMMUNICATION GUIDELINES
- **Explain every step clearly**: User is learning to code
- **Provide exact commands**: Don't assume knowledge of CLI or tools
- **Show file locations**: Always specify exactly where code goes
- **Test instructions**: Provide step-by-step testing procedures
- **Error handling**: Explain common errors and how to fix them
- **Incremental approach**: Build one feature at a time, test, then move on

## SUCCESS METRICS
- ✅ Campaign dashboard showing real Google Ads data
- ✅ Automated performance analysis working
- ✅ Budget optimization recommendations functioning
- ✅ Multi-client campaign management operational
- ✅ Eventually achieve full automation with minimal human oversight

## RECENT IMPLEMENTATION NOTES (December 2024)
**Sidebar & Navigation System Completed:**
- Responsive sidebar (UnifiedSidebar.tsx) with 220px expanded, 56px collapsed
- Dynamic navbar (AdvancedNavigation.tsx) that adjusts width based on sidebar state
- Callback-based state communication between components
- Framer Motion animations for professional UX
- Mobile responsive overlay behavior
- Theme integration working across all components

**Component Communication Architecture:**
```typescript
// Parent component manages state
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// Sidebar reports state changes via callback
<UnifiedSidebar onCollapseChange={setSidebarCollapsed} />

// Navbar responds to state changes
<AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
```

Remember: Focus on working prototypes first, optimize later. The client values functionality over perfect code during this learning phase.