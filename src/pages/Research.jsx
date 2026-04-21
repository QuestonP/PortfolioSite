import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import researchData from '../data/research.json'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import Reveal from '../motion/Reveal'
import { Stagger, StaggerItem } from '../motion/Stagger'

function StatusBadge({ status }) {
  const map = {
    published:     { tone: 'success', label: 'Published' },
    'in-progress': { tone: 'warn',    label: 'In progress' },
    draft:         { tone: 'muted',   label: 'Draft' },
  }
  const cfg = map[status] || map.draft
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}

function formatDate(raw) {
  if (!raw) return ''
  const [y, m] = raw.split('-')
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const idx = Math.max(0, Math.min(11, parseInt(m, 10) - 1))
  return `${months[idx]} ${y}`
}

export default function Research() {
  const items = researchData.projects

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-rule-lines opacity-40 pointer-events-none" aria-hidden />

      <Container size="narrow" className="relative pt-12 md:pt-16 pb-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-5">Research · {items.length}</p>
          <h1 className="font-display font-semibold text-text tracking-[-0.03em] leading-[1.05] text-balance mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)' }}>
            Long-form notes on <em className="font-serif italic font-normal text-text">applied AI</em>, data, and the way teams ship.
          </h1>
          <p className="text-muted text-lg leading-relaxed text-balance mb-16 max-w-xl">
            Field notes and strategic research — written in a notebook format with data, frameworks, and the occasional hot take.
          </p>
        </Reveal>

        <Stagger gap={0.06}>
          {items.map(project => (
            <StaggerItem key={project.id}>
              <Link
                to={`/research/${project.slug}`}
                className="group block border-t border-border py-8 md:py-10 transition-colors hover:border-border2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge status={project.status} />
                  <span className="font-mono text-[11px] text-muted3">{formatDate(project.date)}</span>
                </div>

                <h2 className="font-display font-medium text-text tracking-[-0.02em] text-balance leading-[1.15] mb-3 group-hover:text-accent transition-colors"
                    style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2rem)' }}>
                  {project.title}
                </h2>

                {project.subtitle && (
                  <p className="font-serif italic text-lg text-muted leading-relaxed mb-4">
                    {project.subtitle}
                  </p>
                )}

                <p className="text-muted leading-relaxed text-pretty mb-5 max-w-prose">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="font-mono text-[11px] text-muted2">
                        {tag}
                      </span>
                    )).reduce((prev, curr, i) => [prev, <span key={`sep-${i}`} className="font-mono text-[11px] text-muted3">·</span>, curr])}
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-accent group-hover:gap-2.5 transition-all">
                    Read <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="border-t border-border pt-8 mt-4">
          <p className="font-mono text-xs uppercase tracking-label text-muted3">
            More entries shipping soon.
          </p>
        </div>
      </Container>
    </div>
  )
}
