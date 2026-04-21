import { forwardRef } from 'react'

const base = 'w-full bg-surface2 border border-border rounded-md px-3.5 py-2.5 text-sm text-text placeholder:text-muted3 transition-colors duration-150 focus:outline-none focus:border-accent focus:bg-surface3'

export const TextInput = forwardRef(function TextInput({ className = '', ...rest }, ref) {
  return <input ref={ref} className={`${base} ${className}`} {...rest} />
})

export const TextArea = forwardRef(function TextArea({ className = '', rows = 5, ...rest }, ref) {
  return <textarea ref={ref} rows={rows} className={`${base} resize-none ${className}`} {...rest} />
})

export function FieldLabel({ children, htmlFor, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`block font-mono text-[11px] uppercase tracking-label text-muted2 mb-2 ${className}`}>
      {children}
    </label>
  )
}

export function Field({ label, id, children }) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {children}
    </div>
  )
}
