# Quick Reference: Running Your Chatbot

## Start Everything (Basic RAG - No Tools)

```bash
# Terminal 1: Start Ollama (if not running)
ollama serve

# Terminal 2: Start Python backend (from backend/ folder)
cd backend
python main.py

# Terminal 3: Start frontend (from backend/ folder)
npm run dev
```

Then open: **http://localhost:5173**

### Test it works:
- Ask: "What is Quest Parker's background?"
- Should see answer with sources ✅

---

## Optional: Enable Email & Calendar Tools

### 1️⃣ Install Google libraries
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 2️⃣ Get Google OAuth credentials
- Go to https://console.cloud.google.com/
- Create new project → Enable Gmail & Calendar APIs
- Create OAuth 2.0 Desktop credentials → Download JSON
- Save as: `backend/credentials.json`

### 3️⃣ First run
```bash
cd backend
python main.py
```
- First tool request will open browser to authorize
- Subsequent requests work automatically
- Token saved to `backend/token.json`

### 4️⃣ Test tools
Try asking:
```
"Send an email to john@example.com with subject 'Hello' and body 'How are you?'"
```

Should see: ✅ Email sent to john@example.com

---

## File Changes Made

| File | Change | Impact |
|------|--------|--------|
| `backend/main.py` | Agent loop added | Can execute tools |
| `backend/tools.py` | NEW | Email & calendar API wrapper |
| `backend/test_chatbot.py` | NEW | Verification script |
| `backend/src/components/Chatbot.jsx` | Display tool results | Shows actions |
| `backend/src/Chatbot.css` | Tool styling | Green action cards |
| `AGENT_SETUP.md` | NEW | Detailed OAuth setup |
| `INTEGRATION_SUMMARY.md` | NEW | This integration doc |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| ModuleNotFoundError: No module named 'tools' | Move `tools.py` to `backend/` folder |
| "Google API client not available" | Run: `pip install google-auth-oauthlib` |
| "No relevant info found" | Ensure `backend/data/professional_profile.txt` exists |
| Chatbot not responding | Check Ollama is running: `ollama serve` |
| Frontend not loading | Run `npm run dev` in `backend/` folder |
| Tool not executing | Missing `credentials.json` or OAuth not authorized |

---

## Key Features

✅ **RAG System** - Answers about Quest Parker using vector DB
✅ **Email Tool** - Send emails via Gmail API (optional)
✅ **Calendar Tool** - Schedule meetings (optional)
✅ **Graceful Fallback** - Works without tools (core RAG always works)
✅ **One-click Setup** - Google OAuth happens automatically on first request

---

## Architecture

```
User Query
    ↓
Frontend (Chatbot.jsx)
    ↓
FastAPI Backend (main.py)
    ↓
Agent Loop:
  1. Get RAG context (vector_db)
  2. Call LLM with prompt
  3. Check for tool JSON
  4. Execute tool if found
  5. Return result to frontend
    ↓
Display in Chat
```

---

## Example Conversations

### Example 1: RAG Query (Always works)
```
You: What's Quest's current role?

Bot: Quest Parker is a Value Engineer on the Applied AI Team 
at Celonis... (with sources)
```

### Example 2: Email Tool (Requires setup)
```
You: Send email to jane@example.com about a meeting

Bot: ✅ Email sent to jane@example.com with subject 'About a meeting'
```

### Example 3: Calendar Tool (Requires setup)
```
You: Schedule a meeting with john@example.com on Jan 15 at 2pm

Bot: ✅ Meeting 'Meeting with john@example.com' scheduled 
on 2025-01-15 at 14:00
```

---

## Support

- **RAG Issues**: Check `vector_db/` folder exists
- **Ollama Issues**: Run `ollama pull gemma3:1b`
- **Tool Issues**: See AGENT_SETUP.md for OAuth help
- **Frontend Issues**: Run `npm install` in `backend/`

---

**All functionality is backward compatible. Existing RAG features work unchanged!** 🚀
