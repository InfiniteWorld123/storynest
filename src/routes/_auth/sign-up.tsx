import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { AuthLayout } from '../../components/auth/auth-layout'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { SubmitButton } from '../../components/ui/submit-button'
import { useForm } from "react-hook-form"
import { SignUpSchema, type SignUpType } from '#/validation/auth.schema'
import { signUp } from '#/lib/auth-client'
import { toast } from 'sonner'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useState } from 'react'

const PENDING_EMAIL_KEY = 'storynest.pendingEmail'

const cachePendingEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PENDING_EMAIL_KEY, email)
  }
}

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<SignUpType>({ resolver: standardSchemaResolver(SignUpSchema) })

  const handleSignUp = async (formData: SignUpType) => {
    await signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      callbackURL: "/app/overview",
      fetchOptions: {
        onError: (ctx) => {
          const errorMsg = ctx.error.statusText
          setErrMsg(errorMsg)
          toast(errorMsg)
        },
        onSuccess: () => {
          toast("email is sign up successfully")
          cachePendingEmail(formData.email)
          navigate({ to: '/verify-email' })
        }
      }
    })
  }

  return (
    <AuthLayout
      title='Create your membership card'
      description='Open an account to save stories, notes, and chapter trails.'
      footer={
        <>
          Already have an account?{' '}
          <Link to='/sign-in' className='link-underline text-[hsl(var(--foreground))]'>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleSignUp)} className='space-y-4' noValidate>
        <div className='space-y-2'>
          <Label htmlFor='sign-up-name'>Name</Label>
          <Input {...register("name")} id='sign-up-name' placeholder='Mara Ellison' />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='sign-up-email'>Email</Label>
          <Input {...register("email")} id='sign-up-email' type='email' placeholder='mara@archive.com' />
          {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='sign-up-password'>Password</Label>
          <Input {...register("password")} id='sign-up-password' type='password' placeholder='Create a password' />
          {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='sign-up-confirm'>Confirm Password</Label>
          <Input {...register("confirmPassword")} id='sign-up-confirm' type='password' placeholder='Repeat password' />
          {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
        </div>

        <SubmitButton isLoading={isSubmitting} loadingText='Creating...' className='w-full'>
          Create Account
        </SubmitButton>
        <p className='text-xs text-[hsl(var(--muted-foreground))]'>
          Disabled state example. Enable once terms and validation logic are implemented.
        </p>
        {errMsg && <p className='text-red-500'>{errMsg}</p>}
      </form>
    </AuthLayout>
  )
}
