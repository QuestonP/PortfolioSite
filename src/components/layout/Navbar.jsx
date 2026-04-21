import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Menu, X } from 'lucide-react'
import profile from '../../data/profile.json'

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/projects', label: 'Projects' },
  { to: '/research', label: 'Research' },
  { to: '/impact',   label: 'Impact'   },
  { to: '/resume',   label: 'Resume'   },
  { to: '/contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(to + '/')
  }

  return (
    <>
      {/* Desktop floating pill nav */}
      <div className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <nav
          className="flex items-center gap-0.5 px-1.5 py-1.5 rounded-full bg-[rgba(14,15,18,0.7)] backdrop-blur-xl border border-border2 shadow-card"
        >
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="relative px-3.5 py-1.5 text-[13px] font-medium tracking-tight rounded-full transition-colors duration-150"
              >
                {active && !reduce && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-surface3 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {active && reduce && (
                  <span className="absolute inset-0 bg-surface3 rounded-full" />
                )}
                <span className={`relative z-10 ${active ? 'text-text' : 'text-muted hover:text-text'}`}>
                  {label}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Desktop wordmark (top-left) */}
      <div className="hidden md:flex fixed top-5 left-6 z-50 items-center gap-3">
        <NavLink
          to="/"
          className="font-mono text-[13px] font-medium tracking-tight text-text hover:text-accent transition-colors"
        >
          Quest Parker
        </NavLink>
      </div>

      {/* Desktop socials (top-right) */}
      <div className="hidden md:flex fixed top-5 right-6 z-50 items-center gap-3">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-text transition-colors duration-150 p-1.5 rounded-full hover:bg-surface2"
          aria-label="GitHub"
        >
          <Github size={15} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-text transition-colors duration-150 p-1.5 rounded-full hover:bg-surface2"
          aria-label="LinkedIn"
        >
          <Linkedin size={15} />
        </a>
      </div>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[rgba(8,9,11,0.85)] backdrop-blur-xl border-b border-border">
        <div className="h-14 flex items-center justify-between px-5">
          <NavLink to="/" className="font-mono text-sm font-medium text-text">
            Quest Parker
          </NavLink>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            className="text-muted hover:text-text p-1.5 rounded-md"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drop-sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden fixed top-14 left-0 right-0 z-40 bg-bg border-b border-border"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col px-5 py-4 divide-y divide-border">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `py-3 text-lg tracking-tight ${isActive ? 'text-text' : 'text-muted'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="flex gap-5 pt-4 mt-1">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">
                  <Github size={18} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">
                  <Linkedin size={18} />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
