# Project Structure Overview

Complete directory layout and file descriptions for the Strategic AI Assistant system.

## Root Directory Structure

```
rockSteady/
├── src/                              # Core Python agent modules
│   ├── __init__.py
│   ├── agent.py                     # Main StrategicAgent class
│   ├── ollama_client.py             # Ollama API wrapper
│   ├── memory.py                    # Conversation & Strategy memory
│   ├── tools.py                     # Tool implementations
│   └── logger.py                    # Logging configuration
│
├── backend/                          # FastAPI web server
│   ├── __init__.py
│   └── main.py                      # FastAPI application & endpoints
│
├── frontend/                         # React web application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ChatInterface.tsx    # Main chat UI
│   │   │   ├── ChatMessage.tsx      # Message bubble component
│   │   │   └── ToolPanel.tsx        # Tool execution panel
│   │   ├── store/                   # State management
│   │   │   └── agentStore.ts        # Zustand store
│   │   ├── App.tsx                  # Root React component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Tailwind directives
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies
│   ├── package-lock.json            # Dependency lock file
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tsconfig.node.json           # TypeScript config for Node
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore                   # Git ignore rules
│   ├── README.md                    # Frontend documentation
│   ├── UI_GUIDE.md                  # UI/UX design guidelines
│   └── setup.sh                     # Frontend setup script
│
├── config/                          # Configuration files
│   ├── __init__.py
│   ├── settings.py                  # Pydantic settings & config
│   ├── credentials.py               # API credential management
│   ├── CREDENTIALS_SETUP.md         # Credential setup guide
│   └── google-service-account.json  # Google OAuth service account (not in git)
│
├── data/                            # Data storage
│   ├── calendar.json                # Local calendar events
│   ├── .gitkeep                     # Ensure directory exists in git
│   └── *.xlsx                       # User Excel files
│
├── logs/                            # Application logs
│   ├── agent.log                    # Agent activity log
│   └── .gitkeep                     # Ensure directory exists in git
│
├── venv/                            # Python virtual environment (not in git)
│   └── [Python packages]
│
├── main.py                          # CLI entry point
├── requirements.txt                 # Python dependencies
├── .env                             # Environment variables (not in git)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
├── SETUP_GUIDE.md                   # Initial setup instructions
├── INSTALL_MISTRAL.md               # Model installation guide
├── TOOLS_GUIDE.md                   # Tool usage documentation
├── FULL_STARTUP_GUIDE.md            # Complete startup instructions
└── quickstart.sh                    # Quick start script

```

## Detailed File Descriptions

### Core Agent (`src/`)

#### `agent.py`
Main Strategic Agent class with:
- `think(query)` - Process queries and return responses
- `use_tool(name, **kwargs)` - Execute available tools
- `health_check()` - Verify agent functionality
- Memory management (conversation + strategy)
- System prompt integration

**Key Classes**: `StrategicAgent`, `ThinkRequest`

#### `ollama_client.py`
Wrapper for Ollama API with:
- `generate(prompt, system)` - Simple text generation
- `chat(messages, system)` - Chat endpoint
- `health_check()` - Server health check
- `list_models()` - Available models
- Configurable temperature, top_p, and timeouts

**Key Classes**: `OllamaClient`, `ChatMessage`

#### `memory.py`
Memory management with:
- `ConversationMemory` - Last N messages with token windowing
- `StrategyMemory` - Goals, context, and decisions
- Serialization for persistence

**Key Classes**: `ConversationMemory`, `StrategyMemory`, `Goal`

#### `tools.py`
Tool implementations:
1. `web_search` - DuckDuckGo, SerpAPI, Google Search (with fallback)
2. `schedule_calendar` - Google Calendar or local JSON
3. `list_calendar_events` - View upcoming events
4. `read_excel` - pandas-based Excel reading
5. `write_excel` - pandas/openpyxl Excel writing
6. `read_google_doc` - Google Docs API
7. `write_google_doc` - Google Docs append/replace
8. `read_file` - Local file reading
9. `write_file` - Local file writing

**Key Classes**: `ToolKit`, `Tool`, `ToolResult`

#### `logger.py`
Logging configuration with:
- Console and file handlers
- Configurable log levels
- Structured logging format

**Key Functions**: `get_logger(name)`

### Backend (`backend/`)

#### `main.py`
FastAPI application with:
- Startup/shutdown events for agent lifecycle
- REST endpoints: `/health`, `/status`, `/chat`, `/tools`, `/history`
- WebSocket endpoint: `/ws/chat`
- CORS middleware
- Pydantic models for validation
- ConnectionManager for WebSocket broadcasts

**Key Classes**: `Message`, `ChatRequest`, `ChatResponse`, `ConnectionManager`

### Frontend (`frontend/`)

#### Components
- **`ChatInterface.tsx`** - Main container with sidebar, header, messages, input
- **`ChatMessage.tsx`** - Individual message bubble with animations
- **`ToolPanel.tsx`** - Expandable tool listing with execution

