import type { OverviewBreakdownGroup } from '#/components/app/overview/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

export function CategoryBreakdowns({ groups }: { groups: OverviewBreakdownGroup[] }) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Category Breakdowns
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Category-level performance for likes, comments, and saves.
        </p>
      </div>

      <div className='grid gap-4 xl:grid-cols-3'>
        {groups.map((group) => (
          <Card key={group.id} className='border-[var(--border)] bg-[var(--card)]'>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {group.rows.map((row, index) => (
                <div
                  key={`${group.id}-${row.category}`}
                  className='flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] px-3 py-2'
                  style={{
                    backgroundColor: 'var(--background)',
                    opacity: 1 - index * 0.05,
                  }}
                >
                  <span className='text-sm font-medium' style={{ color: 'var(--foreground)' }}>
                    {row.category}
                  </span>
                  <span className='font-serif text-lg leading-none tabular-nums' style={{ color: 'var(--accent-warm)' }}>
                    {row.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
