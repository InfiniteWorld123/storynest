import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { OverviewLeaderboardGroup } from '#/components/app/overview/types'

export function LeaderboardTable({ group }: { group: OverviewLeaderboardGroup }) {
  return (
    <Card className='border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{group.title}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent className='overflow-x-auto'>
        <Table className='min-w-[560px] text-left'>
          <TableHeader>
            <TableRow className='border-b border-[var(--border)] text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] hover:bg-transparent'>
              <TableHead className='pb-3 pr-4 font-semibold text-[var(--muted-foreground)]'>Story</TableHead>
              <TableHead className='pb-3 pr-4 font-semibold text-[var(--muted-foreground)]'>Category</TableHead>
              <TableHead className='pb-3 pr-4 font-semibold text-[var(--muted-foreground)]'>{group.countLabel}</TableHead>
              <TableHead className='pb-3 font-semibold text-[var(--muted-foreground)]'>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.rows.map((row) => (
              <TableRow key={row.storyId} className='border-b border-[var(--border)]/70 last:border-b-0'>
                <TableCell className='py-3 pr-4 font-medium text-[var(--foreground)]'>{row.storyTitle}</TableCell>
                <TableCell className='py-3 pr-4 text-sm text-[var(--muted-foreground)]'>{row.category}</TableCell>
                <TableCell className='py-3 pr-4 font-serif text-lg text-[var(--foreground)]'>{row.count}</TableCell>
                <TableCell className='py-3 text-sm text-[var(--muted-foreground)]'>{row.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
