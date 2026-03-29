#!/usr/bin/env python3
"""Main entry point for Strategic Assistant Agent."""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from src.agent import StrategicAgent
from src.logger import setup_logger

logger = setup_logger(__name__)


def main():
    """Run the Strategic Assistant Agent."""
    
    print("\n" + "="*60)
    print("Strategic Assistant Agent - Powered by Ollama")
    print("="*60 + "\n")
    
    # Initialize agent
    agent = StrategicAgent()
    
    # Check health
    print("Checking Ollama connection...")
    if not agent.health_check():
        print("❌ ERROR: Cannot connect to Ollama")
        print("\nPlease ensure Ollama is running:")
        print("  1. Install Ollama from https://ollama.ai")
        print("  2. Run: ollama serve")
        print("  3. In another terminal, pull a model: ollama pull mistral")
        return
    
    print("✓ Ollama connection successful")
    status = agent.get_status()
    print(f"✓ Model loaded: {status['model']}")
    print(f"✓ Agent state: {status['state']}\n")
    
    # Set strategic goals
    print("Setting strategic context...")
    agent.set_strategic_goal("Provide well-reasoned strategic advice", priority=5)
    agent.set_strategic_goal("Consider multiple perspectives", priority=4)
    agent.add_context("domain", "strategic planning and decision-making")
    print("✓ Context configured\n")
    
    # Interactive loop
    print("Type your questions (or 'quit' to exit):\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ["quit", "exit", "q"]:
                print("\nGoodbye!")
                break
            
            if user_input.lower() == "status":
                status = agent.get_status()
                print(f"\nAgent Status: {status}\n")
                continue
            
            if user_input.lower() == "clear":
                agent.clear_memory()
                print("\nMemory cleared.\n")
                continue
            
            if user_input.lower() == "tools":
                print(f"\n{agent.tools.get_tools_description()}")
                continue
            
            # Check if user wants to use a specific tool
            if user_input.lower().startswith("tool:"):
                parts = user_input[5:].split(":", 1)
                if len(parts) == 2:
                    tool_name = parts[0].strip()
                    params = parts[1].strip()
                    # Parse parameters (simplified JSON format)
                    import json
                    try:
                        kwargs = json.loads(params)
                        result = agent.use_tool(tool_name, **kwargs)
                        print(f"\nTool Result: {result}\n")
                    except json.JSONDecodeError:
                        print("Error: Invalid JSON parameters\n")
                continue
            
            print("\nAgent: Thinking...", end="", flush=True)
            response = agent.think(user_input)
            print("\r" + " "*20 + "\r", end="")
            print(f"Agent: {response}\n")
            
        except KeyboardInterrupt:
            print("\n\nInterrupted. Goodbye!")
            break
        except Exception as e:
            logger.error(f"Error: {e}")
            print(f"Error: {e}\n")


if __name__ == "__main__":
    main()
