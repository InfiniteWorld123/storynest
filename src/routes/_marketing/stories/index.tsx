import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { PublicStoryListPage } from '#/components/stories/public/public-story-list-page'

export const Route = createFileRoute('/_marketing/stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicShell>
      <PublicStoryListPage />
    </PublicShell>
  )
}
