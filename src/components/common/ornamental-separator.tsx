import { Feather } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Separator } from '../ui/separator'

export function OrnamentalSeparator({ className }: { className?: string }) {
  return (
    <div className={cn('ornamental-divider', className)}>
      <Separator className='flex-1' />
      <Feather className='h-4 w-4 text-[hsl(var(--muted-foreground))]' />
      <Separator className='flex-1' />
    </div>
  )
}
