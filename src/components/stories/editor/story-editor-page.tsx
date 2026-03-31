import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Eye, Image as ImageIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AppContent } from '#/components/app/app-content'
import { Button } from '#/components/ui/button'
import { Sheet, SheetContent } from '#/components/ui/sheet'
import { StoryEditorToolbar } from './story-editor-toolbar'
import {
  StoryEditorForm,
  type StoryEditorCategory,
} from './story-editor-form'
import { StoryUploadPanel } from './story-upload-panel'
import { getCategories } from '#/server/category'
import { createStory, updateStory } from '#/server/story'
import { renderStoryContent } from '../shared/render-story-content'
import type { StoryContent } from '#/types/story'

type StoryEditorPrefill = {
  id: string
  title: string
  description: string
  content: StoryContent
  coverImageUrl: string | null
  category: {
    id: string
    name: string
    slug: string
  }
}

type StoryEditorPageProps = {
  mode: 'new' | 'edit'
  prefill?: StoryEditorPrefill
}

type EditorSnapshot = {
  title: string
  description: string
  categoryId: string
  coverImageUrl: string
  content: string
}

const EMPTY_CONTENT: Record<string, unknown> = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

const EMPTY_PREVIEW_CONTENT: StoryContent = {
  type: 'doc',
  content: [],
}

function normalizeStoryContent(value: unknown): StoryContent {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as StoryContent
  }
  return EMPTY_CONTENT as StoryContent
}

function toPreviewContent(value: StoryContent): StoryContent {
  if (
    value.type === 'doc'
    && Array.isArray((value as { content?: unknown }).content)
  ) {
    return value as StoryContent
  }
  return EMPTY_PREVIEW_CONTENT
}

function hasMeaningfulPreviewText(content: StoryContent): boolean {
  return content.content.some((block) =>
    Array.isArray(block.content)
    && block.content.some((node) => typeof node.text === 'string' && node.text.trim().length > 0),
  )
}

function parseErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const withMessage = error as {
    message?: string
    data?: { message?: string }
    cause?: { message?: string }
  }

  return (
    withMessage.data?.message
    || withMessage.message
    || withMessage.cause?.message
    || fallback
  )
}

function buildSnapshot({
  title,
  description,
  categoryId,
  coverImageUrl,
  content,
}: {
  title: string
  description: string
  categoryId: string
  coverImageUrl: string
  content: StoryContent
}): EditorSnapshot {
  return {
    title: title.trim(),
    description: description.trim(),
    categoryId: categoryId.trim(),
    coverImageUrl: coverImageUrl.trim(),
    content: JSON.stringify(content),
  }
}

function snapshotsMatch(a: EditorSnapshot, b: EditorSnapshot): boolean {
  return (
    a.title === b.title
    && a.description === b.description
    && a.categoryId === b.categoryId
    && a.coverImageUrl === b.coverImageUrl
    && a.content === b.content
  )
}

