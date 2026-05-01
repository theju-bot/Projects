import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logClientError } from '@/lib/logClient'
import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  MoveJobInput,
} from '@/types/job.types'

const JOBS_KEY = ['jobs']

async function fetchJobs(): Promise<Job[]> {
  const res = await fetch('/api/jobs')
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}

async function fetchJob(id: string): Promise<Job> {
  const res = await fetch(`/api/jobs/${id}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}

async function createJob(input: CreateJobInput): Promise<Job> {
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}

async function updateJob(id: string, input: UpdateJobInput): Promise<Job> {
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}

async function moveJob(id: string, input: MoveJobInput): Promise<Job> {
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}

async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
}

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: JOBS_KEY,
    queryFn: fetchJobs,
  })
}

export function useJob(id: string) {
  return useQuery<Job>({
    queryKey: [...JOBS_KEY, id],
    queryFn: () => fetchJob(id),
    enabled: !!id,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY })
      toast.success('Job added')
    },
    onError: (err: Error) => {
      logClientError('useCreateJob', err)
      toast.error(err.message ?? 'Failed to add job')
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJobInput }) =>
      updateJob(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY })
      toast.success('Job updated')
    },
    onError: (err: Error) => {
      logClientError('useUpdateJob', err)
      toast.error(err.message ?? 'Failed to update job')
    },
  })
}

export function useMoveJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MoveJobInput }) =>
      moveJob(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY })
    },
    onError: (err: Error) => {
      logClientError('useMoveJob', err)
      toast.error(err.message ?? 'Failed to move job')
      queryClient.invalidateQueries({ queryKey: JOBS_KEY })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY })
      toast.success('Job deleted')
    },
    onError: (err: Error) => {
      logClientError('useDeleteJob', err)
      toast.error(err.message ?? 'Failed to delete job')
    },
  })
}
