"""
Phase 1 Live API Integration Endpoints for PulseBridge AI
FastAPI endpoints that integrate Google Ads and Meta Business APIs
"""

import asyncio
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Query
from pydantic import BaseModel, Field
import structlog
from sqlalchemy.orm import Session

# Import our API integration modules
try:
    from .google_ads_integration import GoogleAdsIntegration, create_google_ads_client, GoogleAdsAPIError
except ImportError:
    GoogleAdsIntegration = None
    
try:
    from .meta_business_integration import MetaBusinessIntegration, create_meta_business_client, MetaAPIError
except ImportError:
    MetaBusinessIntegration = None

# Pydantic models for API requests/responses
class CampaignSyncRequest(BaseModel):
    platform: str = Field(..., description="Platform to sync (google_ads, meta)")
    client_name: str = Field(..., description="Client name for campaign organization")
    force_full_sync: bool = Field(False, description="Force full sync instead of incremental")

class BudgetUpdateRequest(BaseModel):
    campaign_id: str = Field(..., description="Platform-specific campaign ID")
    platform: str = Field(..., description="Platform (google_ads, meta)")  
    new_budget: float = Field(..., gt=0, description="New budget amount in dollars")
    reason: str = Field("AI Optimization", description="Reason for budget change")

class CampaignActionRequest(BaseModel):
    campaign_id: str = Field(..., description="Platform-specific campaign ID")
    platform: str = Field(..., description="Platform (google_ads, meta)")
    action: str = Field(..., description="Action to perform (pause, resume)")
    reason: str = Field("AI Decision", description="Reason for action")

class PlatformCredentialsTest(BaseModel):
    platform: str = Field(..., description="Platform to test (google_ads, meta)")
    credentials: Dict[str, str] = Field(..., description="Platform credentials to test")

# Configure logging
logger = structlog.get_logger(__name__)

# Create router for API integration endpoints
api_integration_router = APIRouter(prefix="/api/v1/integrations", tags=["Live API Integration"])

# Dependency for database session (implement based on your DB setup)
def get_db():
    """Database dependency - implement based on your database setup"""
    # This should return your database session
    # For now, returning None as placeholder
    return None

