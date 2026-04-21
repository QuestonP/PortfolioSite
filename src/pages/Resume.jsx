import { useState } from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import ResumeDownloadModal from '../components/ResumeDownloadModal'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Reveal from '../motion/Reveal'

export default function Resume() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-vignette pointer-events-none" aria-hidden />

      <Container size="default" className="relative pt-12 md:pt-16 pb-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-5">Resume</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h1 className="font-display font-semibold text-text tracking-[-0.03em] leading-[1.05] text-balance mb-3"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
                Quest Parker
              </h1>
              <p className="text-muted text-lg leading-relaxed max-w-xl">
                AI Solutions Engineer at Celonis · Applied AI Champion · BA Computer Science, NLP concentration — UNC Chapel Hill.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                as="a"
                href="/CurrentResume2PDF.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
              >
                <ExternalLink size={14} />
                Open
              </Button>
              <Button onClick={() => setShowModal(true)} variant="primary" size="md">
                <Download size={14} />
                Download PDF
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto max-w-4xl border border-border rounded-lg overflow-hidden bg-surface shadow-paper">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface2">
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-muted2" />
                <span className="font-mono text-[11px] uppercase tracking-label text-muted2">
                  CurrentResume2PDF.pdf
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted3">Updated 2026</span>
            </div>

            <div className="hidden sm:block">
              <iframe
                src="/CurrentResume2PDF.pdf"
                title="Quest Parker resume"
                className="w-full block bg-white"
                style={{ height: 'calc(100vh - 240px)', minHeight: '640px' }}
              />
            </div>

            <div className="sm:hidden flex flex-col items-center justify-center py-14 px-6 text-center bg-surface">
              <FileText size={28} className="text-muted2 mb-4" />
              <h3 className="font-display font-medium text-text text-lg mb-2">PDF preview unavailable on mobile</h3>
              <p className="text-sm text-muted mb-6 leading-relaxed max-w-xs">
                Tap below to download the full resume or open it in your browser.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button onClick={() => setShowModal(true)} variant="primary" size="md" className="w-full">
                  <Download size={14} />
                  Download PDF
                </Button>
                <Button
                  as="a"
                  href="/CurrentResume2PDF.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  <ExternalLink size={14} />
                  Open in browser
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <section aria-label="Printable summary" className="mt-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-label text-muted3 mb-5">Printable summary</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden">
              {[
                { label: 'Current role',   value: 'AI Solutions Engineer',  sub: 'Celonis · Applied AI Champion' },
                { label: 'Education',      value: 'BA Computer Science',    sub: 'UNC Chapel Hill · NLP · 2024' },
                { label: 'Certification',  value: 'Google Advanced Data Analytics', sub: 'December 2025' },
              ].map(item => (
                <div key={item.label} className="bg-surface px-5 py-5">
                  <p className="font-mono text-[11px] uppercase tracking-label text-muted3 mb-2">{item.label}</p>
                  <p className="font-display font-medium text-text text-base leading-snug">{item.value}</p>
                  <p className="text-sm text-muted2 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </Container>

      <ResumeDownloadModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
