#!/usr/bin/env python3
"""
Google Ads OAuth2 Refresh Token Generator

This script helps you generate a refresh token for Google Ads API access.
Run this locally after setting up your OAuth2 credentials in Google Cloud Console.

Requirements:
    pip install google-auth-oauthlib

Usage:
    1. Update the CLIENT_ID and CLIENT_SECRET below with your OAuth2 credentials
    2. Run: python generate_refresh_token.py
    3. Complete the browser authentication flow
    4. Copy the refresh token to your environment variables
"""

from google_auth_oauthlib.flow import InstalledAppFlow
import sys
import webbrowser

# Google Ads API OAuth2 scope
SCOPES = ['https://www.googleapis.com/auth/adwords']

def generate_refresh_token():
    """Generate a refresh token for Google Ads API access"""
    
    print("🚀 Google Ads API - Refresh Token Generator")
    print("=" * 50)
    
    # Get credentials from user input
    print("\n📋 Enter your OAuth2 credentials from Google Cloud Console:")
    print("   (Found in: Cloud Console → Credentials → OAuth 2.0 Client IDs)")
    
    client_id = input("\n🔑 Client ID: ").strip()
    if not client_id:
        print("❌ Client ID is required!")
        return
        
    client_secret = input("🔐 Client Secret: ").strip()
    if not client_secret:
        print("❌ Client Secret is required!")
        return
    
    print(f"\n✅ Using Client ID: {client_id[:20]}...")
    
    try:
        # Create OAuth2 flow
        flow = InstalledAppFlow.from_client_config(
            {
                "installed": {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost"]
                }
            },
            SCOPES
        )
        
        print("\n🌐 Opening browser for authentication...")
        print("   ➡️  Please complete the OAuth flow in your browser")
        print("   ➡️  Grant access to your Google Ads account")
        print("   ➡️  This script will automatically detect completion")
        
        # Run the OAuth flow
        credentials = flow.run_local_server(
            port=8080,
            prompt='consent',
            open_browser=True
        )
        
        if credentials and credentials.refresh_token:
            print("\n🎉 SUCCESS! Refresh token generated:")
            print("=" * 50)
            print(f"GOOGLE_ADS_REFRESH_TOKEN={credentials.refresh_token}")
            print("=" * 50)
            
            print("\n📝 Next Steps:")
            print("1. Copy the refresh token above")
            print("2. Add it to your backend environment variables:")
            print("   - For Render: Add to Environment Variables in dashboard")
            print("   - For local: Add to .env file")
            print("3. Make sure you also have:")
            print(f"   GOOGLE_ADS_CLIENT_ID={client_id}")
            print(f"   GOOGLE_ADS_CLIENT_SECRET={client_secret}")
            print("   GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token")
            print("   GOOGLE_ADS_CUSTOMER_ID=your_customer_id")
            
            print("\n🔗 Test your setup with:")
            print("   curl https://your-api-url.onrender.com/google-ads/status")
            
        else:
            print("❌ Failed to get refresh token. Please try again.")
            
    except Exception as e:
        print(f"\n❌ Error during authentication: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure your OAuth2 client is configured as 'Desktop Application'")
        print("2. Check that your Client ID and Secret are correct")
        print("3. Ensure you have internet connection")
        print("4. Try running: pip install google-auth-oauthlib")

def main():
    """Main function"""
    print("🎯 This script will help you generate a Google Ads API refresh token.")
    print("💡 Make sure you have completed these steps first:")
    print("   1. ✅ Applied for Google Ads Developer Token")
    print("   2. ✅ Created OAuth2 credentials in Google Cloud Console")
    print("   3. ✅ Enabled Google Ads API in your project")
    
    choice = input("\n🤔 Ready to proceed? (y/n): ").strip().lower()
    if choice in ['y', 'yes']:
        generate_refresh_token()
    else:
        print("👋 Come back when you're ready!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Authentication cancelled by user.")
    except ImportError:
        print("❌ Missing required package!")
        print("📦 Please install: pip install google-auth-oauthlib")
        sys.exit(1)