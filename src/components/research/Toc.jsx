import { useEffect, useState } from 'react'

export default function Toc({ items = [] }) {
  const [active, setActive] = useState(items[0]?.id || '')

  useEffect(() => {
    if (!items.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav aria-label="Section navigation" className="space-y-1">
      <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">On this page</p>
      <ul className="space-y-1">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`block text-sm leading-snug py-1 border-l border-border pl-3 transition-colors ${
                active === id
                  ? 'text-text border-accent'
                  : 'text-muted2 hover:text-text'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
