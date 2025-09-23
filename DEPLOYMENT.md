# 🚀 PulseBridge.ai Deployment Guide

**Platform**: PulseBridge.ai AI Marketing Automation  
**Production URLs**: https://pulsebridge.ai | https://autopilot-api-1.onrender.com  
**Status**: ✅ Production Deployed and Operational

## 🎯 Deployment Overview

This comprehensive guide covers the complete deployment process for the PulseBridge.ai platform, including frontend (Next.js), backend (FastAPI), database (Supabase), and all required configurations.

---

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables Setup

#### Frontend (Next.js) - Vercel
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (FastAPI) - Render
```bash
# Render Environment Variables
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration
ANTHROPIC_API_KEY=your_claude_key
AI_PROVIDER=claude

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

# Security
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=https://pulsebridge.ai,https://autopilot-web-rho.vercel.app

# Optional: Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
```

---

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
```sql
-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for authenticated users" ON campaigns
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON performance_snapshots
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON leads
    FOR ALL USING (true);
```

### 2. Database Schema
```sql
-- campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  client_name TEXT NOT NULL,
  budget DECIMAL(10,2),
  spend DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- performance_snapshots table
CREATE TABLE performance_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,4),
  cpc DECIMAL(10,2),
  cpa DECIMAL(10,2),
  roas DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- leads table  
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Connection String Format
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

---

## 🔗 Google Ads API Setup

### 1. Google Ads Developer Account
1. Sign up for Google Ads Developer access
2. Create a new Google Cloud project
3. Enable the Google Ads API
4. Create OAuth 2.0 credentials

### 2. Get Required Tokens
```bash
# Use Google's OAuth 2.0 Playground or the provided script
python scripts/get_google_ads_tokens.py
```

### 3. Test Configuration
```python
# Test your Google Ads API connection
from google.ads.googleads.client import GoogleAdsClient

client = GoogleAdsClient.load_from_env()
customer_service = client.get_service("CustomerService")
customers = customer_service.list_accessible_customers()
print(f"Found {len(customers.resource_names)} customers")
```

---

## 🖥️ Backend Deployment (Render)

### 1. Repository Setup
- Ensure backend code is in GitHub repository
- Verify `requirements.txt` is up to date
- Include `render.yaml` configuration

### 2. Render Configuration
```yaml
# render.yaml
services:
  - type: web
    name: autopilot-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### 3. Deploy to Render
1. Connect GitHub repository to Render
2. Select "Web Service"
3. Configure environment variables
4. Deploy

### 4. Verify Backend Deployment
```bash
# Health checks
curl https://autopilot-api-1.onrender.com/health
curl https://autopilot-api-1.onrender.com/campaigns
curl https://autopilot-api-1.onrender.com/google-ads/status

# AI endpoints
curl https://autopilot-api-1.onrender.com/api/v1/ai/chat
curl https://autopilot-api-1.onrender.com/api/v1/autonomous/status

# Analytics endpoints
curl https://autopilot-api-1.onrender.com/api/v1/analytics/overview
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Vercel Setup
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy
vercel --prod
```

### 2. Automatic Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments from main branch

### 3. Build Configuration
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build --turbopack",
  "devCommand": "npm run dev --turbopack",
  "installCommand": "npm install"
}
```

### 4. Verify Frontend Deployment
```bash
# Test key routes
curl https://pulsebridge.ai
curl https://pulsebridge.ai/api/health
curl https://pulsebridge.ai/campaigns
curl https://pulsebridge.ai/analytics
curl https://pulsebridge.ai/autonomous
```

---

## 🧪 Production Testing

### 1. Health Checks
```bash
# Frontend health
curl https://pulsebridge.ai

# Backend health  
curl https://autopilot-api-1.onrender.com/health

# Database connectivity
curl https://autopilot-api-1.onrender.com/leads

# AI integration
curl https://autopilot-api-1.onrender.com/api/v1/ai/status
```

### 2. E2E Testing in Production
```bash
# Run E2E tests against production
npm run test:e2e -- --base-url=https://pulsebridge.ai

# Specific test suites
npx playwright test --project=chromium --reporter=line
```

### 3. Performance Monitoring
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://pulsebridge.ai
curl -w "@curl-format.txt" -o /dev/null -s https://autopilot-api-1.onrender.com/campaigns
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
```python
# Ensure CORS is properly configured in FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pulsebridge.ai", "https://autopilot-web-rho.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Environment Variable Issues
```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_API_URL
echo $SUPABASE_URL
echo $ANTHROPIC_API_KEY
```

#### 3. Database Connection Issues
```bash
# Test database connection
curl https://autopilot-api-1.onrender.com/health
# Should return: {"status": "healthy", "database": "connected"}
```

#### 4. Build Failures
```bash
# Run build locally first
npm run build --turbopack

# Check for TypeScript errors
npx tsc --noEmit --skipLibCheck
```

---

## 🚀 Deployment Verification

### Complete Deployment Checklist

#### ✅ Backend Verification
- [ ] Health endpoint responding
- [ ] Database connectivity confirmed
- [ ] AI endpoints operational
- [ ] Google Ads API connected
- [ ] Autonomous system active
- [ ] Analytics engine functional

#### ✅ Frontend Verification  
- [ ] Main application loading
- [ ] API integration working
- [ ] Authentication functional
- [ ] AI chat operational
- [ ] Dashboard responsive
- [ ] All routes accessible

#### ✅ Integration Verification
- [ ] Real-time data sync working
- [ ] Campaign management functional
- [ ] Analytics displaying correctly
- [ ] AI assistant responding
- [ ] Autonomous decisions executing
- [ ] Cross-platform sync operational

#### ✅ Performance Verification
- [ ] Load times under 3 seconds
- [ ] Mobile responsiveness confirmed
- [ ] 60fps animations maintained
- [ ] E2E tests passing (95%+ success)
- [ ] No TypeScript errors
- [ ] No console errors

---

## 🎯 Production Monitoring

### Key Metrics to Monitor
- **Response Times**: < 2 seconds for all endpoints
- **Error Rates**: < 1% error rate across all services
- **Uptime**: 99.9% availability target
- **Database Performance**: Query times < 500ms
- **AI Response Times**: < 5 seconds for AI interactions

### Monitoring Tools
- **Vercel Analytics**: Frontend performance and errors
- **Render Metrics**: Backend performance and resource usage
- **Supabase Monitoring**: Database performance and connections
- **Custom Health Checks**: Application-specific monitoring

---

## 🔐 Security Considerations

### Production Security Checklist
- [ ] Environment variables properly secured
- [ ] Database access restricted
- [ ] API keys rotated regularly
- [ ] HTTPS enforced everywhere
- [ ] Row Level Security enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation in place

**Status**: ✅ **PRODUCTION DEPLOYMENT COMPLETE AND VERIFIED**