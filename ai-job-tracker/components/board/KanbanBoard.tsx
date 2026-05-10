'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [localJobs, setLocalJobs] = useState<Job[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalJobs(jobs)
    }
  }, [jobs])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const filteredJobs = localJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function getJobsByColumn(columnId: string) {
    return filteredJobs
      .filter((job) => job.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  function resolveTargetColumnId(overId: string): string | undefined {
    const overJob = localJobs.find((j) => j._id === overId)
    const overColumn = columns.find((c) => c._id === overId)
    return overJob ? overJob.columnId : overColumn?._id
  }

  function onDragStart(event: DragStartEvent) {
    if (isMoving) return
    isDraggingRef.current = true
    const job = localJobs.find((j) => j._id === event.active.id)
    if (job) setActiveJob(job)
  }

  function onDragOver(event: DragOverEvent) {
    if (isMoving) return
    const { active, over } = event
    if (!over) return

    const activeJobId = active.id as string
    const targetColumnId = resolveTargetColumnId(over.id as string)
    if (!targetColumnId) return

    const draggedJob = localJobs.find((j) => j._id === activeJobId)
    if (!draggedJob || draggedJob.columnId === targetColumnId) return

    setLocalJobs((prev) =>
      prev.map((j) =>
        j._id === activeJobId ? { ...j, columnId: targetColumnId } : j,
      ),
    )
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveJob(null)

    if (isMoving || !over) {
      setLocalJobs(jobs)
      return
    }

    const activeJobId = active.id as string
    const overId = over.id as string

    const draggedJob = localJobs.find((j) => j._id === activeJobId)
    if (!draggedJob) return

    const targetColumnId = resolveTargetColumnId(overId)
    if (!targetColumnId) return

    const originalJob = jobs.find((j) => j._id === activeJobId)
    const isSameColumn = (originalJob ?? draggedJob).columnId === targetColumnId

    if (activeJobId === overId && isSameColumn) {
      setLocalJobs(jobs)
      return
    }

    const overJob = localJobs.find((j) => j._id === overId)

    let newOrder: number

    if (isSameColumn) {
      const jobsInColumn = localJobs
        .filter((j) => j.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order)

      const overIndex = overJob
        ? jobsInColumn.findIndex((j) => j._id === overId)
        : jobsInColumn.length - 1

      newOrder = overIndex === -1 ? jobsInColumn.length - 1 : overIndex
    } else {
      const jobsInTarget = localJobs
        .filter((j) => j.columnId === targetColumnId && j._id !== activeJobId)
        .sort((a, b) => a.order - b.order)

      const overIndex = overJob
        ? jobsInTarget.findIndex((j) => j._id === overId)
        : jobsInTarget.length

      newOrder = overIndex === -1 ? jobsInTarget.length : overIndex
    }

    setLocalJobs((prev) => {
      const updated = prev.map((j) => ({ ...j }))
      const activeIndex = updated.findIndex((j) => j._id === activeJobId)
      if (activeIndex === -1) return updated

      const [moved] = updated.splice(activeIndex, 1)
      moved.columnId = targetColumnId

      const jobsInTarget = updated
        .filter((j) => j.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order)

      jobsInTarget.splice(newOrder, 0, moved)
      jobsInTarget.forEach((job, index) => {
        job.order = index
      })

      const otherJobs = updated.filter((j) => j.columnId !== targetColumnId)
      return [...otherJobs, ...jobsInTarget]
    })

    setIsMoving(true)
    moveJob(
      { id: activeJobId, input: { columnId: targetColumnId, order: newOrder } },
      {
        onSettled: () => {
          isDraggingRef.current = false
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
        className={`flex gap-4 h-full overflow-x-auto pb-4 transition-opacity ${
          isMoving ? 'pointer-events-none cursor-not-allowed opacity-70' : ''
        }`}
      >
        <SortableContext
          items={columns.map((c) => c._id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column._id}
              column={column}
              jobs={getJobsByColumn(column._id)}
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
