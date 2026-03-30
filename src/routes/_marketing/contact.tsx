import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { ContactPage } from '#/components/marketing/contact/contact-page'

export const Route = createFileRoute('/_marketing/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicShell>
      <ContactPage />
    </PublicShell>
  )
}
