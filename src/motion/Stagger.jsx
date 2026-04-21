import { motion, useReducedMotion } from 'framer-motion'
import { fadeRise, stagger, viewport } from './tokens'

export function Stagger({
  children,
  as: Component = 'div',
  gap = 0.06,
  delay = 0,
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
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewport, once }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerItem({ children, as: Component = 'div', className = '', ...rest }) {
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
    <MotionTag className={className} variants={fadeRise} {...rest}>
      {children}
    </MotionTag>
  )
}
