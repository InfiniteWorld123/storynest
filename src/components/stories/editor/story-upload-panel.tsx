import { Image, X } from 'lucide-react'
import { UploadDropzone } from '#/components/uploadthings/uploadthings'
import { Button } from '#/components/ui/button'
import { toast } from 'sonner'

type StoryUploadPanelProps = {
  coverImageUrl: string
  onChange: (url: string) => void
  onRemove: () => void
}

export function StoryUploadPanel({ coverImageUrl, onChange, onRemove }: StoryUploadPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Cover Image
      </div>

      {coverImageUrl ? (
        <div
          className="relative overflow-hidden rounded-[var(--radius)]"
          style={{ border: '1px solid var(--border)' }}
        >
          <img
            src={coverImageUrl}
            alt="Story cover preview"
            className="h-56 w-full object-cover"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="absolute right-3 top-3 h-8 gap-1.5 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'oklch(1 0 0 / 0.85)',
              color: 'var(--foreground)',
            }}
          >
            <X className="size-3.5" />
            Remove
          </Button>
        </div>
      ) : (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(files) => {
            const firstFile = files?.[0]
            const uploadedUrl = firstFile?.serverData?.url ?? firstFile?.ufsUrl
            if (!uploadedUrl) {
              toast.error('Upload completed, but no file URL was returned.')
              return
            }
            onChange(uploadedUrl)
            toast.success('Cover image uploaded.')
          }}
          onUploadError={(error) => {
            toast.error(error.message || 'Cover upload failed.')
          }}
        />
      )}

      {coverImageUrl && (
        <div
          className="rounded-[var(--radius)]"
          style={{ border: '1px solid var(--border)' }}
        >
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(files) => {
              const firstFile = files?.[0]
              const uploadedUrl = firstFile?.serverData?.url ?? firstFile?.ufsUrl
              if (!uploadedUrl) {
                toast.error('Upload completed, but no file URL was returned.')
                return
              }
              onChange(uploadedUrl)
              toast.success('Cover image replaced.')
            }}
            onUploadError={(error) => {
              toast.error(error.message || 'Cover upload failed.')
            }}
          />
        </div>
      )}

      <div
        className="inline-flex items-center gap-1.5 rounded px-2.5 py-1"
        style={{ backgroundColor: 'oklch(0.93 0.025 60)' }}
      >
        <Image className="size-3" style={{ color: 'var(--accent-warm)' }} />
        <span className="font-sans text-[10px] font-semibold" style={{ color: 'var(--accent-warm)' }}>
          {coverImageUrl ? 'Upload a replacement if needed' : 'Optional cover image'}
        </span>
      </div>
    </div>
  )
}
