'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, MapPin } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { openEditJobModal, openAIDialog } from '@/store/slices/uiSlice'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Job } from '@/types/job.types'
import { cn } from '@/lib/utils'
import { AiActionButton } from '@/components/ai/AiActionButton'

type Props = {
  job: Job
  isDragging?: boolean
}

export function JobCard({ job, isDragging = false }: Props) {
  const dispatch = useAppDispatch()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: job._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab active:cursor-grabbing select-none',
        (isDragging || isSortableDragging) && 'opacity-50',
      )}
    >
      <Card>
        <CardContent className='p-3 space-y-2'>
          <div className='flex items-start justify-between gap-2'>
            <div
              className='flex-1 cursor-pointer'
              onClick={() => dispatch(openEditJobModal(job._id))}
            >
              <p className='text-sm font-medium leading-tight'>{job.title}</p>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 shrink-0'
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(openAIDialog(job._id))
                }}
              >
                <AiActionButton jobId={job._id} />
              </Button>
            </div>

            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Building2 size={11} />
              <span className='truncate'></span>
            </div>
          </div>

          {job.location && (
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <MapPin size={11} />
              <span className='truncate'>{job.location}</span>
            </div>
          )}

          {job.salary && (
            <Badge variant='secondary' className='text-xs'>
              {job.salary}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
