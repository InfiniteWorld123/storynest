import type { SectionHeadingProps } from '../../types/content'
import { cn } from '../../lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('space-y-3', align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow ? <p className='chapter-label'>{eyebrow}</p> : null}
      <h2 className='font-story-serif text-3xl leading-tight sm:text-4xl'>{title}</h2>
      {description ? <p className='mx-auto max-w-2xl text-[hsl(var(--muted-foreground))]'>{description}</p> : null}
    </header>
  )
}
