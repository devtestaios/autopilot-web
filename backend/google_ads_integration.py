"""
Google Ads Integration Module for PulseBridge.ai Backend

This module provides Google Ads API integration for the FastAPI backend.
It handles authentication, campaign retrieval, and performance data sync.
"""

import os
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Optional, Any
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

logger = logging.getLogger(__name__)

class GoogleAdsApiClient:
    """Google Ads API client wrapper for PulseBridge.ai"""
    
    def __init__(self):
        self.client = None
        self.customer_id = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Google Ads client with environment variables"""
        try:
            # Check for required environment variables
            required_vars = [
                'GOOGLE_ADS_DEVELOPER_TOKEN',
                'GOOGLE_ADS_CLIENT_ID',
                'GOOGLE_ADS_CLIENT_SECRET',
                'GOOGLE_ADS_REFRESH_TOKEN',
                'GOOGLE_ADS_CUSTOMER_ID'
            ]
            
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            if missing_vars:
                logger.warning(f"Missing Google Ads environment variables: {missing_vars}")
                return
            
            # Create credentials dictionary
            credentials = {
                "developer_token": os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
                "client_id": os.getenv('GOOGLE_ADS_CLIENT_ID'),
                "client_secret": os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                "refresh_token": os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                "use_proto_plus": True
            }
            
            self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            
            # Initialize Google Ads client
            self.client = GoogleAdsClient.load_from_dict(credentials)
            logger.info("Google Ads client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Google Ads client: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Google Ads client is available and properly configured"""
        return self.client is not None and self.customer_id is not None
    
    def test_connection(self) -> Dict[str, Any]:
        """Test the Google Ads API connection"""
        if not self.is_available():
            return {"status": "error", "message": "Client not initialized"}
        
        try:
            # Try to fetch customer info as a connection test
            customer_service = self.client.get_service("CustomerService")
            customer = customer_service.get_customer(customer_id=self.customer_id)
            
            return {
                "status": "success",
                "customer_id": self.customer_id,
                "customer_name": customer.descriptive_name,
                "currency_code": customer.currency_code,
                "time_zone": customer.time_zone
            }
            
        except GoogleAdsException as e:
            logger.error(f"Google Ads API error: {e}")
            return {
                "status": "error", 
                "message": f"API Error: {e.error.message if e.error else str(e)}"
            }
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def get_campaigns(self) -> List[Dict[str, Any]]:
        """Fetch all campaigns from Google Ads"""
        if not self.is_available():
            logger.error("Google Ads client not available")
            return []
        
        try:
            ga_service = self.client.get_service("GoogleAdsService")
            
            query = """
                SELECT 
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel,
                    campaign_budget.amount_micros,
                    metrics.cost_micros,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.conversions,
                    metrics.ctr,
                    metrics.average_cpc_micros,
                    metrics.cost_per_conversion_micros
                FROM campaign 
                WHERE campaign.status != 'REMOVED'
                ORDER BY campaign.name
            """
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = self.customer_id
            search_request.query = query
            
            results = ga_service.search(request=search_request)
            
            campaigns = []
            for row in results:
                campaign = row.campaign
                metrics = row.metrics
                budget = row.campaign_budget
                
                campaigns.append({
                    "google_ads_id": str(campaign.id),
                    "name": campaign.name,
                    "status": campaign.status.name,
                    "advertising_channel": campaign.advertising_channel.name,
                    "budget": budget.amount_micros / 1_000_000 if budget.amount_micros else 0,
                    "spend": metrics.cost_micros / 1_000_000 if metrics.cost_micros else 0,
                    "impressions": metrics.impressions,
                    "clicks": metrics.clicks,
                    "conversions": metrics.conversions,
                    "ctr": metrics.ctr,
                    "average_cpc": metrics.average_cpc_micros / 1_000_000 if metrics.average_cpc_micros else 0,
                    "cost_per_conversion": metrics.cost_per_conversion_micros / 1_000_000 if metrics.cost_per_conversion_micros else 0
                })
            
            logger.info(f"Fetched {len(campaigns)} campaigns from Google Ads")
            return campaigns
            
        except GoogleAdsException as e:
            logger.error(f"Error fetching campaigns: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching campaigns: {e}")
            return []
    
    def get_campaign_performance(self, campaign_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """Get performance data for a specific campaign over the last N days"""
        if not self.is_available():
            logger.error("Google Ads client not available")
            return []
        
        try:
            ga_service = self.client.get_service("GoogleAdsService")
            
            # Calculate date range
            end_date = datetime.now(timezone.utc).date()
            start_date = end_date - timedelta(days=days)
            
            query = f"""
                SELECT 
                    segments.date,
                    metrics.cost_micros,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.conversions,
                    metrics.ctr,
                    metrics.average_cpc_micros,
                    metrics.cost_per_conversion_micros
                FROM campaign 
                WHERE campaign.id = {campaign_id}
                AND segments.date >= '{start_date}'
                AND segments.date <= '{end_date}'
                ORDER BY segments.date DESC
            """
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = self.customer_id
            search_request.query = query
            
            results = ga_service.search(request=search_request)
            
            performance_data = []
            for row in results:
                metrics = row.metrics
                date = row.segments.date
                
                performance_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "spend": metrics.cost_micros / 1_000_000 if metrics.cost_micros else 0,
                    "impressions": metrics.impressions,
                    "clicks": metrics.clicks,
                    "conversions": metrics.conversions,
                    "ctr": metrics.ctr,
                    "average_cpc": metrics.average_cpc_micros / 1_000_000 if metrics.average_cpc_micros else 0,
                    "cost_per_conversion": metrics.cost_per_conversion_micros / 1_000_000 if metrics.cost_per_conversion_micros else 0
                })
            
            logger.info(f"Fetched {len(performance_data)} days of performance data for campaign {campaign_id}")
            return performance_data
            
        except GoogleAdsException as e:
            logger.error(f"Error fetching campaign performance: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching performance data: {e}")
            return []

# Global client instance
_google_ads_client = None

def get_google_ads_client() -> GoogleAdsApiClient:
    """Get or create the global Google Ads client instance"""
    global _google_ads_client
    if _google_ads_client is None:
        _google_ads_client = GoogleAdsApiClient()
    return _google_ads_client