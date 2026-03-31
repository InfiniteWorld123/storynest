import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '#/components/marketing/layout/public-shell'
import { PublicStoryListPage } from '#/components/stories/public/public-story-list-page'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getStories } from '#/server/story'
import { z } from 'zod'

const publicStoriesSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'az', 'za']).default('newest'),
  category: z.enum(['folklore', 'mystery', 'romance', 'myth', 'travel', 'history']).optional(),
  search: z.string().optional(),
})

type PublicStoriesSearch = z.infer<typeof publicStoriesSearchSchema>

export const publicStoriesQueryOptions = (search: PublicStoriesSearch) =>
  queryOptions({
    queryKey: ['stories', 'public', search],
    queryFn: async () => {
      const res = await getStories({ data: search })
      return res.data
    },
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

export const Route = createFileRoute('/_marketing/stories/')({
  validateSearch: publicStoriesSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicShell>
      <PublicStoryListPage />
    </PublicShell>
  )
}
