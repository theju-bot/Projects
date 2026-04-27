'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/shared/ModeToggle'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSearchQuery } from '@/store/slices/uiSlice'
import { selectSearchQuery } from '@/store/slices/uiSlice'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function Navbar() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)

  return(<header className='flex h-16 items-center'></header>)
}
