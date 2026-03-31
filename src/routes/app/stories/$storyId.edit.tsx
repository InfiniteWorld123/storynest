import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { StoryEditorPage } from '#/components/stories/editor/story-editor-page'
import { AppContent } from '#/components/app/app-content'
import { Button } from '#/components/ui/button'
import { getStoryWithCategory } from '#/server/story'

export const Route = createFileRoute('/app/stories/$storyId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { storyId } = Route.useParams()

  const {
    data,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['story', 'edit', storyId],
    queryFn: async () => {
      const res = await getStoryWithCategory({ data: { storyId } })
      return res.data
    },
  })

  if (isPending) {
    return (
      <AppContent>
        <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Loading story editor...
        </p>
      </AppContent>
    )
  }

  if (error) {
    return (
      <AppContent>
        <div
          className="flex max-w-md flex-col gap-4 rounded-[var(--radius)] p-5"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
        >
          <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Could not load this story
          </h2>
          <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Please try again. If the issue continues, this story may not exist anymore.
          </p>
          <Button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="w-fit px-4"
          >
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      </AppContent>
    )
  }

  if (!data) {
    return (
      <AppContent>
        <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Story not found.
        </p>
      </AppContent>
    )
  }

  return <StoryEditorPage mode="edit" prefill={data} />
}
