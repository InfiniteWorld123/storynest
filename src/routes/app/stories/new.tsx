import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stories/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/stories/new"!</div>
}
