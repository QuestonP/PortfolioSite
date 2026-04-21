const TONES = {
  default: 'text-muted border-border bg-transparent',
  muted:   'text-muted2 border-border bg-transparent',
  accent:  'text-accent border-[rgba(124,134,255,0.28)] bg-[rgba(124,134,255,0.08)]',
  success: 'text-[#7EE8A8] border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.06)]',
  warn:    'text-[#F5C56A] border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.06)]',
}

export default function Badge({ children, tone = 'default', className = '', as: Component = 'span', ...rest }) {
  return (
    <Component
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[11px] uppercase tracking-label ${TONES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
