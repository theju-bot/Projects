'use client'

import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Navbar() {
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/auth/logout'
    }
  }

  return (
    <nav className='flex items-center gap-4'>
      <Button
        variant='ghost'
        size='sm'
        onClick={logoutAction}
        className='flex items-center gap-2'
      >
        <LogOut className='h-4 w-4' />
        Logout
      </Button>
    </nav>
  )
}
