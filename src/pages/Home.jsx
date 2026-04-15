import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, ChevronDown } from 'lucide-react'
import profile from '../data/profile.json'
import ResumeDownloadModal from '../components/ResumeDownloadModal'

const ROLES = profile.roles.map(r => r.label)
const ROLE_COLORS = profile.roles.map(r => r.color)

function AnimatedRole({ role, color }) {
  return (
    <span
      key={role}
      className="inline-block font-mono text-base md:text-lg animate-role-fade tracking-wide"
      style={{ color }}
    >
      {role}
    </span>
  )
}

export default function Home() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setRoleIdx(i => (i + 1) % ROLES.length)
        setVisible(true)
      }, 250)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Line grid background */}
      <div className="absolute inset-0 line-grid opacity-60 pointer-events-none" />

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />

      {/* Accent glow orb — tighter, more focused */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,143,252,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Horizontal accent line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Name */}
        <h1 className="font-display font-extrabold text-text leading-none mb-6 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}>
          Quest Parker
        </h1>

        {/* Animated role */}
        <div className="h-8 mb-6 flex items-center justify-center">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
            }}
          >
            <AnimatedRole role={ROLES[roleIdx]} color={ROLE_COLORS[roleIdx]} />
          </div>
        </div>

        {/* Bio */}
        <p className="font-body text-muted text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          {profile.bio_short}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/projects"
            className="group flex items-center gap-2 px-6 py-3 bg-accent text-bg font-mono font-semibold text-xs tracking-widest uppercase transition-all duration-200 hover:bg-accent/90 hover:shadow-accent"
          >
            View Projects
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 border border-white/[0.08] text-text font-mono font-medium text-xs tracking-widest uppercase transition-all duration-200 hover:border-accent/40 hover:text-accent"
          >
            <Download size={14} />
            Download Resume
          </button>
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-14">
          {profile.roles.map(role => (
            <span
              key={role.id}
              className="font-mono text-[10px] px-3 py-1 border tracking-wider"
              style={{
                color: role.color,
                borderColor: `${role.color}20`,
                backgroundColor: `${role.color}06`,
              }}
            >
              {role.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#scroll"
        onClick={e => {
          e.preventDefault()
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted hover:text-accent transition-colors duration-150 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={18} />
      </a>

      <ResumeDownloadModal open={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}
