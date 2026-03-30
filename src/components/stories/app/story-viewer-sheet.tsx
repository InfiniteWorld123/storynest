import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  Bookmark,
  BookOpen,
  Calendar,
  MessageCircle,
  PenLine,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react'
import {
  getStoryById,
  getCommentsByStoryId,
  MOCK_ENGAGEMENT,
  formatDate,
} from '../data/stories-mock'
import { PublicComments } from '../public/public-comments'
import { Button } from '#/components/ui/button'
import { renderStoryContent } from '../shared/render-story-content'

// ─── Story Viewer Sheet ───────────────────────────────────────────────────────
export function StoryViewerSheet({
  storyId,
  onClose,
  showEditLink = false,
}: {
  storyId: string | null
  onClose: () => void
  /** Pass true when opened from My Stories — shows the Edit Story link */
  showEditLink?: boolean
}) {
  const story = storyId ? getStoryById(storyId) : null
  const comments = storyId ? getCommentsByStoryId(storyId) : []
  const eng = storyId ? MOCK_ENGAGEMENT[storyId] : null

  // Engagement interaction state
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null)
  const [saved, setSaved] = useState(false)

  // Reset interaction state when a different story is opened
  useEffect(() => {
    setReaction(null)
    setSaved(false)
  }, [storyId])

  // Close on Escape key
  useEffect(() => {
    if (!storyId) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [storyId, onClose])

  // Prevent body scroll while panel is open
  useEffect(() => {
    if (storyId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [storyId])

  function toggleReaction(r: 'like' | 'dislike') {
    setReaction(prev => (prev === r ? null : r))
    // TODO: wire to toggleReaction({ storyId, reaction: r })
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {storyId && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">

          {/* ── Backdrop ──────────────────────────────────────────── */}
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Close story viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Panel ─────────────────────────────────────────────── */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col overflow-hidden shadow-2xl sm:max-w-2xl"
            style={{
              backgroundColor: 'var(--background)',
              borderLeft: '1px solid var(--border)',
            }}
          >

            {/* ── Panel top bar ────────────────────────────────────── */}
            <div
              className="flex shrink-0 items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
            >
              {/* Amber eyebrow */}
              <div className="flex items-center gap-3">
                <span className="h-px w-4 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
                <span
                  className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: 'var(--accent-warm)' }}
                >
                  Reading
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Story link — only from My Stories */}
                {showEditLink && story && (
                  <Link
                    to="/app/stories/$storyId/edit"
                    params={{ storyId: story.id }}
                    onClick={onClose}
                    className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <PenLine className="size-3" />
                    Edit Story
                  </Link>
                )}

                {/* Close button */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Close story viewer"
                  onClick={onClose}
                  className="h-7 w-7 rounded-[var(--radius)] transition-colors duration-150"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* ── Scrollable content ───────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {!story ? (
                // Story not found state
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-8 text-center">
                  <div
                    className="flex size-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <BookOpen className="size-6" style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                  <div>
                    <p className="font-serif text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                      Story not found
                    </p>
                    <p className="mt-2 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      This story may have been removed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-prose px-6 py-10 sm:px-10">

                  {/* ── Story hero ────────────────────────────────── */}
                  <header className="mb-10">

                    {/* Category pill */}
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-px w-5" style={{ backgroundColor: 'var(--accent-warm)' }} />
                      <span
                        className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
                      >
                        {story.category.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h1
                      className="font-serif font-bold tracking-tight"
                      style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                        lineHeight: 1.1,
                        color: 'var(--foreground)',
                      }}
                    >
                      {story.title}
                    </h1>

                    {/* Description */}
                    <p
                      className="mt-3 font-serif text-base italic leading-relaxed"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {story.description}
                    </p>

                    {/* Meta + engagement row */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">

                      {/* Date */}
                      <div
                        className="flex items-center gap-1.5 px-2 py-0.5"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <Calendar className="size-3.5" />
                        <span className="font-mono text-xs tabular-nums">{formatDate(story.createdAt)}</span>
                      </div>

                      {eng && (
                        <>
                          <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

                          {/* Like */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReaction('like')}
                            className="h-auto rounded-full px-2 py-0.5 transition-all duration-150"
                            style={{
                              backgroundColor: reaction === 'like' ? 'oklch(0.93 0.025 60)' : 'transparent',
                              color: reaction === 'like' ? 'var(--accent-warm)' : 'var(--muted-foreground)',
                            }}
                            aria-pressed={reaction === 'like'}
                            aria-label={reaction === 'like' ? 'Unlike' : 'Like story'}
                          >
                            <ThumbsUp
                              className="size-3.5"
                              style={{ fill: reaction === 'like' ? 'var(--accent-warm)' : 'none' }}
                            />
                            <span className="font-mono text-xs tabular-nums">
                              {eng.likes + (reaction === 'like' ? 1 : 0)}
                            </span>
                          </Button>

                          {/* Dislike */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReaction('dislike')}
                            className="h-auto rounded-full px-2 py-0.5 transition-all duration-150"
                            style={{
                              color: reaction === 'dislike' ? 'var(--destructive)' : 'var(--muted-foreground)',
                            }}
                            aria-pressed={reaction === 'dislike'}
                            aria-label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike story'}
                          >
                            <ThumbsDown className="size-3.5" />
                            <span className="font-mono text-xs tabular-nums">
                              {eng.dislikes + (reaction === 'dislike' ? 1 : 0)}
                            </span>
                          </Button>

                          <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

                          {/* Comments */}
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            <MessageCircle className="size-3.5" />
                            <span className="font-mono text-xs tabular-nums">{comments.length}</span>
                          </div>

                          <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

                          {/* Save for Later */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSaved(prev => !prev)}
                            className="h-auto rounded-full px-2 py-0.5 font-sans text-xs transition-all duration-150"
                            style={{
                              backgroundColor: saved ? 'oklch(0.93 0.025 60)' : 'transparent',
                              color: saved ? 'var(--accent-warm)' : 'var(--muted-foreground)',
                            }}
                            aria-pressed={saved}
                            aria-label={saved ? 'Remove from saved' : 'Save for later'}
                          >
                            <Bookmark
                              className="size-3.5"
                              style={{ fill: saved ? 'var(--accent-warm)' : 'none' }}
                            />
                            {saved ? 'Saved' : 'Save'}
                          </Button>
                        </>
                      )}
                    </div>
                  </header>

                  {/* ── Cover placeholder ─────────────────────────── */}
                  <div
                    className="mb-10 flex h-44 items-center justify-center rounded-[var(--radius)] sm:h-56"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))',
                    }}
                  >
                    <BookOpen className="size-9" style={{ color: 'var(--accent-warm)', opacity: 0.4 }} />
                  </div>

                  {/* ── Decorative rule ───────────────────────────── */}
                  <div className="mb-10 h-px w-full" style={{ backgroundColor: 'var(--border)' }} />

                  {/* ── Story body ────────────────────────────────── */}
                  {renderStoryContent(story.content)}

                  {/* ── Comments ──────────────────────────────────── */}
                  <PublicComments comments={comments} />

                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
