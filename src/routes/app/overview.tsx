import { createFileRoute } from '@tanstack/react-router'
import { OverviewPage } from '#/components/app/overview/overview-page'

export const Route = createFileRoute('/app/overview')({
  component: OverviewPage,
})
