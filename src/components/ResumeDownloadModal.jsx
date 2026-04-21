import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Download, Send, CheckCircle } from 'lucide-react'
import Button from './ui/Button'
import { TextInput, TextArea, Field } from './ui/Input'
import { EASE } from '../motion/tokens'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ResumeDownloadModal({ open, onClose }) {
  const formRef = useRef(null)
  const reduce = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="absolute inset-0 bg-bg/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            className="relative w-full max-w-md bg-surface border border-border2 rounded-lg shadow-paper max-h-[90vh] overflow-y-auto"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted2 hover:text-text transition-colors z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-7">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <CheckCircle size={28} className="text-success mx-auto mb-4" />
                  <h3 className="font-display font-medium text-text text-lg mb-2">Download started</h3>
                  <p className="text-sm text-muted mb-6">Thanks for your interest — I'll be in touch.</p>
                  <button
                    onClick={onClose}
                    className="text-xs text-muted2 hover:text-text underline underline-offset-4"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 pr-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Download size={14} className="text-accent" />
                      <p className="font-mono text-[11px] uppercase tracking-label text-accent">Download resume</p>
                    </div>
                    <h3 className="font-display font-medium text-text text-xl tracking-tight mb-1.5">
                      A quick intro first.
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      Tell me a bit about you and I'll hand over the PDF.
                    </p>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <Field>
                      <TextInput
                        type="text"
                        name="from_name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="text-xs text-[#F87171] mt-1.5">{errors.name}</p>}
                    </Field>
                    <Field>
                      <TextInput
                        type="email"
                        name="reply_to"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-xs text-[#F87171] mt-1.5">{errors.email}</p>}
                    </Field>
                    <Field>
                      <TextInput
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        aria-invalid={!!errors.company}
                      />
                      {errors.company && <p className="text-xs text-[#F87171] mt-1.5">{errors.company}</p>}
                    </Field>
                    <Field>
                      <TextArea
                        name="message"
                        placeholder="Message (optional)"
                        rows={3}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </Field>
                    {status === 'error' && (
                      <p className="text-xs text-[#F87171]">Something went wrong. Try again.</p>
                    )}
                    <Button
                      type="submit"
                      disabled={status === 'loading'}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Submit &amp; download
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
