"""
Meta Business API Integration for PulseBridge AI
Production-ready integration for Facebook & Instagram campaigns
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.adset import AdSet
from facebook_business.adobjects.ad import Ad
from facebook_business.exceptions import FacebookRequestError
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

# Configure structured logging
logger = structlog.get_logger(__name__)

@dataclass
class MetaCampaign:
    """Structured campaign data from Meta Business API"""
    id: str
    name: str
    status: str
    objective: str
    daily_budget: Optional[int]  # in cents
    lifetime_budget: Optional[int]  # in cents
    start_time: Optional[str]
    stop_time: Optional[str]
    created_time: str
    updated_time: str
    
    @property
    def daily_budget_dollars(self) -> Optional[float]:
        """Convert cents to dollars"""
        return self.daily_budget / 100 if self.daily_budget else None
    
    @property
    def lifetime_budget_dollars(self) -> Optional[float]:
        """Convert cents to dollars"""
        return self.lifetime_budget / 100 if self.lifetime_budget else None

@dataclass
class MetaPerformanceMetrics:
    """Performance metrics from Meta Business API"""
    campaign_id: str
    date_start: str
    date_stop: str
    impressions: int
    clicks: int
    spend: float
    actions: List[Dict[str, Any]]  # Conversions data
    ctr: float
    cpc: float
    cpp: float  # Cost per 1000 people reached
    reach: int
    frequency: float
    
    @property
    def conversions(self) -> int:
        """Extract total conversions from actions"""
        total_conversions = 0
        for action in self.actions:
            if action.get('action_type') in ['purchase', 'complete_registration', 'lead', 'add_to_cart']:
                total_conversions += int(action.get('value', 0))
        return total_conversions
    
    @property
    def conversion_value(self) -> float:
        """Extract total conversion value from actions"""
        total_value = 0.0
        for action in self.actions:
            if action.get('action_type') == 'purchase':
                total_value += float(action.get('value', 0))
        return total_value
    
    @property
    def roas(self) -> Optional[float]:
        """Calculate Return on Ad Spend"""
        if self.spend > 0 and self.conversion_value > 0:
            return self.conversion_value / self.spend
        return None

class MetaAPIError(Exception):
    """Custom exception for Meta Business API errors"""
    def __init__(self, message: str, error_code: str = None, error_subcode: str = None):
        self.message = message
        self.error_code = error_code
        self.error_subcode = error_subcode
        super().__init__(self.message)

class MetaBusinessIntegration:
    """
    Production-ready Meta Business API integration for PulseBridge AI
    Handles Facebook & Instagram campaigns with comprehensive error handling
    """
    
    def __init__(self, access_token: str, ad_account_id: str, app_id: str = None, app_secret: str = None):
        self.access_token = access_token
        self.ad_account_id = ad_account_id if ad_account_id.startswith('act_') else f'act_{ad_account_id}'
        self.app_id = app_id
        self.app_secret = app_secret
        
        # Initialize Meta Business API
        self.api = self._initialize_api()
        self.ad_account = AdAccount(self.ad_account_id)
        
        logger.info("MetaBusinessIntegration initialized", 
                   ad_account_id=self.ad_account_id)
    
    def _initialize_api(self) -> FacebookAdsApi:
        """Initialize Meta Business API with credentials"""
        try:
            if self.app_id and self.app_secret:
                api = FacebookAdsApi.init(
                    app_id=self.app_id,
                    app_secret=self.app_secret,
                    access_token=self.access_token
                )
            else:
                api = FacebookAdsApi.init(access_token=self.access_token)
            
            logger.info("Meta Business API initialized successfully")
            return api
            
        except Exception as e:
            logger.error("Failed to initialize Meta Business API", error=str(e))
            raise MetaAPIError(f"API initialization failed: {str(e)}")
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def get_campaigns(self, limit: int = 100) -> List[MetaCampaign]:
        """
        Retrieve campaigns from Meta ad account
        
        Args:
            limit: Maximum number of campaigns to retrieve
            
        Returns:
            List of MetaCampaign objects
        """
        try:
            fields = [
                'id', 'name', 'status', 'objective', 'daily_budget', 
                'lifetime_budget', 'start_time', 'stop_time', 
                'created_time', 'updated_time'
            ]
            
            campaigns_response = self.ad_account.get_campaigns(
                fields=fields,
                params={'limit': limit}
            )
            
            campaigns = []
            for campaign_data in campaigns_response:
                campaign = MetaCampaign(
                    id=campaign_data.get('id'),
                    name=campaign_data.get('name'),
                    status=campaign_data.get('status'),
                    objective=campaign_data.get('objective'),
                    daily_budget=campaign_data.get('daily_budget'),
                    lifetime_budget=campaign_data.get('lifetime_budget'),
                    start_time=campaign_data.get('start_time'),
                    stop_time=campaign_data.get('stop_time'),
                    created_time=campaign_data.get('created_time'),
                    updated_time=campaign_data.get('updated_time')
                )
                campaigns.append(campaign)
            
            logger.info("Successfully retrieved Meta campaigns", 
                       count=len(campaigns),
                       ad_account_id=self.ad_account_id)
            
            return campaigns
            
        except FacebookRequestError as e:
            logger.error("Meta API error retrieving campaigns",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message(),
                        ad_account_id=self.ad_account_id)
            raise MetaAPIError(
                f"Failed to retrieve campaigns: {e.api_error_message()}",
                error_code=str(e.api_error_code()),
                error_subcode=str(e.api_error_subcode())
            )
        except Exception as e:
            logger.error("Unexpected error retrieving Meta campaigns", error=str(e))
            raise MetaAPIError(f"Unexpected error: {str(e)}")
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def get_campaign_insights(self, 
                                  campaign_id: str = None,
                                  date_from: datetime = None,
                                  date_to: datetime = None) -> List[MetaPerformanceMetrics]:
        """
        Retrieve performance insights for campaigns
        
        Args:
            campaign_id: Specific campaign ID (optional)
            date_from: Start date for insights (default: 30 days ago)
            date_to: End date for insights (default: yesterday)
            
        Returns:
            List of MetaPerformanceMetrics objects
        """
        try:
            # Set default date range
            if date_to is None:
                date_to = datetime.now() - timedelta(days=1)
            if date_from is None:
                date_from = date_to - timedelta(days=30)
            
            # Format dates for Meta API
            date_from_str = date_from.strftime('%Y-%m-%d')
            date_to_str = date_to.strftime('%Y-%m-%d')
            
            fields = [
                'impressions', 'clicks', 'spend', 'actions', 'ctr', 
                'cpc', 'cpp', 'reach', 'frequency', 'campaign_id'
            ]
            
            params = {
                'time_range': {
                    'since': date_from_str,
                    'until': date_to_str
                },
                'breakdowns': ['campaign_id'] if not campaign_id else [],
                'level': 'campaign'
            }
            
            if campaign_id:
                # Get insights for specific campaign
                campaign = Campaign(campaign_id)
                insights_response = campaign.get_insights(fields=fields, params=params)
            else:
                # Get insights for all campaigns in account
                insights_response = self.ad_account.get_insights(fields=fields, params=params)
            
            metrics = []
            for insight in insights_response:
                metric = MetaPerformanceMetrics(
                    campaign_id=insight.get('campaign_id', campaign_id),
                    date_start=insight.get('date_start'),
                    date_stop=insight.get('date_stop'), 
                    impressions=int(insight.get('impressions', 0)),
                    clicks=int(insight.get('clicks', 0)),
                    spend=float(insight.get('spend', 0)),
                    actions=insight.get('actions', []),
                    ctr=float(insight.get('ctr', 0)),
                    cpc=float(insight.get('cpc', 0)),
                    cpp=float(insight.get('cpp', 0)),
                    reach=int(insight.get('reach', 0)),
                    frequency=float(insight.get('frequency', 0))
                )
                metrics.append(metric)
            
            logger.info("Successfully retrieved Meta campaign insights", 
                       metrics_count=len(metrics),
                       campaign_id=campaign_id,
                       date_range=f"{date_from_str} to {date_to_str}")
            
            return metrics
            
        except FacebookRequestError as e:
            logger.error("Meta API error retrieving insights",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message(),
                        campaign_id=campaign_id)
            raise MetaAPIError(
                f"Failed to retrieve insights: {e.api_error_message()}",
                error_code=str(e.api_error_code()),
                error_subcode=str(e.api_error_subcode())
            )
        except Exception as e:
            logger.error("Unexpected error retrieving Meta insights", error=str(e))
            raise MetaAPIError(f"Unexpected error: {str(e)}")
    
    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=5)
    )
    async def update_campaign_budget(self, 
                                   campaign_id: str, 
                                   daily_budget_cents: int = None,
                                   lifetime_budget_cents: int = None,
                                   reason: str = "AI Optimization") -> Dict[str, Any]:
        """
        Update campaign budget
        
        Args:
            campaign_id: Campaign ID to update
            daily_budget_cents: New daily budget in cents
            lifetime_budget_cents: New lifetime budget in cents  
            reason: Reason for budget change
            
        Returns:
            Dictionary with update results
        """
        try:
            campaign = Campaign(campaign_id)
            
            update_data = {}
            if daily_budget_cents is not None:
                update_data['daily_budget'] = daily_budget_cents
            if lifetime_budget_cents is not None:
                update_data['lifetime_budget'] = lifetime_budget_cents
            
            if not update_data:
                raise MetaAPIError("No budget values provided for update")
            
            # Execute the update
            response = campaign.api_update(fields=list(update_data.keys()), params=update_data)
            
            result = {
                "success": True,
                "campaign_id": campaign_id,
                "updates": {
                    "daily_budget_dollars": daily_budget_cents / 100 if daily_budget_cents else None,
                    "lifetime_budget_dollars": lifetime_budget_cents / 100 if lifetime_budget_cents else None
                },
                "reason": reason,
                "updated_at": datetime.now().isoformat(),
                "response": response
            }
            
            logger.info("Successfully updated Meta campaign budget",
                       campaign_id=campaign_id,
                       daily_budget_dollars=result["updates"]["daily_budget_dollars"],
                       reason=reason)
            
            return result
            
        except FacebookRequestError as e:
            logger.error("Meta API error updating budget",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message(),
                        campaign_id=campaign_id)
            raise MetaAPIError(
                f"Failed to update budget: {e.api_error_message()}",
                error_code=str(e.api_error_code()),
                error_subcode=str(e.api_error_subcode())
            )
        except Exception as e:
            logger.error("Unexpected error updating Meta budget", 
                        error=str(e),
                        campaign_id=campaign_id)
            raise MetaAPIError(f"Unexpected error: {str(e)}")
    
    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=5)
    )
    async def pause_campaign(self, campaign_id: str, reason: str = "AI Decision") -> Dict[str, Any]:
        """
        Pause a campaign
        
        Args:
            campaign_id: Campaign ID to pause
            reason: Reason for pausing
            
        Returns:
            Dictionary with pause results
        """
        try:
            campaign = Campaign(campaign_id)
            
            # Update campaign status to PAUSED
            response = campaign.api_update(
                fields=['status'],
                params={'status': Campaign.Status.paused}
            )
            
            result = {
                "success": True,
                "campaign_id": campaign_id,
                "status": "PAUSED",
                "reason": reason,
                "updated_at": datetime.now().isoformat(),
                "response": response
            }
            
            logger.info("Successfully paused Meta campaign",
                       campaign_id=campaign_id,
                       reason=reason)
            
            return result
            
        except FacebookRequestError as e:
            logger.error("Meta API error pausing campaign",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message(),
                        campaign_id=campaign_id)
            raise MetaAPIError(
                f"Failed to pause campaign: {e.api_error_message()}",
                error_code=str(e.api_error_code()),
                error_subcode=str(e.api_error_subcode())
            )
        except Exception as e:
            logger.error("Unexpected error pausing Meta campaign", 
                        error=str(e),
                        campaign_id=campaign_id)
            raise MetaAPIError(f"Unexpected error: {str(e)}")
    
    async def get_meta_ai_recommendations(self, campaign_id: str = None) -> List[Dict[str, Any]]:
        """
        Get Meta's native AI recommendations for campaigns
        
        Args:
            campaign_id: Specific campaign ID (optional)
            
        Returns:
            List of AI recommendations from Meta
        """
        try:
            recommendations = []
            
            if campaign_id:
                campaign = Campaign(campaign_id)
                # Get campaign-specific recommendations
                recs = campaign.get_delivery_estimate()
                if recs:
                    recommendations.extend(recs)
            else:
                # Get account-level recommendations
                account_recommendations = self.ad_account.get_activities(
                    fields=['activity_type', 'event_type', 'extra_data']
                )
                for rec in account_recommendations:
                    if rec.get('activity_type') == 'campaign_suggestion':
                        recommendations.append({
                            'type': 'meta_suggestion',
                            'recommendation': rec.get('extra_data'),
                            'campaign_id': rec.get('object_id'),
                            'created_time': rec.get('event_time')
                        })
            
            logger.info("Retrieved Meta AI recommendations", 
                       count=len(recommendations),
                       campaign_id=campaign_id)
            
            return recommendations
            
        except FacebookRequestError as e:
            logger.error("Meta API error getting recommendations",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message())
            return []  # Return empty list on error rather than raising
        except Exception as e:
            logger.error("Unexpected error getting Meta recommendations", error=str(e))
            return []
    
    async def get_account_summary(self) -> Dict[str, Any]:
        """Get overall Meta ad account summary"""
        try:
            # Get account info
            account_info = self.ad_account.api_get(fields=[
                'name', 'account_status', 'currency', 'timezone_name',
                'amount_spent', 'balance', 'daily_spend_limit'
            ])
            
            campaigns = await self.get_campaigns()
            recent_insights = await self.get_campaign_insights(
                date_from=datetime.now() - timedelta(days=7)
            )
            
            # Calculate summary metrics
            total_campaigns = len(campaigns)
            active_campaigns = len([c for c in campaigns if c.status == 'ACTIVE'])
            
            # Performance metrics for last 7 days
            total_spend = sum(i.spend for i in recent_insights)
            total_conversions = sum(i.conversions for i in recent_insights)
            total_clicks = sum(i.clicks for i in recent_insights)
            
            summary = {
                "ad_account_id": self.ad_account_id,
                "account_name": account_info.get('name'),
                "account_status": account_info.get('account_status'),
                "currency": account_info.get('currency'),
                "timezone": account_info.get('timezone_name'),
                "total_campaigns": total_campaigns,
                "active_campaigns": active_campaigns,
                "account_balance": float(account_info.get('balance', 0)) / 100,  # Convert cents to dollars
                "last_7_days": {
                    "total_spend": total_spend,
                    "total_conversions": total_conversions,
                    "total_clicks": total_clicks,
                    "average_cpc": total_spend / total_clicks if total_clicks > 0 else 0,
                    "conversion_rate": (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
                },
                "generated_at": datetime.now().isoformat()
            }
            
            logger.info("Generated Meta account summary", 
                       total_campaigns=total_campaigns,
                       active_campaigns=active_campaigns)
            
            return summary
            
        except Exception as e:
            logger.error("Error generating Meta account summary", error=str(e))
            raise MetaAPIError(f"Failed to generate summary: {str(e)}")
    
    async def validate_credentials(self) -> Dict[str, Any]:
        """Validate Meta Business API credentials and access"""
        try:
            # Test with a simple account query
            account_info = self.ad_account.api_get(fields=['id', 'name', 'account_status'])
            
            result = {
                "valid": True,
                "ad_account_id": account_info.get('id'),
                "account_name": account_info.get('name'),
                "account_status": account_info.get('account_status'),
                "validated_at": datetime.now().isoformat()
            }
            
            logger.info("Meta credentials validated successfully", 
                       ad_account_id=self.ad_account_id,
                       account_name=result["account_name"])
            
            return result
            
        except FacebookRequestError as e:
            logger.error("Meta API credential validation failed",
                        error_code=e.api_error_code(),
                        error_message=e.api_error_message())
            return {
                "valid": False,
                "error_code": str(e.api_error_code()),
                "error_message": e.api_error_message(),
                "error_subcode": str(e.api_error_subcode()),
                "validated_at": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error("Meta credential validation failed", error=str(e))
            return {
                "valid": False,
                "error": str(e),
                "validated_at": datetime.now().isoformat()
            }


# Factory function for easy integration
def create_meta_business_client(credentials: Dict[str, str]) -> MetaBusinessIntegration:
    """
    Factory function to create Meta Business API integration client
    
    Args:
        credentials: Dictionary with required credentials
        
    Returns:
        Configured MetaBusinessIntegration instance
    """
    required_keys = ['access_token', 'ad_account_id']
    
    for key in required_keys:
        if key not in credentials:
            raise ValueError(f"Missing required credential: {key}")
    
    return MetaBusinessIntegration(
        access_token=credentials['access_token'],
        ad_account_id=credentials['ad_account_id'],
        app_id=credentials.get('app_id'),
        app_secret=credentials.get('app_secret')
    )