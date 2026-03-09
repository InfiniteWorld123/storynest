import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stories/$storyId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/stories/$storyId/edit"!</div>
}
