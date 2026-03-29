# Installing Mistral Model - Step by Step

## Issue
Ollama server must be running before you can pull models.

## Solution

### Step 1: Start Ollama Server (Keep this running)

Open a **NEW Terminal** and run:

```bash
ollama serve
```

You should see output like:
```
2024/02/10 15:30:45 Listening on 127.0.0.1:11434
```

**Keep this terminal open while using the agent!**

### Step 2: Pull Mistral Model (In a DIFFERENT terminal)

Once you see the "Listening" message, open a **DIFFERENT Terminal** and run:

```bash
ollama pull mistral
```

This will download Mistral 7B (~4.5GB). It will show progress:

```
pulling manifest ⠙
pulling 3e5f6c9de87f... 100% |████████████████████| ( 4.1 GB / 4.1 GB)
pulling 34b70a6f0c71... 100% |████████████████████| (  104 B / 104 B)
pulling 42ba7f8a01dd... 100% |████████████████████| ( 1.6 KB / 1.6 KB)
pulling a96da1e7a4be... 100% |████████████████████| (   97 B / 97 B)
pulling e5c80c4f2f41... 100% |████████████████████| (   32 B / 32 B)
pulling 2e1a6f2e49f1... 100% |████████████████████| (  396 B / 396 B)
pulling 7f6f19e66e5e... 100% |████████████████████| (  123 B / 123 B)
pulling c48db3103b90... 100% |████████████████████| (   32 B / 32 B)
pulling 7f2d9a1f1a7e... 100% |████████████████████| (   32 B / 32 B)
pulling a5cc8c05ddfe... 100% |████████████████████| (   32 B / 32 B)
pulling c8c79f8f89a1... 100% |████████████████████| (   32 B / 32 B)
pulling 2e1a6f2e49f1... 100% |████████████████████| (  396 B / 396 B)
pulling 6c3193e9ed4c... 100% |████████████████████| (   32 B / 32 B)
pulling 0c8346c99f12... 100% |████████████████████| (   32 B / 32 B)
pulling 24f1a24d5d6e... 100% |████████████████████| (   32 B / 32 B)
pulling e3e2dfad2da5... 100% |████████████████████| (  438 B / 438 B)
pulling a5cc8c05ddfe... 100% |████████████████████| (   32 B / 32 B)
pulling c48db3103b90... 100% |████████████████████| (   32 B / 32 B)
digest: sha256:a7...(hash)
pulling manifest ✓
pulling 34b70a6f0c71... ✓
pulling 42ba7f8a01dd... ✓
pulling a96da1e7a4be... ✓
pulling e5c80c4f2f41... ✓
pulling 2e1a6f2e49f1... ✓
pulling 7f6f19e66e5e... ✓
pulling c48db3103b90... ✓
pulling 7f2d9a1f1a7e... ✓
pulling a5cc8c05ddfe... ✓
pulling c8c79f8f89a1... ✓
pulling 2e1a6f2e49f1... ✓
pulling 6c3193e9ed4c... ✓
pulling 0c8346c99f12... ✓
pulling 24f1a24d5d6e... ✓
pulling e3e2dfad2da5... ✓
pulling a5cc8c05ddfe... ✓
pulling c48db3103b90... ✓
pulling 7c34a10c5f10... ✓
pulling 61a64ebbf708... ✓
pulling 70d7f1a3071c... ✓
pulling 2e1a6f2e49f1... ✓
pulling 3c3dfd57827b... ✓
pulling 3a00526b0c8d... ✓
pulling 58de1e10bf5a... ✓
pulling 5ad17b63ced0... ✓
pulling 69edc23f8d91... ✓
pulling 6c8a5f2a1f5f... ✓
pulling 3bcc4a52e04e... ✓
pulling 2c2a2d5f8e5f... ✓
pulling 4f52edfaf7e7... ✓
pulling 3cbddc8a6b5d... ✓
pulling 1bd5eb0af3f4... ✓
pulling 0c8346c99f12... ✓
pulling 24f1a24d5d6e... ✓
pulling e3e2dfad2da5... ✓
pulling a5cc8c05ddfe... ✓
pulling c48db3103b90... ✓
pulling 7c34a10c5f10... ✓
pulling 61a64ebbf708... ✓
pulling 70d7f1a3071c... ✓
pulling 2e1a6f2e49f1... ✓
pulling 3c3dfd57827b... ✓
pulling 3a00526b0c8d... ✓
pulling 58de1e10bf5a... ✓
pulling 5ad17b63ced0... ✓
pulling 69edc23f8d91... ✓
pulling 6c8a5f2a1f5f... ✓
pulling 3bcc4a52e04e... ✓
pulling 2c2a2d5f8e5f... ✓
pulling 4f52edfaf7e7... ✓
pulling 3cbddc8a6b5d... ✓
pulling 1bd5eb0af3f4... ✓
pulling 0c8346c99f12... ✓

Success! You now have the Mistral model
```

### Step 3: Verify Installation

Check that Mistral is installed:

```bash
ollama list
```

You should see:
```
NAME            ID              SIZE      MODIFIED
mistral:latest  b537f8f8d1da    4.1 GB    About a minute ago
```

## Terminal Setup (3 Terminal Windows Total)

You need 3 terminals open:

1. **Terminal 1** - Ollama Server (keeps running)
   ```bash
   ollama serve
   ```

2. **Terminal 2** - Pull the model
   ```bash
   cd /Users/questonparker/Desktop/Business/rockSteady
   ollama pull mistral
   ```

3. **Terminal 3** - Run the agent (after model is pulled)
   ```bash
   cd /Users/questonparker/Desktop/Business/rockSteady
   python main.py
   ```

## Troubleshooting

### If you get "command not found: ollama"
- Install Ollama from https://ollama.ai
- Or via Homebrew: `brew install ollama`

### If download is slow
- Check your internet connection
- Model is 4.1GB, so it may take 10-30 minutes depending on speed

### If you get memory errors
- Make sure no other heavy applications are running
- Try a smaller model: `ollama pull orca-mini` (3B, only 2GB)

### After pulling mistral, can't connect
- Make sure Terminal 1 still has `ollama serve` running
- The server must keep running while you use the agent

## Next Steps

Once Mistral is installed:

1. Keep Terminal 1 running `ollama serve`
2. In Terminal 3, run: `python main.py`
3. Start asking strategic questions!

Happy strategizing! 🚀
