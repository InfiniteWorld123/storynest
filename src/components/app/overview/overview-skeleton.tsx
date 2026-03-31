import { AppContent } from '#/components/app/app-content'
import { Skeleton } from '#/components/ui/skeleton'

// ─── Stats Grid Skeleton (3×2) ────────────────────────────────────────────────
function StatsGridSkeleton() {
  return (
    <div
      className="mb-12 grid grid-cols-3 gap-0"
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col px-5 py-6"
          style={{
            backgroundColor: 'var(--card)',
            borderRight: i % 3 !== 2 ? '1px solid var(--border)' : undefined,
            borderBottom: i < 3 ? '1px solid var(--border)' : undefined,
          }}
        >
          {/* Amber left accent */}
          <span
            className="absolute left-0 top-0 h-full w-[3px]"
            style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.25 }}
          />
          {/* Big number */}
          <Skeleton className="mb-3 h-10 w-16" />
          {/* Label */}
          <Skeleton className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  )
}

// ─── Row Skeleton (for Best Performing + Recent Stories) ──────────────────────
function RowSkeleton({
  index,
  total,
  wide = false,
}: {
  index: number
  total: number
  wide?: boolean
}) {
  return (
    <div
      className="relative flex items-center gap-4 px-5 py-4"
      style={{
        borderBottom: index < total - 1 ? '1px solid var(--border)' : undefined,
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Left accent bar */}
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: 'var(--border)' }}
      />
      {/* Label pill */}
      <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
      {/* Title + optional description */}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className={`h-4 ${wide ? 'w-3/5' : 'w-2/5'}`} />
        {wide && <Skeleton className="h-3 w-4/5" />}
      </div>
      {/* Right count / date */}
      <Skeleton className="h-3 w-10 shrink-0" />
    </div>
  )
}

// ─── Section Header Skeleton ──────────────────────────────────────────────────
function SectionEyebrowSkeleton() {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
      <Skeleton className="h-3 w-32" />
      <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
    </div>
  )
}

// ─── Overview Skeleton (pending state) ───────────────────────────────────────
export function OverviewSkeleton() {
  return (
    <AppContent>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative mb-12 overflow-hidden">

        {/* Ghost letterform placeholder */}
        <div
          className="pointer-events-none absolute -right-6 -top-10 select-none font-serif leading-none"
          aria-hidden
          style={{
            fontSize: 'clamp(11rem, 26vw, 20rem)',
            color: 'currentColor',
            opacity: 0.025,
            WebkitTextStroke: '1px currentColor',
            lineHeight: 1,
          }}
        >
          S
        </div>

        {/* Eyebrow */}
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.4 }} />
          <Skeleton className="h-2.5 w-20" />
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.4 }} />
        </div>

        {/* Greeting headline */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-56" style={{ borderRadius: 'var(--radius)' }} />
          <Skeleton className="h-12 w-36" style={{ borderRadius: 'var(--radius)' }} />
        </div>

        {/* Subtitle */}
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>

      {/* ── Stats Grid (3×2) ────────────────────────────────────────── */}
      <StatsGridSkeleton />

      {/* ── Pull quote placeholder ───────────────────────────────────── */}
      <div
        className="mb-12 pl-5"
        style={{ borderLeft: '3px solid var(--accent-warm)', opacity: 0.35 }}
      >
        <Skeleton className="h-4 w-72" />
      </div>

      {/* ── Best Performing ─────────────────────────────────────────── */}
      <div className="mb-12">
        <SectionEyebrowSkeleton />
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            backgroundColor: 'var(--card)',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} index={i} total={3} wide={false} />
          ))}
        </div>
      </div>

      {/* ── Recent Stories ───────────────────────────────────────────── */}
      <div className="mb-12">
        <SectionEyebrowSkeleton />
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} index={i} total={3} wide />
          ))}
        </div>

        {/* View all link placeholder */}
        <div className="mt-3 flex justify-end">
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>

      {/* ── Decorative rule ──────────────────────────────────────────── */}
      <div className="mb-8 h-px w-full" style={{ backgroundColor: 'var(--border)' }} />

      {/* ── CTA buttons ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-32 rounded-[var(--radius)]" />
        <Skeleton className="h-10 w-40 rounded-[var(--radius)]" />
      </div>

    </AppContent>
  )
}
