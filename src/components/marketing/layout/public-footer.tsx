import { Link } from '@tanstack/react-router'
import { BookMarked } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  account: [
    { label: 'Sign In', to: '/sign-in' },
    { label: 'Sign Up', to: '/sign-up' },
  ],
} as const

export function PublicFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
      {/* Thin warm accent top line */}
      <div
        className="h-[2px] w-full opacity-40"
        style={{ backgroundColor: 'var(--accent-warm)' }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <BookMarked className="h-5 w-5" style={{ color: 'var(--accent-warm)' }} />
              <span
                className="font-serif text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                StoryNest
              </span>
            </div>
            <p
              className="mb-6 max-w-xs font-sans text-sm leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              A thoughtful space for readers and storytellers to discover,
              create, and share narratives that matter.
            </p>
            <p
              className="font-serif text-sm italic"
              style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
            >
              "Every story deserves a home."
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4
              className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: 'var(--foreground)' }}
            >
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group relative font-sans text-sm transition-colors hover:text-foreground"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: 'var(--accent-warm)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4
              className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: 'var(--foreground)' }}
            >
              Account
            </h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group relative font-sans text-sm transition-colors hover:text-foreground"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: 'var(--accent-warm)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="font-sans text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            © {new Date().getFullYear()} StoryNest. All rights reserved.
          </p>
          <span
            aria-hidden
            className="font-serif text-base"
            style={{ color: 'var(--accent-warm)', opacity: 0.45 }}
          >
            ✦
          </span>
        </div>
      </div>
    </footer>
  )
}
