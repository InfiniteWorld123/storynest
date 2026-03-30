import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import type { OverviewReactionSlice } from '#/components/app/overview/types'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export function PieMixCard({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: OverviewReactionSlice[]
}) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='h-[240px]'>
        <div className='grid h-full gap-4 sm:grid-cols-[1.2fr_0.8fr]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                innerRadius={52}
                outerRadius={84}
                stroke='var(--card)'
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className='flex flex-col justify-center gap-3'>
            {data.map((slice) => (
              <div key={slice.name} className='rounded-[var(--radius)] border border-[var(--border)] px-3 py-2'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm font-medium' style={{ color: 'var(--foreground)' }}>
                    {slice.name}
                  </span>
                  <span className='font-serif text-xl leading-none' style={{ color: 'var(--foreground)' }}>
                    {slice.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
