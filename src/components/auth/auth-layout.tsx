import { Link } from '@tanstack/react-router'
import { ArrowLeft, Feather } from 'lucide-react'

import type { AuthLayoutProps } from '../../types/content'
import { FloatingOrnaments } from '../motion/floating-ornaments'

export function AuthLayout({
  title,
  description,
  quote = 'Some stories are found. Others are written by those who arrive at the right page.',
  quoteAuthor = 'House Archivist',
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[hsl(var(--background))]'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <aside className='relative hidden overflow-hidden border-r border-[hsl(var(--border))] bg-[hsl(var(--accent))]/30 p-10 lg:flex lg:flex-col lg:justify-between'>
          <FloatingOrnaments />
          <div className='relative z-10'>
            <Link
              to='/'
              className='inline-flex items-center gap-2 rounded-md text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
            >
              <ArrowLeft className='h-4 w-4' /> Return to archive
            </Link>
          </div>
          <div className='relative z-10 max-w-md space-y-6'>
            <p className='chapter-label'>Reading Room Access</p>
            <blockquote className='font-story-serif text-3xl leading-tight'>{quote}</blockquote>
            <p className='inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]'>
              <Feather className='h-4 w-4' /> {quoteAuthor}
            </p>
          </div>
        </aside>

        <main className='flex items-center justify-center p-6 sm:p-10'>
          <div className='w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 p-7 shadow-[0_24px_60px_rgba(53,33,22,0.14)] sm:p-8'>
            <div className='mb-6 space-y-2'>
              <p className='chapter-label'>Account Chapter</p>
              <h1 className='font-story-serif text-3xl leading-tight'>{title}</h1>
              <p className='text-sm text-[hsl(var(--muted-foreground))]'>{description}</p>
            </div>

            {children}

            {footer ? <div className='mt-6 text-sm text-[hsl(var(--muted-foreground))]'>{footer}</div> : null}
          </div>
        </main>
      </div>
    </div>
  )
}
