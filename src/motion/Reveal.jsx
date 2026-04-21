import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, viewport } from './tokens'

export default function Reveal({
  children,
  as: Component = 'div',
  delay = 0,
  y = 16,
  duration = DUR.base,
  className = '',
  once = true,
  ...rest
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Component] || motion.div

  if (reduce) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...viewport, once }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
