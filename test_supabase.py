#!/usr/bin/env python3
"""
Simple test to verify Supabase connection locally
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    from supabase import create_client, Client
    
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    
    print(f"SUPABASE_URL configured: {bool(SUPABASE_URL)}")
    print(f"SUPABASE_ANON_KEY configured: {bool(SUPABASE_ANON_KEY)}")
    
    if SUPABASE_URL and SUPABASE_ANON_KEY:
        print(f"URL: {SUPABASE_URL[:50]}...")
        print(f"Key: {SUPABASE_ANON_KEY[:20]}...")
        
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Supabase client created successfully")
        
        # Test database connection
        try:
            result = supabase.table("email_campaigns").select("id").limit(1).execute()
            print(f"✅ Database connection successful! Found {len(result.data)} records")
        except Exception as e:
            print(f"❌ Database query failed: {e}")
    else:
        print("❌ Supabase environment variables not found")
        
except ImportError as e:
    print(f"❌ Supabase package not installed: {e}")
except Exception as e:
    print(f"❌ Error: {e}")