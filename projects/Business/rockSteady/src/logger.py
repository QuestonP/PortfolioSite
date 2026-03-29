"""Logging configuration for the Strategic Assistant Agent."""

import sys
from pathlib import Path
import logging
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import settings


def setup_logger(name: str) -> logging.Logger:
    """Set up logger with file and console handlers."""
    
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.logging.level))
    
    # Create logs directory if it doesn't exist
    log_dir = Path(settings.logging.file).parent
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # File handler
    file_handler = logging.FileHandler(settings.logging.file)
    file_handler.setLevel(getattr(logging, settings.logging.level))
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, settings.logging.level))
    
    # Formatter
    formatter = logging.Formatter(settings.logging.format)
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    # Add handlers
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
    
    return logger
