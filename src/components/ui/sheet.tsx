import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '../../lib/utils'

type SheetContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

function useSheetContext() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used inside <Sheet>.')
  }
  return context
}

function composeHandlers<T extends React.SyntheticEvent>(
  theirHandler?: (event: T) => void,
  ourHandler?: (event: T) => void,
) {
  return (event: T) => {
    theirHandler?.(event)
    if (!event.defaultPrevented) {
      ourHandler?.(event)
    }
  }
}

export function Sheet({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const activeOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  return <SheetContext.Provider value={{ open: activeOpen, setOpen }}>{children}</SheetContext.Provider>
}

export function SheetTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}) {
  const { open, setOpen } = useSheetContext()

  if (asChild && React.isValidElement(children)) {
    const element = children as React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string }>
    return React.cloneElement(element, {
      onClick: composeHandlers(element.props.onClick, () => setOpen(!open)),
      className: cn(element.props.className, className),
    })
  }

  return (
    <button type='button' className={className} onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

export function SheetContent({
  children,
  className,
  side = 'right',
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: 'left' | 'right'
}) {
  const { open, setOpen } = useSheetContext()

  if (!open || typeof document === 'undefined') {
    return null
  }

  const sideStyles: Record<'left' | 'right', string> = {
    left: 'left-0',
    right: 'right-0',
  }

  return createPortal(
    <div className='fixed inset-0 z-50'>
      <button
        type='button'
        aria-label='Close panel'
        className='absolute inset-0 bg-black/45 backdrop-blur-[1px]'
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'absolute top-0 h-full w-[85vw] max-w-sm border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl transition-transform',
          side === 'left' ? 'border-r' : 'border-l',
          sideStyles[side],
          className,
        )}
      >
        <button
          type='button'
          aria-label='Close panel'
          className='absolute right-4 top-4 rounded-md p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))]/40 hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
          onClick={() => setOpen(false)}
        >
          <X className='h-4 w-4' />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-6 space-y-2', className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-story-serif text-xl font-semibold', className)} {...props} />
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[hsl(var(--muted-foreground))]', className)} {...props} />
}
