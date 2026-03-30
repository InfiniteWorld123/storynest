import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { AppContent } from '#/components/app/app-content'
import { Button } from '#/components/ui/button'
import { type Story } from '../data/stories-mock'
import { StoryEditorToolbar } from './story-editor-toolbar'
import { StoryEditorForm } from './story-editor-form'
import { StoryUploadPanel } from './story-upload-panel'

type StoryEditorPageProps = {
  mode: 'new' | 'edit'
  prefill?: Story
}

export function StoryEditorPage({ mode, prefill }: StoryEditorPageProps) {
  const [title, setTitle] = React.useState(prefill?.title ?? '')
  const [description, setDescription] = React.useState(prefill?.description ?? '')
  const [categoryId, setCategoryId] = React.useState(prefill?.category.id ?? '')
  const [saved, setSaved] = React.useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your story here…',
      }),
    ],
    content: prefill?.content ?? '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] font-serif text-lg leading-[1.85] py-5 px-5',
      },
    },
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // Static UI only — no backend call
    // TODO: wire createStory() or updateStory() here
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppContent>
      {/* Header */}
      <div className="relative mb-8 overflow-hidden">
        {/* Ghost letterform */}
        <div
          className="pointer-events-none absolute -right-4 -top-8 select-none font-serif leading-none"
          aria-hidden
          style={{
            fontSize: 'clamp(9rem, 22vw, 17rem)',
            color: 'currentColor',
            opacity: 0.04,
            WebkitTextStroke: '1px currentColor',
            lineHeight: 1,
          }}
        >
          {mode === 'new' ? 'N' : 'E'}
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5"
        >
          <Link
            to="/app/stories"
            className="group inline-flex items-center gap-2 font-sans text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ArrowLeft className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            My Stories
          </Link>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            {mode === 'new' ? 'New Story' : 'Edit Story'}
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold tracking-tight"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)', lineHeight: 1.1 }}
        >
          {mode === 'new' ? 'Write something new.' : `Editing — ${prefill?.title ?? 'Story'}`}
        </motion.h1>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-8">

        {/* Meta fields */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <StoryEditorForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        </motion.div>

        {/* TipTap editor */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <div
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] mb-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Story body
          </div>
          <div
            className="rounded-[var(--radius)] overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            <StoryEditorToolbar editor={editor} />
            <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </motion.div>

        {/* Upload panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <StoryUploadPanel />
        </motion.div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button
            type="submit"
            className="h-10 gap-2 px-5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
          >
            <Save className="size-3.5" />
            {mode === 'new' ? 'Save Story' : 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 px-5 font-sans text-sm font-semibold transition-colors duration-150"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
            }}
          >
            <Eye className="size-3.5" />
            Preview
          </Button>

          <Link
            to="/app/stories"
            className="inline-flex h-10 items-center px-4 font-sans text-sm transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Discard
          </Link>

          {saved && (
            <span className="font-sans text-xs" style={{ color: 'oklch(0.55 0.12 145)' }}>
              ✓ {mode === 'new' ? 'Story saved' : 'Changes saved'}
            </span>
          )}
        </motion.div>

      </form>
    </AppContent>
  )
}
