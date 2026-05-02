'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateJob, useUpdateJob, useJob } from '@/hooks/useJobs'
import { useColumns } from '@/hooks/useColumns'
import { createJobSchema } from '@/lib/validations/job.schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CreateJobInput } from '@/types/job.types'

type Props = {
  jobId?: string
  onSuccess: () => void
}

export function JobForm({ jobId, onSuccess }: Props) {
  const isEditing = !!jobId

  const { data: job } = useJob(jobId || '')
  const { data: columns = [] } = useColumns()
  const { mutate: createJob, isPending: isCreating } = useCreateJob()
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      jobUrl: '',
      salary: '',
      description: '',
      notes: '',
      columnId: columns[0]?._id || '',
    },
  })

  const selectColumn = watch('columnId')

  useEffect(() => {
    if (job && columns.length > 0) {
      setValue('title', job.title)
      setValue('company', job.company)
      setValue('location', job.location)
      setValue('jobUrl', job.jobUrl)
      setValue('salary', job.salary)
      setValue('description', job.description)
      setValue('notes', job.notes)
      setValue('columnId', job.columnId)
    }
  }, [job, isEditing, setValue])

  function onSubmit(data: CreateJobInput) {
    if (isEditing && jobId) {
      updateJob({ id: jobId, input: data })
    } else {
      createJob(data, { onSuccess })
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel>Job Title</FieldLabel>
        <Input placeholder='Frontend Developer' {...register('title')} />
        <FieldError errors={[{ message: errors.title?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Company</FieldLabel>
        <Input placeholder='Acme Inc.' {...register('company')} />
        <FieldError errors={[{ message: errors.company?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Location</FieldLabel>
        <Input placeholder='Remote' {...register('location')} />
        <FieldError errors={[{ message: errors.location?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Job URL</FieldLabel>
        <Input placeholder='https://...' {...register('jobUrl')} />
        <FieldError errors={[{ message: errors.jobUrl?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Salary</FieldLabel>
        <Input placeholder='$80k - $120k.' {...register('salary')} />
        <FieldError errors={[{ message: errors.salary?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Column</FieldLabel>
        <Select
          value={selectColumn}
          onValueChange={(value) => setValue('columnId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select column' />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col._id} value={col._id}>
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[{ message: errors.columnId?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          placeholder='Paste job description here...'
          rows={6}
          {...register('description')}
        />
        <FieldError errors={[{ message: errors.description?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea
          placeholder='Personal notes...'
          rows={3}
          {...register('notes')}
        />
        <FieldError errors={[{ message: errors.notes?.message }]} />
      </Field>

      <div className='flex gap-2 justify-end'>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Saving...' : isEditing ? 'Update Job' : 'Add Job'}
        </Button>
      </div>
    </form>
  )
}
