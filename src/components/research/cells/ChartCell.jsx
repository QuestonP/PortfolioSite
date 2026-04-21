import { BarChart3 } from 'lucide-react'

export default function ChartCell({ title, children }) {
  return (
    <figure className="border border-border rounded-md bg-surface overflow-hidden">
      <figcaption className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <BarChart3 size={12} className="text-muted2" />
        <span className="font-mono text-[11px] uppercase tracking-label text-muted2">
          {title || 'Figure'}
        </span>
      </figcaption>
      <div className="p-6">
        {children || (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <BarChart3 size={28} className="text-muted3 mb-3" />
            <p className="font-mono text-xs text-muted2">Interactive visualization</p>
            <p className="font-mono text-[11px] text-muted3 mt-1">Coming soon</p>
          </div>
        )}
      </div>
    </figure>
  )
}
