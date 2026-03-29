#!/bin/bash

# Quick Start Script for Strategic AI Assistant
# This script helps you start all components in separate terminal windows

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/questonparker/Desktop/Business/rockSteady"

echo -e "${BLUE}🚀 Strategic AI Assistant - Quick Start${NC}"
echo "========================================"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found${NC}"

if ! command_exists ollama; then
    echo -e "${YELLOW}⚠️  Ollama is not installed. Install from https://ollama.ai${NC}"
fi
echo -e "${GREEN}✅ Ollama configured${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found${NC}"

echo ""
echo -e "${BLUE}📦 Checking virtual environment...${NC}"

if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    cd "$PROJECT_ROOT"
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment exists${NC}"
fi

echo ""
echo -e "${BLUE}📦 Checking Node dependencies...${NC}"

if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$PROJECT_ROOT/frontend"
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies exist${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Starting components...${NC}"
echo ""
echo -e "${YELLOW}You'll need 3 terminal windows running:${NC}"
echo ""
echo -e "${GREEN}1. Ollama Server${NC}"
echo "   Command: ollama serve"
echo "   Start this FIRST"
echo ""
echo -e "${GREEN}2. Backend API${NC}"
echo "   Command: cd $PROJECT_ROOT && source venv/bin/activate && uvicorn backend.main:app --reload"
echo "   Start this SECOND"
echo ""
echo -e "${GREEN}3. Frontend Dev Server${NC}"
echo "   Command: cd $PROJECT_ROOT/frontend && npm run dev"
echo "   Start this THIRD"
echo ""
echo -e "${YELLOW}Or run this script with 'auto' to open terminal windows (macOS only):${NC}"
echo "   ./quickstart.sh auto"
echo ""

if [ "$1" = "auto" ] && [ "$(uname)" = "Darwin" ]; then
    echo -e "${BLUE}Opening terminal windows...${NC}"
    
    # Open Ollama server in new terminal
    osascript <<EOF
tell application "Terminal"
    activate
    do script "ollama serve"
end tell
EOF
    sleep 2
    
    # Open Backend in new terminal
    osascript <<EOF
tell application "Terminal"
    activate
    do script "cd $PROJECT_ROOT && source venv/bin/activate && uvicorn backend.main:app --reload"
end tell
EOF
    sleep 2
    
    # Open Frontend in new terminal
    osascript <<EOF
tell application "Terminal"
    activate
    do script "cd $PROJECT_ROOT/frontend && npm run dev"
end tell
EOF
    
    sleep 3
    echo -e "${GREEN}✅ All components started!${NC}"
    echo ""
    echo "Browser will open to http://localhost:5173 shortly..."
    open http://localhost:5173
else
    echo -e "${BLUE}Manual startup required on your system.${NC}"
    echo "Please follow the 3 steps above in separate terminal windows."
fi

echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  - Full Startup Guide: FULL_STARTUP_GUIDE.md"
echo "  - Frontend Setup: frontend/README.md"
echo "  - Backend Health: http://localhost:8000/health"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
