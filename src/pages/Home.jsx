import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import profile from '../data/profile.json'
import ResumeDownloadModal from '../components/ResumeDownloadModal'
import Button from '../components/ui/Button'
import LetterReveal from '../motion/LetterReveal'
import Reveal from '../motion/Reveal'

const ROLES = profile.roles.map(r => r.label)

export default function Home() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const interval = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [reduce])

  return (
    <section className="relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-aurora pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-grid-faint opacity-[0.35] pointer-events-none" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <Reveal delay={0.05}>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-8">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-2 align-middle" />
            Available for new engagements
          </p>
        </Reveal>

        <h1 className="font-display font-semibold text-text leading-[1.02] tracking-[-0.035em] mb-6 text-balance"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 5.5rem)' }}>
          <LetterReveal text="Data solutions that move numbers." />
        </h1>

        <Reveal delay={0.3}>
          <div className="flex items-center justify-center gap-3 mb-10 h-7">
            <span className="font-mono text-xs uppercase tracking-label text-muted3">Practicing as</span>
            <div className="relative h-7 min-w-[200px] flex items-center justify-start">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-sm text-text"
                >
                  {ROLES[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="font-body text-muted text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
            {profile.bio_short}
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button as={Link} to="/projects" variant="primary" size="lg" className="group">
              See recent work
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button onClick={() => setShowModal(true)} variant="secondary" size="lg">
              <Download size={15} />
              Download resume
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.7} className="relative z-10 mt-24 md:mt-32 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
          {[
            { label: 'Currently', value: 'Celonis · AI Solutions Engineer' },
            { label: 'Based in',  value: profile.location },
            { label: 'Focus',     value: 'Applied AI · ML · Data Pipelines' },
          ].map(stat => (
            <div key={stat.label} className="bg-bg px-6 py-6 text-left">
              <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">{stat.label}</p>
              <p className="text-sm text-text">{stat.value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <ResumeDownloadModal open={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}
