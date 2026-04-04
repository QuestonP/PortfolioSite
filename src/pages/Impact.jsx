import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

function RevealWrapper({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
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
      <div className="flex-1 border-t border-white/8" />
    </div>
  )
}

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = 0
    const end = value
    const stepTime = Math.max(Math.floor(duration / end), 10)
    const increment = Math.max(Math.floor(end / (duration / stepTime)), 1)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [started, value, duration])

  return (
    <span ref={ref} className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-text tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

function ProgressBar({ label, value, maxValue, displayValue, color = '#667eea', delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const pct = Math.min((value / maxValue) * 100, 100)

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-body text-sm text-muted">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {displayValue}
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: visible ? `${pct}%` : '0%',
            backgroundColor: color,
            transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

const HEADLINE_KPIS = [
  { value: 110, prefix: '$', suffix: 'M+', label: 'Total Value Realized', color: '#34d399' },
  { value: 10, prefix: '$', suffix: 'M+', label: 'Revenue Directly Influenced', color: '#667eea' },
  { value: 2, prefix: '', suffix: 'M+', label: 'Data Points Analyzed', color: '#a78bfa' },
  { value: 80, prefix: '', suffix: '%', label: 'Max Efficiency Gain', color: '#fb923c' },
]

const DEALS = [
  { amount: 4000, label: '$4M', description: 'Agentic AI PoC \u2192 Contract Expansion', note: 'Top-3 deal in company history', color: '#667eea' },
  { amount: 3500, label: '$3.5M', description: 'Enterprise Pharma Annual Renewal', note: '$100M+ realized value', color: '#34d399' },
  { amount: 1500, label: '$1.5M', description: 'AI-Led Tax Matching Commercial Deal', note: 'Moved to production', color: '#a78bfa' },
  { amount: 800, label: '$800K', description: 'Churn-Risk Account Saved', note: '24-week value sprint', color: '#fb923c' },
  { amount: 140, label: '$140K', description: 'AI Agent License Expansion', note: 'Up to $1B blocked revenue unlocked', color: '#f472b6' },
]

const VALUE_CARDS = [
  { value: '$100M+', label: 'Realized Value', description: 'Enterprise-grade process intelligence for global retail pharmaceutical client', color: '#34d399' },
  { value: '$60M', label: 'Free Cash Flow', description: 'Opportunity surfaced through advanced analytics and process mining', color: '#667eea' },
  { value: '$1B', label: 'Blocked Revenue', description: 'Unlocked for tobacco manufacturer via AI-powered allocation review', color: '#a78bfa' },
  { value: '$5M', label: 'P&L Impact', description: 'Delivered through process intelligence and workflow automation', color: '#fb923c' },
]

const EFFICIENCY_METRICS = [
  { label: 'Manual review time reduction (MSA analysis)', value: 80, maxValue: 100, displayValue: '80%', color: '#667eea' },
  { label: 'Deployment time reduction (CI/CD)', value: 60, maxValue: 100, displayValue: '60%', color: '#34d399' },
  { label: 'Onboarding acceleration', value: 50, maxValue: 100, displayValue: '50%', color: '#a78bfa' },
  { label: 'Web traffic increase', value: 20, maxValue: 100, displayValue: '20%', color: '#f472b6' },
]

const SCALE_METRICS = [
  { value: '2M+', label: 'Purchase orders analyzed', description: 'Semantic clustering with S-BERT & ChromaDB' },
  { value: '1,000+', label: 'Documents auto-processed', description: 'LLM-powered MSA extraction pipeline' },
  { value: '50K+', label: 'End users served', description: 'High-speed rail mobile application' },
  { value: '300%', label: 'Team visibility increase', description: 'Automated notification system' },
]

const INDUSTRIES = [
  { icon: '\u{1F48A}', name: 'Pharmaceutical', detail: 'Global top-10 pharma company', color: '#34d399' },
  { icon: '\u{1F697}', name: 'Automotive', detail: 'Fortune 500 manufacturer', color: '#667eea' },
  { icon: '\u{1F6E2}', name: 'Tobacco', detail: "World's largest manufacturer", color: '#a78bfa' },
  { icon: '\u{1F684}', name: 'Rail', detail: 'First US high-speed rail', color: '#fb923c' },
  { icon: '\u{1F6D2}', name: 'Retail / E-commerce', detail: 'Marketplace analytics & supply chain', color: '#f472b6' },
  { icon: '\u{2696}', name: 'Legal / Compliance', detail: 'MSA analysis & document automation', color: '#38bdf8' },
]

const IMPACT_STORIES = [
  {
    title: 'From PoC to Top-3 Deal',
    text: 'Architected an end-to-end agentic AI solution for dispute classification and automated resolution at a global top-10 pharmaceutical company. What started as a 3-month proof of concept became the foundation for a $4M contract expansion \u2014 ranked among the top 3 deals in company history.',
    tags: ['Agentic AI', 'Process Orchestration', 'Enterprise Deal'],
    color: '#667eea',
  },
  {
    title: 'Saving an $800K Account',
    text: 'When an $800K ARR account was on the verge of churn, I led a 24-week value sprint applying process intelligence, Make automations, and advanced analytics. The result: $60M in free cash flow opportunity surfaced, $5M in P&L impact identified, and a clear path to enterprise-scale deployment that transformed the engagement from reactive to strategic.',
    tags: ['Customer Retention', 'Value Sprint', 'Process Intelligence'],
    color: '#34d399',
  },
  {
    title: 'Unlocking $1B in Blocked Revenue',
    text: 'Built an AI agent for one of the world\'s largest tobacco manufacturers that automatically reviewed and released allocation blocks. Delivered the proof of concept onsite to 10+ senior stakeholders, securing a $140K license expansion and unlocking up to $1B in previously blocked revenue.',
    tags: ['AI Agent', 'Onsite Delivery', 'Stakeholder Alignment'],
    color: '#a78bfa',
  },
]

export default function Impact() {
  const maxDeal = Math.max(...DEALS.map(d => d.amount))

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="mb-16">
          <RevealWrapper>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">Career Impact</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-6">
              Measurable outcomes,<br className="hidden md:block" />
              <span className="gradient-text"> real business value.</span>
            </h1>
            <p className="font-body text-muted text-base md:text-lg max-w-2xl leading-relaxed">
              From multi-million dollar deal wins to production-grade AI systems processing millions of records — every project anchored to quantifiable impact across enterprise clients worldwide.
            </p>
          </RevealWrapper>
        </div>

        {/* Headline KPIs */}
        <RevealWrapper>
          <SectionLabel>At a Glance</SectionLabel>
        </RevealWrapper>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {HEADLINE_KPIS.map((kpi, i) => (
            <RevealWrapper key={kpi.label} delay={i * 80}>
              <div className="border border-white/8 bg-surface p-4 sm:p-6 glow-border text-center">
                <AnimatedCounter
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  duration={1800 + i * 200}
                />
                <p className="font-mono text-xs text-muted uppercase tracking-wider mt-3">{kpi.label}</p>
                <div className="w-8 h-0.5 mx-auto mt-3 rounded-full" style={{ backgroundColor: kpi.color }} />
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Deal Impact */}
        <div className="mb-16">
          <RevealWrapper>
            <SectionLabel>Deal Impact</SectionLabel>
          </RevealWrapper>
          <div className="space-y-4">
            {DEALS.map((deal, i) => {
              const pct = (deal.amount / maxDeal) * 100
              return (
                <RevealWrapper key={deal.label} delay={i * 60}>
                  <DealBar deal={deal} pct={pct} delay={i * 100} />
                </RevealWrapper>
              )
            })}
          </div>
        </div>

        {/* Value Unlocked */}
        <div className="mb-16">
          <RevealWrapper>
            <SectionLabel>Value Unlocked for Clients</SectionLabel>
          </RevealWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUE_CARDS.map((card, i) => (
              <RevealWrapper key={card.label} delay={i * 80}>
                <div
                  className="border bg-surface p-6 glow-border h-full flex flex-col"
                  style={{ borderColor: `${card.color}20` }}
                >
                  <span
                    className="font-display font-extrabold text-3xl mb-2"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </span>
                  <span className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
                    {card.label}
                  </span>
                  <p className="font-body text-sm text-muted leading-relaxed mt-auto">
                    {card.description}
                  </p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>

        {/* Efficiency & Scale */}
        <div className="mb-16">
          <RevealWrapper>
            <SectionLabel>Efficiency Gains</SectionLabel>
          </RevealWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevealWrapper>
              <div className="border border-white/8 bg-surface p-6 glow-border space-y-5">
                <p className="font-mono text-xs text-accent uppercase tracking-wider mb-2">Percentage Improvements</p>
                {EFFICIENCY_METRICS.map((m, i) => (
                  <ProgressBar key={m.label} {...m} delay={i * 150} />
                ))}
              </div>
            </RevealWrapper>

            <RevealWrapper delay={100}>
              <div className="border border-white/8 bg-surface p-6 glow-border">
                <p className="font-mono text-xs text-accent uppercase tracking-wider mb-5">Scale of Operations</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SCALE_METRICS.map(m => (
                    <div key={m.label} className="border border-white/5 bg-surface2 p-4">
                      <span className="font-display font-extrabold text-2xl text-text">{m.value}</span>
                      <p className="font-mono text-xs text-accent mt-1">{m.label}</p>
                      <p className="font-body text-xs text-muted mt-1 leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealWrapper>
          </div>
        </div>

        {/* Industry Reach */}
        <div className="mb-16">
          <RevealWrapper>
            <SectionLabel>Industry Reach</SectionLabel>
          </RevealWrapper>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INDUSTRIES.map((ind, i) => (
              <RevealWrapper key={ind.name} delay={i * 60}>
                <div
                  className="border bg-surface p-3 sm:p-4 glow-border text-center h-full flex flex-col items-center justify-center"
                  style={{ borderColor: `${ind.color}15` }}
                >
                  <span className="text-2xl mb-2">{ind.icon}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: ind.color }}>
                    {ind.name}
                  </span>
                  <p className="font-body text-xs text-muted mt-1 leading-tight">{ind.detail}</p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>

        {/* Impact Stories */}
        <div>
          <RevealWrapper>
            <SectionLabel>Impact Stories</SectionLabel>
          </RevealWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {IMPACT_STORIES.map((story, i) => (
              <RevealWrapper key={story.title} delay={i * 100}>
                <div
                  className="border bg-surface p-6 glow-border h-full flex flex-col"
                  style={{ borderColor: `${story.color}20` }}
                >
                  <div
                    className="w-8 h-0.5 rounded-full mb-4"
                    style={{ backgroundColor: story.color }}
                  />
                  <h3
                    className="font-display font-bold text-base mb-3"
                    style={{ color: story.color }}
                  >
                    {story.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed flex-1 mb-5">
                    {story.text}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {story.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 border border-white/8 text-muted"
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

      </div>
    </div>
  )
}

function DealBar({ deal, pct, delay }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="border border-white/5 bg-surface p-4 glow-border">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span
          className="font-display font-extrabold text-xl sm:w-20 flex-shrink-0"
          style={{ color: deal.color }}
        >
          {deal.label}
        </span>
        <div className="flex-1">
          <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full"
              style={{
                width: visible ? `${pct}%` : '0%',
                backgroundColor: deal.color,
                transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="font-body text-sm text-text">{deal.description}</span>
            <span className="font-mono text-xs text-muted">{deal.note}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
