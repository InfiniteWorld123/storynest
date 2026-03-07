import { motion } from 'framer-motion'

import type { FeatureCardProps } from '../../types/content'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const MotionCard = motion(Card)

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <MotionCard
      className={cn('h-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/90', className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <CardHeader className='space-y-4'>
        <div className='w-fit rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/35 p-2'>
          <Icon className='h-5 w-5 text-[hsl(var(--primary))]' />
        </div>
        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'>{feature.description}</p>
      </CardContent>
    </MotionCard>
  )
}
