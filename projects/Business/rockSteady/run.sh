#!/bin/bash
# Activate virtual environment and run the agent

cd /Users/questonparker/Desktop/Business/rockSteady

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "Starting Strategic Assistant Agent..."
python main.py
