import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { PublicStoryDetailPage } from '#/components/stories/public/public-story-detail-page'

export const Route = createFileRoute('/_marketing/stories/$storyId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { storyId } = Route.useParams()
  return (
    <PublicShell>
      <PublicStoryDetailPage storyId={storyId} />
    </PublicShell>
  )
}
