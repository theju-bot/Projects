'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth/auth-client'
import { registerSchema } from '@/lib/validations/user.schema'
import type { RegisterInput } from '@/types/user.types'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message ?? 'Registration failed')
        return
      }

      router.push('/dashboard')
    })
  }

  function handleGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({ provider: 'google' })
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>
            Start tracking your job applications
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                type='text'
                placeholder='Your Name'
                {...register('name')}
              />
              <FieldError errors={[{ message: errors.name?.message }]} />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type='email'
                placeholder='you@example.com'
                {...register('email')}
              />
              <FieldError errors={[{ message: errors.email?.message }]} />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='pr-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-3 cursor-pointer text-muted-foreground hover:text-foreground'
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError errors={[{ message: errors.password?.message }]} />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='pr-10'
                  {...register('confirmPassword')}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-3 cursor-pointer text-muted-foreground hover:text-foreground'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <FieldError
                errors={[{ message: errors.confirmPassword?.message }]}
              />
            </Field>

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending && <Loader2 size={16} className='animate-spin' />}
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <FieldSeparator className='my-2'>or</FieldSeparator>

          <Button
            variant='outline'
            className='w-full'
            disabled={isPending}
            onClick={handleGoogle}
          >
            <svg viewBox='0 0 24 24' className='mr-2 h-4 w-4'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Continue with Google
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            Already have an account?&nbsp;
            <Link href='/login' className='underline'>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
