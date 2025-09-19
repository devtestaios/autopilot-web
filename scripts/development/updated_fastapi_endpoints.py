"""
Updated FastAPI Endpoints for Google Ads Integration

Copy these endpoints into your main.py file, replacing the existing Google Ads endpoints.
Make sure to also copy the backend_google_ads_integration.py file to your FastAPI project.

Requirements to add to requirements.txt:
    google-ads==23.1.0
    google-auth==2.23.3
    google-auth-oauthlib==1.1.0
"""

# Add this import at the top of main.py
from backend_google_ads_integration import get_google_ads_client, fetch_campaigns_from_google_ads, fetch_performance_from_google_ads

# Replace existing Google Ads endpoints with these:

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

@app.post("/google-ads/sync-campaigns")  
def sync_google_ads_campaigns():
    """Sync campaigns from Google Ads to database"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not available")
    
    try:
        google_ads_client = get_google_ads_client()
        
        if not google_ads_client.is_connected():
            raise HTTPException(
                status_code=503,
                detail="Google Ads API not connected. Check your credentials."
            )
        
        # Fetch campaigns from Google Ads
        campaigns = fetch_campaigns_from_google_ads()
        
        if not campaigns:
            return {
                "synced": 0,
                "total": 0,
                "message": "No campaigns found in Google Ads account",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        
        synced_count = 0
        errors = []
        
        for campaign_data in campaigns:
            try:
                # Upsert campaign to database (update if exists, insert if new)
                result = supabase.table("campaigns").upsert(
                    campaign_data, 
                    on_conflict="id"
                ).execute()
                
                if result.data:
                    synced_count += 1
                    logger.info(f"Synced campaign: {campaign_data['name']}")
                else:
                    errors.append(f"Failed to sync campaign: {campaign_data['name']}")
                    
            except Exception as e:
                error_msg = f"Error syncing campaign {campaign_data.get('name', 'unknown')}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)
        
        # Return sync results
        response = {
            "synced": synced_count,
            "total": len(campaigns),
            "message": f"Successfully synced {synced_count} of {len(campaigns)} campaigns",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        if errors:
            response["errors"] = errors
            response["message"] += f" ({len(errors)} errors occurred)"
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during campaign sync: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Campaign sync failed: {str(e)}"
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
        
        # Validate days parameter
        if days < 1 or days > 730:  # Max 2 years
            raise HTTPException(
                status_code=400,
                detail="Days parameter must be between 1 and 730"
            )
        
        performance_data = fetch_performance_from_google_ads(campaign_id, days)
        
        return {
            "campaign_id": campaign_id,
            "performance_data": performance_data,
            "count": len(performance_data),
            "days": days,
            "source": "google_ads_api",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching campaign performance: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch performance data: {str(e)}"
        )

@app.post("/google-ads/sync-performance/{campaign_id}")
def sync_campaign_performance(campaign_id: str, days: int = 30):
    """Sync performance data for a campaign to database"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not available")
    
    try:
        google_ads_client = get_google_ads_client()
        
        if not google_ads_client.is_connected():
            raise HTTPException(
                status_code=503,
                detail="Google Ads API not connected. Check your credentials."
            )
        
        # Fetch performance data from Google Ads
        performance_data = fetch_performance_from_google_ads(campaign_id, days)
        
        if not performance_data:
            return {
                "synced": 0,
                "total": 0,
                "message": f"No performance data found for campaign {campaign_id}",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        
        synced_count = 0
        errors = []
        
        for perf_data in performance_data:
            try:
                # Upsert performance data to database
                result = supabase.table("performance_snapshots").upsert(
                    perf_data,
                    on_conflict="campaign_id,date"
                ).execute()
                
                if result.data:
                    synced_count += 1
                else:
                    errors.append(f"Failed to sync data for date: {perf_data['date']}")
                    
            except Exception as e:
                error_msg = f"Error syncing performance for {perf_data.get('date', 'unknown')}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)
        
        response = {
            "campaign_id": campaign_id,
            "synced": synced_count,
            "total": len(performance_data),
            "days": days,
            "message": f"Successfully synced {synced_count} of {len(performance_data)} performance records",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        if errors:
            response["errors"] = errors
            response["message"] += f" ({len(errors)} errors occurred)"
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during performance sync: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Performance sync failed: {str(e)}"
        )

@app.get("/google-ads/test-connection")
def test_google_ads_connection():
    """Test Google Ads API connection with detailed diagnostics"""
    try:
        google_ads_client = get_google_ads_client()
        
        # Check environment variables
        env_vars = {
            "GOOGLE_ADS_DEVELOPER_TOKEN": bool(os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')),
            "GOOGLE_ADS_CLIENT_ID": bool(os.getenv('GOOGLE_ADS_CLIENT_ID')),
            "GOOGLE_ADS_CLIENT_SECRET": bool(os.getenv('GOOGLE_ADS_CLIENT_SECRET')),
            "GOOGLE_ADS_REFRESH_TOKEN": bool(os.getenv('GOOGLE_ADS_REFRESH_TOKEN')),
            "GOOGLE_ADS_CUSTOMER_ID": bool(os.getenv('GOOGLE_ADS_CUSTOMER_ID')),
        }
        
        # Get connection status
        status = google_ads_client.get_connection_status()
        
        # Try to fetch a small amount of data
        test_data = None
        if status["connected"]:
            try:
                campaigns = fetch_campaigns_from_google_ads()
                test_data = {
                    "campaigns_found": len(campaigns),
                    "sample_campaign": campaigns[0] if campaigns else None
                }
            except Exception as e:
                test_data = {"error": f"Failed to fetch test data: {str(e)}"}
        
        return {
            "connection_status": status,
            "environment_variables": env_vars,
            "test_data": test_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error testing Google Ads connection: {e}")
        return {
            "connection_status": {"connected": False, "error": str(e)},
            "environment_variables": {},
            "test_data": None,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }