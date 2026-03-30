import { motion } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { type StoryComment, formatDate } from '../data/stories-mock'

// ─── Comment card ─────────────────────────────────────────────────────────────
function CommentCard({ comment, index }: { comment: StoryComment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 py-5"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Avatar */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold"
        style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
      >
        {comment.authorName.charAt(0)}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-sans text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            {comment.authorName}
          </span>
          <span className="font-mono text-[11px] tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {comment.content}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Add comment form (visual only — no persistence) ─────────────────────────
function AddCommentForm() {
  return (
    <form className="mt-8 flex flex-col gap-4">
      <div
        className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
        style={{ color: 'var(--accent-warm)' }}
      >
        Leave a comment
      </div>

      <p className="font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
        Commenting as your signed-in profile name.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment-body" className="font-sans text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          Your thoughts
        </label>
        <Textarea
          id="comment-body"
          placeholder="What did this story make you feel?"
          rows={4}
          className="resize-none px-3 py-2 font-sans text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          disabled
          className="h-9 gap-2 px-4 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)', opacity: 0.6, cursor: 'not-allowed' }}
        >
          <Send className="size-3.5" />
          Post comment
        </Button>

        <span className="font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
          UI only — comments wiring in next phase.
        </span>
      </div>
    </form>
  )
}

// ─── Public comments section ──────────────────────────────────────────────────
export function PublicComments({ comments }: { comments: StoryComment[] }) {
  return (
    <section className="mt-16">
      {/* Section eyebrow */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
        <div className="flex items-center gap-2" style={{ color: 'var(--accent-warm)' }}>
          <MessageCircle className="size-3" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
        <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
      </div>

      <AddCommentForm />

      {comments.length === 0 ? (
        <p className="py-8 text-center font-serif text-base italic" style={{ color: 'var(--muted-foreground)' }}>
          No comments yet. Be the first to respond.
        </p>
      ) : (
        <div>
          {comments.map((c, i) => (
            <CommentCard key={c.id} comment={c} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