#### Store
- **`agentStore.ts`** - Zustand store for agent state, status, error handling

#### Configuration
- **`vite.config.ts`** - Dev server, API proxy, build settings
- **`tailwind.config.ts`** - Dark theme colors and animations
- **`tsconfig.json`** - TypeScript compilation settings
- **`postcss.config.js`** - Tailwind CSS pipeline

#### Styles
- **`index.css`** - Tailwind directives, global styles, scrollbar customization

### Configuration (`config/`)

#### `settings.py`
Pydantic BaseSettings with:
- `OllamaSettings` - Model configuration
- `AgentSettings` - Agent behavior tuning
- `LoggingSettings` - Log configuration
- Loads from `.env` file with defaults

#### `credentials.py`
Credential management with:
- `load_credentials()` - From environment/files
- `has_google_credentials()` - Check Google API setup
- `has_serpapi_key()` - Check SerpAPI availability
- Service account loader for Google APIs
- Fallback detection for unavailable services

### Data (`data/`)

#### `calendar.json`
Local calendar storage format:
```json
{
  "events": [
    {
      "id": "unique-id",
      "title": "Event Name",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "duration": 60,
      "description": "Optional description"
    }
  ]
}
```

#### Excel Files
User-created `.xlsx` files stored here, readable/writable by the `read_excel` and `write_excel` tools.

### Logs (`logs/`)

#### `agent.log`
Structured logs with:
- Timestamp
- Log level (DEBUG, INFO, WARNING, ERROR)
- Logger name
- Message content

Example:
```
2024-01-15 10:30:45 - agent - INFO - Agent initialized with model: mistral
2024-01-15 10:30:46 - agent - INFO - Executing tool: web_search
```

### Root Files

#### `main.py`
CLI entry point with:
- Interactive prompt loop
- Agent initialization
- Tool commands
- Memory management

#### `requirements.txt`
Python package dependencies:
```
ollama>=0.6.1
pydantic>=2.9
pydantic-settings>=2.2
fastapi>=0.104.0
uvicorn>=0.24.0
requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.1.0
openpyxl>=3.1.0
google-auth>=2.25.0
google-api-python-client>=2.100.0
```

#### `.env` and `.env.example`
Environment variables for:
- Ollama configuration
- API credentials
- Feature flags
- Server settings

## File Relationships

```
User Input
   ↓
main.py (CLI) or frontend/ (Web UI)
   ↓
backend/main.py (FastAPI)
   ↓
src/agent.py (StrategicAgent)
   ↓
├→ src/ollama_client.py (LLM communication)
├→ src/memory.py (State management)
└→ src/tools.py (Tool execution)
   ├→ Web search (3 APIs with fallback)
   ├→ Calendar (Google API + JSON fallback)
   ├→ Excel operations (pandas)
   ├→ Google Docs (Google API)
   └→ File operations (local filesystem)
   ↓
Response back to frontend/CLI
```

## Development Workflow

1. **Backend Development**
   - Edit `src/agent.py` or `src/tools.py`
   - Restart `uvicorn backend.main:app --reload`
   - Test via API docs: `http://localhost:8000/docs`

2. **Frontend Development**
   - Edit components in `frontend/src/components/`
   - Hot reload with `npm run dev`
   - Test in browser at `http://localhost:5173`

3. **Agent Configuration**
   - Modify `config/settings.py` for defaults
   - Update `.env` for runtime overrides
   - Changes require backend restart

4. **Credential Management**
   - Add API keys to `.env`
   - Update `config/credentials.py` checker functions
   - Test with tool execution

## Key Technologies

| Layer | Technology | Files |
|-------|-----------|-------|
| **UI** | React 18 + TypeScript | `frontend/src/**` |
| **Styling** | Tailwind CSS + Framer Motion | `frontend/src/index.css`, `frontend/tailwind.config.ts` |
| **State** | Zustand | `frontend/src/store/agentStore.ts` |
| **Build** | Vite | `frontend/vite.config.ts` |
| **API** | FastAPI | `backend/main.py` |
| **Agent** | Python | `src/agent.py`, `src/tools.py` |
| **LLM** | Ollama + Mistral | `src/ollama_client.py` |
| **Config** | Pydantic | `config/settings.py` |
| **Database** | None (local JSON) | `data/calendar.json` |

## Build & Deploy

### Development
```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
source venv/bin/activate
uvicorn backend.main:app --reload

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Deploy backend
gunicorn -w 2 backend.main:app

# Deploy frontend (static hosting)
# Copy frontend/dist/* to web server
```

## Git Structure

```
.gitignore excludes:
- venv/
- node_modules/
- dist/
- .env
- logs/*.log
- __pycache__/
- .DS_Store
- *.pyc
```

Tracked in git:
- All source code
- Configuration templates (.env.example)
- Documentation
- Package specifications (requirements.txt, package.json)
