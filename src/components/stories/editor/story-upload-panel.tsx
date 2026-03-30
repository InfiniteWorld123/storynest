import { ImageOff } from 'lucide-react'
import { UploadDropzone } from '#/components/uploadthings/uploadthings'

export function StoryUploadPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Cover Image
      </div>

      <div className="relative">
        <div className="pointer-events-none opacity-60">
          <UploadDropzone endpoint="imageUploader" />
        </div>

        {/* Disabled overlay in static phase */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius)]"
          style={{
            backgroundColor: 'oklch(0 0 0 / 0.08)',
            border: '1.5px dashed var(--border)',
            pointerEvents: 'auto',
          }}
          aria-hidden
        />
      </div>

      <div
        className="inline-flex items-center gap-1.5 rounded px-2.5 py-1"
        style={{ backgroundColor: 'oklch(0.93 0.025 60)' }}
      >
        <ImageOff className="size-3" style={{ color: 'var(--accent-warm)' }} />
        <span className="font-sans text-[10px] font-semibold" style={{ color: 'var(--accent-warm)' }}>
          Upload available in next phase
        </span>
      </div>

      <p className="font-sans text-xs" style={{ color: 'var(--muted-foreground)' }}>
        UI only — Uploadthing wiring is intentionally disabled.
      </p>
    </div>
  )
}
