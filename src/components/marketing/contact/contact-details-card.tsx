import { Mail, Clock, MessageCircle } from 'lucide-react'

const details = [
  {
    Icon: Mail,
    title: 'Email',
    description: 'hello@storynest.com',
    accent: true,
  },
  {
    Icon: Clock,
    title: 'Response Time',
    description: 'We typically respond within 24–48 hours.',
    accent: false,
  },
  {
    Icon: MessageCircle,
    title: 'Community',
    description: 'Join the conversation in our community forum.',
    accent: false,
  },
]

export function ContactDetailsCard() {
  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="h-px w-10 shrink-0"
            style={{ backgroundColor: 'var(--accent-warm)' }}
          />
          <span
            className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            Get in Touch
          </span>
        </div>
        <h2
          className="font-serif text-3xl font-semibold"
          style={{ color: 'var(--foreground)', lineHeight: 1.1 }}
        >
          Contact details
        </h2>
      </div>

      <div className="space-y-0">
        {details.map(({ Icon, title, description, accent }, i) => (
          <div key={title}>
            <div className="group flex items-start gap-4 py-6">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] transition-colors duration-300"
                style={{
                  backgroundColor: accent
                    ? 'oklch(0.93 0.025 60)'
                    : 'var(--muted)',
                  color: accent ? 'var(--accent-warm)' : 'var(--muted-foreground)',
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4
                  className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {title}
                </h4>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {description}
                </p>
              </div>
            </div>
            {i < details.length - 1 && (
              <div
                className="h-px"
                style={{ backgroundColor: 'var(--border)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        className="mt-8 rounded-[var(--radius)] p-5"
        style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
      >
        <p
          className="font-serif text-base italic leading-relaxed"
          style={{ color: 'var(--foreground)' }}
        >
          "We read every message personally. Your words matter to us."
        </p>
        <p
          className="mt-2 font-sans text-xs"
          style={{ color: 'var(--muted-foreground)' }}
        >
          — The StoryNest team
        </p>
      </div>
    </div>
  )
}