export function StoryEditorPage({ mode, prefill }: StoryEditorPageProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const initialContent = React.useMemo(
    () => normalizeStoryContent(prefill?.content),
    [prefill?.id],
  )

  const [title, setTitle] = React.useState(prefill?.title ?? '')
  const [description, setDescription] = React.useState(prefill?.description ?? '')
  const [categoryId, setCategoryId] = React.useState(prefill?.category.id ?? '')
  const [coverImageUrl, setCoverImageUrl] = React.useState(prefill?.coverImageUrl ?? '')
  const [content, setContent] = React.useState<StoryContent>(initialContent)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [baseline, setBaseline] = React.useState<EditorSnapshot>(() =>
    buildSnapshot({
      title: prefill?.title ?? '',
      description: prefill?.description ?? '',
      categoryId: prefill?.category.id ?? '',
      coverImageUrl: prefill?.coverImageUrl ?? '',
      content: initialContent,
    }),
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your story here...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: tiptapEditor }) => {
      setContent(tiptapEditor.getJSON() as StoryContent)
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] font-serif text-lg leading-[1.85] py-5 px-5',
      },
    },
  })

  React.useEffect(() => {
    const nextContent = normalizeStoryContent(prefill?.content)

    setTitle(prefill?.title ?? '')
    setDescription(prefill?.description ?? '')
    setCategoryId(prefill?.category.id ?? '')
    setCoverImageUrl(prefill?.coverImageUrl ?? '')
    setContent(nextContent)
    setBaseline(
      buildSnapshot({
        title: prefill?.title ?? '',
        description: prefill?.description ?? '',
        categoryId: prefill?.category.id ?? '',
        coverImageUrl: prefill?.coverImageUrl ?? '',
        content: nextContent,
      }),
    )

    if (editor) {
      editor.commands.setContent(nextContent)
    }
  }, [editor, mode, prefill?.id])

  const { data: categories = [], isPending: isCategoriesPending, error: categoriesError } = useQuery({
    queryKey: ['story-categories'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data.categories
    },
    staleTime: 60_000,
  })

  const categoryErrorMessage = categoriesError
    ? parseErrorMessage(categoriesError, 'Failed to load categories.')
    : null

  const currentSnapshot = React.useMemo(
    () =>
      buildSnapshot({
        title,
        description,
        categoryId,
        coverImageUrl,
        content,
      }),
    [title, description, categoryId, coverImageUrl, content],
  )

  const isDirty = !snapshotsMatch(currentSnapshot, baseline)

  const selectedCategory = React.useMemo(
    () =>
      categories.find((cat: StoryEditorCategory) => cat.id === categoryId)
      || (prefill?.category.id === categoryId ? prefill.category : null),
    [categories, categoryId, prefill?.category],
  )

  const previewContent = React.useMemo(() => toPreviewContent(content), [content])
  const hasPreviewContent = hasMeaningfulPreviewText(previewContent)

  const saveMutation = useMutation({
    mutationFn: async (): Promise<{
      id: string
      action: 'create' | 'update'
      snapshot: EditorSnapshot
    }> => {
      if (!editor) {
        throw new Error('Editor is not ready yet.')
      }
      if (!categoryId) {
        throw new Error('Please choose a category before saving.')
      }

      const latestContent = editor.getJSON() as StoryContent
      setContent(latestContent)

      const payload = {
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId.trim(),
        content: latestContent,
        coverImageUrl: coverImageUrl.trim() || undefined,
      }

      if (mode === 'new') {
        const response = await createStory({ data: payload })
        return {
          id: response.data.id,
          action: 'create',
          snapshot: buildSnapshot({
            ...payload,
            coverImageUrl: payload.coverImageUrl ?? '',
          }),
        }
      }

      if (!prefill?.id) {
        throw new Error('Story id is missing for update.')
      }

      const response = await updateStory({
        data: {
          storyId: prefill.id,
          ...payload,
        },
      })

      return {
        id: response.data.id,
        action: 'update',
        snapshot: buildSnapshot({
          ...payload,
          coverImageUrl: payload.coverImageUrl ?? '',
        }),
      }
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stories', 'me'] }),
        queryClient.invalidateQueries({ queryKey: ['story'] }),
      ])

      if (result.action === 'create') {
        toast.success('Story saved successfully.')
        navigate({
          to: '/app/stories/$storyId/edit',
          params: { storyId: result.id },
        })
        return
      }

      setBaseline(result.snapshot)
      toast.success('Story changes saved.')
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, 'Failed to save story.'))
    },
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    void saveMutation.mutateAsync()
  }

  function handleDiscard() {
    if (isDirty) {
      const shouldDiscard = window.confirm(
        'Discard unsaved changes and return to My Stories?',
      )
      if (!shouldDiscard) {
        return
      }
    }

    navigate({ to: '/app/stories' })
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
          {mode === 'new' ? 'Write something new.' : `Editing - ${prefill?.title ?? 'Story'}`}
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
            categories={categories}
            isLoadingCategories={isCategoriesPending}
            categoriesError={categoryErrorMessage}
          />
        </motion.div>

        {/* TipTap editor */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <div
            className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Story body
          </div>
          <div
            className="overflow-hidden rounded-[var(--radius)]"
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
          <StoryUploadPanel
            coverImageUrl={coverImageUrl}
            onChange={setCoverImageUrl}
            onRemove={() => setCoverImageUrl('')}
          />
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
            disabled={saveMutation.isPending || !editor}
            className="h-10 gap-2 px-5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
          >
            <Save className="size-3.5" />
            {saveMutation.isPending
              ? mode === 'new'
                ? 'Saving...'
                : 'Saving changes...'
              : mode === 'new'
                ? 'Save Story'
                : 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
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

          <Button
            type="button"
            variant="ghost"
            onClick={handleDiscard}
            className="inline-flex h-10 items-center px-4 font-sans text-sm transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Discard
          </Button>
        </motion.div>

      </form>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full max-w-2xl p-0 sm:max-w-3xl">
          <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
              <span
                className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: 'var(--accent-warm)' }}
              >
                Preview
              </span>
            </div>

            <h2
              className="font-serif text-3xl font-bold tracking-tight"
              style={{ color: 'var(--foreground)', lineHeight: 1.1 }}
            >
              {title.trim() || 'Untitled story'}
            </h2>

            <p
              className="mt-4 font-serif text-lg italic leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {description.trim() || 'Add a short description to preview it here.'}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="inline-flex rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ backgroundColor: 'oklch(0.93 0.025 60)', color: 'var(--accent-warm)' }}
              >
                {selectedCategory?.name ?? 'No category selected'}
              </span>
            </div>

            {coverImageUrl ? (
              <div
                className="mt-8 overflow-hidden rounded-[var(--radius)]"
                style={{ border: '1px solid var(--border)' }}
              >
                <img
                  src={coverImageUrl}
                  alt="Preview cover"
                  className="h-60 w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="mt-8 flex h-40 items-center justify-center rounded-[var(--radius)]"
                style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                <div className="inline-flex items-center gap-2 font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <ImageIcon className="size-4" />
                  No cover image selected
                </div>
              </div>
            )}

            <div className="my-8 h-px" style={{ backgroundColor: 'var(--border)' }} />

            {hasPreviewContent ? (
              <div>{renderStoryContent(previewContent)}</div>
            ) : (
              <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Start writing to see your story preview.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AppContent>
  )
}
