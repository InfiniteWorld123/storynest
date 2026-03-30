import { motion } from 'framer-motion'

interface AuthAsideProps {
  title: string
  description: string
}

const GRAIN_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"

export function AuthAside({ title, description }: AuthAsideProps) {
  // Use the first letter of the title as the giant ghost letterform
  const ghostLetter = title.trim().charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
      style={{ backgroundColor: 'oklch(0.16 0 0)', padding: '3rem' }}
    >
      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: `url("${GRAIN_SRC}")` }}
      />

      {/* Giant ghost letterform */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        className="pointer-events-none absolute -right-[8%] top-1/2 -translate-y-[52%] select-none font-serif font-bold"
        style={{
          fontSize: 'clamp(20rem, 30vw, 40rem)',
          color: 'transparent',
          WebkitTextStroke: '1.5px oklch(0.3 0 0)',
          lineHeight: 0.85,
        }}
      >
        {ghostLetter}
      </motion.span>

      {/* Top ornament */}
      <div className="relative z-10 flex items-center gap-3">
        <span
          className="h-px w-10 shrink-0"
          style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.6 }}
        />
        <span
          className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
          style={{ color: 'var(--accent-warm)', opacity: 0.7 }}
        >
          StoryNest
        </span>
      </div>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative z-10 flex flex-1 flex-col justify-center"
        style={{ maxWidth: '26rem' }}
      >
        {/* Title */}
        <h2
          className="font-serif font-bold tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
            color: 'oklch(0.92 0 0)',
            lineHeight: 1.05,
            marginBottom: '1.25rem',
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="font-sans text-sm leading-[1.8]"
          style={{ color: 'oklch(0.48 0 0)' }}
        >
          {description}
        </p>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px w-16 origin-left"
          style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.5 }}
        />
      </motion.div>

      {/* Bottom ornament */}
      <div className="relative z-10">
        <span
          aria-hidden
          className="font-serif text-2xl"
          style={{ color: 'var(--accent-warm)', opacity: 0.35 }}
        >
          ✦
        </span>
      </div>
    </motion.div>
  )
}
