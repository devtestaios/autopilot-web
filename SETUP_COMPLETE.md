# PulseBridge.ai Complete Setup Guide
**Last Updated:** October 16, 2025

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 20+ and npm 10+
- Python 3.11+ (or 3.13 as detected in Render logs)
- PostgreSQL 14+ (or Supabase account)
- API Keys: Anthropic (Claude), OpenAI (optional), Supabase, Stripe

---

## 📦 Frontend Setup (Next.js 15.5.2)

### 1. Install Dependencies
```bash
cd /Users/grayadkins/Desktop/PulseBridge_Repos/autopilot-web
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in `autopilot-web/`:
```env
# Core Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Enable Claude Sonnet 4.5 (NEW - October 2025)
NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45=true

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Providers
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

### 3. Run Development Server
```bash
# With Turbopack (recommended - faster)
npm run dev --turbopack

# Without Turbopack (fallback)
npm run dev:webpack
```

Frontend runs at: **http://localhost:3000**

### 4. Build for Production
```bash
npm run build --turbopack
npm run start
```

### 5. Run Tests
```bash
# Unit tests (Jest)
npm run test

# E2E tests (Playwright - 5 browsers)
npm run test:e2e

# Interactive E2E UI
npm run test:e2e:ui

# Full test suite
npm run test:all
```

---

## 🐍 Backend Setup (FastAPI + Python 3.11+)

### 1. Create Virtual Environment
```bash
cd /Users/grayadkins/Desktop/PulseBridge_Repos/autopilot-web/backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Critical Dependencies Installed:**
- `fastapi>=0.104.0` - Web framework
- `uvicorn[standard]>=0.24.0` - ASGI server
- `psycopg2-binary>=2.9.7` - PostgreSQL driver ✅ **FIXED**
- `supabase>=2.0.0` - Database client
- `anthropic>=0.3.0` - Claude AI SDK
- `openai>=1.0.0` - OpenAI SDK
- `sqlalchemy` - ORM for database operations
- `google-ads>=23.1.0` - Google Ads API
- Plus analytics, security, and logging packages

### 3. Configure Backend Environment
Create `.env` in `autopilot-web/backend/`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pulsebridge
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Platform APIs
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
META_APP_ID=...
META_APP_SECRET=...

# Security
SECRET_KEY=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000,https://pulsebridge.ai
```

### 4. Run Backend Server
```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Backend API runs at: **http://localhost:8000**

### 5. Verify Backend Health
```bash
# Quick import check
python3 -c "import fastapi, uvicorn, supabase, psycopg2, anthropic; print('✅ Backend ready')"

# API health endpoint
curl http://localhost:8000/health
```

### 6. Test Backend Endpoints
```bash
# From repo root
cd /Users/grayadkins/Desktop/PulseBridge_Repos
./test-platform-apis.sh
```

---

## 🔧 Deployment Configuration

### Vercel (Frontend)
**File:** `vercel.json`
```json
{
  "buildCommand": "npm run build --turbopack",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45": "true"
  }
}
```

### Render (Backend)
**File:** `render.yaml` (in backend directory)
```yaml
services:
  - type: web
    name: pulsebridge-api
    runtime: python
    buildCommand: "pip install --upgrade pip && pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.13.4
      - key: DATABASE_URL
        fromDatabase:
          name: pulsebridge-db
          property: connectionString
```

---

## ✅ Recent Fixes (October 16, 2025)

### 1. **psycopg2 Dependency Fixed** ✅
- **Issue:** `ModuleNotFoundError: No module named 'psycopg2'`
- **Fix:** Corrected corrupted line in `requirements.txt` (removed stray text)
- **Verification:** `python-dateutil>=2.8.2` now on separate line
- **Impact:** Backend can now connect to PostgreSQL/Supabase

### 2. **Claude Sonnet 4.5 Provider Enabled** ✅
- **File:** `src/contexts/UnifiedAIContext.tsx`
- **Change:** Added `NEXT_PUBLIC_ENABLE_CLAUDE_SONNET_45` flag
- **Default:** Claude Sonnet 4.5 is now preferred provider when flag is `true`
- **Fallback:** Claude (original) if flag is `false` or unset

### 3. **Package.json Scripts Verified** ✅
- All npm scripts intact: `dev`, `build`, `test`, `test:e2e`
- Turbopack support confirmed
- No missing scripts detected

---

## 🧪 Testing & Validation

### Frontend Tests
```bash
cd autopilot-web

# Unit tests (12.51% coverage - expand as needed)
npm run test

# E2E tests (100% pass rate target - 5 browsers)
npm run test:e2e

# Watch mode for TDD
npm run test:watch
```

### Backend Tests
```bash
cd autopilot-web/backend
source .venv/bin/activate

