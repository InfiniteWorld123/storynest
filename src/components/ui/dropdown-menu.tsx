import * as React from 'react'

import { cn } from '../../lib/utils'

type DropdownMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used inside <DropdownMenu>.')
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

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className='relative inline-flex'>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}) {
  const { open, setOpen } = useDropdownMenuContext()

  if (asChild && React.isValidElement(children)) {
    const element = children as React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string }>
    return React.cloneElement(element, {
      onClick: composeHandlers(element.props.onClick, () => setOpen(!open)),
      className: cn(element.props.className, className),
    })
  }

  return (
    <button
      type='button'
      aria-haspopup='menu'
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className,
  align = 'center',
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'center' | 'end'
}) {
  const { open } = useDropdownMenuContext()

  if (!open) {
    return null
  }

  const alignmentStyles: Record<'start' | 'center' | 'end', string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      role='menu'
      className={cn(
        'absolute top-[calc(100%+0.5rem)] z-50 min-w-40 rounded-md border border-[color:var(--border)] bg-[color:var(--card)] p-1 shadow-lg',
        alignmentStyles[align],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('my-1 h-px bg-[color:var(--border)]', className)} {...props} />
}

export function DropdownMenuItem({
  children,
  className,
  onSelect,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onSelect?: () => void
}) {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      type='button'
      role='menuitem'
      onClick={composeHandlers(props.onClick, () => {
        onSelect?.()
        setOpen(false)
      })}
      className={cn(
        'flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-left text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
