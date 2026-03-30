import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { BookMarked, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '#/lib/utils'
import { ThemeToggle } from '#/components/theme/theme-toggle'

const navLinks = [
  { label: 'Stories', to: '/stories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-shadow duration-300',
        scrolled && 'shadow-sm',
      )}
      style={{
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Top amber accent line */}
      <div className="h-[2px] w-full" style={{ backgroundColor: 'var(--accent-warm)' }} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <BookMarked className="h-5 w-5" style={{ color: 'var(--accent-warm)' }} />
          </motion.div>
          <span
            className="font-serif text-xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            StoryNest
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group relative font-sans text-sm font-medium transition-colors hover:text-foreground"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: 'var(--accent-warm)' }}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <div className="w-px h-4 mx-1" style={{ backgroundColor: 'var(--border)' }} />
          <Link
            to="/sign-in"
            className="font-sans text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
          >
            Start Writing
          </Link>
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center rounded-[var(--radius)] p-2 md:hidden"
          style={{ color: 'var(--foreground)' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? 'x' : 'menu'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
            style={{
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            <nav className="flex flex-col gap-1 px-6 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex h-10 items-center font-sans text-sm font-medium transition-colors hover:text-foreground"
                  style={{ color: 'var(--muted-foreground)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-3 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <div className="flex items-center justify-between py-1">
                <span className="font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>Theme</span>
                <ThemeToggle />
              </div>
              <div className="my-2 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <div className="flex gap-3">
                <Link
                  to="/sign-in"
                  className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius)] border font-sans text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius)] font-sans text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Start Writing
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
