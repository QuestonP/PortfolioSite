# Quick Start Setup Guide

## Step 1: Install Ollama

### macOS
```bash
# Using Homebrew (easiest)
brew install ollama

# Or download from https://ollama.ai
```

### Other OS
Download from https://ollama.ai and follow their installation instructions.

## Step 2: Pull a Model

Open a terminal and run:

```bash
# Mistral (recommended for 8GB RAM)
ollama pull mistral

# Alternative: If mistral is too heavy, try:
ollama pull neural-chat
# or
ollama pull orca-mini
```

The download will take a few minutes depending on your internet speed.

## Step 3: Start Ollama Server

Keep this terminal open while using the agent:

```bash
ollama serve
```

You should see:
```
2024/02/10 15:30:45 Listening on 127.0.0.1:11434
```

## Step 4: Setup Python Environment

Open a NEW terminal in the project directory:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 5: Configure (Optional)

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to customize settings (usually defaults are fine).

## Step 6: Run the Agent

```bash
python main.py
```

You should see:
```
============================================================
Strategic Assistant Agent - Powered by Ollama
============================================================

Checking Ollama connection...
✓ Ollama connection successful
✓ Model loaded: mistral
✓ Agent state: idle

Setting strategic context...
✓ Context configured

Type your questions (or 'quit' to exit):

You: 
```

## Step 7: Start Using!

Type your questions and press Enter:

```
You: What's the best approach to strategic planning?
Agent: [Thinking...] Strategic planning requires...
```

## Memory Usage by Model

- **Mistral 7B**: ~4.5GB RAM (Recommended)
- **Neural-Chat 7B**: ~4.5GB RAM
- **Orca-Mini 3B**: ~2GB RAM (if mistral too slow)
- **TinyLLama 1.1B**: ~600MB RAM (very limited)

## Troubleshooting

### "Cannot connect to Ollama"
Make sure terminal with `ollama serve` is running.

### "Model not found"
Run `ollama pull mistral` again.

### Slow responses
Try a smaller model: `ollama pull orca-mini`

### Memory errors
Reduce context size in `.env`:
```
AGENT_CONTEXT_LENGTH=2048
```

## Next Steps

1. Customize the system prompt in `src/agent.py`
2. Add custom strategic goals with `agent.set_strategic_goal()`
3. Explore the configuration options in `config/settings.py`
4. Check the main README.md for advanced usage

## Tips

- Keep `ollama serve` running in a dedicated terminal
- Use `clear` command in agent to reset conversation
- Use `status` command to check agent health
- Check `logs/agent.log` for detailed debug information

Enjoy your strategic assistant! 🚀
