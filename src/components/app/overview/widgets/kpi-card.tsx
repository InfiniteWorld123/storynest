import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { OverviewKpi } from '#/components/app/overview/types'
import { MetricBadge } from '#/components/app/overview/widgets/metric-badge'

export function KpiCard({ metric }: { metric: OverviewKpi }) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader className='space-y-3 pb-3'>
        <MetricBadge label={metric.label} />
        <CardTitle
          className='font-serif text-3xl leading-none tabular-nums'
          style={{ color: 'var(--accent-warm)' }}
        >
          {metric.value}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-1'>
        <p className='text-xs uppercase tracking-[0.16em]' style={{ color: 'var(--muted-foreground)' }}>
          {metric.hint}
        </p>
        {metric.delta ? (
          <p className='text-xs font-medium' style={{ color: 'var(--foreground)' }}>
            {metric.delta}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
