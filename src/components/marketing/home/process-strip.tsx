import { useRef } from 'react'
import { Search, PenTool, Share2 } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    Icon: Search,
    title: 'Discover',
    description:
      'Browse a curated library of stories across genres. Find narratives that resonate with you.',
  },
  {
    number: '02',
    Icon: PenTool,
    title: 'Create',
    description:
      'Write in a focused, elegant editor designed to bring out your best storytelling.',
  },
  {
    number: '03',
    Icon: Share2,
    title: 'Share',
    description:
      'Publish to a community of thoughtful readers who value quality over quantity.',
  },
]

const GRAIN_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E"

export function ProcessStrip() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: 'oklch(0.16 0 0)' }}
    >
      {/* Paper grain over dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: `url("${GRAIN_SRC}")` }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className="h-px w-10 shrink-0"
              style={{ backgroundColor: 'var(--accent-warm)' }}
            />
            <span
              className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
              style={{ color: 'var(--accent-warm)' }}
            >
              How It Works
            </span>
            <span
              className="h-px w-10 shrink-0"
              style={{ backgroundColor: 'var(--accent-warm)' }}
            />
          </div>
          <h2
            className="font-serif font-bold italic tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'oklch(0.92 0 0)',
            }}
          >
            Simple by design
          </h2>
        </motion.div>

        {/* Three columns */}
        <div className="grid gap-0 md:grid-cols-3">
          {steps.map(({ number, Icon, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.14,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative px-8 py-12"
              style={{
                borderLeft: i > 0 ? '1px solid oklch(0.28 0 0)' : 'none',
              }}
            >
              {/* Big ghost step number */}
              <span
                aria-hidden
                className="mb-6 block select-none font-serif font-bold leading-none"
                style={{
                  fontSize: '6.5rem',
                  color: 'oklch(0.24 0 0)',
                  lineHeight: 0.85,
                }}
              >
                {number}
              </span>

              {/* Icon */}
              <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-[var(--radius)]"
                style={{ backgroundColor: 'oklch(0.27 0.04 55 / 0.85)' }}
              >
                <Icon className="h-4 w-4" style={{ color: 'var(--accent-warm)' }} />
              </div>

              {/* Title */}
              <h3
                className="mb-3 font-serif text-2xl font-semibold"
                style={{ color: 'oklch(0.92 0 0)' }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: 'oklch(0.52 0 0)' }}
              >
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
