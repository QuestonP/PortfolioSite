import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import ChatPanel from './ChatPanel'

const CHAT_ENABLED = import.meta.env.VITE_CHAT_ENABLED === 'true'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  if (!CHAT_ENABLED) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          disabled
          title="AI Chat — Coming Soon"
          className="w-12 h-12 flex items-center justify-center bg-surface border border-white/[0.06] text-muted cursor-not-allowed shadow-lg"
          aria-label="AI Chat coming soon"
        >
          <MessageCircle size={20} className="opacity-40" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-surface2 border border-white/[0.06] text-xs font-mono text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
          AI Chat — Coming Soon
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <div
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          transformOrigin: 'bottom right',
        }}
      >
        <ChatPanel onClose={() => setOpen(false)} />
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-12 h-12 flex items-center justify-center bg-accent text-bg shadow-accent hover:bg-accent/90 transition-all duration-200"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open
          ? <X size={20} />
          : <MessageCircle size={20} />
        }
      </button>
    </div>
  )
}
