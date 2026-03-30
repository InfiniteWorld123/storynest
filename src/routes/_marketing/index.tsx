import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { LandingPage } from '#/components/marketing/home/landing-page'

export const Route = createFileRoute('/_marketing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicShell>
      <LandingPage />
    </PublicShell>
  )
}
