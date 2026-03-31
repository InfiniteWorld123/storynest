import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, BookOpen, ChevronDown, LayoutGrid, List, Search, X } from 'lucide-react'
import type { StoryContent, StoryListItem } from '#/types/story'
import { StoryGridCard } from '#/components/stories/shared/story-grid-card'
import { StoryListCard } from '#/components/stories/shared/story-list-card'
import { StoryPagination } from '#/components/stories/shared/story-pagination'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { publicStoriesQueryOptions, Route as PublicStoriesRoute } from '#/routes/_marketing/stories'
import { removeReadLater, saveReadLater } from '#/server/readLater'
import { authClient } from '#/lib/auth-client'

const CATEGORY_FILTERS = [
  { label: 'All', slug: '' },
  { label: 'Folklore', slug: 'folklore' },
  { label: 'Romance', slug: 'romance' },
  { label: 'Mystery', slug: 'mystery' },
  { label: 'Myth', slug: 'myth' },
  { label: 'Travel', slug: 'travel' },
  { label: 'History', slug: 'history' },
]

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Title A → Z', value: 'az' },
  { label: 'Title Z → A', value: 'za' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-4 py-16 text-center"
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--card)',
      }}
    >
      <BookOpen className="size-8 opacity-20" style={{ color: 'var(--foreground)' }} />
      <div>
        <p className="font-serif text-base font-semibold" style={{ color: 'var(--foreground)' }}>
          No stories match your filters.
        </p>
        <p className="mt-1 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Try a different keyword or category.
        </p>
      </div>
      <Button
        type="button"
        variant="link"
        onClick={onClear}
        className="h-auto p-0 font-sans text-sm font-semibold text-[var(--accent-warm)] transition-opacity duration-150 hover:opacity-70"
      >
        Clear all filters
      </Button>
    </motion.div>
  )
}

function SaveStoryButton({
  isSaved,
  onToggle,
}: {
  isSaved: boolean
  onToggle: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="h-7 w-7 rounded-[var(--radius)] transition-all duration-150"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: isSaved ? 'oklch(0.93 0.025 60)' : 'transparent',
        color: isSaved ? 'var(--accent-warm)' : 'var(--muted-foreground)',
      }}
      aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
      aria-pressed={isSaved}
    >
      <Bookmark className="size-3.5" style={{ fill: isSaved ? 'var(--accent-warm)' : 'none' }} />
    </Button>
  )
}

