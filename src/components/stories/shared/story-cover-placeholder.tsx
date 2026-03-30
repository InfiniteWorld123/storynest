import { BookOpen } from 'lucide-react'

export function StoryCoverPlaceholder({ tall = false }: { tall?: boolean }) {
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

