# Strategic AI Assistant - Frontend

Modern React-based web interface for the Strategic AI Assistant Agent. Built with Vite, TypeScript, Tailwind CSS, and Framer Motion for a sharp, responsive dark-themed experience.

## Features

- **Real-time Chat Interface** - Seamless conversation with the local AI agent
- **Dark Theme** - Sharp, modern design with custom dark color palette
- **Tool Panel** - Execute available tools directly from the UI
- **Agent Status** - Real-time health and resource monitoring
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Responsive Design** - Works on desktop and tablet devices
- **WebSocket Support** - Real-time message streaming from the agent

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management
- **Axios** - HTTP client

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running at `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173` with hot module replacement.

### Build

```bash
npm run build
```

Production-ready bundle in `dist/` directory.

### Preview Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat UI component
│   │   ├── ChatMessage.tsx        # Individual message bubble
│   │   └── ToolPanel.tsx          # Tool execution panel
│   ├── store/
│   │   └── agentStore.ts          # Zustand state management
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind directives
├── index.html                      # HTML template
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## Components

### ChatInterface
Main container managing the chat experience:
- Message display with animations
- User input form
- Sidebar with agent status and available tools
- Tool panel toggling

### ChatMessage
Individual message component:
- Different styling for user/assistant messages
- Avatar with gradient backgrounds
- Timestamp display
- Spring animations

### ToolPanel
Expandable tool listing:
- Grouped by category
- Parameter display
- Quick execute buttons
- Collapse/expand animations

## Styling

Dark theme color palette:
- **Primary Background**: `#0a0e27` - Deep blue-black
- **Surface**: `#151b3f` - Slightly lighter blue
- **Surface Alt**: `#1a2047` - Lightest surface
- **Accent**: `#6366f1` - Indigo for highlights
- **Border**: `#2d3454` - Subtle dividers
- **Text**: `#f0f2f5` - Off-white text
- **Text Muted**: `#8b92b8` - Dimmed text

## Configuration

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ENABLE_TOOLS=true
VITE_ENABLE_STREAMING=true
```

## API Integration

The frontend communicates with the backend via:

- **REST API** - Chat submissions, status checks, history
- **WebSocket** - Real-time message streaming

Key endpoints:
- `POST /chat` - Send message to agent
- `GET /status` - Get agent status
- `GET /tools` - List available tools
- `WS /ws/chat` - Real-time streaming

## Performance

- **Code Splitting** - Automatic chunk splitting by Vite
- **Tree Shaking** - Unused code removal
- **Image Optimization** - Lazy loading for images
- **Bundle Size** - ~180KB gzipped (dependencies included)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Connection Issues

If you see "Cannot connect to API":

1. Ensure backend is running: `uvicorn backend.main:app --reload`
2. Check `VITE_API_URL` matches backend address
3. Verify CORS is enabled in backend

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Development Tips

- Use `npm run dev` for development with HMR
- Check browser console for API errors
- Use React DevTools for component debugging
- Monitor network tab for API calls

## License

Part of the Strategic AI Assistant project
