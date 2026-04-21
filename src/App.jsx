import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageTransition from './motion/PageTransition'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import Impact from './pages/Impact'
import Research from './pages/Research'
import FivePillarsAI from './pages/research/FivePillarsAI'
import ChatWidget from './components/chat/ChatWidget'
import { Analytics } from '@vercel/analytics/react'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume"   element={<Resume />} />
          <Route path="/impact"   element={<Impact />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/five-pillars-ai" element={<FivePillarsAI />} />
          <Route path="/contact"  element={<Contact />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent/30">
        <Navbar />
        <main className="flex-1 pt-20 md:pt-24">
          <AnimatedRoutes />
        </main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </div>
    </BrowserRouter>
  )
}
