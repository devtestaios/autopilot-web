# Google Ads API Setup Guide

## Environment Variables Required

Add these variables to your backend environment (Render .env or local .env file):

```bash
# Google Ads API Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_oauth2_client_id_here  
GOOGLE_ADS_CLIENT_SECRET=your_oauth2_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_CUSTOMER_ID=your_customer_id_here
```

## How to Get Google Ads API Credentials

### 1. Developer Token
1. Go to [Google Ads API Center](https://developers.google.com/google-ads/api/docs/first-call/overview)
2. Apply for a developer token
3. Wait for approval (can take several days)

### 2. OAuth2 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Ads API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Desktop Application" 
6. Save the Client ID and Client Secret

### 3. Refresh Token
Use this Python script to generate refresh token:

```python
from google_auth_oauthlib.flow import InstalledAppFlow
import google.auth.transport.requests

# OAuth2 scope for Google Ads API
SCOPES = ['https://www.googleapis.com/auth/adwords']

def generate_refresh_token(client_id, client_secret):
    flow = InstalledAppFlow.from_client_config(
        {
            "installed": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        SCOPES
    )
    
    credentials = flow.run_local_server(port=8080)
    print(f"Refresh token: {credentials.refresh_token}")

# Run this once to get your refresh token
generate_refresh_token("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET")
```

### 4. Customer ID
1. Log into your Google Ads account
2. Look at the URL or top-right corner 
3. Customer ID is the 10-digit number (format: 123-456-7890)
4. Remove dashes when setting environment variable: 1234567890

## Testing the Integration

Once environment variables are set:

```bash
# Install dependencies
pip install google-ads google-auth google-auth-oauthlib

# Test the connection
curl http://localhost:8000/google-ads/status
```

## API Endpoints Added

- `GET /google-ads/status` - Check connection status
- `GET /google-ads/campaigns` - Fetch campaigns from Google Ads
- `POST /google-ads/sync-campaigns` - Sync campaigns to database
- `GET /google-ads/campaigns/{id}/performance` - Get performance data
- `POST /google-ads/sync-performance/{campaign_id}` - Sync performance data

## Production Deployment

For Render deployment:
1. Add environment variables in Render dashboard
2. Redeploy the service
3. Check `/google-ads/status` endpoint to verify connection

## Troubleshooting

**Common Issues:**
- Developer token not approved: Wait for Google approval
- Invalid customer ID: Check format (no dashes)
- OAuth errors: Regenerate refresh token
- Quota exceeded: Check API usage limits

**Debug Steps:**
1. Check `/google-ads/status` endpoint
2. Verify all environment variables are set
3. Test with a simple campaign query
4. Check Google Ads API quota usage