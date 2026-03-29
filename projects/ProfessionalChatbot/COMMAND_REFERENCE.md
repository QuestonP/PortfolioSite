# Command Reference Card

## Quick Commands

### Start RAG Chatbot (No Tools - Works Now)
```bash
cd backend
python main.py
# Opens: http://localhost:8000
# Frontend: http://localhost:5173
```

### Start Full Stack
```bash
# Terminal 1: Ollama (if needed)
ollama serve

# Terminal 2: Backend
cd backend && python main.py

# Terminal 3: Frontend  
cd backend && npm run dev
```

### Test Chatbot
```bash
cd backend
python test_chatbot.py
```

### Install Optional Tools
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Check Python Syntax
```bash
cd backend && python3 -m py_compile main.py tools.py
```

---

## File Structure Reference

```
backend/
├── main.py                 # FastAPI server + agent logic
├── tools.py               # Email & calendar tools
├── test_chatbot.py        # Verification script
├── vector.py              # Vector DB helper
├── data/
│   └── professional_profile.txt
├── vector_db/             # Chroma vector database
├── src/
│   ├── components/
│   │   └── Chatbot.jsx    # Main chatbot component
│   ├── Chatbot.css        # Styling
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Environment Setup

### Python Virtual Environment
```bash
# Create
python3 -m venv .venv

# Activate
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Deactivate
deactivate
```

### Install Dependencies
```bash
# Core
pip install -r requirements.txt

# Optional tools
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

## API Endpoints

### GET /
Health check - returns server status

### POST /chat
Send message to chatbot
```json
{
  "question": "What's Quest's background?"
}
```

Response:
```json
{
  "answer": "...",
  "retrieved_docs": [...],
  "status": "success",
  "tool_used": false,
  "tool_result": null
}
```

---

## Debugging

### Check Ollama Status
```bash
ollama ls              # List models
ollama serve          # Start daemon
ollama pull gemma3:1b # Get model
```

### Check Python Imports
```bash
python3 -c "import main; import tools"
```

### Check Frontend Build
```bash
cd backend && npm install && npm run dev
```

### View Logs
```bash
# Backend logs (running terminal)
# Watch for: "Starting RAG API server"
# Watch for: "tool executed" messages

# Frontend logs (browser dev tools)
# F12 → Console tab
```

---

## Example Requests

### RAG Query
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What programming languages does Quest use?"}'
```

### Email Request (with tools)
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Send email to john@example.com about a meeting"}'
```

---

## Troubleshooting Commands

```bash
# Verify Ollama models
ollama ls

# Test Python imports
python3 -c "from tools import TOOLS; print(TOOLS.keys())"

# Check port availability
lsof -i :8000      # Backend port
lsof -i :5173      # Frontend port

# Clear cache
rm -rf .pytest_cache __pycache__ .venv

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

---

## Documentation Files

- **QUICK_START.md** - How to run the chatbot
- **AGENT_SETUP.md** - Google OAuth setup guide
- **INTEGRATION_SUMMARY.md** - What was changed
- **This file** - Command reference

---

## Key Points

✅ **RAG works immediately** - No setup needed
✅ **Tools are optional** - Install later if needed
✅ **Backward compatible** - All existing features work
✅ **Well documented** - Multiple guides provided
✅ **Error handling** - Helpful messages if issues

---

**Last Updated:** December 30, 2025
**Status:** Ready for testing 🚀
