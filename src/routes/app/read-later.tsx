import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AppContent } from '#/components/app/app-content'
import { Bookmark, BookOpen, ArrowRight, ChevronDown, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoryViewerSheet } from '#/components/stories/app/story-viewer-sheet'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

export const Route = createFileRoute('/app/read-later')({
  component: ReadLaterPage,
})

// TODO: replace with getReadLaterStories({ page, limit, sortBy }) when wiring backend
import { MOCK_READ_LATER } from '#/components/stories/data/stories-mock'

type SortOrder = 'newest' | 'oldest'

const SORT_OPTIONS: Array<{ label: string; value: SortOrder }> = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatSavedDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatShortMonth(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
}

// ─── Cover placeholder with saved-date badge ─────────────────────────────────
function CoverPlaceholder({ savedAt }: { savedAt: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[var(--radius)]"
      style={{ width: '52px', height: '72px' }}
    >
      {/* Gradient fill */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))',
        }}
      />
      {/* BookOpen icon centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen className="size-4" style={{ color: 'var(--accent-warm)' }} />
      </div>
      {/* Saved date badge — top-right amber chip */}
      <span
        className="absolute right-0.5 top-0.5 rounded-sm px-0.5 font-mono text-[7px] font-bold leading-tight tabular-nums"
        style={{
          backgroundColor: 'var(--accent-warm)',
          color: 'oklch(0.99 0 0)',
          letterSpacing: '0.03em',
        }}
      >
        {formatShortMonth(savedAt)}
      </span>
    </div>
  )
}

