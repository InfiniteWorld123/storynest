import { Link, createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '../../components/auth/auth-layout'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { SubmitButton } from '../../components/ui/submit-button'
import type { EmailType } from '#/validation/auth.schema'
import { useForm } from 'react-hook-form'
import { requestPasswordReset } from '#/lib/auth-client'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmailType>()
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const handleForgotPassword = async (formData: EmailType) => {
    // const redirectTo =
    //   typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : '/reset-password'

    await requestPasswordReset({
      redirectTo: '/reset-password',
      email: formData.email,
      fetchOptions: {
        onError: (ctx) => {
          const errorMsg = ctx.error.message
          setErrMsg(errorMsg)
          toast(errorMsg)
        },
        onSuccess: () => {
          toast('Request reset password sent successfully')
        },
      },
    })
  }

  return (
    <AuthLayout
      title='Forgot your password?'
      description='We will send a reset link to your email address.'
      footer={
        <>
          Remembered it?{' '}
          <Link to='/sign-in' className='link-underline text-[hsl(var(--foreground))]'>
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleForgotPassword)} className='space-y-4' noValidate>
        <div className='space-y-2'>
          <Label htmlFor='forgot-email'>Email</Label>
          <Input {...register('email')} id='forgot-email' type='email' placeholder='reader@archive.com' />
        </div>

        <SubmitButton isLoading={isSubmitting} loadingText='Sending...' className='w-full'>
          Send Reset Link
        </SubmitButton>
        {errMsg && <p className='text-red-500'>{errMsg}</p>}
      </form>
    </AuthLayout>
  )
}
