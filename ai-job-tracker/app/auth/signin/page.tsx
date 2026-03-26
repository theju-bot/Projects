'use client'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='p-8 border border-border bg-card rounded-2xl w-full max-w-sm space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Job Tracker</h1>
          <p className='text-sm text-muted-foreground'>
            Track applications. Unlock AI features anytime with your own API key.
          </p>
        </div>

        <button
          onClick={() =>
            authClient.signIn.social({
              provider: 'google',
              callbackURL: '/dashboard',
            })
          }
          className='w-full border border-input bg-background hover:bg-secondary hover:text-foreground active:bg-secondary/80 transition-colors rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-center gap-3'
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}