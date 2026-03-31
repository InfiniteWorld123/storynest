import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination'

// ─── Pagination props ─────────────────────────────────────────────────────────
// Shaped to mirror the backend PaginatedResource response:
//   { pagination: { total, page, limit, totalPages, hasMore } }
// When wiring to real API, just replace mock values with server response fields.
export type StoryPaginationProps = {
  currentPage: number       // mirrors pagination.page
  totalPages: number        // mirrors pagination.totalPages
  totalItems: number        // mirrors pagination.total
  itemsPerPage: number      // mirrors pagination.limit
  onPageChange: (page: number) => void
  onPagePrefetch?: (page: number) => void
}

// ─── Page number range builder ────────────────────────────────────────────────
// Returns an array of page numbers + null for ellipsis gaps
function buildPageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | null)[] = []

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, null, total)
  } else if (current >= total - 3) {
    pages.push(1, null, total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, null, current - 1, current, current + 1, null, total)
  }

  return pages
}

// ─── Story Pagination Component ───────────────────────────────────────────────
export function StoryPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPagePrefetch,
}: StoryPaginationProps) {
  if (totalPages <= 1) return null

  const from = (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(currentPage * itemsPerPage, totalItems)
  const pageRange = buildPageRange(currentPage, totalPages)

  const btnBase =
    'h-8 min-w-8 rounded-[var(--radius)] px-2 font-sans text-xs font-semibold transition-all duration-150 select-none'

  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* Count label — mirrors "Showing X–Y of Z" */}
      <p className="font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
        Showing{' '}
        <span className="font-semibold tabular-nums" style={{ color: 'var(--foreground)' }}>
          {from}
        </span>
        {' – '}
        <span className="font-semibold tabular-nums" style={{ color: 'var(--foreground)' }}>
          {to}
        </span>
        {' of '}
        <span className="font-semibold tabular-nums" style={{ color: 'var(--foreground)' }}>
          {totalItems}
        </span>{' '}
        {totalItems === 1 ? 'story' : 'stories'}
      </p>

      {/* Page controls */}
      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={btnBase}
              style={
                currentPage === 1
                  ? { color: 'var(--muted-foreground)', opacity: 0.35, cursor: 'not-allowed' }
                  : { border: '1px solid var(--border)', color: 'var(--foreground)' }
              }
              onMouseEnter={e => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = 'var(--muted)'
                  onPagePrefetch?.(currentPage - 1)
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            />
          </PaginationItem>

          {pageRange.map((page, i) =>
            page === null ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis
                  className='h-8 w-6 items-end pb-1 font-sans text-xs'
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  isActive={page === currentPage}
                  className={btnBase}
                  style={
                    page === currentPage
                      ? {
                          backgroundColor: 'var(--accent-warm)',
                          color: '#fff',
                          boxShadow: '0 1px 3px oklch(0.58 0.09 55 / 0.35)',
                          border: '1px solid var(--accent-warm)',
                        }
                      : {
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)',
                        }
                  }
                  onMouseEnter={e => {
                    if (page !== currentPage) {
                      e.currentTarget.style.backgroundColor = 'var(--muted)'
                      onPagePrefetch?.(page)
                    }
                  }}
                  onMouseLeave={e => {
                    if (page !== currentPage) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={btnBase}
              style={
                currentPage === totalPages
                  ? { color: 'var(--muted-foreground)', opacity: 0.35, cursor: 'not-allowed' }
                  : { border: '1px solid var(--border)', color: 'var(--foreground)' }
              }
              onMouseEnter={e => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = 'var(--muted)'
                  onPagePrefetch?.(currentPage + 1)
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
