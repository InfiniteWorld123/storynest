import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "#/server/contact";
import { contactSchema } from "#/validation/contact.schema";

type ContactDraft = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
};

export function ContactFormCard() {
  const [draft, setDraft] = useState<ContactDraft>({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const formStartedAtRef = useRef(Date.now());

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = contactSchema.safeParse({
        ...draft,
        formStartedAt: formStartedAtRef.current,
      });

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Please check your message and try again.");
      }

      await sendContactMessage({ data: parsed.data });
    },
    onSuccess: () => {
      setSent(true);
      setError(null);
      setDraft({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
      });
      formStartedAtRef.current = Date.now();
    },
    onError: (reason) => {
      if (reason instanceof Error) {
        setError(reason.message);
        return;
      }
      setError("Failed to send your message. Please try again.");
    },
  });

  function updateField<K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-10 shrink-0" style={{ backgroundColor: "var(--accent-warm)" }} />
          <span
            className="font-sans text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "var(--accent-warm)" }}
          >
            Send a Message
          </span>
        </div>
        <h2
          className="font-serif text-3xl font-semibold"
          style={{ color: "var(--foreground)", lineHeight: 1.1 }}
        >
          We'd love to hear from you
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Fill out the form below and we'll get back to you within 24–48 hours.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(false);
          setError(null);
          mutation.mutate();
        }}
      >
        <input
          type="text"
          value={draft.honeypot}
          onChange={(event) => updateField("honeypot", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
            >
              Name
            </label>
            <Input
              id="contact-name"
              value={draft.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              disabled={mutation.isPending}
              className="w-full px-4 font-sans text-sm"
              style={{ height: "2.75rem", backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
            >
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={draft.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={mutation.isPending}
              className="w-full px-4 font-sans text-sm"
              style={{ height: "2.75rem", backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-subject"
            className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            Subject
          </label>
          <Input
            id="contact-subject"
            value={draft.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            placeholder="What's this about?"
            disabled={mutation.isPending}
            className="w-full px-4 font-sans text-sm"
            style={{ height: "2.75rem", backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            Message
          </label>
          <Textarea
            id="contact-message"
            value={draft.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Tell us more..."
            rows={6}
            disabled={mutation.isPending}
            className="w-full resize-none px-4 py-3 font-sans text-sm"
            style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
          />
        </div>

        {error && (
          <p className="font-sans text-sm" style={{ color: "var(--destructive)" }}>
            {error}
          </p>
        )}

        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-base italic"
            style={{ color: "var(--accent-warm)" }}
          >
            Message sent. Thank you.
          </motion.p>
        )}

        <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} className="inline-flex">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-12 gap-2.5 rounded-[var(--radius)] px-7 font-sans text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
          >
            {mutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
