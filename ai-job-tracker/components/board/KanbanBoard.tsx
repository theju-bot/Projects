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
  const [isMoving, setIsMoving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const currentJobs = localJobs.length ? localJobs : jobs

  const filteredJobs = currentJobs.filter(
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
    if (isMoving) return
    const job = currentJobs.find((j) => j._id === event.active.id)
    if (job) setActiveJob(job)
  }

  function onDragOver(event: DragOverEvent) {
    if (isMoving) return
    const { active, over } = event
    if (!over) return

    const activeJobId = active.id as string
    const overId = over.id as string

    const draggedJob = currentJobs.find((j) => j._id === activeJobId)
    if (!draggedJob) return

    const overJob = currentJobs.find((j) => j._id === overId)
    const overColumn = columns.find((c) => c._id === overId)

    const targetColumnId = overJob ? overJob.columnId : overColumn?._id
    if (!targetColumnId) return

    if (draggedJob.columnId !== targetColumnId) {
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

    if (isMoving || !over) {
      setLocalJobs([])
      return
    }

    const activeJobId = active.id as string
    const overId = over.id as string

    if (activeJobId === overId) {
      setLocalJobs([])
      return
    }

    const draggedJob = currentJobs.find((j) => j._id === activeJobId)
    if (!draggedJob) return

    const overJob = currentJobs.find((j) => j._id === overId)
    const overColumn = columns.find((c) => c._id === overId)

    const targetColumnId = overJob ? overJob.columnId : overColumn?._id
    if (!targetColumnId) return

    const originalJob = jobs.find((j) => j._id === activeJobId)
    const isSameColumn = originalJob
      ? originalJob.columnId === targetColumnId
      : draggedJob.columnId === targetColumnId

    let newOrder: number
    if (isSameColumn) {
      const allJobsInColumn = currentJobs
        .filter((j) => j.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order)

      if (overJob) {
        const overIndex = allJobsInColumn.findIndex((j) => j._id === overId)
        newOrder = overIndex === -1 ? allJobsInColumn.length - 1 : overIndex
      } else {
        newOrder = allJobsInColumn.length - 1
      }
    } else {
      const jobsInTarget = currentJobs
        .filter((j) => j.columnId === targetColumnId && j._id !== activeJobId)
        .sort((a, b) => a.order - b.order)

      if (overJob) {
        const overIndex = jobsInTarget.findIndex((j) => j._id === overId)
        newOrder = overIndex === -1 ? jobsInTarget.length : overIndex
      } else {
        newOrder = jobsInTarget.length
      }
    }

    setIsMoving(true)
    moveJob(
      { id: activeJobId, input: { columnId: targetColumnId, order: newOrder } },
      {
        onSettled: () => {
          setLocalJobs([])
          setIsMoving(false)
        },
      },
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
      <div
        className={`flex gap-4 h-full overflow-x-auto pb-4 transition-opacity ${isMoving ? 'pointer-events-none cursor-not-allowed opacity-70' : ''}`}
      >
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
