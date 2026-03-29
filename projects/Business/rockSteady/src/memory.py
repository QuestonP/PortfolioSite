"""Memory management for the Strategic Assistant Agent."""

import sys
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
from collections import deque

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.logger import setup_logger

logger = setup_logger(__name__)


class ConversationMemory:
    """Manages conversation history with sliding window."""
    
    def __init__(self, max_messages: int = 20):
        """Initialize conversation memory.
        
        Args:
            max_messages: Maximum number of messages to keep
        """
        self.max_messages = max_messages
        self.messages: deque = deque(maxlen=max_messages)
        self.session_start = datetime.now()
    
    def add_message(self, role: str, content: str) -> None:
        """Add message to memory.
        
        Args:
            role: Message role (user, assistant, system)
            content: Message content
        """
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        self.messages.append(message)
        logger.debug(f"Added {role} message to memory")
    
    def get_history(self, include_timestamps: bool = False) -> List[Dict]:
        """Get conversation history.
        
        Args:
            include_timestamps: Whether to include timestamp data
        
        Returns:
            List of messages
        """
        if include_timestamps:
            return list(self.messages)
        return [
            {"role": msg["role"], "content": msg["content"]}
            for msg in self.messages
        ]
    
    def get_context_window(self, max_tokens: int = 4096) -> List[Dict]:
        """Get relevant context window for model.
        
        Args:
            max_tokens: Approximate token limit
        
        Returns:
            Messages within token limit (roughly 4 chars per token)
        """
        token_limit = max_tokens * 4
        context = []
        current_tokens = 0
        
        # Iterate backwards through messages
        for message in reversed(list(self.messages)):
            message_size = len(message["content"])
            if current_tokens + message_size > token_limit:
                break
            context.insert(0, {"role": message["role"], "content": message["content"]})
            current_tokens += message_size
        
        return context
    
    def clear(self) -> None:
        """Clear conversation memory."""
        self.messages.clear()
        self.session_start = datetime.now()
        logger.info("Cleared conversation memory")
    
    def get_summary(self) -> Dict:
        """Get memory summary statistics."""
        return {
            "messages": len(self.messages),
            "session_duration": (datetime.now() - self.session_start).total_seconds(),
            "capacity": f"{len(self.messages)}/{self.max_messages}"
        }


class StrategyMemory:
    """Manages strategic goals and context."""
    
    def __init__(self):
        """Initialize strategy memory."""
        self.goals: List[Dict] = []
        self.context: Dict = {}
        self.decisions: List[Dict] = []
    
    def set_strategic_goal(self, goal: str, priority: int = 1) -> None:
        """Set a strategic goal.
        
        Args:
            goal: Goal description
            priority: Priority level (1-5)
        """
        self.goals.append({
            "goal": goal,
            "priority": priority,
            "created_at": datetime.now().isoformat()
        })
        logger.info(f"Set strategic goal: {goal}")
    
    def add_context(self, key: str, value: any) -> None:
        """Add contextual information.
        
        Args:
            key: Context key
            value: Context value
        """
        self.context[key] = value
        logger.debug(f"Added context: {key}")
    
    def record_decision(self, decision: str, reasoning: str) -> None:
        """Record a strategic decision.
        
        Args:
            decision: The decision made
            reasoning: Reasoning behind the decision
        """
        self.decisions.append({
            "decision": decision,
            "reasoning": reasoning,
            "timestamp": datetime.now().isoformat()
        })
        logger.info(f"Recorded decision: {decision}")
    
    def get_strategic_context(self) -> str:
        """Get formatted strategic context for the model.
        
        Returns:
            Formatted string with goals and context
        """
        context_parts = []
        
        if self.goals:
            context_parts.append("Strategic Goals:")
            for goal in sorted(self.goals, key=lambda x: x["priority"], reverse=True):
                context_parts.append(f"  - {goal['goal']} (Priority: {goal['priority']})")
        
        if self.context:
            context_parts.append("\nContext:")
            for key, value in self.context.items():
                context_parts.append(f"  - {key}: {value}")
        
        return "\n".join(context_parts)
