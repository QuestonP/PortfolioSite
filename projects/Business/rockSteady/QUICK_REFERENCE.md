# Quick Reference Card

One-page cheat sheet for the Strategic AI Assistant system.

## 🚀 Startup (3 Steps)

```bash
# Terminal 1: Ollama Server
ollama serve

# Terminal 2: Backend API
source venv/bin/activate
uvicorn backend.main:app --reload

# Terminal 3: Frontend
cd frontend && npm run dev
```

**Then open**: http://localhost:5173

## 🗂️ Key Directories

```
src/              → Agent logic, tools, memory
backend/          → FastAPI server
frontend/         → React UI
config/           → Settings, credentials
data/             → Calendar, Excel files
logs/             → Application logs
venv/             → Python packages
```

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Activate venv | `source venv/bin/activate` |
| Install Python deps | `pip install -r requirements.txt` |
| Start backend | `uvicorn backend.main:app --reload` |
| Start Ollama | `ollama serve` |
| Install Node deps | `cd frontend && npm install` |
| Start frontend | `npm run dev` |
| Pull model | `ollama pull mistral` |
| List models | `ollama list` |
| Build frontend | `cd frontend && npm run build` |
| View logs | `tail -f logs/agent.log` |

## 📊 Ports

| Service | Port | URL |
|---------|------|-----|
| Ollama | 11434 | http://localhost:11434 |
| Backend API | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/docs |
| Frontend | 5173 | http://localhost:5173 |
| WebSocket | 8000 | ws://localhost:8000/ws/chat |

## 🧠 9 Built-in Tools

1. **web_search** - Search internet
2. **schedule_calendar** - Add calendar events
3. **list_calendar_events** - View events
4. **read_excel** - Read spreadsheets
5. **write_excel** - Create/modify Excel
6. **read_google_doc** - Read Google Docs
7. **write_google_doc** - Write Google Docs
8. **read_file** - Read local files
9. **write_file** - Write local files

## 🎨 Color Codes

```
Background:  #0a0e27  (Deep blue-black)
Surface:     #151b3f  (Main surfaces)
Alt Surface: #1a2047  (Cards/buttons)
Border:      #2a3255  (Dividers)
Text:        #e0e6ff  (Main text)
Muted:       #8b92b8  (Secondary text)
Accent:      #6366f1  (Interactive)
Hover:       #818cf8  (Bright accent)
```

## 📝 Environment Variables

```bash
# Core
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral

# Optional APIs
SERPAPI_KEY=your-key              # Web search
GOOGLE_SEARCH_API_KEY=your-key    # Google search
GOOGLE_CALENDAR_ID=your@gmail.com # Calendar

# Server
API_HOST=0.0.0.0
API_PORT=8000
```

## 🔗 API Endpoints

### REST API
```
GET  /health          - Health check
GET  /status          - Agent status
POST /chat            - Send message
GET  /tools           - List tools
POST /tool            - Execute tool
GET  /history         - Message history
POST /clear           - Clear memory
POST /goal            - Set goal
POST /context         - Add context
```

### WebSocket
```
WS   /ws/chat         - Real-time streaming
```

## 🐛 Troubleshooting Checklist

