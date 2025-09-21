"""
Test script for PulseBridge.ai Backend AI Integration
Run this after deployment to verify AI functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Backend URL - Update this to your deployed backend
BACKEND_URL = "https://autopilot-api.onrender.com"

async def test_ai_chat():
    """Test AI chat endpoint"""
    print("🤖 Testing AI Chat Integration...")
    
    test_message = {
        "message": "Hello! Can you help me create a new Google Ads campaign for holiday shopping?",
        "page": "campaigns",
        "context": {
            "user": "test_user",
            "platform": "pulsebridge"
        }
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                f"{BACKEND_URL}/api/v1/ai/chat",
                json=test_message,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ AI Chat Response:")
                    print(f"Response: {result.get('response', 'No response')}")
                    print(f"Actions: {result.get('actions', [])}")
                    print(f"Suggestions: {result.get('suggestions', [])}")
                    return True
                else:
                    print(f"❌ AI Chat failed with status: {response.status}")
                    error_text = await response.text()
                    print(f"Error: {error_text}")
                    return False
        except Exception as e:
            print(f"❌ AI Chat connection error: {e}")
            return False

async def test_ai_action():
    """Test AI action execution"""
    print("\n🎯 Testing AI Action Execution...")
    
    test_action = {
        "type": "create_campaign",
        "parameters": {
            "name": "Test Holiday Campaign",
            "platform": "google_ads",
            "budget": 2000,
            "target_audience": "holiday shoppers"
        }
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                f"{BACKEND_URL}/api/v1/ai/execute-action",
                json=test_action,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ AI Action Execution:")
                    print(f"Result: {result}")
                    return True
                else:
                    print(f"❌ AI Action failed with status: {response.status}")
                    error_text = await response.text()
                    print(f"Error: {error_text}")
                    return False
        except Exception as e:
            print(f"❌ AI Action connection error: {e}")
            return False

async def test_health_check():
    """Test backend health"""
    print("\n🏥 Testing Backend Health...")
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BACKEND_URL}/health") as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ Backend Health Check:")
                    print(f"Status: {result.get('status')}")
                    print(f"AI Services: {result.get('ai_services')}")
                    return True
                else:
                    print(f"❌ Health check failed with status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Backend connection error: {e}")
            return False

async def run_all_tests():
    """Run all tests"""
    print("🚀 PulseBridge.ai Backend AI Integration Tests")
    print("=" * 50)
    
    # Test health first
    health_ok = await test_health_check()
    
    if health_ok:
        # Test AI functionality
        chat_ok = await test_ai_chat()
        action_ok = await test_ai_action()
        
        print("\n" + "=" * 50)
        print("📊 Test Results Summary:")
        print(f"Backend Health: {'✅ PASS' if health_ok else '❌ FAIL'}")
        print(f"AI Chat: {'✅ PASS' if chat_ok else '❌ FAIL'}")
        print(f"AI Actions: {'✅ PASS' if action_ok else '❌ FAIL'}")
        
        if all([health_ok, chat_ok, action_ok]):
            print("\n🎉 All tests passed! AI integration is working!")
        else:
            print("\n⚠️  Some tests failed. Check deployment and environment variables.")
    else:
        print("\n❌ Backend is not accessible. Check deployment status.")

if __name__ == "__main__":
    print(f"Testing backend at: {BACKEND_URL}")
    print(f"Test started at: {datetime.now()}")
    asyncio.run(run_all_tests())