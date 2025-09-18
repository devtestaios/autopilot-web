# Google Ads API Integration - Implementation Plan

## Current Status
✅ **Frontend Framework**: GoogleAdsIntegration component exists
✅ **Backend Endpoints**: Placeholder endpoints exist in main.py
✅ **Setup Documentation**: GOOGLE_ADS_SETUP.md exists
❌ **Live API Connection**: Not yet implemented
❌ **Real Campaign Data**: Using mock data

## Phase 1: Google Ads Developer Account Setup

### Step 1: Get Google Ads Developer Token
**You must complete this first before any code will work.**

1. **Apply for Developer Token**:
   - Go to: https://developers.google.com/google-ads/api/docs/first-call/overview
   - Sign in with Google account
   - Apply for developer token
   - **IMPORTANT**: This can take 24-48 hours for approval

2. **Enable Google Ads API**:
   - Go to: https://console.cloud.google.com
   - Create new project or select existing
   - Enable "Google Ads API"
   - This is required even with developer token

### Step 2: Create OAuth2 Credentials
1. In Google Cloud Console:
   - Navigate to "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Desktop Application"
   - Download the JSON file
   - Note the Client ID and Client Secret

### Step 3: Generate Refresh Token
**Run this Python script locally to get your refresh token:**

```python
# Create file: generate_refresh_token.py
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/adwords']

def generate_refresh_token():
    # Replace with your OAuth2 credentials
    CLIENT_ID = "your_client_id_here"
    CLIENT_SECRET = "your_client_secret_here"
    
    flow = InstalledAppFlow.from_client_config(
        {
            "installed": {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        SCOPES
    )
    
    # This will open a browser window for authentication
    credentials = flow.run_local_server(port=8080)
    print(f"Refresh token: {credentials.refresh_token}")
    return credentials.refresh_token

if __name__ == "__main__":
    generate_refresh_token()
```

**To run:**
```bash
pip install google-auth-oauthlib
python generate_refresh_token.py
```

### Step 4: Get Customer ID
1. Log into your Google Ads account
2. Look at the URL or top-right corner
3. Customer ID is the 10-digit number (format: 123-456-7890)
4. **Remove dashes**: Use format 1234567890

## Phase 2: Backend Implementation

### Step 1: Install Dependencies
Add to your backend requirements.txt:
```
google-ads==23.1.0
google-auth==2.23.3
google-auth-oauthlib==1.1.0
```

### Step 2: Create Google Ads Integration Module
Create file: `google_ads_integration.py`

```python
import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def get_google_ads_client():
    """Initialize and return Google Ads client"""
    try:
        # Environment variables
        developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        
        if not all([developer_token, client_id, client_secret, refresh_token]):
            raise ValueError("Missing required Google Ads credentials")
        
        # Create client configuration
        credentials = {
            "developer_token": developer_token,
            "refresh_token": refresh_token,
            "client_id": client_id,
            "client_secret": client_secret,
            "use_proto_plus": True,
        }
        
        client = GoogleAdsClient.load_from_dict(credentials)
        return client
        
    except Exception as e:
        logger.error(f"Failed to create Google Ads client: {e}")
        return None

def fetch_campaigns(client, customer_id):
    """Fetch campaigns from Google Ads"""
    try:
        ga_service = client.get_service("GoogleAdsService")
        
        query = '''
            SELECT
                campaign.id,
                campaign.name,
                campaign.status,
                campaign.advertising_channel_type,
                campaign.budget.amount_micros,
                campaign.start_date,
                campaign.end_date,
                metrics.cost_micros,
                metrics.impressions,
                metrics.clicks,
                metrics.conversions
            FROM campaign
            WHERE campaign.status != 'REMOVED'
            ORDER BY campaign.name
        '''
        
        search_request = client.get_type("SearchGoogleAdsRequest")
        search_request.customer_id = customer_id
        search_request.query = query
        
        results = ga_service.search(request=search_request)
        
        campaigns = []
        for row in results:
            campaign = {
                'id': str(row.campaign.id),
                'name': row.campaign.name,
                'status': row.campaign.status.name.lower(),
                'platform': 'google_ads',
                'budget': row.campaign.budget.amount_micros / 1_000_000 if row.campaign.budget.amount_micros else 0,
                'spend': row.metrics.cost_micros / 1_000_000 if row.metrics.cost_micros else 0,
                'impressions': row.metrics.impressions,
                'clicks': row.metrics.clicks,
                'conversions': row.metrics.conversions,
                'start_date': row.campaign.start_date,
                'end_date': row.campaign.end_date,
            }
            campaigns.append(campaign)
            
        return campaigns
        
    except GoogleAdsException as ex:
        logger.error(f"Google Ads API error: {ex}")
        return []
    except Exception as e:
        logger.error(f"Error fetching campaigns: {e}")
        return []

def fetch_campaign_performance(client, customer_id, campaign_id, days=30):
    """Fetch performance data for a specific campaign"""
    try:
        ga_service = client.get_service("GoogleAdsService")
        
        # Calculate date range
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        query = f'''
            SELECT
                segments.date,
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
        
        search_request = client.get_type("SearchGoogleAdsRequest")
        search_request.customer_id = customer_id
        search_request.query = query
        
        results = ga_service.search(request=search_request)
        
        performance_data = []
        for row in results:
            data = {
                'date': str(row.segments.date),
                'spend': row.metrics.cost_micros / 1_000_000 if row.metrics.cost_micros else 0,
                'impressions': row.metrics.impressions,
                'clicks': row.metrics.clicks,
                'conversions': row.metrics.conversions,
                'ctr': row.metrics.ctr,
                'cpc': row.metrics.average_cpc / 1_000_000 if row.metrics.average_cpc else 0,
                'cpa': row.metrics.cost_per_conversion / 1_000_000 if row.metrics.cost_per_conversion else 0,
            }
            performance_data.append(data)
            
        return performance_data
        
    except GoogleAdsException as ex:
        logger.error(f"Google Ads API error: {ex}")
        return []
    except Exception as e:
        logger.error(f"Error fetching performance data: {e}")
        return []
```

