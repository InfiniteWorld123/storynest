import { Link } from '@tanstack/react-router'

interface FooterLink {
  prefix?: string
  label: string
  to: string
}

interface AuthFooterLinksProps {
  links: FooterLink[]
}

export function AuthFooterLinks({ links }: AuthFooterLinksProps) {
  return (
    <div
      className="mt-8 space-y-2.5 pt-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {links.map((link) => (
        <p
          key={link.to}
          className="text-center font-sans text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {link.prefix}{' '}
          <Link
            to={link.to}
            className="group relative font-semibold transition-colors duration-200"
            style={{ color: 'var(--foreground)' }}
          >
            {link.label}
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: 'var(--accent-warm)' }}
            />
          </Link>
        </p>
      ))}
    </div>
  )
}
