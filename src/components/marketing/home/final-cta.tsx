import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Decorative ghost ornament — top right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-8 select-none font-serif font-bold leading-none"
        style={{
          fontSize: 'clamp(14rem, 28vw, 36rem)',
          color: 'transparent',
          WebkitTextStroke: '1px oklch(0.87 0 0)',
          lineHeight: 0.85,
          opacity: 0.35,
        }}
      >
        ✦
      </span>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Animated accent rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 h-px w-24 origin-left"
          style={{ backgroundColor: 'var(--accent-warm)' }}
        />

        <div className="max-w-3xl">
          {/* Pull quote headline */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-serif font-bold leading-[0.95] tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                color: 'var(--foreground)',
              }}
            >
              "Every story
              <br />
              deserves
              <br />
              <em style={{ color: 'var(--accent-warm)' }}>a reader."</em>
            </p>
          </motion.blockquote>

          {/* Subtext + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.38, duration: 0.65 }}
            className="mt-10"
          >
            <p
              className="mb-8 max-w-md font-sans text-[15px] leading-[1.75]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Join a growing community where every word matters and every story
              finds its reader.
            </p>
            <Link
              to="/sign-up"
              className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius)] px-7 font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0"
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
            >
              Begin Your Story <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
