# Frontend Components Summary

Complete documentation of all React components in the Strategic AI Assistant.

## 📦 Component Overview

The frontend consists of 3 main React components, 1 store for state management, and global styling.

## 🎨 Component Tree

```
App.tsx (Root)
├── ChatInterface.tsx (Main container)
│   ├── Sidebar (Agent status & tools)
│   ├── Header (Controls & status)
│   ├── ChatMessage.tsx (Per message)
│   │   ├── Avatar (User/Agent icon)
│   │   ├── Bubble (Message content)
│   │   └── Timestamp
│   ├── Input Form
│   │   ├── Text Input
│   │   └── Send Button
│   └── ToolPanel.tsx (Expandable, conditional)
│       ├── Tool Categories
│       │   └── Tool Items
│       │       ├── Tool Header
│       │       ├── Parameters List
│       │       └── Execute Button
│       └── Footer Info

Store: agentStore.ts
├── agentStatus (State)
├── isLoading
├── error
├── refreshStatus (Action)
└── clearError (Action)

Global: index.css
├── Tailwind directives
├── Custom animations
├── Global styles
└── Scrollbar styling
```

## 📄 Component Details

### 1. App.tsx (Root Component)

**Purpose**: Application entry point and setup

**Responsibilities**:
- Initialize agent status polling
- Render ChatInterface
- Manage global setup

**Key Features**:
- Auto-refresh status every 10 seconds
- Error boundary ready
- Global app container

**Props**: None (root component)

**State**: Uses `useStore` from Zustand

```typescript
function App() {
  const { refreshStatus } = useStore();

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 10000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return (
    <div className="w-full h-screen bg-dark-bg">
      <ChatInterface />
    </div>
  );
}
```

---

### 2. ChatInterface.tsx (Main Container)

**Purpose**: Main chat UI container with layout

**Responsibilities**:
- Manage message history
- Handle user input
- Control sidebar visibility
- Toggle tool panel
- Coordinate all sub-components

**Key Features**:
- Responsive layout (sidebar toggle)
- Real-time message streaming
- Loading indicators
- Welcome screen
- Smooth animations

**Props**: None

**State**:
- `messages` - Message history array
- `input` - Current input text
- `isLoading` - Loading state
- `isSidebarOpen` - Sidebar visibility

**Sub-components**:
- Sidebar with agent status
- Header with controls
- Message list with auto-scroll
- Input form
- Tool panel (conditional)
- ChatMessage components

**Key Methods**:
- `handleSendMessage()` - POST to /chat endpoint
- `scrollToBottom()` - Auto-scroll messages

**Animations**:
- Container fade-in
- Message stagger animation
- Typing indicator dots
- Tool panel slide-in

---

### 3. ChatMessage.tsx (Message Bubble)

**Purpose**: Individual message display with styling

**Responsibilities**:
- Render message content
- Display avatar
- Show timestamp
- Apply appropriate styling

**Key Features**:
- Different styling for user/assistant
- Gradient avatars
- Spring animations on entry
- Responsive width

**Props**:
```typescript
interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}
```

**Styling**:
- **User**: Blue gradient background, right-aligned, rounded bottom-left
- **Assistant**: Dark surface with border, left-aligned, rounded bottom-right
- **Text**: White for user, light gray for assistant

**Animations**:
- Initial: opacity 0, offset by 20px
- Entrance: Spring animation (stiffness: 100, damping: 15)
- Bubble scaleX from 0.8 to 1

---

### 4. ToolPanel.tsx (Tool Execution)

**Purpose**: Display and execute available tools

**Responsibilities**:
- List all 9 tools grouped by category
- Show tool details on expand
- Handle tool execution
- Manage expand/collapse state

**Key Features**:
- Grouped by category (Information, Calendar, Files)
- Expandable details
- Parameter display
- Execute button
- Slide-in animation

**Props**:
```typescript
interface ToolPanelProps {
  onClose: () => void;
}
```

**Tool Categories**:
- **Information**: Web Search, List Calendar Events
- **Calendar**: Schedule Calendar, List Calendar Events
- **Files**: Read Excel, Write Excel, Read Google Docs, Write Google Docs

**State**:
- `expandedTool` - Currently expanded tool name

**Animations**:
- Panel: Slide in from right
- Tools: Fade and rise on load
- Hover: Move right 4px
- Expand: Height animation + rotate chevron

---

### 5. agentStore.ts (State Management)

**Purpose**: Global state management with Zustand

**Responsibilities**:
- Store agent status
- Store loading state
- Store error messages
- Provide API communication methods

**Key Features**:
- Lightweight store using Zustand
- Axios for HTTP calls
- Type-safe interfaces
- Error handling

**Interfaces**:
```typescript
interface Tool {
  name: string;
  description: string;
}

interface AgentStatus {
  healthy: boolean;
  model: string;
  version: string;
  tools: Tool[];
  memory_size: number;
}

interface AgentStore {
  agentStatus: AgentStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  clearError: () => void;
}
```

**API Calls**:
- `GET /status` - Fetch agent status
- Polls every 10 seconds from App.tsx

**Error Handling**:
- Stores error message in state
- Auto-clear with `clearError()`

---

## 🎨 Styling System

### Global Styles (index.css)

**Tailwind Directives**:
- `@tailwind base` - Base styles
- `@tailwind components` - Component utilities
- `@tailwind utilities` - Utility classes

**Custom Scrollbar**:
```css
::-webkit-scrollbar-thumb {
  background: #2a3255;  /* dark-border */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6366f1;  /* dark-accent */
}
```

