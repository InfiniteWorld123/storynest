import type { OverviewLeaderboardGroup } from '#/components/app/overview/types'
import { LeaderboardTable } from '#/components/app/overview/widgets/leaderboard-table'

export function Leaderboards({ groups }: { groups: OverviewLeaderboardGroup[] }) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Leaderboards
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Top stories by likes, saves, and comments using account-level sample data.
        </p>
      </div>

      <div className='grid gap-4'>
        {groups.map((group) => (
          <LeaderboardTable key={group.id} group={group} />
        ))}
      </div>
    </section>
  )
}
