"""FastAPI backend for Strategic Assistant Agent."""

import sys
from pathlib import Path
import asyncio
from typing import List, Optional
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.agent import StrategicAgent
from src.logger import setup_logger

logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Strategic Assistant API",
    description="Backend API for Strategic Assistant Agent",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent (global instance)
agent: Optional[StrategicAgent] = None


class Message(BaseModel):
    """Chat message model."""
    role: str
    content: str
    timestamp: datetime = None


class ChatRequest(BaseModel):
    """Chat request model."""
    query: str
    goal: Optional[str] = None
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    """Chat response model."""
    response: str
    status: str
    timestamp: datetime
    tool_used: Optional[str] = None


class ToolRequest(BaseModel):
    """Tool execution request."""
    tool_name: str
    parameters: dict


class ToolResponse(BaseModel):
    """Tool execution response."""
    status: str
    result: dict
    timestamp: datetime


class AgentStatus(BaseModel):
    """Agent status model."""
    healthy: bool
    model: str
    state: str
    memory_usage: dict
    available_tools: int


# WebSocket connection manager
class ConnectionManager:
    """Manage WebSocket connections."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")


manager = ConnectionManager()


# ==================== Startup/Shutdown ====================

@app.on_event("startup")
async def startup_event():
    """Initialize agent on startup."""
    global agent
    try:
        agent = StrategicAgent()
        if agent.health_check():
            logger.info("Agent initialized and healthy")
        else:
            logger.warning("Agent initialized but health check failed")
    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    global agent
    if agent:
        agent.clear_memory()
        logger.info("Agent cleaned up")


# ==================== REST Endpoints ====================

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Strategic Assistant API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    return {
        "status": "healthy" if agent.health_check() else "unhealthy",
        "agent_state": agent.state.value,
        "timestamp": datetime.now()
    }


@app.get("/status", response_model=AgentStatus)
async def get_status():
    """Get agent status."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    status = agent.get_status()
    return AgentStatus(
        healthy=status["healthy"],
        model=status["model"],
        state=status["state"],
        memory_usage=status["memory"],
        available_tools=len(agent.tools.tools)
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a chat message to the agent."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    try:
        # Add context if provided
        if request.goal:
            agent.set_strategic_goal(request.goal)
        
        if request.context:
            for key, value in request.context.items():
                agent.add_context(key, value)
        
        # Process query
        response = agent.think(request.query)
        
        return ChatResponse(
            response=response,
            status="success",
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tools")
async def list_tools():
    """List available tools."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    tools = []
    for tool_name, tool in agent.tools.tools.items():
        tools.append({
            "name": tool_name,
            "description": tool.description,
            "parameters": tool.parameters
        })
    
    return {"tools": tools, "count": len(tools)}


@app.post("/tool", response_model=ToolResponse)
async def execute_tool(request: ToolRequest):
    """Execute a tool."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    try:
        result = agent.use_tool(request.tool_name, **request.parameters)
        
        return ToolResponse(
            status="success",
            result={"output": result},
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Tool execution error: {e}")
        return ToolResponse(
            status="error",
            result={"error": str(e)},
            timestamp=datetime.now()
        )


@app.get("/history")
async def get_history():
    """Get conversation history."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    history = agent.get_conversation_history()
    return {"history": history, "count": len(history)}


@app.post("/clear")
async def clear_memory():
    """Clear agent memory."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    agent.clear_memory()
    return {"status": "memory cleared"}


@app.post("/goal")
async def set_goal(goal: str, priority: int = 1):
    """Set a strategic goal."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    agent.set_strategic_goal(goal, priority)
    return {"status": "goal set", "goal": goal, "priority": priority}


@app.post("/context")
async def add_context(key: str, value: str):
    """Add context information."""
    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    agent.add_context(key, value)
    return {"status": "context added", "key": key, "value": value}


# ==================== WebSocket Endpoint ====================

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time chat."""
    await manager.connect(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "message":
                query = data.get("query", "")
                
                # Send typing indicator
                await websocket.send_json({
                    "type": "typing",
                    "timestamp": datetime.now().isoformat()
                })
                
                try:
                    # Process query
                    response = agent.think(query)
                    
                    # Send response
                    await websocket.send_json({
                        "type": "response",
                        "content": response,
                        "timestamp": datetime.now().isoformat()
                    })
                except Exception as e:
                    await websocket.send_json({
                        "type": "error",
                        "content": str(e),
                        "timestamp": datetime.now().isoformat()
                    })
            
            elif data.get("type") == "tool":
                tool_name = data.get("tool_name", "")
                params = data.get("parameters", {})
                
                try:
                    result = agent.use_tool(tool_name, **params)
                    
                    await websocket.send_json({
                        "type": "tool_result",
                        "tool": tool_name,
                        "result": result,
                        "timestamp": datetime.now().isoformat()
                    })
                except Exception as e:
                    await websocket.send_json({
                        "type": "error",
                        "content": f"Tool error: {str(e)}",
                        "timestamp": datetime.now().isoformat()
                    })
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