- [ ] Ollama running? (`ollama serve`)
- [ ] Model loaded? (`ollama list`)
- [ ] Backend running? (http://localhost:8000/health)
- [ ] Frontend running? (http://localhost:5173)
- [ ] Python venv activated?
- [ ] Node dependencies installed? (`npm list`)
- [ ] Python dependencies installed? (`pip list`)
- [ ] .env file configured?
- [ ] Port conflicts? (use `lsof -i :PORT`)
- [ ] Check logs? (`cat logs/agent.log`)

## 📁 Config Files

| File | Purpose |
|------|---------|
| `.env` | Runtime configuration |
| `.env.example` | Config template |
| `config/settings.py` | Default settings |
| `config/credentials.py` | API key loading |
| `frontend/vite.config.ts` | Build config |
| `frontend/tailwind.config.ts` | Styling config |
| `requirements.txt` | Python packages |
| `frontend/package.json` | Node packages |

## 🏗️ Architecture Stack

```
Frontend:     React 18 + TypeScript + Tailwind + Framer Motion
Backend:      FastAPI + Uvicorn
Agent:        Python + Ollama
LLM:          Mistral 7B (4.5GB)
State:        Zustand (frontend), Python objects (backend)
Database:     Local JSON + optional SQLite
```

## 📚 Key Files

```
main.py                    → CLI entry point
src/agent.py              → Agent logic
src/tools.py              → Tool implementations
backend/main.py           → FastAPI server
frontend/src/App.tsx      → React root
config/settings.py        → Configuration
requirements.txt          → Python deps
frontend/package.json     → Node deps
```

## 🔍 File Search

```bash
# Find Python files
find . -name "*.py" -type f

# Find React components
find frontend/src -name "*.tsx" -type f

# Search for text
grep -r "search_term" src/

# Search in logs
grep "ERROR" logs/agent.log
```

## 🎯 Typical Workflow

1. **Start Services**: Run 3 startup commands
2. **Open UI**: Navigate to http://localhost:5173
3. **Type Query**: Ask agent a question
4. **View Response**: See real-time response
5. **Use Tools**: Click tool panel to execute
6. **Check Status**: Monitor agent health
7. **Review Logs**: Check `logs/agent.log`

## 💡 Pro Tips

- Use `uvicorn --reload` for auto-restart
- Use `npm run dev` for hot-reload
- Check `http://localhost:8000/docs` for API docs
- Use browser DevTools for UI debugging
- Monitor resource usage with `top` or Activity Monitor
- Save chat context for long sessions
- Use `.env` for local overrides
- Check logs before reporting issues

## ⚡ Performance

| Metric | Value |
|--------|-------|
| First response | 5-10 seconds |
| Subsequent responses | 1-3 seconds |
| Memory usage | ~5GB |
| Max concurrent users | 5 |
| Bundle size | ~180KB (gzipped) |
| WebSocket latency | <100ms |

## 🚨 Common Errors

| Error | Fix |
|-------|-----|
| "Cannot connect to API" | Check backend running at :8000 |
| "Model not found" | Run `ollama pull mistral` |
| "venv not found" | Run `python3 -m venv venv` |
| "Module not found" | Run `pip install -r requirements.txt` |
| "Cannot find npm" | Install Node.js from nodejs.org |
| "Port already in use" | Change port in config or kill process |

## 📖 Quick Doc Links

- **Getting Started**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Full Startup**: [FULL_STARTUP_GUIDE.md](FULL_STARTUP_GUIDE.md)
- **Tools Guide**: [TOOLS_GUIDE.md](TOOLS_GUIDE.md)
- **Credentials**: [config/CREDENTIALS_SETUP.md](config/CREDENTIALS_SETUP.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **System Summary**: [SYSTEM_SUMMARY.md](SYSTEM_SUMMARY.md)
- **UI Design**: [frontend/UI_GUIDE.md](frontend/UI_GUIDE.md)

## 🌐 External Resources

- Ollama: https://ollama.ai
- FastAPI: https://fastapi.tiangolo.com
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev

## ✅ Verification Checklist

```bash
# Check Ollama
curl http://localhost:11434/api/tags

# Check Backend
curl http://localhost:8000/health

# Check Frontend
curl http://localhost:5173

# Check Python env
python --version
pip list | grep ollama

# Check Node env
node --version
npm --version
```

## 🎓 Learning Resources

Start with: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

Then read by role:
- **End User**: README.md → FULL_STARTUP_GUIDE.md → TOOLS_GUIDE.md
- **Developer**: PROJECT_STRUCTURE.md → frontend/README.md → src/agent.py
- **DevOps**: FULL_STARTUP_GUIDE.md → deployment sections
- **Designer**: frontend/UI_GUIDE.md → frontend/README.md

---

**Print this page for quick reference!**

Last updated: January 2024 | Version: 1.0
