export default function SectionLabel({ children, className = '', number }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-xs uppercase tracking-label text-muted2 ${className}`}>
      {number && <span className="text-muted3">{number}</span>}
      <span>{children}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  )
}
