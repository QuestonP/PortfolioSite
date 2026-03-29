import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'
import { useChatAgent } from './useChatAgent'

const SUGGESTIONS = [
  "What projects has Quest built?",
  "What's Quest's current role?",
  "What is Quest's tech stack?",
  "Tell me about Quest's background",
]

export default function ChatPanel({ onClose }) {
  const { messages, sendMessage, isTyping, connected } = useChatAgent()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col bg-surface border border-white/10 shadow-2xl"
         style={{ width: '360px', height: '520px' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-500'}`} />
          <span className="font-mono text-xs text-text font-bold tracking-wide">QUEST AI</span>
          <span className="font-body text-xs text-muted">— Ask me anything</span>
        </div>
        <button onClick={onClose}
                className="text-muted hover:text-text transition-colors duration-150 p-0.5">
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.map(msg => (
          <div key={msg.id}
               className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 text-sm font-body leading-relaxed ${
              msg.type === 'user'
                ? 'bg-accent text-bg'
                : msg.type === 'error'
                ? 'border border-red-500/30 bg-red-500/5 text-red-400'
                : 'border border-white/8 bg-surface2 text-text'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Suggested questions — only before user sends anything */}
        {messages.length === 1 && (
          <div className="space-y-1.5 mt-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                      className="w-full text-left px-3 py-1.5 text-xs font-body text-muted border border-white/8 hover:border-accent/40 hover:text-text hover:bg-accent/5 transition-all duration-150">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="border border-white/8 bg-surface2 px-3 py-2 flex gap-1 items-center">
              {[0, 150, 300].map(delay => (
                <div key={delay}
                     className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                     style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-3 py-3 border-t border-white/8 flex-shrink-0">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about Quest..."
          disabled={isTyping}
          className="flex-1 bg-surface2 border border-white/10 text-text text-sm font-body px-3 py-2 outline-none resize-none placeholder-muted focus:border-accent/50 transition-colors duration-150 disabled:opacity-50"
          style={{ maxHeight: '80px' }}
        />
        <button onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-bg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
          <Send size={13} />
        </button>
      </div>
    </div>
  )
}
