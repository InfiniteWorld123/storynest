import { createFileRoute } from '@tanstack/react-router'
import { AppContent } from '#/components/app/app-content'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '#/components/ui/sheet'
import { useTheme } from '#/components/theme/theme-provider'
import type { Theme } from '#/components/theme/theme-provider'
import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { AlertTriangle, CheckCircle2, Sun, Moon, Monitor } from 'lucide-react'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

// ── Mock session data (replace with authClient.useSession() when wiring up) ──
const MOCK_SESSION = { name: 'Alex Morgan', email: 'alex@example.com' }

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Day', icon: <Sun className="size-3.5" /> },
  { value: 'dark', label: 'Night', icon: <Moon className="size-3.5" /> },
  { value: 'system', label: 'System', icon: <Monitor className="size-3.5" /> },
]

const DELETE_ACCOUNT_ITEMS = [
  'All your written stories',
  'Your read-later saves',
  'All comments and reactions',
  'Your account and profile',
]

// ── Reusable Section Card ─────────────────────────────────────────────────────
function SettingsSection({
  eyebrow,
  title,
  description,
  children,
  danger = false,
  delay = 0,
}: {
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
  danger?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden"
      style={{
        border: danger
          ? '1px solid var(--destructive)'
          : '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Left accent bar */}
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          backgroundColor: danger ? 'var(--destructive)' : 'var(--accent-warm)',
          opacity: 0.8,
        }}
      />

      <div className="px-6 py-5">
        {/* Section eyebrow */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: danger ? 'var(--destructive)' : 'var(--accent-warm)' }}
          >
            {eyebrow}
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: danger ? 'var(--destructive)' : 'var(--border)', opacity: 0.5 }}
          />
        </div>

        {/* Section title + description */}
        <h2
          className="font-serif font-semibold tracking-tight"
          style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', color: 'var(--foreground)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 font-sans text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </p>
        )}

        {/* Content */}
        <div className="mt-5">{children}</div>
      </div>
    </motion.div>
  )
}

// ── Feedback line ─────────────────────────────────────────────────────────────
function Feedback({ ok, msg }: { ok: boolean; msg: string }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="size-3.5 shrink-0" style={{ color: 'oklch(0.55 0.12 145)' }} />
      ) : (
        <AlertTriangle className="size-3.5 shrink-0" style={{ color: 'var(--destructive)' }} />
      )}
      <span
        className="font-sans text-xs"
        style={{ color: ok ? 'oklch(0.55 0.12 145)' : 'var(--destructive)' }}
      >
        {msg}
      </span>
    </div>
  )
}

