'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCreateColumn } from '@/hooks/useColumns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AddColumnButton() {
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const { mutate: createColumn, isPending } = useCreateColumn()

  function handleAdd() {
    if (!name.trim()) return
    createColumn(
      { name },
      {
        onSuccess: () => {
          setName('')
          setIsAdding(false)
        },
      },
    )
  }

  if (isAdding) {
    return (
      <div className='flex flex-col w-80 shrink-0 rounded-lg bg-muted/50 p-3 gap-2'>
        <Input
          autoFocus
          placeholder='Column name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd
            if (e.key === 'Escape') setIsAdding(false)
          }}
        />
        <div className='flex gap-2'>
          <Button size='sm' onClick={handleAdd} disabled={isPending}>
            Add
          </Button>
          <Button size='sm' variant='ghost' onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className='flex w-80 shrink-0 items-center gap-2 rounded-lg border-2 border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors'
    >
      <Plus size={16} />
      Add column
    </button>
  )
}
