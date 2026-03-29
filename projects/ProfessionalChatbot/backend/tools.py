"""
Agent tools for email and calendar operations.
"""
import base64
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any

try:
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False
    print("⚠️  Google API client not installed. Email/calendar tools unavailable.")
    print("   Install with: pip install google-auth-oauthlib google-api-python-client")


# Gmail & Google Calendar scopes
GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar'
]


def get_google_creds():
    """Load or refresh Google OAuth credentials."""
    if not GOOGLE_AVAILABLE:
        return None
    
    creds = None
    token_path = "token.json"
    creds_path = "credentials.json"
    
    # Load existing token
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, GMAIL_SCOPES)
    
    # Refresh or create new token
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(creds_path):
                return None  # No credentials file
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, GMAIL_SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save token for next run
        with open(token_path, 'w') as token:
            token.write(creds.to_json())
    
    return creds


def send_email(to: str, subject: str, body: str) -> Dict[str, Any]:
    """
    Send an email via Gmail API.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body text
    
    Returns:
        Result dict with status and message
    """
    if not GOOGLE_AVAILABLE:
        return {
            "status": "error",
            "message": "Google API client not available. Install with: pip install google-auth-oauthlib google-api-python-client"
        }
    
    try:
        creds = get_google_creds()
        if not creds:
            return {
                "status": "error",
                "message": "Google credentials not found. Please set up OAuth (see README)."
            }
        
        service = build('gmail', 'v1', credentials=creds)
        
        # Build email message
        from email.mime.text import MIMEText
        message = MIMEText(body)
        message['to'] = to
        message['subject'] = subject
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        send_message = {'raw': raw_message}
        service.users().messages().send(userId='me', body=send_message).execute()
        
        return {
            "status": "success",
            "message": f"✅ Email sent to {to} with subject: '{subject}'"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to send email: {str(e)}"
        }


def schedule_meeting(
    title: str,
    attendee_email: str,
    start_time: str,
    duration_mins: int = 30
) -> Dict[str, Any]:
    """
    Schedule a meeting on Google Calendar.
    
    Args:
        title: Meeting title
        attendee_email: Attendee's email address
        start_time: ISO format datetime (e.g., '2025-01-15T14:00:00')
        duration_mins: Meeting duration in minutes (default 30)
    
    Returns:
        Result dict with status and message
    """
    if not GOOGLE_AVAILABLE:
        return {
            "status": "error",
            "message": "Google API client not available. Install with: pip install google-auth-oauthlib google-api-python-client"
        }
    
    try:
        creds = get_google_creds()
        if not creds:
            return {
                "status": "error",
                "message": "Google credentials not found. Please set up OAuth (see README)."
            }
        
        service = build('calendar', 'v3', credentials=creds)
        
        # Parse start time
        start = datetime.fromisoformat(start_time)
        end = start + timedelta(minutes=duration_mins)
        
        # Create event
        event = {
            'summary': title,
            'start': {
                'dateTime': start.isoformat(),
                'timeZone': 'America/Chicago'
            },
            'end': {
                'dateTime': end.isoformat(),
                'timeZone': 'America/Chicago'
            },
            'attendees': [{'email': attendee_email}],
        }
        
        service.events().insert(
            calendarId='primary',
            body=event,
            sendNotifications=True
        ).execute()
        
        return {
            "status": "success",
            "message": f"✅ Meeting '{title}' scheduled with {attendee_email} on {start.strftime('%Y-%m-%d at %H:%M')}"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to schedule meeting: {str(e)}"
        }


# Tool registry
TOOLS = {
    "send_email": {
        "description": "Send an email to a recipient.",
        "params": {
            "to": "str: recipient email address",
            "subject": "str: email subject",
            "body": "str: email body"
        },
        "handler": send_email,
        "enabled": GOOGLE_AVAILABLE
    },
    "schedule_meeting": {
        "description": "Schedule a meeting on your calendar and invite an attendee.",
        "params": {
            "title": "str: meeting title",
            "attendee_email": "str: attendee email",
            "start_time": "str: ISO format datetime (e.g., 2025-01-15T14:00:00)",
            "duration_mins": "int: meeting duration in minutes (default 30)"
        },
        "handler": schedule_meeting,
        "enabled": GOOGLE_AVAILABLE
    }
}
