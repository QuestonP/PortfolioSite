import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { X, Download, Send, CheckCircle } from 'lucide-react'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ResumeDownloadModal({ open, onClose }) {
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setForm({ name: '', email: '', company: '', message: '' })
      setErrors({})
      setStatus('idle')
    }
  }, [open])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.company.trim()) e.company = 'Company is required'
    return e
  }

  const triggerDownload = () => {
    const a = document.createElement('a')
    a.href = '/CurrentResume2PDF.pdf'
    a.download = 'Quest_Parker_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')

    // Build a message that includes company context
    const hiddenMessage = formRef.current.querySelector('textarea[name="message"]')
    const messageBody = `[Resume Download]\nCompany: ${form.company}${form.message.trim() ? `\n\n${form.message}` : ''}`
    if (hiddenMessage) hiddenMessage.value = messageBody

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      setStatus('success')
      triggerDownload()
    } catch {
      setStatus('error')
    }
  }

  if (!open) return null

  const inputClass = field =>
    `w-full bg-surface2 border font-body text-sm text-text placeholder-muted px-4 py-3 outline-none transition-all duration-150 focus:border-accent/60 ${
      errors[field] ? 'border-red-500/60' : 'border-white/10'
    }`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors duration-150 z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle size={32} className="text-green-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-text text-lg mb-2">Download started!</h3>
              <p className="font-body text-muted text-sm mb-6">Thanks for your interest. I'll be in touch.</p>
              <button
                onClick={onClose}
                className="font-body text-xs text-muted hover:text-text underline"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <Download size={16} className="text-accent" />
                  <p className="font-mono text-xs text-accent uppercase tracking-widest">Download Resume</p>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  Enter your details below to download my resume.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3" noValidate>
                <div>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="font-body text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="reply_to"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="font-body text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className={inputClass('company')}
                  />
                  {errors.company && <p className="font-body text-xs text-red-400 mt-1">{errors.company}</p>}
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Message (optional)"
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`${inputClass('message')} resize-none`}
                  />
                </div>
                {status === 'error' && (
                  <p className="font-body text-xs text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-bg font-body font-semibold text-sm transition-all duration-200 hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Submit & Download
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
