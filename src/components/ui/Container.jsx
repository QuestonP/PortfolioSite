export default function Container({
  children,
  size = 'default',
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    prose: 'max-w-2xl',
  }
  return (
    <Component className={`${widths[size]} mx-auto px-6 ${className}`} {...rest}>
      {children}
    </Component>
  )
}
