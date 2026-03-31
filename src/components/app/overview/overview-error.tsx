import { AppContent } from '#/components/app/app-content'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

// ─── Overview Error Component ─────────────────────────────────────────────────
export function OverviewError({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <AppContent>

      {/* Ghost letterform — matches the real page */}
      <div
        className="pointer-events-none fixed -right-6 top-1/4 select-none font-serif leading-none"
        aria-hidden
        style={{
          fontSize: 'clamp(11rem, 26vw, 20rem)',
          color: 'currentColor',
          opacity: 0.025,
          WebkitTextStroke: '1px currentColor',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        !
      </div>

      <div className="relative z-10 flex min-h-[60vh] flex-col items-start justify-center">

        {/* Amber eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Something went wrong
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 font-serif font-bold tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: 'var(--foreground)',
            lineHeight: 1.1,
          }}
        >
          Couldn't load
          <br />
          your desk.
        </motion.h1>

        {/* Error message card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mb-8 w-full max-w-md"
        >
          <div
            className="flex items-start gap-3 rounded-[var(--radius)] px-4 py-3"
            style={{
              border: '1px solid oklch(0.7 0.08 25 / 0.4)',
              backgroundColor: 'oklch(0.97 0.015 25 / 0.5)',
            }}
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              style={{ color: 'oklch(0.55 0.12 25)' }}
            />
            <div className="min-w-0">
              <p
                className="font-sans text-sm font-semibold leading-snug"
                style={{ color: 'oklch(0.45 0.1 25)' }}
              >
                Failed to fetch overview data
              </p>
              {error?.message && (
                <p
                  className="mt-1 font-mono text-xs leading-relaxed opacity-80"
                  style={{ color: 'oklch(0.5 0.08 25)' }}
                >
                  {error.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap gap-3"
        >
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
              }}
            >
              <RefreshCw className="size-3.5" />
              Try again
            </button>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] px-5 font-sans text-sm font-semibold transition-colors duration-150"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Reload page
          </button>
        </motion.div>

      </div>
    </AppContent>
  )
}
