'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useColumns } from '@/hooks/useColumns'
import { useJobs, useMoveJob } from '@/hooks/useJobs'
import { useAppSelector } from '@/store/hooks'
import { selectSearchQuery } from '@/store/slices/uiSlice'
import { KanbanColumn } from '@/components/board/KanbanColumn'
import { JobCard } from '@/components/board/JobCard'
import { AddColumnButton } from '@/components/board/AddColumnButton'
import type { Job } from '@/types/job.types'

export function KanbanBoard() {
  const searchQuery = useAppSelector(selectSearchQuery)

  const { data: columns = [], isLoading: columnsLoading } = useColumns()
  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const { mutate: moveJob } = useMoveJob()

  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [localJobs, setLocalJobs] = useState<Job[]>(jobs)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const filteredJobs = (localJobs.length ? localJobs : jobs).filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function getJobByColumn(columnId: string) {
    return filteredJobs
      .filter((job) => job.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  function onDragStart(event: DragStartEvent) {
    const job = jobs.find((j) => j._id === event.active.id)
    if (job) setActiveJob(job)
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeJobId = active.id as string
    const overId = over.id as string

    const activeJob = jobs.find((j) => j._id === activeJobId)
    if (!activeJob) return

    const overJob = jobs.find((j) => j._id === overId)
    const overColumn = columns.find((c) => c._id === overId)

    const targetColumnId = overJob ? overJob.columnId : overColumn?._id
    if (!targetColumnId) return

    if (activeJob.columnId !== targetColumnId) {
      setLocalJobs((prev) => {
        const updated = prev.length ? [...prev] : [...jobs]
        return updated.map((j) =>
          j._id === activeJobId ? { ...j, columnId: targetColumnId } : j,
        )
      })
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveJob(null)

    if (!over) {
      setLocalJobs([])
      return
    }

    const activeJobId = active.id as string
    const overId = over.id as string

    const activeJob = jobs.find((j) => j._id === activeJobId)
    if (!activeJob) return

    const overJob = jobs.find((j) => j._id === overId)
    const overColumn = columns.find((c) => c._id === overId)

    const targetColumnId = overJob ? overJob.columnId : overColumn?._id
    if (!targetColumnId) return

    const jobsInTarget = jobs
      .filter((j) => j.columnId === targetColumnId && j._id !== activeJobId)
      .sort((a, b) => a.order - b.order)

    const overIndex = overJob
      ? jobsInTarget.findIndex((j) => j._id === overId)
      : jobsInTarget.length

    const newOrder = overIndex

    moveJob(
      { id: activeJobId, input: { columnId: targetColumnId, order: newOrder } },
      { onSettled: () => setLocalJobs([]) },
    )
  }

  if (columnsLoading || jobsLoading) {
    return <div className='text-muted-foreground text-sm'>Loading Board...</div>
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className='flex gap-4 h-full overflow-x-auto pb-4'>
        <SortableContext
          items={columns.map((c) => c._id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column._id}
              column={column}
              jobs={getJobByColumn(column._id)}
            />
          ))}
        </SortableContext>
        <AddColumnButton />
      </div>
      <DragOverlay>
        {activeJob && <JobCard job={activeJob} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}
