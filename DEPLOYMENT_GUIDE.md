# Autopilot Platform - Deployment Guide

## Overview
This guide covers the complete deployment process for the Autopilot AI-powered marketing platform, including frontend (Next.js), backend (FastAPI), and required configurations.

## Pre-Deployment Checklist

### Environment Variables Setup

#### Frontend (Next.js) - Vercel
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com
```

#### Backend (FastAPI) - Render
Configure the following environment variables in Render:
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

# API Security
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Optional: Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
```

## Database Setup (Supabase)

### 1. Create Supabase Project
```sql
-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies (add user authentication when ready)
CREATE POLICY "Enable all operations for authenticated users" ON campaigns
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON performance_snapshots
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON leads
    FOR ALL USING (true);
```

### 2. Connection String Format
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Google Ads API Setup

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

## Backend Deployment (Render)

### 1. Repository Setup
- Ensure your backend code is in a GitHub repository
- Make sure `requirements.txt` is up to date
- Include `render.yaml` configuration (optional)

### 2. Render Configuration
```yaml
# render.yaml
services:
  - type: web
    name: autopilot-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### 3. Deploy to Render
1. Connect your GitHub repository to Render
2. Select "Web Service"
3. Configure environment variables
4. Deploy

### 4. Verify Deployment
```bash
curl https://autopilot-api-1.onrender.com/health
curl https://autopilot-api-1.onrender.com/campaigns
```

## Frontend Deployment (Vercel)

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
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Testing in Production

### 1. Health Checks
```bash
# Backend health check
curl https://autopilot-api-1.onrender.com/health

# Frontend check
curl https://your-app.vercel.app
```

### 2. API Integration Test
```javascript
// Test from browser console
fetch('https://autopilot-api-1.onrender.com/campaigns')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. Google Ads Integration Test
```bash
# Test Google Ads connection
curl https://autopilot-api-1.onrender.com/google-ads/status
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_performance_campaign_id ON performance_snapshots(campaign_id);
```

### 2. Caching Strategy
```python
# Add Redis caching for API responses (optional)
import redis
from functools import wraps

redis_client = redis.Redis.from_url(os.getenv('REDIS_URL'))

def cache_result(expiration=300):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            result = func(*args, **kwargs)
            redis_client.setex(cache_key, expiration, json.dumps(result))
            return result
        return wrapper
    return decorator
```

### 3. Frontend Optimization
```javascript
// Enable Next.js optimization features
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
}

export default nextConfig;
```

## Monitoring and Logging

### 1. Application Monitoring
```python
# Add Sentry for error tracking
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
)
```

### 2. Performance Monitoring
```javascript
// Add Web Vitals tracking
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

### 3. API Monitoring
```python
# Add endpoint monitoring
from prometheus_client import Counter, Histogram
import time

REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('api_request_duration_seconds', 'API request latency')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_LATENCY.observe(duration)
    
    return response
```

## Security Considerations

### 1. API Security
```python
# Add rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/campaigns")
@limiter.limit("100/minute")
async def get_campaigns(request: Request):
    # Your endpoint logic
    pass
```

### 2. CORS Configuration
```python
# Production CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### 3. Environment Security
- Never commit sensitive environment variables
- Use secrets management (Render's environment variables, Vercel's environment variables)
- Rotate API keys regularly
- Enable HTTPS everywhere

## Backup and Recovery

### 1. Database Backups
```bash
# Supabase provides automatic backups
# Download manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 2. Application Backups
- GitHub repositories serve as code backups
- Environment variables should be documented securely
- Keep configuration files in version control

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify frontend URL in backend CORS settings
   - Check environment variables

2. **Google Ads API Errors**
   - Verify all tokens are correctly set
   - Check customer ID format
   - Ensure API quotas aren't exceeded

3. **Database Connection Issues**
   - Verify connection string format
   - Check Supabase project status
   - Verify network access

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Debug Commands
```bash
# Check backend logs
render logs --service autopilot-api

# Check frontend deployment
vercel logs your-deployment-url

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

## Scaling Considerations

### 1. Database Scaling
- Monitor connection pool usage
- Consider read replicas for heavy read workloads
- Implement connection pooling

### 2. API Scaling
- Render automatically scales based on traffic
- Consider adding Redis for session management
- Implement proper caching strategies

### 3. Frontend Scaling
- Vercel provides automatic CDN and scaling
- Optimize bundle size
- Implement proper image optimization

## Cost Optimization

### 1. Render (Backend)
- Use starter plan for development
- Monitor usage and scale appropriately
- Consider reserved instances for predictable workloads

### 2. Vercel (Frontend)
- Free tier covers most small to medium applications
- Monitor bandwidth usage
- Optimize static assets

### 3. Supabase (Database)
- Free tier includes 500MB database
- Monitor storage and bandwidth usage
- Consider upgrading based on actual usage

This deployment guide ensures a production-ready Autopilot platform with proper monitoring, security, and scalability considerations.