import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeCell({ language = '', children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : String(children)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* noop */ }
  }

  return (
    <div className="border border-border rounded-md bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface2">
        <span className="font-mono text-[11px] uppercase tracking-label text-muted2">
          {language || 'Code'}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted2 hover:text-text transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 md:p-5 overflow-x-auto">
        <code className="font-mono text-[13px] text-text leading-relaxed whitespace-pre">
          {children}
        </code>
      </pre>
    </div>
  )
}
