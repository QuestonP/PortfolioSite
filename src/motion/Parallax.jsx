import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function Parallax({
  children,
  range = 20,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [range, -range])
  const MotionTag = motion[Component] || motion.div

  if (reduce) {
    return (
      <Component ref={ref} className={className} {...rest}>
        {children}
      </Component>
    )
  }

  return (
    <MotionTag ref={ref} className={className} style={{ y }} {...rest}>
      {children}
    </MotionTag>
  )
}
