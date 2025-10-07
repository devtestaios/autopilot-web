# ===============================================
# PULSEBRIDGE.AI ENVIRONMENT VARIABLES SETUP
# Multi-Platform Marketing API Integration
# ===============================================

# ===============================================
# BACKEND ENVIRONMENT VARIABLES (.env)
# Place this file in the /backend directory
# ===============================================

# =============
# DATABASE
# =============
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# =============
# AI PROVIDERS
# =============
# Primary AI provider
ANTHROPIC_API_KEY=your_anthropic_claude_api_key
AI_PROVIDER=claude

# Secondary AI provider (optional)
OPENAI_API_KEY=your_openai_api_key

# =============
# GOOGLE ADS API
# =============
GOOGLE_ADS_DEVELOPER_TOKEN=your_google_ads_developer_token
GOOGLE_ADS_CLIENT_ID=your_google_oauth_client_id
GOOGLE_ADS_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_google_oauth_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_google_ads_customer_id

# =============
# META (FACEBOOK) ADS API
# =============
META_ACCESS_TOKEN=your_meta_long_lived_access_token
META_AD_ACCOUNT_ID=your_meta_ad_account_id
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# =============
# LINKEDIN ADS API
# =============
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_AD_ACCOUNT_ID=your_linkedin_ad_account_id
LINKEDIN_CLIENT_ID=your_linkedin_app_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_app_client_secret

# =============
# PINTEREST ADS API (Future)
# =============
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
PINTEREST_AD_ACCOUNT_ID=your_pinterest_ad_account_id
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret

# =============
# API CONFIGURATION
# =============
# Rate limiting and timeout settings
API_REQUEST_TIMEOUT=30
API_RATE_LIMIT_ENABLED=true
API_MAX_RETRIES=3

# Logging level
LOG_LEVEL=INFO

# ===============================================
# FRONTEND ENVIRONMENT VARIABLES (.env.local)
# Place this file in the root directory
# ===============================================

# =============
# API ENDPOINTS
# =============
NEXT_PUBLIC_API_URL=http://localhost:8000
# For production: NEXT_PUBLIC_API_URL=https://your-backend-deployment-url

# =============
# DATABASE (Frontend)
# =============
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# =============
# FEATURES FLAGS
# =============
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_MULTI_PLATFORM=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# ===============================================
# GOOGLE ADS API SETUP GUIDE
# ===============================================

# 1. Get Google Ads API Developer Token:
#    - Go to: https://ads.google.com/home/tools/manager-accounts/
#    - Apply for developer token in your Manager Account
#    - Wait for approval (can take several days)

# 2. Create OAuth2 Credentials:
#    - Go to: https://console.developers.google.com/
#    - Create new project or select existing
#    - Enable Google Ads API
#    - Create OAuth2 credentials (Web application)
#    - Add redirect URI: http://localhost:3000/auth/callback

# 3. Generate Refresh Token:
#    - Use OAuth2 flow to get authorization code
#    - Exchange for access token and refresh token
#    - Store refresh token in environment variables

# ===============================================
# META ADS API SETUP GUIDE  
# ===============================================

# 1. Create Meta App:
#    - Go to: https://developers.facebook.com/
#    - Create new app, select "Business" type
#    - Add Marketing API product

# 2. Get Access Token:
#    - Generate long-lived access token (60 days)
#    - Use Graph API Explorer or Business SDK
#    - Required permissions: ads_management, ads_read, business_management

# 3. Get Ad Account ID:
#    - Go to Meta Ads Manager
#    - Account ID is in URL or account settings
#    - Format: act_123456789 (include 'act_' prefix)

# ===============================================
# LINKEDIN ADS API SETUP GUIDE
# ===============================================

# 1. Create LinkedIn App:
#    - Go to: https://www.linkedin.com/developers/apps
#    - Create new app with your company page
#    - Request access to Marketing Developer Platform

# 2. OAuth2 Setup:
#    - Add redirect URLs in app settings
#    - Required scopes: r_ads, r_ads_reporting, w_ads
#    - Use OAuth2 flow to get access token

# 3. Get Ad Account ID:
#    - Use LinkedIn Campaign Manager
#    - Account ID format: 123456789 (numeric ID)

# ===============================================
# TESTING API CONNECTIONS
# ===============================================

# Test Google Ads:
curl -X GET "http://localhost:8000/google-ads/status"

# Test Meta Ads:
curl -X GET "http://localhost:8000/meta-ads/status"  

# Test LinkedIn Ads:
curl -X GET "http://localhost:8000/linkedin-ads/status"

# ===============================================
# PRODUCTION DEPLOYMENT NOTES
# ===============================================

# 1. Update API URLs for production:
#    - Backend: Update NEXT_PUBLIC_API_URL
#    - CORS: Update allowed origins in FastAPI

# 2. Secure credentials:
#    - Use platform-specific secret management
#    - Rotate tokens regularly
#    - Monitor API usage and quotas

# 3. Rate limiting:
#    - Configure appropriate request rates
#    - Implement exponential backoff
#    - Monitor API error rates

# ===============================================
# TROUBLESHOOTING
# ===============================================

# Common issues:
# - Invalid credentials: Check token expiration
# - Rate limiting: Reduce request frequency  
# - CORS errors: Update allowed origins
# - API quotas: Monitor usage in platform dashboards

# Debug endpoints:
# GET /health - Backend health check
# GET /api/status - API status overview
# GET /{platform}/status - Platform-specific status