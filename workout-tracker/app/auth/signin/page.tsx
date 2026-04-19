'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackurl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message ?? 'Signin Failed')
          return
        }

        router.push(callbackurl)
      } catch (err) {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-3xl'>Sign In</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4 pb-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
                required
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  autoComplete='current-password'
                  required
                  className='pr-10'
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

            {error && (
              <Alert variant={'destructive'}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className='flex flex-col gap-3'>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending && <Loader2 size={16} />} Sign In
            </Button>
            <p className='text-sm text-muted-foreground'>
              No account?&nbsp;{' '}
              <Link
                href='/auth/register'
                className='text-foreground underline underline-offset-4 hover:opacity-80'
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
