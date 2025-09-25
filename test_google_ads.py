#!/usr/bin/env python3
"""
Google Ads API Testing Script
Test your Google Ads credentials and API access before full integration
"""

import os
import sys
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class GoogleAdsAPITester:
    def __init__(self):
        """Initialize with environment variables from .env file"""
        self.load_env_variables()
        
        self.developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        self.client_id = os.getenv('GOOGLE_ADS_CLIENT_ID') 
        self.client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        self.refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        
        # Test results tracking
        self.test_results = {
            'config_check': False,
            'credentials_validation': False,
            'api_connection': False,
            'customer_access': False,
            'campaigns_access': False,
        }
    
    def load_env_variables(self):
        """Load environment variables from .env file"""
        env_file = 'backend/.env'
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        # Remove quotes if present
                        value = value.strip('"').strip("'")
                        os.environ[key] = value
        except FileNotFoundError:
            print(f"❌ Environment file {env_file} not found")
    
    def print_banner(self):
        """Print test banner"""
        print("=" * 60)
        print("🚀 GOOGLE ADS API TESTING SCRIPT")
        print("   PulseBridge AI - Multi-Platform Integration")
        print("=" * 60)
    
    def check_configuration(self) -> bool:
        """Check if all required environment variables are set"""
        print("\n📋 STEP 1: Configuration Check")
        
        required_vars = {
            'GOOGLE_ADS_DEVELOPER_TOKEN': self.developer_token,
            'GOOGLE_ADS_CLIENT_ID': self.client_id,
            'GOOGLE_ADS_CLIENT_SECRET': self.client_secret,
            'GOOGLE_ADS_REFRESH_TOKEN': self.refresh_token,
            'GOOGLE_ADS_CUSTOMER_ID': self.customer_id,
        }
        
        missing_vars = []
        
        for var_name, var_value in required_vars.items():
            if not var_value or var_value == f"your_{var_name.lower().replace('google_ads_', '').replace('_', '_')}_here":
                missing_vars.append(var_name)
                print(f"❌ {var_name}: Not set or placeholder value")
            else:
                # Mask sensitive values for display
                if 'TOKEN' in var_name or 'SECRET' in var_name:
                    display_value = f"{var_value[:10]}...{var_value[-6:]}" if len(var_value) > 16 else f"{var_value[:4]}..."
                else:
                    display_value = var_value
                print(f"✅ {var_name}: {display_value}")
        
        if missing_vars:
            print(f"\n❌ Missing or placeholder values for: {', '.join(missing_vars)}")
            print("\n📝 Please update your backend/.env file with actual Google Ads credentials:")
            print("   1. Get credentials from: https://developers.google.com/google-ads/api/docs/first-call/overview")
            print("   2. Replace placeholder values in backend/.env")
            print("   3. Run this test again")
            return False
        
        print("✅ All configuration variables are set")
        self.test_results['config_check'] = True
        return True
    
    def test_google_ads_import(self) -> bool:
        """Test if Google Ads library can be imported"""
        print("\n📦 STEP 2: Google Ads Library Test")
        
        try:
            from google.ads.googleads.client import GoogleAdsClient
            from google.ads.googleads.errors import GoogleAdsException
            print("✅ Google Ads library imported successfully")
            return True
        except ImportError as e:
            print(f"❌ Failed to import Google Ads library: {e}")
            print("\n📝 To install Google Ads library:")
            print("   pip install google-ads==24.1.0 google-auth==2.23.3")
            return False
    
    def test_client_creation(self) -> bool:
        """Test Google Ads client creation"""
        print("\n🔧 STEP 3: Client Creation Test")
        
        if not self.test_google_ads_import():
            return False
        
        try:
            from google.ads.googleads.client import GoogleAdsClient
            
            # Create client configuration
            config = {
                'developer_token': self.developer_token,
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'refresh_token': self.refresh_token,
                'use_proto_plus': True
            }
            
            client = GoogleAdsClient.load_from_dict(config)
            print("✅ Google Ads client created successfully")
            
            self.client = client
            self.test_results['credentials_validation'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed to create Google Ads client: {e}")
            print("\n🔧 Common issues:")
            print("   - Invalid developer token")
            print("   - Invalid OAuth2 credentials")
            print("   - Refresh token expired")
            return False
    
    def test_customer_access(self) -> bool:
        """Test access to Google Ads customer account"""
        print("\n👤 STEP 4: Customer Access Test")
        
        if not self.client:
            print("❌ Client not initialized, skipping customer test")
            return False
        
        try:
            from google.ads.googleads.errors import GoogleAdsException
            
            customer_service = self.client.get_service("CustomerService")
            
            # Clean customer ID (remove dashes)
            clean_customer_id = self.customer_id.replace('-', '')
            
            customer = customer_service.get_customer(
                resource_name=f"customers/{clean_customer_id}"
            )
            
            print(f"✅ Customer access successful")
            print(f"   Account: {customer.descriptive_name}")
            print(f"   Currency: {customer.currency_code}")
            print(f"   Time Zone: {customer.time_zone}")
            print(f"   Customer ID: {clean_customer_id}")
            
            self.test_results['api_connection'] = True
            self.test_results['customer_access'] = True
            return True
            
        except GoogleAdsException as ex:
            print(f"❌ Google Ads API error: {ex.error.code().name}")
            print(f"   Message: {ex.error.message}")
            return False
        except Exception as e:
            print(f"❌ Customer access failed: {e}")
            print("\n🔧 Common issues:")
            print("   - Invalid customer ID")
            print("   - No access to customer account")
            print("   - Customer ID should be in format: 123-456-7890")
            return False
    
    def test_campaigns_access(self) -> bool:
        """Test campaigns access"""
        print("\n🎯 STEP 5: Campaigns Access Test")
        
        if not self.client:
            print("❌ Client not initialized, skipping campaigns test")
            return False
        
        try:
            from google.ads.googleads.errors import GoogleAdsException
            
            ga_service = self.client.get_service("GoogleAdsService")
            
            clean_customer_id = self.customer_id.replace('-', '')
            
            query = """
                SELECT 
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.advertising_channel_type,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros
                FROM campaign 
                WHERE segments.date DURING LAST_30_DAYS
                ORDER BY metrics.impressions DESC
                LIMIT 10
            """
            
            search_request = self.client.get_type("SearchGoogleAdsRequest")
            search_request.customer_id = clean_customer_id
            search_request.query = query
            
            results = ga_service.search(request=search_request)
            
            campaigns = list(results)
            print(f"✅ Successfully retrieved {len(campaigns)} campaigns")
            
            if campaigns:
                print("\n📊 Recent Campaign Performance:")
                for row in campaigns[:5]:  # Show top 5
                    campaign = row.campaign
                    metrics = row.metrics
                    
                    cost = metrics.cost_micros / 1_000_000  # Convert micros to currency
                    
                    print(f"   • {campaign.name}")
                    print(f"     ID: {campaign.id} | Status: {campaign.status.name}")
                    print(f"     Impressions: {metrics.impressions:,} | Clicks: {metrics.clicks:,} | Cost: ${cost:.2f}")
            else:
                print("   No campaigns found (this is normal for new accounts)")
            
            self.test_results['campaigns_access'] = True
            return True
            
        except GoogleAdsException as ex:
            print(f"❌ Google Ads API error: {ex.error.code().name}")
            print(f"   Message: {ex.error.message}")
            return False
        except Exception as e:
            print(f"❌ Campaigns access failed: {e}")
            return False
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 GOOGLE ADS API TEST RESULTS")
        print("=" * 60)
        
        passed_tests = sum(self.test_results.values())
        total_tests = len(self.test_results)
        
        for test_name, result in self.test_results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL TESTS PASSED! Google Ads API is ready for integration!")
            print("✅ Ready to create campaigns and fetch real data")
            print("✅ Ready for autonomous campaign management")
            return True
        else:
            print(f"\n❌ {total_tests - passed_tests} test(s) failed. Please fix the issues above.")
            print("🔧 Check your credentials and try again")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.print_banner()
        
        success = True
        
        # Step 1: Check configuration
        if not self.check_configuration():
            success = False
        
        # Step 2-5: Run API tests only if config is valid
        if success:
            if not self.test_client_creation():
                success = False
            
            if success and not self.test_customer_access():
                success = False
            
            if success and not self.test_campaigns_access():
                success = False
        
        # Print summary
        return self.print_summary()

def main():
    """Main function"""
    tester = GoogleAdsAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🚀 Next Steps:")
        print("1. ✅ Google Ads API validated")
        print("2. ⏭️  Integrate with PulseBridge AI dashboard") 
        print("3. ⏭️  Enable multi-platform campaign management")
        print("4. ⏭️  Configure AI autonomous optimization")
        sys.exit(0)
    else:
        print("\n🔧 Fix the issues above and run the test again")
        sys.exit(1)

if __name__ == "__main__":
    main()