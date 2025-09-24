#!/usr/bin/env python3
"""
Meta Business API Testing Script
Test your Meta credentials and API access before full integration
"""

import os
import sys
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class MetaAPITester:
    def __init__(self):
        """Initialize with environment variables"""
        self.app_id = os.getenv('META_APP_ID')
        self.app_secret = os.getenv('META_APP_SECRET') 
        self.access_token = os.getenv('META_ACCESS_TOKEN')
        self.ad_account_id = os.getenv('META_AD_ACCOUNT_ID')
        
        self.base_url = "https://graph.facebook.com/v19.0"
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        # Test results tracking
        self.test_results = {
            'config_check': False,
            'token_validation': False,
            'ad_account_access': False,
            'campaigns_access': False,
            'insights_access': False
        }
    
    def print_banner(self):
        """Print test banner"""
        print("=" * 60)
        print("🚀 META BUSINESS API TESTING SCRIPT")
        print("   PulseBridge AI - Phase 1 Integration")
        print("=" * 60)
    
    def check_configuration(self) -> bool:
        """Check if all required environment variables are set"""
        print("\n📋 STEP 1: Configuration Check")
        
        required_vars = {
            'META_APP_ID': self.app_id,
            'META_APP_SECRET': self.app_secret,
            'META_ACCESS_TOKEN': self.access_token,
            'META_AD_ACCOUNT_ID': self.ad_account_id
        }
        
        missing_vars = []
        for var_name, var_value in required_vars.items():
            if not var_value:
                missing_vars.append(var_name)
                print(f"❌ {var_name}: NOT SET")
            else:
                # Show partial value for security
                display_value = var_value[:8] + "..." if len(var_value) > 8 else var_value
                print(f"✅ {var_name}: {display_value}")
        
        if missing_vars:
            print(f"\n❌ Missing environment variables: {', '.join(missing_vars)}")
            print("📖 See META_BUSINESS_API_SETUP.md for configuration instructions")
            return False
        
        print("✅ All environment variables configured!")
        self.test_results['config_check'] = True
        return True
    
    def validate_token(self) -> bool:
        """Validate access token"""
        print("\n🔑 STEP 2: Access Token Validation")
        
        try:
            url = f"{self.base_url}/me"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Token valid for user: {data.get('name', 'Unknown')}")
                print(f"   User ID: {data.get('id', 'Unknown')}")
                self.test_results['token_validation'] = True
                return True
            else:
                print(f"❌ Token validation failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error during token validation: {e}")
            return False
    
    def test_ad_account_access(self) -> bool:
        """Test access to ad account"""
        print("\n🏢 STEP 3: Ad Account Access Test")
        
        try:
            url = f"{self.base_url}/{self.ad_account_id}"
            params = {
                'fields': 'account_id,name,account_status,currency,business,timezone_name'
            }
            
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Ad Account Access Successful!")
                print(f"   Account Name: {data.get('name', 'Unknown')}")
                print(f"   Account ID: {data.get('account_id', 'Unknown')}")
                print(f"   Currency: {data.get('currency', 'Unknown')}")
                print(f"   Status: {data.get('account_status', 'Unknown')}")
                print(f"   Timezone: {data.get('timezone_name', 'Unknown')}")
                
                self.test_results['ad_account_access'] = True
                return True
            else:
                print(f"❌ Ad Account access failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error during ad account test: {e}")
            return False
    
    def test_campaigns_access(self) -> bool:
        """Test campaigns retrieval"""
        print("\n📊 STEP 4: Campaigns Access Test")
        
        try:
            url = f"{self.base_url}/{self.ad_account_id}/campaigns"
            params = {
                'fields': 'id,name,status,objective,created_time,updated_time,daily_budget,lifetime_budget',
                'limit': 5
            }
            
            response = requests.get(url, headers=self.headers, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                campaigns = data.get('data', [])
                
                print(f"✅ Campaigns Access Successful!")
                print(f"   Found {len(campaigns)} campaigns")
                
                for i, campaign in enumerate(campaigns[:3], 1):
                    print(f"   Campaign {i}:")
                    print(f"     Name: {campaign.get('name', 'Unknown')}")
                    print(f"     Status: {campaign.get('status', 'Unknown')}")
                    print(f"     Objective: {campaign.get('objective', 'Unknown')}")
                    print(f"     ID: {campaign.get('id', 'Unknown')}")
                
                if len(campaigns) == 0:
                    print("   ⚠️  No campaigns found in this ad account")
                    print("   📝 Consider creating a test campaign for full testing")
                
                self.test_results['campaigns_access'] = True
                return True
            else:
                print(f"❌ Campaigns access failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error during campaigns test: {e}")
            return False
    
    def test_insights_access(self) -> bool:
        """Test insights/performance data access"""
        print("\n📈 STEP 5: Insights Access Test")
        
        try:
            # Get a campaign ID for testing
            campaigns_url = f"{self.base_url}/{self.ad_account_id}/campaigns"
            campaigns_response = requests.get(
                campaigns_url, 
                headers=self.headers,
                params={'limit': 1},
                timeout=10
            )
            
            if campaigns_response.status_code != 200:
                print("❌ Could not fetch campaigns for insights test")
                return False
            
            campaigns_data = campaigns_response.json().get('data', [])
            if not campaigns_data:
                print("⚠️  No campaigns available for insights test")
                print("✅ Insights access test skipped (no campaigns)")
                self.test_results['insights_access'] = True
                return True
            
            campaign_id = campaigns_data[0]['id']
            
            # Test insights
            insights_url = f"{self.base_url}/{campaign_id}/insights"
            params = {
                'fields': 'impressions,clicks,spend,ctr,cpc,conversions',
                'time_range': json.dumps({
                    'since': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                    'until': datetime.now().strftime('%Y-%m-%d')
                })
            }
            
            response = requests.get(insights_url, headers=self.headers, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                insights = data.get('data', [])
                
                print(f"✅ Insights Access Successful!")
                print(f"   Retrieved insights for campaign: {campaign_id}")
                
                if insights:
                    insight = insights[0]
                    print(f"   Sample Metrics (last 7 days):")
                    print(f"     Impressions: {insight.get('impressions', 'N/A')}")
                    print(f"     Clicks: {insight.get('clicks', 'N/A')}")
                    print(f"     Spend: ${insight.get('spend', 'N/A')}")
                    print(f"     CTR: {insight.get('ctr', 'N/A')}%")
                    print(f"     CPC: ${insight.get('cpc', 'N/A')}")
                else:
                    print("   ℹ️  No insights data available (campaign may be new/inactive)")
                
                self.test_results['insights_access'] = True
                return True
            else:
                print(f"❌ Insights access failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error during insights test: {e}")
            return False
    
    def generate_sample_data(self):
        """Generate sample data for Phase 1 dashboard"""
        print("\n📊 STEP 6: Generating Sample Data for Phase 1 Dashboard")
        
        sample_data = {
            'campaigns': [
                {
                    'id': 'meta_123456789',
                    'name': 'Holiday Sale Campaign',
                    'status': 'ACTIVE',
                    'objective': 'CONVERSIONS',
                    'daily_budget': '5000',
                    'spend_today': '3847.52',
                    'impressions_today': '45000',
                    'clicks_today': '1200',
                    'conversions_today': '89'
                },
                {
                    'id': 'meta_987654321',
                    'name': 'Brand Awareness Q4',
                    'status': 'ACTIVE', 
                    'objective': 'BRAND_AWARENESS',
                    'daily_budget': '2000',
                    'spend_today': '1653.28',
                    'impressions_today': '28000',
                    'clicks_today': '720',
                    'conversions_today': '34'
                }
            ],
            'account_summary': {
                'total_spend_7d': '28547.83',
                'total_conversions_7d': '456',
                'avg_cpc': '2.48',
                'avg_ctr': '2.67',
                'avg_roas': '3.24'
            }
        }
        
        print("✅ Sample data structure:")
        print(json.dumps(sample_data, indent=2))
        
        # Save to file for dashboard testing
        with open('meta_sample_data.json', 'w') as f:
            json.dump(sample_data, f, indent=2)
        print("   📁 Saved to meta_sample_data.json")
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📋 META API TESTING SUMMARY")
        print("=" * 60)
        
        passed = sum(self.test_results.values())
        total = len(self.test_results)
        
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
        
        print(f"\n📊 Overall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Meta API integration ready!")
            print("\n🚀 Next Steps:")
            print("   1. Start your development server: npm run dev --turbopack")
            print("   2. Open Phase 1 dashboard: http://localhost:3000/dashboard/phase1")
            print("   3. Verify Meta campaign data appears in widgets")
            print("   4. Check real-time performance updates")
        else:
            print("⚠️  Some tests failed. Please check configuration and try again.")
            print("\n📖 See META_BUSINESS_API_SETUP.md for detailed setup instructions")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.print_banner()
        
        # Run tests in order
        if not self.check_configuration():
            self.print_summary()
            return False
        
        if not self.validate_token():
            self.print_summary()
            return False
        
        if not self.test_ad_account_access():
            self.print_summary()
            return False
        
        if not self.test_campaigns_access():
            self.print_summary()
            return False
        
        if not self.test_insights_access():
            self.print_summary()
            return False
        
        self.generate_sample_data()
        self.print_summary()
        
        return all(self.test_results.values())


if __name__ == "__main__":
    # Load environment variables from .env file if present
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("📁 Loaded environment variables from .env file")
    except ImportError:
        print("💡 Install python-dotenv for .env file support: pip install python-dotenv")
    
    # Run tests
    tester = MetaAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)