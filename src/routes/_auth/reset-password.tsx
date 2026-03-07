import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { AuthLayout } from '../../components/auth/auth-layout'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { SubmitButton } from '../../components/ui/submit-button'
import { ResetPasswordSchema, type ResetPasswordType } from '#/validation/auth.schema'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { resetPassword } from '#/lib/auth-client'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordType>({ resolver: standardSchemaResolver(ResetPasswordSchema) })
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const { token, error: searchError } = Route.useSearch()

  useEffect(() => {
    if (!token && !searchError) {
      navigate({ to: '/forgot-password', replace: true })
    }
  }, [navigate, searchError, token])

  const handleResetPassword = async (formData: ResetPasswordType) => {
    if (!token) {
      const errorMsg = 'Reset token is missing. Please request another reset link.'
      setErrMsg(errorMsg)
      toast(errorMsg)
      return
    }

    await resetPassword({
      newPassword: formData.password,
      token,
      fetchOptions: {
        onError: (ctx) => {
          const errorMsg = ctx.error.message
          setErrMsg(errorMsg)
          toast(errorMsg)
          navigate({ to: '/forgot-password' })
        },
        onSuccess: () => {
          toast('Password reset successfully')
          navigate({ to: '/sign-in' })
        },
      },
    })
  }


  return (
    <AuthLayout
      title={!!searchError ? 'Link expired or invalid' : 'Choose a new password'}
      description={
        !!searchError
          ? 'This reset link is no longer valid.'
          : 'Set a strong passphrase before returning to your shelves.'
      }
      footer={
        <Link to='/sign-in' className='link-underline text-[hsl(var(--foreground))]'>
          Return to sign in
        </Link>
      }
    >
      {!!searchError ? (
        <div className='flex flex-col items-center gap-4 py-2 text-center'>
          <div className='text-4xl'>🔑</div>
          <p className='text-sm text-muted-foreground'>
            {searchError === 'INVALID_TOKEN'
              ? 'This reset link has already been used or has expired.'
              : 'No reset token was found in the link.'}
          </p>
          {searchError && (
            <p className='text-xs text-[hsl(var(--muted-foreground))]'>
              Error code: {searchError}
            </p>
          )}
          <Link
            to='/forgot-password'
            className='mt-1 inline-flex w-full items-center justify-center rounded-md bg-[hsl(var(--foreground))] px-4 py-2 text-sm font-medium text-[hsl(var(--background))] transition-opacity hover:opacity-80'
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleResetPassword)} className='space-y-4' noValidate>
          <div className='space-y-2'>
            <Label htmlFor='new-password'>New Password</Label>
            <Input {...register('password')} id='new-password' type='password' placeholder='Enter new password' />
            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirm Password</Label>
            <Input
              {...register('confirmPassword')}
              id='confirm-password'
              type='password'
              placeholder='Confirm new password'
            />
            {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
          </div>

          <SubmitButton isLoading={isSubmitting} loadingText='Resetting...' className='w-full'>
            Reset Password
          </SubmitButton>
          {errMsg && <p className='text-red-500'>{errMsg}</p>}
        </form>
      )}
    </AuthLayout>
  )
}
