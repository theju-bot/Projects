'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message ?? 'Registration Failed')
          return
        }

        router.push('/dashboard')
      } catch (err) {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-3xl'>Create an Account</CardTitle>
          <CardDescription>
            Fill in your details to get started.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 pb-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                type='text'
                required
                disabled={isPending}
                placeholder='Your Name'
                autoComplete='name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                required
                disabled={isPending}
                placeholder='you@example.com'
                autoComplete='email'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  className='pr-10'
                  required
                  placeholder='••••••••'
                  autoComplete='new-password'
                  disabled={isPending}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  className='absolute inset-y-0 right-3  fles items-center text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50'
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  className='pr-10'
                  required
                  placeholder='••••••••'
                  autoComplete='new-password'
                  disabled={isPending}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className='absolute inset-y-0 right-3  fles items-center text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50'
                  aria-label={
                    showConfirmPassword ? 'Hide Password' : 'Show Password'
                  }
                >
                  {showConfirmPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant={'destructive'}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 size={16} className='animate-spin'/>}
              Create Account
            </Button>
            <p className='text-sm text-muted-foreground'>
              Already have an account?&nbsp;
              <Link
                href='/auth/signin'
                className='text-foreground underline underline-offset-4 hover:opacity-80'
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
