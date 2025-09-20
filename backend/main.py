"""
FastAPI Backend for Autopilot (PulseBridge.ai) Marketing Platform

This FastAPI server provides the backend API for the marketing automation platform.
It handles Google Ads integration, campaign management, and data synchronization.

Environment Variables Required:
    SUPABASE_URL
    SUPABASE_ANON_KEY
    GOOGLE_ADS_DEVELOPER_TOKEN
    GOOGLE_ADS_CLIENT_ID
    GOOGLE_ADS_CLIENT_SECRET
    GOOGLE_ADS_REFRESH_TOKEN
    GOOGLE_ADS_CUSTOMER_ID
"""

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Autopilot Marketing API",
    description="AI-powered marketing automation platform backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pulsebridge.ai",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get or create Supabase client"""
    global supabase
    if not supabase:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            raise HTTPException(
                status_code=500,
                detail="Supabase configuration missing"
            )
        
        supabase = create_client(supabase_url, supabase_key)
    
    return supabase

# Utility functions
def _iso(dt: datetime) -> str:
    """Convert datetime to ISO string"""
    return dt.isoformat().replace("+00:00", "Z")

def _today_utc() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

# Pydantic Models
class CampaignIn(BaseModel):
    name: str
    platform: str
    client_name: str
    budget: Optional[float] = None
    status: Optional[str] = "active"
    metrics: Optional[dict] = {}

class CampaignOut(BaseModel):
    id: str
    name: str
    platform: str
    client_name: str
    budget: Optional[float]
    spend: float
    status: str
    metrics: dict
    created_at: datetime
    updated_at: datetime

class PerformanceSnapshotIn(BaseModel):
    campaign_id: str
    date: str  # YYYY-MM-DD format
    impressions: Optional[int] = 0
    clicks: Optional[int] = 0
    conversions: Optional[int] = 0
    spend: Optional[float] = 0
    ctr: Optional[float] = None
    cpc: Optional[float] = None
    cpa: Optional[float] = None
    roas: Optional[float] = None

class LeadIn(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    message: Optional[str] = None

# Health check endpoints
@app.get("/")
def root():
    """Root endpoint for health check"""
    return {
        "message": "Autopilot Marketing API",
        "status": "operational",
        "timestamp": _iso(_today_utc()),
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Detailed health check"""
    try:
        # Test Supabase connection
        client = get_supabase_client()
        result = client.table("campaigns").select("count", count="exact").execute()
        
        return {
            "status": "healthy",
            "timestamp": _iso(_today_utc()),
            "services": {
                "supabase": "connected",
                "google_ads": "configured" if os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN") else "not_configured"
            },
            "database": {
                "campaigns_count": result.count if result.count else 0
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": _iso(_today_utc())
            }
        )

# Campaign endpoints
@app.get("/campaigns")
def get_campaigns(limit: int = 100) -> List[Dict]:
    """Get all campaigns"""
    try:
        client = get_supabase_client()
        response = client.table("campaigns").select("*").order("created_at", desc=True).limit(limit).execute()
        return response.data or []
    except Exception as e:
        logger.error(f"Error fetching campaigns: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/campaigns")
