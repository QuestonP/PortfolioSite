import { Download, ExternalLink, AlertCircle } from 'lucide-react'

const HAS_PDF = false // Set to true once you export resume.pdf from Pages and drop it in /public

export default function Resume() {
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
              Value Engineer · Applied AI Champion · MS Computer Science (AI) — CU Boulder
            </p>
          </div>
          <div className="flex items-center gap-3">
            {HAS_PDF && (
              <>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-white/15 text-text font-body text-sm font-medium transition-all duration-200 hover:border-accent/50 hover:text-accent"
                >
                  <ExternalLink size={14} />
                  Open
                </a>
                <a
                  href="/resume.pdf"
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-bg font-body text-sm font-semibold transition-all duration-200 hover:bg-accent/90 hover:shadow-accent"
                >
                  <Download size={14} />
                  Download PDF
                </a>
              </>
            )}
          </div>
        </div>

        {/* PDF viewer or preview image */}
        <div className="border border-white/8 overflow-hidden bg-surface">
          {HAS_PDF ? (
            <iframe
              src="/resume.pdf"
              title="Quest Parker Resume"
              className="w-full"
              style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
            />
          ) : (
            <div>
              {/* Preview image extracted from .pages file */}
              <img
                src="/resume-preview.jpg"
                alt="Quest Parker Resume Preview"
                className="w-full object-contain"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              />
              {/* Prompt to export PDF */}
              <div className="flex items-start gap-3 p-4 border-t border-white/8 bg-surface2">
                <AlertCircle size={15} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="font-body text-xs text-muted leading-relaxed">
                  To enable full PDF viewing and download, open <span className="text-text font-medium">CurrentResume2PDF.pages</span> in Pages,
                  export as PDF (<span className="font-mono">File → Export To → PDF</span>),
                  and save it to <span className="font-mono text-accent">PortfolioWebsite/public/resume.pdf</span>.
                  Then set <span className="font-mono">HAS_PDF = true</span> in <span className="font-mono">src/pages/Resume.jsx</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resume highlights pulled from profile */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Current Role',   value: 'Value Engineer, Applied AI Champion', sub: 'Celonis' },
            { label: 'Education',      value: 'MS Computer Science (AI)', sub: 'CU Boulder — Expected Dec 2026' },
            { label: 'Undergrad',      value: 'BA Computer Science (NLP)', sub: 'UNC Chapel Hill — 2024' },
          ].map(item => (
            <div key={item.label} className="border border-white/8 bg-surface p-4">
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">{item.label}</p>
              <p className="font-display font-bold text-text text-sm">{item.value}</p>
              <p className="font-body text-xs text-muted mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
