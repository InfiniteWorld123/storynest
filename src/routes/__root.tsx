import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import '../styles.css'
import '../styles/storybook-theme.css'

import { ThemeProvider } from '../components/theme/theme-provider'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'StoryNest | Old-World Story Archive',
      },
      {
        name: 'description',
        content: 'A folktale-inspired reading and storytelling interface crafted like a library journal.',
      },
    ],
  }),
  notFoundComponent: () => (
    <p className='px-4 py-10 text-center text-sm text-[hsl(var(--muted-foreground))]'>
      The page you are looking for could not be found.
    </p>
  ),
  errorComponent: () => (
    <p className='px-4 py-10 text-center text-sm text-[hsl(var(--muted-foreground))]'>
      Something went wrong while loading this page.
    </p>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider defaultTheme='system'>
        <Outlet />
      </ThemeProvider>
    </RootDocument>
  )
}

const queryClient = new QueryClient();

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
