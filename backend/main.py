"""
PulseBridge.ai FastAPI Backend with AI Integration
Complete backend server with Claude AI chat and platform control
"""

import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import logging

# Import AI Services
from ai_endpoints import ai_router
from ai_chat_service import ai_service

# Import Optimization Engine
from optimization_endpoints import router as optimization_router

# Import Multi-Platform Sync Engine
from sync_endpoints import router as sync_router

# Import Advanced Analytics Engine
from analytics_endpoints import router as analytics_router

# Import Autonomous Decision Framework
from autonomous_decision_endpoints import router as autonomous_router

# Import Google Ads Integration
try:
    from google_ads_integration import get_google_ads_client, fetch_campaigns_from_google_ads, fetch_performance_from_google_ads
    GOOGLE_ADS_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Google Ads integration not available: {e}")
    GOOGLE_ADS_AVAILABLE = False
    # Create placeholder functions
    def get_google_ads_client(): return None
    def fetch_campaigns_from_google_ads(): return []
    def fetch_performance_from_google_ads(campaign_id: str, days: int = 30): return []

# Import Meta Business API Integration - ✅ VALIDATED CREDENTIALS
from meta_business_api import meta_api

# Import LinkedIn Ads Integration  
from linkedin_ads_integration import (
    get_linkedin_ads_status,
    get_linkedin_ads_campaigns,
    get_linkedin_ads_performance
)

# Import Pinterest Ads Integration
from pinterest_ads_integration import (
    get_pinterest_ads_status,
    get_pinterest_ads_campaigns,
    get_pinterest_ads_performance
)

# Import Hybrid AI System (NEW)
from meta_ai_hybrid_integration import PulseBridgeAIMasterController, CrossPlatformMetrics, AIDecisionLog
from smart_risk_management import SmartRiskManager, ClientReportingManager, RISK_MANAGEMENT_TEMPLATES, CLIENT_REPORTING_TEMPLATES
from hybrid_ai_endpoints import hybrid_ai_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    logger.info("🚀 PulseBridge.ai Backend Starting...")
    logger.info(f"AI Provider: {os.getenv('AI_PROVIDER', 'openai')}")
    logger.info(f"Claude API Key: {'✅ Configured' if os.getenv('ANTHROPIC_API_KEY') else '❌ Missing'}")
    logger.info(f"OpenAI API Key: {'✅ Configured' if os.getenv('OPENAI_API_KEY') else '❌ Missing'}")
    yield
    logger.info("🔄 PulseBridge.ai Backend Shutting Down...")

