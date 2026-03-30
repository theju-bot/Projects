'use client'
import { authClient } from '@/lib/auth-client'
import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignInPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSignIn() {
    setError('')
    startTransition(async () => {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
      if (result?.error) {
        setError(result.error.message || 'Something went wrong')
      }
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-3xl'>Job Tracker</CardTitle>
          <CardDescription>
            Track applications. Unlock AI features anytime with your own API
            key.
          </CardDescription>
        </CardHeader>
      
        <CardContent className='space-y-4'>
        {error && (
          <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2'>
            {error}
          </p>
        )}

        <Button
          onClick={handleSignIn}
          disabled={isPending}
          variant={'outline'}
          className='w-full rounded-xl py-3 h-auto hover:cursor-pointer'
        >
          {isPending ? (
            <>
              <svg
                className='animate-spin h-4 w-4 text-muted-foreground'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                />
              </svg>
              Redirecting...
            </>
          ) : (
            <>
              <svg
                viewBox='0 0 24 24'
                className='h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
              >
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
              Sign in with Google
            </>
          )}
        </Button>
        </CardContent>
      </Card>
    </div>
  )
}
