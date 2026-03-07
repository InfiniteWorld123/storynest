import { Quote } from 'lucide-react'

import { cn } from '../../lib/utils'
import type { TestimonialCardProps } from '../../types/content'
import { Card, CardContent } from '../ui/card'

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card className={cn('h-full border-[hsl(var(--border))] bg-[hsl(var(--card))]/90', className)}>
      <CardContent className='space-y-4 p-6'>
        <Quote className='h-5 w-5 text-[hsl(var(--primary))]/80' />
        <p className='text-sm leading-relaxed text-[hsl(var(--foreground))]'>{testimonial.quote}</p>
        <div className='space-y-0.5'>
          <p className='font-medium'>{testimonial.name}</p>
          <p className='text-xs text-[hsl(var(--muted-foreground))]'>{testimonial.role}</p>
        </div>
      </CardContent>
    </Card>
  )
}
