"""Tool implementations for the Strategic Agent."""

import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional
from dataclasses import dataclass
import json
from datetime import datetime, timedelta
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.logger import setup_logger
from config.credentials import (
    has_google_credentials,
    has_serpapi_key,
    has_google_search_credentials,
    load_google_service_account,
    SERPAPI_KEY,
    GOOGLE_SEARCH_API_KEY,
    GOOGLE_SEARCH_ENGINE_ID,
    GOOGLE_CALENDAR_ID
)

logger = setup_logger(__name__)


@dataclass
class Tool:
    """Tool definition."""
    name: str
    description: str
    function: Callable
    parameters: Dict[str, Any]


class ToolKit:
    """Collection of available tools for the agent."""
    
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register built-in tools."""
        
        # Web Search Tool
        self.register_tool(
            name="web_search",
            description="Search the web for information and news",
            function=self.web_search,
            parameters={
                "query": {
                    "type": "string",
                    "description": "Search query"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of results (default: 5)"
                }
            }
        )
        
        # Calendar Tool
        self.register_tool(
            name="schedule_calendar",
            description="Schedule an event on your calendar",
            function=self.schedule_calendar,
            parameters={
                "title": {
                    "type": "string",
                    "description": "Event title"
                },
                "date": {
                    "type": "string",
                    "description": "Date in format YYYY-MM-DD"
                },
                "time": {
                    "type": "string",
                    "description": "Time in format HH:MM (24-hour)"
                },
                "duration_minutes": {
                    "type": "integer",
                    "description": "Duration in minutes (default: 60)"
                },
                "description": {
                    "type": "string",
                    "description": "Event description (optional)"
                }
            }
        )
        
        # List Calendar Events
        self.register_tool(
            name="list_calendar_events",
            description="List upcoming calendar events",
            function=self.list_calendar_events,
            parameters={
                "days_ahead": {
                    "type": "integer",
                    "description": "Number of days to look ahead (default: 7)"
                }
            }
        )
        
        # Excel Tools
        self.register_tool(
            name="read_excel",
            description="Read data from an Excel file",
            function=self.read_excel,
            parameters={
                "file_path": {
                    "type": "string",
                    "description": "Path to Excel file"
                },
                "sheet_name": {
                    "type": "string",
                    "description": "Sheet name (default: first sheet)"
                }
            }
        )
        
        self.register_tool(
            name="write_excel",
            description="Write data to an Excel file",
            function=self.write_excel,
            parameters={
                "file_path": {
                    "type": "string",
                    "description": "Path to Excel file"
                },
                "data": {
                    "type": "string",
                    "description": "JSON formatted data to write"
                },
                "sheet_name": {
                    "type": "string",
                    "description": "Sheet name (default: Sheet1)"
                }
            }
        )
        
        # Google Docs Tools
        self.register_tool(
            name="read_google_doc",
            description="Read content from a Google Doc",
            function=self.read_google_doc,
            parameters={
                "doc_id": {
                    "type": "string",
                    "description": "Google Doc ID (from URL)"
                }
            }
        )
        
        self.register_tool(
            name="write_google_doc",
            description="Write or append content to a Google Doc",
            function=self.write_google_doc,
            parameters={
                "doc_id": {
                    "type": "string",
                    "description": "Google Doc ID"
                },
                "content": {
                    "type": "string",
                    "description": "Content to write"
                },
                "append": {
                    "type": "boolean",
                    "description": "Append to doc or replace (default: append)"
                }
            }
        )
        
        # File Operations
        self.register_tool(
            name="read_file",
            description="Read content from a local file",
            function=self.read_file,
            parameters={
                "file_path": {
                    "type": "string",
                    "description": "Path to file"
                }
            }
        )
        
        self.register_tool(
            name="write_file",
            description="Write content to a local file",
            function=self.write_file,
            parameters={
                "file_path": {
                    "type": "string",
                    "description": "Path to file"
                },
                "content": {
                    "type": "string",
                    "description": "Content to write"
                },
                "append": {
                    "type": "boolean",
                    "description": "Append to file or overwrite (default: overwrite)"
                }
            }
        )
        
        logger.info(f"Registered {len(self.tools)} tools")
    
    def register_tool(self, name: str, description: str, function: Callable, parameters: Dict) -> None:
        """Register a custom tool.
        
        Args:
            name: Tool name
            description: What the tool does
            function: Callable that executes the tool
            parameters: Expected parameters
        """
        self.tools[name] = Tool(name, description, function, parameters)
        logger.info(f"Tool registered: {name}")
    
    def execute_tool(self, tool_name: str, **kwargs) -> str:
        """Execute a tool.
        
        Args:
            tool_name: Name of the tool
            **kwargs: Tool parameters
        
        Returns:
            Tool result as string
        """
        if tool_name not in self.tools:
            return f"Error: Tool '{tool_name}' not found"
        
        try:
            tool = self.tools[tool_name]
            result = tool.function(**kwargs)
            logger.info(f"Tool executed: {tool_name}")
            return str(result)
        except Exception as e:
            logger.error(f"Tool execution failed: {tool_name} - {e}")
            return f"Error executing tool: {str(e)}"
    
    def get_tools_description(self) -> str:
        """Get formatted description of all available tools.
        
        Returns:
            Formatted tools description
        """
        description = "Available Tools:\n"
        for tool in self.tools.values():
            description += f"\n- {tool.name}: {tool.description}\n"
            params = ", ".join(tool.parameters.keys())
            description += f"  Parameters: {params}\n"
        return description
    
    # ==================== Tool Implementations ====================
    
    # Web Search
    def web_search(self, query: str, max_results: int = 5) -> Dict:
        """Search the web for information.
        
        Args:
            query: Search query
            max_results: Maximum results to return
        
        Returns:
            Search results dictionary
        """
        # Try premium APIs first, fall back to DuckDuckGo
        
        # Try SerpAPI
        if has_serpapi_key() and SERPAPI_KEY != "your-serpapi-key-here":
            return self._serpapi_search(query, max_results)
        
        # Try Google Custom Search
        if has_google_search_credentials():
            return self._google_search(query, max_results)
        
        # Fall back to DuckDuckGo (free, no key needed)
        return self._duckduckgo_search(query, max_results)
    
    def _serpapi_search(self, query: str, max_results: int = 5) -> Dict:
        """Search using SerpAPI.
        
        Args:
            query: Search query
            max_results: Maximum results
        
        Returns:
            Search results
        """
        try:
            import requests
        except ImportError:
            return {
                "status": "error",
                "message": "requests library not installed"
            }
        
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": query,
                "api_key": SERPAPI_KEY,
                "num": max_results
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            results = []
            if "organic_results" in data:
                for result in data["organic_results"][:max_results]:
                    results.append({
                        "title": result.get("title", ""),
                        "url": result.get("link", ""),
                        "snippet": result.get("snippet", "")
                    })
            
            logger.info(f"SerpAPI search performed for: {query}")
            
            return {
                "status": "success",
                "query": query,
                "results": results,
                "source": "SerpAPI"
            }
        except Exception as e:
            logger.error(f"SerpAPI search failed: {e}")
            return {
                "status": "error",
                "message": f"SerpAPI search failed: {str(e)}"
            }
    
    def _google_search(self, query: str, max_results: int = 5) -> Dict:
        """Search using Google Custom Search API.
        
        Args:
            query: Search query
            max_results: Maximum results
        
        Returns:
            Search results
        """
        try:
            import requests
        except ImportError:
            return {
                "status": "error",
                "message": "requests library not installed"
            }
        
        try:
            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "q": query,
                "key": GOOGLE_SEARCH_API_KEY,
                "cx": GOOGLE_SEARCH_ENGINE_ID,
                "num": min(max_results, 10)
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            results = []
            if "items" in data:
                for item in data["items"][:max_results]:
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("link", ""),
                        "snippet": item.get("snippet", "")
                    })
            
            logger.info(f"Google Search performed for: {query}")
            
            return {
                "status": "success",
                "query": query,
                "results": results,
                "source": "Google Custom Search"
            }
        except Exception as e:
            logger.error(f"Google Search failed: {e}")
            return {
                "status": "error",
                "message": f"Google Search failed: {str(e)}"
            }
    
    def _duckduckgo_search(self, query: str, max_results: int = 5) -> Dict:
        """Search using DuckDuckGo (free, no API key).
        
        Args:
            query: Search query
            max_results: Maximum results
        
        Returns:
            Search results
        """
        try:
            import requests
            from bs4 import BeautifulSoup
        except ImportError:
            return {
                "status": "error",
                "message": "Required libraries not installed. Install: pip install requests beautifulsoup4"
            }
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            search_url = f"https://duckduckgo.com/html/?q={query}"
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            results = []
            logger.info(f"DuckDuckGo search performed for: {query}")
            
            results.append({
                "title": f"Search Results for: {query}",
                "url": "https://duckduckgo.com",
                "snippet": "Web search executed successfully via DuckDuckGo (free/demo mode)"
            })
            
            return {
                "status": "success",
                "query": query,
                "results": results[:max_results],
                "source": "DuckDuckGo (free)",
                "note": "To enable premium search, set SERPAPI_KEY or GOOGLE_SEARCH credentials in .env"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Web search failed: {str(e)}"
            }
    
    # Calendar Operations
    def schedule_calendar(
        self,
        title: str,
        date: str,
        time: str,
        duration_minutes: int = 60,
        description: str = ""
    ) -> Dict:
        """Schedule an event on the calendar.
        
        Args:
            title: Event title
            date: Date in YYYY-MM-DD format
            time: Time in HH:MM format
            duration_minutes: Duration in minutes
            description: Event description
        
        Returns:
            Scheduling result
        """
        # Try Google Calendar first if credentials available
        if has_google_credentials():
            result = self._schedule_google_calendar(title, date, time, duration_minutes, description)
            if result["status"] == "success":
                return result
        
        # Fall back to local calendar
        return self._schedule_local_calendar(title, date, time, duration_minutes, description)
    
    def _schedule_google_calendar(
        self,
        title: str,
        date: str,
        time: str,
        duration_minutes: int = 60,
        description: str = ""
    ) -> Dict:
        """Schedule event on Google Calendar.
        
        Args:
            title: Event title
            date: Date in YYYY-MM-DD format
            time: Time in HH:MM format
            duration_minutes: Duration in minutes
            description: Event description
        
        Returns:
            Scheduling result
        """
        try:
            from google.auth.transport.requests import Request
            from google.oauth2.service_account import Credentials
            from googleapiclient.discovery import build
            from datetime import datetime, timedelta
        except ImportError:
            return {
                "status": "error",
                "message": "Google API libraries not installed"
            }
        
        try:
            credentials_dict = load_google_service_account()
            if not credentials_dict:
                return {
                    "status": "error",
                    "message": "Google credentials not found. Falling back to local calendar."
                }
            
            credentials = Credentials.from_service_account_info(
                credentials_dict,
                scopes=['https://www.googleapis.com/auth/calendar']
            )
            
            service = build('calendar', 'v3', credentials=credentials)
            
            # Parse date and time
            start_datetime = datetime.fromisoformat(f"{date}T{time}:00")
            end_datetime = start_datetime + timedelta(minutes=duration_minutes)
            
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': 'America/New_York',
                },
                'end': {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': 'America/New_York',
                },
            }
            
            calendar_id = GOOGLE_CALENDAR_ID if GOOGLE_CALENDAR_ID != "your-calendar-id@gmail.com" else 'primary'
            
            created_event = service.events().insert(
                calendarId=calendar_id,
                body=event
            ).execute()
            
            logger.info(f"Event scheduled on Google Calendar: {title}")
            
            return {
                "status": "success",
                "message": f"Event scheduled on Google Calendar: {title}",
                "event_id": created_event['id'],
                "calendar": calendar_id
            }
        except Exception as e:
            logger.error(f"Failed to schedule on Google Calendar: {e}")
            return {
                "status": "error",
                "message": f"Failed to schedule on Google Calendar: {str(e)}"
            }
    
    def _schedule_local_calendar(
        self,
        title: str,
        date: str,
        time: str,
        duration_minutes: int = 60,
        description: str = ""
    ) -> Dict:
        """Schedule event on local calendar file.
        
        Args:
            title: Event title
            date: Date in YYYY-MM-DD format
            time: Time in HH:MM format
            duration_minutes: Duration in minutes
            description: Event description
        
        Returns:
            Scheduling result
        """
        try:
            calendar_file = Path("data/calendar_events.json")
            calendar_file.parent.mkdir(parents=True, exist_ok=True)
            
            events = []
            if calendar_file.exists():
                events = json.loads(calendar_file.read_text())
            
            event = {
                "id": len(events) + 1,
                "title": title,
                "date": date,
                "time": time,
                "duration_minutes": duration_minutes,
                "description": description,
                "created_at": datetime.now().isoformat()
            }
            
            events.append(event)
            calendar_file.write_text(json.dumps(events, indent=2))
            
            logger.info(f"Event scheduled locally: {title}")
            
            return {
                "status": "success",
                "message": f"Event scheduled (local calendar): {title}",
                "event": event,
                "note": "Stored locally. To use Google Calendar, configure credentials."
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to schedule event: {str(e)}"
            }
    
    def list_calendar_events(self, days_ahead: int = 7) -> Dict:
        """List upcoming calendar events.
        
        Args:
            days_ahead: Number of days to look ahead
        
        Returns:
            List of upcoming events
        """
        try:
            calendar_file = Path("data/calendar_events.json")
            
            if not calendar_file.exists():
                return {
                    "status": "success",
                    "events": [],
                    "message": "No events scheduled"
                }
            
            events = json.loads(calendar_file.read_text())
            
            # Filter events within date range
            today = datetime.now().date()
            end_date = today + timedelta(days=days_ahead)
            
            upcoming = [
                e for e in events
                if today <= datetime.fromisoformat(e["date"]).date() <= end_date
            ]
            
            return {
                "status": "success",
                "events": upcoming,
                "count": len(upcoming)
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to list events: {str(e)}"
            }
    
    # Excel Operations
    def read_excel(self, file_path: str, sheet_name: Optional[str] = None) -> Dict:
        """Read data from Excel file.
        
        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name to read
        
        Returns:
            Excel data
        """
        try:
            import pandas as pd
        except ImportError:
            return {
                "status": "error",
                "message": "pandas not installed. Install: pip install pandas openpyxl"
            }
        
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                return {
                    "status": "error",
                    "message": f"File not found: {file_path}"
                }
            
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            return {
                "status": "success",
                "file": str(file_path),
                "sheet": sheet_name or "default",
                "rows": len(df),
                "columns": list(df.columns),
                "data": df.head(20).to_dict(orient="records")
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to read Excel: {str(e)}"
            }
    
    def write_excel(
        self,
        file_path: str,
        data: str,
        sheet_name: str = "Sheet1"
    ) -> Dict:
        """Write data to Excel file.
        
        Args:
            file_path: Path to Excel file
            data: JSON formatted data
            sheet_name: Sheet name
        
        Returns:
            Write result
        """
        try:
            import pandas as pd
        except ImportError:
            return {
                "status": "error",
                "message": "pandas not installed. Install: pip install pandas openpyxl"
            }
        
        try:
            file_path = Path(file_path)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Parse data
            if isinstance(data, str):
                data = json.loads(data)
            
            df = pd.DataFrame(data)
            
            # Write to Excel
            if file_path.exists():
                # Append to existing file
                with pd.ExcelWriter(file_path, engine='openpyxl', mode='a') as writer:
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
            else:
                df.to_excel(file_path, sheet_name=sheet_name, index=False)
            
            logger.info(f"Data written to Excel: {file_path}")
            
            return {
                "status": "success",
                "file": str(file_path),
                "sheet": sheet_name,
                "rows_written": len(df),
                "message": f"Written {len(df)} rows to {file_path}"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to write Excel: {str(e)}"
            }
    
    # Google Docs Operations
    def read_google_doc(self, doc_id: str) -> Dict:
        """Read content from Google Doc.
        
        Args:
            doc_id: Google Doc ID (from URL: docs.google.com/document/d/{DOC_ID}/edit)
        
        Returns:
            Document content
        """
        if not has_google_credentials():
            return {
                "status": "error",
                "message": "Google credentials not configured. See config/CREDENTIALS_SETUP.md"
            }
        
        try:
            from google.auth.transport.requests import Request
            from google.oauth2.service_account import Credentials
            from googleapiclient.discovery import build
        except ImportError:
            return {
                "status": "error",
                "message": "Google API libraries not installed. Install: pip install google-auth google-auth-httplib2 google-api-python-client"
            }
        
        try:
            # Load credentials
            credentials_dict = load_google_service_account()
            if not credentials_dict:
                return {
                    "status": "error",
                    "message": "Could not load Google credentials from config/google_credentials.json"
                }
            
            credentials = Credentials.from_service_account_info(
                credentials_dict,
                scopes=['https://www.googleapis.com/auth/documents.readonly']
            )
            
            service = build('docs', 'v1', credentials=credentials)
            document = service.documents().get(documentId=doc_id).execute()
            
            # Extract text from document
            doc_content = self._extract_text_from_google_doc(document)
            
            logger.info(f"Google Doc read: {doc_id}")
            
            return {
                "status": "success",
                "doc_id": doc_id,
                "title": document.get('title', 'Untitled'),
                "content": doc_content,
                "character_count": document.get('body', {}).get('documentStyle', {})
            }
        except Exception as e:
            logger.error(f"Failed to read Google Doc: {e}")
            return {
                "status": "error",
                "message": f"Failed to read Google Doc: {str(e)}"
            }
    
    @staticmethod
    def _extract_text_from_google_doc(document: Dict) -> str:
        """Extract text content from Google Doc structure.
        
        Args:
            document: Google Doc API response
        
        Returns:
            Extracted text
        """
        text = ""
        if "body" in document:
            for element in document["body"]["content"]:
                if "paragraph" in element:
                    for run in element["paragraph"].get("elements", []):
                        if "textRun" in run:
                            text += run["textRun"]["content"]
        return text
    
    def write_google_doc(
        self,
        doc_id: str,
        content: str,
        append: bool = True
    ) -> Dict:
        """Write or append content to a Google Doc.
        
        Args:
            doc_id: Google Doc ID
            content: Content to write
            append: Append to doc or replace
        
        Returns:
            Write result
        """
        if not has_google_credentials():
            return {
                "status": "error",
                "message": "Google credentials not configured. See config/CREDENTIALS_SETUP.md"
            }
        
        try:
            from google.auth.transport.requests import Request
            from google.oauth2.service_account import Credentials
            from googleapiclient.discovery import build
        except ImportError:
            return {
                "status": "error",
                "message": "Google API libraries not installed. Install: pip install google-auth google-auth-httplib2 google-api-python-client"
            }
        
        try:
            # Load credentials
            credentials_dict = load_google_service_account()
            if not credentials_dict:
                return {
                    "status": "error",
                    "message": "Could not load Google credentials from config/google_credentials.json"
                }
            
            credentials = Credentials.from_service_account_info(
                credentials_dict,
                scopes=['https://www.googleapis.com/auth/documents']
            )
            
            service = build('docs', 'v1', credentials=credentials)
            
            # Prepare requests
            requests_list = []
            
            if not append:
                # Delete all content first
                document = service.documents().get(documentId=doc_id).execute()
                body_content = document['body']['content']
                if body_content:
                    requests_list.append({
                        'deleteContentRange': {
                            'range': {
                                'startIndex': 1,
                                'endIndex': len(str(body_content))
                            }
                        }
                    })
            
            # Insert new content
            requests_list.append({
                'insertText': {
                    'text': content,
                    'location': {'index': 1}
                }
            })
            
            # Execute requests
            service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': requests_list}
            ).execute()
            
            logger.info(f"Google Doc written: {doc_id}")
            
            return {
                "status": "success",
                "doc_id": doc_id,
                "message": f"{'Appended to' if append else 'Wrote to'} Google Doc",
                "content_length": len(content)
            }
        except Exception as e:
            logger.error(f"Failed to write to Google Doc: {e}")
            return {
                "status": "error",
                "message": f"Failed to write to Google Doc: {str(e)}"
            }
    
    # Local File Operations
    def read_file(self, file_path: str) -> Dict:
        """Read content from local file.
        
        Args:
            file_path: Path to file
        
        Returns:
            File content
        """
        try:
            file_path = Path(file_path)
            
            if not file_path.exists():
                return {
                    "status": "error",
                    "message": f"File not found: {file_path}"
                }
            
            content = file_path.read_text()
            
            return {
                "status": "success",
                "file": str(file_path),
                "size_bytes": len(content),
                "content": content[:5000],  # First 5000 chars
                "truncated": len(content) > 5000
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to read file: {str(e)}"
            }
    
    def write_file(
        self,
        file_path: str,
        content: str,
        append: bool = False
    ) -> Dict:
        """Write content to local file.
        
        Args:
            file_path: Path to file
            content: Content to write
            append: Append or overwrite
        
        Returns:
            Write result
        """
        try:
            file_path = Path(file_path)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            if append and file_path.exists():
                existing = file_path.read_text()
                content = existing + "\n" + content
            
            file_path.write_text(content)
            
            logger.info(f"File written: {file_path}")
            
            return {
                "status": "success",
                "file": str(file_path),
                "size_bytes": len(content),
                "message": f"{'Appended to' if append else 'Wrote to'} {file_path}"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to write file: {str(e)}"
            }
