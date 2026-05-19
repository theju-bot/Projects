'use client'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/shared/ModeToggle'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSearchQuery } from '@/store/slices/uiSlice'
import { selectSearchQuery } from '@/store/slices/uiSlice'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <header className='flex h-16 items-center border-b bg-background px-4 gap-4 sticky top-0 z-10'>
      {isMobile && <SidebarTrigger />}
      {pathname === '/dashboard' && (
        <div className='relative ml-auto max-w-md'>
          <Search
            size={14}
            className='absolute left-3 top-1/2 -translate-y-1/2  text-muted-foreground '
          />
          <Input
            placeholder='Search jobs...'
            className='pl-8 h-8'
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      )}
      <div className='ml-auto'>
        <ModeToggle />
      </div>
    </header>
  )
}
