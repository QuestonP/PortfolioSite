import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Github, Linkedin, Menu, X } from 'lucide-react'
import profile from '../../data/profile.json'

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/projects', label: 'Projects' },
  { to: '/resume',   label: 'Resume'   },
  { to: '/contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/90 backdrop-blur-md border-b border-white/5 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="font-mono text-sm font-bold tracking-widest text-accent uppercase">
            QP
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-body text-xs font-medium tracking-widest uppercase transition-colors duration-150 ${
                    isActive ? 'text-accent' : 'text-muted hover:text-text'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Social icons + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-text transition-colors duration-150 p-1"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-text transition-colors duration-150 p-1"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <button
              className="md:hidden text-muted hover:text-text transition-colors duration-150 p-1 ml-1"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-display text-2xl font-bold tracking-wide transition-colors duration-150 ${
                  isActive ? 'text-accent' : 'text-muted hover:text-text'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="flex gap-6 mt-6">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors">
              <Github size={22} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors">
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
