import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { AuthLayout } from '../../components/auth/auth-layout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { SubmitButton } from '../../components/ui/submit-button'
import type { SignInType } from '#/validation/auth.schema'
import { useForm } from 'react-hook-form'
import { signIn } from '#/lib/auth-client'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInType>()
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignIn = async (formData: SignInType) => {
    await signIn.email({
      email: formData.email,
      password: formData.password,
      fetchOptions: {
        onError: (ctx) => {
          const errorMsg = ctx.error.message;
          setErrMsg(errorMsg)
          toast(errorMsg)
        },
        onSuccess: () => {
          toast("email is sign in successfully");
          navigate({ to: '/app/overview' })
        }
      }
    })
  }

  return (
    <AuthLayout
      title='Welcome back to the archive'
      description='Continue your reading ledger and pick up where your last chapter ended.'
      footer={
        <>
          New to StoryNest?{' '}
          <Link to='/sign-up' className='link-underline text-[hsl(var(--foreground))]'>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleSignIn)} className='space-y-4' noValidate>
        <div className='space-y-2'>
          <Label htmlFor='sign-in-email'>Email</Label>
          <Input {...register("email")} id='sign-in-email' type='email' placeholder='you@archive.com' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='sign-in-password'>Password</Label>
          <Input {...register("password")}
            id='sign-in-password'
            type='password'
            placeholder='Enter your password'
            className='border-[hsl(var(--destructive))]/60 focus-visible:ring-[hsl(var(--destructive))]/70'
            aria-invalid='true'
          />
        </div>

        <div className='flex items-center justify-between gap-3'>
          <Link to='/forgot-password' className='link-underline text-sm text-[hsl(var(--muted-foreground))]'>
            Forgot password?
          </Link>
        </div>

        <SubmitButton isLoading={isSubmitting} loadingText='Signing in...' className='w-full'>
          Sign In
        </SubmitButton>
        <Button type='button' variant='outline' className='w-full'>
          <BookOpen className='h-4 w-4' /> Continue with Google
        </Button>
        {errMsg && <p className='text-red-500'>{errMsg}</p>}

      </form>
    </AuthLayout>
  )
}
