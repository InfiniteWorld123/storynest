import { useRef } from 'react'
import { BookMarked, PenTool, Users, Eye } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    number: '01',
    Icon: BookMarked,
    title: 'Curated Collections',
    description:
      'Discover stories organized with intention and care, not algorithms. Every collection is thoughtfully assembled.',
  },
  {
    number: '02',
    Icon: PenTool,
    title: 'Thoughtful Writing',
    description:
      'A distraction-free environment designed for deep storytelling. Focus on your craft without the clutter.',
  },
  {
    number: '03',
    Icon: Users,
    title: 'Reader Community',
    description:
      'Connect with readers who genuinely care about narrative craft and meaningful discourse.',
  },
  {
    number: '04',
    Icon: Eye,
    title: 'Beautiful Typography',
    description:
      'Stories presented with the typographic care and attention they deserve. Every word, beautifully set.',
  },
]

export function FeatureGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="py-24 md:py-32"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header — editorial asymmetric layout */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-px w-10 shrink-0"
                style={{ backgroundColor: 'var(--accent-warm)' }}
              />
              <span
                className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
                style={{ color: 'var(--accent-warm)' }}
              >
                Why StoryNest
              </span>
            </div>
            <h2
              className="font-serif font-bold tracking-tight leading-[0.95]"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                color: 'var(--foreground)',
              }}
            >
              Crafted for
              <br />
              <em>storytellers</em>
            </h2>
          </div>
          <p
            className="hidden max-w-xs text-right font-sans text-sm leading-relaxed lg:block"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Everything you need to write, share, and discover stories in a
            space that respects both writers and readers.
          </p>
        </div>

        {/* Editorial numbered list */}
        <div ref={ref}>
          {features.map(({ number, Icon, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex items-start gap-6 border-t py-9 md:gap-10 transition-colors duration-200"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* Number */}
              <span
                className="w-10 shrink-0 font-serif text-[2.5rem] font-bold leading-none transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)]"
                style={{ color: 'oklch(0.82 0 0)', lineHeight: 1 }}
              >
                {number}
              </span>

              {/* Icon */}
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] transition-colors duration-300 group-hover:bg-[oklch(0.93_0.025_60)]"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <Icon
                  className="h-4 w-4 transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)]"
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>

              {/* Copy */}
              <div className="flex-1">
                <h3
                  className="font-serif text-xl font-semibold transition-colors duration-300 group-hover:text-[oklch(0.58_0.09_55)] md:text-2xl"
                  style={{ color: 'var(--foreground)' }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 max-w-lg font-sans text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {description}
                </p>
              </div>

              {/* Hover arrow */}
              <span
                className="mt-1.5 hidden shrink-0 font-serif text-xl italic opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
                style={{ color: 'var(--accent-warm)' }}
                aria-hidden
              >
                →
              </span>
            </motion.div>
          ))}
          <div className="border-t" style={{ borderColor: 'var(--border)' }} />
        </div>
      </div>
    </section>
  )
}
