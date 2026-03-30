import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

type RecentListItem = {
  id: string
  title: string
  subtitle: string
  meta: string
}

export function RecentListCard({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: RecentListItem[]
}) {
  return (
    <Card className='h-full border-[var(--border)] bg-[var(--card)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {items.map((item, index) => (
          <div
            key={item.id}
            className='rounded-[var(--radius)] border border-[var(--border)] px-3 py-3'
            style={{
              backgroundColor: 'var(--background)',
              opacity: 1 - index * 0.05,
            }}
          >
            <p className='text-sm font-medium' style={{ color: 'var(--foreground)' }}>
              {item.title}
            </p>
            <p className='mt-1 text-xs leading-relaxed' style={{ color: 'var(--muted-foreground)' }}>
              {item.subtitle}
            </p>
            <p className='mt-2 text-[11px] uppercase tracking-[0.14em]' style={{ color: 'var(--muted-foreground)' }}>
              {item.meta}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
