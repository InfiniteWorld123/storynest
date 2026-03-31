import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/story/new')({
  beforeLoad: () => {
    throw redirect({ to: '/app/stories/new' })
  },
})
