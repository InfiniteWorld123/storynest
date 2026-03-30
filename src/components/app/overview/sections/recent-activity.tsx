import type {
  OverviewRecentComment,
  OverviewRecentEdit,
  OverviewRecentSave,
} from '#/components/app/overview/types'
import { RecentListCard } from '#/components/app/overview/widgets/recent-list-card'

export function RecentActivity({
  comments,
  saves,
  edits,
}: {
  comments: OverviewRecentComment[]
  saves: OverviewRecentSave[]
  edits: OverviewRecentEdit[]
}) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='font-serif text-2xl tracking-tight' style={{ color: 'var(--foreground)' }}>
          Recent Activity
        </h2>
        <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
          Most recent comments, saves, and edits related to your account.
        </p>
      </div>

      <div className='grid gap-4 xl:grid-cols-3'>
        <RecentListCard
          title='Recent Comments on My Stories'
          description='Latest feedback from readers.'
          items={comments.map((item) => ({
            id: item.id,
            title: item.storyTitle,
            subtitle: `@${item.author} — ${item.excerpt}`,
            meta: item.createdAt,
          }))}
        />

        <RecentListCard
          title='Recently Saved by Me'
          description='Stories you added to read later.'
          items={saves.map((item) => ({
            id: item.id,
            title: item.storyTitle,
            subtitle: 'Saved to your personal reading shelf.',
            meta: item.savedAt,
          }))}
        />

        <RecentListCard
          title='Recently Edited'
          description='Your latest story edits.'
          items={edits.map((item) => ({
            id: item.id,
            title: item.storyTitle,
            subtitle: `Category: ${item.category}`,
            meta: item.updatedAt,
          }))}
        />
      </div>
    </section>
  )
}
