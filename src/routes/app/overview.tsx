import { createFileRoute } from '@tanstack/react-router'
import { OverviewPage } from '#/components/app/overview/overview-page'
import { OverviewSkeleton } from '#/components/app/overview/overview-skeleton'
import { OverviewError } from '#/components/app/overview/overview-error'
import { queryOptions } from '@tanstack/react-query'
import { getUserOverviewStats } from '#/server/story'

export const overviewQueryOptions = () =>
  queryOptions({
    queryKey: ['overview', 'me'],
    queryFn: async () => {
      const res = await getUserOverviewStats({ data: { recentLimit: 3 } })
      return res.data
    },
    staleTime: 10_000,
  })

export const Route = createFileRoute('/app/overview')({
  pendingComponent: OverviewSkeleton,
  errorComponent: ({ error, reset }) => (
    <OverviewError error={error} reset={reset} />
  ),
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(overviewQueryOptions())
  },
  component: OverviewPage,
})
