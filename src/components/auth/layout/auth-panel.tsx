import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function AuthPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-col justify-center px-8 py-12 lg:px-14"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  )
}
