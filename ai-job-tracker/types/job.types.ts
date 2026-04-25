import { z } from 'zod'
import {
  createJobSchema,
  updateJobSchema,
  moveJobSchema,
} from '@/lib/validations/job.schema'
import type { IJob } from '@/models/Job.model'

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type MoveJobInput = z.infer<typeof moveJobSchema>

export type Job = Omit<IJob, '_id' | 'userId' | 'columnId'> & {
  _id: string
  userId: string
  columnId: string
}
