import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'
import profile from '../../data/profile.json'

const LINKS = [
  { to: '/about',    label: 'About'    },
  { to: '/projects', label: 'Projects' },
  { to: '/research', label: 'Research' },
  { to: '/impact',   label: 'Impact'   },
  { to: '/resume',   label: 'Resume'   },
  { to: '/contact',  label: 'Contact'  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-text font-medium text-base mb-2">Quest Parker</p>
          <p className="text-muted2 text-sm max-w-xs leading-relaxed">
            Data solutions & applied AI. Based in {profile.location}.
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-4">Pages</p>
          <ul className="grid grid-cols-2 gap-y-2">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-muted hover:text-text transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-4">Elsewhere</p>
          <div className="flex flex-col gap-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
              <Github size={14} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
              <Mail size={14} /> {profile.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-label text-muted3">
            © {year} Quest Parker
          </p>
          <p className="font-mono text-[11px] uppercase tracking-label text-muted3">
            Designed &amp; built in Raleigh, NC
          </p>
        </div>
      </div>
    </footer>
  )
}
