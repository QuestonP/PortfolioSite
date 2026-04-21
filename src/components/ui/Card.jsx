const DENSITY = {
  dense:       'p-4',
  compact:     'p-5',
  comfortable: 'p-7',
  roomy:       'p-8 md:p-10',
}

export default function Card({
  children,
  density = 'compact',
  interactive = false,
  as: Component = 'div',
  className = '',
  ...rest
}) {
  const base = 'bg-surface border border-border rounded-md transition-colors duration-200'
  const hover = interactive
    ? 'hover:bg-surface2 hover:border-border2 cursor-pointer'
    : ''
  return (
    <Component className={`${base} ${DENSITY[density]} ${hover} ${className}`} {...rest}>
      {children}
    </Component>
  )
}
