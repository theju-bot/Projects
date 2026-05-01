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

export function KanbanBoard() {
  return <div className='h-full w-full'></div>
}
