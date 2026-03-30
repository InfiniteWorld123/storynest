import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import type { OverviewTrendPoint } from '#/components/app/overview/types'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function LineTrendCard({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: OverviewTrendPoint[]
}) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='h-[240px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
            <XAxis dataKey='label' tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
              }}
            />
            <Line type='monotone' dataKey='likes' stroke='var(--accent-warm)' strokeWidth={2.2} dot={false} />
            <Line type='monotone' dataKey='comments' stroke='oklch(0.56 0.09 250)' strokeWidth={2} dot={false} />
            <Line type='monotone' dataKey='saves' stroke='oklch(0.52 0.11 170)' strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
