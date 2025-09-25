#!/usr/bin/env python3
"""
Simple Meta API Test - No external dependencies
"""

import os
import subprocess
import sys

# Set environment variables from .env file
env_file = 'backend/.env'

def load_env_vars():
    """Load environment variables from .env file"""
    env_vars = {}
    try:
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    # Remove quotes if present
                    value = value.strip('"').strip("'")
                    env_vars[key] = value
                    os.environ[key] = value
        return env_vars
    except FileNotFoundError:
        print(f"❌ Environment file {env_file} not found")
        return {}

def test_meta_credentials():
    """Test Meta API credentials"""
    print("🧪 META BUSINESS API CREDENTIAL TEST")
    print("=" * 50)
    
    # Load environment variables
    env_vars = load_env_vars()
    
    if not env_vars:
        return False
    
    # Check required credentials
    required_vars = ['META_APP_ID', 'META_APP_SECRET', 'META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID']
    missing_vars = []
    
    for var in required_vars:
        value = env_vars.get(var)
        if not value:
            missing_vars.append(var)
        else:
            # Mask sensitive values for display
            if 'SECRET' in var or 'TOKEN' in var:
                display_value = f"{value[:10]}...{value[-10:]}" if len(value) > 20 else value[:5] + "..."
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
    
    if missing_vars:
        print(f"❌ Missing required variables: {', '.join(missing_vars)}")
        return False
    
    # Test API access using curl (no Python dependencies needed)
    print("\n🔍 Testing API Access...")
    
    access_token = env_vars.get('META_ACCESS_TOKEN')
    ad_account_id = env_vars.get('META_AD_ACCOUNT_ID')
    
    # Test basic API call
    curl_cmd = [
        'curl',
        '-s',
        f'https://graph.facebook.com/v19.0/me?access_token={access_token}'
    ]
    
    try:
        result = subprocess.run(curl_cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            response = result.stdout
            if 'error' not in response.lower():
                print("✅ Basic API Access: SUCCESS")
                print(f"📄 Response: {response[:100]}...")
                
                # Test ad account access
                account_cmd = [
                    'curl',
                    '-s', 
                    f'https://graph.facebook.com/v19.0/act_{ad_account_id}?access_token={access_token}&fields=name,account_status,currency'
                ]
                
                account_result = subprocess.run(account_cmd, capture_output=True, text=True, timeout=10)
                if account_result.returncode == 0:
                    account_response = account_result.stdout
                    if 'error' not in account_response.lower():
                        print("✅ Ad Account Access: SUCCESS")
                        print(f"📄 Account Info: {account_response}")
                        return True
                    else:
                        print(f"❌ Ad Account Access: FAILED")
                        print(f"📄 Error: {account_response}")
                        return False
                else:
                    print("❌ Ad Account Test: Command failed")
                    return False
            else:
                print(f"❌ API Access: FAILED")
                print(f"📄 Error: {response}")
                return False
        else:
            print(f"❌ API Test: Command failed with code {result.returncode}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ API Test: Timeout")
        return False
    except Exception as e:
        print(f"❌ API Test: Exception - {e}")
        return False

if __name__ == "__main__":
    success = test_meta_credentials()
    if success:
        print("\n🎉 META API CREDENTIALS VALIDATED SUCCESSFULLY!")
        print("✅ Ready for full Meta Business API integration")
        sys.exit(0)
    else:
        print("\n❌ META API CREDENTIAL VALIDATION FAILED")
        print("🔧 Please check your credentials and try again")
        sys.exit(1)