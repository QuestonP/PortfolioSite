# Strategic Assistant Agent - Ollama

A strategic assistant agent framework built with Python and Ollama, optimized to run on 8GB RAM MacBook Pro and other resource-constrained devices.

## Features

- 🧠 Strategic reasoning powered by local LLMs
- 💾 Conversation memory with sliding window
- 🎯 Strategic goal and context management
- 📊 Fully offline operation (no cloud dependencies)
- ⚙️ Configurable model selection
- 🔍 Comprehensive logging

## Requirements

- Python 3.8+
- Ollama (https://ollama.ai)
- 8GB RAM (minimum)
- ~4-7GB disk space for models

## Setup

### 1. Install Ollama

```bash
# Download from https://ollama.ai
# Or via Homebrew on macOS
brew install ollama
```

### 2. Pull a Lightweight Model

For 8GB RAM machines, use these models:

```bash
# Best option for strategic reasoning (7B)
ollama pull mistral

# Alternative lightweight options
ollama pull neural-chat  # 7B, specialized for chat
ollama pull orca-mini    # 3B, very lightweight
ollama pull tinyllama    # 1.1B, minimal but basic
```

### 3. Install Python Dependencies

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
. venv/Scripts/activate   # On Windows

pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env as needed
```

## Usage

### Start Ollama Server

In a terminal, start the Ollama server:

```bash
ollama serve
```

By default, Ollama listens on `http://localhost:11434`

### Run the Agent

In another terminal:

```bash
python main.py
```

### Interactive Commands

- Type your questions normally
- `status` - Show agent status
- `clear` - Clear conversation memory
- `quit`/`exit` - Exit the program

## Example Session

```
Strategic Assistant Agent - Powered by Ollama
==============================================

Checking Ollama connection...
✓ Ollama connection successful
✓ Model loaded: mistral
✓ Agent state: idle

Setting strategic context...
✓ Context configured

Type your questions (or 'quit' to exit):

You: What are the key elements of a successful business strategy?
Agent: [Strategic reasoning about business strategy...]

You: How do we prioritize between short-term and long-term goals?
Agent: [Analysis with frameworks and recommendations...]

You: quit
Goodbye!
```

## Configuration

Edit `config/settings.py` or `.env` file:

### Ollama Settings
- `OLLAMA_BASE_URL`: Ollama server address (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model to use (default: mistral)
- `OLLAMA_TEMPERATURE`: Response randomness (0.0-1.0, default: 0.7)
- `OLLAMA_TOP_P`: Nucleus sampling (default: 0.9)

### Agent Settings
- `AGENT_MAX_ITERATIONS`: Max reasoning steps (default: 10)
- `AGENT_CONTEXT_LENGTH`: Token context window (default: 4096)
- `AGENT_TEMPERATURE`: Reasoning temperature (default: 0.7)

## Architecture

```
rockSteady/
├── src/
│   ├── agent.py           # Main agent implementation
│   ├── ollama_client.py   # Ollama API wrapper
│   ├── memory.py          # Memory management
│   ├── logger.py          # Logging configuration
│   └── __init__.py
├── config/
│   └── settings.py        # Configuration management
├── data/                  # Data storage
├── logs/                  # Log files
├── main.py               # Entry point
├── requirements.txt      # Python dependencies
├── .env.example          # Environment template
└── README.md            # This file
```

## Model Selection for 8GB RAM

| Model | Size | VRAM | Quality | Speed |
|-------|------|------|---------|-------|
| mistral | 7B | ~4.5GB | Excellent | Good |
| neural-chat | 7B | ~4.5GB | Very Good | Good |
| orca-mini | 3B | ~2GB | Good | Very Fast |
| tinyllama | 1.1B | ~0.6GB | Basic | Instant |

### Recommended
**Mistral 7B** - Best balance of quality and performance for strategic reasoning.

## Performance Tips

1. **Memory Management**: Agent limits conversation history to 20 messages
2. **Token Window**: Context limited to ~4096 tokens (configurable)
3. **Temperature**: Set to 0.7 for balanced reasoning (can adjust in .env)
4. **Quantization**: Ollama uses automatic quantization for RAM efficiency

## Troubleshooting

### "Cannot connect to Ollama server"
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it:
ollama serve
```

### Model not found
```bash
# List available models
ollama list

# Pull desired model
ollama pull mistral
```

### Slow responses
- Try a smaller model (orca-mini, tinyllama)
- Reduce `num_predict` in .env
- Reduce context window size
- Close other applications

### High memory usage
- Use a smaller model
- Reduce `AGENT_CONTEXT_LENGTH` in .env
- Use `ollama pull mistral --f q4` for quantized version

## Development

### Adding Custom Prompts

Edit the `SYSTEM_PROMPT` in `src/agent.py` for different agent personalities and capabilities.

### Extending the Agent

The framework supports:
- Custom memory backends
- Additional reasoning modules
- Multiple model support
- Streaming responses
- Tool integration

### Running Tests

```bash
# Tests will be added in test/ directory
pytest tests/
```

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## Support

For issues or questions:
1. Check Ollama documentation: https://ollama.ai
2. Review configuration in `config/settings.py`
3. Check logs in `logs/agent.log`

## Resources

- [Ollama Documentation](https://ollama.ai)
- [Mistral Model](https://mistral.ai)
- [LangChain Integration](https://python.langchain.com)
