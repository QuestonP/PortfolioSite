import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './tokens'

export default function LetterReveal({
  text,
  as: Component = 'span',
  className = '',
  delay = 0,
  gap = 0.05,
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return <Component className={className}>{text}</Component>
  }

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: gap, delayChildren: delay } },
  }

  const word = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  }

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          className="inline-block"
          aria-hidden="true"
        >
          {w}
          {i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  )
}