**Custom Animations**:
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Tailwind Classes Used

**Colors**:
- `bg-dark-bg` - Background
- `bg-dark-surface` - Main surfaces
- `bg-dark-surface-alt` - Alternative surfaces
- `text-dark-text` - Main text
- `text-dark-text-muted` - Secondary text
- `border-dark-border` - Borders
- `bg-dark-accent` - Interactive elements
- `hover:bg-dark-accent-hover` - Hover state

**Spacing**:
- `px-4` `py-3` - Button/input padding
- `p-6` - Section padding
- `gap-4` - Element gaps
- `mb-4` - Margin bottom

**Effects**:
- `rounded-lg` - Rounded corners
- `border` - Borders
- `transition-colors` - Smooth color changes
- `focus:outline-none` - Removes default focus ring

---

## ⚙️ Component Props & Types

### Message Type
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

### Chat Request
Sent to POST `/chat`:
```json
{
  "query": "What is strategic planning?"
}
```

### Chat Response
Received from `/chat`:
```json
{
  "response": "Strategic planning is...",
  "tool_used": null,
  "timestamp": "2024-01-15T10:30:45"
}
```

---

## 🎬 Animation Specifications

### Entrance Animations
```typescript
// Component entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: 'spring', stiffness: 100, damping: 15 }}
```

### Hover Effects
```typescript
// Scale on hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Staggered Children
```typescript
// Messages enter one after another
variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
```

### Loading Animation
```typescript
// Typing indicator dots
animate={{ y: [0, -8, 0] }}
transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity }}
```

---

## 🔄 Data Flow

### User sends message:
1. User types in input field (state update)
2. User presses Enter or clicks Send
3. `handleSendMessage()` creates Message object
4. Add user message to state
5. POST to `/chat` endpoint
6. Receive response from backend
7. Add assistant message to state
8. Auto-scroll to bottom
9. Clear input field

### Agent status updates:
1. App.tsx calls `refreshStatus()` on mount
2. `refreshStatus()` calls `GET /status`
3. Update `agentStatus` in Zustand store
4. ChatInterface reads from store
5. Display status indicator in sidebar
6. Schedule next update (10 second interval)

### Tool execution:
1. User clicks tool in ToolPanel
2. Tool expands to show parameters
3. User clicks Execute
4. POST to `/tool` endpoint (future)
5. Show result in chat or panel
6. Update agent status if needed

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Sidebar: Always visible, 256px
- Main area: Full remaining width
- Tool panel: Slide-in from right

### Tablet (768px-1023px)
- Sidebar: Toggleable with button
- Main area: Full width when sidebar hidden
- Tool panel: Full height modal

### Mobile (<768px)
- Sidebar: Hidden by default, toggle overlay
- Main area: Full width
- Tool panel: Bottom sheet

---

## ♿ Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation (Tab/Shift+Tab)
- ✅ Focus visible states (ring-2)
- ✅ Color contrast ratio > 4.5:1
- ✅ Reduced motion support
- ✅ Screen reader friendly

---

## 🚀 Performance Optimizations

- ✅ React.memo for message components
- ✅ useCallback for event handlers
- ✅ useRef for DOM access (scroll)
- ✅ Lazy loading of tool panel
- ✅ Virtual scrolling ready (future)
- ✅ Debounced window resize

---

## 🔧 Configuration

### Vite Config (`vite.config.ts`)
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000',
    '/ws': 'ws://localhost:8000'
  }
}
```

### Tailwind Config (`tailwind.config.ts`)
- Dark color theme
- Custom animations
- Extended utilities

### TypeScript Config (`tsconfig.json`)
- Target: ES2020
- Strict mode enabled
- JSX: react-jsx

---

## 📚 Component Dependency Graph

```
App.tsx
 ↓
ChatInterface.tsx
 ├─→ ChatMessage.tsx
 ├─→ ToolPanel.tsx
 └─→ agentStore.ts (Zustand)
     └─→ axios (HTTP)

Global:
 ├─→ index.css (Tailwind)
 ├─→ tailwind.config.ts
 ├─→ vite.config.ts
 └─→ package.json (dependencies)
```

---

## 🧪 Testing Checklist

- [ ] Messages send and receive correctly
- [ ] Animations are smooth (60fps)
- [ ] Sidebar toggle works
- [ ] Tool panel expands/collapses
- [ ] Scroll-to-bottom works
- [ ] Loading indicator animates
- [ ] Agent status updates periodically
- [ ] Errors display properly
- [ ] Responsive on all screen sizes
- [ ] Keyboard navigation works
- [ ] WebSocket connects (future)

---

## 🎓 Component Development Guide

### To Create a New Component

1. Create file in `src/components/ComponentName.tsx`
2. Import React, Framer Motion, icons, types
3. Define interfaces for props and state
4. Create component function
5. Add animations with Framer Motion
6. Apply Tailwind classes
7. Add exports to parent component

### To Add a Tool to Panel

1. Add to tools array in ToolPanel.tsx
2. Include name, description, icon, category, parameters
3. Tool will automatically group and display
4. Add execute handler logic

### To Modify Styling

1. Use Tailwind classes in JSX
2. Reference `tailwind.config.ts` for custom colors
3. Update global styles in `index.css` for animations
4. Test dark theme compatibility

---

This document serves as the complete frontend architecture reference. For more details, see [frontend/README.md](frontend/README.md) and [frontend/UI_GUIDE.md](frontend/UI_GUIDE.md).
