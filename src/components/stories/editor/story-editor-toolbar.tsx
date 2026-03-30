import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Undo2,
  Redo2,
} from 'lucide-react'
import { Button } from '#/components/ui/button'

type ToolbarButtonProps = {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      variant={isActive ? 'default' : 'ghost'}
      size="icon"
      className="h-8 w-8 rounded transition-colors duration-100 disabled:opacity-30 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      style={{
        color: isActive ? 'var(--background)' : 'var(--muted-foreground)',
        backgroundColor: isActive ? 'var(--foreground)' : 'transparent',
      }}
    >
      {children}
    </Button>
  )
}

function Separator() {
  return <span className="mx-1 h-5 w-px" style={{ backgroundColor: 'var(--border)' }} />
}

export function StoryEditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 rounded-t-[var(--radius)] px-3 py-2"
      style={{
        backgroundColor: 'var(--muted)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <Bold className="size-3.5" />
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <Italic className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="size-3.5" />
      </ToolbarButton>

      <ToolbarButton
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <List className="size-3.5" />
      </ToolbarButton>

      <ToolbarButton
        title="Block quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className="size-3.5" />
      </ToolbarButton>

      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className="size-3.5" />
      </ToolbarButton>
    </div>
  )
}
