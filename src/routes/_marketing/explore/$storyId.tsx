import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/explore/$storyId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_marketing/explore/$storyId"!</div>
}
