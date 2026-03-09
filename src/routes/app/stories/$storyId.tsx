import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stories/$storyId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/stories/$storyId"!</div>
}
