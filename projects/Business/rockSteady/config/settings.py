"""Configuration settings for the Strategic Assistant Agent."""

from pydantic_settings import BaseSettings
from typing import Optional


class OllamaSettings(BaseSettings):
    """Ollama model configuration."""
    
    base_url: str = "http://localhost:11434"
    model: str = "mistral"  # 8GB RAM compatible models: mistral, neural-chat, orca-mini
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 40
    num_predict: int = 2048

    class Config:
        env_prefix = "OLLAMA_"


class AgentSettings(BaseSettings):
    """Strategic agent configuration."""
    
    max_iterations: int = 10
    max_tokens: int = 4096
    context_window: int = 4096
    enable_memory: bool = True
    memory_type: str = "conversation"  # Options: conversation, semantic, hybrid
    
    class Config:
        env_prefix = "AGENT_"


class LoggingSettings(BaseSettings):
    """Logging configuration."""
    
    level: str = "INFO"
    file: str = "logs/agent.log"
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    class Config:
        env_prefix = "LOG_"


class Settings(BaseSettings):
    """Combined settings."""
    
    ollama: OllamaSettings = OllamaSettings()
    agent: AgentSettings = AgentSettings()
    logging: LoggingSettings = LoggingSettings()

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
