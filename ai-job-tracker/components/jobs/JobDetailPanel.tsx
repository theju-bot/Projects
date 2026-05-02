'use client'

import { useJob, useDeleteJob } from '@/hooks/useJobs'
import { useRouter } from 'next/navigation'
import {
  Building2,
  MapPin,
  ExternalLink,
  Calendar,
  Trash2,
  Pencil,
} from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { openEditJobModal } from '@/store/slices/uiSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { format } from 'date-fns'

type Props = {
  jobId: string
}

export function JobDetailPanel({ jobId }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: job, isLoading } = useJob(jobId)
  const { mutate: deleteJob } = useDeleteJob()

  if (isLoading) {
    return <div className='text-muted-foreground'>Loading...</div>
  }

  if (!job) {
    return <div className='text-muted-foreground'>Job not found</div>
  }

  function handleDelete() {
    if (confirm('Delete this job?')) {
      deleteJob(jobId, {
        onSuccess: () => router.push('dashboard'),
      })
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{job.title}</h1>
          <div className='flex items-center gap-2 mt-2 text-muted-foreground'>
            <Building2 size={16} />
            <span>{job.company}</span>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => dispatch(openEditJobModal(jobId))}
          >
            <Pencil size={16} />
          </Button>
          <Button variant='outline' size='icon' onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <JobStatusBadge columnId={job.columnId} />
        {job.salary && <Badge variant='secondary'>{job.salary}</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent className='space-y-3'>
          {job.location && (
            <div className='flex items-center gap-2'>
              <MapPin size={16} className='text-muted-foreground' />
              <span>{job.location}</span>
            </div>
          )}

          {job.jobUrl && (
            <div className='flex items-center gap-2'>
              <ExternalLink size={16} className='text-muted-foreground' />
              <a
                href={job.jobUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:underline'
              >
                {job.jobUrl}
              </a>
            </div>
          )}

          {job.createdAt && (
            <div className='flex items-center gap-2'>
              <Calendar size={16} className='text-muted-foreground' />
              <span>
                Applied on {format(new Date(job.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {job.description && (
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap text-sm'>{job.description}</p>
          </CardContent>
        </Card>
      )}

      {job.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap text-sm'>{job.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
