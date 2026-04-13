'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      router.push('/dashboard/workout-plans')
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-4xl'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='email'>Email</Label>
              <Input
                name='email'
                id='email'
                type='email'
                required
                disabled={isPending}
                placeholder='email@example.com'
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='password'>Password</Label>
              <Input
                name='password'
                id='password'
                type='password'
                required
                disabled={isPending}
                placeholder='••••••••'
              />
            </div>

            {error && (
              <p className='text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md'>
                {error}
              </p>
            )}

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? 'Signing in..' : 'Sign in'}
            </Button>
          </form>

          <p className='text-sm text-muted-foreground text-center mt-6'>
            Don&apos;t have an account?{' '}
            <a
              href='/auth/register'
              className='text-foreground font-medium hover:underline'
            >
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
