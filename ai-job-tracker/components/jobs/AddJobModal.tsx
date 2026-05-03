'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeAddJobModal,
  selectIsAddJobModalOpen,
} from '@/store/slices/uiSlice'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { JobForm } from './JobForm'

export function AddJobModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsAddJobModalOpen)

  function handleClose() {
    dispatch(closeAddJobModal())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
        </DialogHeader>
        <JobForm onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
