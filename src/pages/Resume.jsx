import { useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import ResumeDownloadModal from '../components/ResumeDownloadModal'

export default function Resume() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-2">Resume</p>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-text">
              Quest Parker
            </h1>
            <p className="font-body text-sm text-muted mt-1">
              AI Solutions Engineer · Applied AI Champion · BA Computer Science (NLP) — UNC Chapel Hill
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/CurrentResume2PDF.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-white/15 text-text font-body text-sm font-medium transition-all duration-200 hover:border-accent/50 hover:text-accent"
            >
              <ExternalLink size={14} />
              Open
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-bg font-body text-sm font-semibold transition-all duration-200 hover:bg-accent/90 hover:shadow-accent"
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>

        {/* PDF viewer — desktop: iframe, mobile: prompt to download */}
        <div className="border border-white/8 overflow-hidden bg-surface">
          {/* Desktop iframe */}
          <div className="hidden sm:block">
            <iframe
              src="/CurrentResume2PDF.pdf"
              title="Quest Parker Resume"
              className="w-full"
              style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
            />
          </div>
          {/* Mobile fallback */}
          <div className="sm:hidden flex flex-col items-center justify-center py-16 px-6 text-center">
            <Download size={32} className="text-accent mb-4" />
            <h3 className="font-display font-bold text-text text-lg mb-2">View Resume</h3>
            <p className="font-body text-sm text-muted mb-6 leading-relaxed">
              PDF preview isn't available on mobile. Tap below to download or open the full resume.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-accent text-bg font-body text-sm font-semibold transition-all duration-200 hover:bg-accent/90"
              >
                <Download size={14} />
                Download PDF
              </button>
              <a
                href="/CurrentResume2PDF.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/15 text-text font-body text-sm font-medium transition-all duration-200 hover:border-accent/50 hover:text-accent"
              >
                <ExternalLink size={14} />
                Open in Browser
              </a>
            </div>
          </div>
        </div>

        {/* Resume highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Current Role',   value: 'AI Solutions Engineer, Applied AI Champion', sub: 'Celonis' },
            { label: 'Education',      value: 'BA Computer Science (NLP)', sub: 'UNC Chapel Hill — 2024' },
            { label: 'Certification',  value: 'Google Advanced Data Analytics', sub: 'Dec 2025' },
          ].map(item => (
            <div key={item.label} className="border border-white/8 bg-surface p-4">
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">{item.label}</p>
              <p className="font-display font-bold text-text text-sm">{item.value}</p>
              <p className="font-body text-xs text-muted mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>

      <ResumeDownloadModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
