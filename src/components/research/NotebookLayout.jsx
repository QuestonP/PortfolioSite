import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Badge from '../ui/Badge'
import Reveal from '../../motion/Reveal'
import ReadingProgress from './ReadingProgress'
import Toc from './Toc'

function StatusBadge({ status }) {
  const map = {
    published:     { tone: 'success', label: 'Published' },
    'in-progress': { tone: 'warn',    label: 'In progress' },
    draft:         { tone: 'muted',   label: 'Draft' },
  }
  const cfg = map[status] || map.draft
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}

export default function NotebookLayout({
  title,
  subtitle,
  date,
  status,
  tags = [],
  toc = [],
  children,
}) {
  return (
    <div className="relative">
      <ReadingProgress />
      <div className="absolute inset-0 bg-rule-lines opacity-40 pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 pt-8 md:pt-12 pb-24">
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">

          {/* Sticky TOC rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Link
                to="/research"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-muted2 hover:text-text transition-colors mb-8"
              >
                <ArrowLeft size={12} />
                Research
              </Link>
              <Toc items={toc} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Mobile back */}
            <Link
              to="/research"
              className="lg:hidden inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-muted2 hover:text-text transition-colors mb-8"
            >
              <ArrowLeft size={12} />
              Research
            </Link>

            <Reveal>
              <header className="mb-14 pb-10 border-b border-border max-w-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <StatusBadge status={status} />
                  {date && (
                    <span className="font-mono text-[11px] text-muted3">{date}</span>
                  )}
                </div>
                <h1 className="font-display font-semibold text-text tracking-[-0.03em] leading-[1.08] text-balance mb-5"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
                  {title}
                </h1>
                {subtitle && (
                  <p className="font-serif italic text-xl text-muted leading-relaxed">
                    {subtitle}
                  </p>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-6">
                    {tags.map(tag => (
                      <span key={tag} className="font-mono text-[11px] text-muted2 px-2 py-0.5 border border-border rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
            </Reveal>

            <article className="max-w-3xl space-y-10">
              {children}
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
