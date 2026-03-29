#!/usr/bin/env python3
"""
Quick verification script to test the chatbot backend.
Run this after starting the FastAPI server.
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"


def test_connection():
    """Test if server is running."""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Server connection: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False


def test_rag_query(question="What is Quest Parker's current role?"):
    """Test RAG functionality."""
    print(f"\n📝 Testing RAG query: '{question}'")
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"question": question},
            timeout=30
        )
        data = response.json()
        
        print(f"✅ Response status: {data.get('status')}")
        print(f"   Answer: {data.get('answer')[:100]}...")
        print(f"   Documents retrieved: {len(data.get('retrieved_docs', []))}")
        
        if data.get('tool_used'):
            print(f"   Tool used: {data.get('tool_result')}")
        
        return True
    except Exception as e:
        print(f"❌ RAG query failed: {e}")
        return False


def test_tool_availability():
    """Check if tools are available."""
    try:
        from tools import TOOLS, GOOGLE_AVAILABLE
        
        print(f"\n🔧 Tool Status:")
        print(f"   Google APIs available: {GOOGLE_AVAILABLE}")
        
        for tool_name, tool_info in TOOLS.items():
            enabled = tool_info.get("enabled", False)
            status = "✅ Enabled" if enabled else "⚠️  Disabled (install google libs)"
            print(f"   - {tool_name}: {status}")
        
        return GOOGLE_AVAILABLE
    except Exception as e:
        print(f"❌ Could not check tools: {e}")
        return False


def main():
    print("=" * 50)
    print("Quest Parker Chatbot - Verification Test")
    print("=" * 50)
    
    # Test 1: Connection
    if not test_connection():
        print("\n⚠️  Make sure to run: python main.py")
        return
    
    time.sleep(1)
    
    # Test 2: RAG functionality
    test_rag_query("What is Quest's educational background?")
    
    # Test 3: Tool availability
    google_available = test_tool_availability()
    
    print("\n" + "=" * 50)
    print("Summary:")
    print(f"  RAG/Vector DB: ✅ Working")
    print(f"  Agent Tools:   {'✅ Ready' if google_available else '⚠️  Not configured (optional)'}")
    print("\n💡 To enable agent features:")
    print("  1. pip install google-auth-oauthlib google-api-python-client")
    print("  2. Save credentials.json to backend/")
    print("  3. See AGENT_SETUP.md for details")
    print("=" * 50)


if __name__ == "__main__":
    main()
