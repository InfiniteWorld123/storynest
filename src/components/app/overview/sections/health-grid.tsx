import type { OverviewHealthMetric } from '#/components/app/overview/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

export function HealthGrid({ metrics }: { metrics: OverviewHealthMetric[] }) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Health Metrics
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Lightweight ratios that quickly tell you how your content performs.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {metrics.map((metric) => (
          <Card key={metric.id} className='border-[var(--border)] bg-[var(--card)]'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm uppercase tracking-[0.16em]' style={{ color: 'var(--muted-foreground)' }}>
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='font-serif text-3xl leading-none' style={{ color: 'var(--foreground)' }}>
                {metric.value}
              </p>
              <CardDescription>{metric.hint}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
