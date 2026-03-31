import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { StoryListItem } from '#/types/story'
import { formatStoryDate } from '#/types/story'
import { StoryCoverPlaceholder } from './story-cover-placeholder'

type StoryGridCardProps = {
  story: StoryListItem
  index: number
  primaryAction?: ReactNode
}

export function StoryGridCard({ story, index, primaryAction }: StoryGridCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden"
      style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--card)' }}
    >
      <span
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ backgroundColor: 'var(--accent-warm)' }}
      />

      <StoryCoverPlaceholder tall coverImageUrl={story.coverImageUrl} title={story.title} />

      <div className="p-4">
        <span
          className="mb-2.5 inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
        >
          {story.category.name}
        </span>

        <p
          className="font-serif text-base font-semibold leading-snug tracking-tight transition-colors duration-150 group-hover:text-[var(--accent-warm)]"
          style={{ color: 'var(--foreground)' }}
        >
          {story.title}
        </p>

        <p
          className="mt-1.5 line-clamp-3 font-sans text-[13px] leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {story.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {formatStoryDate(story.createdAt)}
          </span>
          {primaryAction}
        </div>
      </div>
    </motion.div>
  )
}
