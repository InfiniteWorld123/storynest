import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { BookMarked } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '#/components/theme/theme-toggle'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Minimal top bar */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-14 shrink-0 items-center justify-between px-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <BookMarked className="h-5 w-5" style={{ color: 'var(--accent-warm)' }} />
          </motion.div>
          <span
            className="font-serif text-lg font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            StoryNest
          </span>
        </Link>

        <ThemeToggle />
      </motion.div>

      {/* Two-column content */}
      <div className="grid flex-1 lg:grid-cols-2">
        {children}
      </div>
    </div>
  )
}
