import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8000'

const WELCOME = {
  id: 'welcome',
  type: 'assistant',
  content: "Hey! I'm Quest's AI assistant. Ask me anything — his projects, experience, skills, background, or how to get in touch.",
}

export function useChatAgent() {
  const [messages, setMessages] = useState([WELCOME])
  const [isTyping, setIsTyping] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(r => { if (r.ok) setConnected(true) })
      .catch(() => setConnected(false))
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return

    setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: text }])
    setIsTyping(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.answer,
        docs: data.retrieved_docs || [],
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        content: 'Could not reach the chat backend. Make sure it\'s running.',
      }])
    } finally {
      setIsTyping(false)
    }
  }, [isTyping])

  return { messages, sendMessage, isTyping, connected }
}
