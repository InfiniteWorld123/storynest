import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

interface ContentSplitProps {
  children: [ReactNode, ReactNode]
  reverse?: boolean
  className?: string
}

export function ContentSplit({
  children,
  reverse,
  className,
}: ContentSplitProps) {
  const [left, right] = children
  return (
    <div
      className={cn(
        'grid items-center gap-12 md:grid-cols-2 lg:gap-16',
        reverse && 'md:[&>*:first-child]:order-2',
        className,
      )}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
