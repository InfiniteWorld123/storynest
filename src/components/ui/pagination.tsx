import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '../../lib/utils'
import { buttonVariants } from './button'

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  ),
)
PaginationContent.displayName = 'PaginationContent'

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props} />
  ),
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = React.ComponentProps<'button'> & {
  isActive?: boolean
}

export const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      type='button'
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size: 'icon',
        }),
        className,
      )}
      {...props}
    />
  ),
)
PaginationLink.displayName = 'PaginationLink'

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label='Go to previous page'
    className={cn('gap-1 px-2.5', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
    <span className='sr-only'>Previous</span>
    {children}
  </PaginationLink>
))
PaginationPrevious.displayName = 'PaginationPrevious'

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label='Go to next page'
    className={cn('gap-1 px-2.5', className)}
    {...props}
  >
    {children}
    <span className='sr-only'>Next</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
))
PaginationNext.displayName = 'PaginationNext'

export function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className='h-4 w-4' />
      <span className='sr-only'>More pages</span>
    </span>
  )
}
