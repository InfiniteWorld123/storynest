import type { UserOverviewStats } from '#/server/story'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type OverviewStat = {
  label: string
  value: UserOverviewStats['totals'][keyof UserOverviewStats['totals']]
}

export function StatsGrid({ stats }: { stats: OverviewStat[] }) {
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={statsRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="mb-12 grid grid-cols-3 gap-0"
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col px-5 py-6"
          style={{
            backgroundColor: 'var(--card)',
            borderRight: i % 3 !== 2 ? '1px solid var(--border)' : undefined,
            borderBottom: i < 3 ? '1px solid var(--border)' : undefined,
          }}
        >
          <span
            className="absolute left-0 top-0 h-full w-[3px]"
            style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.7 }}
          />

          <span
            className="font-serif font-bold leading-none tabular-nums"
            style={{ color: 'var(--accent-warm)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {stat.value}
          </span>
          <span
            className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.26em]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
