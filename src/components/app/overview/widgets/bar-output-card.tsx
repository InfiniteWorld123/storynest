import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import type { OverviewMonthlyPoint } from '#/components/app/overview/types'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function BarOutputCard({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: OverviewMonthlyPoint[]
}) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='h-[240px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
            <XAxis dataKey='month' tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey='stories' fill='var(--accent-warm)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
