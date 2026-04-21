import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Github, ExternalLink, Building2, Lock, TrendingUp, FileText } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { EASE } from '../../motion/tokens'

function StatusBadge({ status }) {
  const map = {
    production:  { tone: 'success', label: 'Shipped' },
    development: { tone: 'warn',    label: 'In dev' },
    archived:    { tone: 'muted',   label: 'Archived' },
  }
  const cfg = map[status] || map.archived
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}

export default function ProjectDetailModal({ project, onClose }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            className="fixed inset-0 bg-bg/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            className="relative w-full max-w-4xl mx-4 my-8 md:my-16 border border-border2 bg-surface rounded-lg shadow-paper"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-muted2 hover:text-text transition-colors p-1 rounded-sm"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="p-6 md:p-8 border-b border-border">
              <div className="flex items-center gap-3 mb-5">
                <StatusBadge status={project.status} />
                <span className="font-mono text-[11px] text-muted3">{project.year}</span>
                {project.internal && (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted3">
                    <Lock size={10} />
                    Internal
                  </span>
                )}
              </div>

              <h2 className="font-display font-semibold text-text tracking-[-0.02em] text-balance mb-3"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                {project.title}
              </h2>
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-muted2">
                <Building2 size={11} />
                {project.company}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-7">
              <p className="text-muted leading-relaxed text-pretty max-w-prose">
                {project.long_description}
              </p>

              {project.impact && (
                <div className="flex items-start gap-3 py-4 px-5 border border-border rounded-md bg-surface2">
                  <TrendingUp size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    {project.impact_quantified && (
                      <span className="font-mono text-accent mr-2">{project.impact_quantified}</span>
                    )}
                    <span className="text-muted">
                      {project.impact.replace(project.impact_quantified || '', '').replace(/^[\s—–-]+/, '')}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">Tech stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map(tech => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {project.tags.map(tag => (
                      <span key={tag} className="font-mono text-[11px] text-muted2">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {(project.github_url || project.demo_url) && (
                <div className="flex flex-wrap gap-2">
                  {project.github_url && (
                    <Button
                      as="a"
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="sm"
                    >
                      <Github size={13} />
                      GitHub
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button
                      as="a"
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="sm"
                    >
                      <ExternalLink size={13} />
                      Live demo
                    </Button>
                  )}
                </div>
              )}

              {project.documents && project.documents.length > 0 ? (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">Documents</p>
                  <div className="space-y-4">
                    {project.documents.map((doc, i) => (
                      <div key={i} className="border border-border rounded-md overflow-hidden bg-bg">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface2">
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-muted2" />
                            <span className="font-mono text-[11px] text-text">{doc.name}</span>
                          </div>
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] uppercase tracking-label text-muted2 hover:text-accent transition-colors"
                          >
                            Open
                          </a>
                        </div>
                        <iframe
                          src={doc.file}
                          title={doc.name}
                          className="w-full border-0 block bg-white"
                          style={{ height: '600px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : project.github_url && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-3">Source</p>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-border rounded-md bg-surface2 hover:border-border2 transition-colors group"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Github size={13} className="text-muted2" />
                        <span className="font-mono text-[11px] text-text">GitHub repository</span>
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-label text-muted2 group-hover:text-accent transition-colors">
                        Open
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                      <Github size={32} className="text-muted3" />
                      <p className="font-display font-medium text-text text-lg group-hover:text-accent transition-colors">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted text-center max-w-md leading-relaxed">
                        {project.short_description}
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
