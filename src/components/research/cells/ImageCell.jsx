export default function ImageCell({ src, alt, caption }) {
  return (
    <figure className="border border-border rounded-md bg-surface overflow-hidden">
      {src ? (
        <img src={src} alt={alt || ''} className="w-full block" />
      ) : (
        <div className="flex items-center justify-center py-16 bg-surface2">
          <span className="font-mono text-[11px] uppercase tracking-label text-muted3">Image placeholder</span>
        </div>
      )}
      {caption && (
        <figcaption className="px-4 py-3 border-t border-border">
          <p className="font-mono text-[11px] text-muted2">{caption}</p>
        </figcaption>
      )}
    </figure>
  )
}
