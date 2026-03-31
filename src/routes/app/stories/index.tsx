import { createFileRoute } from '@tanstack/react-router'
import { MyStoriesPage } from '#/components/app/stories/my-stories-page'
import { MyStoriesError } from '#/components/stories/app/my-stories-error'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getUserStoriesWithStats } from '#/server/story'
import { z } from 'zod'

const storiesSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'az', 'za']).default('newest'),
  category: z.enum(['folklore', 'mystery', 'romance', 'myth', 'travel', 'history']).optional(),
  search: z.string().optional(),
})

type StoriesSearch = z.infer<typeof storiesSearchSchema>

export const storiesQueryOptions = (search: StoriesSearch) =>
  queryOptions({
    queryKey: ['stories', 'me', search],
    queryFn: async () => {
      const res = await getUserStoriesWithStats({ data: search })
      return res.data
    },
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

export const Route = createFileRoute('/app/stories/')({
  validateSearch: storiesSearchSchema,
  errorComponent: ({ error, reset }) => <MyStoriesError error={error} reset={reset} />,
  component: MyStoriesPage,
})
