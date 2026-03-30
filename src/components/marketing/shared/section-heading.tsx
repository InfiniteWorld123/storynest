import { cn } from '#/lib/utils'

interface SectionHeadingProps {
  badge?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  badge,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {badge && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3',
            align === 'center' && 'justify-center',
          )}
        >
          <span
            className="h-px w-10 shrink-0"
            style={{ backgroundColor: 'var(--accent-warm)' }}
          />
          <span
            className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            {badge}
          </span>
          {align === 'center' && (
            <span
              className="h-px w-10 shrink-0"
              style={{ backgroundColor: 'var(--accent-warm)' }}
            />
          )}
        </div>
      )}
      <h2
        className="font-serif font-bold tracking-tight"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--foreground)',
          lineHeight: 1.05,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 font-sans text-base leading-relaxed md:text-lg',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
          style={{ color: 'var(--muted-foreground)' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
