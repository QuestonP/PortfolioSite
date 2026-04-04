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
      className="inline-block font-mono text-lg md:text-xl animate-role-fade"
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
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />

      {/* Accent glow orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Name */}
        <h1 className="font-display font-extrabold text-text leading-none mb-6"
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
        <p className="font-body text-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {profile.bio_short}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/projects"
            className="group flex items-center gap-2 px-6 py-3 bg-accent text-bg font-body font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-accent/90 hover:shadow-accent"
          >
            View Projects
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 border border-white/15 text-text font-body font-medium text-sm tracking-wide transition-all duration-200 hover:border-accent/50 hover:text-accent"
          >
            <Download size={16} />
            Download Resume
          </button>
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
          {profile.roles.map(role => (
            <span
              key={role.id}
              className="font-mono text-xs px-3 py-1 border"
              style={{
                color: role.color,
                borderColor: `${role.color}30`,
                backgroundColor: `${role.color}08`,
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
        <ChevronDown size={20} />
      </a>

      <ResumeDownloadModal open={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}
