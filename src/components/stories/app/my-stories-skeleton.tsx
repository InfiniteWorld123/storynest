import { AppContent } from '#/components/app/app-content'
import { Skeleton } from '#/components/ui/skeleton'

// ─── List row skeleton ────────────────────────────────────────────────────────
function StoryListRowSkeleton({ index, total }: { index: number; total: number }) {
  return (
    <div
      className="relative flex items-start gap-4 px-5 py-4"
      style={{
        borderBottom: index < total - 1 ? '1px solid var(--border)' : undefined,
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Left accent */}
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Cover placeholder */}
      <Skeleton className="h-[72px] w-[52px] shrink-0 rounded-[var(--radius)]" />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-2 pt-1">
        {/* Category pill + title row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        {/* Meta row */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 items-center gap-1 pt-1">
        <Skeleton className="h-7 w-7 rounded-[var(--radius)]" />
        <Skeleton className="h-7 w-12 rounded-[var(--radius)]" />
      </div>
    </div>
  )
}

// ─── My Stories Skeleton ──────────────────────────────────────────────────────
export function MyStoriesSkeleton() {
  return (
    <AppContent>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          {/* Amber eyebrow */}
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.4 }} />
            <Skeleton className="h-2.5 w-24" />
            <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)', opacity: 0.4 }} />
          </div>
          {/* Heading */}
          <Skeleton className="mb-2 h-9 w-44" style={{ borderRadius: 'var(--radius)' }} />
          {/* Subtitle */}
          <Skeleton className="h-3.5 w-40" />
        </div>

        {/* New Story button */}
        <Skeleton className="h-10 w-28 shrink-0 rounded-[var(--radius)]" />
      </div>

      {/* ── Filter Panel ───────────────────────────────────────────── */}
      <div
        className="mb-6"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--muted)',
        }}
      >
        {/* Row 1: Search + Sort + View toggle */}
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:p-5">
          {/* Search box */}
          <div className="relative flex-1">
            <Skeleton className="h-9 w-full rounded-[var(--radius)]" />
          </div>
          {/* Sort dropdown */}
          <Skeleton className="h-9 w-full rounded-[var(--radius)] sm:w-[200px]" />
          {/* View toggle */}
          <Skeleton className="h-9 w-20 shrink-0 rounded-[var(--radius)]" />
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Row 2: Category pills */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          {['All', 'Folklore', 'Romance', 'Mystery', 'Myth', 'Travel', 'History'].map(label => (
            <Skeleton
              key={label}
              className="h-8 rounded-full"
              style={{ width: `${label.length * 8 + 24}px` }}
            />
          ))}
        </div>
      </div>

      {/* ── Story list ─────────────────────────────────────────────── */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          backgroundColor: 'var(--card)',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <StoryListRowSkeleton key={i} index={i} total={3} />
        ))}
      </div>

      {/* ── Pagination ─────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <Skeleton className="h-3.5 w-40" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-[var(--radius)]" />
          <Skeleton className="h-8 w-8 rounded-[var(--radius)]" />
          <Skeleton className="h-8 w-8 rounded-[var(--radius)]" />
          <Skeleton className="h-8 w-8 rounded-[var(--radius)]" />
        </div>
      </div>

    </AppContent>
  )
}
