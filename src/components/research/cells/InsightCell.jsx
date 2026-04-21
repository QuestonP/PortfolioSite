import { Lightbulb } from 'lucide-react'

export default function InsightCell({ label = 'Key insight', children }) {
  return (
    <aside className="relative border-y border-border py-8 my-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={12} className="text-accent" />
        <span className="font-mono text-[11px] uppercase tracking-label text-accent">
          {label}
        </span>
      </div>
      <div className="font-serif italic text-lg md:text-xl text-text leading-relaxed text-balance max-w-prose">
        {children}
      </div>
    </aside>
  )
}
