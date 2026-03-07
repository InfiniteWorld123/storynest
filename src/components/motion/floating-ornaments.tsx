import { motion } from 'framer-motion'

export function FloatingOrnaments() {
  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
      <motion.div
        className='absolute -left-10 top-10 h-36 w-36 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/35'
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className='absolute right-8 top-20 h-16 w-36 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80'
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className='absolute bottom-0 right-1/4 h-28 w-28 rounded-[35%] border border-[hsl(var(--border))] bg-[hsl(var(--primary))]/10'
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  )
}
