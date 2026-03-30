import type { FormEvent, ReactNode } from 'react'

interface AuthFormShellProps {
  children: ReactNode
  onSubmit?: (e: FormEvent) => void
}

export function AuthFormShell({ children, onSubmit }: AuthFormShellProps) {
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
    >
      {children}
    </form>
  )
}
