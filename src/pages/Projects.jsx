import { useState, useMemo } from 'react'
import { Github, ExternalLink, Building2, Lock, TrendingUp } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import projectsData from '../data/projects.json'

const CATEGORIES = ['All', 'AI / ML', 'Full Stack', 'Backend', 'Data Engineering', 'Other']

function RevealWrapper({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.08)
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.45s ease-out ${delay}ms, transform 0.45s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    production:  { label: 'Production',  color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)' },
    development: { label: 'In Dev',      color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)' },
    archived:    { label: 'Archived',    color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
  }
  const c = config[status] || config.archived
  return (
    <span
      className="font-mono text-xs px-2 py-0.5"
      style={{ color: c.color, backgroundColor: c.bg, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  )
}

function ProjectCard({ project, index }) {
  const impactDisplay = project.impact_quantified
    ? project.impact
    : null

  return (
    <RevealWrapper delay={(index % 3) * 80}>
      <div className="border border-white/8 bg-surface h-full flex flex-col glow-border transition-all duration-200 hover:bg-surface2">
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <StatusBadge status={project.status} />
            <span className="font-mono text-xs text-muted">{project.year}</span>
          </div>
          <h3 className="font-display font-bold text-text text-base mb-1 leading-snug">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Building2 size={11} />
            <span className="font-body">{project.company}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <p className="font-body text-sm text-muted leading-relaxed flex-1">
            {project.short_description}
          </p>

          {/* Impact metric */}
          {project.impact_quantified && (
            <div className="flex items-center gap-2 py-2 px-3 bg-accent/5 border border-accent/15">
              <TrendingUp size={13} className="text-accent flex-shrink-0" />
              <span className="font-mono text-xs text-accent font-bold">{project.impact_quantified}</span>
              {impactDisplay && (
                <span className="font-body text-xs text-muted truncate"> — {project.impact.replace(project.impact_quantified, '').replace(/^[\s—–-]+/, '')}</span>
              )}
            </div>
          )}
          {!project.impact_quantified && project.impact && (
            <div className="flex items-center gap-2 py-2 px-3 bg-white/3 border border-white/8">
              <TrendingUp size={13} className="text-muted flex-shrink-0" />
              <span className="font-body text-xs text-muted">{project.impact}</span>
            </div>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map(tech => (
              <span
                key={tech}
                className="font-mono text-xs px-2 py-0.5 border border-white/8 text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="font-mono text-xs text-accent/60">#{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {project.internal && (
              <span className="flex items-center gap-1 font-body text-xs text-muted" title="Internal/client project">
                <Lock size={11} />
                Internal
              </span>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="text-muted hover:text-text transition-colors duration-150" aria-label="GitHub">
                <Github size={15} />
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="text-muted hover:text-text transition-colors duration-150" aria-label="Live demo">
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </RevealWrapper>
  )
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projectsData.projects
    return projectsData.projects.filter(p => p.category === activeCategory)
  }, [activeCategory])

  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  // Stats
  const totalProjects = projectsData.projects.length
  const productionCount = projectsData.projects.filter(p => p.status === 'production').length

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">Projects</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-4">
            Work that ships.
          </h1>
          <p className="font-body text-muted text-base max-w-xl leading-relaxed mb-6">
            Enterprise AI deployments, ML systems, full-stack apps, and personal projects — all anchored to real outcomes.
          </p>

          {/* Quick stats */}
          <div className="flex gap-6">
            <div>
              <span className="font-mono text-2xl font-bold text-accent">{totalProjects}</span>
              <span className="font-body text-xs text-muted ml-2">total projects</span>
            </div>
            <div className="border-l border-white/8 pl-6">
              <span className="font-mono text-2xl font-bold text-accent">{productionCount}</span>
              <span className="font-body text-xs text-muted ml-2">in production</span>
            </div>
            <div className="border-l border-white/8 pl-6">
              <span className="font-mono text-2xl font-bold text-accent">5</span>
              <span className="font-body text-xs text-muted ml-2">languages</span>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-10 tags-scroll">
          <div className="flex gap-2 pb-1 min-w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-mono text-xs px-3 py-1.5 border transition-all duration-150 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-accent text-bg border-accent'
                    : 'border-white/10 text-muted hover:border-accent/40 hover:text-text'
                }`}
              >
                {cat}
                <span className="ml-2 opacity-50">
                  {cat === 'All'
                    ? projectsData.projects.length
                    : projectsData.projects.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-5">
              Featured — {featured.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Other */}
        {rest.length > 0 && (
          <div>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-5 mt-4">
              All projects — {rest.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted font-body">
            No projects in <span className="text-accent">{activeCategory}</span>
          </div>
        )}
      </div>
    </div>
  )
}
