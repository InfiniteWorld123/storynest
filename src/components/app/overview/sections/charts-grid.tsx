import type {
  OverviewCategoryPoint,
  OverviewMonthlyPoint,
  OverviewReactionSlice,
  OverviewTrendPoint,
} from '#/components/app/overview/types'
import { BarOutputCard } from '#/components/app/overview/widgets/bar-output-card'
import { LineTrendCard } from '#/components/app/overview/widgets/line-trend-card'
import { PieMixCard } from '#/components/app/overview/widgets/pie-mix-card'
import { StackedCategoryCard } from '#/components/app/overview/widgets/stacked-category-card'

export function ChartsGrid({
  dailyTrend,
  reactionMix,
  categoryActivity,
  monthlyOutput,
}: {
  dailyTrend: OverviewTrendPoint[]
  reactionMix: OverviewReactionSlice[]
  categoryActivity: OverviewCategoryPoint[]
  monthlyOutput: OverviewMonthlyPoint[]
}) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Trends & Analytics
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Visual trends from your current StoryNest activity.
        </p>
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <LineTrendCard
          title='7-Day Engagement Trend'
          description='Likes, comments, and saves received over the past week.'
          data={dailyTrend}
        />
        <PieMixCard
          title='Reaction Mix'
          description='Likes vs dislikes on your stories.'
          data={reactionMix}
        />
        <StackedCategoryCard
          title='Activity by Category'
          description='Likes, comments, and saves grouped by story category.'
          data={categoryActivity}
        />
        <BarOutputCard
          title='Monthly Output'
          description='Stories created by month.'
          data={monthlyOutput}
        />
      </div>
    </section>
  )
}
