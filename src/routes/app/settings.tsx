import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '#/components/app/settings/settings-page'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})
