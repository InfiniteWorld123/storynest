import type { ReactNode } from 'react'

interface AuthStatusCardProps {
  icon?: ReactNode
  title: string
  description: string
  children?: ReactNode
}

export function AuthStatusCard({
  icon,
  title,
  description,
  children,
}: AuthStatusCardProps) {
  return (
    <div
      className="rounded-[var(--radius)] p-6"
      style={{
        backgroundColor: 'var(--muted)',
        border: '1px solid var(--border)',
      }}
    >
      {icon && (
        <div
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-[var(--radius)]"
          style={{
            backgroundColor: 'oklch(0.93 0.025 60)',
            color: 'var(--accent-warm)',
          }}
        >
          {icon}
        </div>
      )}

      <h3
        className="font-serif text-lg font-semibold leading-snug"
        style={{ color: 'var(--foreground)', marginBottom: '0.375rem' }}
      >
        {title}
      </h3>

      <p
        className="font-sans text-sm leading-[1.75]"
        style={{ color: 'var(--muted-foreground)', marginBottom: children ? '1.25rem' : 0 }}
      >
        {description}
      </p>

      {children}
    </div>
  )
}
