import { useScrollReveal } from '../hooks/useScrollReveal'
import profile from '../data/profile.json'
import experience from '../data/experience.json'
import skills from '../data/skills.json'
import education from '../data/education.json'

function RevealWrapper({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      className="fade-in-up"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs text-accent uppercase tracking-widest">{children}</span>
      <div className="flex-1 border-t border-white/[0.04]" />
    </div>
  )
}

function formatDateRange(start, end, current) {
  const fmt = s => {
    const [y, m] = s.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(m) - 1]} ${y}`
  }
  return `${fmt(start)} — ${current ? 'Present' : fmt(end)}`
}

export default function About() {
  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <RevealWrapper>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">About Me</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-6">
              Building data solutions that<br className="hidden md:block" />
              <span className="gradient-text"> actually ship.</span>
            </h1>
            <p className="font-body text-muted text-base md:text-lg max-w-2xl leading-relaxed">
              {profile.bio_long}
            </p>
          </RevealWrapper>
        </div>

        {/* Career Highlights */}
        <div className="mb-16">
          <RevealWrapper>
            <SectionLabel>Career Highlights</SectionLabel>
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                index: '01',
                label: 'Enterprise Pharma Deal Win',
                color: '#4f8ffc',
                impact: 'New logo — global top-10 pharma',
                description:
                  'Developed an agentic workflow proof-of-concept for one of the largest pharmaceutical companies in the world. The PoC surfaced a massive, previously unmeasured value opportunity and provided a concrete resolution path — directly winning the enterprise deal.',
                boldNote: 'Top-3 deal in company history by size.',
                tags: ['Agentic AI', 'PoC', 'Process Mining', 'Deal Win'],
              },
              {
                index: '02',
                label: '$800K ARR Customer Save',
                color: '#34d399',
                impact: 'At-risk account retained',
                description:
                  'Participated in a high-stakes 4-month sprint to save an $800K ARR customer on the verge of churn. Built automations targeting working capital pain points and developed a tax matching agent PoC that transformed the engagement from reactive to strategic.',
                tags: ['Automation', 'Working Capital', 'Sprint Delivery', 'Retention'],
              },
              {
                index: '03',
                label: 'Multi-Million AI Deal',
                color: '#fb923c',
                impact: 'Multi-million dollar AI expansion',
                description:
                  'The tax matching agent PoC built during the customer save sprint became a standalone growth lever — demonstrating production-ready AI value that anchored a multi-million dollar AI-centered expansion deal.',
                tags: ['AI Agent', 'Tax Matching', 'Expansion Revenue', 'LLM'],
              },
            ].map((highlight, i) => (
              <RevealWrapper key={highlight.index} delay={i * 100}>
                <div
                  className="border bg-surface p-6 glow-border card-corners h-full flex flex-col transition-all duration-200 hover:bg-surface2"
                  style={{ borderColor: `${highlight.color}20` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className="font-mono text-3xl font-bold leading-none"
                      style={{ color: `${highlight.color}30` }}
                    >
                      {highlight.index}
                    </span>
                    <span
                      className="font-mono text-xs px-2 py-0.5"
                      style={{
                        color: highlight.color,
                        backgroundColor: `${highlight.color}10`,
                        border: `1px solid ${highlight.color}25`,
                      }}
                    >
                      {highlight.impact}
                    </span>
                  </div>

                  <h3
                    className="font-display font-bold text-base mb-3 leading-snug"
                    style={{ color: highlight.color }}
                  >
                    {highlight.label}
                  </h3>

                  <p className="font-body text-sm text-muted leading-relaxed flex-1 mb-5">
                    {highlight.description}
                    {highlight.boldNote && (
                      <> <strong className="text-primary font-semibold">{highlight.boldNote}</strong></>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {highlight.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 border border-white/[0.04] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>

        {/* Role cards */}
        <RevealWrapper delay={100}>
          <SectionLabel>Roles</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {profile.roles.map(role => (
              <div
                key={role.id}
                className="p-5 border bg-surface transition-all duration-200 glow-border"
                style={{ borderColor: `${role.color}20` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: role.color }}
                  >
                    {role.label}
                  </span>
                </div>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </RevealWrapper>

        {/* Skills */}
        <RevealWrapper delay={150}>
          <SectionLabel>Skills</SectionLabel>
          <div className="space-y-6 mb-16">
            {skills.categories.map(cat => (
              <div key={cat.id}>
                <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">{cat.label}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map(skill => (
                    <span
                      key={skill}
                      className="font-mono text-xs px-2.5 py-1 border border-white/[0.04] bg-surface text-muted hover:border-accent/40 hover:text-text hover:bg-accent/5 transition-all duration-150 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealWrapper>

        {/* Experience timeline */}
        <div>
          <RevealWrapper>
            <SectionLabel>Experience</SectionLabel>
          </RevealWrapper>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/8" />

            <div className="space-y-10">
              {experience.positions.map((pos, idx) => (
                <RevealWrapper key={pos.id} delay={idx * 80}>
                  <div className="relative pl-10">
                    {/* Node dot */}
                    <div
                      className="absolute left-0 top-1.5 w-6 h-6 border-2 flex items-center justify-center"
                      style={{
                        borderColor: pos.current ? '#4f8ffc' : 'rgba(255,255,255,0.08)',
                        backgroundColor: pos.current ? 'rgba(79,143,252,0.1)' : 'transparent',
                      }}
                    >
                      {pos.current && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                    </div>

                    <div className="border border-white/[0.04] bg-surface p-5 glow-border">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-1 sm:gap-2 mb-3">
                        <div>
                          <h3 className="font-display font-bold text-text text-base">{pos.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {pos.company_url ? (
                              <a
                                href={pos.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body text-sm text-accent hover:underline"
                              >
                                {pos.company}
                              </a>
                            ) : (
                              <span className="font-body text-sm text-accent">{pos.company}</span>
                            )}
                            <span className="text-muted text-xs">·</span>
                            <span className="font-body text-xs text-muted">{pos.location}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-muted whitespace-nowrap">
                          {formatDateRange(pos.start, pos.end, pos.current)}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {pos.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-accent mt-1.5 flex-shrink-0">›</span>
                            <span className="font-body text-sm text-muted leading-relaxed">
                              {b.text}
                              {b.impact && (
                                <span className="inline-block mt-1 sm:mt-0 sm:ml-2 font-mono text-xs text-accent bg-accent/8 px-1.5 py-0.5">
                                  {b.impact}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {pos.tags.map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-xs px-2 py-0.5 border border-white/[0.04] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </div>

        {/* Personal */}
        <div className="mt-16">
          <RevealWrapper>
            <SectionLabel>Beyond the Work</SectionLabel>
          </RevealWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Origin story */}
            <RevealWrapper delay={50}>
              <div className="border border-white/[0.04] bg-surface p-6 glow-border h-full">
                <p className="font-mono text-xs text-accent uppercase tracking-wider mb-4">Origin Story</p>
                <p className="font-body text-sm text-muted leading-relaxed mb-4">
                  I grew up in <span className="text-text font-medium">Bridgeport, CT</span> — the second of eight siblings. Growing up in a big family in Bridgeport shaped how I think: fast, collaborative, and always looking for leverage.
                </p>
                <p className="font-body text-sm text-muted leading-relaxed mb-4">
                  I attended the <span className="text-text font-medium">Information Technology & Software Engineering High School at the Fairchild Wheeler Inter-district Magnet Campus</span> — one of the most advanced STEM magnet schools in Connecticut. That's where I wrote my first lines of code, in 9th grade. By the time I graduated I already knew this was what I wanted to do.
                </p>
                <p className="font-body text-sm text-muted leading-relaxed">
                  After high school I moved to <span className="text-text font-medium">North Carolina</span> to study Computer Science at UNC Chapel Hill, specializing in Natural Language Processing. I fell in love with the Research Triangle and never left. Today I live in <span className="text-text font-medium">Raleigh, NC</span> — working full-time as an AI Solutions Engineer at Celonis, building agentic AI solutions and delivering enterprise-grade data science that drives real business outcomes. My cat <span className="text-text font-medium">Cell</span> supervises most of the late-night coding.
                </p>
              </div>
            </RevealWrapper>

            {/* Quick facts */}
            <RevealWrapper delay={100}>
              <div className="border border-white/[0.04] bg-surface p-6 glow-border h-full">
                <p className="font-mono text-xs text-accent uppercase tracking-wider mb-4">Quick Facts</p>
                <ul className="space-y-3">
                  {[
                    { icon: '📍', label: 'From',         value: 'Bridgeport, CT' },
                    { icon: '🏠', label: 'Now',          value: 'Raleigh, NC' },
                    { icon: '🐱', label: 'Cat',          value: 'Cell' },
                    { icon: '💻', label: 'Coding since',  value: '9th grade' },
                    { icon: '🏫', label: 'High school',  value: 'Fairchild Wheeler ITC, Bridgeport' },
                  ].map(({ icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-base leading-tight">{icon}</span>
                      <div>
                        <span className="font-mono text-xs text-muted uppercase tracking-wide">{label}</span>
                        <p className="font-body text-sm text-text">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealWrapper>
          </div>

          {/* Interests */}
          <RevealWrapper delay={120}>
            <div className="border border-white/[0.04] bg-surface p-6 glow-border">
              <p className="font-mono text-xs text-accent uppercase tracking-wider mb-5">Outside the Terminal</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { icon: '🏀', label: 'Basketball'    },
                  { icon: '🏈', label: 'Football'      },
                  { icon: '🥊', label: 'Boxing'        },
                  { icon: '🏃', label: 'Running'       },
                  { icon: '✍️', label: 'Poetry'        },
                  { icon: '🎮', label: 'Video Games'   },
                  { icon: '📚', label: 'Reading'       },
                  { icon: '🌃', label: 'Nights Out'    },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-4 py-3 border border-white/[0.04] hover:border-accent/30 hover:bg-accent/5 transition-all duration-150"
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="font-body text-sm text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealWrapper>
        </div>

        {/* Education & Certifications */}
        <div className="mt-16">
          <RevealWrapper>
            <SectionLabel>Education & Certifications</SectionLabel>
          </RevealWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.degrees.map(deg => (
              <RevealWrapper key={deg.id}>
                <div className="border border-white/[0.04] bg-surface p-5 glow-border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-text text-sm">{deg.institution}</h3>
                      <p className="font-body text-sm text-accent mt-0.5">
                        {deg.degree}, {deg.field}
                      </p>
                      {deg.focus && (
                        <p className="font-body text-xs text-muted mt-0.5">Focus: {deg.focus}</p>
                      )}
                    </div>
                    <span
                      className="font-mono text-xs px-2 py-0.5 whitespace-nowrap"
                      style={{
                        color: deg.status === 'in-progress' ? '#34d399' : '#6b7280',
                        backgroundColor: deg.status === 'in-progress' ? 'rgba(52,211,153,0.1)' : 'rgba(107,114,128,0.1)',
                        border: `1px solid ${deg.status === 'in-progress' ? 'rgba(52,211,153,0.2)' : 'rgba(107,114,128,0.2)'}`,
                      }}
                    >
                      {deg.status === 'in-progress' ? `Expected ${deg.expected?.split('-')[0]}` : deg.graduated?.split('-')[0]}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted">{deg.location}</p>
                </div>
              </RevealWrapper>
            ))}
            {education.certifications?.map(cert => (
              <RevealWrapper key={cert.id}>
                <div className="border border-white/[0.04] bg-surface p-5 glow-border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-text text-sm">{cert.name}</h3>
                      <p className="font-body text-sm text-accent mt-0.5">{cert.issuer}</p>
                    </div>
                    <span
                      className="font-mono text-xs px-2 py-0.5 whitespace-nowrap"
                      style={{
                        color: '#4f8ffc',
                        backgroundColor: 'rgba(79,143,252,0.1)',
                        border: '1px solid rgba(79,143,252,0.2)',
                      }}
                    >
                      {cert.date?.split('-')[0]}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted">Professional Certification</p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
