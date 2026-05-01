'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Pencil, Trash2 } from 'lucide-react'
import { useUpdateColumn, useDeleteColumn } from '@/hooks/useColumns'
import type { Column } from '@/types/column.types'
import type { Job } from '@/types/job.types'
import { JobCard } from './JobCard'
import { AddJobButton } from './AddJobButton'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'

type Props = {
  column: Column
  jobs: Job[]
}

export function KanbanColumn({ column, jobs }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(column.name)

  const { mutate: updateColumn } = useUpdateColumn()
  const { mutate: deleteColumn } = useDeleteColumn()

  const { setNodeRef } = useDroppable({ id: column._id })

  function handleRename() {
    if (name.trim() && name !== column.name) {
      updateColumn({ id: column._id, input: { name } })
    }
    setIsEditing(false)
  }

  return (
    <div className='flex flex-col w-80 shrink-0 rounded-lg bg-muted/50 p-3 gap-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 flex-1'>
          <div
            className='w-3 h-3 rounded-full shrink-0'
            style={{ backgroundColor: column.color }}
          />
          {isEditing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className='text-sm font-medium bg-transparent border-b border-border outline-none flex-1'
            />
          ) : (
            <span className='text-sm font-medium truncate'>{column.name}</span>
          )}
          <span className='text-xs text-muted-foreground shrink-0'>
            ({jobs.length})
          </span>
        </div>

        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6'
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-destructive hover:text-destructive'
            onClick={() => deleteColumn(column._id)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div ref={setNodeRef} className='flex flex-col gap-2 min-h-20 flex-1'>
        <SortableContext
          items={jobs.map((j) => j._id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </SortableContext>
      </div>
      <AddJobButton columnId={column._id} />
    </div>
  )
}
