import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'

function FormField({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string
  label: string
  placeholder: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
        style={{ color: focused ? 'var(--accent-warm)' : 'var(--foreground)' }}
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 font-sans text-sm transition-all duration-200"
        style={{
          height: '2.75rem',
          backgroundColor: 'var(--secondary)',
          color: 'var(--foreground)',
          border: focused
            ? '1.5px solid var(--accent-warm)'
            : '1px solid var(--border)',
        }}
      />
    </div>
  )
}

export function ContactFormCard() {
  const [textareaFocused, setTextareaFocused] = useState(false)
  const [sent, setSent] = useState(false)

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
            Send a Message
          </span>
        </div>
        <h2
          className="font-serif text-3xl font-semibold"
          style={{ color: 'var(--foreground)', lineHeight: 1.1 }}
        >
          We'd love to hear from you
        </h2>
        <p
          className="mt-3 font-sans text-sm leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Fill out the form below and we'll get back to you within 24–48 hours.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="contact-name" label="Name" placeholder="Your name" />
          <FormField
            id="contact-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
        </div>
        <FormField
          id="contact-subject"
          label="Subject"
          placeholder="What's this about?"
        />

        {/* Textarea */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
            style={{
              color: textareaFocused ? 'var(--accent-warm)' : 'var(--foreground)',
            }}
          >
            Message
          </label>
          <Textarea
            id="contact-message"
            placeholder="Tell us more..."
            rows={6}
            onFocus={() => setTextareaFocused(true)}
            onBlur={() => setTextareaFocused(false)}
            className="w-full resize-none px-4 py-3 font-sans text-sm transition-all duration-200"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--foreground)',
              border: textareaFocused
                ? '1.5px solid var(--accent-warm)'
                : '1px solid var(--border)',
            }}
          />
        </div>

        {/* Submit */}
        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-base italic"
            style={{ color: 'var(--accent-warm)' }}
          >
            ✦ Message sent — thank you!
          </motion.p>
        ) : (
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            className="inline-flex"
          >
            <Button
              type="submit"
              className="h-12 gap-2.5 rounded-[var(--radius)] px-7 font-sans text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
            >
              Send Message →
            </Button>
          </motion.div>
        )}
      </form>
    </div>
  )
}
