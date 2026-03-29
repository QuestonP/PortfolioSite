import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Search,
  Plus,
  Star,
  Trash2,
  Library,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { ChatMessage, ToolActivity } from '../types';
import { streamAgentChat } from '../api';

interface AIChatProps {
  onLibraryUpdate: () => void;
  initialMessage?: string;
  onInitialMessageUsed: () => void;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_books: <Search size={12} />,
  get_library: <Library size={12} />,
  get_book_summary: <Library size={12} />,
  add_book: <Plus size={12} />,
  mark_as_read: <Star size={12} />,
  remove_book: <Trash2 size={12} />,
  get_recommendations: <Sparkles size={12} />,
  web_search: <Search size={12} />,
  get_book_details: <Search size={12} />,
};

const TOOL_LABELS: Record<string, string> = {
  search_books: 'Searching books...',
  get_library: 'Reading your library...',
  get_book_summary: 'Reading notes & summary...',
  add_book: 'Adding book...',
  mark_as_read: 'Updating status...',
  remove_book: 'Removing book...',
  get_recommendations: 'Finding recommendations...',
  web_search: 'Searching the web...',
  get_book_details: 'Looking up book details...',
};

function formatMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="font-semibold text-white mt-2 mb-1 text-sm">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="font-semibold text-white mt-2 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="font-semibold text-white">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <li key={key++} className="flex gap-2 items-start">
          <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
          <span>
            {parts.map((p, i) =>
              i % 2 === 1 ? <strong key={i} className="text-white">{p}</strong> : p
            )}
          </span>
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1" />);
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={key++}>
          {parts.map((p, i) =>
            i % 2 === 1 ? <strong key={i} className="text-white">{p}</strong> : p
          )}
        </p>
      );
    }
  }

  return <div className="prose-chat space-y-0.5">{elements}</div>;
}

export const AIChat: React.FC<AIChatProps> = ({
  onLibraryUpdate,
  initialMessage,
  onInitialMessageUsed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **BookBot**, your AI library assistant. I can search for books, give you personalized recommendations, and update your library. What can I help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTools, setActiveTools] = useState<ToolActivity[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, activeTools]);

  // Handle initial message from hero
  useEffect(() => {
    if (initialMessage && !isStreaming) {
      setIsOpen(true);
      setIsMinimized(false);
      setTimeout(() => {
        sendMessage(initialMessage);
        onInitialMessageUsed();
      }, 300);
    }
  }, [initialMessage]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsStreaming(true);
      setActiveTools([]);

      // Build API messages (exclude the greeting)
      const apiMessages = [...messages.filter(m => m.id !== '0'), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Placeholder for assistant response
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          toolActivity: [],
        },
      ]);

      let fullText = '';

      abortRef.current = streamAgentChat(apiMessages, (event) => {
        switch (event.type) {
          case 'delta': {
            const { text: chunk } = event.data as { text: string };
            fullText += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullText } : m
              )
            );
            break;
          }
          case 'tool_start': {
            const { name } = event.data as { name: string };
            setActiveTools((prev) => [...prev, { name, status: 'running' }]);
            break;
          }
          case 'tool_result': {
            const { name } = event.data as { name: string };
            setActiveTools((prev) =>
              prev.map((t) => (t.name === name ? { ...t, status: 'done' } : t))
            );
            break;
          }
          case 'done': {
            const { libraryUpdated } = event.data as { libraryUpdated: boolean };
            if (libraryUpdated) onLibraryUpdate();
            setIsStreaming(false);
            setActiveTools([]);
            break;
          }
          case 'error': {
            const { message: errMsg } = event.data as { message: string };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content || `Sorry, an error occurred: ${errMsg}` }
                  : m
              )
            );
            setIsStreaming(false);
            setActiveTools([]);
            break;
          }
        }
      });
    },
    [isStreaming, messages, onLibraryUpdate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setActiveTools([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 animate-pulse-ring"
        title="Open BookBot"
      >
        <Sparkles className="text-white" size={22} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-navy-800 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 transition-all duration-300 ${
        isMinimized ? 'h-14 w-80' : 'w-80 sm:w-96 h-[580px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-700/50 rounded-t-2xl bg-navy-900/50">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">BookBot</p>
          <p className="text-xs text-slate-500 truncate">
            {isStreaming ? 'Thinking...' : 'AI Library Assistant'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMinimized ? <ChevronDown size={15} /> : <Minimize2 size={15} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <div className="chat-bubble-ai">
                      {msg.content ? (
                        formatMarkdown(msg.content)
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Loader2 size={12} className="animate-spin" />
                          <span className="text-xs">Thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="chat-bubble-user">{msg.content}</div>
                )}
              </div>
            ))}

            {/* Active tool indicators */}
            {activeTools.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={10} className="text-white" />
                </div>
                <div className="space-y-1.5">
                  {activeTools.map((tool, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        tool.status === 'running'
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {tool.status === 'running' ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <span>✓</span>
                      )}
                      {TOOL_ICONS[tool.name]}
                      {tool.status === 'running'
                        ? TOOL_LABELS[tool.name] ?? tool.name
                        : `Done: ${tool.name.replace(/_/g, ' ')}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-slate-700/50">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about books, get recommendations..."
                rows={1}
                className="flex-1 bg-navy-900 border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none transition-colors"
                style={{ maxHeight: '80px' }}
                disabled={isStreaming}
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="flex-shrink-0 w-9 h-9 bg-red-500 hover:bg-red-400 rounded-xl flex items-center justify-center transition-colors"
                  title="Stop"
                >
                  <X size={15} className="text-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send size={15} className="text-white" />
                </button>
              )}
            </form>
            <p className="text-xs text-slate-700 text-center mt-1.5">
              Powered by Claude · claude-sonnet-4-6
            </p>
          </div>
        </>
      )}
    </div>
  );
};
