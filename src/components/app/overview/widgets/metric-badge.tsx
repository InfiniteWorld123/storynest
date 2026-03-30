import { Badge } from '#/components/ui/badge'

export function MetricBadge({ label }: { label: string }) {
  return (
    <Badge
      className='rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]'
      style={{
        backgroundColor: 'var(--accent-warm-muted)',
        color: 'var(--accent-warm)',
        border: '1px solid var(--border)',
      }}
    >
      {label}
    </Badge>
  )
}
