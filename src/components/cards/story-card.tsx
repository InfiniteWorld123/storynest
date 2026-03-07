import { Clock3, Feather } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '../../lib/utils'
import type { StoryCardProps } from '../../types/content'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const MotionCard = motion(Card)

export function StoryCard({ story, className }: StoryCardProps) {
  return (
    <MotionCard
      className={cn('h-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/85', className)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <CardHeader className='space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <Badge>{story.category}</Badge>
          <span className='text-xs text-[hsl(var(--muted-foreground))]'>{story.chapter}</span>
        </div>
        <CardTitle className='text-xl leading-snug'>{story.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='line-clamp-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>{story.excerpt}</p>
        <div className='flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]'>
          <span className='inline-flex items-center gap-1'>
            <Feather className='h-3.5 w-3.5' /> {story.author}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Clock3 className='h-3.5 w-3.5' /> {story.readTime}
          </span>
        </div>
      </CardContent>
    </MotionCard>
  )
}
