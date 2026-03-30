import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, BookOpen, Calendar, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  getStoryById,
  getCommentsByStoryId,
  MOCK_ENGAGEMENT,
  formatDate,
} from '../data/stories-mock'
import { PublicComments } from './public-comments'
import { renderStoryContent } from '../shared/render-story-content'

// ─── Story not found ──────────────────────────────────────────────────────────
function StoryNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6">
      <div
        className="flex size-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <BookOpen className="size-7" style={{ color: 'var(--muted-foreground)' }} />
      </div>
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Story not found
        </h2>
        <p className="mt-2 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
          This story may have been moved or removed.
        </p>
      </div>
      <Link
        to="/stories"
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold"
        style={{ color: 'var(--accent-warm)' }}
      >
        <ArrowLeft className="size-3.5" />
        Back to all stories
      </Link>
    </div>
  )
}

// ─── Public story detail page ─────────────────────────────────────────────────
export function PublicStoryDetailPage({ storyId }: { storyId: string }) {
  const story = getStoryById(storyId)
  const comments = getCommentsByStoryId(storyId)
  const eng = MOCK_ENGAGEMENT[storyId]

  // ── Interactive state (wire to toggleReaction / saveReadLater when ready) ──
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null)
  const [saved, setSaved] = useState(false)

  function toggleReaction(r: 'like' | 'dislike') {
    setReaction(prev => (prev === r ? null : r))
    // TODO: wire to toggleReaction({ storyId, reaction: r })
  }

  function toggleSaved() {
    setSaved(prev => !prev)
    // TODO: wire to saveReadLater({ storyId }) or removeReadLater({ storyId })
  }

  if (!story) return <StoryNotFound />

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <Link
          to="/stories"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
          All stories
        </Link>
      </motion.div>

      {/* Story hero */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        {/* Category */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6" style={{ backgroundColor: 'var(--accent-warm)' }} />
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
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.08, color: 'var(--foreground)' }}
        >
          {story.title}
        </h1>

        {/* Description */}
        <p
          className="mt-4 font-serif text-lg italic leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {story.description}
        </p>

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {/* Date */}
          <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ color: 'var(--muted-foreground)' }}>
            <Calendar className="size-3.5" />
            <span className="font-mono text-xs tabular-nums">{formatDate(story.createdAt)}</span>
          </div>

          {eng && (
            <>
              {/* Separator */}
              <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

              {/* Like button */}
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
                aria-label={reaction === 'like' ? 'Unlike story' : 'Like story'}
                aria-pressed={reaction === 'like'}
              >
                <ThumbsUp
                  className="size-3.5 transition-colors duration-150"
                  style={{ fill: reaction === 'like' ? 'var(--accent-warm)' : 'none' }}
                />
                <span className="font-mono text-xs tabular-nums">
                  {eng.likes + (reaction === 'like' ? 1 : 0)}
                </span>
              </Button>

              {/* Dislike button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleReaction('dislike')}
                className="h-auto rounded-full px-2 py-0.5 transition-all duration-150"
                style={{
                  color: reaction === 'dislike' ? 'var(--destructive)' : 'var(--muted-foreground)',
                }}
                aria-label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike story'}
                aria-pressed={reaction === 'dislike'}
              >
                <ThumbsDown className="size-3.5" />
                <span className="font-mono text-xs tabular-nums">
                  {eng.dislikes + (reaction === 'dislike' ? 1 : 0)}
                </span>
              </Button>

              {/* Separator */}
              <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

              {/* Comments */}
              <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ color: 'var(--muted-foreground)' }}>
                <MessageCircle className="size-3.5" />
                <span className="font-mono text-xs tabular-nums">{comments.length}</span>
              </div>

              {/* Separator */}
              <span className="h-3.5 w-px" style={{ backgroundColor: 'var(--border)' }} />

              {/* Save for Later */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleSaved}
                className="h-auto rounded-full px-2 py-0.5 font-sans text-xs transition-all duration-150"
                style={{
                  backgroundColor: saved ? 'oklch(0.93 0.025 60)' : 'transparent',
                  color: saved ? 'var(--accent-warm)' : 'var(--muted-foreground)',
                }}
                aria-label={saved ? 'Remove from saved' : 'Save for later'}
                aria-pressed={saved}
              >
                <Bookmark
                  className="size-3.5 transition-colors duration-150"
                  style={{ fill: saved ? 'var(--accent-warm)' : 'none' }}
                />
                {saved ? 'Saved' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </motion.header>

      {/* Cover placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 flex h-52 items-center justify-center rounded-[var(--radius)] sm:h-72"
        style={{ background: 'linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))' }}
      >
        <BookOpen className="size-10" style={{ color: 'var(--accent-warm)', opacity: 0.4 }} />
      </motion.div>

      {/* Decorative rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 h-px origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Story body */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderStoryContent(story.content)}
      </motion.div>

      {/* Comments */}
      <PublicComments comments={comments} />
    </div>
  )
}