### Step 3: Update Backend Endpoints
Replace the placeholder Google Ads endpoints in `main.py`:

```python
from google_ads_integration import get_google_ads_client, fetch_campaigns, fetch_campaign_performance

@app.get("/google-ads/status")
def google_ads_status():
    """Check Google Ads API connection status"""
    try:
        client = get_google_ads_client()
        if not client:
            return {
                "status": "error",
                "error": "Failed to create Google Ads client",
                "connected": False
            }
        
        # Test with customer ID
        customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        if not customer_id:
            return {
                "status": "error", 
                "error": "GOOGLE_ADS_CUSTOMER_ID not set",
                "connected": False
            }
            
        # Try a simple API call to test connection
        ga_service = client.get_service("GoogleAdsService")
        query = "SELECT customer.id FROM customer LIMIT 1"
        
        search_request = client.get_type("SearchGoogleAdsRequest")
        search_request.customer_id = customer_id
        search_request.query = query
        
        ga_service.search(request=search_request)
        
        return {
            "status": "connected",
            "customer_id": customer_id,
            "connected": True
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "connected": False
        }

@app.get("/google-ads/campaigns")
def get_google_ads_campaigns():
    """Fetch campaigns from Google Ads API"""
    try:
        client = get_google_ads_client()
        if not client:
            raise HTTPException(status_code=500, detail="Google Ads client not available")
            
        customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        if not customer_id:
            raise HTTPException(status_code=500, detail="Customer ID not configured")
            
        campaigns = fetch_campaigns(client, customer_id)
        return {"campaigns": campaigns, "count": len(campaigns)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching campaigns: {str(e)}")

@app.post("/google-ads/sync-campaigns")
def sync_google_ads_campaigns():
    """Sync campaigns from Google Ads to database"""
    try:
        client = get_google_ads_client()
        if not client:
            raise HTTPException(status_code=500, detail="Google Ads client not available")
            
        customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        campaigns = fetch_campaigns(client, customer_id)
        
        synced_count = 0
        for campaign_data in campaigns:
            # Add client_name and other required fields
            campaign_data['client_name'] = 'Google Ads Import'
            campaign_data['metrics'] = {
                'impressions': campaign_data.get('impressions', 0),
                'clicks': campaign_data.get('clicks', 0),
                'conversions': campaign_data.get('conversions', 0)
            }
            
            # Upsert campaign to database
            result = supabase.table("campaigns").upsert(campaign_data, on_conflict="id").execute()
            if result.data:
                synced_count += 1
                
        return {
            "synced": synced_count, 
            "total": len(campaigns),
            "message": f"Successfully synced {synced_count} campaigns"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing campaigns: {str(e)}")
```

## Phase 3: Environment Configuration

### Backend Environment Variables (Render)
Add these to your Render service environment:

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here  
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

## Phase 4: Testing Strategy

### Local Testing
1. Set up local environment variables
2. Test connection: `curl http://localhost:8000/google-ads/status`
3. Test campaign fetch: `curl http://localhost:8000/google-ads/campaigns`
4. Test sync: `curl -X POST http://localhost:8000/google-ads/sync-campaigns`

### Production Testing
1. Deploy backend with environment variables
2. Test live endpoints through frontend
3. Verify campaign data appears in dashboard
4. Check Supabase database for synced campaigns

## Phase 5: Frontend Updates

The frontend GoogleAdsIntegration component is already set up to handle:
- Connection status checking
- Campaign synchronization 
- Error handling
- Real-time updates

No major changes needed once backend is working.

## Expected Results

✅ **Live Connection**: `/google-ads/status` returns "connected"
✅ **Real Data**: Campaigns from your Google Ads account appear in dashboard
✅ **Auto Sync**: New campaigns automatically sync to database
✅ **Performance Data**: Real impression, click, conversion data
✅ **Error Handling**: Clear error messages for debugging

## Common Issues & Solutions

**Issue**: "Developer token not approved"
**Solution**: Wait for Google approval, can take 24-48 hours

**Issue**: "Invalid customer ID"  
**Solution**: Remove dashes from customer ID (123-456-7890 → 1234567890)

**Issue**: "OAuth authentication failed"
**Solution**: Regenerate refresh token using the Python script

**Issue**: "Quota exceeded"
**Solution**: Check Google Ads API quota limits in Google Cloud Console

## Next Steps After Implementation

1. **Real-time Performance Monitoring**: Add scheduled jobs to sync performance data
2. **Campaign Optimization**: Implement AI-driven optimization recommendations  
3. **Multi-Account Support**: Handle multiple Google Ads accounts
4. **Advanced Reporting**: Add detailed performance analytics and reporting
5. **Automation Rules**: Implement automated bid adjustments and budget optimization

---

**Ready to implement? Start with Phase 1 - getting your developer token approved!**