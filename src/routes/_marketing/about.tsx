import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { AboutPage } from '#/components/marketing/about/about-page'

export const Route = createFileRoute('/_marketing/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicShell>
      <AboutPage />
    </PublicShell>
  )
}
