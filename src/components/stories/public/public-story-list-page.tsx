import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, BookOpen, ChevronDown, LayoutGrid, List, Search, X } from 'lucide-react'
import { MOCK_STORIES, type Story } from '#/components/stories/data/stories-mock'
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

// TODO: increase to 10 (or desired limit) when wiring to getStories({ page, limit })
const ITEMS_PER_PAGE = 3

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
  { label: 'Recently updated', value: 'updated' },
  { label: 'Title A → Z', value: 'az' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

function applyFilters(stories: Story[], search: string, category: string, sort: SortValue): Story[] {
  let result = [...stories]
  if (category) result = result.filter(story => story.category.slug === category)
  if (search.trim()) {
    const query = search.trim().toLowerCase()
    result = result.filter(
      story =>
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query),
    )
  }
  result.sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sort === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    if (sort === 'az') return a.title.localeCompare(b.title)
    return 0
  })
  return result
}

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
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list')
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState('')
  const [sort, setSort] = React.useState<SortValue>('newest')
  const [currentPage, setCurrentPage] = React.useState(1)
  // Track saved stories by ID (wire to saveReadLater / removeReadLater when ready)
  const [savedStories, setSavedStories] = React.useState<Set<string>>(new Set())

  function toggleSaved(storyId: string) {
    setSavedStories(prev => {
      const next = new Set(prev)
      if (next.has(storyId)) next.delete(storyId)
      else next.add(storyId)
      return next
      // TODO: wire to saveReadLater({ storyId }) or removeReadLater({ storyId })
    })
  }

  const searchRef = React.useRef<HTMLInputElement>(null)

  const filteredStories = React.useMemo(
    () => applyFilters(MOCK_STORIES, search, activeCategory, sort),
    [search, activeCategory, sort],
  )

  // Reset to page 1 whenever filters change
  React.useEffect(() => { setCurrentPage(1) }, [search, activeCategory, sort])

  const totalPages = Math.max(1, Math.ceil(filteredStories.length / ITEMS_PER_PAGE))
  const pagedStories = filteredStories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const isFiltered = search.trim() !== '' || activeCategory !== ''
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === sort)?.label ?? 'Newest first'

  function clearFilters() {
    setSearch('')
    setActiveCategory('')
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
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search stories…"
              className="h-9 w-full pl-8 pr-8 font-sans text-sm"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
              aria-label="Search stories"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  key="clear-search"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => {
                    setSearch('')
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
                  onSelect={() => setSort(option.value)}
                  className="font-sans text-sm"
                  style={{
                    fontWeight: sort === option.value ? '600' : undefined,
                    color: sort === option.value ? 'var(--accent-warm)' : undefined,
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
            const isActive = activeCategory === category.slug
            return (
              <Button
                key={category.slug}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.slug)}
                className="h-8 rounded-full px-3 font-sans text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor: isActive ? 'var(--foreground)' : 'var(--background)',
                  color: isActive ? 'var(--background)' : 'var(--foreground)',
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
                {filteredStories.length}
              </span>{' '}
              {filteredStories.length === 1 ? 'story' : 'stories'}
              {activeCategory && (
                <>
                  {' '}
                  in{' '}
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {CATEGORY_FILTERS.find(category => category.slug === activeCategory)?.label}
                  </span>
                </>
              )}
              {search.trim() && (
                <>
                  {' '}
                  matching{' '}
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    &ldquo;{search.trim()}&rdquo;
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
        <AnimatePresence mode="wait">
          {filteredStories.length === 0 ? (
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
                {pagedStories.map((story, index) => (
                  <StoryListCard
                    key={story.id}
                    story={story}
                    index={index}
                    primaryAction={
                      <div className="flex items-center gap-1.5">
                        <SaveStoryButton
                          isSaved={savedStories.has(story.id)}
                          onToggle={() => toggleSaved(story.id)}
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
                {pagedStories.map((story, index) => (
                  <StoryGridCard
                    key={story.id}
                    story={story}
                    index={index}
                    primaryAction={
                      <div className="flex items-center gap-1.5">
                        <SaveStoryButton
                          isSaved={savedStories.has(story.id)}
                          onToggle={() => toggleSaved(story.id)}
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

        {filteredStories.length > 0 && (
          <StoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStories.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={page => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </motion.div>
    </section>
  )
}
