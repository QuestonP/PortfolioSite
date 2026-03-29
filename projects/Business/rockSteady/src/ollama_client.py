"""Ollama client wrapper for interacting with local models."""

import sys
from pathlib import Path
import requests
from typing import Optional, Dict, Any

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import settings
from src.logger import setup_logger

logger = setup_logger(__name__)


class OllamaClient:
    """Client for interacting with Ollama API."""
    
    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        """Initialize Ollama client.
        
        Args:
            base_url: Base URL for Ollama API (defaults to config)
            model: Model name (defaults to config)
        """
        self.base_url = base_url or settings.ollama.base_url
        self.model = model or settings.ollama.model
        self.session = requests.Session()
        
        logger.info(f"Initialized Ollama client: {self.model} at {self.base_url}")
    
    def health_check(self) -> bool:
        """Check if Ollama server is running."""
        try:
            response = self.session.get(f"{self.base_url}/api/tags", timeout=5)
            is_healthy = response.status_code == 200
            if is_healthy:
                logger.info("Ollama server is healthy")
            else:
                logger.warning(f"Ollama server returned status {response.status_code}")
            return is_healthy
        except Exception as e:
            logger.error(f"Failed to connect to Ollama server: {e}")
            return False
    
    def list_models(self) -> list:
        """List available models on Ollama."""
        try:
            response = self.session.get(f"{self.base_url}/api/tags", timeout=5)
            response.raise_for_status()
            models = response.json().get("models", [])
            logger.info(f"Found {len(models)} models")
            return models
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []
    
    def generate(self, prompt: str, system: Optional[str] = None, **kwargs) -> str:
        """Generate response from model.
        
        Args:
            prompt: Input prompt
            system: System message for strategic context
            **kwargs: Additional parameters (temperature, top_p, etc.)
        
        Returns:
            Generated text response
        """
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "temperature": kwargs.get("temperature", settings.ollama.temperature),
            "top_p": kwargs.get("top_p", settings.ollama.top_p),
            "top_k": kwargs.get("top_k", settings.ollama.top_k),
            "num_predict": kwargs.get("num_predict", settings.ollama.num_predict),
        }
        
        if system:
            payload["system"] = system
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=300
            )
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except requests.exceptions.Timeout:
            logger.error("Request timeout - model may be overloaded")
            return ""
        except Exception as e:
            logger.error(f"Failed to generate response: {e}")
            return ""
    
    def chat(self, messages: list, system: Optional[str] = None, **kwargs) -> str:
        """Chat with the model.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            system: System message for strategic context
            **kwargs: Additional parameters
        
        Returns:
            Assistant response
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "temperature": kwargs.get("temperature", settings.ollama.temperature),
            "top_p": kwargs.get("top_p", settings.ollama.top_p),
            "top_k": kwargs.get("top_k", settings.ollama.top_k),
        }
        
        if system:
            payload["system"] = system
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=300
            )
            response.raise_for_status()
            result = response.json()
            return result.get("message", {}).get("content", "")
        except requests.exceptions.Timeout:
            logger.error("Request timeout - model may be overloaded")
            return ""
        except Exception as e:
            logger.error(f"Failed to chat: {e}")
            return ""
