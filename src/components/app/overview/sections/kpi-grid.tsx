import type { OverviewKpi } from '#/components/app/overview/types'
import { KpiCard } from '#/components/app/overview/widgets/kpi-card'

export function KpiGrid({ metrics }: { metrics: OverviewKpi[] }) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Core Metrics
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Your account-level totals across stories, reactions, comments, and saves.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {metrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  )
}
