'use client'

import { Plus } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { openAddJobModal } from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/button'

export function AddJobButton({ columnId }: { columnId: string }) {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant='ghost'
      size='sm'
      className='w-full justify-start gap-2 text-muted-foreground'
      onClick={() => dispatch(openAddJobModal())}
    >
      <Plus size={14} />
      Add Job
    </Button>
  )
}
