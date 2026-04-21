import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import Reveal from '../motion/Reveal'

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) { setCount(value); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [started, reduce, value])

  useEffect(() => {
    if (!started || reduce) return
    const start = performance.now()
    let raf
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => raf && cancelAnimationFrame(raf)
  }, [started, value, duration, reduce])

  return (
    <span ref={ref} className="font-display font-medium text-text tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

function ProgressBar({ label, value, displayValue, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-sm text-text tabular-nums">{displayValue}</span>
      </div>
      <div className="h-px bg-border relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{
            width: visible ? `${value}%` : '0%',
            transition: reduce ? 'none' : `width 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

const HEADLINE_KPIS = [
  { value: 110, prefix: '$', suffix: 'M+', label: 'Total value realized' },
  { value: 10,  prefix: '$', suffix: 'M+', label: 'Revenue influenced' },
  { value: 2,   prefix: '',  suffix: 'M+', label: 'Data points analyzed' },
  { value: 80,  prefix: '',  suffix: '%',  label: 'Max efficiency gain' },
]

const DEALS = [
  { amount: 4000, label: '$4M',  description: 'Agentic AI PoC → contract expansion', note: 'Top-3 deal in company history' },
  { amount: 3500, label: '$3.5M',description: 'Enterprise pharma annual renewal',    note: '$100M+ realized value'          },
  { amount: 1500, label: '$1.5M',description: 'AI-led tax matching deal',             note: 'Moved to production'            },
  { amount: 800,  label: '$800K',description: 'Churn-risk account saved',             note: '24-week value sprint'           },
  { amount: 140,  label: '$140K',description: 'AI agent license expansion',           note: 'Up to $1B blocked revenue unlocked' },
]

const VALUE_CARDS = [
  { value: '$100M+', label: 'Realized value',  description: 'Enterprise process intelligence for a global retail pharma client' },
  { value: '$60M',   label: 'Free cash flow',  description: 'Opportunity surfaced through analytics and process mining' },
  { value: '$1B',    label: 'Blocked revenue', description: 'Unlocked via AI-powered allocation review at a tobacco manufacturer' },
  { value: '$5M',    label: 'P&L impact',      description: 'Delivered through process intelligence and workflow automation' },
]

const EFFICIENCY = [
  { label: 'Manual review time reduction (MSA analysis)', value: 80, displayValue: '80%' },
  { label: 'Deployment time reduction (CI/CD)',           value: 60, displayValue: '60%' },
  { label: 'Onboarding acceleration',                     value: 50, displayValue: '50%' },
  { label: 'Web traffic increase',                        value: 20, displayValue: '20%' },
]

const SCALE = [
  { value: '2M+',    label: 'Purchase orders analyzed',    description: 'S-BERT & ChromaDB semantic clustering' },
  { value: '1,000+', label: 'Documents auto-processed',    description: 'LLM-powered MSA extraction pipeline' },
  { value: '50K+',   label: 'End users served',            description: 'High-speed rail mobile application' },
  { value: '300%',   label: 'Team visibility increase',    description: 'Automated notification system' },
]

const INDUSTRIES = [
  { name: 'Pharmaceutical', detail: 'Global top-10 pharma' },
  { name: 'Automotive',     detail: 'Fortune 500 manufacturer' },
  { name: 'Tobacco',        detail: 'World-largest manufacturer' },
  { name: 'Rail',           detail: 'First US high-speed rail' },
  { name: 'Retail',         detail: 'Marketplace analytics' },
  { name: 'Legal',          detail: 'MSA analysis automation' },
]

const STORIES = [
  {
    title: 'From PoC to Top-3 deal',
    text: 'Architected an end-to-end agentic AI solution for dispute classification and automated resolution at a global top-10 pharmaceutical company. A 3-month PoC became the foundation for a $4M contract expansion.',
    tags: ['Agentic AI', 'Process Orchestration', 'Enterprise Deal'],
  },
  {
    title: 'Saving an $800K account',
    text: '24-week value sprint applying process intelligence, Make automations, and advanced analytics. $60M in FCF surfaced, $5M P&L impact identified, and a clear path to enterprise-scale deployment.',
    tags: ['Retention', 'Value Sprint', 'Process Intelligence'],
  },
  {
    title: 'Unlocking $1B in revenue',
    text: 'AI agent for a large tobacco manufacturer that automatically reviewed and released allocation blocks. Delivered onsite to 10+ senior stakeholders. $140K license expansion; up to $1B unlocked.',
    tags: ['AI Agent', 'Onsite Delivery', 'Stakeholders'],
  },
]

function DealBar({ deal, pct, delay }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="py-5 grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr_auto] gap-5 items-center border-t border-border">
      <span className="font-display text-xl md:text-2xl font-medium text-text tabular-nums">{deal.label}</span>
      <div className="min-w-0">
        <div className="h-px bg-border relative overflow-hidden mb-2">
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{
              width: visible ? `${pct}%` : '0%',
              transition: reduce ? 'none' : `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            }}
          />
        </div>
        <p className="text-sm text-text">{deal.description}</p>
      </div>
      <p className="font-mono text-[11px] uppercase tracking-label text-muted3 hidden md:block">{deal.note}</p>
    </div>
  )
}

