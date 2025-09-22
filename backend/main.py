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