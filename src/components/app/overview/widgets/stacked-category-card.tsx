import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import type { OverviewCategoryPoint } from '#/components/app/overview/types'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function StackedCategoryCard({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: OverviewCategoryPoint[]
}) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='h-[240px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ left: -12, right: 4, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
            <XAxis dataKey='category' tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey='likes' stackId='a' fill='var(--accent-warm)' radius={[4, 4, 0, 0]} />
            <Bar dataKey='comments' stackId='a' fill='oklch(0.56 0.09 250)' />
            <Bar dataKey='saves' stackId='a' fill='oklch(0.52 0.11 170)' radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
