import { cn } from '#/lib/utils'

interface StatChipProps {
  value: string
  label: string
  className?: string
}

export function StatChip({ value, label, className }: StatChipProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
