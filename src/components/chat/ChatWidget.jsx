import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import ChatPanel from './ChatPanel'
import { EASE } from '../../motion/tokens'

const CHAT_ENABLED = import.meta.env.VITE_CHAT_ENABLED === 'true'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  if (!CHAT_ENABLED) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          disabled
          title="AI chat — coming soon"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-muted2 cursor-not-allowed"
          aria-label="AI chat coming soon"
        >
          <MessageCircle size={16} className="opacity-50" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 rounded-sm bg-surface2 border border-border font-mono text-[11px] text-muted2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
          AI chat — coming soon
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border2 text-text hover:bg-surface2 transition-colors duration-200"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X size={16} /> : <MessageCircle size={16} />}
      </button>
    </div>
  )
}
