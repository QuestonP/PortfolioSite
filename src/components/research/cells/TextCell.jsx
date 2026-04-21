export default function TextCell({ heading, id, dropCap = false, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      {heading && (
        <h2 className="font-display font-medium text-text text-2xl md:text-[28px] tracking-[-0.02em] leading-tight mb-5">
          {heading}
        </h2>
      )}
      <div
        className={`prose-editorial text-text space-y-5 ${dropCap ? 'drop-cap' : ''}`}
      >
        {children}
      </div>
    </section>
  )
}
