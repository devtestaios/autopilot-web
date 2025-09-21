"""
Simple test to verify AI imports work correctly
"""

def test_imports():
    try:
        print("Testing AI imports...")
        
        # Test ai_endpoints import
        from ai_endpoints import ai_router
        print("✅ ai_endpoints imported successfully")
        print(f"AI router type: {type(ai_router)}")
        
        # Test ai_chat_service import
        from ai_chat_service import ai_service
        print("✅ ai_chat_service imported successfully")
        print(f"AI service type: {type(ai_service)}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Other error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("🎉 All AI imports working correctly!")
    else:
        print("🚨 AI import issues detected")