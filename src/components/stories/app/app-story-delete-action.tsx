import * as React from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Sheet, SheetContent } from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'

type AppStoryDeleteActionProps = {
  storyTitle: string
}

export function AppStoryDeleteAction({ storyTitle }: AppStoryDeleteActionProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* Trigger button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className="group h-8 w-8 rounded transition-colors duration-150 hover:bg-[oklch(0.95_0.02_25)] hover:text-[var(--destructive)]"
        title="Delete story"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Trash2 className="size-3.5" />
      </Button>

      {/* Confirm sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          {/* Warning banner */}
          <div
            className="mb-6 rounded-[var(--radius)] px-4 py-3"
            style={{ backgroundColor: 'oklch(0.25 0.04 25)', border: '1px solid var(--destructive)' }}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 shrink-0" style={{ color: 'var(--destructive)' }} />
              <span
                className="font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--destructive)' }}
              >
                Delete Story
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-serif font-bold leading-tight"
            style={{ color: 'var(--foreground)', fontSize: 'clamp(1.1rem, 3vw, 1.35rem)' }}
          >
            Delete this story?
          </h3>

          {/* Story name */}
          <p
            className="mt-2 font-serif text-base italic"
            style={{ color: 'var(--accent-warm)', borderLeft: '3px solid var(--accent-warm)', paddingLeft: '0.75rem' }}
          >
            "{storyTitle}"
          </p>

          <p className="mt-4 font-sans text-sm leading-[1.7]" style={{ color: 'var(--muted-foreground)' }}>
            This will permanently remove the story, all its comments, reactions, and saves.{' '}
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
              This cannot be undone.
            </span>
          </p>

          <div className="my-6 h-px" style={{ backgroundColor: 'var(--border)' }} />

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                // Static UI only — no backend call
                // TODO: wire deleteStory({ storyId }) here
                setOpen(false)
              }}
              className="h-11 w-full gap-2 font-sans text-sm font-bold text-white transition-opacity duration-150 hover:opacity-85"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              <Trash2 className="size-3.5" />
              Yes, delete story
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-sans text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Cancel — keep story
            </Button>
          </div>

          <p className="mt-6 font-sans text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            UI only — story list will not change until backend is wired.
          </p>
        </SheetContent>
      </Sheet>
    </>
  )
}
