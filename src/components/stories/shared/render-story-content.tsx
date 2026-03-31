import type { StoryContent } from '#/types/story'

// ─── Render TipTap JSON → React elements ─────────────────────────────────────
// Single source of truth for story body rendering.
// Used by: public-story-detail-page, story-viewer-sheet
// When adding new TipTap node types (image, table, etc.) update only this file.
export function renderStoryContent(content: StoryContent) {
  if (!content || !Array.isArray(content.content)) {
    return (
      <p className="mb-5 font-serif text-base leading-[1.85] sm:text-lg" style={{ color: 'var(--foreground)' }}>
        Story content is not available yet.
      </p>
    )
  }

  return content.content.map((block, i) => {
    if (block.type === 'heading') {
      const level = (block.attrs?.level as number) ?? 2
      const text = block.content?.map(n => n.text ?? '').join('') ?? ''
      if (level === 2) {
        return (
          <h2
            key={i}
            className="mt-10 mb-4 font-serif text-xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {text}
          </h2>
        )
      }
      return (
        <h3
          key={i}
          className="mt-8 mb-3 font-serif text-lg font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          {text}
        </h3>
      )
    }

    if (block.type === 'paragraph') {
      const nodes = block.content ?? []
      return (
        <p
          key={i}
          className="mb-5 font-serif text-base leading-[1.85] sm:text-lg"
          style={{ color: 'var(--foreground)' }}
        >
          {nodes.map((node, j) => {
            if (!node.text) return null
            const isBold = node.marks?.some(m => m.type === 'bold')
            const isItalic = node.marks?.some(m => m.type === 'italic')
            if (isBold && isItalic) return <strong key={j}><em>{node.text}</em></strong>
            if (isBold) return <strong key={j}>{node.text}</strong>
            if (isItalic) return <em key={j}>{node.text}</em>
            return <span key={j}>{node.text}</span>
          })}
        </p>
      )
    }

    if (block.type === 'blockquote') {
      const text =
        block.content
          ?.flatMap(b => (b as any).content?.map((n: any) => n.text ?? '') ?? [])
          .join('') ?? ''
      return (
        <blockquote
          key={i}
          className="my-8 pl-5 font-serif text-lg italic leading-relaxed"
          style={{ borderLeft: '3px solid var(--accent-warm)', color: 'var(--muted-foreground)' }}
        >
          {text}
        </blockquote>
      )
    }

    return null
  })
}