def create_campaign(campaign: CampaignIn):
    """Create a new campaign"""
    try:
        client = get_supabase_client()
        payload = campaign.dict()
        payload["created_at"] = _iso(_today_utc())
        payload["updated_at"] = _iso(_today_utc())
        
        response = client.table("campaigns").insert(payload).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        logger.error(f"Error creating campaign: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    """Get a specific campaign"""
    try:
        client = get_supabase_client()
        response = client.table("campaigns").select("*").eq("id", campaign_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching campaign {campaign_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/campaigns/{campaign_id}")
def update_campaign(campaign_id: str, campaign: CampaignIn):
    """Update a campaign"""
    try:
        client = get_supabase_client()
        payload = campaign.dict()
        payload["updated_at"] = _iso(_today_utc())
        
        response = client.table("campaigns").update(payload).eq("id", campaign_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating campaign {campaign_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: str):
    """Delete a campaign"""
    try:
        client = get_supabase_client()
        response = client.table("campaigns").delete().eq("id", campaign_id).execute()
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting campaign {campaign_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Performance endpoints
@app.get("/campaigns/{campaign_id}/performance")
def get_campaign_performance(campaign_id: str, days: int = 30):
    """Get campaign performance data"""
    try:
        client = get_supabase_client()
        start_date = (_today_utc() - timedelta(days=days)).date().isoformat()
        
        response = client.table("performance_snapshots").select("*").eq("campaign_id", campaign_id).gte("date", start_date).order("date", desc=False).execute()
        
        return response.data or []
    except Exception as e:
        logger.error(f"Error fetching performance for campaign {campaign_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/campaigns/{campaign_id}/performance")
def add_performance_snapshot(campaign_id: str, performance: PerformanceSnapshotIn):
    """Add performance snapshot for a campaign"""
    try:
        client = get_supabase_client()
        payload = performance.dict()
        payload["campaign_id"] = campaign_id
        payload["created_at"] = _iso(_today_utc())
        
        # Calculate derived metrics
        if payload.get("clicks") and payload.get("impressions"):
            payload["ctr"] = payload["clicks"] / payload["impressions"]
        if payload.get("spend") and payload.get("clicks"):
            payload["cpc"] = payload["spend"] / payload["clicks"]
        
        response = client.table("performance_snapshots").upsert(payload).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        logger.error(f"Error adding performance snapshot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Dashboard endpoints
@app.get("/dashboard/overview")
def dashboard_overview():
    """Get dashboard overview data"""
    try:
        client = get_supabase_client()
        
        # Get campaign counts and spend
        campaigns_response = client.table("campaigns").select("status,spend").execute()
        campaigns = campaigns_response.data or []
        
        total_campaigns = len(campaigns)
        total_spend = sum(float(c.get("spend", 0)) for c in campaigns)
        
        # Get recent performance (last 7 days)
        recent_date = (_today_utc() - timedelta(days=7)).date().isoformat()
        recent_response = client.table("performance_snapshots").select("spend,conversions").gte("date", recent_date).execute()
        recent_data = recent_response.data or []
        
        recent_spend = sum(float(p.get("spend", 0)) for p in recent_data)
        recent_conversions = sum(int(p.get("conversions", 0)) for p in recent_data)
        
        # Group campaigns by status
        status_counts = {}
        for campaign in campaigns:
            status = campaign.get("status", "unknown")
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_campaigns": total_campaigns,
            "total_spend": total_spend,
            "recent_spend_7d": recent_spend,
            "recent_conversions_7d": recent_conversions,
            "campaigns_by_status": status_counts
        }
    except Exception as e:
        logger.error(f"Error getting dashboard overview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lead management (legacy - for backward compatibility)
@app.get("/leads")
def get_leads(limit: int = 100):
    """Get leads (legacy endpoint)"""
    try:
        client = get_supabase_client()
        response = client.table("leads").select("*").order("created_at", desc=True).limit(limit).execute()
        return response.data or []
    except Exception as e:
        logger.error(f"Error fetching leads: {e}")
        # Return empty list if table doesn't exist
        return []

@app.post("/leads")
def create_lead(lead: LeadIn):
    """Create a new lead (legacy endpoint)"""
    try:
        client = get_supabase_client()
        payload = lead.dict()
        payload["created_at"] = _iso(_today_utc())
        
        response = client.table("leads").insert(payload).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Google Ads placeholder endpoints (to be implemented)
@app.get("/google-ads/status")
def google_ads_status():
    """Get Google Ads integration status"""
    return {
        "status": "configured" if os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN") else "not_configured",
        "message": "Google Ads integration ready for implementation"
    }

@app.get("/google-ads/campaigns")
def google_ads_campaigns():
    """Get Google Ads campaigns (placeholder)"""
    return {
        "message": "Google Ads integration coming soon",
        "campaigns": []
    }

@app.post("/google-ads/sync")
def sync_google_ads():
    """Sync with Google Ads (placeholder)"""
    return {
        "message": "Google Ads sync initiated",
        "status": "pending"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )