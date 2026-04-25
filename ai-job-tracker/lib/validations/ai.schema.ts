import { z } from 'zod'

export const aiFeatureSchema = z.enum([
  'cover-letter',
  'gap-analysis',
  'cold-email',
  'follow-up',
  'interview-prep',
  'rejection-analysis',
])

export const aiRequestSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  feature: aiFeatureSchema,
})
