import type { ReactNode } from 'react'
import { useRef } from 'react'
import { cn } from '#/lib/utils'
import { motion, useInView } from 'framer-motion'

interface PageHeroProps {
  badge?: string
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function PageHero({
  badge,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      ref={ref}
      className={cn('relative overflow-hidden py-20 md:py-28 lg:py-32', className)}
    >
      {/* Left accent rule */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 h-full w-[3px] origin-top"
        style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.15 }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Badge / eyebrow */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-3"
          >
            <span
              className="h-px w-10 shrink-0"
              style={{ backgroundColor: 'var(--accent-warm)' }}
            />
            <span
              className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
              style={{ color: 'var(--accent-warm)' }}
            >
              {badge}
            </span>
          </motion.div>
        )}

        {/* Title — clip reveal from below */}
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '105%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-serif font-bold leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                color: 'var(--foreground)',
              }}
            >
              {title}
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-8 max-w-xl font-sans text-base leading-[1.8] md:text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {description}
          </motion.p>

          {/* Optional children (CTAs etc.) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              {children}
            </motion.div>
          )}
        </div>

        {/* Bottom ornamental rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex origin-left items-center gap-4"
        >
          <div
            className="h-px flex-1"
            style={{ backgroundColor: 'var(--border)' }}
          />
          <span
            aria-hidden
            className="font-serif text-sm"
            style={{ color: 'var(--accent-warm)', opacity: 0.5 }}
          >
            ✦
          </span>
          <div
            className="h-px w-12 shrink-0"
            style={{ backgroundColor: 'var(--border)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
