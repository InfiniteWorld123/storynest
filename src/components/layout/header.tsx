import { Link, useLocation } from '@tanstack/react-router'
import { BookOpenText, Menu } from 'lucide-react'

import { cn } from '../../lib/utils'
import { ThemeToggle } from '../theme/theme-toggle'
import { Button, buttonVariants } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Container } from './container'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function isPathActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === '/') {
    return currentPath === '/'
  }

  return currentPath.startsWith(targetPath)
}

export function Header() {
  const location = useLocation()

  return (
    <header className='sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 backdrop-blur'>
      <Container className='flex h-16 items-center justify-between gap-4'>
        <Link to='/' className='inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'>
          <span className='rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 p-1.5'>
            <BookOpenText className='h-4 w-4 text-[hsl(var(--primary))]' />
          </span>
          <span className='font-story-serif text-lg font-semibold tracking-wide'>StoryNest</span>
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'link-underline text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                isPathActive(location.pathname, item.to) && 'text-[hsl(var(--foreground))]',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-2 md:flex'>
          <ThemeToggle />
          <Link to='/sign-up' className={buttonVariants({ size: 'sm' })}>
            Join the Archive
          </Link>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' aria-label='Open navigation'>
                <Menu className='h-4 w-4' />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
              </SheetHeader>
              <nav className='mt-8 flex flex-col gap-2'>
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--accent))]/40',
                      isPathActive(location.pathname, item.to) && 'bg-[hsl(var(--accent))]/45 text-[hsl(var(--foreground))]',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to='/sign-up' className={cn(buttonVariants({ className: 'mt-4 w-full' }))}>
                  Start Reading
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