@api_integration_router.get("/status")
async def get_integration_status() -> Dict[str, Any]:
    """Get status of all platform integrations"""
    try:
        status = {
            "google_ads": {
                "available": GoogleAdsIntegration is not None,
                "configured": bool(os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')),
                "status": "ready" if GoogleAdsIntegration and os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN') else "not_configured"
            },
            "meta": {
                "available": MetaBusinessIntegration is not None,
                "configured": bool(os.getenv('META_ACCESS_TOKEN')),
                "status": "ready" if MetaBusinessIntegration and os.getenv('META_ACCESS_TOKEN') else "not_configured"
            },
            "last_checked": datetime.now().isoformat()
        }
        
        logger.info("Integration status retrieved", status=status)
        return status
        
    except Exception as e:
        logger.error("Error retrieving integration status", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")

@api_integration_router.post("/sync/campaigns")
async def sync_campaigns(request: CampaignSyncRequest, 
                        background_tasks: BackgroundTasks,
                        db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Sync campaigns from advertising platforms
    This endpoint initiates campaign synchronization in the background
    """
    try:
        if request.platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            # Add background task for Google Ads sync
            background_tasks.add_task(
                sync_google_ads_campaigns, 
                request.client_name, 
                request.force_full_sync
            )
            
        elif request.platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            # Add background task for Meta sync
            background_tasks.add_task(
                sync_meta_campaigns, 
                request.client_name, 
                request.force_full_sync
            )
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
        
        result = {
            "success": True,
            "platform": request.platform,
            "client_name": request.client_name,
            "sync_type": "full" if request.force_full_sync else "incremental",
            "status": "initiated",
            "message": f"Campaign sync initiated for {request.platform}",
            "initiated_at": datetime.now().isoformat()
        }
        
        logger.info("Campaign sync initiated", 
                   platform=request.platform, 
                   client_name=request.client_name)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error initiating campaign sync", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to initiate sync: {str(e)}")

@api_integration_router.get("/campaigns/{platform}")
async def get_platform_campaigns(platform: str, 
                                client_name: Optional[str] = Query(None),
                                limit: int = Query(100, ge=1, le=500)) -> List[Dict[str, Any]]:
    """Get campaigns from specific platform"""
    try:
        if platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            google_client = create_google_ads_client({
                'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
                'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                'customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            })
            
            campaigns = await google_client.get_campaigns()
            
            # Convert to dict format
            campaigns_data = [
                {
                    "id": c.id,
                    "name": c.name,
                    "status": c.status,
                    "budget": c.budget_amount,
                    "campaign_type": c.campaign_type,
                    "platform": "google_ads",
                    "start_date": c.start_date,
                    "end_date": c.end_date
                }
                for c in campaigns[:limit]
            ]
            
        elif platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            meta_client = create_meta_business_client({
                'access_token': os.getenv('META_ACCESS_TOKEN'),
                'ad_account_id': os.getenv('META_AD_ACCOUNT_ID')
            })
            
            campaigns = await meta_client.get_campaigns(limit=limit)
            
            # Convert to dict format  
            campaigns_data = [
                {
                    "id": c.id,
                    "name": c.name,
                    "status": c.status,
                    "budget": c.daily_budget_dollars,
                    "campaign_type": c.objective,
                    "platform": "meta",
                    "start_date": c.start_time,
                    "end_date": c.stop_time
                }
                for c in campaigns
            ]
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")
        
        logger.info("Retrieved platform campaigns", 
                   platform=platform, 
                   count=len(campaigns_data))
        
        return campaigns_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error retrieving platform campaigns", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to retrieve campaigns: {str(e)}")

@api_integration_router.get("/performance/{platform}")
async def get_platform_performance(platform: str,
                                 campaign_id: Optional[str] = Query(None),
                                 days_back: int = Query(30, ge=1, le=365)) -> List[Dict[str, Any]]:
    """Get performance metrics from specific platform"""
    try:
        date_from = datetime.now() - timedelta(days=days_back)
        date_to = datetime.now() - timedelta(days=1)
        
        if platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            google_client = create_google_ads_client({
                'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
                'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                'customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            })
            
            performance = await google_client.get_campaign_performance(
                campaign_id=campaign_id,
                date_from=date_from,
                date_to=date_to
            )
            
            # Convert to dict format
            performance_data = [
                {
                    "campaign_id": p.campaign_id,
                    "date": p.date,
                    "impressions": p.impressions,
                    "clicks": p.clicks,
                    "conversions": p.conversions,
                    "spend": p.cost,
                    "ctr": p.ctr,
                    "cpc": p.cpc,
                    "cpa": p.cpa,
                    "roas": p.roas,
                    "platform": "google_ads"
                }
                for p in performance
            ]
            
        elif platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            meta_client = create_meta_business_client({
                'access_token': os.getenv('META_ACCESS_TOKEN'),
                'ad_account_id': os.getenv('META_AD_ACCOUNT_ID')
            })
            
            insights = await meta_client.get_campaign_insights(
                campaign_id=campaign_id,
                date_from=date_from,
                date_to=date_to
            )
            
            # Convert to dict format
            performance_data = [
                {
                    "campaign_id": i.campaign_id,
                    "date": i.date_start,
                    "impressions": i.impressions,
                    "clicks": i.clicks,
                    "conversions": i.conversions,
                    "spend": i.spend,
                    "ctr": i.ctr,
                    "cpc": i.cpc,
                    "cpa": i.spend / i.conversions if i.conversions > 0 else None,
                    "roas": i.roas,
                    "platform": "meta"
                }
                for i in insights
            ]
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")
        
        logger.info("Retrieved platform performance", 
                   platform=platform, 
                   records=len(performance_data),
                   campaign_id=campaign_id)
        
        return performance_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error retrieving platform performance", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to retrieve performance: {str(e)}")

@api_integration_router.post("/campaigns/budget/update")
async def update_campaign_budget(request: BudgetUpdateRequest) -> Dict[str, Any]:
    """Update campaign budget on advertising platform"""
    try:
        if request.platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            google_client = create_google_ads_client({
                'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
                'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                'customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            })
            
            result = await google_client.update_campaign_budget(
                campaign_id=request.campaign_id,
                new_budget_micros=int(request.new_budget * 1_000_000),  # Convert to micros
                reason=request.reason
            )
            
        elif request.platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            meta_client = create_meta_business_client({
                'access_token': os.getenv('META_ACCESS_TOKEN'),
                'ad_account_id': os.getenv('META_AD_ACCOUNT_ID')
            })
            
            result = await meta_client.update_campaign_budget(
                campaign_id=request.campaign_id,
                daily_budget_cents=int(request.new_budget * 100),  # Convert to cents
                reason=request.reason
            )
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
        
        logger.info("Campaign budget updated", 
                   platform=request.platform,
                   campaign_id=request.campaign_id,
                   new_budget=request.new_budget)
        
        return result
        
    except HTTPException:
        raise
    except (GoogleAdsAPIError, MetaAPIError) as e:
        logger.error("Platform API error updating budget", error=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Error updating campaign budget", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to update budget: {str(e)}")

@api_integration_router.post("/campaigns/action")
async def execute_campaign_action(request: CampaignActionRequest) -> Dict[str, Any]:
    """Execute action on campaign (pause, resume)"""
    try:
        if request.platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            google_client = create_google_ads_client({
                'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
                'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                'customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            })
            
            if request.action == "pause":
                result = await google_client.pause_campaign(
                    campaign_id=request.campaign_id,
                    reason=request.reason
                )
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported action: {request.action}")
            
        elif request.platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            meta_client = create_meta_business_client({
                'access_token': os.getenv('META_ACCESS_TOKEN'),
                'ad_account_id': os.getenv('META_AD_ACCOUNT_ID')
            })
            
            if request.action == "pause":
                result = await meta_client.pause_campaign(
                    campaign_id=request.campaign_id,
                    reason=request.reason
                )
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported action: {request.action}")
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
        
        logger.info("Campaign action executed", 
                   platform=request.platform,
                   campaign_id=request.campaign_id,
                   action=request.action)
        
        return result
        
    except HTTPException:
        raise
    except (GoogleAdsAPIError, MetaAPIError) as e:
        logger.error("Platform API error executing action", error=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Error executing campaign action", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to execute action: {str(e)}")

@api_integration_router.post("/credentials/test")
async def test_platform_credentials(request: PlatformCredentialsTest) -> Dict[str, Any]:
    """Test platform credentials for validity"""
    try:
        if request.platform == "google_ads":
            if not GoogleAdsIntegration:
                raise HTTPException(status_code=503, detail="Google Ads integration not available")
            
            google_client = create_google_ads_client(request.credentials)
            result = await google_client.validate_credentials()
            
        elif request.platform == "meta":
            if not MetaBusinessIntegration:
                raise HTTPException(status_code=503, detail="Meta integration not available")
            
            meta_client = create_meta_business_client(request.credentials)
            result = await meta_client.validate_credentials()
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
        
        logger.info("Credentials tested", 
                   platform=request.platform,
                   valid=result.get("valid", False))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error testing credentials", error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to test credentials: {str(e)}")

# Background task functions
async def sync_google_ads_campaigns(client_name: str, force_full_sync: bool = False):
    """Background task to sync Google Ads campaigns"""
    try:
        logger.info("Starting Google Ads campaign sync", 
                   client_name=client_name, 
                   force_full=force_full_sync)
        
        google_client = create_google_ads_client({
            'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
            'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
            'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
            'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
            'customer_id': os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        })
        
        # Get campaigns from Google Ads
        campaigns = await google_client.get_campaigns()
        
        # Get recent performance data
        performance = await google_client.get_campaign_performance(
            date_from=datetime.now() - timedelta(days=7)
        )
        
        # TODO: Save to database using your database session
        # This is where you'd insert/update campaigns and performance data
        
        logger.info("Google Ads sync completed", 
                   campaigns_synced=len(campaigns),
                   performance_records=len(performance))
        
    except Exception as e:
        logger.error("Google Ads sync failed", error=str(e))

async def sync_meta_campaigns(client_name: str, force_full_sync: bool = False):
    """Background task to sync Meta campaigns"""
    try:
        logger.info("Starting Meta campaign sync", 
                   client_name=client_name, 
                   force_full=force_full_sync)
        
        meta_client = create_meta_business_client({
            'access_token': os.getenv('META_ACCESS_TOKEN'),
            'ad_account_id': os.getenv('META_AD_ACCOUNT_ID')
        })
        
        # Get campaigns from Meta
        campaigns = await meta_client.get_campaigns()
        
        # Get recent insights
        insights = await meta_client.get_campaign_insights(
            date_from=datetime.now() - timedelta(days=7)
        )
        
        # TODO: Save to database using your database session
        # This is where you'd insert/update campaigns and insights data
        
        logger.info("Meta sync completed", 
                   campaigns_synced=len(campaigns),
                   insight_records=len(insights))
        
    except Exception as e:
        logger.error("Meta sync failed", error=str(e))