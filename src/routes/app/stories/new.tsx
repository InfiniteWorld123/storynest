import { createFileRoute } from '@tanstack/react-router'
import { StoryEditorPage } from '#/components/stories/editor/story-editor-page'

export const Route = createFileRoute('/app/stories/new')({
  component: () => <StoryEditorPage mode="new" />,
})
