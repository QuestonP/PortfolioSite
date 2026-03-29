# Tool Usage Guide

Your Strategic Assistant Agent now has 9 powerful tools integrated. Here's how to use them:

## 🛠️ Available Tools

### 1. **Web Search**
Search the internet for information

```bash
tool: web_search : {"query": "latest AI trends 2026", "max_results": 5}
```

**Parameters:**
- `query` (required): Search query
- `max_results` (optional): Number of results (default: 5)

---

### 2. **Calendar Scheduling**
Schedule events on your calendar

```bash
tool: schedule_calendar : {"title": "Board Meeting", "date": "2026-02-15", "time": "14:00", "duration_minutes": 60, "description": "Quarterly strategy review"}
```

**Parameters:**
- `title` (required): Event name
- `date` (required): Date in YYYY-MM-DD format
- `time` (required): Time in HH:MM (24-hour)
- `duration_minutes` (optional): Duration in minutes (default: 60)
- `description` (optional): Event details

---

### 3. **List Calendar Events**
View upcoming calendar events

```bash
tool: list_calendar_events : {"days_ahead": 7}
```

**Parameters:**
- `days_ahead` (optional): Days to look ahead (default: 7)

---

### 4. **Read Excel Files**
Read data from Excel spreadsheets

```bash
tool: read_excel : {"file_path": "data/financials.xlsx", "sheet_name": "Q4_2025"}
```

**Parameters:**
- `file_path` (required): Path to Excel file
- `sheet_name` (optional): Sheet to read

---

### 5. **Write Excel Files**
Create or update Excel spreadsheets

```bash
tool: write_excel : {"file_path": "data/sales_forecast.xlsx", "data": "[{\"month\": \"Jan\", \"revenue\": 50000}, {\"month\": \"Feb\", \"revenue\": 55000}]", "sheet_name": "2026_Forecast"}
```

**Parameters:**
- `file_path` (required): Path to Excel file
- `data` (required): JSON formatted data
- `sheet_name` (optional): Sheet name (default: Sheet1)

---

### 6. **Read Google Docs**
Access Google Docs content

```bash
tool: read_google_doc : {"doc_id": "1a2b3c4d5e6f7g8h9i0j"}
```

**Setup Required:** 
- Need Google API credentials (see instructions below)

**Parameters:**
- `doc_id` (required): Google Doc ID from URL

---

### 7. **Write Google Docs**
Update Google Docs content

```bash
tool: write_google_doc : {"doc_id": "1a2b3c4d5e6f7g8h9i0j", "content": "New strategic plan...", "append": true}
```

**Setup Required:** 
- Need Google API credentials

**Parameters:**
- `doc_id` (required): Google Doc ID
- `content` (required): Content to write
- `append` (optional): Append or replace (default: true)

---

### 8. **Read Local Files**
Read from local files (txt, csv, json, etc.)

```bash
tool: read_file : {"file_path": "data/strategy.txt"}
```

**Parameters:**
- `file_path` (required): Path to file

---

### 9. **Write Local Files**
Create or update local files

```bash
tool: write_file : {"file_path": "data/notes.txt", "content": "Strategic notes...", "append": false}
```

**Parameters:**
- `file_path` (required): Path to file
- `content` (required): Content to write
- `append` (optional): Append or overwrite (default: false)

---

## 💡 Interactive Commands

While chatting with the agent, use these commands:

```bash
# View all available tools
tools

# Check agent status
status

# Clear conversation memory
clear

# Exit
quit
```

---

## 📊 Example Workflows

### Example 1: Create a Sales Forecast
```
You: I need to create a sales forecast. Let me write it to Excel.

tool: write_excel : {"file_path": "data/sales_forecast.xlsx", "data": "[{\"Q\": \"Q1\", \"revenue\": 100000}, {\"Q\": \"Q2\", \"revenue\": 120000}]"}

Agent: [Creates the Excel file with your forecast]
```

### Example 2: Schedule a Strategy Meeting
```
You: Schedule a strategy meeting for next Monday at 2 PM for 90 minutes about market expansion.

tool: schedule_calendar : {"title": "Market Expansion Strategy", "date": "2026-02-17", "time": "14:00", "duration_minutes": 90, "description": "Discuss market expansion opportunities"}

Agent: [Adds event to calendar]
```

### Example 3: Research and Document
```
You: Search for AI trends and save them to a file.

tool: web_search : {"query": "AI trends 2026", "max_results": 5}

Agent: [Returns search results]

tool: write_file : {"file_path": "data/ai_research.txt", "content": "AI Trends 2026:\n[search results here]"}

Agent: [Saves to file]
```

---

## 🔐 Google API Setup (Optional)

To enable Google Docs and Calendar integration:

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create a new project
   - Enable Google Docs API and Google Calendar API

2. **Create Service Account**
   ```bash
   # Download JSON credentials
   # Place in: config/google_credentials.json
   ```

3. **Share Docs/Calendar**
   - Share Google Docs with service account email
   - Grant calendar access to service account

4. **Update tools.py**
   - Load credentials in `read_google_doc()` and `write_google_doc()`

---

## 📁 Local Storage

Tools automatically create necessary directories:

- `data/calendar_events.json` - Calendar data
- `data/` - General data storage
- `logs/` - Agent logs

---

## ⚠️ Limitations & Notes

1. **Web Search**: Demo mode uses DuckDuckGo. For real API integration, sign up for a search API.
2. **Google Docs**: Requires authentication setup
3. **Excel**: Requires pandas and openpyxl (already installed)
4. **File Size**: Local files limited by disk space

---

## 🚀 Next Steps

1. **Try the tools interactively** - Use `tool:` prefix to execute
2. **Set up Google API** - Optional but powerful
3. **Customize tools** - Edit `src/tools.py` to add your own tools
4. **Create workflows** - Combine tools for complex tasks

---

## Example Full Conversation

```
You: tools
Agent: [Lists all 9 available tools]

You: What should our Q1 strategy focus on?
Agent: [Provides strategic analysis]

You: Let's schedule a strategy meeting and document it.
tool: schedule_calendar : {"title": "Q1 Strategy Session", "date": "2026-02-18", "time": "10:00", "duration_minutes": 120}

Agent: [Schedules meeting]

You: Now save the strategy to a file.
tool: write_file : {"file_path": "data/q1_strategy.txt", "content": "Q1 2026 Strategy...", "append": false}

Agent: [Saves to file]

You: And create an Excel dashboard for tracking.
tool: write_excel : {"file_path": "data/q1_metrics.xlsx", "data": "[...]"}

Agent: [Creates Excel file]
```

---

Enjoy using your Strategic Assistant with tools! 🎯
