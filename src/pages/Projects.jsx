import { useState, useMemo } from 'react'
import { Github, ExternalLink, Building2, Lock, ArrowUpRight, FileText } from 'lucide-react'
import projectsData from '../data/projects.json'
import ProjectDetailModal from '../components/projects/ProjectDetailModal'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Reveal from '../motion/Reveal'
import { Stagger, StaggerItem } from '../motion/Stagger'

const CATEGORIES = ['All', 'AI / ML', 'Full Stack', 'Backend', 'Data Engineering', 'Other']

function StatusBadge({ status }) {
  const map = {
    production:  { tone: 'success', label: 'Shipped' },
    development: { tone: 'warn',    label: 'In dev'  },
    archived:    { tone: 'muted',   label: 'Archived'},
  }
  const cfg = map[status] || map.archived
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}

function FeaturedRow({ project, reverse, onSelect }) {
  return (
    <StaggerItem>
      <button
        onClick={() => onSelect(project)}
        className="group w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-10 border-b border-border text-left"
      >
        <div className={`md:col-span-5 ${reverse ? 'md:order-2' : ''}`}>
          <div className="aspect-[4/3] md:aspect-[5/4] bg-surface border border-border rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-faint opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">{project.category}</p>
                <p className="font-display text-2xl text-text leading-tight text-balance">
                  {project.title}
                </p>
              </div>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <StatusBadge status={project.status} />
            </div>
            <div className="absolute top-4 right-4">
              <span className="font-mono text-[11px] text-muted2">{project.year}</span>
            </div>
          </div>
        </div>

        <div className={`md:col-span-7 flex flex-col justify-center ${reverse ? 'md:order-1' : ''}`}>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">
            <Building2 size={11} /> {project.company}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-medium text-text tracking-tight mb-4 text-balance group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-muted leading-relaxed mb-5 text-pretty max-w-xl">
            {project.short_description}
          </p>

          {project.impact_quantified && (
            <p className="text-sm text-text mb-5">
              <span className="font-mono text-accent">{project.impact_quantified}</span>
              <span className="text-muted"> — {project.impact.replace(project.impact_quantified, '').replace(/^[\s—–-]+/, '')}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech_stack.slice(0, 5).map(tech => (
              <span key={tech} className="font-mono text-[11px] px-2 py-0.5 rounded-sm border border-border text-muted2">
                {tech}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 text-sm text-accent group-hover:gap-2.5 transition-all">
            View details <ArrowUpRight size={14} />
          </div>
        </div>
      </button>
    </StaggerItem>
  )
}

function CompactCard({ project, onSelect }) {
  return (
    <StaggerItem>
      <Card
        as="button"
        density="compact"
        interactive
        onClick={() => onSelect(project)}
        className="group w-full h-full flex flex-col text-left"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <StatusBadge status={project.status} />
          <span className="font-mono text-[11px] text-muted3">{project.year}</span>
        </div>
        <h3 className="font-display font-medium text-text text-lg leading-snug tracking-tight mb-1.5 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">
          {project.company}
        </p>
        <p className="text-sm text-muted leading-relaxed flex-1 mb-4">
          {project.short_description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {project.tech_stack.slice(0, 3).map(t => (
            <span key={t} className="font-mono text-[10px] text-muted2">{t}</span>
          )).reduce((prev, curr, i) => [prev, <span key={`sep-${i}`} className="text-muted3 text-[10px]">·</span>, curr])}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-muted3">
            {project.internal && <Lock size={11} />}
            {project.documents && project.documents.length > 0 && <FileText size={11} />}
            {project.github_url && <Github size={11} />}
            {project.demo_url && <ExternalLink size={11} />}
          </div>
          <ArrowUpRight size={14} className="text-muted group-hover:text-accent transition-colors" />
        </div>
      </Card>
    </StaggerItem>
  )
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projectsData.projects
    return projectsData.projects.filter(p => p.category === activeCategory)
  }, [activeCategory])

  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)
  const totalProjects = projectsData.projects.length
  const productionCount = projectsData.projects.filter(p => p.status === 'production').length

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid-faint opacity-60 pointer-events-none" aria-hidden />

      <Container className="relative pt-12 md:pt-16 pb-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-5">Projects · {filtered.length}</p>
          <h1 className="font-display font-semibold text-text tracking-[-0.03em] text-balance mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)' }}>
            Work that shipped.
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed text-balance mb-10">
            Enterprise AI deployments, ML systems, full-stack apps, and personal projects — all anchored to real outcomes.
          </p>

          <div className="grid grid-cols-3 gap-px bg-border mb-12 max-w-md border border-border rounded-md overflow-hidden">
            {[
              { n: totalProjects, l: 'Total' },
              { n: productionCount, l: 'Shipped' },
              { n: 5, l: 'Languages' },
            ].map(s => (
              <div key={s.l} className="bg-surface px-4 py-4">
                <p className="font-display text-2xl font-medium text-text tabular-nums">{s.n}</p>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="tags-scroll mb-10 sticky top-20 z-20 py-2 -mx-6 px-6 bg-bg/80 backdrop-blur-md">
            <div className="flex gap-1 min-w-max">
              {CATEGORIES.map(cat => {
                const active = cat === activeCategory
                const count = cat === 'All' ? projectsData.projects.length : projectsData.projects.filter(p => p.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-surface3 text-text border border-border2'
                        : 'text-muted hover:text-text border border-transparent'
                    }`}
                  >
                    {cat} <span className="text-muted3 ml-1">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {featured.length > 0 && (
          <section className="mb-16">
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-4">Featured</p>
            <Stagger gap={0.08} className="divide-y-0">
              {featured.map((project, i) => (
                <FeaturedRow
                  key={project.id}
                  project={project}
                  reverse={i % 2 === 1}
                  onSelect={setSelectedProject}
                />
              ))}
            </Stagger>
          </section>
        )}

        {rest.length > 0 && (
          <section>
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">All projects</p>
            <Stagger gap={0.04} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map(project => (
                <CompactCard key={project.id} project={project} onSelect={setSelectedProject} />
              ))}
            </Stagger>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted">
            No projects in <span className="text-text">{activeCategory}</span>
          </div>
        )}
      </Container>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
