import { motion } from 'framer-motion'

import { cn } from '../../lib/utils'
import type { RevealProps } from '../../types/content'

const easeOut = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  )
}
