import { forwardRef } from 'react'

const VARIANTS = {
  primary:   'bg-accent text-bg hover:bg-accent2 border border-transparent',
  secondary: 'bg-transparent text-text hover:bg-surface2 border border-border2',
  ghost:     'bg-transparent text-muted hover:text-text border border-transparent hover:underline underline-offset-4',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    as: Component = 'button',
    className = '',
    ...rest
  },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
})

export default Button
