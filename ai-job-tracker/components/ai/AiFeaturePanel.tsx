'use client'

import { useState } from 'react'
import { useAiFeature } from '@/hooks/useAi'
import { useJob } from '@/hooks/useJobs'
import { useColumns } from '@/hooks/useColumns'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { AiFeature } from '@/types/ai.types'

type AiAction = {
  id: AiFeature
  label: string
}

const COLUMN_FEATURES: Record<string, AiAction[]> = {
  Saved: [{ id: 'gap-analysis', label: 'Analyze Fit' }],
  Applying: [
    { id: 'cover-letter', label: 'Cover Letter' },
    { id: 'cold-email', label: 'Cold Email' },
  ],
  Applied: [
    { id: 'cover-letter', label: 'Cover Letter' },
    { id: 'follow-up', label: 'Follow Up Email' },
  ],
  Interview: [{ id: 'interview-prep', label: 'Interview Prep' }],
  Offer: [{ id: 'cover-letter', label: 'Cover Letter' }],
  Rejected: [{ id: 'rejection-analysis', label: 'Rejection Analysis' }],
}

const DEFAULT_FEATURES: AiAction[] = [
  { id: 'cover-letter', label: 'Cover Letter' },
  { id: 'gap-analysis', label: 'Analyze Fit' },
  { id: 'cold-email', label: 'Cold Email' },
  { id: 'follow-up', label: 'Follow-up Email' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'rejection-analysis', label: 'Rejection Analysis' },
]

type Props = {
  jobId: string
  onResult: (feature: string, content: string) => void
}

export function AiFeaturePanel({ jobId, onResult }: Props) {
  const { data: job } = useJob(jobId)
  const { data: columns = [] } = useColumns()
  const [activeFeature, setActiveFeature] = useState<AiFeature | null>(null)

  const { mutate: runFeature } = useAiFeature(activeFeature ?? 'cover-letter')

  const column = columns.find((c) => c._id === job?.columnId)
  const features = column
    ? (COLUMN_FEATURES[column.name] ?? DEFAULT_FEATURES)
    : DEFAULT_FEATURES

  function handleRun(action: AiAction) {
    setActiveFeature(action.id)
    runFeature(jobId, {
      onSuccess: (content) => {
        onResult(action.label, content)
        setActiveFeature(null)
      },
      onError: () => setActiveFeature(null),
    })
  }

  if (!job) {
    return <p className='text-sm text-muted-foreground'>Loading...</p>
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-muted-foreground mb-1'>
        AI Actions for&nbsp;{' '}
        <span className='font-medium text-foreground'>{job.title}</span>
        <span className='font-medium text-foreground'>{job.company}</span>
      </p>

      {features.map((action) => (
        <Button
          key={action.id}
          variant='outline'
          className='justify-start'
          disabled={activeFeature !== null}
          onClick={() => handleRun(action)}
        >
          {activeFeature === action.id && (
            <Loader2 size={14} className='animate-spin mr-2' />
          )}
          {action.label}
        </Button>
      ))}
    </div>
  )
}
