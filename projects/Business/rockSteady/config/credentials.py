"""Credentials configuration for external APIs and services."""

import os
from pathlib import Path
import json
from typing import Optional

# Google API Credentials
GOOGLE_CREDENTIALS_PATH = Path("config/google_credentials.json")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your-google-api-key-here")

# Web Search API Credentials
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "your-serpapi-key-here")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY", "your-google-search-api-key-here")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "your-google-search-engine-id")

# Calendar API
GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "your-calendar-id@gmail.com")

# Additional Services
NOTION_API_KEY = os.getenv("NOTION_API_KEY", "your-notion-api-key-here")
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN", "your-slack-token-here")


def has_google_credentials() -> bool:
    """Check if Google credentials are configured."""
    if GOOGLE_CREDENTIALS_PATH.exists():
        return True
    return GOOGLE_API_KEY != "your-google-api-key-here"


def has_serpapi_key() -> bool:
    """Check if SerpAPI key is configured."""
    return SERPAPI_KEY != "your-serpapi-key-here"


def has_google_search_credentials() -> bool:
    """Check if Google Search API credentials are configured."""
    return (
        GOOGLE_SEARCH_API_KEY != "your-google-search-api-key-here"
        and GOOGLE_SEARCH_ENGINE_ID != "your-google-search-engine-id"
    )


def load_google_service_account():
    """Load Google service account credentials."""
    try:
        if GOOGLE_CREDENTIALS_PATH.exists():
            with open(GOOGLE_CREDENTIALS_PATH) as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading Google credentials: {e}")
    return None
