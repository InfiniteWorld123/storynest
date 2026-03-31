import { BookOpen } from 'lucide-react'

export function StoryCoverPlaceholder({
  tall = false,
  coverImageUrl,
  title = 'Story cover',
}: {
  tall?: boolean
  coverImageUrl?: string | null
  title?: string
}) {
  if (coverImageUrl) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-[var(--radius)]"
        style={{
          width: tall ? '100%' : '52px',
          height: tall ? '112px' : '72px',
          backgroundColor: 'var(--muted)',
        }}
      >
        <img
          src={coverImageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[var(--radius)]"
      style={{
        width: tall ? '100%' : '52px',
        height: tall ? '112px' : '72px',
        background: 'linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))',
        color: 'var(--accent-warm)',
      }}
    >
      <BookOpen className={tall ? 'size-5' : 'size-4'} />
    </div>
  )
}
