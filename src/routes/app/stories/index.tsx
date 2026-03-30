import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
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
import { MOCK_STORIES, type Story } from '#/components/stories/data/stories-mock'
import { AppStoryDeleteAction } from '#/components/stories/app/app-story-delete-action'
import { StoryViewerSheet } from '#/components/stories/app/story-viewer-sheet'
import { StoryGridCard as SharedStoryGridCard } from '#/components/stories/shared/story-grid-card'
import { StoryListCard as SharedStoryListCard } from '#/components/stories/shared/story-list-card'
import { StoryPagination } from '#/components/stories/shared/story-pagination'

// TODO: increase to 10 (or desired limit) when wiring to getUserStories({ page, limit })
const ITEMS_PER_PAGE = 3

export const Route = createFileRoute('/app/stories/')({
  component: MyStoriesPage,
})

// ─── Category + sort config ──────────────────────────────────────────────────
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

// ─── Filter logic ────────────────────────────────────────────────────────────
function applyFilters(stories: Story[], search: string, category: string, sort: SortValue): Story[] {
  let result = [...stories]
  if (category) result = result.filter(s => s.category.slug === category)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter(
      s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
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

// ─── Shared action button style ──────────────────────────────────────────────
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

// ─── List card ───────────────────────────────────────────────────────────────
function StoryListCard({
  story,
  index,
  onRead,
}: {
  story: Story
  index: number
  onRead: (id: string) => void
}) {
  return (
    <SharedStoryListCard
      story={story}
      index={index}
      primaryAction={
        <div className="flex items-center gap-1">
          <AppStoryDeleteAction storyTitle={story.title} />
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

// ─── Grid card ───────────────────────────────────────────────────────────────
function StoryGridCard({
  story,
  index,
  onRead,
}: {
  story: Story
  index: number
  onRead: (id: string) => void
}) {
  return (
    <SharedStoryGridCard
      story={story}
      index={index}
      primaryAction={
        <div className="flex items-center gap-1">
          <AppStoryDeleteAction storyTitle={story.title} />
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

// ─── No results ───────────────────────────────────────────────────────────────
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

// ─── My Stories Page ──────────────────────────────────────────────────────────
function MyStoriesPage() {
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list')
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState('')
  const [sort, setSort] = React.useState<SortValue>('newest')
  const searchRef = React.useRef<HTMLInputElement>(null)
  // Story viewer overlay
  const [viewingStoryId, setViewingStoryId] = React.useState<string | null>(null)
  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)

  const filtered = React.useMemo(
    () => applyFilters(MOCK_STORIES, search, activeCategory, sort),
    [search, activeCategory, sort],
  )

  // Reset to page 1 whenever filters change
  React.useEffect(() => { setCurrentPage(1) }, [search, activeCategory, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pagedStories = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const isFiltered = search.trim() !== '' || activeCategory !== ''
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Newest first'

  function clearFilters() {
    setSearch('')
    setActiveCategory('')
  }

  return (
    <AppContent>

      {/* ── Header ─────────────────────────────────────────────── */}
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
            {MOCK_STORIES.length} {MOCK_STORIES.length === 1 ? 'story' : 'stories'} in your collection.
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

      {/* ── Filter panel ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="mb-6"
        style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--muted)' }}
      >
        {/* Row 1: Search + Sort + View */}
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:p-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <Input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stories…"
              className="h-9 w-full pl-8 pr-8 font-sans text-sm"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              aria-label="Search stories"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  key="x"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => { setSearch(''); searchRef.current?.focus() }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Sort */}
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
              <DropdownMenuLabel className="font-sans text-xs uppercase tracking-wide">Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map(opt => (
                <DropdownMenuItem
                  key={opt.value}
                  onSelect={() => setSort(opt.value)}
                  className="font-sans text-sm"
                  style={{ fontWeight: sort === opt.value ? '600' : undefined, color: sort === opt.value ? 'var(--accent-warm)' : undefined }}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View toggle */}
          <div
            className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius)] p-1"
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

        {/* Row 2: Category pills */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          {CATEGORY_FILTERS.map(cat => {
            const isActive = activeCategory === cat.slug
            return (
              <Button
                key={cat.slug}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.slug)}
                className="h-8 rounded-full px-3 font-sans text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor: isActive ? 'var(--foreground)' : 'var(--background)',
                  color: isActive ? 'var(--background)' : 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {cat.label}
              </Button>
            )
          })}
        </div>
      </motion.div>

      {/* ── Filter status bar ──────────────────────────────────── */}
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
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'story' : 'stories'}
              {activeCategory && <> in <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{CATEGORY_FILTERS.find(c => c.slug === activeCategory)?.label}</span></>}
              {search.trim() && <> matching <span className="font-semibold" style={{ color: 'var(--foreground)' }}>&ldquo;{search.trim()}&rdquo;</span></>}
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

      {/* ── Stories ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.14 }}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <NoResults key="empty" onClear={clearFilters} />
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: 'var(--card)' }}
            >
              <AnimatePresence>{pagedStories.map((s, i) => <StoryListCard key={s.id} story={s} index={i} onRead={setViewingStoryId} />)}</AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>{pagedStories.map((s, i) => <StoryGridCard key={s.id} story={s} index={i} onRead={setViewingStoryId} />)}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length > 0 && (
          <StoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={page => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </motion.div>

      {/* ── Story viewer overlay ────────────────────────────────── */}
      <StoryViewerSheet
        storyId={viewingStoryId}
        onClose={() => setViewingStoryId(null)}
        showEditLink
      />

    </AppContent>
  )
}