# Import validation
python3 test_imports.py

# AI integration test
python3 test_ai_integration.py

# Google Ads integration
python3 simple_google_ads_test.py
```

### Deployment Validation
```bash
# From repo root
./final_success_test.sh
./verify-pricing-structure.sh
```

---

## 📊 Architecture Overview

### Frontend Stack
- **Framework:** Next.js 15.5.2 (App Router)
- **Build:** Turbopack (faster than Webpack)
- **UI:** React 19.1.0 + Tailwind CSS 4
- **State:** Context API (25+ providers)
- **Testing:** Jest + Playwright (5 browsers)
- **AI:** Anthropic Claude Sonnet 4.5 (preferred)

### Backend Stack
- **Framework:** FastAPI (async Python)
- **Server:** Uvicorn with uvloop
- **Database:** Supabase (PostgreSQL 14+)
- **ORM:** SQLAlchemy with psycopg2-binary
- **AI:** Claude (Anthropic) + GPT-4 (OpenAI)
- **Integrations:** Google Ads, Meta Business, LinkedIn, Pinterest

### Key Directories
```
autopilot-web/
├── src/
│   ├── app/              # Next.js App Router (8 route groups)
│   ├── components/       # React components (100+)
│   ├── contexts/         # State management (25+ contexts)
│   ├── lib/              # API client (1,334 lines)
│   └── types/            # TypeScript definitions
├── backend/              # FastAPI server (3,400+ lines)
│   ├── main.py           # Primary entrypoint
│   ├── *_endpoints.py    # API routers (60+ endpoints)
│   ├── *_integration.py  # Platform API clients
│   └── requirements.txt  # Python dependencies ✅ FIXED
├── public/               # Static assets
├── tests/                # Jest unit tests
└── e2e/                  # Playwright E2E tests
```

---

## 🔐 Security Checklist

- [ ] All API keys stored in `.env` files (never committed)
- [ ] `.env.local` and `backend/.env` added to `.gitignore`
- [ ] Supabase RLS policies enabled (64 tables)
- [ ] CORS origins restricted in backend
- [ ] Stripe webhook signature validation active
- [ ] Rate limiting configured (100 req/min per IP)
- [ ] OAuth callback URLs whitelisted

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.11+

# Verify virtual environment
which python3  # Should show .venv path

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check for import errors
python3 -c "import fastapi, uvicorn, psycopg2; print('OK')"
```

### Frontend build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build --turbopack
```

### Database connection fails
```bash
# Check Supabase connection string
psql $DATABASE_URL -c "SELECT 1;"

# Verify environment variables
echo $SUPABASE_URL
echo $DATABASE_URL
```

### Tests fail
```bash
# Reset Playwright browsers
npx playwright install --with-deps

# Run tests with debug output
npm run test -- --verbose
npm run test:e2e -- --debug
```

---

## 📚 Documentation References

- **Project Instructions:** `.github/copilot-instructions.md` (comprehensive)
- **API Testing:** `API_TESTING_REPORT.md`
- **Deployment:** `DEPLOYMENT_SUCCESS_STATUS.md`
- **OAuth Setup:** `OAUTH_DEBUG_CHECKLIST.md`
- **Database Schema:** `COMPLETE_DATABASE_SCHEMA.sql`
- **User Guide:** `AUTOPILOT_USER_GUIDE.md`

---

## 🎯 Next Steps

1. **Install all dependencies** (frontend + backend)
2. **Configure environment variables** (`.env.local` + `backend/.env`)
3. **Start backend server** (`uvicorn main:app --reload --port 8000`)
4. **Start frontend dev server** (`npm run dev --turbopack`)
5. **Run health checks** (visit `/health` endpoints)
6. **Run test suites** (`npm run test:all`)
7. **Deploy to staging** (Vercel + Render)

---

## 💡 Tips & Best Practices

- Always use `--turbopack` flag for dev/build (faster)
- Keep `requirements.txt` clean (one dependency per line)
- Test in all 5 browsers before production deploy
- Monitor Supabase connection pool usage
- Use `.env.example` as template (never commit actual keys)
- Run `final_success_test.sh` before each deploy

---

## 🆘 Support & Resources

- **Production URL:** https://pulsebridge.ai
- **GitHub:** devtestaios/autopilot-web (frontend), devtest/devtestaios-autopilot-api (backend)
- **Supabase Dashboard:** Check 64 tables + RLS policies
- **Stripe Dashboard:** Monitor webhooks and subscription events
- **Render Logs:** Monitor backend deployment and errors

---

**Status:** ✅ All critical dependencies resolved  
**Backend:** ✅ psycopg2-binary fixed  
**Frontend:** ✅ Claude Sonnet 4.5 enabled  
**Ready for:** Local dev → Staging → Production