function ReadStoryLink({ storyId }: { storyId: string }) {
  return (
    <Link
      to="/stories/$storyId"
      params={{ storyId }}
      className="inline-flex h-7 items-center rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
      style={{
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={event => (event.currentTarget.style.backgroundColor = 'var(--muted)')}
      onMouseLeave={event => (event.currentTarget.style.backgroundColor = 'transparent')}
    >
      Read
    </Link>
  )
}

export function PublicStoryListPage() {
  const queryClient = useQueryClient()
  const navigate = PublicStoriesRoute.useNavigate()
  const searchParams = PublicStoriesRoute.useSearch()
  const sessionQuery = authClient.useSession()
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list')
  const [searchInput, setSearchInput] = React.useState(searchParams.search ?? '')
  const [pendingSort, setPendingSort] = React.useState<SortValue | null>(null)
  const [pendingCategory, setPendingCategory] = React.useState<string | null>(null)
  const viewerUser = sessionQuery.data?.user

  const searchRef = React.useRef<HTMLInputElement>(null)

  const { data, isPending, isFetching, error } = useQuery(publicStoriesQueryOptions(searchParams))

  React.useEffect(() => {
    setSearchInput(searchParams.search ?? '')
  }, [searchParams.search])

  const updateSearch = React.useCallback(
    (updater: (prev: typeof searchParams) => typeof searchParams) => {
      navigate({ search: updater })
    },
    [navigate],
  )

  React.useEffect(() => {
    if (!isFetching) {
      setPendingSort(null)
      setPendingCategory(null)
    }
  }, [isFetching])

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim() ? searchInput.trim() : undefined
      const currentSearch = searchParams.search?.trim() || undefined
      if (nextSearch === currentSearch) {
        return
      }
      updateSearch((prev) => ({
        ...prev,
        page: 1,
        search: nextSearch,
      }))
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput, searchParams.search, updateSearch])

  const stories: StoryListItem[] = (data?.stories ?? []).map((story) => ({
    id: story.id,
    userId: story.userId,
    categoryId: story.categoryId,
    title: story.title,
    description: story.description,
    content: story.content as StoryContent,
    coverImageUrl: story.coverImageUrl,
    createdAt: new Date(story.createdAt).toISOString(),
    updatedAt: new Date(story.updatedAt).toISOString(),
    category: story.category,
    stats: story.stats,
  }))

  const isFiltered = Boolean(searchParams.search?.trim()) || Boolean(searchParams.category)
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === searchParams.sort)?.label ?? 'Newest first'
  const currentPage = data?.pagination.page ?? 1
  const totalPages = data?.pagination.totalPages ?? 1

  const prefetchPage = React.useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    void queryClient.prefetchQuery(publicStoriesQueryOptions({ ...searchParams, page }))
  }, [currentPage, queryClient, searchParams, totalPages])

  const prefetchCategory = React.useCallback((category: typeof searchParams.category | undefined) => {
    if (category === searchParams.category) return
    void queryClient.prefetchQuery(publicStoriesQueryOptions({ ...searchParams, page: 1, category }))
  }, [queryClient, searchParams])

  const prefetchSort = React.useCallback((sort: SortValue) => {
    if (sort === searchParams.sort) return
    void queryClient.prefetchQuery(publicStoriesQueryOptions({ ...searchParams, page: 1, sort }))
  }, [queryClient, searchParams])

  const saveMutation = useMutation({
    mutationFn: async ({
      storyId,
      isSaved,
    }: {
      storyId: string
      isSaved: boolean
    }) => {
      if (isSaved) {
        await removeReadLater({ data: { storyId } })
        return false
      }
      await saveReadLater({ data: { storyId } })
      return true
    },
    onMutate: async ({
      storyId,
      isSaved,
    }: {
      storyId: string
      isSaved: boolean
    }) => {
      const previous = queryClient.getQueriesData({ queryKey: ['stories', 'public'] })

      queryClient.setQueriesData({ queryKey: ['stories', 'public'] }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const value = old as { stories?: StoryListItem[] }
        if (!Array.isArray(value.stories)) return old

        const nextSaved = !isSaved

        return {
          ...value,
          stories: value.stories.map((story) => {
            if (story.id !== storyId || !story.stats) return story
            return {
              ...story,
              stats: {
                ...story.stats,
                isSaved: nextSaved,
                saves: Math.max(0, story.stats.saves + (nextSaved ? 1 : -1)),
              },
            }
          }),
        }
      })

      return { previous }
    },
    onError: (_error, _vars, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value)
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['stories', 'public'] })
      void queryClient.invalidateQueries({ queryKey: ['story', 'public'] })
      void queryClient.invalidateQueries({ queryKey: ['read-later', 'me'] })
      void queryClient.invalidateQueries({ queryKey: ['read-later', 'count', 'me'] })
    },
  })

  function handleToggleSaved(story: StoryListItem) {
    if (!viewerUser) {
      window.location.assign('/sign-in')
      return
    }
    if (!story.stats || saveMutation.isPending) {
      return
    }

    saveMutation.mutate({
      storyId: story.id,
      isSaved: story.stats.isSaved,
    })
  }

  if (error) throw error
  if (isPending || !data) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Loading stories...
        </p>
      </section>
    )
  }

  function clearFilters() {
    setSearchInput('')
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        category: undefined,
        search: undefined,
      }),
    })
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-6" style={{ backgroundColor: 'var(--accent-warm)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Story Library
          </span>
        </div>
        <h1
          className="font-serif font-bold tracking-tight"
          style={{
            fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
            lineHeight: 1.1,
            color: 'var(--foreground)',
          }}
        >
          Explore Stories
        </h1>
        <p className="mt-2 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Browse all published stories with the same filters you see in your app workspace.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06 }}
        className="mb-6"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--muted)',
        }}
      >
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2"
              style={{ color: 'var(--muted-foreground)' }}
            />
            <Input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="Search stories…"
              className="h-9 w-full pl-8 pr-8 font-sans text-sm"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
              aria-label="Search stories"
            />
            <AnimatePresence>
              {searchInput && (
                <motion.button
                  key="clear-search"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => {
                    setSearchInput('')
                    updateSearch((prev) => ({ ...prev, page: 1, search: undefined }))
                    searchRef.current?.focus()
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full justify-between px-3 font-sans text-sm font-normal sm:w-[200px]"
                style={{ backgroundColor: 'var(--background)' }}
              >
                {currentSortLabel}
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="font-sans text-xs uppercase tracking-wide">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onMouseEnter={() => prefetchSort(option.value)}
                  onSelect={() => {
                    setPendingSort(option.value)
                    updateSearch((prev) => ({ ...prev, page: 1, sort: option.value }))
                  }}
                  className="font-sans text-sm"
                  style={{
                    backgroundColor:
                      pendingSort === option.value
                        ? 'var(--muted)'
                        : searchParams.sort === option.value
                          ? 'var(--muted)'
                          : 'transparent',
                    fontWeight: searchParams.sort === option.value ? '600' : undefined,
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius)] p-1"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
          >
            <Button
              type="button"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="size-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} />

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          {CATEGORY_FILTERS.map(category => {
            const isActive = (searchParams.category ?? '') === category.slug
            return (
              <Button
                key={category.slug}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onMouseEnter={() =>
                  prefetchCategory(category.slug ? (category.slug as typeof searchParams.category) : undefined)
                }
                onClick={() => {
                  setPendingCategory(category.slug || '')
                  updateSearch((prev) => ({
                    ...prev,
                    page: 1,
                    category: category.slug ? (category.slug as typeof prev.category) : undefined,
                  }))
                }}
                className="h-8 rounded-full px-3 font-sans text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor:
                    pendingCategory === category.slug
                      ? 'var(--muted)'
                      : isActive
                        ? 'var(--foreground)'
                        : 'var(--background)',
                  color:
                    pendingCategory === category.slug
                      ? 'var(--foreground)'
                      : isActive
                        ? 'var(--background)'
                        : 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {category.label}
              </Button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {isFiltered && (
          <motion.div
            key="public-status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="mb-4 flex items-center justify-between gap-3 overflow-hidden"
          >
            <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                {data.pagination.total}
              </span>{' '}
              {data.pagination.total === 1 ? 'story' : 'stories'}
              {searchParams.category && (
                <>
                  {' '}
                  in{' '}
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {CATEGORY_FILTERS.find(category => category.slug === searchParams.category)?.label}
                  </span>
                </>
              )}
              {searchParams.search?.trim() && (
                <>
                  {' '}
                  matching{' '}
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    &ldquo;{searchParams.search.trim()}&rdquo;
                  </span>
                </>
              )}
            </p>
            <Button
              type="button"
              variant="link"
              onClick={clearFilters}
              className="h-auto shrink-0 p-0 font-sans text-xs font-semibold text-[var(--accent-warm)] transition-opacity duration-150 hover:opacity-70"
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28, delay: 0.12 }}>
        {isFetching && (
          <div className="mb-3 font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Updating stories...
          </div>
        )}
        <AnimatePresence mode="wait">
          {stories.length === 0 ? (
            <NoResults key="public-empty" onClear={clearFilters} />
          ) : viewMode === 'list' ? (
            <motion.div
              key="public-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                backgroundColor: 'var(--card)',
              }}
            >
              <AnimatePresence>
                {stories.map((story, index) => (
                  <StoryListCard
                    key={story.id}
                    story={story}
                    index={index}
                    primaryAction={
                      <div className="flex items-center gap-1.5">
                        <SaveStoryButton
                          isSaved={story.stats?.isSaved ?? false}
                          onToggle={() => handleToggleSaved(story)}
                        />
                        <ReadStoryLink storyId={story.id} />
                      </div>
                    }
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="public-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {stories.map((story, index) => (
                  <StoryGridCard
                    key={story.id}
                    story={story}
                    index={index}
                    primaryAction={
                      <div className="flex items-center gap-1.5">
                        <SaveStoryButton
                          isSaved={story.stats?.isSaved ?? false}
                          onToggle={() => handleToggleSaved(story)}
                        />
                        <ReadStoryLink storyId={story.id} />
                      </div>
                    }
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {stories.length > 0 && (
          <StoryPagination
            currentPage={data.pagination.page}
            totalPages={totalPages}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.limit}
            onPagePrefetch={prefetchPage}
            onPageChange={page => {
              updateSearch((prev) => ({ ...prev, page }))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </motion.div>
    </section>
  )
}
