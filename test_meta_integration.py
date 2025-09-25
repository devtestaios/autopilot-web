#!/usr/bin/env python3
"""
Meta API Configuration Test Script
Tests your Meta Business API credentials and access
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MetaAPITester:
    def __init__(self):
        self.app_id = os.getenv('META_APP_ID')
        self.app_secret = os.getenv('META_APP_SECRET')
        self.access_token = os.getenv('META_ACCESS_TOKEN')
        self.ad_account_id = os.getenv('META_AD_ACCOUNT_ID')
        
        print("🧪 Meta API Configuration Tester")
        print("=" * 40)
    
    def test_1_config_check(self):
        """Test 1: Verify all environment variables are set"""
        print("\n📋 Test 1: Configuration Check")
        
        missing = []
        if not self.app_id:
            missing.append("META_APP_ID")
        if not self.app_secret:
            missing.append("META_APP_SECRET")
        if not self.access_token:
            missing.append("META_ACCESS_TOKEN")
        if not self.ad_account_id:
            missing.append("META_AD_ACCOUNT_ID")
            
        if missing:
            print(f"❌ Missing variables: {', '.join(missing)}")
            return False
        else:
            print("✅ All environment variables found")
            print(f"   App ID: {self.app_id[:8]}...")
            print(f"   Access Token: {self.access_token[:15]}...")
            print(f"   Ad Account: {self.ad_account_id}")
            return True
    
    def test_2_token_validation(self):
        """Test 2: Validate access token"""
        print("\n🔐 Test 2: Access Token Validation")
        
        try:
            response = requests.get(
                f"https://graph.facebook.com/me?access_token={self.access_token}"
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Token valid for user: {data.get('name', 'Unknown')}")
                return True
            else:
                print(f"❌ Token validation failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Token validation error: {str(e)}")
            return False
    
    def test_3_ad_account_access(self):
        """Test 3: Test ad account access"""
        print("\n🏢 Test 3: Ad Account Access")
        
        try:
            response = requests.get(
                f"https://graph.facebook.com/v19.0/{self.ad_account_id}",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Ad Account access successful")
                print(f"   Account Name: {data.get('name', 'N/A')}")
                print(f"   Currency: {data.get('currency', 'N/A')}")
                print(f"   Status: {data.get('account_status', 'N/A')}")
                return True
            else:
                print(f"❌ Ad Account access failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Ad Account access error: {str(e)}")
            return False
    
    def test_4_campaigns_access(self):
        """Test 4: Test campaigns retrieval"""
        print("\n📊 Test 4: Campaigns Access")
        
        try:
            response = requests.get(
                f"https://graph.facebook.com/v19.0/{self.ad_account_id}/campaigns",
                headers={"Authorization": f"Bearer {self.access_token}"},
                params={"fields": "id,name,status,objective,created_time"}
            )
            
            if response.status_code == 200:
                data = response.json()
                campaigns = data.get('data', [])
                print(f"✅ Campaign access successful")
                print(f"   Found {len(campaigns)} campaigns")
                
                if campaigns:
                    print("   Sample campaigns:")
                    for i, campaign in enumerate(campaigns[:3]):
                        print(f"   - {campaign.get('name', 'Unnamed')[:30]} ({campaign.get('status', 'Unknown')})")
                
                return True
            else:
                print(f"❌ Campaigns access failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Campaigns access error: {str(e)}")
            return False
    
    def test_5_insights_access(self):
        """Test 5: Test insights/analytics access"""
        print("\n📈 Test 5: Insights Access")
        
        try:
            response = requests.get(
                f"https://graph.facebook.com/v19.0/{self.ad_account_id}/insights",
                headers={"Authorization": f"Bearer {self.access_token}"},
                params={
                    "fields": "impressions,clicks,spend,ctr,cpc",
                    "date_preset": "yesterday"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                insights = data.get('data', [])
                print(f"✅ Insights access successful")
                
                if insights:
                    insight = insights[0]
                    print(f"   Yesterday's metrics:")
                    print(f"   - Impressions: {insight.get('impressions', '0')}")
                    print(f"   - Clicks: {insight.get('clicks', '0')}")
                    print(f"   - Spend: ${insight.get('spend', '0')}")
                else:
                    print("   No insights data available (may be normal for new accounts)")
                
                return True
            else:
                print(f"❌ Insights access failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Insights access error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests and provide summary"""
        print("🚀 Starting Meta API Integration Tests...")
        
        tests = [
            self.test_1_config_check,
            self.test_2_token_validation,
            self.test_3_ad_account_access,
            self.test_4_campaigns_access,
            self.test_5_insights_access
        ]
        
        results = []
        for test in tests:
            results.append(test())
        
        print("\n" + "=" * 40)
        print("📊 FINAL RESULTS")
        print("=" * 40)
        
        passed = sum(results)
        total = len(results)
        
        if passed == total:
            print(f"🎉 ALL TESTS PASSED ({passed}/{total})")
            print("✅ Your Meta API integration is ready!")
            print("\n🔥 Next Steps:")
            print("   1. Start your development server: npm run dev --turbopack")
            print("   2. Visit: http://localhost:3000/dashboard/phase1")
            print("   3. Look for Meta campaign data in the widgets")
        elif passed >= 3:
            print(f"⚠️  MOSTLY WORKING ({passed}/{total})")
            print("✅ Basic integration should work, some features may be limited")
        else:
            print(f"❌ MULTIPLE FAILURES ({passed}/{total})")
            print("🔧 Please check your credentials and try again")
        
        return passed == total

if __name__ == "__main__":
    tester = MetaAPITester()
    tester.run_all_tests()