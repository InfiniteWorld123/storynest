import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stories/read-later')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/stories/read-later"!</div>
}
