import { MetricBadge } from '#/components/app/overview/widgets/metric-badge'
import type { OverviewTimeframe } from '#/components/app/overview/types'
import { Button } from '#/components/ui/button'

export function HeroStrip({
  title,
  description,
  timeframes,
  activeTimeframe,
  lastUpdated,
}: {
  title: string
  description: string
  timeframes: OverviewTimeframe[]
  activeTimeframe: OverviewTimeframe
  lastUpdated: string
}) {
  return (
    <section className='space-y-5'>
      <div className='flex flex-wrap items-center gap-2'>
        <MetricBadge label='Overview' />
        <MetricBadge label='Static analytics mode' />
      </div>

      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='space-y-2'>
          <h1
            className='font-serif text-3xl font-semibold tracking-tight sm:text-4xl'
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h1>
          <p className='max-w-3xl text-sm leading-relaxed' style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </p>
          <p className='text-xs uppercase tracking-[0.14em]' style={{ color: 'var(--muted-foreground)' }}>
            Last updated {lastUpdated}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe}
              type='button'
              size='sm'
              variant={timeframe === activeTimeframe ? 'default' : 'outline'}
              className='h-8 rounded-full px-4 text-xs tracking-wide'
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
