'use client'

import { useColumns } from '@/hooks/useColumns'
import { Badge } from '@/components/ui/badge'

type Props = {
  columnId: string
}

export function JobStatusBadge({ columnId }: Props) {
  const { data: columns = [] } = useColumns()
  const column = columns.find((c) => c._id === columnId)

  if (!column) return null

  return (
    <Badge
      variant='outline'
      className='gap-2'
      style={{ borderColor: column.color }}
    >
      <div
        className='w-2 h-2 rounded-full'
        style={{ backgroundColor: column.color }}
      />
      {column.name}
    </Badge>
  )
}
