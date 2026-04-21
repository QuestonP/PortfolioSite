import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import profile from '../data/profile.json'
import experience from '../data/experience.json'
import skills from '../data/skills.json'
import education from '../data/education.json'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import Reveal from '../motion/Reveal'

const SECTIONS = [
  { id: 'bio',         label: 'Bio'         },
  { id: 'highlights',  label: 'Highlights'  },
  { id: 'experience',  label: 'Experience'  },
  { id: 'skills',      label: 'Skills'      },
  { id: 'education',   label: 'Education'   },
  { id: 'personal',    label: 'Personal'    },
]

function formatDateRange(start, end, current) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const fmt = s => {
    if (!s) return ''
    const [y, m] = s.split('-')
    return `${months[parseInt(m) - 1]} ${y}`
  }
  return `${fmt(start)} — ${current ? 'Present' : fmt(end)}`
}

function useActiveSection() {
  const [active, setActive] = useState('bio')

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return active
}

function Rail() {
  const active = useActiveSection()
  return (
    <nav className="hidden lg:block sticky top-32 self-start">
      <ul className="space-y-3.5">
        {SECTIONS.map(s => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group flex items-center gap-3 font-mono text-[11px] uppercase tracking-label transition-colors ${
                  isActive ? 'text-text' : 'text-muted3 hover:text-muted'
                }`}
              >
                <span className={`h-px transition-all ${isActive ? 'w-8 bg-text' : 'w-4 bg-muted3 group-hover:bg-muted'}`} />
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const HIGHLIGHTS = [
  {
    index: '01',
    label: 'Enterprise Pharma Deal Win',
    impact: 'Top-3 deal in company history',
    description: 'An agentic workflow PoC for one of the largest global pharmaceutical companies surfaced a previously unmeasured value opportunity and provided a concrete resolution path — directly winning the enterprise deal.',
    tags: ['Agentic AI', 'PoC', 'Process Mining'],
  },
  {
    index: '02',
    label: '$800K ARR Customer Save',
    impact: 'At-risk account retained',
    description: 'High-stakes 4-month sprint that transformed a churn-risk customer relationship through working-capital automations and a tax-matching agent PoC — reactive to strategic.',
    tags: ['Automation', 'Working Capital', 'Retention'],
  },
  {
    index: '03',
    label: 'Multi-Million AI Expansion',
    impact: 'Standalone growth lever',
    description: 'The tax matching agent PoC became a standalone expansion product — production-ready AI value anchoring a multi-million dollar AI-centered expansion deal.',
    tags: ['AI Agent', 'Tax Matching', 'Expansion'],
  },
]

export default function About() {
  return (
    <div className="relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_200px] gap-x-12 gap-y-16 pt-12 md:pt-16 pb-24">

          <Rail />

          <div className="min-w-0">
            <section id="bio" className="scroll-mt-32 mb-24">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-5">About</p>
                <h1 className="font-display font-semibold text-text tracking-[-0.03em] text-balance leading-[1.05] mb-8"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)' }}>
                  Data science, applied AI, and enterprise delivery — anchored to real outcomes.
                </h1>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="prose-editorial text-muted text-lg leading-relaxed text-pretty space-y-5">
                  <p>{profile.bio_long}</p>
                </div>
              </Reveal>
            </section>

            <section id="highlights" className="scroll-mt-32 mb-24">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Career highlights</p>
              </Reveal>
              <div className="divide-hairline border-t border-border">
                {HIGHLIGHTS.map((h, i) => (
                  <Reveal key={h.index} delay={i * 0.08}>
                    <div className="py-7 grid grid-cols-1 md:grid-cols-[60px_1fr] gap-5">
                      <p className="font-mono text-xs text-muted3">{h.index}</p>
                      <div>
                        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                          <h3 className="font-display text-xl font-medium text-text tracking-tight">{h.label}</h3>
                          <span className="font-mono text-[11px] text-accent">{h.impact}</span>
                        </div>
                        <p className="text-muted leading-relaxed text-pretty mb-4">{h.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {h.tags.map(t => <Badge key={t}>{t}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section id="experience" className="scroll-mt-32 mb-24">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Experience</p>
              </Reveal>
              <div className="divide-hairline border-t border-border">
                {experience.positions.map((pos, idx) => (
                  <Reveal key={pos.id} delay={idx * 0.06}>
                    <article className="py-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">
                          {formatDateRange(pos.start, pos.end, pos.current)}
                        </p>
                        {pos.current && (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            Current
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-medium text-text tracking-tight mb-1">
                          {pos.title}
                        </h3>
                        <p className="text-sm text-muted mb-5">
                          {pos.company_url ? (
                            <a href={pos.company_url} target="_blank" rel="noopener noreferrer" className="text-text underline-offset-4 hover:underline inline-flex items-center gap-1">
                              {pos.company} <ArrowUpRight size={11} />
                            </a>
                          ) : (
                            <span className="text-text">{pos.company}</span>
                          )}
                          <span className="text-muted3 mx-2">·</span>
                          {pos.location}
                        </p>
                        <ul className="space-y-3 mb-5">
                          {pos.bullets.map((b, i) => (
                            <li key={i} className="text-muted leading-relaxed text-pretty">
                              {b.text}
                              {b.impact && (
                                <span className="block mt-1.5 font-mono text-[11px] text-accent">
                                  → {b.impact}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5">
                          {pos.tags.map(t => <Badge key={t}>{t}</Badge>)}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>

            <section id="skills" className="scroll-mt-32 mb-24">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Skills</p>
              </Reveal>
              <div className="divide-hairline border-t border-border">
                {skills.categories.map((cat, i) => (
                  <Reveal key={cat.id} delay={i * 0.04}>
                    <div className="py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                      <p className="font-mono text-[11px] uppercase tracking-label text-muted3 pt-0.5">
                        {cat.label}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {cat.skills.map(s => (
                          <span key={s} className="text-sm text-muted hover:text-text transition-colors cursor-default">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section id="education" className="scroll-mt-32 mb-24">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Education & certifications</p>
              </Reveal>
              <div className="divide-hairline border-t border-border">
                {education.degrees.map(d => (
                  <Reveal key={d.id}>
                    <div className="py-7 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                      <p className="font-mono text-[11px] uppercase tracking-label text-muted3">
                        {d.status === 'in-progress' ? `Expected ${d.expected?.split('-')[0]}` : d.graduated?.split('-')[0]}
                      </p>
                      <div>
                        <h3 className="font-display text-lg font-medium text-text tracking-tight mb-1">{d.institution}</h3>
                        <p className="text-sm text-muted">{d.degree}, {d.field}{d.focus && ` — ${d.focus}`}</p>
                        <p className="text-sm text-muted3 mt-1">{d.location}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
                {education.certifications?.map(c => (
                  <Reveal key={c.id}>
                    <div className="py-7 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                      <p className="font-mono text-[11px] uppercase tracking-label text-muted3">
                        {c.date?.split('-')[0]}
                      </p>
                      <div>
                        <h3 className="font-display text-lg font-medium text-text tracking-tight mb-1">{c.name}</h3>
                        <p className="text-sm text-muted">{c.issuer}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section id="personal" className="scroll-mt-32">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Beyond the work</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="prose-editorial text-muted text-lg leading-relaxed text-pretty space-y-5">
                  <p>
                    Grew up in <span className="text-text">Bridgeport, CT</span> — the second of eight siblings. That shaped how I think: fast, collaborative, always looking for leverage.
                  </p>
                  <p>
                    Wrote my first lines of code in 9th grade at the Fairchild Wheeler Information Technology magnet campus. Moved to North Carolina for Computer Science at UNC Chapel Hill, specialized in Natural Language Processing, fell in love with the Research Triangle, and stayed.
                  </p>
                  <p>
                    Today I live in Raleigh working on agentic AI at Celonis. My cat <span className="text-text">Cell</span> supervises most of the late-night coding.
                  </p>
                  <p className="text-muted3 text-base">
                    Outside the terminal: basketball, boxing, running, poetry, reading, and the occasional night out.
                  </p>
                </div>
              </Reveal>
            </section>
          </div>

          {/* Right meta column */}
          <aside className="hidden lg:block sticky top-32 self-start space-y-6 text-sm">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">Located</p>
              <p className="text-text">{profile.location}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">From</p>
              <p className="text-text">Bridgeport, CT</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">Currently</p>
              <p className="text-text">Celonis</p>
              <p className="text-muted">AI Solutions Engineer</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">Education</p>
              <p className="text-text">UNC Chapel Hill</p>
              <p className="text-muted">B.A. Computer Science · NLP</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">Companion</p>
              <p className="text-text">Cell (the cat)</p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
