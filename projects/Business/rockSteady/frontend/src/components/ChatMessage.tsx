import React from 'react';
import { motion } from 'framer-motion';
import { BsRobot, BsPersonCircle } from 'react-icons/bs';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const messageVariants = {
    initial: { opacity: 0, x: isUser ? 20 : -20, y: 10 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const bubbleVariants = {
    initial: { scaleX: 0.8, opacity: 0 },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 },
    },
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <motion.div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <BsPersonCircle className="text-white" size={18} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center">
            <BsRobot className="text-white" size={18} />
          </div>
        )}
      </motion.div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
        <motion.div
          variants={bubbleVariants}
          initial="initial"
          animate="animate"
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
              : 'bg-dark-surface-alt text-dark-text rounded-bl-none border border-dark-border'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </motion.div>

        {/* Timestamp */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-dark-text-muted mt-1"
        >
          {formatTime(message.timestamp)}
        </motion.span>
      </div>
    </motion.div>
  );
}
