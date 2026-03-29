# Complete Startup Guide

This guide explains how to run the entire Strategic AI Assistant system with the backend agent and frontend UI.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  React Frontend (Port 5173)                 │
│  - Chat Interface                           │
│  - Tool Panel                               │
│  - Agent Status                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ REST API + WebSocket
                   │ (http://localhost:8000)
                   ▼
┌─────────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)                │
│  - Chat Endpoint                            │
│  - Tool Execution                           │
│  - Agent State Management                   │
└──────────────────┬──────────────────────────┘
                   │
                   │ Python API
                   ▼
┌─────────────────────────────────────────────┐
│  Strategic Agent (Python)                   │
│  - Memory Management                        │
│  - Tool Orchestration                       │
│  - LLM Integration                          │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP Client
                   ▼
┌─────────────────────────────────────────────┐
│  Ollama Server (Port 11434)                 │
│  - Mistral 7B Model                         │
│  - Generation/Chat API                      │
└─────────────────────────────────────────────┘
```

## Prerequisites

### System Requirements
- macOS 10.15+ or Linux
- 8GB RAM minimum (for Mistral 7B model)
- 10GB free disk space (model + dependencies)
- Stable internet connection

### Software Requirements
1. **Python 3.9+** - Backend runtime
2. **Node.js 16+** - Frontend build
3. **Ollama** - LLM server
4. **Git** (optional) - Version control

## Installation

### Step 1: Set Up Python Virtual Environment

```bash
# Navigate to project root
cd /Users/questonparker/Desktop/Business/rockSteady

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
.\venv\Scripts\activate  # Windows
```

### Step 2: Install Python Dependencies

```bash
# Make sure venv is activated
pip install -r requirements.txt

# Verify installations
pip list | grep ollama
```

Expected output should show `ollama>=0.6.1` and `pandas`, `google-auth`, etc.

### Step 3: Install Ollama

```bash
# macOS (using Homebrew)
brew install ollama

# Or download from https://ollama.ai
# Then start Ollama server in Terminal 1
ollama serve
```

### Step 4: Pull Mistral Model

In a new terminal:

```bash
# Activate Python environment
source venv/bin/activate

# Pull Mistral model (2-5 minutes)
ollama pull mistral

# Verify model is loaded
ollama list
```

Expected output:
```
NAME            ID              SIZE      MODIFIED
mistral:latest  c15cbfa...      4.1GB     5 minutes ago
```

### Step 5: Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manually
npm install
```

### Step 6: Configure Credentials (Optional)

For enhanced functionality, create `.env` file in project root:

```bash
# Copy example credentials
cp .env.example .env

# Edit with your API keys
nano .env
```

See [CREDENTIALS_SETUP.md](../config/CREDENTIALS_SETUP.md) for detailed instructions.

## Running the System

You'll need **3 terminal windows** running simultaneously:

### Terminal 1: Ollama Server

```bash
ollama serve
```

Expected output:
```
time=2024-01-15T10:30:45.123Z level=INFO msg="Listening on" address=127.0.0.1:11434
```

**Do not close this terminal.** This runs the local LLM server.

### Terminal 2: Backend API

```bash
# Navigate to project root
cd /Users/questonparker/Desktop/Business/rockSteady

# Activate virtual environment
source venv/bin/activate

# Start backend API
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process [12345]
```

**Keep this terminal running.** This serves the agent as an API.

### Terminal 3: Frontend Development Server

```bash
# Navigate to frontend
cd /Users/questonparker/Desktop/Business/rockSteady/frontend

# Start development server
npm run dev
```

Expected output:
```
  VITE v4.5.0  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Accessing the Application

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Chat Interface**: You should see the Strategic AI assistant with:
   - Chat history on left
   - Input field at bottom
   - Tool panel on right (toggle with tool icon)
   - Agent status in top right

## Testing the System

### Quick Health Check

1. Open browser console (F12)
2. You should see no errors
3. Agent status should show "Ready" in green

### Test Chat

1. Type: "What is strategic planning?"
2. Press Enter
3. Wait for response (may take 5-10 seconds on first request)

### Test Tools

1. Click the tool icon (wrench) in header
2. Expand "Web Search" tool
3. Click "Execute" (this requires credentials in `.env`)

## Common Issues

### Issue 1: "Cannot connect to API"
```
Solution:
1. Ensure Terminal 2 (backend) is running
2. Check http://localhost:8000/health in browser
3. Verify CORS is enabled in backend
```

### Issue 2: "Ollama server is not running"
```
Solution:
1. Start Terminal 1 with: ollama serve
2. Verify: http://localhost:11434 in browser
3. Check Ollama is installed: which ollama
```

### Issue 3: "Model not found"
```
Solution:
1. Pull model: ollama pull mistral
2. Wait for download to complete (4-5GB)
3. Restart backend API
```

### Issue 4: "venv not found"
```
Solution:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue 5: "npm dependencies missing"
```
Solution:
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Production Deployment

### Backend Deployment

```bash
# Generate production build
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 2

# Or with Gunicorn
gunicorn -w 2 -b 0.0.0.0:8000 backend.main:app
```

### Frontend Deployment

```bash
# Build optimized bundle
cd frontend
npm run build

# Deploy 'dist' folder to static hosting
# (GitHub Pages, Netlify, Vercel, AWS S3, etc.)
```

## Performance Tips

1. **Memory**: Monitor with `top` or Activity Monitor
2. **Latency**: First request takes longer (model loading)
3. **Concurrent Requests**: Keep below 5 simultaneous chats
4. **Model Size**: Mistral uses ~4.5GB RAM, consider mistral:lite for 2GB

## Monitoring

### Check Backend Health

```bash
curl http://localhost:8000/health
```

### View Agent Status

```bash
curl http://localhost:8000/status
```

### Monitor Resource Usage

```bash
# macOS
top -o MEM

# Linux
htop
```

## Stopping the System

To shut down cleanly:

1. **Stop Frontend**: Press `Ctrl+C` in Terminal 3
2. **Stop Backend**: Press `Ctrl+C` in Terminal 2
3. **Stop Ollama**: Press `Ctrl+C` in Terminal 1

## Next Steps

1. **Customize Agent**: Edit `src/agent.py` to modify behavior
2. **Add Tools**: Create new tools in `src/tools.py`
3. **Tune Model**: Adjust temperature/top_p in `config/settings.py`
4. **Deploy**: Follow production deployment instructions above

## Getting Help

Useful resources:
- Backend API docs: http://localhost:8000/docs
- Ollama docs: https://ollama.ai
- Vite docs: https://vitejs.dev
- React docs: https://react.dev

## System Architecture Files

- **Backend**: `backend/main.py`
- **Agent**: `src/agent.py`, `src/ollama_client.py`
- **Tools**: `src/tools.py`
- **Frontend**: `frontend/src/App.tsx`
- **Configuration**: `config/settings.py`, `config/credentials.py`

Enjoy using Strategic AI Assistant! 🚀
