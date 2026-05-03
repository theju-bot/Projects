'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeEditJobModal,
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

export function EditJobModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsEditJobModalOpen)
  const jobId = useAppSelector(selectSelectedJobId)

  function handleClose() {
    dispatch(closeEditJobModal())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        {jobId && <JobForm jobId={jobId} onSuccess={handleClose} />}
      </DialogContent>
    </Dialog>
  )
}
