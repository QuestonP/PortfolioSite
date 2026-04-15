import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Github, Linkedin, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import profile from '../data/profile.json'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function RevealWrapper({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function Contact() {
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = field =>
    `w-full bg-surface2 border font-body text-sm text-text placeholder-muted px-4 py-3 outline-none transition-all duration-150 focus:border-accent/60 ${
      errors[field] ? 'border-red-500/60' : 'border-white/[0.06]'
    }`

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <RevealWrapper>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">Contact</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-text mb-4">
              Let's build something.
            </h1>
            <p className="font-body text-muted text-base max-w-xl leading-relaxed">
              Open to consulting engagements, full-time roles, and interesting problems. Reach out — I respond fast.
            </p>
          </RevealWrapper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6" >
            <RevealWrapper delay={50}>
              <div className="border border-white/[0.04] bg-surface p-6 space-y-4">
                <p className="font-mono text-xs text-muted uppercase tracking-wider mb-4">Direct</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-muted hover:text-text transition-colors duration-150 group"
                >
                  <Mail size={15} className="text-accent flex-shrink-0" />
                  <span className="font-body text-sm group-hover:underline">{profile.email}</span>
                </a>
                <div className="flex items-center gap-3 text-muted">
                  <MapPin size={15} className="text-accent flex-shrink-0" />
                  <span className="font-body text-sm">{profile.location}</span>
                </div>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={100}>
              <div className="border border-white/[0.04] bg-surface p-6">
                <p className="font-mono text-xs text-muted uppercase tracking-wider mb-4">Socials</p>
                <div className="space-y-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted hover:text-text transition-colors duration-150 group"
                  >
                    <Github size={15} className="text-accent flex-shrink-0" />
                    <span className="font-body text-sm group-hover:underline">github.com/QuestonP</span>
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted hover:text-text transition-colors duration-150 group"
                  >
                    <Linkedin size={15} className="text-accent flex-shrink-0" />
                    <span className="font-body text-sm group-hover:underline">linkedin.com/in/questonparker</span>
                  </a>
                </div>
              </div>
            </RevealWrapper>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-5">
            <RevealWrapper delay={120}>
              {status === 'success' ? (
                <div className="border border-green-500/20 bg-green-500/5 p-10 text-center">
                  <CheckCircle size={32} className="text-green-400 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-text text-lg mb-2">Message sent.</h3>
                  <p className="font-body text-muted text-sm">I'll be in touch shortly.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 font-body text-xs text-muted hover:text-text underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="border border-white/[0.04] bg-surface p-6 space-y-4" noValidate>
                  <p className="font-mono text-xs text-muted uppercase tracking-wider mb-5">Send a message</p>
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
                    <textarea
                      name="message"
                      placeholder="What are you working on?"
                      rows={10}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={`${inputClass('message')} resize-none`}
                    />
                    {errors.message && <p className="font-body text-xs text-red-400 mt-1">{errors.message}</p>}
                  </div>
                  {status === 'error' && (
                    <p className="font-body text-xs text-red-400">
                      Something went wrong. Email me directly at {profile.email}
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
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </RevealWrapper>
          </div>
        </div>

      </div>
    </div>
  )
}
