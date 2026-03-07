import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { AuthLayout } from '../../components/auth/auth-layout'
import { SubmitButton } from '../../components/ui/submit-button'
import { sendVerificationEmail } from '#/lib/auth-client'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
const PENDING_EMAIL_KEY = 'storynest.pendingEmail'

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const [storedEmail, setStoredEmail] = useState<string | null>(null)
  const [isResending, setResending] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const email = sessionStorage.getItem(PENDING_EMAIL_KEY)

    if (!email) {
      const errorMsg = "Email is missing. Please sign up again."
      setErrMsg(errorMsg)
      toast(errorMsg)
      navigate({ to: '/sign-up' })
      return
    }

    setStoredEmail(email)
  }, [])

  const handleResendVerificationEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!storedEmail) {
      const errorMsg = 'Email is missing. Please sign up again.'
      setErrMsg(errorMsg)
      toast(errorMsg)
      return
    }
    setResending(true)
    try {
      await sendVerificationEmail({
        email: storedEmail,
        callbackURL: "/app/overview",
        fetchOptions: {
          onError: (ctx) => {
            const errorMsg = ctx.error.statusText
            setErrMsg(errorMsg)
            toast(errorMsg)
          },
          onSuccess: () => {
            sessionStorage.removeItem(PENDING_EMAIL_KEY)
            toast("email is resend successfully")
          },
        },
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      title='Check your email'
      description={
        storedEmail ? `We've sent a verification link to ${storedEmail}.` : "We've sent a verification link to your email address."
      }
      footer={
        <SubmitButton
          type='button'
          onClick={handleResendVerificationEmail}
          className='w-full'
          disabled={!storedEmail}
          isLoading={isResending}
          loadingText='Resending...'
        >
          Resend verification email
        </SubmitButton>
      }
    >
      <div className='flex flex-col justify-center space-y-4 py-6 text-sm text-[hsl(var(--muted-foreground))]'>
        <p>
          Click the magic link in the email we just sent you to verify your account and unlock the reading room.
        </p>
        <p className='text-xs'>
          If you don't see it, be sure to check your spam folder.
        </p>
      </div>
      {errMsg && <p className='text-red-500'>{errMsg}</p>}

    </AuthLayout>
  )
}
