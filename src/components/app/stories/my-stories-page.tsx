import * as React from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { AppContent } from '#/components/app/app-content'
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
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, LayoutGrid, List, PenLine, Search, X } from 'lucide-react'
import type { StoryContent, StoryListItem } from '#/types/story'
import { AppStoryDeleteAction } from '#/components/stories/app/app-story-delete-action'
import { StoryViewerSheet } from '#/components/stories/app/story-viewer-sheet'
import { StoryGridCard as SharedStoryGridCard } from '#/components/stories/shared/story-grid-card'
import { StoryListCard as SharedStoryListCard } from '#/components/stories/shared/story-list-card'
import { StoryPagination } from '#/components/stories/shared/story-pagination'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { storiesQueryOptions } from '#/routes/app/stories'
import { MyStoriesSkeleton } from '#/components/stories/app/my-stories-skeleton'

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

const actionBtnStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
  backgroundColor: 'transparent',
}

function EditStoryLink({ storyId }: { storyId: string }) {
  return (
    <Link
      to="/app/stories/$storyId/edit"
      params={{ storyId }}
      className="inline-flex h-7 items-center rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
      style={actionBtnStyle}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      Edit
    </Link>
  )
}

function StoryListCard({
  story,
  index,
  onRead,
}: {
  story: StoryListItem
  index: number
  onRead: (id: string) => void
}) {
  return (
    <SharedStoryListCard
      story={story}
      index={index}
      primaryAction={
        <div className="flex items-center gap-1">
          <AppStoryDeleteAction storyId={story.id} storyTitle={story.title} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRead(story.id)}
            className="h-7 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold"
            style={{ ...actionBtnStyle, backgroundColor: 'transparent' }}
          >
            Read
          </Button>
          <EditStoryLink storyId={story.id} />
        </div>
      }
    />
  )
}

function StoryGridCard({
  story,
  index,
  onRead,
}: {
  story: StoryListItem
  index: number
  onRead: (id: string) => void
}) {
  return (
    <SharedStoryGridCard
      story={story}
      index={index}
      primaryAction={
        <div className="flex items-center gap-1">
          <AppStoryDeleteAction storyId={story.id} storyTitle={story.title} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRead(story.id)}
            className="h-7 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold"
            style={{ ...actionBtnStyle, backgroundColor: 'transparent' }}
          >
            Read
          </Button>
          <EditStoryLink storyId={story.id} />
        </div>
      }
    />
  )
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-4 py-16 text-center"
      style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--card)' }}
    >
      <BookOpen className="size-8 opacity-20" style={{ color: 'var(--foreground)' }} />
      <div>
        <p className="font-serif text-base font-semibold" style={{ color: 'var(--foreground)' }}>
          No stories match your filters.
        </p>
        <p className="mt-1 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Try adjusting your search or category selection.
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

