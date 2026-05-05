'use client'

import { Sparkles } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { openAIDialog } from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  jobId: string
}

export function AiActionButton({ jobId }: Props) {
  const dispatch = useAppDispatch()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 shrink-0'
          onClick={(e) => {
            e.stopPropagation()
            dispatch(openAIDialog(jobId))
          }}
        >
          <Sparkles size={12} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>AI Actions</TooltipContent>
    </Tooltip>
  )
}
