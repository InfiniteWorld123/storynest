import { AppContent } from '#/components/app/app-content'
import { StatsGrid } from '#/components/app/overview/sections/stats-grid'
import { Link, useRouteContext } from '@tanstack/react-router'
import { ArrowRight, Bookmark, PenLine } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { overviewQueryOptions } from '#/routes/app/overview'

// ─── Helpers ───────────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatShortDate(value: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

// ─── Overview Page ─────────────────────────────────────────────────────────
export function OverviewPage() {
  const highlightsRef = useRef<HTMLDivElement>(null)
  const recentRef = useRef<HTMLDivElement>(null)
  const highlightsInView = useInView(highlightsRef, { once: true, margin: '-60px' })
  const recentInView = useInView(recentRef, { once: true, margin: '-40px' })

  const { data: overview } = useSuspenseQuery(overviewQueryOptions())
  const { user } = useRouteContext({ from: '/app' })
  const firstName = user.name?.trim().split(/\s+/)[0] || 'Writer'

  const stats = [
    { value: overview.totals.storiesWritten, label: 'Stories Written' },
    { value: overview.totals.savedForLater, label: 'Saved for Later' },
    { value: overview.totals.categoriesUsed, label: 'Categories Used' },
    { value: overview.totals.reactionsReceived, label: 'Reactions Received' },
    { value: overview.totals.commentsReceived, label: 'Comments Received' },
    { value: overview.totals.timesSaved, label: 'Times Saved' },
  ]
  const bestPerforming = [
    { label: 'Most Liked', story: overview.bestPerforming.mostLiked },
    { label: 'Most Commented', story: overview.bestPerforming.mostCommented },
    { label: 'Most Saved', story: overview.bestPerforming.mostSaved },
  ]

  return (
    <AppContent>

      {/* ── Hero / Greeting ─────────────────────────────────────── */}
      <div className="relative mb-12 overflow-hidden">

        {/* Ghost "S" letterform */}
        <div
          className="pointer-events-none absolute -right-6 -top-10 select-none font-serif leading-none"
          aria-hidden
          style={{
            fontSize: 'clamp(11rem, 26vw, 20rem)',
            color: 'currentColor',
            opacity: 0.045,
            WebkitTextStroke: '1px currentColor',
            lineHeight: 1,
          }}
        >
          S
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
            Your Desk
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
        </motion.div>

        {/* Greeting headline — two-line, big */}
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
          {getGreeting()},
          <br />
          {firstName}.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-4 font-sans text-sm leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          You have{' '}
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {overview.totals.storiesWritten} stories
          </span>{' '}
          in your collection.
        </motion.p>
      </div>

      {/* ── Primary Stats Grid (6 boxes: 3×2) ──────────────────── */}
      <StatsGrid stats={stats} />

      {/* ── Pull quote ──────────────────────────────────────────── */}
      <motion.blockquote
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 pl-5"
        style={{ borderLeft: '3px solid var(--accent-warm)' }}
      >
        <p
          className="font-serif text-base italic leading-[1.85]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          "Every story written is a door opened."
        </p>
      </motion.blockquote>

      {/* ── Best Performing Stories ─────────────────────────────── */}
      <div ref={highlightsRef} className="mb-12">

        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={highlightsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Your Best Performing
          </span>
          <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
        </motion.div>

        {/* Highlights grid */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            backgroundColor: 'var(--card)',
          }}
        >
          {bestPerforming.map((highlight, i) => (
            <motion.div
              key={highlight.label}
              initial={{ opacity: 0, x: -10 }}
              animate={highlightsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {highlight.story ? (
                <Link
                  to="/app/stories/$storyId/edit"
                  params={{ storyId: highlight.story.storyId }}
                  className="group relative flex items-center gap-4 px-5 py-4 transition-colors duration-150"
                  style={{
                    borderBottom: i < bestPerforming.length - 1 ? '1px solid var(--border)' : undefined,
                    backgroundColor: 'var(--card)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                >
                  <span
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                    style={{ backgroundColor: 'var(--accent-warm)' }}
                  />
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
                  >
                    {highlight.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-serif text-sm font-semibold leading-snug tracking-tight transition-colors duration-150 group-hover:text-[var(--accent-warm)] sm:text-base"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {highlight.story.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className="font-mono text-xs font-bold tabular-nums"
                      style={{ color: 'var(--accent-warm)' }}
                    >
                      {highlight.story.count}
                    </span>
                    <ArrowRight
                      className="size-3.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent-warm)]"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                  </div>
                </Link>
              ) : (
                <div
                  className="relative flex items-center gap-4 px-5 py-4"
                  style={{
                    borderBottom: i < bestPerforming.length - 1 ? '1px solid var(--border)' : undefined,
                    backgroundColor: 'var(--card)',
                  }}
                >
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
                  >
                    {highlight.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm font-semibold leading-snug tracking-tight sm:text-base" style={{ color: 'var(--foreground)' }}>
                      No story yet
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums" style={{ color: 'var(--accent-warm)' }}>
                    0
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Recent Stories ───────────────────────────────────────── */}
      <div ref={recentRef} className="mb-12">

        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={recentInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Recent Stories
          </span>
          <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
        </motion.div>

        {/* Story rows */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {overview.recentStories.length === 0 ? (
            <div className="px-5 py-6 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
              No stories yet. Create your first story to see it here.
            </div>
          ) : (
            overview.recentStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -10 }}
                animate={recentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to="/app/stories/$storyId/edit"
                  params={{ storyId: story.id }}
                  className="group relative flex items-center gap-4 px-5 py-4 transition-colors duration-150"
                  style={{
                    borderBottom: i < overview.recentStories.length - 1 ? '1px solid var(--border)' : undefined,
                    backgroundColor: 'var(--card)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--card)')}
                >
                  <span
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                    style={{ backgroundColor: 'var(--accent-warm)' }}
                  />
                  <span
                    className="hidden shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide sm:inline-block"
                    style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
                  >
                    {story.category.name}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-serif text-sm font-semibold leading-snug tracking-tight transition-colors duration-150 group-hover:text-[var(--accent-warm)] sm:text-base"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {story.title}
                    </p>
                    <p
                      className="mt-0.5 hidden truncate font-sans text-xs leading-relaxed sm:block"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {story.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className="font-mono text-xs tabular-nums"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {formatShortDate(story.createdAt)}
                    </span>
                    <ArrowRight
                      className="size-3.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent-warm)]"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* View all link */}
        <div className="mt-3 text-right">
          <Link
            to="/app/stories"
            className="group inline-flex items-center gap-1.5 font-sans text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--accent-warm)' }}
          >
            View all stories
            <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ── Decorative rule ──────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* ── CTA buttons ───────────────────────────────────────────  */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-3"
      >
        <Link
          to="/app/stories/new"
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
        >
          <PenLine className="size-3.5" />
          New Story
        </Link>
        <Link
          to="/app/read-later"
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-colors duration-150"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bookmark className="size-3.5" />
          Browse Read Later
        </Link>
      </motion.div>

    </AppContent>
  )
}
