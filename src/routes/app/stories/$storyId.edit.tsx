import { createFileRoute } from '@tanstack/react-router'
import { StoryEditorPage } from '#/components/stories/editor/story-editor-page'
import { getStoryById } from '#/components/stories/data/stories-mock'

export const Route = createFileRoute('/app/stories/$storyId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { storyId } = Route.useParams()
  const story = getStoryById(storyId)
  return <StoryEditorPage mode="edit" prefill={story} />
}
