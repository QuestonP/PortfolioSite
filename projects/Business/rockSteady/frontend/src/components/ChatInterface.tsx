import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMenu, FiX, FiTool, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { BsRobot, BsChat } from 'react-icons/bs';
import ChatMessage from './ChatMessage';
import ToolPanel from './ToolPanel';
import { useStore } from '../store/agentStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { agentStatus, refreshStatus } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0 },
  };

  const messageContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      {/* Sidebar */}
      <motion.div
        initial={{ x: isSidebarOpen ? 0 : -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-dark-surface border-r border-dark-border flex flex-col ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-2 mb-4">
            <BsRobot className="text-dark-accent text-2xl" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-dark-accent to-dark-accent-hover bg-clip-text text-transparent">
              Strategic AI
            </h1>
          </div>
          <p className="text-dark-text-muted text-sm">Strategic Assistant Agent</p>
        </div>

        {/* Agent Status */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${agentStatus?.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {agentStatus?.healthy ? 'Agent Ready' : 'Agent Offline'}
            </span>
          </div>
          <button
            onClick={refreshStatus}
            className="w-full px-3 py-2 mt-2 rounded-lg bg-dark-surface-alt hover:bg-dark-border transition-colors text-sm flex items-center justify-center gap-2"
          >
            <FiRefreshCw size={14} />
            Refresh Status
          </button>
        </div>

        {/* Tools */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-dark-text-muted mb-4 uppercase tracking-wider">
            Available Tools
          </h2>
          <div className="space-y-2">
            {agentStatus?.tools && agentStatus.tools.map((tool, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="p-3 rounded-lg bg-dark-surface-alt hover:bg-dark-border cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FiTool size={14} className="text-dark-accent" />
                  <span className="font-medium text-sm">{tool.name}</span>
                </div>
                <p className="text-xs text-dark-text-muted">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <button className="w-full px-4 py-2 rounded-lg bg-dark-accent hover:bg-dark-accent-hover text-white font-medium transition-colors flex items-center justify-center gap-2">
            <FiSettings size={16} />
            Settings
          </button>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTools(!showTools)}
              className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors"
            >
              <FiTool size={20} className={showTools ? 'text-dark-accent' : ''} />
            </motion.button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dark-accent to-dark-accent-hover flex items-center justify-center">
                <BsChat className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Chat Messages */}
          <motion.div className="flex-1 flex flex-col overflow-hidden p-6">
            <motion.div
              variants={messageContainerVariants}
              initial="initial"
              animate="animate"
              className="flex-1 overflow-y-auto space-y-4 mb-4"
            >
              <AnimatePresence>
                {messages.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <BsRobot className="mx-auto mb-4 text-4xl text-dark-accent" />
                      <h2 className="text-2xl font-bold mb-2">Welcome to Strategic Assistant</h2>
                      <p className="text-dark-text-muted">Ask me anything about strategic planning, decision-making, or business strategy.</p>
                    </div>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-end"
                  >
                    <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center">
                      <BsRobot className="text-white" size={16} />
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-dark-accent"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </motion.div>

            {/* Input Area */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSendMessage}
              className="flex gap-4"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-dark-surface border border-dark-border focus:border-dark-accent focus:outline-none transition-colors disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-lg bg-dark-accent hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                <FiSend size={18} />
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Tools Panel */}
          <AnimatePresence>
            {showTools && <ToolPanel onClose={() => setShowTools(false)} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