// ── Field row (Label + Input) ─────────────────────────────────────────────────
function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="font-sans text-xs font-semibold uppercase tracking-[0.18em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function SettingsPage() {
  const { theme, setTheme } = useTheme()

  // Profile state
  const [name, setName] = useState(MOCK_SESSION.name)
  const [email, setEmail] = useState(MOCK_SESSION.email)
  const [profileFeedback, setProfileFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  // Password state
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwFeedback, setPwFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  // Delete sheet
  const [deleteOpen, setDeleteOpen] = useState(false)

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setProfileFeedback({ ok: false, msg: 'Display name cannot be empty.' })
      return
    }
    // TODO: wire to authClient.updateUser({ name }) + authClient.changeEmail({ newEmail, callbackURL: '/app/settings' })
    setProfileFeedback({ ok: true, msg: 'Profile updated successfully.' })
  }

  function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    if (!currentPw || !newPw || !confirmPw) {
      setPwFeedback({ ok: false, msg: 'All fields are required.' })
      return
    }
    if (newPw.length < 8) {
      setPwFeedback({ ok: false, msg: 'New password must be at least 8 characters.' })
      return
    }
    if (newPw !== confirmPw) {
      setPwFeedback({ ok: false, msg: 'Passwords do not match.' })
      return
    }
    // TODO: wire to authClient.changePassword({ currentPassword: currentPw, newPassword: newPw, revokeOtherSessions: true })
    setPwFeedback({ ok: true, msg: 'Password changed. Other sessions have been signed out.' })
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  function handleDeleteAccount() {
    // TODO: wire to authClient.deleteUser() then redirect to '/'
    setDeleteOpen(false)
  }

  return (
    <AppContent>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="relative mb-10 overflow-hidden">

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
          ⚙
        </div>

        {/* Amber eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: 'var(--accent-warm)' }}
          >
            StoryNest
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: 'var(--accent-warm)' }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold tracking-tight"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--foreground)', lineHeight: 1.1 }}
        >
          Your Settings
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-3 font-sans text-sm leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Manage your account, security, and preferences.
        </motion.p>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* ── Sections ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* ── 1. Profile ─────────────────────────────────────────── */}
        <SettingsSection
          eyebrow="Profile"
          title="Display Name & Email"
          description="Update the name and email address associated with your account."
          delay={0.22}
        >
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">

            {/* ── Avatar slot ───────────────────────────────────────────────── */}
            <div className="flex items-center gap-4">
              {/* Avatar circle */}
              <div
                className="flex size-14 shrink-0 items-center justify-center rounded-full font-serif text-xl font-bold"
                style={{
                  backgroundColor: 'oklch(0.93 0.025 60)',
                  color: 'var(--accent-warm)',
                  border: '2px solid var(--border)',
                }}
                aria-label="Avatar"
              >
                {name.trim().charAt(0).toUpperCase() || '?'}
              </div>
              {/* Change photo — disabled, available later */}
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-7 cursor-not-allowed gap-1.5 rounded-[var(--radius)] px-3 font-sans text-xs font-semibold opacity-45"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  aria-label="Change profile photo (unavailable)"
                >
                  Change photo
                </Button>
                <span
                  className="rounded-full px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: 'oklch(0.93 0.025 60)',
                    color: 'var(--accent-warm)',
                    alignSelf: 'flex-start',
                  }}
                >
                  Available in next phase
                </span>
                {/* TODO: wire to UploadThing imageUploader, then authClient.updateUser({ image: url }) */}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="settings-name"
                label="Display Name"
                value={name}
                onChange={setName}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                id="settings-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {profileFeedback && <Feedback ok={profileFeedback.ok} msg={profileFeedback.msg} />}
              </div>
              <Button
                type="submit"
                className="shrink-0 font-sans text-sm font-semibold"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </SettingsSection>

        {/* ── 2. Security / Password ─────────────────────────────── */}
        <SettingsSection
          eyebrow="Security"
          title="Change Password"
          description="Choose a strong password. Changing it will sign out all other active sessions."
          delay={0.28}
        >
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <Field
              id="settings-current-pw"
              label="Current Password"
              type="password"
              value={currentPw}
              onChange={setCurrentPw}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="settings-new-pw"
                label="New Password"
                type="password"
                value={newPw}
                onChange={setNewPw}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <Field
                id="settings-confirm-pw"
                label="Confirm New Password"
                type="password"
                value={confirmPw}
                onChange={setConfirmPw}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {pwFeedback && <Feedback ok={pwFeedback.ok} msg={pwFeedback.msg} />}
              </div>
              <Button
                type="submit"
                variant="outline"
                className="shrink-0 font-sans text-sm font-semibold"
              >
                Change Password
              </Button>
            </div>
          </form>
        </SettingsSection>

        {/* ── 3. Appearance ──────────────────────────────────────── */}
        <SettingsSection
          eyebrow="Appearance"
          title="Theme"
          description="Choose how StoryNest looks for you. System follows your device setting."
          delay={0.34}
        >
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(opt => {
              const isActive = theme === opt.value
              return (
                <Button
                  key={opt.value}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(opt.value)}
                  className="h-9 gap-2 rounded-full px-4 font-sans text-sm font-semibold transition-all duration-150"
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--foreground)',
                          color: 'var(--background)',
                        }
                      : {
                          border: '1px solid var(--border)',
                          backgroundColor: 'transparent',
                          color: 'var(--muted-foreground)',
                      }
                  }
                >
                  {opt.icon}
                  {opt.label}
                </Button>
              )
            })}
          </div>
        </SettingsSection>

        {/* ── 4. Danger Zone ─────────────────────────────────────── */}
        <SettingsSection
          eyebrow="Danger Zone"
          title="Delete Account"
          description="Permanently delete your account and all associated stories, saves, and data. This cannot be undone."
          danger
          delay={0.4}
        >
          <Button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="font-sans text-sm font-semibold"
            style={{
              backgroundColor: 'var(--destructive)',
              color: '#fff',
              border: 'none',
            }}
          >
            Delete My Account →
          </Button>
        </SettingsSection>

      </div>

      {/* ── Delete Confirmation Sheet ─────────────────────────────── */}
      <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
        <SheetContent side="right">

          {/* Warning banner */}
          <div
            className="mb-6 rounded-[var(--radius)] px-4 py-3"
            style={{ backgroundColor: 'oklch(0.25 0.04 25)', border: '1px solid var(--destructive)' }}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 shrink-0" style={{ color: 'var(--destructive)' }} />
              <span
                className="font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--destructive)' }}
              >
                Irreversible Action
              </span>
            </div>
          </div>

          {/* Title */}
          <SheetTitle
            className="font-serif leading-tight"
            style={{ color: 'var(--foreground)', fontSize: 'clamp(1.2rem, 3vw, 1.45rem)' }}
          >
            Delete your account?
          </SheetTitle>

          {/* Description */}
          <p
            className="mt-3 font-sans text-sm leading-[1.75]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            This will permanently erase:
          </p>
          <ul className="mt-2 space-y-1.5">
            {DELETE_ACCOUNT_ITEMS.map(item => (
              <li key={item} className="flex items-center gap-2.5 font-sans text-sm" style={{ color: 'var(--foreground)' }}>
                <span className="size-1 shrink-0 rounded-full" style={{ backgroundColor: 'var(--destructive)' }} />
                {item}
              </li>
            ))}
          </ul>

          <p
            className="mt-4 font-sans text-sm font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            This action{' '}
            <span style={{ color: 'var(--destructive)' }}>cannot be undone.</span>
          </p>

          {/* Divider */}
          <div className="my-6 h-px w-full" style={{ backgroundColor: 'var(--border)' }} />

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="default"
              onClick={handleDeleteAccount}
              className="h-11 w-full gap-2 font-sans text-sm font-bold text-white transition-opacity duration-150 hover:opacity-85"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              <AlertTriangle className="size-3.5" />
              Yes, permanently delete
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-sans text-sm font-semibold"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel — keep my account
            </Button>
          </div>

          {/* Support note */}
          <p
            className="mt-6 font-sans text-xs leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Having trouble?{' '}
            <span
              className="cursor-pointer font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent-warm)' }}
            >
              Contact support instead.
            </span>
          </p>

        </SheetContent>
      </Sheet>

    </AppContent>
  )
}
