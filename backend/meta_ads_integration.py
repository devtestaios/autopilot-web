"""
Meta Ads Integration Module
Provides backend endpoints for Meta (Facebook) Ads integration
"""

import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import requests
from fastapi import HTTPException

# Meta Ads API Configuration
META_API_BASE = "https://graph.facebook.com/v18.0"
META_API_VERSION = "v18.0"

class MetaAdsClient:
    def __init__(self, access_token: str, ad_account_id: str):
        self.access_token = access_token
        self.ad_account_id = ad_account_id
        self.base_url = META_API_BASE
        
    def _make_request(self, endpoint: str, method: str = "GET", params: dict = None, data: dict = None) -> dict:
        """Make authenticated request to Meta Ads API"""
        url = f"{self.base_url}/{endpoint}"
        
        # Always include access token
        if params is None:
            params = {}
        params['access_token'] = self.access_token
        
        headers = {
            'Content-Type': 'application/json',
        }
        
        try:
            if method == "GET":
                response = requests.get(url, params=params, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, params=params, json=data, headers=headers, timeout=30)
            elif method == "PUT":
                response = requests.put(url, params=params, json=data, headers=headers, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, params=params, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            response.raise_for_status()
            return response.json()
            
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Meta API request failed: {str(e)}")
    
    def test_connection(self) -> dict:
        """Test Meta Ads API connection"""
        try:
            # Test with user info endpoint
            response = self._make_request("me", params={'fields': 'id,name'})
            
            # Test ad account access
            ad_account_response = self._make_request(
                f"act_{self.ad_account_id}",
                params={'fields': 'id,name,account_status'}
            )
            
            return {
                'connected': True,
                'user': response,
                'ad_account': ad_account_response
            }
        except Exception as e:
            return {
                'connected': False,
                'error': str(e)
            }
    
    def get_campaigns(self, limit: int = 25) -> List[Dict[str, Any]]:
        """Retrieve Meta Ad campaigns"""
        try:
            params = {
                'fields': 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time',
                'limit': limit
            }
            
            response = self._make_request(f"act_{self.ad_account_id}/campaigns", params=params)
            return response.get('data', [])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get Meta campaigns: {str(e)}")
    
    def get_campaign_insights(self, campaign_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get campaign performance insights"""
        try:
            params = {
                'fields': 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,conversions,cost_per_conversion',
                'time_range': f"{{'since':'{start_date}','until':'{end_date}'}}",
                'level': 'campaign'
            }
            
            response = self._make_request(f"{campaign_id}/insights", params=params)
            
            if response.get('data'):
                return response['data'][0]  # Return first (should be only) result
            else:
                return {}
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get Meta campaign insights: {str(e)}")
    
    def get_account_insights(self, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get account-level performance insights"""
        try:
            params = {
                'fields': 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,conversions,cost_per_conversion',
                'time_range': f"{{'since':'{start_date}','until':'{end_date}'}}",
                'level': 'account'
            }
            
            response = self._make_request(f"act_{self.ad_account_id}/insights", params=params)
            
            if response.get('data'):
                return response['data'][0]
            else:
                return {}
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get Meta account insights: {str(e)}")

# Initialize client with environment variables
def get_meta_client() -> Optional[MetaAdsClient]:
    """Get Meta Ads client if credentials are available"""
    access_token = os.getenv('META_ACCESS_TOKEN')
    ad_account_id = os.getenv('META_AD_ACCOUNT_ID')
    
    if not access_token or not ad_account_id:
        return None
        
    return MetaAdsClient(access_token, ad_account_id)

# FastAPI endpoint functions
async def get_meta_ads_status() -> Dict[str, Any]:
    """Check Meta Ads API connection status"""
    client = get_meta_client()
    if not client:
        return {
            'connected': False,
            'error': 'Meta Ads credentials not configured'
        }
    
    return client.test_connection()

async def get_meta_ads_campaigns(limit: int = 25) -> List[Dict[str, Any]]:
    """Get Meta Ads campaigns"""
    client = get_meta_client()
    if not client:
        raise HTTPException(status_code=400, detail="Meta Ads not configured")
    
    return client.get_campaigns(limit)

async def get_meta_ads_performance(
    campaign_id: Optional[str] = None,
    days_back: int = 30
) -> Dict[str, Any]:
    """Get Meta Ads performance data"""
    client = get_meta_client()
    if not client:
        raise HTTPException(status_code=400, detail="Meta Ads not configured")
    
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')
    
    if campaign_id:
        # Get specific campaign performance
        return client.get_campaign_insights(campaign_id, start_date_str, end_date_str)
    else:
        # Get account-level performance
        return client.get_account_insights(start_date_str, end_date_str)