export default function Impact() {
  const maxDeal = Math.max(...DEALS.map(d => d.amount))

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-topo opacity-100 pointer-events-none" aria-hidden />

      <Container className="relative pt-12 md:pt-16 pb-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-5">Impact</p>
          <h1 className="font-display font-semibold text-text tracking-[-0.03em] text-balance mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)' }}>
            Measurable outcomes, quantifiable value.
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed text-balance mb-14">
            Multi-million dollar deal wins, production AI systems processing millions of records, and enterprise delivery across pharma, automotive, rail, and retail — every project anchored to real numbers.
          </p>
        </Reveal>

        {/* Bento KPI grid */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden mb-20">
            {HEADLINE_KPIS.map(kpi => (
              <div key={kpi.label} className="bg-surface p-6 md:p-8">
                <div className="text-[44px] md:text-[52px] leading-none tracking-[-0.025em]">
                  <AnimatedCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mt-4">
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Deal Impact */}
        <section className="mb-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">Deal impact</p>
          </Reveal>
          <div>
            {DEALS.map((deal, i) => (
              <DealBar key={deal.label} deal={deal} pct={(deal.amount / maxDeal) * 100} delay={i * 100} />
            ))}
            <div className="border-b border-border" />
          </div>
        </section>

        {/* Value Unlocked */}
        <section className="mb-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">Value unlocked for clients</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden">
            {VALUE_CARDS.map(c => (
              <div key={c.label} className="bg-surface p-6">
                <p className="font-display text-3xl font-medium text-text tabular-nums tracking-[-0.02em] mb-2">
                  {c.value}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">{c.label}</p>
                <p className="text-sm text-muted leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Efficiency + Scale split */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border rounded-md overflow-hidden">
          <div className="bg-surface p-7">
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Efficiency gains</p>
            <div className="space-y-5">
              {EFFICIENCY.map((m, i) => (
                <ProgressBar key={m.label} {...m} delay={i * 120} />
              ))}
            </div>
          </div>
          <div className="bg-surface p-7">
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-6">Scale of operations</p>
            <div className="grid grid-cols-2 gap-5">
              {SCALE.map(m => (
                <div key={m.label}>
                  <p className="font-display text-2xl font-medium text-text tabular-nums tracking-tight mb-1">
                    {m.value}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-1">{m.label}</p>
                  <p className="text-xs text-muted leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="mb-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">Industry reach</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border rounded-md overflow-hidden">
            {INDUSTRIES.map(i => (
              <div key={i.name} className="bg-surface p-5">
                <p className="font-display text-sm font-medium text-text tracking-tight mb-1">{i.name}</p>
                <p className="text-xs text-muted leading-snug">{i.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stories as horizontal scroll */}
        <section>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">Impact stories</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STORIES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <article className="bg-surface border border-border rounded-md p-6 h-full flex flex-col">
                  <h3 className="font-display text-lg font-medium text-text tracking-tight mb-3">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{s.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map(t => <Badge key={t}>{t}</Badge>)}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </div>
  )
}