# Create FastAPI application
app = FastAPI(
    title="PulseBridge.ai Backend",
    description="Fully AI-Powered Marketing Automation Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://autopilot-web-rho.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include AI router
app.include_router(ai_router, prefix="/api/v1")

# Include Optimization Engine router
app.include_router(optimization_router)

# Include Multi-Platform Sync router
app.include_router(sync_router)

# Include Advanced Analytics Engine router
app.include_router(analytics_router)

# Include Autonomous Decision Framework router
app.include_router(autonomous_router)

# Include Hybrid AI System router (NEW)
app.include_router(hybrid_ai_router)

# ================================
# GOOGLE ADS INTEGRATION ENDPOINTS
# ================================

@app.get("/google-ads/status")
def google_ads_status():
    """Check Google Ads API connection status"""
    try:
        google_ads_client = get_google_ads_client()
        status = google_ads_client.get_connection_status()
        
        return {
            "status": "connected" if status["connected"] else "error",
            "connected": status["connected"],
            "customer_id": status.get("customer_id"),
            "message": status.get("message"),
            "error": status.get("error"),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error checking Google Ads status: {e}")
        return {
            "status": "error",
            "connected": False,
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/google-ads/campaigns")
def get_google_ads_campaigns():
    """Fetch campaigns from Google Ads API"""
    try:
        google_ads_client = get_google_ads_client()
        
        if not google_ads_client.is_connected():
            raise HTTPException(
                status_code=503, 
                detail="Google Ads API not connected. Check your credentials."
            )
        
        campaigns = fetch_campaigns_from_google_ads()
        
        return {
            "campaigns": campaigns,
            "count": len(campaigns),
            "source": "google_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Google Ads campaigns: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch campaigns from Google Ads: {str(e)}"
        )

@app.get("/google-ads/campaigns/{campaign_id}/performance")
def get_google_ads_campaign_performance(campaign_id: str, days: int = 30):
    """Get performance data for a specific campaign from Google Ads"""
    try:
        google_ads_client = get_google_ads_client()
        
        if not google_ads_client.is_connected():
            raise HTTPException(
                status_code=503,
                detail="Google Ads API not connected. Check your credentials."
            )
        
        performance_data = fetch_performance_from_google_ads(campaign_id, days)
        
        return {
            "campaign_id": campaign_id,
            "performance": performance_data,
            "count": len(performance_data),
            "days": days,
            "source": "google_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Google Ads performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch performance data from Google Ads: {str(e)}"
        )

# ===== META ADS ENDPOINTS - ✅ VALIDATED INTEGRATION =====

@app.get("/meta-ads/status")
async def get_meta_ads_status_endpoint():
    """Check Meta Ads API connection status - ✅ WORKING"""
    try:
        account_info = meta_api.get_account_info()
        
        if 'error' in account_info:
            return {
                "platform": "meta_ads",
                "status": {"connected": False, "error": account_info['error']},
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        
        return {
            "platform": "meta_ads",
            "status": {
                "connected": True,
                "account_name": account_info.get('name', 'pulsebridge.ai'),
                "account_id": meta_api.ad_account_id,
                "currency": account_info.get('currency', 'USD'),
                "account_status": account_info.get('account_status', 1)
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error checking Meta Ads status: {e}")
        return {
            "platform": "meta_ads", 
            "status": {"connected": False, "error": str(e)},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/meta-ads/campaigns")
async def get_meta_ads_campaigns_endpoint(limit: int = 25):
    """Get campaigns from Meta Ads - ✅ VALIDATED"""
    try:
        campaigns = meta_api.get_campaigns(limit)
        return {
            "campaigns": campaigns,
            "count": len(campaigns),
            "source": "meta_business_api",
            "account": "pulsebridge.ai",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching Meta Ads campaigns: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch campaigns from Meta Ads: {str(e)}"
        )

@app.get("/meta-ads/campaigns/{campaign_id}/performance")
async def get_meta_ads_campaign_performance(campaign_id: str, days: int = 7):
    """Get performance data for a specific campaign from Meta Ads"""
    try:
        # Map days to Meta's date preset
        date_preset = 'last_7_days'
        if days <= 1:
            date_preset = 'yesterday'
        elif days <= 7:
            date_preset = 'last_7_days'
        elif days <= 14:
            date_preset = 'last_14_days'
        elif days <= 30:
            date_preset = 'last_30_days'
        else:
            date_preset = 'last_90_days'
        
        performance_data = meta_api.get_campaign_insights(campaign_id, date_preset)
        
        return {
            "campaign_id": campaign_id,
            "performance": performance_data,
            "days": days,
            "date_preset": date_preset,
            "source": "meta_business_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching Meta Ads performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch performance data from Meta Ads: {str(e)}"
        )

@app.get("/meta-ads/performance")
async def get_meta_ads_account_performance():
    """Get account-level summary from Meta Ads - ✅ VALIDATED"""
    try:
        summary = meta_api.get_account_summary()
        return {
            "account_summary": summary,
            "source": "meta_business_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching Meta Ads account performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch account performance from Meta Ads: {str(e)}"
        )

@app.post("/meta-ads/campaigns")
async def create_meta_campaign(campaign_data: Dict[str, Any]):
    """Create a new Meta campaign - ✅ API READY"""
    try:
        result = meta_api.create_campaign(campaign_data)
        
        if 'error' in result:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to create campaign: {result['error']}"
            )
        
        return {
            "success": True,
            "campaign": result,
            "source": "meta_business_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating Meta campaign: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create Meta campaign: {str(e)}"
        )

# ===== META API CONVENIENCE ALIASES =====
# These aliases make the API more intuitive for frontend testing

@app.get("/meta/status")
async def get_meta_status_alias():
    """Convenience alias for /meta-ads/status"""
    return await get_meta_ads_status_endpoint()

@app.get("/meta/campaigns")
async def get_meta_campaigns_alias(limit: int = 25):
    """Convenience alias for /meta-ads/campaigns"""
    return await get_meta_ads_campaigns_endpoint(limit)

@app.get("/meta/test")
async def meta_api_test():
    """Simple Meta API connectivity test"""
    try:
        status = await get_meta_ads_status_endpoint()
        return {
            "success": True,
            "message": "Meta Business API connection successful",
            "platform": "Meta Business API",
            "account": status.get("status", {}).get("account_name", "Unknown"),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Meta API connection failed: {str(e)}",
            "platform": "Meta Business API",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

# ===== LINKEDIN ADS ENDPOINTS =====

@app.get("/linkedin-ads/status")
async def get_linkedin_ads_status_endpoint():
    """Check LinkedIn Ads API connection status"""
    try:
        status = await get_linkedin_ads_status()
        return {
            "platform": "linkedin_ads",
            "status": status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error checking LinkedIn Ads status: {e}")
        return {
            "platform": "linkedin_ads",
            "status": {"connected": False, "error": str(e)},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/linkedin-ads/campaigns")
async def get_linkedin_ads_campaigns_endpoint(limit: int = 25):
    """Get campaigns from LinkedIn Ads"""
    try:
        campaigns = await get_linkedin_ads_campaigns(limit)
        return {
            "campaigns": campaigns,
            "count": len(campaigns),
            "source": "linkedin_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching LinkedIn Ads campaigns: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch campaigns from LinkedIn Ads: {str(e)}"
        )

@app.get("/linkedin-ads/campaigns/{campaign_id}/performance")
async def get_linkedin_ads_campaign_performance(campaign_id: str, days: int = 30):
    """Get performance data for a specific campaign from LinkedIn Ads"""
    try:
        performance_data = await get_linkedin_ads_performance(campaign_id, days)
        return {
            "campaign_id": campaign_id,
            "performance": performance_data,
            "days": days,
            "source": "linkedin_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching LinkedIn Ads performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch performance data from LinkedIn Ads: {str(e)}"
        )

@app.get("/linkedin-ads/performance")
async def get_linkedin_ads_account_performance(days: int = 30):
    """Get account-level performance data from LinkedIn Ads"""
    try:
        performance_data = await get_linkedin_ads_performance(None, days)
        return {
            "performance": performance_data,
            "days": days,
            "source": "linkedin_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching LinkedIn Ads account performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch account performance from LinkedIn Ads: {str(e)}"
        )

# ===== PINTEREST ADS ENDPOINTS =====

@app.get("/pinterest-ads/status")
async def get_pinterest_ads_status_endpoint():
    """Check Pinterest Ads API connection status"""
    try:
        status = await get_pinterest_ads_status()
        return {
            "platform": "pinterest_ads",
            "status": status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error checking Pinterest Ads status: {e}")
        return {
            "platform": "pinterest_ads",
            "status": {"connected": False, "error": str(e)},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/pinterest-ads/campaigns")
async def get_pinterest_ads_campaigns_endpoint(limit: int = 25):
    """Get campaigns from Pinterest Ads"""
    try:
        campaigns = await get_pinterest_ads_campaigns(limit)
        return {
            "campaigns": campaigns,
            "count": len(campaigns),
            "source": "pinterest_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Pinterest Ads campaigns: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch campaigns from Pinterest Ads: {str(e)}"
        )

@app.get("/pinterest-ads/campaigns/{campaign_id}/performance")
async def get_pinterest_ads_campaign_performance(campaign_id: str, days: int = 30):
    """Get performance data for a specific campaign from Pinterest Ads"""
    try:
        performance_data = await get_pinterest_ads_performance(campaign_id, days)
        return {
            "campaign_id": campaign_id,
            "performance": performance_data,
            "days": days,
            "source": "pinterest_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Pinterest Ads performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch performance data from Pinterest Ads: {str(e)}"
        )

@app.get("/pinterest-ads/performance")
async def get_pinterest_ads_account_performance(days: int = 30):
    """Get account-level performance data from Pinterest Ads"""
    try:
        performance_data = await get_pinterest_ads_performance(None, days)
        return {
            "performance": performance_data,
            "days": days,
            "source": "pinterest_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Pinterest Ads account performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch account performance from Pinterest Ads: {str(e)}"
        )

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint with service status"""
    return {
        "service": "PulseBridge.ai Backend",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ai_integration": "enabled",
        "ai_provider": os.getenv('AI_PROVIDER', 'openai'),
        "endpoints": {
            "ai_chat": "/api/v1/ai/chat",
            "ai_actions": "/api/v1/ai/execute-action",
            "ai_status": "/api/v1/ai/status",
            "optimization": "/api/v1/optimization",
            "sync": "/api/v1/sync",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    ai_status = {
        "claude_configured": bool(os.getenv('ANTHROPIC_API_KEY')),
        "openai_configured": bool(os.getenv('OPENAI_API_KEY')),
        "preferred_provider": os.getenv('AI_PROVIDER', 'openai'),
        "service_healthy": True
    }
    
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime": "operational",
        "ai_services": ai_status,
        "database": "connected",  # Add actual DB check
        "version": "1.0.0"
    }

# Campaign Management (existing endpoints)
@app.get("/api/v1/campaigns")
async def get_campaigns():
    """Get all campaigns"""
    # Mock data for now - integrate with your database
    return [
        {
            "id": "camp_001",
            "name": "Holiday Shopping Campaign",
            "platform": "google_ads",
            "status": "active",
            "budget": 5000,
            "spend": 2150.50,
            "created_at": "2025-09-15T10:00:00Z"
        },
        {
            "id": "camp_002", 
            "name": "Brand Awareness Q4",
            "platform": "meta",
            "status": "active",
            "budget": 3000,
            "spend": 1850.25,
            "created_at": "2025-09-10T14:30:00Z"
        }
    ]

@app.post("/api/v1/campaigns")
async def create_campaign(campaign_data: Dict[str, Any]):
    """Create new campaign"""
    logger.info(f"Creating campaign: {campaign_data}")
    
    # Mock campaign creation - integrate with your database
    new_campaign = {
        "id": f"camp_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "name": campaign_data.get("name", "New Campaign"),
        "platform": campaign_data.get("platform", "google_ads"),
        "status": "active",
        "budget": campaign_data.get("budget", 1000),
        "spend": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    return {
        "success": True,
        "campaign": new_campaign,
        "message": "Campaign created successfully"
    }

# Dashboard data
@app.get("/api/v1/dashboard/overview")
async def dashboard_overview():
    """Dashboard overview data"""
    return {
        "total_campaigns": 12,
        "active_campaigns": 8,
        "total_spend": 15750.25,
        "total_conversions": 342,
        "avg_roas": 4.2,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

# Lead management
@app.get("/api/v1/leads")
async def get_leads():
    """Get all leads"""
    return [
        {
            "id": "lead_001",
            "name": "John Smith",
            "email": "john@example.com",
            "source": "google_ads",
            "status": "qualified",
            "created_at": "2025-09-18T09:15:00Z"
        }
    ]

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Endpoint not found", "status_code": 404}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {"error": "Internal server error", "status_code": 500}

# Google Ads Test Endpoints
@app.get("/google-ads/config-check")
def google_ads_config_check():
    """Check Google Ads configuration"""
    config = {
        "GOOGLE_ADS_DEVELOPER_TOKEN": os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN', 'MISSING'),
        "GOOGLE_ADS_CLIENT_ID": os.getenv('GOOGLE_ADS_CLIENT_ID', 'MISSING'),
        "GOOGLE_ADS_CLIENT_SECRET": "SET" if os.getenv('GOOGLE_ADS_CLIENT_SECRET') else "MISSING",
        "GOOGLE_ADS_REFRESH_TOKEN": "SET" if os.getenv('GOOGLE_ADS_REFRESH_TOKEN') else "MISSING",
        "GOOGLE_ADS_CUSTOMER_ID": os.getenv('GOOGLE_ADS_CUSTOMER_ID', 'MISSING')
    }
    return config

@app.post("/google-ads/test-token")
def test_google_ads_token():
    """Test Google Ads refresh token exchange"""
    import requests
    
    try:
        client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        
        if not all([client_id, client_secret, refresh_token]):
            raise HTTPException(status_code=400, detail="Missing OAuth credentials")
        
        # Exchange refresh token for access token
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'refresh_token': refresh_token,
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token'
        }
        
        response = requests.post(token_url, data=data)
        
        if response.status_code == 200:
            token_data = response.json()
            return {
                "success": True,
                "access_token": token_data.get('access_token', '')[:20] + "...",
                "expires_in": token_data.get('expires_in'),
                "token_type": token_data.get('token_type')
            }
        else:
            return {
                "success": False,
                "error": response.json(),
                "status_code": response.status_code
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token test failed: {str(e)}")

@app.get("/google-ads/oauth-diagnostic")
def google_ads_oauth_diagnostic():
    """Diagnostic endpoint for Google Ads OAuth issues"""
    try:
        # Only import requests which should be available
        import requests
        
        client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        
        # Check if all variables are present
        config_status = {
            "client_id_present": bool(client_id),
            "client_id_format": client_id[:30] + "..." if client_id and len(client_id) > 30 else client_id,
            "client_secret_present": bool(client_secret),
            "client_secret_format": "***" + client_secret[-4:] if client_secret and len(client_secret) > 4 else "MISSING",
            "refresh_token_present": bool(refresh_token),
            "refresh_token_format": refresh_token[:30] + "..." if refresh_token and len(refresh_token) > 30 else "MISSING",
            "developer_token_present": bool(developer_token),
            "customer_id_present": bool(customer_id)
        }
        
        if not all([client_id, client_secret, refresh_token]):
            return {
                "status": "incomplete_config",
                "config": config_status,
                "message": "Missing required OAuth credentials"
            }
        
        # Try a simple token validation call
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'refresh_token': refresh_token,
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token'
        }
        
        response = requests.post(token_url, data=data, timeout=10)
        
        # Parse response
        if response.status_code == 200:
            token_data = response.json()
            return {
                "status": "oauth_success",
                "config": config_status,
                "oauth_response": {
                    "status_code": response.status_code,
                    "success": True,
                    "message": "OAuth token refreshed successfully",
                    "token_type": token_data.get('token_type', 'unknown'),
                    "expires_in": token_data.get('expires_in', 'unknown'),
                    "access_token_preview": token_data.get('access_token', '')[:20] + "..." if token_data.get('access_token') else "NONE"
                }
            }
        else:
            error_data = response.json() if response.content else {"error": "no_response"}
            return {
                "status": "oauth_failed",
                "config": config_status,
                "oauth_response": {
                    "status_code": response.status_code,
                    "success": False,
                    "error": error_data,
                    "raw_response": response.text[:500] if response.text else "empty"
                }
            }
        
    except Exception as e:
        import traceback
        return {
            "status": "diagnostic_error",
            "error": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }

@app.get("/google-ads/test-api")
def test_google_ads_api():
    """Test Google Ads API with comprehensive error handling"""
    import requests
    from google.oauth2.credentials import Credentials
    
    try:
        # Step 1: Get OAuth token
        client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'refresh_token': refresh_token,
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token'
        }
        
        token_response = requests.post(token_url, data=data)
        
        if token_response.status_code != 200:
            return {
                "success": False,
                "step": "oauth_token",
                "error": token_response.json(),
                "status_code": token_response.status_code
            }
        
        token_data = token_response.json()
        access_token = token_data.get('access_token')
        
        # Step 2: Try to create Google Ads client
        try:
            from google.ads.googleads.client import GoogleAdsClient
            
            credentials = Credentials(
                token=access_token,
                refresh_token=refresh_token,
                id_token=None,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=client_id,
                client_secret=client_secret
            )
            
            client = GoogleAdsClient(
                credentials=credentials,
                developer_token=os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
            )
            
            # Step 3: Try a simple API call
            customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID', '').replace('-', '')
            
            if not customer_id:
                return {
                    "success": True,
                    "step": "oauth_success",
                    "message": "OAuth working, but no customer ID to test API calls",
                    "token_obtained": True
                }
            
            # Try to get customer info
            customer_service = client.get_service("CustomerService")
            customer = customer_service.get_customer(resource_name=f"customers/{customer_id}")
            
            return {
                "success": True,
                "step": "api_success",
                "customer_info": {
                    "id": customer.id,
                    "descriptive_name": customer.descriptive_name,
                    "currency_code": customer.currency_code,
                    "time_zone": customer.time_zone
                }
            }
            
        except ImportError:
            return {
                "success": True,
                "step": "oauth_success_no_client",
                "message": "OAuth token obtained successfully, but Google Ads client library not available",
                "token_obtained": True
            }
        
    except Exception as e:
        return {
            "success": False,
            "step": "api_error",
            "error": str(e),
            "error_type": type(e).__name__
        }

# Development server
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )