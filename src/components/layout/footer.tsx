import { Link } from '@tanstack/react-router'
import { BookOpen, Compass, Feather, Mail } from 'lucide-react'

import { Container } from './container'

const columns = {
  Product: [
    { label: 'Explore Stories', to: '/explore' },
    { label: 'Membership', to: '/sign-up' },
    { label: 'Reading Lists', to: '/explore' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Archive Notes', to: '/about' },
  ],
  Resources: [
    { label: 'Sign In', to: '/sign-in' },
    { label: 'Forgot Password', to: '/forgot-password' },
    { label: 'Verify Email', to: '/verify-email' },
  ],
}

const socials = [
  { label: 'Journal', icon: Feather },
  { label: 'Mail', icon: Mail },
  { label: 'Compass', icon: Compass },
  { label: 'Library', icon: BookOpen },
]

export function Footer() {
  return (
    <footer className='border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/70'>
      <Container className='space-y-10 py-12'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-3'>
            <h3 className='font-story-serif text-xl'>StoryNest</h3>
            <p className='text-sm text-[hsl(var(--muted-foreground))]'>
              A home for folktales, old journals, and new chapters crafted like a book.
            </p>
          </div>

          {Object.entries(columns).map(([title, links]) => (
            <div key={title} className='space-y-3'>
              <h4 className='text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]'>{title}</h4>
              <ul className='space-y-2'>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className='link-underline text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='flex flex-col items-start justify-between gap-4 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center'>
          <p>crafted like a book</p>
          <div className='flex items-center gap-2'>
            {socials.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href='#'
                  className='rounded-md border border-[hsl(var(--border))] p-2 transition-colors hover:bg-[hsl(var(--accent))]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
                  aria-label={social.label}
                >
                  <Icon className='h-4 w-4' />
                </a>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}
