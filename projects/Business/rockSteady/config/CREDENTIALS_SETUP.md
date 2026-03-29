# Credentials Configuration

## Overview
This file contains placeholder values for external API credentials. Fill these in to enable:
- Google Docs reading/writing
- Google Calendar integration
- Enhanced web search
- Other integrations

## Setup Instructions

### 1. Google Cloud Setup (For Google Docs & Calendar)

```bash
# Create .env file in project root
cp .env.example .env
```

Add to `.env`:
```
GOOGLE_API_KEY=your-actual-google-api-key
GOOGLE_CALENDAR_ID=your-email@gmail.com
```

Or use Service Account (recommended):

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable APIs: Google Docs, Google Calendar
4. Create Service Account (IAM → Service Accounts)
5. Download JSON credentials
6. Place in: `config/google_credentials.json`
7. Share docs/calendar with service account email

### 2. Web Search API (Enhanced)

Choose one:

#### Option A: SerpAPI (Easiest)
```bash
# Sign up: https://serpapi.com (free tier: 100/month)
# Add to .env:
SERPAPI_KEY=your-serpapi-api-key
```

#### Option B: Google Custom Search
```bash
# Get at: https://programmablesearchengine.google.com
# Add to .env:
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
```

### 3. Other Services (Optional)

```bash
# Notion
NOTION_API_KEY=your-notion-api-key

# Slack
SLACK_BOT_TOKEN=your-slack-bot-token
```

## Current Status

Run this to check what's configured:

```python
from config.credentials import *

print("Google Docs:", "✅ Configured" if has_google_credentials() else "❌ Not configured")
print("Web Search:", "✅ SerpAPI" if has_serpapi_key() else "❌ Not configured")
print("Google Search:", "✅ Configured" if has_google_search_credentials() else "❌ Not configured")
```

## .env Example

Create `.env` file in project root:

```
# Google APIs
GOOGLE_API_KEY=AIzaSy...your-key...
GOOGLE_CALENDAR_ID=your-email@gmail.com

# Web Search
SERPAPI_KEY=your-serpapi-key-here
# OR
GOOGLE_SEARCH_API_KEY=AIzaSy...
GOOGLE_SEARCH_ENGINE_ID=abc123def456

# Other Services
NOTION_API_KEY=secret_...
SLACK_BOT_TOKEN=xoxb-...
```

## Without Credentials

The agent works fine without credentials:
- ✅ Local calendar scheduling
- ✅ Excel read/write
- ✅ File operations
- ✅ Basic web search (DuckDuckGo)

Add credentials later to unlock premium features.
