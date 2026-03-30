import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Each headline line reveals upward through a clip mask — like type being printed
const lineReveal = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: 0,
    transition: {
      delay: i * 0.13,
      duration: 0.75,
      ease: smoothEase,
    },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.52 + i * 0.1,
      duration: 0.65,
      ease: smoothEase,
    },
  }),
}

const STATS = [
  { value: '1,200+', label: 'Stories' },
  { value: '340+', label: 'Writers' },
  { value: '89', label: 'Genres' },
]

// Paper grain SVG encoded as a data URI
const GRAIN_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Paper grain texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: `url("${GRAIN_SRC}")` }}
      />

      {/* Giant ghost "S" — decorative, bleeds off right edge */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="pointer-events-none absolute right-[-6vw] top-1/2 -translate-y-[52%] select-none font-serif font-bold leading-none"
        style={{
          fontSize: 'clamp(30rem, 48vw, 72rem)',
          color: 'transparent',
          WebkitTextStroke: '1.5px oklch(0.78 0 0 / 0.07)',
          lineHeight: 0.85,
        }}
      >
        S
      </motion.span>

      {/* Decorative vertical rule on the far left */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.9, ease: smoothEase, delay: 0.1 }}
        className="absolute left-0 top-0 h-full w-[3px] origin-top"
        style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.18 }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        {/* Eyebrow — amber accent */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-10 flex items-center gap-3"
        >
          <span
            className="h-px w-12 shrink-0"
            style={{ backgroundColor: 'var(--accent-warm)' }}
          />
          <span
            className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            A home for meaningful stories
          </span>
        </motion.div>

        {/* Main headline — 3 lines, each clips from below */}
        <h1 className="font-serif font-bold leading-[0.92] tracking-tight">
          {(
            [
              'Where',
              'Stories',
              <>
                Find <em>Their Home</em>
              </>,
            ] as React.ReactNode[]
          ).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block"
                style={{
                  fontSize: 'clamp(4rem, 9.5vw, 11rem)',
                  color: 'var(--foreground)',
                }}
                custom={i}
                variants={lineReveal}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h1>

        {/* Description */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 max-w-md font-sans text-[15px] leading-[1.75]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          No algorithms, no noise. Just beautiful stories, beautifully told —
          in a space built with intention and care.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/sign-up"
            className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius)] px-7 font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
          >
            Start Writing <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius)] border px-7 font-sans text-sm font-medium transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Learn More
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-16 flex flex-wrap items-center gap-8"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span
                className="font-serif text-2xl font-bold"
                style={{ color: 'var(--accent-warm)' }}
              >
                {value}
              </span>
              <span
                className="font-sans text-[11px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {label}
              </span>
            </div>
          ))}
          <span
            aria-hidden
            className="hidden h-px flex-1 sm:block"
            style={{ backgroundColor: 'var(--border)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
