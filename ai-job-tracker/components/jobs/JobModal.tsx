'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeAddJobModal,
  closeEditJobModal,
  selectIsAddJobModalOpen,
  selectIsEditJobModalOpen,
  selectSelectedJobId,
} from '@/store/slices/uiSlice'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { JobForm } from './JobForm'

export function JobModal() {
  const dispatch = useAppDispatch()
  const isAddOpen = useAppSelector(selectIsAddJobModalOpen)
  const isEditOpen = useAppSelector(selectIsEditJobModalOpen)
  const jobId = useAppSelector(selectSelectedJobId)
  const isOpen = isAddOpen || isEditOpen
  const isEditing = isEditOpen

  function handleClose() {
    dispatch(isEditing ? closeEditJobModal() : closeAddJobModal())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job' : 'Add Job'}</DialogTitle>
        </DialogHeader>
        {isEditing && jobId ? (
          <JobForm jobId={jobId} onSuccess={handleClose} />
        ) : (
          <JobForm onSuccess={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
