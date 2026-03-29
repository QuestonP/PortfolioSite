"""Strategic Assistant Agent implementation."""

import sys
from pathlib import Path
from typing import Optional, Dict, List, Any
from enum import Enum

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.ollama_client import OllamaClient
from src.memory import ConversationMemory, StrategyMemory
from src.tools import ToolKit
from src.logger import setup_logger
from config.settings import settings

logger = setup_logger(__name__)


class AgentState(Enum):
    """Agent operational states."""
    IDLE = "idle"
    THINKING = "thinking"
    RESPONDING = "responding"
    ERROR = "error"


class StrategicAgent:
    """Strategic Assistant Agent powered by Ollama."""
    
    # System prompt for strategic reasoning
    SYSTEM_PROMPT = """You are a Strategic Assistant - an intelligent agent designed to help with complex strategic thinking, planning, and decision-making.

Your capabilities:
- Analyze complex problems from multiple perspectives
- Break down strategic challenges into actionable steps
- Consider trade-offs and long-term implications
- Provide structured, reasoned advice
- Adapt to different strategic contexts and domains
- Use available tools to enhance analysis and execution

{tools_description}

When responding:
1. Start with a clear assessment of the situation
2. Use tools when they would add value (web search, calendar, file operations)
3. Identify key strategic considerations
4. Present options with trade-offs
5. Recommend a course of action with reasoning
6. Suggest metrics for success
7. Offer to execute actions using available tools

Be concise but thorough. Prioritize clarity and actionability."""
    
    def __init__(self, model: Optional[str] = None, base_url: Optional[str] = None):
        """Initialize the Strategic Agent.
        
        Args:
            model: Ollama model to use
            base_url: Ollama server URL
        """
        self.client = OllamaClient(base_url=base_url, model=model)
        self.conversation_memory = ConversationMemory(max_messages=20)
        self.strategy_memory = StrategyMemory()
        self.tools = ToolKit()
        self.state = AgentState.IDLE
        self.iteration_count = 0
        
        logger.info("Strategic Agent initialized")
    
    def health_check(self) -> bool:
        """Check if agent and Ollama are healthy.
        
        Returns:
            True if healthy, False otherwise
        """
        is_healthy = self.client.health_check()
        if is_healthy:
            models = self.client.list_models()
            model_names = [m.get("name", "") for m in models]
            
            # Check if model exists (with or without :latest tag)
            model_base = self.client.model.split(":")[0]  # Get base model name
            model_found = any(
                m.startswith(model_base) for m in model_names
            )
            
            if model_found:
                logger.info(f"Agent ready with model: {self.client.model}")
                return True
            else:
                logger.error(f"Model {self.client.model} not found in Ollama")
                logger.info(f"Available models: {', '.join(model_names)}")
                return False
        return False
    
    def set_strategic_goal(self, goal: str, priority: int = 1) -> None:
        """Set a strategic goal for the agent.
        
        Args:
            goal: Goal description
            priority: Priority level (1-5)
        """
        self.strategy_memory.set_strategic_goal(goal, priority)
    
    def add_context(self, key: str, value: Any) -> None:
        """Add contextual information.
        
        Args:
            key: Context key
            value: Context value
        """
        self.strategy_memory.add_context(key, value)
    
    def use_tool(self, tool_name: str, **kwargs) -> str:
        """Use an available tool.
        
        Args:
            tool_name: Name of tool to use
            **kwargs: Tool parameters
        
        Returns:
            Tool result as string
        """
        logger.info(f"Using tool: {tool_name}")
        return self.tools.execute_tool(tool_name, **kwargs)
    
    def think(self, query: str, max_iterations: Optional[int] = None) -> str:
        """Process a query with strategic reasoning.
        
        Args:
            query: The query or problem to think about
            max_iterations: Maximum iterations (defaults to config)
        
        Returns:
            Reasoning and response
        """
        if not self.health_check():
            logger.error("Agent health check failed")
            return "Error: Cannot connect to Ollama server. Ensure it's running."
        
        max_iterations = max_iterations or settings.agent.max_iterations
        self.state = AgentState.THINKING
        self.iteration_count = 0
        
        try:
            # Add context to query
            enhanced_query = self._enhance_query(query)
            
            # Add user message to memory
            self.conversation_memory.add_message("user", query)
            
            # Get context window for model
            context_messages = self.conversation_memory.get_context_window(
                settings.agent.context_window
            )
            
            # Format system prompt with tools
            system_prompt = self.SYSTEM_PROMPT.format(
                tools_description=self.tools.get_tools_description()
            )
            
            # Generate response
            response = self.client.chat(
                messages=context_messages + [{"role": "user", "content": enhanced_query}],
                system=system_prompt,
                temperature=settings.ollama.temperature
            )
            
            # Store response
            if response:
                self.conversation_memory.add_message("assistant", response)
                self.state = AgentState.RESPONDING
                logger.info("Agent response generated successfully")
            else:
                self.state = AgentState.ERROR
                response = "Error: Failed to generate response. Check logs."
            
            return response
            
        except Exception as e:
            self.state = AgentState.ERROR
            logger.error(f"Error during thinking: {e}")
            return f"Error: {str(e)}"
    
    def _enhance_query(self, query: str) -> str:
        """Enhance query with strategic context.
        
        Args:
            query: Original query
        
        Returns:
            Enhanced query with context
        """
        strategic_context = self.strategy_memory.get_strategic_context()
        
        if strategic_context:
            return f"{strategic_context}\n\nQuestion: {query}"
        return query
    
    def get_conversation_history(self) -> List[Dict]:
        """Get conversation history.
        
        Returns:
            List of messages
        """
        return self.conversation_memory.get_history(include_timestamps=True)
    
    def clear_memory(self) -> None:
        """Clear conversation memory."""
        self.conversation_memory.clear()
        logger.info("Agent memory cleared")
    
    def get_status(self) -> Dict:
        """Get agent status.
        
        Returns:
            Status dictionary
        """
        return {
            "state": self.state.value,
            "model": self.client.model,
            "memory": self.conversation_memory.get_summary(),
            "iterations": self.iteration_count,
            "healthy": self.health_check()
        }
