import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const principles = [
  {
    numeral: 'I',
    title: 'Quality Over Quantity',
    description: "We'd rather host one great story than a hundred forgettable ones.",
  },
  {
    numeral: 'II',
    title: 'Writer-First Design',
    description: 'The writing experience is sacred. Every tool serves the craft.',
  },
  {
    numeral: 'III',
    title: 'Intentional Community',
    description: 'Slow growth, genuine connections, meaningful conversation.',
  },
  {
    numeral: 'IV',
    title: 'Beautiful by Default',
    description: "Great typography and design aren't luxuries — they're the baseline.",
  },
]

export function PrinciplesStrip() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-20 md:py-28"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="mb-14 flex items-center gap-3">
          <span
            className="h-px w-10 shrink-0"
            style={{ backgroundColor: 'var(--accent-warm)' }}
          />
          <span
            className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Principles
          </span>
        </div>

        {/* Roman numeral grid */}
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ numeral, title, description }, i) => (
            <motion.div
              key={numeral}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative py-8 pl-6 pr-4 transition-colors duration-200"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              {/* Hover: accent left edge */}
              <span
                aria-hidden
                className="absolute left-0 top-6 bottom-6 w-[2px] rounded-r-full opacity-0 transition-all duration-300 group-hover:top-0 group-hover:bottom-0 group-hover:opacity-100"
                style={{ backgroundColor: 'var(--accent-warm)' }}
              />

              {/* Roman numeral */}
              <span
                className="mb-5 block font-serif text-[3.5rem] font-bold leading-none transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)]"
                style={{ color: 'oklch(0.82 0 0)', lineHeight: 1 }}
              >
                {numeral}
              </span>

              <h3
                className="mb-2 font-serif text-base font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {title}
              </h3>
              <p
                className="font-sans text-[13px] leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
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
