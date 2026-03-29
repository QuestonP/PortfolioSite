# 🔐 Credentials Setup Guide

## Overview

Your chatbot needs **Google API credentials** for email and calendar features. Everything is kept secure and local.

---

## 📍 File Locations

```
backend/
├── credentials.json      ← Your Google OAuth JSON (NEVER commit to git)
├── token.json           ← Auto-generated after first auth (NEVER commit)
└── .env                 ← Copy of .env.example with your paths
```

---

## Step 1: Get Google Credentials

### 1a. Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Click **"Select a Project"** → **"New Project"**
3. Name: `ProfessionalChatbot`
4. Click **Create**

### 1b. Enable Required APIs
1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for and **Enable** these APIs:
   - **Gmail API**
   - **Google Calendar API**

### 1c. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **OAuth 2.0 Client IDs**
3. Application type: **Desktop application**
4. Name: `ProfessionalChatbot`
5. Click **Create**
6. Click **Download** (JSON file)

### 1d. Save the File
Download the JSON file, then save it as:
```
backend/credentials.json
```

**Full path:** `/Users/questonparker/Desktop/Projects/ProfessionalChatbot/backend/credentials.json`

---

## Step 2: Set Up Your .env File

### 2a. Copy the Template
```bash
cd /Users/questonparker/Desktop/Projects/ProfessionalChatbot/backend
cp .env.example .env
```

### 2b. Edit .env
Only these lines need changes (usually already correct):
```env
GOOGLE_CREDENTIALS_FILE=credentials.json
GOOGLE_TOKEN_FILE=token.json
OLLAMA_BASE_URL=http://localhost:11434
BACKEND_PORT=8000
```

**Most settings already have good defaults.**

---

## Step 3: Protect Your Credentials

### 3a. Add to .gitignore (IMPORTANT!)
```bash
cd backend
echo "credentials.json" >> .gitignore
echo "token.json" >> .gitignore
echo ".env" >> .gitignore
```

Verify:
```bash
cat .gitignore
```

Should show:
```
credentials.json
token.json
.env
```

---

## Step 4: First Run Authorization

### 4a. Install Google Libraries
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 4b. Start Backend
```bash
cd backend
python main.py
```

### 4c. Request an Email/Calendar Action
In the chatbot, ask:
```
"Send an email to test@example.com with subject 'Test' and body 'Hello'"
```

### 4d. Authorize in Browser
- A browser window will open
- Click **"Sign in to your Google Account"**
- Click **"Allow"** to grant permissions
- The token will be saved automatically

**After first auth, no more manual authorization needed!**

---

## 📁 File Structure After Setup

```
backend/
├── main.py
├── tools.py
├── credentials.json    ✅ (You added this)
├── token.json         ✅ (Auto-created after first auth)
├── .env               ✅ (You created from .env.example)
├── .env.example       📖 (Template - don't edit)
├── .gitignore         ✅ (Updated to protect credentials)
├── data/
│   └── professional_profile.txt
└── vector_db/
    └── (vector database files)
```

---

## 🔒 Security Checklist

- [ ] `credentials.json` is in `.gitignore`
- [ ] `token.json` is in `.gitignore`
- [ ] `.env` is in `.gitignore`
- [ ] Never push these files to GitHub
- [ ] Keep credentials.json safe locally

---

## Troubleshooting

### "credentials.json not found"
```bash
ls -la backend/credentials.json
```
Make sure file exists at that path.

### "Google credentials not found. Please set up OAuth"
The app looks for `credentials.json` in the `backend/` folder. Make sure it's there:
```bash
ls backend/credentials.json
```

### "Google API client not available"
Install the required packages:
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Browser doesn't open for authorization
Run this command to auth manually:
```bash
python -c "from tools import get_google_creds; get_google_creds()"
```

### Token expired or permissions changed
Delete the token and re-authorize:
```bash
cd backend
rm token.json
python main.py
# Request an email/calendar action to re-authorize
```

---

## What Gets Stored Where

| Item | Location | Auto-Generated | Commit to Git |
|------|----------|---|---|
| OAuth JSON | `backend/credentials.json` | No | ❌ NO |
| Access Token | `backend/token.json` | Yes | ❌ NO |
| Settings | `backend/.env` | No | ❌ NO |
| Scopes Config | `backend/tools.py` | N/A | ✅ YES |

---

## Quick Reference

### Check Everything is Set Up
```bash
ls backend/credentials.json
ls backend/.env
cat backend/.gitignore | grep -E "(credentials|token|.env)"
```

### Start Full Stack
```bash
# Terminal 1
ollama serve

# Terminal 2
cd backend && python main.py

# Terminal 3
cd backend && npm run dev
```

### Test Email Tool
```
User: "Send an email to your-email@gmail.com with subject 'Test' and body 'This is a test'"
Bot: "✅ Email sent to your-email@gmail.com"
```

---

## Support

**Setup Issue?** Check:
1. `credentials.json` exists: `ls backend/credentials.json`
2. Google libraries installed: `pip list | grep google`
3. APIs enabled in Google Cloud Console
4. OAuth consent screen configured

**Still having issues?** Reinstall Google libraries:
```bash
pip install --upgrade google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

**All set!** Your chatbot is now ready to send emails and schedule meetings securely. 🔐✉️📅
