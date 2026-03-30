import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'

const CATEGORIES = [
  { id: '1', name: 'Folklore', slug: 'folklore' },
  { id: '2', name: 'Romance', slug: 'romance' },
  { id: '3', name: 'Mystery', slug: 'mystery' },
  { id: '4', name: 'Myth', slug: 'myth' },
  { id: '5', name: 'Travel', slug: 'travel' },
  { id: '6', name: 'History', slug: 'history' },
]

type StoryEditorFormProps = {
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  categoryId: string
  setCategoryId: (v: string) => void
}

export function StoryEditorForm({
  title,
  setTitle,
  description,
  setDescription,
  categoryId,
  setCategoryId,
}: StoryEditorFormProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-title" className="font-sans text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--muted-foreground)' }}>
          Title
        </Label>
        <Input
          id="story-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Give your story a title…"
          className="font-serif text-lg font-semibold"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-description" className="font-sans text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--muted-foreground)' }}>
          Short description
        </Label>
        <Textarea
          id="story-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A single line that captures the essence of your story…"
          rows={2}
          className="resize-none px-3 py-2 font-sans text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-category" className="font-sans text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--muted-foreground)' }}>
          Category
        </Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const isActive = categoryId === cat.id
            return (
              <Button
                key={cat.id}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryId(cat.id)}
                className="rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-wide transition-all duration-150"
                style={
                  isActive
                    ? { backgroundColor: 'var(--foreground)', color: 'var(--background)' }
                    : {
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent',
                        color: 'var(--muted-foreground)',
                      }
                }
              >
                {cat.name}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
