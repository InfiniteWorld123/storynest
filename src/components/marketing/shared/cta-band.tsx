import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { motion, useInView } from 'framer-motion'

interface CtaBandProps {
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}

export function CtaBand({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: CtaBandProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className={cn('relative overflow-hidden py-20 md:py-28', className)}
      style={{
        backgroundColor: 'var(--muted)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-serif font-bold tracking-tight"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                color: 'var(--foreground)',
                lineHeight: 1.1,
              }}
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-4 font-sans text-base leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to={primaryHref}
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] px-7 font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0"
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
            >
              {primaryLabel}
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                to={secondaryHref}
                className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] border px-7 font-sans text-sm font-medium transition-all hover:opacity-80"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {secondaryLabel}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
