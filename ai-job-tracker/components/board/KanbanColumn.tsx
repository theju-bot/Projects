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

type Props = {
    column: Column
    jobs: Job[]
}

export function KanbanColumn({column, jobs}: Props){
}