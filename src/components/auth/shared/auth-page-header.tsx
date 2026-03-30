interface AuthPageHeaderProps {
  title: string
  description: string
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Amber eyebrow rule */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="h-px w-8 shrink-0"
          style={{ backgroundColor: 'var(--accent-warm)' }}
        />
        <span
          className="font-sans text-[10px] font-bold uppercase tracking-[0.26em]"
          style={{ color: 'var(--accent-warm)' }}
        >
          StoryNest
        </span>
      </div>

      {/* Title */}
      <h1
        className="font-serif font-bold tracking-tight"
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          color: 'var(--foreground)',
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        className="mt-3 font-sans text-sm leading-[1.75]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {description}
      </p>
    </div>
  )
}
