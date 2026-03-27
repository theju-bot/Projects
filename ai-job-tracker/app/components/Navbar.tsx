'use client'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/auth/signin'),
      },
    })
  }

  return (
    <header className='flex items-center justify-between px-6 py-3 border-b'>
      <span className='text-sm font-medium'>AI Job Tracker</span>
      <button
        onClick={handleSignOut}
        className='text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
      >
        Sign out
      </button>
    </header>
  )
}
