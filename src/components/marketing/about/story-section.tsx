import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function StorySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Vertical accent rule */}
          <div className="hidden lg:flex lg:col-span-1 items-start justify-center pt-6">
            <motion.div
              aria-hidden
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="origin-top h-full w-px"
              style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.35 }}
            />
          </div>

          {/* Main text */}
          <div className="lg:col-span-7">
            <div
              className="space-y-8 font-sans text-[15px] leading-[1.95]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {/* Drop cap paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.1 }}
              >
                <span
                  className="float-left mr-2 mt-1 font-serif font-bold leading-none"
                  style={{
                    fontSize: '4.5rem',
                    color: 'var(--accent-warm)',
                    lineHeight: 0.78,
                  }}
                >
                  S
                </span>
                toryNest was born from a simple observation: the places where
                we read and write stories online have become noisy, algorithmic,
                and optimized for everything except the story itself.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.2 }}
              >
                We wanted to build something different — a space that feels
                more like a quiet library than a social feed. A place where
                typography matters, where whitespace is generous, and where the
                act of reading is treated as something worth protecting.
              </motion.p>

              {/* Pull quote */}
              <motion.blockquote
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.35 }}
                className="my-10 py-3 pl-6"
                style={{ borderLeft: '3px solid var(--accent-warm)' }}
              >
                <p
                  className="font-serif text-xl italic leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                >
                  "Every decision in StoryNest is guided by a single question:
                  does this serve the story?"
                </p>
              </motion.blockquote>
            </div>
          </div>

          {/* Decorative right column */}
          <div className="hidden lg:flex lg:col-span-4 items-start justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="sticky top-28"
            >
              <span
                aria-hidden
                className="select-none font-serif font-bold leading-none"
                style={{
                  fontSize: '10rem',
                  color: 'transparent',
                  WebkitTextStroke: '1px oklch(0.84 0 0)',
                  lineHeight: 1,
                  opacity: 0.7,
                }}
              >
                ✦
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