export function MyStoriesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: '/app/stories/' })
  const searchParams = useSearch({ from: '/app/stories/' })
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list')
  const [searchInput, setSearchInput] = React.useState(searchParams.search ?? '')
  const [pendingSort, setPendingSort] = React.useState<SortValue | null>(null)
  const [pendingCategory, setPendingCategory] = React.useState<string | null>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const [viewingStoryId, setViewingStoryId] = React.useState<string | null>(null)

  const { data, isPending, isFetching, error } = useQuery(storiesQueryOptions(searchParams))

  React.useEffect(() => {
    setSearchInput(searchParams.search ?? '')
  }, [searchParams.search])

  const stories: StoryListItem[] = (data?.stories ?? []).map((story) => ({
    id: story.id,
    title: story.title,
    description: story.description,
    content: story.content as StoryContent,
    coverImageUrl: story.coverImageUrl,
    createdAt: new Date(story.createdAt).toISOString(),
    updatedAt: new Date(story.updatedAt).toISOString(),
    userId: story.userId,
    categoryId: story.categoryId,
    category: story.category,
    stats: story.stats,
  }))

  const isFiltered = Boolean(searchParams.search?.trim()) || Boolean(searchParams.category)
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === searchParams.sort)?.label ?? 'Newest first'

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

  const currentPage = data?.pagination.page ?? 1
  const totalPages = data?.pagination.totalPages ?? 1

  const prefetchPage = React.useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) {
        return
      }

      void queryClient.prefetchQuery(
        storiesQueryOptions({
          ...searchParams,
          page,
        }),
      )
    },
    [currentPage, totalPages, queryClient, searchParams],
  )

  const prefetchCategory = React.useCallback(
    (category: typeof searchParams.category | undefined) => {
      if (category === searchParams.category) {
        return
      }
      void queryClient.prefetchQuery(
        storiesQueryOptions({
          ...searchParams,
          page: 1,
          category,
        }),
      )
    },
    [queryClient, searchParams],
  )

  const prefetchSort = React.useCallback(
    (sort: SortValue) => {
      if (sort === searchParams.sort) {
        return
      }
      void queryClient.prefetchQuery(
        storiesQueryOptions({
          ...searchParams,
          page: 1,
          sort,
        }),
      )
    },
    [queryClient, searchParams],
  )

  if (error) {
    throw error
  }

  if (isPending || !data) {
    return <MyStoriesSkeleton />
  }

  return (
    <AppContent>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex items-start justify-between gap-4"
      >
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: 'var(--accent-warm)' }}>
              Your Library
            </span>
            <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
          </div>
          <h1
            className="font-serif font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)', lineHeight: 1.1 }}
          >
            My Stories
          </h1>
          <p className="mt-2 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {data.pagination.total} {data.pagination.total === 1 ? 'story' : 'stories'} in your collection.
          </p>
        </div>

        <Link
          to="/app/stories/new"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)', boxShadow: '0 1px 3px oklch(0 0 0 / 0.12)' }}
        >
          <PenLine className="size-3.5" />
          <span className="hidden sm:inline">New Story</span>
          <span className="sm:hidden">New</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="mb-6"
        style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--muted)' }}
      >
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <Input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search stories…"
              className="h-9 w-full pl-8 pr-8 font-sans text-sm"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              aria-label="Search stories"
            />
            <AnimatePresence>
              {searchInput && (
                <motion.button
                  key="x"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => {
                    setSearchInput('')
                    updateSearch((prev) => ({
                      ...prev,
                      page: 1,
                      search: undefined,
                    }))
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
                type="button"
                variant="outline"
                className="h-9 justify-between gap-2 font-sans text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
              >
                <span className="truncate">{currentSortLabel}</span>
                <ChevronDown className="size-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map(opt => (
                <DropdownMenuItem
                  key={opt.value}
                  onMouseEnter={() => prefetchSort(opt.value)}
                  onClick={() => {
                    setPendingSort(opt.value)
                    updateSearch((prev) => ({
                      ...prev,
                      page: 1,
                      sort: opt.value as SortValue,
                    }))
                  }}
                  style={{
                    backgroundColor:
                      pendingSort === opt.value
                        ? 'var(--muted)'
                        : searchParams.sort === opt.value
                          ? 'var(--muted)'
                          : 'transparent',
                    fontWeight: searchParams.sort === opt.value ? 600 : 500,
                  }}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="flex items-center gap-1 rounded-[var(--radius)] p-1"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
          >
            <Button type="button" variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')} aria-label="List view">
              <List className="size-4" />
            </Button>
            <Button type="button" variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('grid')} aria-label="Grid view">
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} />

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          {CATEGORY_FILTERS.map(cat => {
            const isActive = (searchParams.category ?? '') === cat.slug
            return (
              <Button
                key={cat.slug}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onMouseEnter={() =>
                  prefetchCategory(cat.slug ? (cat.slug as typeof searchParams.category) : undefined)
                }
                onClick={() => {
                  setPendingCategory(cat.slug || '')
                  updateSearch((prev) => ({
                    ...prev,
                    page: 1,
                    category: cat.slug ? (cat.slug as typeof prev.category) : undefined,
                  }))
                }}
                className="h-8 rounded-full px-3 font-sans text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor:
                    pendingCategory === cat.slug
                      ? 'var(--muted)'
                      : isActive
                        ? 'var(--foreground)'
                        : 'var(--background)',
                  color:
                    pendingCategory === cat.slug
                      ? 'var(--foreground)'
                      : isActive
                        ? 'var(--background)'
                        : 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {cat.label}
              </Button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {isFiltered && (
          <motion.div
            key="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="mb-4 flex items-center justify-between gap-3 overflow-hidden"
          >
            <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{data.pagination.total}</span>{' '}
              {data.pagination.total === 1 ? 'story' : 'stories'}
              {searchParams.category && <> in <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{CATEGORY_FILTERS.find(c => c.slug === searchParams.category)?.label}</span></>}
              {searchParams.search?.trim() && <> matching <span className="font-semibold" style={{ color: 'var(--foreground)' }}>&ldquo;{searchParams.search.trim()}&rdquo;</span></>}
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.14 }}>
        {isFetching && (
          <div className="mb-3 font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Updating stories...
          </div>
        )}
        <AnimatePresence mode="wait">
          {stories.length === 0 ? (
            <NoResults key="empty" onClear={clearFilters} />
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: 'var(--card)' }}
            >
              <AnimatePresence>{stories.map((s, i) => <StoryListCard key={s.id} story={s} index={i} onRead={setViewingStoryId} />)}</AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>{stories.map((s, i) => <StoryGridCard key={s.id} story={s} index={i} onRead={setViewingStoryId} />)}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {stories.length > 0 && (
          <StoryPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.limit}
            onPagePrefetch={prefetchPage}
            onPageChange={page => {
              updateSearch((prev) => ({
                ...prev,
                page,
              }))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </motion.div>

      <StoryViewerSheet
        storyId={viewingStoryId}
        onClose={() => setViewingStoryId(null)}
        showEditLink
      />
    </AppContent>
  )
}
