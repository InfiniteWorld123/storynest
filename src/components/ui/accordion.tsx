import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../../lib/utils'

const AccordionItemContext = React.createContext(false)

export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-3', className)} {...props} />
}

export function AccordionItem({ className, ...props }: React.ComponentProps<'details'>) {
  return (
    <details className={cn('group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80', className)} {...props}>
      <AccordionItemContext.Provider value>{props.children}</AccordionItemContext.Provider>
    </details>
  )
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<'summary'>) {
  const isWithinItem = React.useContext(AccordionItemContext)

  if (!isWithinItem) {
    return null
  }

  return (
    <summary
      className={cn(
        'flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-left font-medium transition-colors marker:content-none hover:text-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className='h-4 w-4 transition-transform group-open:rotate-180' />
    </summary>
  )
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 pb-4 text-sm text-[hsl(var(--muted-foreground))]', className)} {...props} />
}
