import * as React from 'react'

import { Footer } from './footer'
import { Header } from './header'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='story-texture relative flex min-h-screen flex-col overflow-x-clip bg-[hsl(var(--background))] text-[hsl(var(--foreground))]'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
