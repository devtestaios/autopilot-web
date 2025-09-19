"""
Google Ads Integration Module for Autopilot Backend

This module provides Google Ads API integration functionality.
Copy this file to your FastAPI backend project.

Requirements (add to requirements.txt):
    google-ads==23.1.0
    google-auth==2.23.3
    google-auth-oauthlib==1.1.0

Environment Variables Required:
    GOOGLE_ADS_DEVELOPER_TOKEN
    GOOGLE_ADS_CLIENT_ID  
    GOOGLE_ADS_CLIENT_SECRET
    GOOGLE_ADS_REFRESH_TOKEN
    GOOGLE_ADS_CUSTOMER_ID
"""

import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

logger = logging.getLogger(__name__)

class GoogleAdsIntegration:
    """Google Ads API integration class"""
    
    def __init__(self):
        self.client = None
        self.customer_id = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Google Ads client with environment variables"""
        try:
            # Get environment variables
            developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
            client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
            client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
            refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
            self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
            
            # Validate all required credentials
            missing_vars = []
            if not developer_token:
                missing_vars.append('GOOGLE_ADS_DEVELOPER_TOKEN')
            if not client_id:
                missing_vars.append('GOOGLE_ADS_CLIENT_ID')
            if not client_secret:
                missing_vars.append('GOOGLE_ADS_CLIENT_SECRET')
            if not refresh_token:
                missing_vars.append('GOOGLE_ADS_REFRESH_TOKEN')
            if not self.customer_id:
                missing_vars.append('GOOGLE_ADS_CUSTOMER_ID')
            
            if missing_vars:
                logger.error(f"Missing Google Ads environment variables: {missing_vars}")
                return
            
            # Create client configuration
            credentials = {
                "developer_token": developer_token,
                "refresh_token": refresh_token,
                "client_id": client_id,
                "client_secret": client_secret,
                "use_proto_plus": True,
            }
            
            # Initialize Google Ads client
            self.client = GoogleAdsClient.load_from_dict(credentials)
            logger.info("Google Ads client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Google Ads client: {e}")
            self.client = None
    
    def is_connected(self) -> bool:
        """Check if Google Ads client is properly connected"""
        if not self.client or not self.customer_id:
            return False
        
        try:
            # Test connection with a simple query
            ga_service = self.client.get_service("GoogleAdsService")
            query = "SELECT customer.id FROM customer LIMIT 1"
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = self.customer_id
            search_request.query = query
            
            # Execute query - if this succeeds, we're connected
            list(ga_service.search(request=search_request))
            return True
            
        except Exception as e:
            logger.error(f"Google Ads connection test failed: {e}")
            return False
    
    def get_connection_status(self) -> Dict:
        """Get detailed connection status"""
        if not self.client:
            return {
                "connected": False,
                "error": "Client not initialized - check environment variables",
                "customer_id": None
            }
        
        if not self.customer_id:
            return {
                "connected": False,
                "error": "GOOGLE_ADS_CUSTOMER_ID not set",
                "customer_id": None
            }
        
        try:
            # Test actual API connection
            is_connected = self.is_connected()
            
            if is_connected:
                return {
                    "connected": True,
                    "customer_id": self.customer_id,
                    "message": "Successfully connected to Google Ads API"
                }
            else:
                return {
                    "connected": False,
                    "error": "API connection test failed",
                    "customer_id": self.customer_id
                }
                
        except Exception as e:
            return {
                "connected": False,
                "error": f"Connection test error: {str(e)}",
                "customer_id": self.customer_id
            }
    
    def fetch_campaigns(self) -> List[Dict]:
        """Fetch campaigns from Google Ads API"""
        if not self.client or not self.customer_id:
            logger.error("Google Ads client not properly initialized")
            return []
        
        try:
            ga_service = self.client.get_service("GoogleAdsService")
            
            # Build query for campaign data
            query = '''
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel_type,
                    campaign.budget,
                    campaign.start_date,
                    campaign.end_date,
                    metrics.cost_micros,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.conversions,
                    metrics.ctr,
                    metrics.average_cpc
                FROM campaign
                WHERE campaign.status != 'REMOVED'
                ORDER BY campaign.name
            '''
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = self.customer_id
            search_request.query = query
            
            results = ga_service.search(request=search_request)
            
            campaigns = []
            for row in results:
                # Convert micros to actual currency amounts (divide by 1,000,000)
                cost_micros = getattr(row.metrics, 'cost_micros', 0) or 0
                average_cpc = getattr(row.metrics, 'average_cpc', 0) or 0
                
                campaign_data = {
                    'id': str(row.campaign.id),
                    'name': row.campaign.name,
                    'status': row.campaign.status.name.lower() if row.campaign.status else 'unknown',
                    'platform': 'google_ads',
                    'budget': 0,  # Budget handling can be complex, simplified for now
                    'spend': cost_micros / 1_000_000,
                    'client_name': 'Google Ads Account',
                    'metrics': {
                        'impressions': getattr(row.metrics, 'impressions', 0) or 0,
                        'clicks': getattr(row.metrics, 'clicks', 0) or 0,
                        'conversions': getattr(row.metrics, 'conversions', 0) or 0,
                        'ctr': getattr(row.metrics, 'ctr', 0) or 0,
                        'cpc': average_cpc / 1_000_000,
                        'channel_type': row.campaign.advertising_channel_type.name if row.campaign.advertising_channel_type else 'unknown'
                    },
                    'start_date': row.campaign.start_date if row.campaign.start_date else None,
                    'end_date': row.campaign.end_date if row.campaign.end_date else None,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                campaigns.append(campaign_data)
            
            logger.info(f"Successfully fetched {len(campaigns)} campaigns from Google Ads")
            return campaigns
            
        except GoogleAdsException as ex:
            logger.error(f"Google Ads API error: {ex}")
            for error in ex.failure.errors:
                logger.error(f"  Error: {error.message}")
            return []
        except Exception as e:
            logger.error(f"Error fetching campaigns: {e}")
            return []
    
    def fetch_campaign_performance(self, campaign_id: str, days: int = 30) -> List[Dict]:
        """Fetch performance data for a specific campaign"""
        if not self.client or not self.customer_id:
            logger.error("Google Ads client not properly initialized")
            return []
        
        try:
            ga_service = self.client.get_service("GoogleAdsService")
            
            # Calculate date range
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days)
            
            query = f'''
                SELECT
                    segments.date,
                    campaign.id,
                    campaign.name,
                    metrics.cost_micros,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.conversions,
                    metrics.ctr,
                    metrics.average_cpc,
                    metrics.cost_per_conversion
                FROM campaign
                WHERE campaign.id = {campaign_id}
                    AND segments.date >= '{start_date}'
                    AND segments.date <= '{end_date}'
                ORDER BY segments.date
            '''
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = self.customer_id
            search_request.query = query
            
            results = ga_service.search(request=search_request)
            
            performance_data = []
            for row in results:
                cost_micros = getattr(row.metrics, 'cost_micros', 0) or 0
                average_cpc = getattr(row.metrics, 'average_cpc', 0) or 0
                cost_per_conversion = getattr(row.metrics, 'cost_per_conversion', 0) or 0
                
                data = {
                    'campaign_id': campaign_id,
                    'date': str(row.segments.date),
                    'spend': cost_micros / 1_000_000,
                    'impressions': getattr(row.metrics, 'impressions', 0) or 0,
                    'clicks': getattr(row.metrics, 'clicks', 0) or 0,
                    'conversions': getattr(row.metrics, 'conversions', 0) or 0,
                    'ctr': getattr(row.metrics, 'ctr', 0) or 0,
                    'cpc': average_cpc / 1_000_000,
                    'cpa': cost_per_conversion / 1_000_000,
                    'roas': None  # Calculate if revenue data is available
                }
                performance_data.append(data)
            
            logger.info(f"Successfully fetched {len(performance_data)} performance records for campaign {campaign_id}")
            return performance_data
            
        except GoogleAdsException as ex:
            logger.error(f"Google Ads API error fetching performance: {ex}")
            return []
        except Exception as e:
            logger.error(f"Error fetching campaign performance: {e}")
            return []

# Global instance
google_ads = GoogleAdsIntegration()

def get_google_ads_client():
    """Get the global Google Ads integration instance"""
    return google_ads

# Convenience functions for backward compatibility
def fetch_campaigns_from_google_ads():
    """Fetch campaigns using the global instance"""
    return google_ads.fetch_campaigns()

def fetch_performance_from_google_ads(campaign_id: str, days: int = 30):
    """Fetch performance data using the global instance"""
    return google_ads.fetch_campaign_performance(campaign_id, days)