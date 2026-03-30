import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-[var(--radius)] p-6 transition-all duration-300',
        className,
      )}
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Animated left accent bar */}
      <span
        aria-hidden
        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-r-full opacity-0 transition-all duration-300 group-hover:top-0 group-hover:bottom-0 group-hover:opacity-100"
        style={{ backgroundColor: 'var(--accent-warm)' }}
      />

      {/* Icon */}
      <div
        className="mb-5 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] transition-colors duration-300 group-hover:bg-[oklch(0.93_0.025_60)]"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <span
          className="transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-2 font-serif text-lg font-semibold transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)]"
        style={{ color: 'var(--foreground)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {description}
      </p>
    </div>
  )
}
