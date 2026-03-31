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
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Sun, Moon, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import {
  authClient,
  changeEmail,
  changePassword,
  deleteUser,
  updateUser,
} from '#/lib/auth-client'
import {
  type InlineFeedback,
  runDeleteAccountAction,
  runPasswordChangeAction,
  runProfileUpdateAction,
} from '#/components/app/settings/settings-actions'

const THEME_OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
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

function toInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

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
  children: ReactNode
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
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          backgroundColor: danger ? 'var(--destructive)' : 'var(--accent-warm)',
          opacity: 0.8,
        }}
      />

      <div className="px-6 py-5">
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

        <div className="mt-5">{children}</div>
      </div>
    </motion.div>
  )
}

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

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
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
        disabled={disabled}
      />
    </div>
  )
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const sessionQuery = authClient.useSession()
  const sessionUser = sessionQuery.data?.user

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileFeedback, setProfileFeedback] = useState<InlineFeedback | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwFeedback, setPwFeedback] = useState<InlineFeedback | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteFeedback, setDeleteFeedback] = useState<InlineFeedback | null>(null)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const isSessionPending = sessionQuery.isPending && !sessionUser
  const isBusy = isSavingProfile || isChangingPassword || isDeletingAccount

  useEffect(() => {
    if (!sessionUser) {
      return
    }

    setName(sessionUser.name ?? '')
    setEmail(sessionUser.email ?? '')
  }, [sessionUser?.email, sessionUser?.id, sessionUser?.name])

  useEffect(() => {
    if (deleteOpen) {
      return
    }

    setDeletePassword('')
    setDeleteFeedback(null)
  }, [deleteOpen])

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()

    setIsSavingProfile(true)
    setProfileFeedback(null)

    try {
      const result = await runProfileUpdateAction({
        sessionUser: sessionUser
          ? { name: sessionUser.name, email: sessionUser.email }
          : null,
        input: { name, email },
        deps: {
          updateUserFn: updateUser,
          changeEmailFn: changeEmail,
        },
      })

      setProfileFeedback(result.feedback)

      if (result.feedback.ok) {
        toast.success(result.feedback.msg)
      } else {
        toast.error(result.feedback.msg)
      }

      if (result.shouldRefetch) {
        await sessionQuery.refetch()
      }
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()

    setIsChangingPassword(true)
    setPwFeedback(null)

    try {
      const result = await runPasswordChangeAction({
        sessionUser: sessionUser
          ? { name: sessionUser.name, email: sessionUser.email }
          : null,
        currentPassword: currentPw,
        newPassword: newPw,
        confirmPassword: confirmPw,
        deps: {
          changePasswordFn: changePassword,
        },
      })

      setPwFeedback(result.feedback)
      if (result.feedback.ok) {
        toast.success(result.feedback.msg)
      } else {
        toast.error(result.feedback.msg)
      }

      if (result.clearPasswords) {
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleDeleteAccount() {
    setIsDeletingAccount(true)
    setDeleteFeedback(null)

    try {
      const result = await runDeleteAccountAction({
        sessionUser: sessionUser
          ? { name: sessionUser.name, email: sessionUser.email }
          : null,
        password: deletePassword,
        deps: {
          deleteUserFn: deleteUser,
        },
      })

      if (result.shouldRedirect) {
        toast.success(result.feedback.msg)
        setDeleteOpen(false)
        window.location.assign('/')
        return
      }

      setDeleteFeedback(result.feedback)
      toast.error(result.feedback.msg)
    } finally {
      setIsDeletingAccount(false)
    }
  }

  if (isSessionPending) {
    return (
      <AppContent>
        <div
          className="rounded-[var(--radius)] border px-6 py-8"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <p className="font-sans text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Loading your account settings...
          </p>
        </div>
      </AppContent>
    )
  }

  if (!sessionUser) {
    return (
      <AppContent>
        <div
          className="rounded-[var(--radius)] border px-6 py-8"
          style={{ borderColor: 'var(--destructive)', backgroundColor: 'var(--card)' }}
        >
          <p className="font-sans text-sm" style={{ color: 'var(--destructive)' }}>
            We could not load your account session. Please sign in again.
          </p>
        </div>
      </AppContent>
    )
  }

  return (
    <AppContent>
      <div className="relative mb-10 overflow-hidden">
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

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <div className="flex flex-col gap-5">
        <SettingsSection
          eyebrow="Profile"
          title="Display Name & Email"
          description="Update the name and email address associated with your account."
          delay={0.22}
        >
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex size-14 shrink-0 items-center justify-center rounded-full font-serif text-xl font-bold"
                style={{
                  backgroundColor: 'oklch(0.93 0.025 60)',
                  color: 'var(--accent-warm)',
                  border: '2px solid var(--border)',
                }}
                aria-label="Avatar"
              >
                {toInitial(name)}
              </div>

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
                  Photo upload unavailable
                </span>
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
                disabled={isSavingProfile}
              />
              <Field
                id="settings-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={isSavingProfile}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {profileFeedback && <Feedback ok={profileFeedback.ok} msg={profileFeedback.msg} />}
              </div>
              <Button
                type="submit"
                disabled={isSavingProfile}
                className="shrink-0 font-sans text-sm font-semibold"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
              >
                {isSavingProfile ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </SettingsSection>

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
              disabled={isChangingPassword}
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
                disabled={isChangingPassword}
              />
              <Field
                id="settings-confirm-pw"
                label="Confirm New Password"
                type="password"
                value={confirmPw}
                onChange={setConfirmPw}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isChangingPassword}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {pwFeedback && <Feedback ok={pwFeedback.ok} msg={pwFeedback.msg} />}
              </div>
              <Button
                type="submit"
                variant="outline"
                disabled={isChangingPassword}
                className="shrink-0 font-sans text-sm font-semibold"
              >
                {isChangingPassword ? 'Changing…' : 'Change Password'}
              </Button>
            </div>
          </form>
        </SettingsSection>

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
                  disabled={isBusy}
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
            disabled={isDeletingAccount}
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

      <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
        <SheetContent side="right">
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

          <SheetTitle
            className="font-serif leading-tight"
            style={{ color: 'var(--foreground)', fontSize: 'clamp(1.2rem, 3vw, 1.45rem)' }}
          >
            Delete your account?
          </SheetTitle>

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

          <div className="mt-5">
            <Field
              id="settings-delete-password"
              label="Confirm With Password"
              type="password"
              value={deletePassword}
              onChange={setDeletePassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
              disabled={isDeletingAccount}
            />
          </div>

          {deleteFeedback && <Feedback ok={deleteFeedback.ok} msg={deleteFeedback.msg} />}

          <p
            className="mt-4 font-sans text-sm font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            This action{' '}
            <span style={{ color: 'var(--destructive)' }}>cannot be undone.</span>
          </p>

          <div className="my-6 h-px w-full" style={{ backgroundColor: 'var(--border)' }} />

          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="default"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="h-11 w-full gap-2 font-sans text-sm font-bold text-white transition-opacity duration-150 hover:opacity-85"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              <AlertTriangle className="size-3.5" />
              {isDeletingAccount ? 'Deleting account…' : 'Yes, permanently delete'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-sans text-sm font-semibold"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel — keep my account
            </Button>
          </div>

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