// ─── Read Later Card ──────────────────────────────────────────────────────────
function ReadLaterCard({
  item,
  index,
  onRemove,
  onRead,
}: {
  item: (typeof MOCK_READ_LATER)[number]
  index: number
  onRemove: (storyId: string) => void
  onRead: (storyId: string) => void
}) {
  const [confirming, setConfirming] = React.useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-start gap-4 px-5 py-4"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Hover left accent bar */}
      <span
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ backgroundColor: 'var(--accent-warm)' }}
      />

      <CoverPlaceholder savedAt={item.savedAt} />

      <div className="min-w-0 flex-1">
        {/* Category pill + title */}
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
          >
            {item.story.category.name}
          </span>
        </div>

        <Button
          type="button"
          variant="link"
          onClick={() => onRead(item.story.id)}
          className="h-auto p-0 text-left font-serif text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] no-underline hover:text-[var(--accent-warm)] hover:no-underline"
        >
          {item.story.title}
        </Button>

        <p
          className="mt-1 line-clamp-2 font-sans text-[13px] leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {item.story.description}
        </p>

        {/* Bottom row: saved date + remove */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Saved {formatSavedDate(item.savedAt)}
          </span>

          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <span
                  className="font-sans text-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Remove from list?
                </span>
                <Button
                  onClick={() => {
                    setConfirming(false)
                    onRemove(item.storyId)
                  }}
                  size="sm"
                  className="h-7 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
                  style={{
                    backgroundColor: 'oklch(0.5 0.12 25)',
                    color: 'oklch(0.99 0 0)',
                    border: 'none',
                  }}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => setConfirming(false)}
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    backgroundColor: 'transparent',
                  }}
                >
                  No
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="remove-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirming(true)}
                  className="h-7 gap-1.5 rounded-[var(--radius)] px-2.5 font-sans text-xs font-medium transition-all duration-150 hover:border-[oklch(0.65_0.1_25)] hover:bg-[oklch(0.96_0.015_25)] hover:text-[oklch(0.5_0.12_25)]"
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--muted-foreground)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Trash2 className="size-3" />
                  Remove
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[var(--radius)] px-8 py-20 text-center"
      style={{ backgroundColor: 'oklch(0.16 0 0)' }}
    >
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.06\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <Bookmark
          className="mb-5 size-8"
          style={{ color: 'var(--accent-warm)', opacity: 0.9 }}
        />
        <p
          className="font-serif text-xl italic leading-snug"
          style={{ color: 'oklch(0.9 0 0)' }}
        >
          Your reading list is empty.
        </p>
        <p
          className="mt-2 font-sans text-sm leading-relaxed"
          style={{ color: 'oklch(0.6 0 0)' }}
        >
          Save stories you want to revisit — they'll appear here.
        </p>
        <Link
          to="/app/stories"
          className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-70"
          style={{ color: 'var(--accent-warm)' }}
        >
          Discover stories
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Read Later Page ──────────────────────────────────────────────────────────
function ReadLaterPage() {
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('newest')
  // UI-only: track removed story IDs to hide them from the list
  const [removedIds, setRemovedIds] = React.useState<Set<string>>(new Set())
  // Story viewer overlay
  const [viewingStoryId, setViewingStoryId] = React.useState<string | null>(null)

  function handleRemove(storyId: string) {
    setRemovedIds(prev => new Set(prev).add(storyId))
  }

  // Sort + filter mock data (mirrors backend sortBy: newest | oldest)
  const visibleItems = [...MOCK_READ_LATER]
    .filter(item => !removedIds.has(item.storyId))
    .sort((a, b) => {
      const diff = new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      return sortOrder === 'newest' ? diff : -diff
    })

  const currentSortLabel = SORT_OPTIONS.find(option => option.value === sortOrder)?.label ?? 'Newest First'

  return (
    <AppContent>

      {/* ── Hero / Header ─────────────────────────────────────── */}
      <div className="relative mb-12 overflow-hidden">

        {/* Ghost "R" letterform */}
        <div
          className="pointer-events-none absolute -right-4 -top-8 select-none font-serif leading-none"
          aria-hidden
          style={{
            fontSize: 'clamp(11rem, 26vw, 20rem)',
            color: 'currentColor',
            opacity: 0.04,
            WebkitTextStroke: '1px currentColor',
            lineHeight: 1,
          }}
        >
          R
        </div>

        {/* Amber eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Read Later
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold tracking-tight"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: 'var(--foreground)',
            lineHeight: 1.05,
          }}
        >
          Saved
          <br />
          Stories.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-4 font-sans text-sm italic leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {visibleItems.length}{' '}
          {visibleItems.length === 1 ? 'story' : 'stories'} waiting for you.
        </motion.p>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* ── Controls bar ──────────────────────────────────────── */}
      {visibleItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-6 flex items-center justify-between gap-3"
        >
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {visibleItems.length} saved {visibleItems.length === 1 ? 'story' : 'stories'}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 justify-between px-3 font-sans text-sm font-normal"
                style={{ backgroundColor: 'var(--background)', minWidth: '170px' }}
              >
                {currentSortLabel}
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px]">
              <DropdownMenuLabel className="font-sans text-xs uppercase tracking-wide">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSortOrder(option.value)}
                  className="font-sans text-sm"
                  style={{
                    fontWeight: sortOrder === option.value ? '600' : undefined,
                    color: sortOrder === option.value ? 'var(--accent-warm)' : undefined,
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}

      {/* ── Story list ────────────────────────────────────────── */}
      {visibleItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              backgroundColor: 'var(--card)',
            }}
          >
            <AnimatePresence initial={false}>
              {visibleItems.map((item, index) => (
                <ReadLaterCard
                  key={item.storyId}
                  item={item}
                  index={index}
                  onRemove={handleRemove}
                  onRead={setViewingStoryId}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Footer row */}
          <div className="mt-4 flex items-center justify-between">
            <p
              className="font-sans text-xs"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {visibleItems.length} saved
            </p>
            <Link
              to="/app/stories"
              className="group inline-flex items-center gap-1.5 font-sans text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
              style={{ color: 'var(--accent-warm)' }}
            >
              Browse more stories
              <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <EmptyState />
      )}

      {/* ── Story viewer overlay ──────────────────────────────────── */}
      <StoryViewerSheet
        storyId={viewingStoryId}
        onClose={() => setViewingStoryId(null)}
      />

    </AppContent>
  )
}
