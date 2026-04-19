'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function Navbar() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    if (!confirm('Are you sure you want to logout?')) return

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
        })

        if (res.ok) {
          router.push('/auth/signin')
          router.refresh()
        } else {
          alert('Logout failed. Please try again.')
        }
      } catch {
        alert('Network error. Please try again.')
      }
    })
  }

  return (
    <nav className='flex items-center gap-4'>
      <Button
        variant='ghost'
        size='sm'
        onClick={handleLogout}
        disabled={isPending}
        className='flex items-center gap-2'
      >
        <LogOut className='h-4 w-4' />
        {isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </nav>
  )
}
