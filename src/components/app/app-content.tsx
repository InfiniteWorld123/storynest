import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

interface AppContentProps {
  children: ReactNode
  wide?: boolean
  className?: string
}

export function AppContent({ children, wide = false, className }: AppContentProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full px-6 py-8 md:px-8 lg:px-10',
        wide ? 'max-w-6xl' : 'max-w-5xl',
        className,
      )}
    >
      {children}
    </main>
  )
}
