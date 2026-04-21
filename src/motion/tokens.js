export const EASE = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

export const DUR = {
  fast: 0.28,
  base: 0.45,
  slow: 0.7,
}

export const fadeRise = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE },
  },
}

export const fadeOnly = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
}

export const stagger = (gap = 0.06, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
})

export const viewport = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -10% 0px',
}
