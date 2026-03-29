## Agent Tool Setup Guide

This chatbot now includes **email** and **calendar** functionality via Google APIs. Here's how to set it up.

### Prerequisites

1. **Google Cloud Project** with OAuth 2.0 credentials
2. **Required Python packages**

### Step 1: Install Google API Libraries

```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Step 2: Set Up Google OAuth (One-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - Gmail API
   - Google Calendar API
4. Create OAuth 2.0 credentials:
   - Type: Desktop application
   - Download JSON file → save as `backend/credentials.json`

### Step 3: First Run

When you first run the backend with agent features:

```bash
cd backend
python main.py
```

On first request using email/calendar features:
- Browser will open for Google OAuth consent
- Authorize the app
- `token.json` will be created automatically
- Subsequent requests won't require re-authentication

### Step 4: Test Agent Features

Try these messages in the chatbot:

**Example 1 - Send Email:**
```
Send an email to john@example.com with the subject "Meeting Request" and body "Hi John, let's discuss the project."
```

**Example 2 - Schedule Meeting:**
```
Schedule a meeting with jane@example.com on 2025-01-20 at 2:00 PM for 30 minutes titled "Quarterly Review"
```

### Important Notes

⚠️ **Without Google Credentials:**
- Email and calendar tools are disabled (gracefully)
- Chatbot still works fully for RAG queries
- You'll see helpful error messages if credentials are missing

✅ **Backward Compatibility:**
- All existing RAG functionality is preserved
- Normal Q&A about Quest Parker works unchanged
- Tools are optional, not required

### File Structure

```
backend/
├── main.py                 # Updated with agent logic
├── tools.py               # New: Tool implementations
├── credentials.json       # (Create via Google Cloud Console)
├── token.json            # (Auto-generated on first auth)
└── data/
    └── professional_profile.txt
```

### Troubleshooting

**"Google API client not available"**
→ Run: `pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client`

**"Google credentials not found"**
→ Create `backend/credentials.json` via Google Cloud Console

**OAuth loop on first run**
→ Normal behavior. Authorize once, token saves automatically.

**Tool not executing**
→ Check browser console for CORS issues
→ Verify credentials.json has correct permissions
