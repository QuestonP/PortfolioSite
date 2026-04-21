import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Github, Linkedin, Mail, MapPin, Send, CheckCircle, ArrowUpRight } from 'lucide-react'
import profile from '../data/profile.json'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import { TextInput, TextArea, Field } from '../components/ui/Input'
import Reveal from '../motion/Reveal'
import LetterReveal from '../motion/LetterReveal'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact() {
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

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

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="absolute inset-0 bg-aurora-inverted pointer-events-none" aria-hidden />

      <Container size="narrow" className="relative pt-16 md:pt-24 pb-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-label text-muted2 mb-6">Contact</p>
        </Reveal>

        <h1 className="font-display font-semibold text-text leading-[1.04] tracking-[-0.03em] text-balance mb-8"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)' }}>
          <LetterReveal text="Let's build something real." />
        </h1>

        <Reveal delay={0.2}>
          <p className="font-body text-muted text-lg max-w-xl leading-relaxed text-balance mb-10">
            Open to consulting engagements, full-time roles, and interesting problems. I respond within a day.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted mb-16">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-text transition-colors">
              <Mail size={14} /> {profile.email}
            </a>
            <span className="inline-flex items-center gap-2"><MapPin size={14} /> {profile.location}</span>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-text transition-colors">
              <Github size={14} /> GitHub <ArrowUpRight size={12} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-text transition-colors">
              <Linkedin size={14} /> LinkedIn <ArrowUpRight size={12} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          {status === 'success' ? (
            <div className="border border-border rounded-lg bg-surface p-10 text-center">
              <CheckCircle size={28} className="text-success mx-auto mb-4" />
              <h3 className="font-display font-medium text-text text-xl mb-2">Message sent.</h3>
              <p className="font-body text-muted text-sm">I'll reach back within a day.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 font-body text-sm text-muted hover:text-text underline underline-offset-4"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="border border-border rounded-lg bg-surface p-6 md:p-8 space-y-5"
              noValidate
            >
              <Field label="Name" id="contact-name">
                <TextInput
                  id="contact-name"
                  type="text"
                  name="from_name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-[#F87171] mt-1.5">{errors.name}</p>}
              </Field>

              <Field label="Email" id="contact-email">
                <TextInput
                  id="contact-email"
                  type="email"
                  name="reply_to"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-[#F87171] mt-1.5">{errors.email}</p>}
              </Field>

              <Field label="Message" id="contact-message">
                <TextArea
                  id="contact-message"
                  name="message"
                  placeholder="What are you working on?"
                  rows={8}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="text-xs text-[#F87171] mt-1.5">{errors.message}</p>}
              </Field>

              {status === 'error' && (
                <p className="text-sm text-[#F87171]">
                  Something went wrong — email me directly at {profile.email}.
                </p>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                variant="primary"
                size="lg"
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
                    Send message
                  </>
                )}
              </Button>
            </form>
          )}
        </Reveal>
      </Container>
    </div>
  )
}
