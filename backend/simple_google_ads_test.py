#!/usr/bin/env python3
"""
Simple Google Ads API Test
Tests basic credential configuration and token refresh
"""
import os
import requests
import json
from dotenv import load_dotenv

def test_credentials():
    """Test Google Ads credentials configuration"""
    load_dotenv()
    
    print("🔍 Testing Google Ads API Configuration...")
    print("=" * 50)
    
    # Check environment variables
    required_vars = [
        'GOOGLE_ADS_DEVELOPER_TOKEN',
        'GOOGLE_ADS_CLIENT_ID', 
        'GOOGLE_ADS_CLIENT_SECRET',
        'GOOGLE_ADS_REFRESH_TOKEN',
        'GOOGLE_ADS_CUSTOMER_ID'
    ]
    
    config = {}
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            config[var] = value[:20] + "..." if len(value) > 20 else value
            print(f"✅ {var}: {config[var]}")
        else:
            missing_vars.append(var)
            print(f"❌ {var}: MISSING")
    
    if missing_vars:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_vars)}")
        return False
    
    print(f"\n✅ All required environment variables are set!")
    
    # Test token refresh
    print("\n🔄 Testing OAuth Token Refresh...")
    print("-" * 30)
    
    try:
        refresh_token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
                'client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token': os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
                'grant_type': 'refresh_token'
            }
        )
        
        if refresh_token_response.status_code == 200:
            token_data = refresh_token_response.json()
            print(f"✅ Token refresh successful!")
            print(f"   Access Token: {token_data.get('access_token', '')[:20]}...")
            print(f"   Token Type: {token_data.get('token_type', 'N/A')}")
            print(f"   Expires In: {token_data.get('expires_in', 'N/A')} seconds")
            return True
        else:
            print(f"❌ Token refresh failed!")
            print(f"   Status: {refresh_token_response.status_code}")
            print(f"   Response: {refresh_token_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Token refresh error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Google Ads API Simple Test")
    print("=" * 50)
    
    success = test_credentials()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Google Ads API credentials are working!")
        print("✨ Ready for full integration testing")
    else:
        print("❌ Google Ads API setup needs attention")
        print("🔧 Please check the configuration above")

if __name__ == "__main__":
    main()