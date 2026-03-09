import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stories')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Stories</h1>
      <Outlet />
    </div>
  )
}
