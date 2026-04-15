import { Github, Linkedin } from 'lucide-react'
import profile from '../../data/profile.json'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-muted tracking-wider">
          &copy; {new Date().getFullYear()} Quest Parker
        </p>
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors duration-150"
            aria-label="GitHub"
          >
            <Github size={14} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors duration-150"
            aria-label="LinkedIn"
          >
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
